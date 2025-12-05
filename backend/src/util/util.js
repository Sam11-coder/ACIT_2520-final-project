import { createHmac } from 'node:crypto';
import jwt from 'jsonwebtoken'; // <--- THIS WAS MISSING IN THE STARTER CODE

const DEFAULT_HEADER = {
  'content-type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
};

// [NOTE] This must match the secret in authService.js
const JWT_SECRET = 'thisismysecret';

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function sign(data) {
  return createHmac('sha256', JWT_SECRET).update(data).digest('base64url');
}

export function generateToken(payload) {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

function getUserFromRequest(req, res) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.writeHead(401, DEFAULT_HEADER);
    res.end(
      JSON.stringify({ error: 'Missing or invalid Authorization header' })
    );
    return null;
  }

  const token = authHeader.slice('Bearer '.length);
  const payload = verifyToken(token);

  if (!payload) {
    res.writeHead(401, DEFAULT_HEADER);
    res.end(JSON.stringify({ error: 'Invalid token' }));
    return null;
  }

  return payload;
}

export { DEFAULT_HEADER, getUserFromRequest };