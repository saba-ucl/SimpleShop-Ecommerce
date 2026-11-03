// /api/categories endpoints (same as CategoryController.java).

import { categoryService } from '../services/categoryService.js';
import { sendJson, readJsonBody, parseId } from '../http/httpUtils.js';

export function registerCategoryRoutes(router) {
  router.get('/api/categories', ({ res }) => {
    sendJson(res, 200, categoryService.getAll());
  });

  router.get('/api/categories/:id', ({ res, params }) => {
    sendJson(res, 200, categoryService.getById(parseId(params.id)));
  });

  router.post('/api/categories', async ({ req, res }) => {
    sendJson(res, 201, categoryService.create(await readJsonBody(req)));
  });

  router.put('/api/categories/:id', async ({ req, res, params }) => {
    sendJson(res, 200, categoryService.update(parseId(params.id), await readJsonBody(req)));
  });

  router.delete('/api/categories/:id', ({ res, params }) => {
    categoryService.delete(parseId(params.id));
    sendJson(res, 204);
  });
}
