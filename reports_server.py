import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse
import time

class Handler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == '/reports':
            # Return a simple list of reports; newest first
            now = int(time.time() * 1000)
            reports = [
                {
                    "id": "remote-1",
                    "overall": 0.45,
                    "confidence": 0.9,
                    "verdict": "Good",
                    "strengths_html": "<ul><li>Communication</li></ul>",
                    "improvements_html": "<ul><li>Clarity</li></ul>",
                    "created_at": now
                }
            ]
            self._set_headers(200)
            self.wfile.write(json.dumps(reports).encode('utf-8'))
            return

        # fallback 404
        self._set_headers(404)
        self.wfile.write(json.dumps({"error": "not found"}).encode('utf-8'))

if __name__ == '__main__':
    server_address = ('127.0.0.1', 5005)
    httpd = HTTPServer(server_address, Handler)
    print('Mock reports server running at http://127.0.0.1:5005')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print('Server stopped')
