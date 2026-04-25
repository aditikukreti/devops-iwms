# Inventory and Warehouse Management System

This project is a DevOps-first blueprint for building an inventory and warehouse management system on AWS using Terraform, Ansible, Docker, and Kubernetes.

Important:
This starter is intentionally optimized for a small AWS credit balance. Build locally first, then move selective parts to AWS.

## Start Here

- Read [docs/low-cost-roadmap.md](/Users/aditikukreti/Desktop/devops%20project/docs/low-cost-roadmap.md:1)
- Review [docs/architecture.md](/Users/aditikukreti/Desktop/devops%20project/docs/architecture.md:1)
- Use [docker-compose.yml](/Users/aditikukreti/Desktop/devops%20project/docker-compose.yml:1) for local development
- Use [infra/terraform/README.md](/Users/aditikukreti/Desktop/devops%20project/infra/terraform/README.md:1) before applying any AWS resources

## Current App Skeleton

- [apps/backend-api/app/main.py](/Users/aditikukreti/Desktop/devops%20project/apps/backend-api/app/main.py:1) contains a PostgreSQL-backed FastAPI starter
- [apps/frontend/src/App.jsx](/Users/aditikukreti/Desktop/devops%20project/apps/frontend/src/App.jsx:1) contains a starter React dashboard
- [apps/backend-api/Dockerfile](/Users/aditikukreti/Desktop/devops%20project/apps/backend-api/Dockerfile:1) and [apps/frontend/Dockerfile](/Users/aditikukreti/Desktop/devops%20project/apps/frontend/Dockerfile:1) containerize both apps

## Local Run

```bash
docker compose up --build
```

Then open:

- frontend at `http://localhost:3000`
- backend at `http://localhost:8000/health`

Current API endpoints:

- `GET /api/summary`
- `GET /api/items`
- `POST /api/items`
- `PUT /api/items/{sku}`
- `DELETE /api/items/{sku}`
- `POST /api/items/{sku}/adjust`
- `GET /api/warehouses`
- `POST /api/warehouses`
- `DELETE /api/warehouses/{code}`
- `GET /api/movements`
- `POST /api/movements`

Migration starter:

- [apps/backend-api/alembic.ini](/Users/aditikukreti/Desktop/devops%20project/apps/backend-api/alembic.ini:1)
- [apps/backend-api/alembic/env.py](/Users/aditikukreti/Desktop/devops%20project/apps/backend-api/alembic/env.py:1)
- [apps/backend-api/alembic/versions/0001_initial_schema.py](/Users/aditikukreti/Desktop/devops%20project/apps/backend-api/alembic/versions/0001_initial_schema.py:1)
- [apps/backend-api/start.sh](/Users/aditikukreti/Desktop/devops%20project/apps/backend-api/start.sh:1) now waits for Postgres and runs `alembic upgrade head` before starting the API

## DevOps Automation

- [Makefile](/Users/aditikukreti/Desktop/devops%20project/Makefile:1) adds simple local workflows
- [scripts/smoke-test.sh](/Users/aditikukreti/Desktop/devops%20project/scripts/smoke-test.sh:1) verifies frontend and API basics
- [.github/workflows/ci.yml](/Users/aditikukreti/Desktop/devops%20project/.github/workflows/ci.yml:1) builds the frontend, runs the Docker stack, executes smoke tests, and checks Terraform formatting
- [Jenkinsfile](/Users/aditikukreti/Desktop/devops%20project/Jenkinsfile:1) adds the Jenkins pipeline your college asked for
- [trivy.yaml](/Users/aditikukreti/Desktop/devops%20project/trivy.yaml:1) configures Trivy security scanning for CI
- [docs/kind-deployment.md](/Users/aditikukreti/Desktop/devops%20project/docs/kind-deployment.md:1) shows the next Kubernetes step before AWS
- [docs/helm-deployment.md](/Users/aditikukreti/Desktop/devops%20project/docs/helm-deployment.md:1) adds the Helm-based deployment path
- [docs/argocd-deployment.md](/Users/aditikukreti/Desktop/devops%20project/docs/argocd-deployment.md:1) adds the GitOps deployment path
- [docs/production-patterns.md](/Users/aditikukreti/Desktop/devops%20project/docs/production-patterns.md:1) adds ingress, TLS, and external secret patterns
- [docs/aws-bootstrap.md](/Users/aditikukreti/Desktop/devops%20project/docs/aws-bootstrap.md:1) covers the first low-cost AWS Terraform flow
- [docs/jenkins.md](/Users/aditikukreti/Desktop/devops%20project/docs/jenkins.md:1) documents the Jenkins CI/CD pipeline
- [docs/ansible-jenkins-role.md](/Users/aditikukreti/Desktop/devops%20project/docs/ansible-jenkins-role.md:1) explains how Jenkins and Ansible split responsibilities

