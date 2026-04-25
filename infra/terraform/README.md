# Terraform

This folder contains a cost-aware Terraform starter.

## Principle

Write Terraform now, but apply only low-cost resources first.

## Apply Order

1. `bootstrap` for Terraform state backend
2. `dev-foundation` for `ECR` and optional `EC2`
3. `eks-dev` only when you are ready for higher cost

## Notes

- Do not enable `EKS` by default on a small credit balance.
- Do not use `NAT Gateway` in early learning environments unless required.
