// SimpleShop backend in plain Node.js - no npm packages needed.
//
// Request flow (same layers as the Java backend):
//   server.js -> router -> controller -> service -> repository -> SQLite

import http from 'node:http';
import { config } from './config.js';
import { Router } from './http/router.js';
import { sendJson, HttpError } from './http/httpUtils.js';
import { loadSampleData } from './data/dataInitializer.js';
import { registerProductRoutes } from './controllers/productController.js';
import { registerCategoryRoutes } from './controllers/categoryController.js';
import { registerUserRoutes } from './controllers/userController.js';
import { registerOrderRoutes } from './controllers/orderController.js';
import { registerDashboardRoutes } from './controllers/dashboardController.js';

const router = new Router();
registerProductRoutes(router);
registerCategoryRoutes(router);
registerUserRoutes(router);
registerOrderRoutes(router);
registerDashboardRoutes(router);

// CORS: lets the React app on localhost:3000 call this API from the browser.
// Same rules as CorsConfig.java.
function applyCors(req, res) {
  if (req.headers.origin === config.allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', config.allowedOrigin);
    res.setHeader('Vary', 'Origin');
  }
}

function handlePreflight(req, res) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || '*');
  res.setHeader('Access-Control-Max-Age', '1800');
  res.writeHead(204);
  res.end();
}

// Turns database errors into the same messages as the Java backend.
function databaseErrorMessage(error) {
  const text = String(error.message);
  if (text.includes('FOREIGN KEY constraint failed')) {
    return 'This record is still used by another record and cannot be deleted.';
  }
  if (text.includes('UNIQUE constraint failed')) {
    return 'This value already exists.';
  }
  return null;
}

function handleError(error, req, res) {
  if (error instanceof HttpError) {
    sendJson(res, error.status, { message: error.message });
    return;
  }
  const dbMessage = error.code === 'ERR_SQLITE_ERROR' ? databaseErrorMessage(error) : null;
  if (dbMessage) {
    sendJson(res, 400, { message: dbMessage });
    return;
  }
  // A real bug: print the full error in the terminal.
  console.error(`Unexpected server error on ${req.method} ${req.url}`, error);
  sendJson(res, 500, { message: 'An unexpected server error occurred.' });
}

const server = http.createServer(async (req, res) => {
  const started = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.url} -> ${res.statusCode} (${Date.now() - started} ms)`);
  });

  try {
    applyCors(req, res);
    if (req.method === 'OPTIONS') {
      handlePreflight(req, res);
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const match = router.match(req.method, url.pathname);

    if (!match) {
      throw new HttpError(404, `No endpoint found for ${url.pathname}`);
    }
    if (match.allowedMethods) {
      res.setHeader('Allow', match.allowedMethods.join(', '));
      throw new HttpError(405, `Request method '${req.method}' is not supported`);
    }

    await match.handler({ req, res, params: match.params, query: url.searchParams });
  } catch (error) {
    handleError(error, req, res);
  }
});

loadSampleData();

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${config.port} is already in use. Is the Java backend (or another copy of this one) still running?`);
    process.exit(1);
  }
  throw error;
});

server.listen(config.port, config.host, () => {
  console.log(`SimpleShop Node backend running on http://localhost:${config.port}`);
  console.log(`Try http://localhost:${config.port}/api/products`);
});
