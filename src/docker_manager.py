import os
import subprocess
import yaml
from rich.console import Console
from jinja2 import Template

console = Console()

class DockerManager:
    def __init__(self, cfg):
        self.cfg = cfg
        self.project = cfg.get("project_name","app")
        self.workdir = os.path.abspath(cfg.get("paths",{}).get("workdir","./_workdir"))
        os.makedirs(self.workdir, exist_ok=True)

    def _compose_path(self):
        return os.path.join(self.workdir, "docker-compose.yml")

    def generate_compose(self):
        """Create docker-compose.yml from config"""
        fe_port = self.cfg["frontend"]["port"]
        be_port = self.cfg["backend"]["port"]
        domain = self.cfg["nginx"]["domain"]
        fe_env = self.cfg["frontend"].get("env_file")
        be_env = self.cfg["backend"].get("env_file")

        compose = {
            "version": "3.9",
            "services": {
                "frontend": {
                    "build": {
                        "context": os.path.join(self.workdir, "frontend"),
                        "dockerfile": "../../templates/Dockerfile.frontend",
                    },
                    "container_name": f"{self.project}_frontend",
                    "ports": [f"{fe_port}:3000"],
                    "networks": ["webnet"],
                    **({"env_file":[fe_env]} if fe_env and os.path.exists(fe_env) else {})
                },
                "backend": {
                    "build": {
                        "context": os.path.join(self.workdir, "backend"),
                        "dockerfile": "../../templates/Dockerfile.backend",
                    },
                    "container_name": f"{self.project}_backend",
                    "ports": [f"{be_port}:5000"],
                    "networks": ["webnet"],
                    **({"env_file":[be_env]} if be_env and os.path.exists(be_env) else {})
                },
                "nginx": {
                    "image": "nginx:alpine",
                    "container_name": f"{self.project}_nginx",
                    "ports": ["80:80"],
                    "volumes": [f"{self.workdir}/nginx.conf:/etc/nginx/nginx.conf:ro"],
                    "depends_on": ["frontend","backend"],
                    "networks": ["webnet"]
                }
            },
            "networks": {"webnet": {"driver": "bridge"}}
        }
        path = self._compose_path()
        with open(path,"w",encoding="utf-8") as f:
            yaml.safe_dump(compose, f, sort_keys=False)
        console.print(f"[green]Generated[/green] {path}")

    def build_images(self):
        """Build frontend and backend images from local clones"""
        compose_dir = self.workdir
        cmd = ["bash","-lc", f"cd {compose_dir} && docker compose -f docker-compose.yml build"]
        self._run(cmd, "Building Docker images")

    def compose_up(self, build=False, force_recreate=False, recreate=None):
        """Bring the stack up"""
        flags = []
        if build: flags.append("--build")
        if force_recreate: flags.append("--force-recreate")
        if recreate in ("always","never","smart"):
            # docker compose v2 supports --recreate
            flags.append(f"--recreate={recreate}")
        cmd = ["bash","-lc", f"cd {self.workdir} && docker compose up -d {' '.join(flags)}"]
        self._run(cmd, "Starting stack")

    def compose_down(self):
        cmd = ["bash","-lc", f"cd {self.workdir} && docker compose down -v --remove-orphans"]
        self._run(cmd, "Stopping & removing stack")

    def compose_logs(self):
        cmd = ["bash","-lc", f"cd {self.workdir} && docker compose logs -f --tail=200"]
        self._run(cmd, "Streaming logs")

    def _run(self, cmd, title):
        console.rule(title)
        try:
            subprocess.run(cmd, check=True)
        except subprocess.CalledProcessError as e:
            console.print(f"[red]Command failed:[/red] {' '.join(cmd)}")
            raise e