Useful commands:

```bash
make rebuild
make smoke
make logs
make down
make k8s-build
make helm-template
```

CI security coverage now includes:

- Trivy filesystem scans for vulnerabilities, secrets, and IaC misconfigurations
- Trivy image scans for the backend and frontend containers

Jenkins pipeline coverage includes:

- frontend build
- Terraform format check
- Docker image builds
- Trivy scans
- Docker Compose smoke test

## Kubernetes Next Step

Before using AWS `EKS`, deploy this stack to a local `kind` cluster:

- manifests live in [k8s/base](/Users/aditikukreti/Desktop/devops%20project/k8s/base/kustomization.yaml:1)
- instructions live in [docs/kind-deployment.md](/Users/aditikukreti/Desktop/devops%20project/docs/kind-deployment.md:1)

## Helm Packaging

The chart for reusable Kubernetes deployments lives in:

- [k8s/helm/inventory-platform/Chart.yaml](/Users/aditikukreti/Desktop/devops%20project/k8s/helm/inventory-platform/Chart.yaml:1)
- [docs/helm-deployment.md](/Users/aditikukreti/Desktop/devops%20project/docs/helm-deployment.md:1)

Install it with:

```bash
helm upgrade --install inventory-platform ./k8s/helm/inventory-platform --namespace inventory-dev --create-namespace -f ./k8s/helm/inventory-platform/values-dev.yaml
```

## GitOps Next Step

Argo CD application definitions live in:

- [k8s/argocd/inventory-platform-dev.yaml](/Users/aditikukreti/Desktop/devops%20project/k8s/argocd/inventory-platform-dev.yaml:1)
- [k8s/argocd/inventory-platform-staging.yaml](/Users/aditikukreti/Desktop/devops%20project/k8s/argocd/inventory-platform-staging.yaml:1)
- [k8s/argocd/inventory-platform-prod.yaml](/Users/aditikukreti/Desktop/devops%20project/k8s/argocd/inventory-platform-prod.yaml:1)
- [docs/argocd-deployment.md](/Users/aditikukreti/Desktop/devops%20project/docs/argocd-deployment.md:1)

## Production Readiness Patterns

The Helm chart also now includes optional scaffolding for:

- ingress
- TLS
- external secrets

See:

- [docs/production-patterns.md](/Users/aditikukreti/Desktop/devops%20project/docs/production-patterns.md:1)

## AWS Next Step

The first low-cost AWS move is:

- Terraform bootstrap for `S3` remote state
- `DynamoDB` lock table
- `ECR` repositories

See:

- [docs/aws-bootstrap.md](/Users/aditikukreti/Desktop/devops%20project/docs/aws-bootstrap.md:1)
- [infra/terraform/environments/bootstrap/terraform.tfvars.example](/Users/aditikukreti/Desktop/devops%20project/infra/terraform/environments/bootstrap/terraform.tfvars.example:1)
- [infra/terraform/environments/dev-foundation/backend.hcl.example](/Users/aditikukreti/Desktop/devops%20project/infra/terraform/environments/dev-foundation/backend.hcl.example:1)

## Goal

Build a production-style system that covers:

- inventory tracking
- warehouse operations
- user and role management
- order receiving and dispatch
- stock movement and audit logs
- monitoring, CI/CD, security, backups, and infrastructure automation

## Recommended Architecture

### Application Layer

