import json
import os
import random
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    'Access-Control-Max-Age': '86400',
}


def check_auth(event):
    token = (event.get('headers') or {}).get('x-auth-token') or (event.get('headers') or {}).get('X-Auth-Token')
    return bool(token)


def handler(event: dict, context) -> dict:
    """Запуск розыгрыша и получение истории. Только для администратора."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    if not check_auth(event):
        return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Unauthorized'})}

    method = event.get('httpMethod', 'GET')

    if method == 'GET':
        return _get_history()
    elif method == 'POST':
        return _run_draw(event)
    return {'statusCode': 405, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Method not allowed'})}


def _get_history():
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        with conn.cursor() as cur:
            cur.execute('''
                SELECT d.id, d.title, d.prize_name, d.participants_count, d.started_at,
                       w.ticket_number, w.full_name_snapshot, w.phone_snapshot
                FROM draws d
                LEFT JOIN winners w ON w.draw_id = d.id
                ORDER BY d.started_at DESC
                LIMIT 50
            ''')
            rows = cur.fetchall()
            history = []
            for r in rows:
                history.append({
                    'draw_id': r[0],
                    'title': r[1],
                    'prize_name': r[2],
                    'participants_count': r[3],
                    'started_at': r[4].isoformat() if r[4] else None,
                    'winner_ticket': r[5],
                    'winner_name': r[6],
                    'winner_phone': r[7],
                })
        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({'history': history}, ensure_ascii=False)
        }
    finally:
        conn.close()


def _run_draw(event):
    try:
        body = json.loads(event.get('body') or '{}')
    except Exception:
        return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Некорректный запрос'})}

    title = (body.get('title') or '').strip()
    prize_name = (body.get('prize_name') or '').strip()

    if not title or not prize_name:
        return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Укажите название розыгрыша и приза'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute("SELECT id, full_name, phone_normalized, ticket_number FROM participants WHERE status = 'active'")
                participants = cur.fetchall()

                if not participants:
                    return {
                        'statusCode': 400,
                        'headers': CORS_HEADERS,
                        'body': json.dumps({'error': 'Нет участников для розыгрыша'})
                    }

                winner = random.choice(participants)
                w_id, w_name, w_phone, w_ticket = winner

                cur.execute('''
                    INSERT INTO draws (title, prize_name, participants_count, started_at, finished_at, created_by)
                    VALUES (%s, %s, %s, NOW(), NOW(), 'admin')
                    RETURNING id
                ''', (title, prize_name, len(participants)))
                draw_id = cur.fetchone()[0]

                cur.execute('''
                    INSERT INTO winners (draw_id, participant_id, ticket_number, full_name_snapshot, phone_snapshot)
                    VALUES (%s, %s, %s, %s, %s)
                ''', (draw_id, w_id, w_ticket, w_name, w_phone))

        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({
                'success': True,
                'draw_id': draw_id,
                'winner': {
                    'ticket_number': w_ticket,
                    'full_name': w_name,
                    'phone': w_phone,
                },
                'participants_count': len(participants),
            }, ensure_ascii=False)
        }
    except Exception as e:
        print(f'Draw error: {e}')
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,
            'body': json.dumps({'error': 'Ошибка при проведении розыгрыша'})
        }
    finally:
        conn.close()
