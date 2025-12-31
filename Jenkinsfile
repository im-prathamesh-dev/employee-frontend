pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "devsavruda/react-app"
        REGISTRY_CREDENTIALS = "dockerhub-credentials" // Jenkins credential ID
    }

    stages {

        stage('Checkout') {
            steps {
                echo "📦 Checking out source code..."
                checkout scm
            }
        }

        stage('Set Build Tag') {
            steps {
                script {
                    // Use Git commit hash (short) or Jenkins build number as tag
                    GIT_COMMIT_HASH = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    BUILD_TAG = "${GIT_COMMIT_HASH}-${BUILD_NUMBER}"
                    echo "🔖 Build tag set to: ${BUILD_TAG}"
                }
            }
        }

        stage('Install Dependencies & Build React App') {
            steps {
                echo "🏗️ Installing dependencies and building React app..."
                sh '''
                npm install
                npm run build
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image with tag: ${BUILD_TAG}"
                sh "docker build -t $DOCKER_IMAGE:${BUILD_TAG} -t $DOCKER_IMAGE:latest ."
            }
        }

        stage('Login to Docker Hub') {
            steps {
                echo "🔑 Logging into Docker Hub..."
                withCredentials([usernamePassword(credentialsId: "$REGISTRY_CREDENTIALS", usernameVariable: "DOCKER_USER", passwordVariable: "DOCKER_PASS")]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                echo "🚀 Pushing Docker image to Docker Hub..."
                sh '''
                docker push $DOCKER_IMAGE:${BUILD_TAG}
                docker push $DOCKER_IMAGE:latest
                '''
            }
        }

        stage('Deploy Container') {
            steps {
                echo "🚀 Deploying container with tag ${BUILD_TAG}..."
                sh '''
                docker stop react-app || true
                docker rm react-app || true
                docker run -d -p 3000:80 --name react-app $DOCKER_IMAGE:${BUILD_TAG}
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful!"
            echo "🔖 Image tag: ${BUILD_TAG}"
            echo "🌐 App running on port 3000."
        }
        failure {
            echo "❌ Deployment failed. Check logs for details."
        }
    }
}
