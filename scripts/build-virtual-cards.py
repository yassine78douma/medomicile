#!/usr/bin/env python3
"""Single deterministic build entrypoint, shared by local edits and CI."""
import runpy
from pathlib import Path

HERE = Path(__file__).resolve().parent
for script in ['generate-professional-cards.py', 'build-card-directories.py']:
    runpy.run_path(str(HERE/script), run_name='__main__')
