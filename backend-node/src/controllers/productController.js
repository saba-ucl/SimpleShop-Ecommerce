// /api/products endpoints (same as ProductController.java).

import { productService } from '../services/productService.js';
import { sendJson, readJsonBody, parseId } from '../http/httpUtils.js';

export function registerProductRoutes(router) {
  // GET /api/products, optionally ?keyword=phone or ?categoryId=1
  router.get('/api/products', ({ res, query }) => {
    const keyword = query.get('keyword');
    const categoryId = query.get('categoryId') ? parseId(query.get('categoryId')) : null;
    sendJson(res, 200, productService.getAll(keyword, categoryId));
  });

  router.get('/api/products/:id', ({ res, params }) => {
    sendJson(res, 200, productService.getById(parseId(params.id)));
  });

  router.post('/api/products', async ({ req, res }) => {
    sendJson(res, 201, productService.create(await readJsonBody(req)));
  });

  router.put('/api/products/:id', async ({ req, res, params }) => {
    sendJson(res, 200, productService.update(parseId(params.id), await readJsonBody(req)));
  });

  router.delete('/api/products/:id', ({ res, params }) => {
    productService.delete(parseId(params.id));
    sendJson(res, 204);
  });
}
