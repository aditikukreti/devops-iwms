# Helm Deployment

Use Helm when you want environment-specific Kubernetes deployments without duplicating YAML by hand.

## Chart Location

- [k8s/helm/inventory-platform/Chart.yaml](/Users/aditikukreti/Desktop/devops%20project/k8s/helm/inventory-platform/Chart.yaml:1)

## Values Files

- [values.yaml](/Users/aditikukreti/Desktop/devops%20project/k8s/helm/inventory-platform/values.yaml:1) for defaults
- [values-dev.yaml](/Users/aditikukreti/Desktop/devops%20project/k8s/helm/inventory-platform/values-dev.yaml:1) for local `kind`
- [values-staging.yaml](/Users/aditikukreti/Desktop/devops%20project/k8s/helm/inventory-platform/values-staging.yaml:1) for staging
- [values-prod.yaml](/Users/aditikukreti/Desktop/devops%20project/k8s/helm/inventory-platform/values-prod.yaml:1) for production

## Why Helm

- one reusable package for multiple environments
- cleaner than copying raw manifests for dev, staging, and prod
- a natural fit for GitOps and Argo CD later

## Local Usage

Build images first:

```bash
make k8s-build
```

If using `kind`, create and load images:

```bash
kind create cluster --name inventory-dev
kind load docker-image inventory-platform/backend-api:dev --name inventory-dev
kind load docker-image inventory-platform/frontend:dev --name inventory-dev
```

Install the chart:

```bash
helm upgrade --install inventory-platform ./k8s/helm/inventory-platform \
  --namespace inventory-dev \
  --create-namespace \
  -f ./k8s/helm/inventory-platform/values-dev.yaml
```

Check the release:

```bash
helm list -A
kubectl get pods -n inventory-dev
```

Port-forward:

```bash
kubectl port-forward -n inventory-dev svc/frontend 3000:80
kubectl port-forward -n inventory-dev svc/backend-api 8000:8000
```

## Later on AWS

For EKS later, the same chart can be reused with:

- ECR image repositories
- production tags
- ingress and secret integrations added later
