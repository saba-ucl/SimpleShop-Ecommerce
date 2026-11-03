// A tiny router: connects a method + URL pattern to a handler function.
// Express does the same thing; this shows how it works underneath.
//
// Example:
//   router.get('/api/products/:id', (req, params) => ...)
//   GET /api/products/5  ->  handler is called with params = { id: '5' }

export class Router {
  constructor() {
    this.routes = [];
  }

  add(method, pattern, handler) {
    // Turn '/api/products/:id' into the regular expression ^/api/products/([^/]+)$
    const paramNames = [];
    const regexText = pattern.replace(/:(\w+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    this.routes.push({ method, regex: new RegExp(`^${regexText}$`), paramNames, handler });
  }

  get(pattern, handler) { this.add('GET', pattern, handler); }
  post(pattern, handler) { this.add('POST', pattern, handler); }
  put(pattern, handler) { this.add('PUT', pattern, handler); }
  delete(pattern, handler) { this.add('DELETE', pattern, handler); }

  // Finds the route for a request.
  // Returns { handler, params }, or { allowedMethods } when the URL exists
  // with other methods (405), or null when the URL does not exist at all (404).
  match(method, path) {
    const allowedMethods = [];
    for (const route of this.routes) {
      const result = route.regex.exec(path);
      if (!result) {
        continue;
      }
      if (route.method !== method) {
        allowedMethods.push(route.method);
        continue;
      }
      const params = {};
      route.paramNames.forEach((name, i) => {
        params[name] = decodeURIComponent(result[i + 1]);
      });
      return { handler: route.handler, params };
    }
    return allowedMethods.length > 0 ? { allowedMethods } : null;
  }
}
