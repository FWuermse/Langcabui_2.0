pipeline {
    agent any
    environment {
        CN = 'langcab_ui'
    }
    stages {
        stage('Undeploy old version') {
            steps {
                script {
            	    if (sh(script: """sudo docker ps -q -f name=${env.CN}""", returnStdout: true).trim()) {
            	        sh(script: """sudo docker stop ${env.CN} && sudo docker rm ${env.CN}""", returnStdout: false)
            	    } else {
            	       if (sh(script: """sudo docker ps -aq -f status=exited -f name=${env.CN}""", returnStdout: true).trim()) {
            	           sh(script: """sudo docker rm ${env.CN}""", returnStdout: false)
            	        } else {
            	            echo """Container ${env.CN} does not exist"""
            	        }
            	    }
            	    if (sh(script: """sudo docker images -q ${env.CN}""", returnStdout: true).trim()) {
            	        sh(script: """sudo docker rmi ${env.CN}""", returnStdout: false)
            	    }
                }
            }
        }
        stage('Build npm') {
            steps {
                sh 'sudo docker build -t $CN .'
            }
        }
        stage('Deploy') {
            steps {
               sh 'sudo docker-compose up -d'
            }
        }
    }
}