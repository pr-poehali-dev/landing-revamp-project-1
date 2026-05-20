import json
import os
import re
import psycopg2
from psycopg2 import errors

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
    'Access-Control-Max-Age': '86400',
}


def normalize_phone(raw: str):
    """Нормализация российского номера телефона в формат +7XXXXXXXXXX"""
    digits = re.sub(r'\D', '', raw)
    if len(digits) == 11 and digits[0] in ('7', '8'):
        return '+7' + digits[1:]
    if len(digits) == 10:
        return '+7' + digits
    return None


def handler(event: dict, context) -> dict:
    """Регистрация участника розыгрыша. Нормализует телефон, проверяет дубли, выдаёт уникальный номерок."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    try:
        body = json.loads(event.get('body') or '{}')
    except Exception:
        return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Некорректный запрос'})}

    full_name = (body.get('full_name') or '').strip()
    phone_raw = (body.get('phone') or '').strip()

    if not full_name or len(full_name) < 2 or len(full_name) > 100:
        return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Введите корректное имя (от 2 до 100 символов)'})}

    if not phone_raw:
        return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Введите номер телефона'})}

    phone_normalized = normalize_phone(phone_raw)
    if not phone_normalized:
        return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Введите корректный номер телефона'})}

    ip_address = (event.get('requestContext') or {}).get('identity', {}).get('sourceIp')
    user_agent = (event.get('headers') or {}).get('user-agent') or (event.get('headers') or {}).get('User-Agent')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute('''
                    SELECT ticket_number FROM participants WHERE phone_normalized = %s
                ''', (phone_normalized,))
                existing = cur.fetchone()
                if existing:
                    return {
                        'statusCode': 409,
                        'headers': CORS_HEADERS,
                        'body': json.dumps({'error': 'duplicate', 'message': 'Этот номер телефона уже участвует в розыгрыше'})
                    }

                cur.execute('SELECT COALESCE(MAX(ticket_number), 0) + 1 FROM participants')
                ticket_number = cur.fetchone()[0]

                cur.execute('''
                    INSERT INTO participants (full_name, phone_raw, phone_normalized, ticket_number, ip_address, user_agent)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id, ticket_number, created_at
                ''', (full_name, phone_raw, phone_normalized, ticket_number, ip_address, user_agent))
                row = cur.fetchone()

        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps({
                'success': True,
                'ticket_number': row[1],
                'participant_id': row[0],
            })
        }
    except errors.UniqueViolation:
        return {
            'statusCode': 409,
            'headers': CORS_HEADERS,
            'body': json.dumps({'error': 'duplicate', 'message': 'Этот номер телефона уже участвует в розыгрыше'})
        }
    except Exception as e:
        print(f'Register error: {e}')
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,
            'body': json.dumps({'error': 'Не удалось зарегистрироваться. Попробуйте ещё раз'})
        }
    finally:
        conn.close()
