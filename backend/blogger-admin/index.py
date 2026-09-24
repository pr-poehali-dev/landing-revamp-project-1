import hashlib
import json
import os

import psycopg2

PASSWORD_HASH = 'bca4992dd406048e1667109bf48540d20925b17f96f4362015b0c1f0fa33789a'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Password',
    'Access-Control-Max-Age': '86400',
}


def check_password(value: str) -> bool:
    if not value:
        return False
    env_password = os.environ.get('BLOGGER_ADMIN_PASSWORD', '')
    if env_password:
        return value == env_password
    return hashlib.sha256(value.encode('utf-8')).hexdigest() == PASSWORD_HASH


def handler(event: dict, context) -> dict:
    """Закрытая админка: отдаёт список заявок блогеров по паролю.
    Args: event с httpMethod, headers (X-Admin-Password), queryStringParameters (action); context с request_id
    Returns: HTTP response со списком заявок или статусом проверки пароля
    """
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    headers = {**CORS, 'Content-Type': 'application/json'}

    raw_headers = event.get('headers') or {}
    password = ''
    for key, value in raw_headers.items():
        if key.lower() == 'x-admin-password':
            password = value or ''
            break

    if not password:
        try:
            body = json.loads(event.get('body') or '{}')
            password = (body.get('password') or '').strip()
        except json.JSONDecodeError:
            password = ''

    if not check_password(password):
        return {
            'statusCode': 401,
            'headers': headers,
            'body': json.dumps({'error': 'Неверный пароль'}),
        }

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    dsn = os.environ['DATABASE_URL']
    conn = psycopg2.connect(dsn)
    try:
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, name, social_network, social_link, followers_count, reach, phone, ip_address, created_at "
            f"FROM {schema}.blogger_applications ORDER BY created_at DESC LIMIT 500"
        )
        rows = cur.fetchall()
        cur.close()
    finally:
        conn.close()

    items = [
        {
            'id': r[0],
            'name': r[1],
            'socialNetwork': r[2],
            'socialLink': r[3],
            'followersCount': r[4],
            'reach': r[5],
            'phone': r[6],
            'ip': r[7],
            'createdAt': r[8].isoformat() if r[8] else '',
        }
        for r in rows
    ]

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'success': True, 'total': len(items), 'items': items}),
    }
