# towerview-web

## Get started

You will need aws-cli and amplify-cli

```
$ aws configure --profile towerview

AWS Access Key ID [None]: AKIASE2Z56TZSJCH5SE6
AWS Secret Access Key [None]: 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
Default region name [None]: ap-northeast-2
Default output format [None]:

$ npm install 
$ amplify pull

Scanning for plugins...
Plugin scan successful
? Select the authentication method you want to use: AWS profile

For more information on AWS Profiles, see:
https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html

? Please choose the profile you want to use towerview
? Which app are you working on? dchyfkd8azvlv
? Pick a backend environment: dev
? Choose your default editor: Visual Studio Code
? Choose the type of app that you're building javascript
Please tell us about your project
? What javascript framework are you using react
? Source Directory Path:  src
? Distribution Directory Path: build
? Build Command:  npm run-script build
? Start Command: npm run-script start

? Do you plan on modifying this backend? Yes
✔ Successfully pulled backend environment stg from the cloud.


Successfully pulled backend environment stg from the cloud.
Run 'amplify pull' to sync upstream changes.

$ amplify pull
$ npm start
```
