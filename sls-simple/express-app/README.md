# express-app

Deploy an Express.js app to AWS Lambda using the [Serverless Framework](../../sls/README.md)
- https://bitbucket.org/blog/deploy-an-express-js-app-to-aws-lambda-using-the-serverless-framework

> plugin used: serverless-http
- https://github.com/dougmoscrop/serverless-http
- https://www.npmjs.com/package/serverless-http 

Bootstrap:
```
npm init
npm install express serverless-http
vi app.js
vi serverless.yml
```

Getting started:
```
npm install

npx sls doctor
npx sls deploy --debug="*"
npx sls deploy list
npx sls invoke -f app --stage dev --path test.json | jq
npx sls info

curl -s https://<endpoint>.execute-api.ap-southeast-2.amazonaws.com/dev/api/info | jq
{
  "application": "sample-app",
  "version": "1"
}

aws lambda list-functions
aws lambda invoke --function-name express-app-dev-app --cli-binary-format raw-in-base64-out --payload '{ "path": "/api/info" }' response.json
cat response.json | jq -r '.body' | jq
{
  "application": "sample-app",
  "version": "1"
}

aws cloudformation list-stacks
aws apigateway get-rest-apis
aws logs describe-log-groups --query 'logGroups[*].logGroupName'
aws s3 ls | grep express-app

npx sls remove --debug="*"
```
