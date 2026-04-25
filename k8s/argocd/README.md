# Argo CD

This folder contains GitOps application definitions for deploying the inventory platform through Argo CD.

## Goal

Use Git as the source of truth for Kubernetes deployments.

## Flow

1. Push chart or values changes to Git.
2. Argo CD detects the Git change.
3. Argo CD syncs the Helm release into the target cluster.

## Why This Matters

- auditable deployment history
- rollback through Git
- cleaner promotion from dev to staging to prod
- a natural fit for EKS later
