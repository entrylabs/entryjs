pipeline {
  agent none
  stages {
    stage('EntryJS Test') {
      when {
        beforeAgent true
        expression {
          return env.CHANGE_ID
        }
      }
      agent {
        docker {
          image 'node:8.11.3'
        }
      }
      steps {
        script {
          sh "npm prune"
          sh "npm install"
          sh "yarn test"
        }
      }
      post {
        always {
          junit 'reports/*.xml'
        }
      }
    }
    stage('SonarQube Analysis') {
      when { 
        beforeAgent true
        expression {
          return env.CHANGE_ID
        }
      }
      agent {
        docker {
          image 'maven:3-alpine'
        }
      }
      steps {
        script {
          def scannerHome = tool "sonarqube-scanner";
          withSonarQubeEnv("sonar") {
            sh "${scannerHome}/bin/sonar-scanner " +
            "-Dsonar.projectKey=entry.entryjs " +
            "-Dsonar.projectName=entryjs " +
            "-Dsonar.sourceEncoding=UTF-8 " +
            "-Dsonar.analysis.mode=preview " +
            "-Dsonar.github.repository=entrylabs/entryjs " +
            "-Dsonar.github.endpoint=https://api.github.com " +
            "-Dsonar.github.oauth=${GH_TOKEN} " +
            "-Dsonar.issuesReport.console.enable=true " +
            "-Dsonar.github.disableInlineComments=true " +
            "-Dsonar.github.pullRequest=${env.CHANGE_ID} " +
            "-Dsonar.sources=src "
          }
        }
      }
    }
    stage('SonarQube Scan') {
      when {
        beforeAgent true
        allOf {
          expression { BRANCH_NAME ==~ /(^master$)/ }
          not { changeRequest() }
        }
      }
      agent {
        docker {
          image 'maven:3-alpine'
        }
      }
      steps {
        script {
          def scannerHome = tool "sonarqube-scanner";
          withSonarQubeEnv("sonar") {
            sh "${scannerHome}/bin/sonar-scanner " +
            "-Dsonar.projectKey=entry.entryjs " +
            "-Dsonar.projectName=entryjs " +
            "-Dsonar.sourceEncoding=UTF-8 " +
            "-Dsonar.sources=src "
          }
        }
      }
    }
    stage('EntryJS Deploy') {
      when {
        beforeAgent true
        allOf {
          expression { BRANCH_NAME ==~ /(^master$|^deploy\/.*$)/ }
          not { changeRequest() }
        }
      }
      agent {
        docker {
          image 'node:8.11.3'
        }
      }
      steps {
        script {
          sh '''npm prune
npm install
chmod +x ./scripts/build.sh
chmod +x ./scripts/deploy.sh
./scripts/build.sh
./scripts/deploy.sh'''
        }
      }
    }
  }
  environment {
    GH_REPO = 'https://github.com/entrylabs/entryjs.git'
    GH_REF = 'github.com/entrylabs/entryjs.git'
  }
}