# Ansible and Jenkins Responsibilities

To avoid confusion, use the tools like this:

## Jenkins

Use Jenkins for:

- pipeline orchestration
- builds
- tests
- Trivy scans
- Docker image creation
- later image push and deployment steps

## Ansible

Use Ansible for:

- configuring a utility EC2 instance
- installing Docker, kubectl, helm, aws cli
- preparing a Jenkins host if you later move Jenkins to EC2
- repeatable host setup and maintenance

## Good Project Story

For a college DevOps project:

- `Terraform` creates the infrastructure
- `Ansible` configures the machine or tooling
- `Jenkins` runs the CI/CD pipeline

That is a strong and defensible use of all three tools.
