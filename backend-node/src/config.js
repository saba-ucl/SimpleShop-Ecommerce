// Settings for the Node backend. Same values as the Java backend's
// application.properties and CorsConfig.java, so the React frontend
// works with either backend without changes.

export const config = {
  port: 8181,
  // Only reachable from your own computer, not from others on the same Wi-Fi.
  host: '127.0.0.1',
  // The React dev server, which is allowed to call this API from the browser (CORS).
  allowedOrigin: 'http://localhost:3000'
};
