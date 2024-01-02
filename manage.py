#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
from pathlib import Path
import sys

from dotenv import load_dotenv


def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "google_keep.settings")
    try:
        # load_dotenv(".env.prod")
        env_file = ".env" if not os.environ.get("ENVIRONMENT") else ".env.prod"

        dotenv_path = os.path.join(Path(os.path.dirname(__file__)).resolve().parent, env_file)
        load_dotenv(dotenv_path, override=True)

        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
