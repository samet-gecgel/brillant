import Fastify = require('fastify');
import proxy = require('@fastify/http-proxy');
import cors = require('@fastify/cors');
import * as path from 'path';
import * as fs from 'fs';
import 'dotenv/config';

const HOSTNAME = 'http://localhost';
const AUTH_PORT = '8444';
const ORDER_PORT = '8445';
const HISTORY_PORT = '8446';
const PRICE_PORT = '8447';
const TICK_PORT = '8448';
const POSITION_PORT = '8450';
const AUTH_ENDPOINTS = ['/login', '/change-password', '/get-user', '/get-account','banks','set-favorite'];
const HISTORY_ENDPOINTS = ['/history'];
const PRICE_ENDPOINTS = ['/graph-data'];
const TICK_ENDPOINTS = ['/socket.io'];
const POSITION_ENDPOINTS = ['/get-positions', '/position-get', '/position-create', '/position-modify', '/position-delete', '/position-close', '/position-close-all'];
const ORDER_ENDPOINTS = ['/GetOpenOrders', '/GetOrder', '/OrderCreate', '/OrderUpdate', '/OrderDelete'];

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').trim().split('\n').map(o => o.trim());
console.log('ALLOWED_ORIGINS: ', allowedOrigins, allowedOrigins.length);

const options = {} as any;
if (process.env.NODE_ENV === 'production') {
  options.https = {
    key: fs.readFileSync(path.join(__dirname, 'certs/private.key')),
    cert: fs.readFileSync(path.join(__dirname, 'certs/certificate.crt'))
  }
}

const server = Fastify(options);

server.register(cors, {
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type,Authorization',],
  credentials: true,
});

AUTH_ENDPOINTS.forEach(endpoint => {
  server.register(proxy, {
    upstream: HOSTNAME + ':' + AUTH_PORT,
    prefix: endpoint,
    rewritePrefix: endpoint,
  });
});

ORDER_ENDPOINTS.forEach(endpoint => {
  server.register(proxy, {
    upstream: HOSTNAME + ':' + ORDER_PORT,
    prefix: endpoint,
    rewritePrefix: endpoint,
  });
});

HISTORY_ENDPOINTS.forEach(endpoint => {
  server.register(proxy, {
    upstream: HOSTNAME + ':' + HISTORY_PORT,
    prefix: endpoint,
    rewritePrefix: endpoint,
  });
});

PRICE_ENDPOINTS.forEach(endpoint => {
  server.register(proxy, {
    upstream: HOSTNAME + ':' + PRICE_PORT,
    prefix: endpoint,
    rewritePrefix: endpoint,
  });
});

POSITION_ENDPOINTS.forEach(endpoint => {
  server.register(proxy, {
    upstream: HOSTNAME + ':' + POSITION_PORT,
    prefix: endpoint,
    rewritePrefix: endpoint,
  });
});

TICK_ENDPOINTS.forEach(endpoint => {
  server.register(proxy, {
    upstream: HOSTNAME + ':' + TICK_PORT,
    prefix: endpoint,
    rewritePrefix: endpoint,
    websocket: true,
  });
});

server.listen({ port: 443, host: "0.0.0.0" }, function (err, address) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
