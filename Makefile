PROJECT_NAME=devopsproject

.PHONY: up down rebuild smoke logs k8s-build helm-template

up:
	docker compose up --build

down:
	docker compose down -v

rebuild:
	docker compose up --build -d

smoke:
	bash ./scripts/smoke-test.sh

logs:
	docker compose logs -f

k8s-build:
	docker build -t inventory-platform/backend-api:dev ./apps/backend-api
	docker build -t inventory-platform/frontend:dev ./apps/frontend

helm-template:
	helm template inventory-platform ./k8s/helm/inventory-platform --namespace inventory-dev -f ./k8s/helm/inventory-platform/values-dev.yaml
