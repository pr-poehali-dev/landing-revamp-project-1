import json
import os
import secrets
import time

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    'Access-Control-Max-Age': '86400',
}

_sessions = {}


def handler(event: dict, context) -> dict:
    """Аутентификация администратора: вход по паролю, проверка токена, выход."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')

    if method == 'POST' and action == 'logout':
        return _logout(event)
    elif method == 'GET' and action == 'check':
        return _check(event)
    elif method == 'POST':
        return _login(event)
    else:
        return {'statusCode': 404, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Not found'})}


def _login(event):
    try:
        body = json.loads(event.get('body') or '{}')
    except Exception:
        return {'statusCode': 400, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Некорректный запрос'})}

    password = body.get('password', '')
    admin_password = os.environ.get('ADMIN_PASSWORD', '')

    if not admin_password or not secrets.compare_digest(str(password), str(admin_password)):
        return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Неверный пароль'})}

    token = secrets.token_hex(32)
    _sessions[token] = time.time()
    return {
        'statusCode': 200,
        'headers': CORS_HEADERS,
        'body': json.dumps({'success': True, 'token': token})
    }


def _check(event):
    token = (event.get('headers') or {}).get('x-auth-token') or (event.get('headers') or {}).get('X-Auth-Token')
    if not token or token not in _sessions:
        return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Unauthorized'})}
    if time.time() - _sessions[token] > 86400:
        del _sessions[token]
        return {'statusCode': 401, 'headers': CORS_HEADERS, 'body': json.dumps({'error': 'Session expired'})}
    return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}


def _logout(event):
    token = (event.get('headers') or {}).get('x-auth-token') or (event.get('headers') or {}).get('X-Auth-Token')
    if token and token in _sessions:
        del _sessions[token]
    return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'success': True})}