- `frontend`: React or Next.js dashboard
- `api-gateway`: entry point for clients
- `inventory-service`: stock CRUD, SKU management, stock levels
- `warehouse-service`: bins, racks, locations, movement tracking
- `order-service`: inward/outward movement, picking, packing, dispatch
- `auth-service`: users, roles, JWT/OIDC
- `notification-service`: email, alerts, low-stock notifications
- `reporting-service`: analytics and dashboards

### Data Layer

- `PostgreSQL (RDS or in-cluster for dev)`: transactional data
- `Redis`: caching and session support
- `S3`: invoices, reports, exports, backups
- `RabbitMQ or Kafka`: async events between services

### Platform Layer

- `AWS EKS`: Kubernetes cluster
- `AWS ECR`: container registry
- `AWS VPC`: networking
- `AWS ALB / Ingress`: public routing
- `AWS IAM`: access control
- `AWS CloudWatch`: logs and metrics
- `Prometheus + Grafana`: observability
- `Argo CD`: GitOps delivery
- `GitHub Actions / GitLab CI`: CI pipeline
- `Terraform`: infrastructure as code
- `Ansible`: configuration and operational automation

## Why This Stack

- `Terraform` provisions AWS consistently and repeatably.
- `Ansible` handles server bootstrap, tool installation, and operational runbooks.
- `Docker` standardizes app packaging.
- `Kubernetes` gives scaling, self-healing, and rolling deployments.
- `Argo CD` makes deployment Git-driven and auditable.
- `Prometheus/Grafana` gives visibility into system health.

## AWS Services You Should Use

- `EKS` for Kubernetes
- `ECR` for images
- `RDS PostgreSQL` for primary database
- `ElastiCache Redis` for caching
- `S3` for exports and backups
- `IAM` for permissions
- `VPC`, `Subnets`, `NAT`, `Security Groups` for networking
- `Route 53` for DNS
- `ACM` for TLS certificates
- `ALB` via AWS Load Balancer Controller
- `Secrets Manager` or `SSM Parameter Store` for secrets
- `CloudWatch` for baseline logs/metrics

## DevOps Toolchain

### Core

- `Git`
- `GitHub`
- `Docker`
- `Kubernetes`
- `Helm`
- `Terraform`
- `Ansible`

### CI/CD

- `GitHub Actions`
- `Argo CD`

### Observability

- `Prometheus`
- `Grafana`
- `Loki` or `ELK`
- `CloudWatch`

### Security

- `Trivy` for image and IaC scanning
- `Checkov` or `tfsec` for Terraform scanning
- `SonarQube` optional for code quality
- `Sealed Secrets` or `External Secrets Operator`

### Kubernetes Essentials

- `Ingress NGINX` or AWS ALB Ingress
- `cert-manager`
- `metrics-server`
- `Horizontal Pod Autoscaler`
- `Cluster Autoscaler` or `Karpenter`

## Suggested Repository Structure

```text
inventory-warehouse-platform/
├── apps/
│   ├── frontend/
│   ├── api-gateway/
│   ├── inventory-service/
│   ├── warehouse-service/
│   ├── order-service/
│   └── auth-service/
├── infra/
│   ├── terraform/
│   │   ├── modules/
│   │   ├── environments/
│   │   │   ├── dev/
│   │   │   ├── staging/
│   │   │   └── prod/
│   └── ansible/
│       ├── inventories/
│       ├── playbooks/
│       └── roles/
├── k8s/
│   ├── base/
│   ├── helm/
│   └── argocd/
├── cicd/
│   └── github-actions/
├── docs/
└── scripts/
```

## Practical Build Plan

### Phase 1: Design and Scope

Define the first release:

- login and roles
- product/SKU management
- warehouse location management
- stock in / stock out
- stock transfer between locations
- low stock alerts
- audit trail

Keep version 1 simple but complete.

### Phase 2: Build Locally with Containers

Start with:

- one frontend
- one backend API
- PostgreSQL
- Redis

Use `docker-compose` for local development before Kubernetes.

### Phase 3: Provision AWS with Terraform

Create Terraform for:

