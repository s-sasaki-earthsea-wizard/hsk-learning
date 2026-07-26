PYTHON ?= python3
VENV ?= .venv

.PHONY: help install dev-web dev-api build run test clean

help: ## 利用できるコマンドを表示する
	@awk 'BEGIN {FS = ":.*## "}; /^[a-zA-Z_-]+:.*## / {printf "%-12s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Node.jsとPythonの依存関係をインストールする
	npm install
	$(PYTHON) -m venv $(VENV)
	$(VENV)/bin/pip install -r requirements.txt

dev-web: ## Vite開発サーバーを起動する
	npm run dev

dev-api: ## gTTS API開発サーバーを起動する
	FLASK_DEBUG=1 $(VENV)/bin/python app.py

build: ## 本番用フロントエンドをビルドする
	npm run build

run: build ## ビルドしてFlask本番相当サーバーを起動する
	$(VENV)/bin/python app.py

test: ## フロントエンドとAPIのテストを実行する
	npm test
	$(VENV)/bin/pytest

clean: ## 生成物とキャッシュを削除する
	rm -rf dist .audio-cache .pytest_cache
