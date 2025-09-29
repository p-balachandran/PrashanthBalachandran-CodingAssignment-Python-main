const express = require('express');
const path = require('path');
const session = require('express-session');
const fs = require('fs');
const metrics = require('./metrics');
const app = express();
const PORT = process.env.PORT || 5000;

// Performance bottleneck tracking
let activeUsers = new Set();
let userCount = 0;
let requestCount = 0;
let concurrentRequests = 0;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'flight-secret', resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Start E2E timing BEFORE the synthetic delay so the delay is included
+app.use(metrics.e2e());

// Middleware to track active users and add baseline delay
app.use((req, res, next) => {
  // Track concurrent requests for JMeter testing
  concurrentRequests++;
  requestCount++;
  
  // Use IP address and User-Agent to identify unique users for JMeter
  const userIdentifier = req.ip + '|' + (req.get('User-Agent') || 'unknown');
  
  if (req.session && req.session.loggedIn) {
    const userId = req.session.username || req.sessionID;
    activeUsers.add(userId);
    userCount = activeUsers.size;
  } else {
    // For JMeter testing, also track by IP/User-Agent combination
    activeUsers.add(userIdentifier);
    userCount = activeUsers.size;
  }
  
  // Log current user count and concurrent requests
  console.log(`Active users: ${userCount}, Concurrent requests: ${concurrentRequests}, Total requests: ${requestCount}`);
  
  // Baseline delay: 150ms for all users
  let totalDelay = 150;
  console.log(`⏱️ Baseline delay: 150ms for ${req.session && req.session.loggedIn ? 'authenticated' : 'anonymous'} user`);
  
  // Performance bottleneck: Add delay when more than 5 concurrent users OR more than 5 total users
  if (userCount > 5 || concurrentRequests > 5) {
    const bottleneckDelay = Math.min(5000, Math.max(userCount - 5, concurrentRequests - 5) * 1000);
    totalDelay += bottleneckDelay;
    console.log(`🚨 Performance bottleneck triggered! ${userCount} users, ${concurrentRequests} concurrent requests. Adding ${bottleneckDelay}ms additional delay.`);
  }
  
  console.log(`📊 Total delay: ${totalDelay}ms`);
  
  // Decrease concurrent requests when request completes
  res.on('finish', () => {
    concurrentRequests = Math.max(0, concurrentRequests - 1);
  });
  
  setTimeout(next, totalDelay);
});

// Clean up inactive users periodically
setInterval(() => {
  // This is a simplified cleanup - in a real app you'd track session expiry
  console.log(`Current active users: ${userCount}`);
}, 30000); // Log every 30 seconds

// Sample flight data
const flights = [
  { name: 'Flight 101', from: 'Vancouver', to: 'Toronto', time: '9:00 AM - 1:00 PM', price: 350 },
  { name: 'Flight 202', from: 'Vancouver', to: 'Calgary', time: '11:00 AM - 12:30 PM', price: 220 },
  { name: 'Flight 303', from: 'Toronto', to: 'Montreal', time: '2:00 PM - 4:00 PM', price: 180 },
  { name: 'Flight 404', from: 'Calgary', to: 'Toronto', time: '3:00 PM - 6:00 PM', price: 300 },
  { name: 'Flight 505', from: 'Toronto', to: 'Calgary', time: '8:00 AM - 10:00 AM', price: 290 },
];

// Middleware to restrict access to authenticated users
function isAuthenticated(req, res, next) {
  if (req.session.loggedIn) next();
  else res.redirect('/signin.html');
}

