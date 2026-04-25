# Jenkins Pipeline

Your college asked for Jenkins, so this repo now includes a real Jenkins pipeline.

## Files

- [Jenkinsfile](/Users/aditikukreti/Desktop/devops%20project/Jenkinsfile:1)

## What The Pipeline Does

The pipeline currently runs:

1. checkout
2. frontend build
3. Terraform format check
4. backend and frontend Docker image builds
5. Trivy filesystem scan
6. Trivy image scans
7. Docker Compose smoke test

It also includes placeholders for:

- `ECR` push
- `Helm` deployment

## Best Low-Cost Setup

For your learner lab budget, the safest Jenkins setup is:

- run Jenkins locally in Docker or on your laptop
- use AWS only for low-cost services first
- avoid running Jenkins continuously on AWS EC2 unless required

## Jenkins Plugins You Should Install

- Docker Pipeline
- Pipeline
- Git
- Credentials Binding
- ANSI Color
- Timestamper

## Recommended Jenkins Credentials Later

When you are ready for AWS/ECR:

- AWS access key or temporary session credentials
- GitHub token if needed
- kubeconfig or cluster credentials later

## How This Fits With Other Tools

- `Terraform`: provisions AWS infra
- `Ansible`: configures hosts or utility machines
- `Jenkins`: CI/CD orchestration
- `Docker`: image builds and local runtime
- `Helm`: deployment packaging
- `Argo CD`: GitOps later if you choose to use it

## Suggested Demo Story

If you need to explain this to your college:

1. developer pushes code
2. Jenkins runs build, security, and smoke tests
3. Jenkins can later push images to ECR
4. Jenkins can later trigger Helm deploys or update GitOps flow
