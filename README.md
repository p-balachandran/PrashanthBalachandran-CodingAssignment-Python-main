# 🚀 Performance Engineering Assignment

Hi there! 👋 We're thrilled you're interested in joining our team to help build high-quality, scalable systems. This assignment is designed to give you a taste of real-world performance engineering challenges while showcasing your technical skills, problem-solving approach, and engineering mindset.

## ✨ What We're Looking For

This assignment will help us understand how you approach performance engineering challenges. We'd love to see your ability to:

- Design and implement automated performance testing
- Simulate realistic load and stress test scenarios
- Analyze system performance data and identify bottlenecks

## 🛠️ Let's Get Started!

### Setting Up the Application
First things first, let's get the application up and running:

1. Unzip the provided archive
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. App URL: http://localhost:5000
5. Credentials: `perftest / perftest`

**Note:** If port 5000 is already in use, try: `PORT=<available_port> npm start`

### Understanding the API
Here's what you'll be working with:
- **POST /login** — Authenticates user
- **GET /logout** — Logs out user
- **GET /api/search** — Search flights (from, to, date)

## 📋 What You'll Need to Submit

Here's what we'd like to see in your submission:

- ✅ A JMeter (or other) test plan covering core scenarios
- ✅ A set of test data files
- ✅ Performance test results: Run 2 test scenarios (1 user baseline & 15 users load test, each for 5 minutes) and create a comprehensive metrics analysis report
- ✅ A README with setup, execution, and interpretation guidance
- ✅ Clear documentation (test plan, findings)

## 📘 Documentation & Submission Requirements

### 📁 Repository Structure
```
qtt-perf-assignment/
├── README.md
├── jmeter/
│   ├── perftestplan.jmx
│   ├── test-data/
│   │   ├── users.csv
│   │   └── flights.csv
│   └── results/
├── docs/
│   ├── test-plan.md
│   ├── metrics-analysis.md
│   └── recommendations.md

```

### 📄 What We'd Like to See in Your Documentation

#### Test Plan Documentation
- Objectives and strategy
- Tooling used
- Test data explanation

#### Results Analysis
- Key findings
- Charts or summary metrics
- Identified performance issues

#### Recommendations
- Optimization suggestions
- Infrastructure considerations
- Risk and scalability insights

## 📝 A Few Tips

- Focus on performance testing, not functional correctness
- Assume the application is stable and working as expected
- Be clear in your assumptions and make your results actionable
- Feel free to use any additional tools that help improve insights (Grafana, Python scripts, etc.)

Good luck! We're excited to see what you create! 🚀 