import os
import subprocess
from rich.console import Console

console = Console()

class GitManager:
    def __init__(self, cfg):
        self.cfg = cfg
        self.workdir = os.path.abspath(cfg.get("paths",{}).get("workdir","./_workdir"))
        os.makedirs(self.workdir, exist_ok=True)

    def ensure_repos(self):
        self._ensure_repo(self.cfg["frontend"]["repo"], "frontend", self.cfg["frontend"].get("build_context","frontend"))
        self._ensure_repo(self.cfg["backend"]["repo"], "backend", self.cfg["backend"].get("build_context","backend"))

    def pull_all(self):
        self._git(self._path("frontend"), ["pull","--rebase"])
        self._git(self._path("backend"), ["pull","--rebase"])

    # --------------- helpers ---------------
    def _path(self, name):
        # clone to workdir/name
        return os.path.join(self.workdir, name)

    def _ensure_repo(self, repo, name, build_context):
        dest = self._path(name)
        if not os.path.exists(dest):
            console.print(f"[cyan]Cloning {name}[/cyan] from {repo} ...")
            self._git(self.workdir, ["clone", repo, name], cwd=self.workdir)
        # Optionally ensure build context exists (no-op if project already structured)
        os.makedirs(dest, exist_ok=True)

    def _git(self, path, args, cwd=None):
        cwd = cwd or path
        cmd = ["bash","-lc", f"cd {cwd} && git {' '.join(args)}"]
        try:
            subprocess.run(cmd, check=True)
        except subprocess.CalledProcessError as e:
            console.print(f"[red]Git command failed:[/red] {' '.join(cmd)}")
            raise e
