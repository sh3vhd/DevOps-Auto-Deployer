import os
import posixpath
import paramiko
from rich.console import Console

console = Console()

class SSHManager:
    def __init__(self, cfg):
        self.cfg = cfg

    def deploy(self, host, user, key_path, remote_workdir="~/devops-auto-deployer"):
        """Very simple SSH deploy: rsync-like upload (SFTP) and remote deploy commands."""
        key = paramiko.RSAKey.from_private_key_file(os.path.expanduser(key_path))
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        console.print(f"[cyan]Connecting to {user}@{host}[/cyan] ...")
        client.connect(hostname=host, username=user, pkey=key)

        # Ensure directory
        stdin, stdout, stderr = client.exec_command(f"mkdir -p {remote_workdir}")
        stdout.channel.recv_exit_status()

        # Upload current repo (basic sftp copy)
        sftp = client.open_sftp()
        self._put_dir(sftp, ".", remote_workdir)
        sftp.close()

        # Install deps and deploy
        commands = [
            f"cd {remote_workdir}",
            "python3 -m pip install -r requirements.txt --user || pip3 install -r requirements.txt --user",
            "python3 -m src.main deploy"
        ]
        cmd = " && ".join(commands)
        console.print(f"[green]Running remote deploy[/green]: {cmd}")
        stdin, stdout, stderr = client.exec_command(cmd)
        exit_code = stdout.channel.recv_exit_status()
        if exit_code != 0:
            console.print(f"[red]Remote deploy failed with code {exit_code}[/red]")
            console.print(stderr.read().decode())
        else:
            console.print("[green]Remote deploy completed successfully[/green]")
        client.close()

    def _put_dir(self, sftp, local, remote):
        local = os.path.abspath(local)
        for root, dirs, files in os.walk(local):
            # skip the workdir to avoid huge uploads
            if "_workdir" in root.split(os.sep):
                continue
            rel = os.path.relpath(root, local)
            rpath = posixpath.join(remote, "." if rel == "." else rel.replace("\\\\","/"))
            self._mkdir_p(sftp, rpath)
            for f in files:
                lp = os.path.join(root, f)
                rp = posixpath.join(rpath, f)
                sftp.put(lp, rp)

    def _mkdir_p(self, sftp, remote_path):
        parts = remote_path.strip("/").split("/")
        cur = ""
        for p in parts:
            cur += "/" + p
            try:
                sftp.stat(cur)
            except IOError:
                sftp.mkdir(cur)
