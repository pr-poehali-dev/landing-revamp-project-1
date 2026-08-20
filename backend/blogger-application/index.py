import json
import os
import re
import urllib.error
import urllib.request

import psycopg2

LEADS_API_URL = 'https://functions.poehali.dev/c39f9717-5033-4220-9c2d-6bd98967430c'


def handler(event: dict, context) -> dict:
    """Принимает заявки от блогеров на участие в мероприятии и сохраняет их в базу данных.
    Args: event с httpMethod, body (name, socialNetwork, socialLink, followersCount, reach, phone); context с request_id
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
    reach = (body.get('reach') or '').strip()
    phone = (body.get('phone') or '').strip()
    page = (body.get('page') or '').strip()
    ref = (body.get('ref') or '').strip()

    if not name or not social_network or not social_link or not followers_count or not reach or not phone:
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
        reach_esc = reach.replace("'", "''")
        phone_esc = phone.replace("'", "''")
        ip_esc = ip_address.replace("'", "''")
        cur.execute(
            f"INSERT INTO blogger_applications (name, social_network, social_link, followers_count, reach, phone, ip_address) "
            f"VALUES ('{name_esc}', '{social_network_esc}', '{social_link_esc}', '{followers_count_esc}', '{reach_esc}', '{phone_esc}', '{ip_esc}') "
            f"RETURNING id"
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
    finally:
        conn.close()

    message = (
        f"Соцсеть: {social_network}\n"
        f"Ссылка: {social_link}\n"
        f"Подписчики: {followers_count}\n"
        f"Охваты: {reach}"
    )
    leads_api_key = os.environ.get('LEADS_API_KEY', '')
    if leads_api_key:
        leads_payload = {
            'api_key': leads_api_key,
            'name': name,
            'contact': phone,
            'form': 'Заявка блогера',
            'message': message,
            'page': page,
            'ref': ref,
        }
        try:
            req = urllib.request.Request(
                LEADS_API_URL,
                data=json.dumps(leads_payload).encode('utf-8'),
                headers={'Content-Type': 'application/json'},
                method='POST',
            )
            urllib.request.urlopen(req, timeout=5)
        except (urllib.error.URLError, urllib.error.HTTPError):
            pass

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'success': True, 'id': new_id}),
    }