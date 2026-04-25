# Low-Cost Roadmap

This project is designed to stay within a small AWS budget.

## Budget Strategy

Do not start with full production AWS services.

Start in this order:

1. Local development with `Docker Compose`
2. Local Kubernetes with `kind`
3. AWS foundation only with `Terraform`
4. One tiny AWS workload for testing
5. EKS only after the app and CI/CD are working

## Why

`EKS`, `NAT Gateway`, `RDS`, `ElastiCache`, and load balancers can consume credits quickly.

With only about `$40` in credits, the safest path is:

- local app development
- local Kubernetes learning
- Terraform code written now but applied later
- AWS used only for lightweight experiments first

## Cost Risks To Avoid Early

- `EKS` control plane charges
- `NAT Gateway` hourly charges
- `RDS` multi-AZ
- `ElastiCache`
- public load balancers
- leaving resources running overnight

## Recommended Early AWS Usage

Use AWS first for:

- `S3` backend for Terraform state
- `DynamoDB` for state locking
- `ECR` for container registry
- one small `EC2` utility or demo instance only if needed

Delay these until later:

- `EKS`
- `RDS`
- `Redis`
- `ALB`

## Lowest-Risk Learning Path

### Stage 1

- build app locally
- run with `docker compose`
- add tests

### Stage 2

- run app on local `kind`
- learn `kubectl`, `Deployment`, `Service`, `ConfigMap`, `Secret`, `Ingress`

### Stage 3

- create AWS account structure
- configure IAM and AWS CLI
- create Terraform state bucket/table
- create ECR

### Stage 4

- optionally launch one `t3.micro` or similar low-cost EC2
- use Ansible to configure it

### Stage 5

- only then evaluate `EKS`

## Cost Guardrails

- always destroy test resources after use
- use one `dev` environment only at first
- avoid highly available configurations in learning mode
- tag every resource with project and owner
- set AWS Budgets alerts
- prefer managed services only when they are part of the learning goal
