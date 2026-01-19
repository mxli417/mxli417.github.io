---
title: "🥤MLFlow to go "
layout: post
---

# A Portable, Dockerized MLflow Tracking Server (with MinIO + Postgres)

Setting up a reliable, portable MLflow tracking server that actually works
outside of toy examples is harder than it should be. The official docs are 
helpful, but small misconfigurations — especially around Docker networking 
and artifact storage — can silently break things.

This repo is my cleaned-up, touch-and-go leaning version of a fully dockerized MLflow tracking stack, based on:

* **MLflow Tracking Server**
* **PostgreSQL** (backend store)
* **MinIO** (artifact store, S3-compatible)
* **Docker Compose**
* **Persistent volumes**

📲 Repo:
**[https://github.com/mxli417/Portable_MLFlow](https://github.com/mxli417/Portable_MLFlow)**

Big credit goes to [**Erik Dao**](https://erikdao.com/about/), whose original 
setup provided a solid baseline — this version fixes several subtle but 
important and interesting issues.

## ✨ What This Setup Provides

* ✅ Portable MLflow tracking server
* ✅ Remote experiment & model tracking
* ✅ Persistent artifact storage via MinIO
* ✅ Postgres-backed metadata store
* ✅ Works locally and can be deployed anywhere
* ✅ Clean separation of credentials via `.env`
* ✅ No hardcoded secrets
* ✅ Docker-only dependency

This is ideal for:

* Local experimentation
* Team-internal tracking
* CI/CD pipelines
* Prototyping MLOps setups
* Learning MLflow “the right way”

## 🏗️ Architecture Overview

```
MLflow Server
     │
     ├── PostgreSQL (experiments, runs, metadata)
     │
     └── MinIO (S3-compatible artifact store)
```

All services run in the same Docker network and communicate via service names 
(not `localhost`).

## 🏃‍➡️ Quick Start

### 1. Prepare environment variables

```bash
cp .env-template .env
```

Set:

* Postgres user / password
* MinIO access key / secret
* Bucket name
* MLflow tracking URI

### 2. Adjust if needed

For production or corporate usage:

* Rename the MinIO bucket
* Replace volume mounts with proper persistent storage
* Double-check credentials are injected only via env vars

### 3. Start everything

```bash
docker-compose up -d --build
```

Once running:

* MLflow UI → [http://localhost:5000](http://localhost:5000)
* MinIO UI → [http://localhost:9001](http://localhost:9001)


## 🧠 My key learnings & fixes

### 1. ❌ MLflow + MinIO + localhost = broken

The official MLflow docs reference `localhost` in examples.
This **does not work in Docker**, because containers resolve `localhost` to 
themselves.

✔️ **Fix:** Use the Docker service name (`minio`) instead.

---

### 2. ❌ MinIO bucket creation race condition

Erik Dao’s setup almost works — except:

* MinIO needs a few seconds to fully start
* Bucket creation runs too early
* Result: silent failure

✔️ **Fix:**
Add a startup delay or wait loop before creating the bucket.
This is a very common real-world Docker pitfall.

### 3. ❌ Mixed credential handling

The original docs:

* Use env vars in some places
* Hardcode credentials in others

✔️ **Fix:**
Everything is now controlled via `.env` for:

* PostgreSQL
* MLflow
* MinIO

This avoids accidental credential leaks and simplifies deployment.

### 4. 🧭 MLflow Registry Changes (Important)

MLflow is deprecating:

* **Model registry stages** (`Staging`, `Production`)

Moving toward:

* **Model version tags**
* **Model aliases**
* **Authentication-aware workflows**

This setup is compatible with the new direction and avoids legacy assumptions.

RFC:

> “Deprecating model registry stages in favor of model version tags and aliases.”

## 📜 Summary

My updated version provides an easy-to-use MLFlow setup that can be quite handy
if you're working in ML Engineering, work on GenAI or other usecases where
logging is helpful and necessary, regardless if you're a hobbyist or 
professional. Of course, my implementation also leaves for improvement, so feel 
free to work from my small blueprint and enhance the template regarding:

* Docker secrets instead of .env
* Health checks for all services
* MLflow authentication
* Version pinning
* Reverse proxy (Traefik / Nginx)
* CI integration

Feel free to use this as a starting point and adapt it to your needs.


## 📚 References

* Erik Dao’s original setup
  [https://erikdao.com/machine-learning/production-ready-mlflow-setup-in-your-local-machine/](https://erikdao.com/machine-learning/production-ready-mlflow-setup-in-your-local-machine/)

* MLflow Remote Tracking
  [https://mlflow.org/docs/latest/tracking/tutorials/remote-server.html](https://mlflow.org/docs/latest/tracking/tutorials/remote-server.html)

* MinIO
  [https://min.io/](https://min.io/)

* MinIO Client (mc)
  [https://min.io/docs/minio/linux/reference/minio-mc.html](https://min.io/docs/minio/linux/reference/minio-mc.html)
