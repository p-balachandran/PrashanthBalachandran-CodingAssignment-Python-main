### **1. Objectives and Strategy**

-   **Baseline Objective:** Measure system performance under minimal load (1 user for 5 minutes) to establish reference response times, throughput, and error rates.
    
-   **Load Test Objective:** Apply realistic concurrency (15 users for 5 minutes) to identify scalability, resource utilization, and potential bottlenecks.
    
-   **Strategy:**
    
    -	Run Login/ Logout to understand Auth controller performance
    -	Run Search to understand Search controller performance
	-	If time permits, add perf test for landing pages for UI Perf testing 


    -   Compare baseline vs. load test results to highlight deviations in latency, throughput, and errors.

    -   Monitor system health (CPU, memory, response time distributions) during tests for correlation. In this case it will be process instead of host.
----------

### **2. Tooling Used**

-   **Load Generation:** Locust (Python-based performance testing tool).
    
-   **Metrics Visualization:** Locust and Grafana (integrated with Prometheus to capture and visualize metrics). Grafana/ Promethus for CPU and Memory Usage.
    
----------

### **3. Test Data Explanation**

-   **User Credentials:** Randomized login credentials pulled from a CSV (`logins.csv`) to simulate multiple unique sessions.
    
-   **Search Data:** Randomized city pairs (from/to) selected during test execution, ensuring "from" ≠ "to" to simulate realistic search flows.
  