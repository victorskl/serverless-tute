# express-app

Deploy an Express.js app to AWS Lambda using the [Serverless Framework](../SERVERLESS.md)
- https://bitbucket.org/blog/deploy-an-express-js-app-to-aws-lambda-using-the-serverless-framework

> plugin: serverless-http
- https://github.com/dougmoscrop/serverless-http
- https://www.npmjs.com/package/serverless-http 

```
npm init
npm install express serverless-http
vi app.js
vi serverless.yml

serverless info
serverless deploy

serverless invoke -f app --STAGE dev --path test.json | jq

aws lambda list-functions
aws lambda invoke --function-name express-app-dev-app --payload '{ "path": "/api/info" }' response.json
cat response.json | jq

curl -s https://<random-string>.execute-api.ap-southeast-2.amazonaws.com/dev/api/info | jq
```
