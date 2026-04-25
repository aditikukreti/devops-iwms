# Argo CD Deployment

Argo CD is the next DevOps step after Helm if you want GitOps-style delivery.

## What Is Included

- [k8s/argocd/inventory-platform-dev.yaml](/Users/aditikukreti/Desktop/devops%20project/k8s/argocd/inventory-platform-dev.yaml:1)
- [k8s/argocd/inventory-platform-staging.yaml](/Users/aditikukreti/Desktop/devops%20project/k8s/argocd/inventory-platform-staging.yaml:1)
- [k8s/argocd/inventory-platform-prod.yaml](/Users/aditikukreti/Desktop/devops%20project/k8s/argocd/inventory-platform-prod.yaml:1)

These Argo CD `Application` objects point to the Helm chart and environment-specific values files.

## Before You Use Them

Update:

- `repoURL` to your actual GitHub repository
- image repositories in `values-staging.yaml` and `values-prod.yaml`

## Typical Flow

1. Install Argo CD into a Kubernetes cluster.
2. Apply one of the application manifests.
3. Argo CD pulls the Helm chart from Git.
4. Argo CD deploys the app to the target namespace.

## Example

Once Argo CD is installed:

```bash
kubectl apply -f k8s/argocd/inventory-platform-dev.yaml
```

## Why This Is Better Than Manual Helm

- deployments are driven by Git commits
- drift gets corrected automatically
- promotion becomes a values-file or branch strategy
- this matches how many real teams run Kubernetes on AWS
