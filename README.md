<div align="center">

# 🚀 Inventory & Warehouse Management System (IWMS)

### A Production-Inspired Full Stack DevOps Project

![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)

![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![Ansible](https://img.shields.io/badge/Ansible-EE0000?style=for-the-badge&logo=ansible&logoColor=white)
![Helm](https://img.shields.io/badge/Helm-0F1689?style=for-the-badge&logo=helm&logoColor=white)

![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=FF9900)
![GitHub%20Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Trivy](https://img.shields.io/badge/Security-Trivy-1904DA?style=for-the-badge)

---

**Inventory & Warehouse Management System built with modern DevOps practices including Docker, Kubernetes, Jenkins, Terraform, Helm, GitHub Actions, Ansible and AWS.**

</div>

---

# 📌 Project Overview

The **Inventory & Warehouse Management System (IWMS)** is a production-inspired full-stack application designed to demonstrate modern DevOps workflows.

The project combines:

- ⚛ React Frontend
- ⚡ FastAPI Backend
- 🗄 PostgreSQL Database

along with a complete DevOps pipeline consisting of:

- Docker Containerization
- Kubernetes Orchestration
- CI/CD using Jenkins & GitHub Actions
- Infrastructure as Code using Terraform
- Configuration Management using Ansible
- Helm Deployment
- Security Scanning using Trivy
- AWS Cloud Deployment

---

# 🏗 Architecture

```text
                     Developer
                          │
                          ▼
                  GitHub Repository
                          │
                          ▼
                Jenkins / GitHub Actions
                          │
             ┌────────────┴────────────┐
             │                         │
     React Build                 FastAPI Build
             │                         │
             └────────────┬────────────┘
                          │
                  Docker Image Build
                          │
                          ▼
                 Trivy Security Scan
                          │
                          ▼
                   Smoke Testing
                          │
                          ▼
              Push Docker Images to ECR
                          │
                          ▼
                   Helm Deployment
                          │
                          ▼
                 Kubernetes Cluster
                          │
       ┌──────────────────┴──────────────────┐
       │                                     │
 React Frontend                       FastAPI Backend
                                             │
                                             ▼
                                       PostgreSQL
```

---

# 🚀 Tech Stack

## Frontend

- React.js
- Tailwind CSS
- Axios

---

## Backend

- FastAPI
- Python
- Pydantic

---

## Database

- PostgreSQL

---

## DevOps

- Docker
- Docker Compose
- Kubernetes
- Helm
- Jenkins
- GitHub Actions
- Terraform
- Ansible
- Trivy

---

## Cloud

- AWS EC2
- Amazon ECR
- Amazon S3
- CloudWatch

---

# 📂 Folder Structure

```text
IWMS
│
├── frontend/
│
├── backend/
│
├── kubernetes/
│
├── terraform/
│
├── ansible/
│
├── helm/
│
├── database/
│
├── docker-compose.yml
│
├── Jenkinsfile
│
└── README.md
```

---

# ⚙ CI/CD Workflow

The project follows a modern CI/CD pipeline.

```text
Developer Push

↓

GitHub

↓

Jenkins Trigger

↓

Checkout Code

↓

Build Frontend

↓

Terraform Validation

↓

Docker Build

↓

Filesystem Security Scan (Trivy)

↓

Docker Image Security Scan

↓

Smoke Test

↓

Push Images

↓

Deploy using Helm

↓

Kubernetes
```

---

# 🔒 Security

Security checks are integrated directly into the CI pipeline.

### Trivy performs

- Filesystem Scan
- Docker Image Scan
- Secret Detection
- Vulnerability Scanning
- Misconfiguration Detection

before deployment.

---

# ☁ Infrastructure as Code

Infrastructure provisioning is automated using **Terraform**.

Terraform provisions:

- AWS Infrastructure
- Networking
- Storage
- Cloud Resources

using declarative configuration files.

---

# ⚙ Configuration Management

Server configuration is automated using **Ansible**.

Ansible is used for:

- Package Installation
- Server Configuration
- Environment Setup
- Application Deployment

---

# ☸ Kubernetes

The application is deployed using Kubernetes.

Resources include:

- Deployments
- Pods
- ReplicaSets
- Services
- ConfigMaps
- Secrets

Deployment is simplified using **Helm Charts**.

---

# 📈 Monitoring

Application monitoring includes:

- AWS CloudWatch
- Health Checks
- Logs
- Smoke Testing

---

# ✨ Features

✅ Inventory Management

✅ Warehouse Management

✅ Product Tracking

✅ Authentication

✅ REST APIs

✅ Dockerized Deployment

✅ CI/CD Pipeline

✅ Kubernetes Deployment

✅ Infrastructure as Code

✅ Security Scanning

---

# ▶ Running the Project

## Clone Repository

```bash
git clone https://github.com/<YOUR_USERNAME>/devops-iwms.git

cd devops-iwms
```

---

## Docker

```bash
docker compose up --build
```

---

## Kubernetes

```bash
kubectl apply -f kubernetes/
```

---

## Terraform

```bash
terraform init

terraform plan

terraform apply
```

---

## Jenkins

Run the Jenkins Pipeline.

The pipeline automatically performs:

- Build
- Security Scan
- Smoke Test
- Deployment

---

# 📸 Screenshots

## Dashboard

> Add Screenshot Here

---

## Jenkins Pipeline

> Add Screenshot Here

---

## Kubernetes Pods

> Add Screenshot Here

---

## Trivy Scan

> Add Screenshot Here

---

# 🎯 Future Enhancements

- Prometheus Monitoring
- Grafana Dashboards
- Horizontal Pod Autoscaler
- Redis Caching
- ELK Stack Logging
- Blue-Green Deployment
- Canary Deployment
- ArgoCD GitOps

---


