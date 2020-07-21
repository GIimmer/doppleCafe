import json

import jwt
import requests
from django.conf import settings

from django.contrib.auth import authenticate

DOMAIN = settings.AUTH0_DOMAIN
DOMAIN_BASE = f"https://{DOMAIN}/"
MGMT_API_BASE = f"{DOMAIN_BASE}api/v2/"

def jwt_decode_token(token):
    header = jwt.get_unverified_header(token)
    jwks = requests.get(f"{DOMAIN_BASE}.well-known/jwks.json").json()
    public_key = None
    for jwk in jwks['keys']:
        if jwk['kid'] == header['kid']:
            public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk))

    if public_key is None:
        raise Exception('Public key not found.')

    issuer = DOMAIN_BASE
    return jwt.decode(token, public_key, audience=settings.AUTH0_AUDIENCE, issuer=issuer, algorithms=['RS256'])

def jwt_get_username_from_payload_handler(payload):
    username = payload.get('sub').replace('|', '.')
    authenticate(remote_user=username)
    return username

def decode_token_auth_header(request):
    """Obtains the Access Token from the Authorization Header"""
    auth = request.META.get("HTTP_AUTHORIZATION", None)
    parts = auth.split()
    token = parts[1]
    decoded = jwt.decode(token, verify=False)

    return decoded

def remove_create_city_permissions(request):
    decoded = decode_token_auth_header(request)

    headers = { 'content-type': "application/x-www-form-urlencoded" }
    payload = {
        'grant_type': 'client_credentials',
        'client_id': settings.AUTH0_CLIENT_ID,
        'client_secret': settings.AUTH0_CLIENT_SECRET,
        'audience': MGMT_API_BASE
    }
    token = requests.post(f"{DOMAIN_BASE}oauth/token", data=payload, headers=headers).json()

    headers = { 'authorization': f"Bearer {token['access_token']}" }
    res = requests.get(f"{MGMT_API_BASE}users/{decoded['sub']}/roles", headers=headers).json()
    role = res[0]['name'] if len(res) == 1 else False

    if role and (role == 'Single City Authorized'):
        headers = {
            'content-type': "application/json",
            'authorization': f"Bearer {token['access_token']}",
            'cache-control': "no-cache"
        }
        user_roles_url = f"{MGMT_API_BASE}users/{decoded['sub']}/roles"

        add_role_payload = {"roles": ["rol_C2Zn2anEVRaDJP1Q"]}
        add_role_res = requests.post(
            user_roles_url,
            data=json.dumps(add_role_payload),
            headers=headers
        )

        delete_role_payload = {"roles": ["rol_etxwP5g8bO5y1ie0"]}
        delete_role_res = requests.delete(
            user_roles_url,
            data=json.dumps(delete_role_payload),
            headers=headers
        )

    elif role == 'Unlimited User':
        return

    if (not add_role_res.ok or not delete_role_res.ok):
        raise Exception('Error while updating user roles')