- S3 bucket for Terraform state
- DynamoDB for Terraform locking
- ECR
- optional low-cost EC2
- VPC, EKS, RDS, and Redis later when budget allows

Use remote state:

- `S3` backend
- `DynamoDB` state locking

### Phase 4: Use Ansible for Bootstrap and Ops

Use Ansible for:

- configuring bastion/utility EC2 if needed
- installing kubectl, helm, aws cli on admin hosts
- database backup jobs
- operational scripts
- patching and maintenance automation

Important note:
Ansible is less central if you go fully managed with EKS/RDS, but it is still useful for operational automation and host configuration.

### Phase 5: Containerize Everything

Each service should have:

- `Dockerfile`
- health checks
- environment variable config
- non-root container user
- small base image

Push images to `ECR`.

### Phase 6: Deploy to Kubernetes

Use:

- local `kind` cluster first
- then `Helm` for packaging apps
- then `Argo CD` for GitOps sync
- separate namespaces: `dev`, `staging`, `prod`
- Kubernetes `Secrets` or external secret integration
- `ConfigMaps` for non-secret config

### Phase 7: CI/CD

CI pipeline should:

- run lint/tests
- build Docker image
- scan image with Trivy
- push image to ECR
- update Helm values or image tag

CD pipeline should:

- let Argo CD sync from Git to cluster
- support rollback
- support environment promotion

### Phase 8: Observability and Reliability

Add:

- Prometheus metrics
- Grafana dashboards
- centralized logs
- readiness and liveness probes
- autoscaling
- backups
- alerting for CPU, memory, errors, and low stock processing failures

## Recommended Delivery Model

### Development Flow

1. Developer pushes code.
2. CI runs tests and scans.
3. Docker image is built and pushed to ECR.
4. GitOps manifest or Helm values are updated.
5. Argo CD deploys to EKS.
6. Prometheus/Grafana/CloudWatch monitor runtime behavior.

## Security Basics

- use least-privilege IAM
- do not store secrets in Git
- use `Secrets Manager`, `SSM`, or `External Secrets`
- enable image scanning
- scan Terraform and Kubernetes manifests
- enforce HTTPS everywhere
- use private subnets for databases
- enable backups and retention

## Environment Strategy

- `dev`: low cost, smaller nodes, test features
- `staging`: production-like, integration/UAT
- `prod`: HA, stricter policies, backup and alerting

## Cost-Aware Learning Path

If you are learning and want to avoid high AWS costs:

- start with `Docker Compose`
- move to local `kind` or `minikube`
- then deploy to AWS `EKS`
- use one small environment first, usually `dev`

## Best First Milestone

Build this first:

- React frontend
- one backend API
- PostgreSQL
- Docker setup
- Terraform for state backend + ECR
- local Kubernetes deployment for app and API
- GitHub Actions CI
- Argo CD later
- Prometheus + Grafana later

That gives you a real end-to-end DevOps project you can show in a portfolio or resume without burning credits too early.

## What To Learn In Order

1. `Git` and repo structure
2. `Docker`
3. `Docker Compose`
4. backend API and database design
5. `Terraform` on AWS
6. `Kubernetes`
7. `Helm`
8. `GitHub Actions`
9. `Argo CD`
10. monitoring and security
11. `Ansible`

## Recommended MVP Features

- product catalog
- warehouse locations
- stock receiving
- stock dispatch
- stock transfers
- dashboard with current stock
- reorder threshold alerts
- audit logs
- role-based access

## Common Mistakes To Avoid

- starting with too many microservices
- using Kubernetes before your app works in Docker
- skipping monitoring
- hardcoding secrets
- mixing app code and infrastructure code without structure
- making Terraform environments inconsistent

## Strong Recommendation

Start as a modular monolith or 2-3 services, not 10 services.

For example:

- `frontend`
- `backend-api`
- `worker`

Then split services later when the domain becomes clearer.

## Next Step

Create the repository with:

- app skeleton
- Terraform skeleton
- Ansible skeleton
- Docker setup
- Kubernetes manifests
- GitHub Actions starter pipeline

This is the fastest way to turn the idea into a real DevOps project.
