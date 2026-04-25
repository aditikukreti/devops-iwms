pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
  }

  environment {
    BACKEND_IMAGE = 'inventory-platform/backend-api:jenkins'
    FRONTEND_IMAGE = 'inventory-platform/frontend:jenkins'
    COMPOSE_PROJECT_NAME = 'devopsproject'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Frontend Build') {
      agent {
        docker {
          image 'node:20-alpine'
          args '-u root:root'
        }
      }
      steps {
        dir('apps/frontend') {
          sh 'npm install'
          sh 'npm run build'
        }
      }
    }

    stage('Terraform Format Check') {
      agent {
        docker {
          image 'hashicorp/terraform:1.9.8'
          args '-u root:root'
        }
      }
      steps {
        sh 'terraform fmt -check -recursive infra/terraform'
      }
    }

    stage('Build Images') {
      steps {
        sh 'docker build -t $BACKEND_IMAGE ./apps/backend-api'
        sh 'docker build -t $FRONTEND_IMAGE ./apps/frontend'
      }
    }

    stage('Trivy Filesystem Scan') {
      agent {
        docker {
          image 'aquasec/trivy:0.63.0'
          args '-u root:root'
        }
      }
      steps {
        sh 'trivy fs --config trivy.yaml .'
      }
    }

    stage('Trivy Image Scan') {
      agent {
        docker {
          image 'aquasec/trivy:0.63.0'
          args '-u root:root -v /var/run/docker.sock:/var/run/docker.sock'
        }
      }
      steps {
        sh 'trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 $BACKEND_IMAGE'
        sh 'trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 $FRONTEND_IMAGE'
      }
    }

    stage('Docker Smoke Test') {
      steps {
        sh 'docker compose up --build -d'
        sh '''
          for i in $(seq 1 30); do
            if curl -fsS http://localhost:8000/health; then
              exit 0
            fi
            sleep 2
          done
          echo "Backend health check failed"
          docker compose logs backend-api postgres
          exit 1
        '''
        sh 'bash ./scripts/smoke-test.sh'
      }
    }

    stage('ECR Push Placeholder') {
      when {
        expression { return false }
      }
      steps {
        echo 'Enable this stage after AWS credentials and ECR are configured in Jenkins.'
      }
    }

    stage('Helm Deploy Placeholder') {
      when {
        expression { return false }
      }
      steps {
        echo 'Enable this stage after your Kubernetes cluster and Helm access are configured in Jenkins.'
      }
    }
  }

  post {
    always {
      sh 'docker compose down -v || true'
    }
  }
}
