import json
import os
import psycopg2
import csv
import io

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
    """Список участников розыгрыша с поиском, фильтрацией и экспортом CSV. Только для администратора."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    if not check_auth(event):
        return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Unauthorized'})}

    params = event.get('queryStringParameters') or {}
    search = params.get('search', '').strip()
    status_filter = params.get('status', '').strip()
    export_csv = params.get('export') == 'csv'

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        with conn.cursor() as cur:
            where_parts = []
            args = []

            if search:
                where_parts.append('(full_name ILIKE %s OR phone_normalized ILIKE %s)')
                args += [f'%{search}%', f'%{search}%']

            if status_filter:
                where_parts.append('status = %s')
                args.append(status_filter)

            where_clause = ('WHERE ' + ' AND '.join(where_parts)) if where_parts else ''

            cur.execute(f'''
                SELECT ticket_number, full_name, phone_normalized, status, created_at, ip_address
                FROM participants
                {where_clause}
                ORDER BY ticket_number ASC
            ''', args)
            rows = cur.fetchall()
            columns = ['ticket_number', 'full_name', 'phone_normalized', 'status', 'created_at', 'ip_address']

            if export_csv:
                output = io.StringIO()
                writer = csv.writer(output)
                writer.writerow(['Номерок', 'Имя', 'Телефон', 'Статус', 'Дата регистрации', 'IP'])
                for r in rows:
                    writer.writerow([r[0], r[1], r[2], r[3], r[4].isoformat() if r[4] else '', r[5] or ''])
                csv_content = output.getvalue()
                return {
                    'statusCode': 200,
                    'headers': {**CORS_HEADERS, 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="participants.csv"'},
                    'body': csv_content
                }

            cur.execute('SELECT COUNT(*) FROM participants')
            total = cur.fetchone()[0]
            cur.execute("SELECT COUNT(*) FROM participants WHERE status = 'active'")
            active = cur.fetchone()[0]

            participants = []
            for r in rows:
                participants.append(dict(zip(columns, [
                    r[0], r[1], r[2], r[3],
                    r[4].isoformat() if r[4] else None,
                    r[5]
                ])))

        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({
                'participants': participants,
                'total': total,
                'active': active,
            }, ensure_ascii=False)
        }
    finally:
        conn.close()
