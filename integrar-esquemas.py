from pathlib import Path
import shutil
import sys
from html.parser import HTMLParser

PACKAGE = Path(__file__).resolve().parent
ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else PACKAGE
PAGES = ("Termocumuladores", "Esquentadores", "Paineis-Solares")
class Sections(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.text = text
        self.starts = [0]
        for i, c in enumerate(text):
            if c == "\n": self.starts.append(i + 1)
        self.target = None
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "section" and attrs.get("id") in ("perguntas", "avarias", "pedido") and self.target is None:
            line, col = self.getpos()
            self.target = self.starts[line - 1] + col

def main():
    jobs = []
    for lang in ("pt", "en", "es", "fr"):
        prefix = "" if lang == "pt" else lang + "/"
        for page in PAGES:
            target = ROOT / prefix / (page + ".html")
            if not target.is_file():
                raise SystemExit("Missing page (no files changed): " + str(target))
            text = target.read_text(encoding="utf-8")
            marker = "<!-- assisteagua-esquema:" + page + " -->"
            if marker in text:
                continue
            parser = Sections(text)
            parser.feed(text)
            pos = parser.target if parser.target is not None else text.lower().rfind("</main>")
            if pos < 0: raise SystemExit("No insertion point: " + str(target))
            fragment = (PACKAGE / "componentes" / lang / (page + ".html")).read_text(encoding="utf-8")
            text = text[:pos] + marker + "\n" + fragment + "\n" + text[pos:]
            asset = "" if lang == "pt" else "../"
            if "esquemas-instalacao.css" not in text:
                head = text.lower().rfind("</head>")
                if head < 0: raise SystemExit("Missing head: " + str(target))
                text = text[:head] + '<link rel="stylesheet" href="' + asset + 'esquemas-instalacao.css">\n' + text[head:]
            if "esquemas-instalacao.js" not in text:
                body = text.lower().rfind("</body>")
                if body < 0: raise SystemExit("Missing body: " + str(target))
                text = text[:body] + '<script src="' + asset + 'esquemas-instalacao.js" defer></script>\n' + text[body:]
            jobs.append((target, text))
    for target, text in jobs:
        backup = target.with_suffix(".html.antes-esquemas.bak")
        if not backup.exists(): shutil.copy2(target, backup)
        target.write_text(text, encoding="utf-8")
    for asset in ("esquemas-instalacao.css", "esquemas-instalacao.js"):
        source = PACKAGE / asset
        target = ROOT / asset
        if source.resolve() != target.resolve(): shutil.copy2(source, target)
    print("Updated pages:", len(jobs))
if __name__ == "__main__": main()
