import argparse
import os
from pathlib import Path
import shutil
import subprocess

from dotenv import dotenv_values


def main():
    module = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser()
    parser.add_argument("--env-file", type=Path, default=module.parent / "config" / ".env")
    args = parser.parse_args()

    maven = shutil.which("mvn")
    if maven is None and os.name == "nt":
        cache = Path.home() / ".m2" / "wrapper" / "dists"
        maven = next(cache.rglob("bin/mvn.cmd"), None)
    if maven is None:
        parser.error("Install Maven and add it to PATH.")

    config = dotenv_values(args.env_file) if args.env_file.is_file() else {}
    env = os.environ.copy()
    for key in ("DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD", "TOSS_SECRET_KEY"):
        if config.get(key) is not None:
            env.setdefault(key, config[key])
    missing = [key for key in ("DB_NAME", "DB_USER", "DB_PASSWORD") if not env.get(key)]
    if missing:
        parser.error(f"Missing DB settings: {', '.join(missing)}. Check {args.env_file}.")

    return subprocess.call([str(maven), "-f", str(module / "pom.xml"), "spring-boot:run"], env=env)


if __name__ == "__main__":
    raise SystemExit(main())
