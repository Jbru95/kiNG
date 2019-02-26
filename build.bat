echo Building app in production mode, sending files to docs folder in repository, which is set to deploy automatically to jbru95.github.io/kiNG when files are comitted.
ng build --prod --deployUrl="https://jbru95.github.io/kiNG/" --outputPath=./docs --base-href="https://jbru95.github.io/kiNG/"
PAUSE