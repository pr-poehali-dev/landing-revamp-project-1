import json
import os
import re

import psycopg2


def handler(event: dict, context) -> dict:
    """Принимает заявки от блогеров на участие в мероприятии и сохраняет их в базу данных.
    Args: event с httpMethod, body (name, socialNetwork, socialLink, followersCount, phone); context с request_id
    Returns: HTTP response с результатом сохранения заявки
    """
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    try:
        body = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Invalid JSON'}),
        }

    name = (body.get('name') or '').strip()
    social_network = (body.get('socialNetwork') or '').strip()
    social_link = (body.get('socialLink') or '').strip()
    followers_count = (body.get('followersCount') or '').strip()
    phone = (body.get('phone') or '').strip()

    if not name or not social_network or not social_link or not followers_count or not phone:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Все поля обязательны для заполнения'}),
        }

    allowed_networks = {'Instagram', 'VK', 'Telegram', 'MAX'}
    if social_network not in allowed_networks:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Некорректная соцсеть'}),
        }

    phone_digits = re.sub(r'\D', '', phone)
    if len(phone_digits) < 10:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Некорректный номер телефона'}),
        }

    request_context = event.get('requestContext') or {}
    identity = request_context.get('identity') or {}
    ip_address = identity.get('sourceIp', '')

    dsn = os.environ['DATABASE_URL']
    conn = psycopg2.connect(dsn)
    try:
        cur = conn.cursor()
        name_esc = name.replace("'", "''")
        social_network_esc = social_network.replace("'", "''")
        social_link_esc = social_link.replace("'", "''")
        followers_count_esc = followers_count.replace("'", "''")
        phone_esc = phone.replace("'", "''")
        ip_esc = ip_address.replace("'", "''")
        cur.execute(
            f"INSERT INTO blogger_applications (name, social_network, social_link, followers_count, phone, ip_address) "
            f"VALUES ('{name_esc}', '{social_network_esc}', '{social_link_esc}', '{followers_count_esc}', '{phone_esc}', '{ip_esc}') "
            f"RETURNING id"
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
    finally:
        conn.close()

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'success': True, 'id': new_id}),
    }