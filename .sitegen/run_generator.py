from pathlib import Path
import base64
import zlib

root = Path(__file__).resolve().parents[1]
parts = []
for i in range(1, 7):
    parts.append((root / ".sitegen" / f"chunk{i:02d}.txt").read_text(encoding="utf-8").strip())

source = zlib.decompress(base64.b64decode("".join(parts)))
target = root / "build_site.py"
target.write_bytes(source)
exec(compile(source, str(target), "exec"), {"__file__": str(target), "__name__": "__main__"})
