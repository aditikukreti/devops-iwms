# Production Patterns

This project now includes the next Kubernetes patterns you would typically add before or during an EKS move:

- ingress
- TLS scaffolding
- external secret integration pattern

## Where It Lives

- [k8s/helm/inventory-platform/templates/ingress.yaml](/Users/aditikukreti/Desktop/devops%20project/k8s/helm/inventory-platform/templates/ingress.yaml:1)
- [k8s/helm/inventory-platform/templates/cluster-issuer.yaml](/Users/aditikukreti/Desktop/devops%20project/k8s/helm/inventory-platform/templates/cluster-issuer.yaml:1)
- [k8s/helm/inventory-platform/templates/external-secret.yaml](/Users/aditikukreti/Desktop/devops%20project/k8s/helm/inventory-platform/templates/external-secret.yaml:1)
- [k8s/helm/inventory-platform/values-ingress-example.yaml](/Users/aditikukreti/Desktop/devops%20project/k8s/helm/inventory-platform/values-ingress-example.yaml:1)

## What They Mean

### Ingress

Ingress gives you a single HTTP entrypoint instead of separate manual service access.

Current routing pattern:

- `/` -> frontend
- `/api` -> backend API
- `/health` -> backend API

### TLS

The chart includes a basic `cert-manager` `ClusterIssuer` example for local or early cluster experiments.

For EKS later, you would usually replace this with:

- `cert-manager` plus a real issuer, or
- AWS Load Balancer Controller with ACM-managed certificates

### External Secrets

The chart now supports a switch from inline Kubernetes `Secret` objects to `ExternalSecret`.

That is the pattern you would use later with:

- AWS Secrets Manager
- External Secrets Operator

## Important Note

These resources are scaffolding. They will not work unless the relevant controllers are installed:

- ingress controller
- cert-manager
- External Secrets Operator

## Local Rendering Example

```bash
helm template inventory-platform ./k8s/helm/inventory-platform \
  --namespace inventory-dev \
  -f ./k8s/helm/inventory-platform/values-dev.yaml \
  -f ./k8s/helm/inventory-platform/values-ingress-example.yaml
```

## EKS Direction

On AWS later, the likely production combination is:

- Argo CD for GitOps
- Helm chart for packaging
- AWS Load Balancer Controller for ingress
- ACM for certificates
- External Secrets Operator with AWS Secrets Manager
