// metrics.js
const client = require('prom-client');
const register = new client.Registry();

client.collectDefaultMetrics({ register });

const reqs = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method','route','status'],
});
const lat = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'End-to-end duration per route (includes middleware/delay)',
  labelNames: ['method','route','status'],
  buckets: [0.05,0.1,0.25,0.5,1,2,3,5,10],
});
register.registerMetric(reqs);
register.registerMetric(lat);

function e2e() {
  return (req, res, next) => {
    // skip timing for /metrics to avoid self-measurement
    if (req.path === '/metrics') return next();

    const end = lat.startTimer();
    res.on('finish', () => {
      const route = req.route?.path || req.path;
      const labels = { method: req.method, route, status: String(res.statusCode) };
      reqs.inc(labels);
      end(labels);
    });
    next();
  };
}

module.exports = { e2e, register };
