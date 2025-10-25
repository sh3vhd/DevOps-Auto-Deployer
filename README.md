# DevOps Auto-Deployer

Advanced CLI tool to automatically deploy web applications (e.g., React + Node.js) on a server using Docker, Docker Compose, and Nginx reverse proxy.

## 🧠 Goals

- Build Docker images for frontend and backend
- Configure Nginx reverse proxy
- Spin everything up using Docker Compose
- Support updates via `git pull`
- Log the entire deployment process
- (Optional) Deploy remotely over SSH
- (Optional) Webhook trigger for auto-deploy on `git push`

## 🧩 Tech Stack

- **Language:** Python 3.10+
- **Tools:** Docker, Docker Compose, Git, Bash
- **Libraries:** `click`, `PyYAML`, `rich` (pretty logs), `paramiko` (SSH, optional), `jinja2` (templating), `Flask` (optional webhook)

## 📦 Project Structure

```
devops-auto-deployer/
├── src/
│   ├── main.py
│   ├── cli.py
│   ├── docker_manager.py
│   ├── nginx_manager.py
│   ├── git_manager.py
│   ├── ssh_manager.py
│   └── webhook.py
├── templates/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── nginx.conf
├── deploy.yaml
├── .env.example
├── requirements.txt
└── README.md
```

> **Note:** `docker-compose.yml` is generated automatically during `deploy` from your `deploy.yaml`.

## ✅ Requirements

- Python 3.10+
- Docker & Docker Compose installed
- Git installed

Python deps:
```bash
pip install -r requirements.txt
```

## ⚙️ Configuration (`deploy.yaml`)

Example:
```yaml
project_name: TaskManagerPro
frontend:
  repo: https://github.com/user/task-manager-client.git
  port: 3000
  build_context: frontend
  env_file: .env.frontend
backend:
  repo: https://github.com/user/task-manager-server.git
  port: 5000
  build_context: backend
  env_file: .env.backend
nginx:
  domain: myapp.local
  email: admin@myapp.local
paths:
  workdir: ./_workdir
```

- `build_context` is a subdirectory where your Dockerfile expects the code.
- `env_file` is optional per service and will be mounted by Compose if present.
- `paths.workdir` is where repos are cloned and artifacts generated.

## 🧰 CLI Commands

```bash
python3 -m src.main init        # create sample deploy.yaml if absent
python3 -m src.main deploy      # build images, generate nginx.conf & docker-compose.yml, bring stack up
python3 -m src.main update      # git pull + rolling restart
python3 -m src.main clean       # stop & remove containers, networks, volumes for this project
python3 -m src.main logs        # follow logs from all services
python3 -m src.main webhook --secret <token> --port 9000   # optional Git webhook listener
# Remote (optional):
python3 -m src.main ssh-deploy --host 1.2.3.4 --user root --key ~/.ssh/id_rsa
```

### `init`
- Creates a **starter `deploy.yaml`** and copies template Dockerfiles & `nginx.conf` if they don’t exist.

### `deploy`
- Clones repos (if not already cloned)
- Builds images from template Dockerfiles
- Generates `nginx.conf` and `docker-compose.yml` from `deploy.yaml`
- Starts the stack with `docker compose up -d`

### `update`
- Runs `git pull` for frontend & backend repositories and restarts services

### `clean`
- Stops and removes containers, networks, and volumes belonging to this project

### `logs`
- Shows combined logs of the project services

### `webhook` (optional)
- Minimal Flask server that listens for Git webhooks (e.g., GitHub) and runs `update` on push

### `ssh-deploy` (optional)
- Connects to a remote host via SSH and runs the same `deploy` workflow remotely

## 🔐 Environment Variables

Create `.env` files as needed:
```
# .env.backend
PORT=5000
NODE_ENV=production
DATABASE_URL=postgres://user:pass@db:5432/app

# .env.frontend
VITE_API_URL=https://myapp.local/api
```

## 📝 Example Use

```bash
python3 -m src.main init
python3 -m src.main deploy
python3 -m src.main update
```

## 🧯 Troubleshooting

- Ensure Docker daemon is running
- Make sure ports are free: `3000`, `5000`, `80`, `443` (or change in `deploy.yaml`)
- Check logs with `python3 -m src.main logs`

## 📄 License

MIT
