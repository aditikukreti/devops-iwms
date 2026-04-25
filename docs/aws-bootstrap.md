# AWS Bootstrap

This is the safest next AWS step for this project.

## Goal

Set up:

- `S3` for Terraform remote state
- `DynamoDB` for Terraform state locking
- `ECR` repositories for frontend and backend images

This gives you real AWS usage with relatively low cost.

## Before You Start

You need:

- an AWS account
- AWS CLI installed
- credentials configured locally
- a unique S3 bucket name

## Verify AWS CLI

```bash
aws --version
aws sts get-caller-identity
```

If that second command works, your credentials are set correctly.

## Step 1: Bootstrap Terraform State

Go to:

```bash
cd infra/terraform/environments/bootstrap
```

Copy the example file and edit it:

```bash
cp terraform.tfvars.example terraform.tfvars
```

Then run:

```bash
terraform init
terraform plan
terraform apply
```

That creates:

- the S3 state bucket
- the DynamoDB lock table

## Step 2: Configure Remote State For Dev Foundation

Go to:

```bash
cd ../dev-foundation
```

Copy the backend config example and edit it with the real bucket/table names:

```bash
cp backend.hcl.example backend.hcl
```

Then initialize Terraform with the backend:

```bash
terraform init -backend-config=backend.hcl
```

## Step 3: Create ECR Repositories

Copy the example values file if needed:

```bash
cp terraform.tfvars.example terraform.tfvars
```

Keep this low-cost:

- leave `create_utility_ec2 = false`
- do not add EC2 yet unless you explicitly need it

Then run:

```bash
terraform plan
terraform apply
```

This creates:

- backend ECR repo
- frontend ECR repo

## Step 4: Push Images Later

Once ECR exists, you can tag and push your local images there.

That will be the next bridge from local Docker to AWS-hosted images.

## Cost Notes

Safe early AWS usage:

- `S3`
- `DynamoDB`
- `ECR`

Delay for now:

- `EKS`
- `RDS`
- `ElastiCache`
- `ALB`
- `NAT Gateway`

## Recommended First Region

Keep everything in one region for learning, for example:

- `ap-south-1`

## Important

Use globally unique names for the S3 bucket.

Example style:

- `inventory-platform-aditi-2026-tfstate`
