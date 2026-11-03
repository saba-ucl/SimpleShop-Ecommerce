// /api/users endpoints (same as UserController.java).

import { userService } from '../services/userService.js';
import { sendJson, readJsonBody } from '../http/httpUtils.js';

export function registerUserRoutes(router) {
  router.post('/api/users/register', async ({ req, res }) => {
    sendJson(res, 201, userService.register(await readJsonBody(req)));
  });

  router.post('/api/users/login', async ({ req, res }) => {
    sendJson(res, 200, userService.login(await readJsonBody(req)));
  });

  router.get('/api/users', ({ res }) => {
    sendJson(res, 200, userService.getAll());
  });
}
