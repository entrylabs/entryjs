pipeline {
  agent none
  stages {
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
            "-Dsonar.github.repository=entrylabs/entry-offline " +
            "-Dsonar.github.endpoint=https://api.github.com " +
            "-Dsonar.github.oauth=${GH_TOKEN} " +
            "-Dsonar.issuesReport.console.enable=true " +
            "-Dsonar.github.disableInlineComments=true " +
            "-Dsonar.github.pullRequest=${env.CHANGE_ID} " +
            "-Dsonar.exclusions=src/renderer/node_modules/**/*,src/renderer/bower_components/**/* " +
            "-Dsonar.sources=src "
          }
        }
      }
    }
    stage('SonarQube Scan') {
      when { 
        beforeAgent true
        expression {
          return env.CHANGE_ID
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
            "-Dsonar.exclusions=src/renderer/node_modules/**/*,src/renderer/bower_components/**/* " +
            "-Dsonar.sources=src "
          }
        }
      }
    }
  }
}