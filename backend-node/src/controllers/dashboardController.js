// /api/dashboard endpoints (same as DashboardController.java).

import { dashboardService } from '../services/dashboardService.js';
import { sendJson } from '../http/httpUtils.js';

export function registerDashboardRoutes(router) {
  router.get('/api/dashboard/counts', ({ res }) => {
    sendJson(res, 200, dashboardService.getCounts());
  });
}
