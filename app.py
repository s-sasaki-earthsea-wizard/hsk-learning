from __future__ import annotations

import hashlib
import os
import tempfile
from pathlib import Path

from flask import Flask, jsonify, request, send_file, send_from_directory
from gtts import gTTS


BASE_DIR = Path(__file__).resolve().parent
DIST_DIR = BASE_DIR / "dist"
CACHE_DIR = Path(os.environ.get("HANZI_AUDIO_CACHE", BASE_DIR / ".audio-cache"))
MAX_SPEECH_LENGTH = 240

app = Flask(__name__)


def create_speech_file(text: str, slow: bool) -> Path:
    """Create or retrieve a cached Mandarin MP3 file."""
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_key = hashlib.sha256(f"zh-CN:{slow}:{text}".encode()).hexdigest()
    audio_path = CACHE_DIR / f"{cache_key}.mp3"
    if audio_path.exists():
        return audio_path

    temporary_file = tempfile.NamedTemporaryFile(
        dir=CACHE_DIR,
        prefix="speech-",
        suffix=".mp3",
        delete=False,
    )
    temporary_path = Path(temporary_file.name)
    temporary_file.close()

    try:
        gTTS(text=text, lang="zh-CN", slow=slow).save(str(temporary_path))
        temporary_path.replace(audio_path)
    except Exception:
        temporary_path.unlink(missing_ok=True)
        raise

    return audio_path


@app.get("/api/health")
def health_check():
    return jsonify({"status": "ok", "speech": "gTTS", "language": "zh-CN"})


@app.get("/api/speech")
def speech():
    text = request.args.get("text", "").strip()
    slow = request.args.get("slow", "false").lower() in {"1", "true", "yes"}

    if not text:
        return jsonify({"error": "読み上げる中国語が空だよ。"}), 400
    if len(text) > MAX_SPEECH_LENGTH:
        return jsonify({"error": "読み上げる文章が長すぎるよ。"}), 400

    try:
        audio_path = create_speech_file(text, slow)
    except Exception:
        app.logger.exception("gTTS speech generation failed")
        return jsonify(
            {"error": "gTTSに接続できなかったよ。通信状態を確認してもう一度試してね。"}
        ), 503

    response = send_file(audio_path, mimetype="audio/mpeg", conditional=True)
    response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
    return response


@app.get("/")
def serve_index():
    index_path = DIST_DIR / "index.html"
    if not index_path.exists():
        return jsonify(
            {
                "error": "フロントエンドが未ビルドだよ。先に npm run build を実行してね。"
            }
        ), 503
    return send_file(index_path)


@app.get("/<path:path>")
def serve_frontend(path: str):
    requested_path = DIST_DIR / path
    if requested_path.is_file():
        return send_from_directory(DIST_DIR, path)
    return serve_index()


if __name__ == "__main__":
    debug_mode = os.environ.get("FLASK_DEBUG", "").lower() in {"1", "true", "yes"}
    app.run(host="127.0.0.1", port=5001, debug=debug_mode)
