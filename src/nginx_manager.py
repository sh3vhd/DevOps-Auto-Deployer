import os
from jinja2 import Template
from rich.console import Console

console = Console()

class NginxManager:
    def __init__(self, cfg):
        self.cfg = cfg
        self.workdir = os.path.abspath(cfg.get("paths",{}).get("workdir","./_workdir"))
        os.makedirs(self.workdir, exist_ok=True)

    def generate_nginx(self):
        domain = self.cfg["nginx"]["domain"]
        fe_port = self.cfg["frontend"]["port"]
        be_port = self.cfg["backend"]["port"]
        tpl_path = "templates/nginx.conf"
        with open(tpl_path,"r",encoding="utf-8") as f:
            tpl = Template(f.read())
        rendered = tpl.render(domain=domain, fe_port=fe_port, be_port=be_port)
        out = os.path.join(self.workdir, "nginx.conf")
        with open(out,"w",encoding="utf-8") as f:
            f.write(rendered)
        console.print(f"[green]Generated[/green] {out}")
