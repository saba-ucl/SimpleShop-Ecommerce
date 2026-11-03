// /api/orders endpoints (same as OrderController.java).

import { orderService } from '../services/orderService.js';
import { sendJson, readJsonBody, parseId } from '../http/httpUtils.js';

export function registerOrderRoutes(router) {
  router.get('/api/orders', ({ res }) => {
    sendJson(res, 200, orderService.getAll());
  });

  router.get('/api/orders/:id', ({ res, params }) => {
    sendJson(res, 200, orderService.getById(parseId(params.id)));
  });

  router.get('/api/orders/user/:userId', ({ res, params }) => {
    sendJson(res, 200, orderService.getByUser(parseId(params.userId)));
  });

  router.post('/api/orders', async ({ req, res }) => {
    sendJson(res, 201, orderService.create(await readJsonBody(req)));
  });

  // Body: { "status": "CONFIRMED" }
  router.put('/api/orders/:id/status', async ({ req, res, params }) => {
    const body = await readJsonBody(req);
    sendJson(res, 200, orderService.updateStatus(parseId(params.id), body?.status));
  });
}
