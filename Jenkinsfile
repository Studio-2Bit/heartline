pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "yasindugunasekara"

        BACKEND_IMAGE = "${DOCKERHUB_USER}/heartline-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/heartline-frontend"
        ADMIN_IMAGE   = "${DOCKERHUB_USER}/heartline-admin"

        TAG = "build-${BUILD_NUMBER}"   
    }

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/Studio-2Bit/heartline.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh """
                docker build -t $BACKEND_IMAGE:$TAG ./backend
                docker build -t $FRONTEND_IMAGE:$TAG ./frontend
                docker build -t $ADMIN_IMAGE:$TAG ./admin
                """
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh """
                    docker login -u $USER -p $PASS

                    docker push $BACKEND_IMAGE:$TAG
                    docker push $FRONTEND_IMAGE:$TAG
                    docker push $ADMIN_IMAGE:$TAG
                    """
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@YOUR_EC2_IP << EOF

                    cd heartline

                    # Update images with new tag
                    docker pull $BACKEND_IMAGE:$TAG
                    docker pull $FRONTEND_IMAGE:$TAG
                    docker pull $ADMIN_IMAGE:$TAG

                    docker stop backend frontend admin || true
                    docker rm backend frontend admin || true

                    docker run -d -p 5000:5000 --name backend $BACKEND_IMAGE:$TAG
                    docker run -d -p 5173:5173 --name frontend $FRONTEND_IMAGE:$TAG
                    docker run -d -p 5174:5174 --name admin $ADMIN_IMAGE:$TAG

                    EOF
                    """
                }
            }
        }
    }
}