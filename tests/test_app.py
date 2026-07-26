from __future__ import annotations

from pathlib import Path

import app as app_module


class FakeGtts:
    def __init__(self, text: str, lang: str, slow: bool):
        self.text = text
        self.lang = lang
        self.slow = slow

    def save(self, destination: str) -> None:
        Path(destination).write_bytes(b"ID3-fake-mp3")


def test_health_check():
    client = app_module.app.test_client()
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.get_json() == {
        "status": "ok",
        "speech": "gTTS",
        "language": "zh-CN",
    }


def test_speech_requires_text():
    client = app_module.app.test_client()
    response = client.get("/api/speech")

    assert response.status_code == 400
    assert "error" in response.get_json()


def test_speech_rejects_long_text():
    client = app_module.app.test_client()
    response = client.get("/api/speech", query_string={"text": "字" * 241})

    assert response.status_code == 400


def test_speech_generates_and_caches_mp3(monkeypatch, tmp_path):
    monkeypatch.setattr(app_module, "CACHE_DIR", tmp_path)
    monkeypatch.setattr(app_module, "gTTS", FakeGtts)
    client = app_module.app.test_client()

    first_response = client.get(
        "/api/speech",
        query_string={"text": "你好", "slow": "true"},
    )
    second_response = client.get(
        "/api/speech",
        query_string={"text": "你好", "slow": "true"},
    )

    assert first_response.status_code == 200
    assert first_response.mimetype == "audio/mpeg"
    assert first_response.data == b"ID3-fake-mp3"
    assert second_response.status_code == 200
    assert len(list(tmp_path.glob("*.mp3"))) == 1