// Serve homepage with dynamic nav
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error loading page');
    const nav = req.session.loggedIn ? `

<style>
  body {
    font-family: Arial, sans-serif;
    background: #f0f6ff;
    margin: 0;
    padding: 0;
  }
  nav {
    background-color: #1f3b99;
    padding: 1rem 2rem;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  nav a {
    color: white;
    text-decoration: none;
    margin-left: 1rem;
    font-weight: bold;
  }
  nav a:hover {
    text-decoration: underline;
  }
  .container {
    background: white;
    margin: 2rem auto;
    padding: 2rem;
    max-width: 500px;
    border-radius: 8px;
    box-shadow: 0 0 12px rgba(0,0,0,0.1);
  }
</style>

<nav>
  <div>✈️ Perf Travel</div>
  <div>
    <a href="/">Home</a>
    <a href="/search.html">Search Flights</a>
    <a href="/logout">Logout</a>
  </div>
</nav>
` : `

<style>
  body {
    font-family: Arial, sans-serif;
    background: #f0f6ff;
    margin: 0;
    padding: 0;
  }
  nav {
    background-color: #1f3b99;
    padding: 1rem 2rem;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  nav a {
    color: white;
    text-decoration: none;
    margin-left: 1rem;
    font-weight: bold;
  }
  nav a:hover {
    text-decoration: underline;
  }
  .container {
    background: white;
    margin: 2rem auto;
    padding: 2rem;
    max-width: 500px;
    border-radius: 8px;
    box-shadow: 0 0 12px rgba(0,0,0,0.1);
  }
</style>

<nav>
  <div>✈️ Perf Travel</div>
  <div>
    <a href="/">Home</a>
    <a href="/signin.html">Sign In</a>
  </div>
</nav>
`;
    const html = data.replace(/<nav>[\s\S]*?<\/nav>/, nav);
    res.send(html);
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'perftest' && password === 'perftest') {
    req.session.loggedIn = true;
    req.session.username = username;
    res.redirect('/search.html');
  } else {
    res.send('Invalid credentials. Please try again.');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.get('/search.html', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

app.get('/api/search', isAuthenticated, (req, res) => {
  const { from, to } = req.query;
  
  // Additional performance bottleneck for search API when more than 5 users OR concurrent requests
  if (userCount > 5 || concurrentRequests > 5) {
    const searchDelay = Math.min(3000, Math.max(userCount - 5, concurrentRequests - 5) * 500); // 500ms per additional user/request, max 3 seconds
    console.log(`🔍 Search bottleneck: ${userCount} users, ${concurrentRequests} concurrent requests. Adding ${searchDelay}ms delay to search.`);
    
    // Simulate heavy database query
    setTimeout(() => {
      // Simulate CPU-intensive processing
      let results = flights.filter(f => f.from === from && f.to === to);
      
      // Add artificial processing overhead
      const overhead = Math.max(userCount - 5, concurrentRequests - 5) * 1000;
      for (let i = 0; i < overhead; i++) {
        // Simulate complex calculations
        Math.sqrt(i) * Math.random();
      }
      
      res.json(results);
    }, searchDelay);
  } else {
    const results = flights.filter(f => f.from === from && f.to === to);
    res.json(results);
  }
});

// Status endpoint to monitor performance bottleneck
app.get('/api/status', (req, res) => {
  const isBottleneckActive = userCount > 5 || concurrentRequests > 5;
  const baselineDelay = 150;
  const bottleneckDelay = isBottleneckActive ? Math.min(5000, Math.max(userCount - 5, concurrentRequests - 5) * 1000) : 0;
  const searchDelay = isBottleneckActive ? Math.min(3000, Math.max(userCount - 5, concurrentRequests - 5) * 500) : 0;
  const totalGeneralDelay = baselineDelay + bottleneckDelay;
  
  res.json({
    activeUsers: userCount,
    concurrentRequests: concurrentRequests,
    totalRequests: requestCount,
    baselineDelay: baselineDelay,
    bottleneckActive: isBottleneckActive,
    bottleneckDelay: bottleneckDelay,
    totalGeneralDelay: totalGeneralDelay,
    searchDelay: searchDelay,
    message: isBottleneckActive 
      ? `🚨 Performance bottleneck active! ${userCount} users, ${concurrentRequests} concurrent requests. Total delay: ${totalGeneralDelay}ms`
      : `✅ Baseline performance. ${userCount} users, ${concurrentRequests} concurrent requests. Total delay: ${totalGeneralDelay}ms`
  });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', metrics.register.contentType);
  res.end(await metrics.register.metrics());
});

app.listen(PORT, () => {
  console.log(`🚀 App running on http://localhost:${PORT}`);
  console.log(`📊 Performance bottleneck will trigger when more than 5 users are active`);
  console.log(`🔍 Monitor status at http://localhost:${PORT}/api/status`);
});
