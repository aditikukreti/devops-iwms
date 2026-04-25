# Local Kubernetes Deployment

This is the next DevOps step after `docker compose`: run the platform in a local Kubernetes cluster with `kind`.

## Why `kind` First

- no AWS cost
- real Kubernetes objects
- same workflow style you will use later on EKS
- safer place to learn probes, services, config, and rollout behavior

## What Is Included

The manifests in [k8s/base](/Users/aditikukreti/Desktop/devops%20project/k8s/base/kustomization.yaml:1) now include:

- namespace
- PostgreSQL deployment, service, PVC, and secret
- backend API deployment and service
- frontend deployment and service
- config for backend database connection
- readiness and liveness probes

## Prerequisites

Install these locally:

- `docker`
- `kubectl`
- `kind`

If `kind` is missing, you will see:

```bash
zsh: command not found: kind
```

If `kubectl` says `localhost:8080 was refused`, that usually means no Kubernetes cluster is running yet.

## Install `kind`

On macOS with Homebrew:

```bash
brew install kind
```

Then confirm:

```bash
kind version
kubectl version --client
```

## Build Images

Build the same images you already use for Docker Compose:

```bash
docker build -t inventory-platform/backend-api:dev ./apps/backend-api
docker build -t inventory-platform/frontend:dev ./apps/frontend
```

## Create Cluster

```bash
kind create cluster --name inventory-dev
```

After this succeeds, `kubectl` should be able to talk to the cluster.

## Load Images Into `kind`

```bash
kind load docker-image inventory-platform/backend-api:dev --name inventory-dev
kind load docker-image inventory-platform/frontend:dev --name inventory-dev
```

## Deploy Manifests

```bash
kubectl apply -k k8s/base
```

## Check Status

```bash
kubectl get pods -n inventory-dev
kubectl get svc -n inventory-dev
```

## Access the App

Frontend is exposed as a NodePort on `30080`.

Use port-forwarding for a simpler local flow:

```bash
kubectl port-forward -n inventory-dev svc/frontend 3000:80
kubectl port-forward -n inventory-dev svc/backend-api 8000:8000
```

Then open:

- `http://localhost:3000`
- `http://localhost:8000/health`

## Useful Debug Commands

```bash
kubectl logs -n inventory-dev deploy/backend-api
kubectl logs -n inventory-dev deploy/frontend
kubectl logs -n inventory-dev deploy/postgres
kubectl describe pod -n inventory-dev <pod-name>
```

## Clean Up

```bash
kubectl delete -k k8s/base
kind delete cluster --name inventory-dev
```

## Why This Matters For AWS

Once this works cleanly in `kind`, moving to AWS `EKS` becomes much easier because:

- the deployments already exist
- probes already exist
- config and secret patterns are started
- services are already defined

That lets AWS become mostly an infrastructure problem handled by Terraform, instead of debugging both the app and the platform at the same time.
