# Architecture

## Recommended First Version

Keep the application small:

- `frontend`
- `backend-api`
- `worker`
- `postgres`
- `redis`

This is enough to demonstrate:

- inventory CRUD
- warehouse locations
- stock receiving and dispatch
- audit logging
- async job processing

## DevOps Layers

### App

- dashboard UI
- REST API
- background worker

### Containers

- Dockerfiles for each app
- local composition with `docker compose`

### Kubernetes

- manifests or Helm chart
- local `kind` cluster first

### Infrastructure

- Terraform for AWS resources

### Operations

- Ansible for EC2 bootstrap and utility automation

### Delivery

- GitHub Actions for CI
- Argo CD later for GitOps

## Cost-Safe AWS Plan

### Start Now

- `S3`
- `DynamoDB`
- `ECR`

### Add Carefully

- small `EC2`

### Add Later

- `EKS`
- `RDS`
- `ALB`
- `Route 53`

## Decision

For now, Kubernetes knowledge will come from `kind`, not from immediate `EKS` deployment.
