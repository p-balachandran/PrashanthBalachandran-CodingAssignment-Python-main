
# Coding Assignment – Flights App

  

This project contains:

-  **Locust** performance tests (`/locust`)

-  **Prometheus + Grafana** monitoring (`/monitoring`)

- Docs & report templates (`/docs`)

  

---

  

## Quick Start (Docker – Recommended)

  

### Prerequisites

-  **Docker Desktop** (Win/Mac) or **Docker Engine** + **docker compose** (Linux)

- Windows/macOS: https://www.docker.com/products/docker-desktop

- Linux: `sudo apt-get install docker.io` and `sudo apt-get install docker-compose-plugin`

  

> Verify: `docker --version` and `docker compose version`

  

### Run

From the repo root:

  

```bash

# 1) Build & start everything in the background (node app, grafana, prometheus)

docker  compose  -f  docker/docker-compose.yml  up  -d  --build

  

# 2) See what’s running

docker  compose  -f  docker/docker-compose.yml  ps

  

# 3) View logs (Ctrl+C to exit)

docker  compose  -f  docker/docker-compose.yml  logs  -f

  

# Stop services

docker  compose  -f  docker/docker-compose.yml  down

  

# Remove volumes (CAUTION: wipes Grafana/Prom data)

docker  compose  -f  docker/docker-compose.yml  down  -v
```


## Run Locust (Python)

 

### 1) Install Python

  

-  **Windows:**  Install  Python  3.10+  from [python.org](https://www.python.org/downloads/)

  

Check  version:

  

```powershell

  

py  --version

  

```

  

-  **macOS/Linux:** Install Python 3.10+ via package manager or python.org, then check:

  

```bash

  

python3  --version

  

```

  

### 2) Install dependencies

  

```bash

  

pip  install  -r  locust/requirements.txt

  

```

  

  

### 3) Run Locust (UI mode)

  

From the **repo root**:

  

  

-  **Windows PowerShell:**

  

```powershell

  

python -m locust -f .\locust\scenarios\search.py --host http://localhost:5000

  

```

  

  

-  **Cross-platform:**

  

```bash

  

locust  -f  locust/scenarios/search.py  --host  http://localhost:5000

  

```

  

  

Then open **http://localhost:8089** in your browser and set:

  

- Users: `1` (baseline) or `15` (load)

  

- Spawn rate: e.g., `1`

  

- Host: `http://localhost:5000`


## Viewing Dashboards

  

  

### Locust

  

- Go to **http://localhost:8089**

  


  

### Grafana

  

- Go to **http://localhost:3000**

  

- Default login: `admin / admin`

  

- Data source: Prometheus at `http://prometheus:9090`

  

- Import dashboards or use the provisioned configs in `monitoring/grafana`