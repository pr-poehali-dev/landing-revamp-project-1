import json
import os
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    'Access-Control-Max-Age': '86400',
}


def check_auth(event):
    token = (event.get('headers') or {}).get('x-auth-token') or (event.get('headers') or {}).get('X-Auth-Token')
    return bool(token)


def handler(event: dict, context) -> dict:
    """Статистика дашборда: всего участников, активных, количество розыгрышей."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    if not check_auth(event):
        return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Unauthorized'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        with conn.cursor() as cur:
            cur.execute('SELECT COUNT(*) FROM participants')
            total_participants = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM participants WHERE status = 'active'")
            active_participants = cur.fetchone()[0]

            cur.execute('SELECT COUNT(*) FROM draws')
            total_draws = cur.fetchone()[0]

        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({
                'total_participants': total_participants,
                'active_participants': active_participants,
                'total_draws': total_draws,
            })
        }
    finally:
        conn.close()
