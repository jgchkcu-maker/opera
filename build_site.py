"""Validation entry point for the curated customer-first Opera-print static site.

The original prototype used this file as a large HTML generator. The redesigned site is now
maintained as readable static pages so UX changes are not overwritten by a stale generator.
Running this script performs build-time consistency checks and exits non-zero on an invalid tree.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REQUIRED = [
    "index.html", "services.html", "builder.html", "postpress.html", "contacts.html",
    "capabilities.html", "prepress.html", "requirements.html", "delivery.html",
    "assets/styles.css", "assets/enhancements.css", "assets/app.js", "assets/builder.js",
    "assets/builder-ux.js", "assets/catalog.js",
]
MARKERS = {
    "index.html": "Что хотите напечатать?",
    "services.html": "Реклама и раздача",
    "builder.html": "4. Отделка и итог",
    "postpress.html": "postpechatnye-raboty/15.jpg",
    "assets/app.js": "menu-open",
    "assets/enhancements.css": "prefers-reduced-motion: reduce",
}


def main():
    errors = []
    for name in REQUIRED:
        if not (ROOT / name).exists():
            errors.append(f"missing required file: {name}")
    for name, marker in MARKERS.items():
        path = ROOT / name
        if path.exists() and marker not in path.read_text(encoding="utf-8"):
            errors.append(f"{name}: missing customer-first marker {marker!r}")
    if errors:
        raise SystemExit("Build validation failed:\n- " + "\n- ".join(errors))
    print(f"Customer-first site validation passed ({len(REQUIRED)} required files).")


if __name__ == "__main__":
    main()
