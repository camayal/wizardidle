"""Serve the game locally for testing, telling the browser never to cache anything.

    python tools/serve.py          (then open http://localhost:8000)
    python tools/serve.py 8080     (another port)

Python's plain `python -m http.server` sends no cache rules, so browsers may keep using old
copies of the code after it changes; with this server every reload gets the files on disk.
Standard library only.
"""
import functools, http.server, os, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    handler = functools.partial(NoCacheHandler, directory=REPO)
    print(f'Wizard Idle on http://localhost:{port} (no caching; Ctrl+C to stop)')
    http.server.ThreadingHTTPServer(('', port), handler).serve_forever()
