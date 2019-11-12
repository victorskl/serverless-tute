# Serverless Framework

- https://en.wikipedia.org/wiki/Serverless_Framework
- https://github.com/serverless/serverless
- https://serverless.com/framework/docs/
- Tutorials from https://serverless-stack.com
    - [notes-app-api](notes-app-api) (simple async/await/promise Node.js backend)
    - [notes-app-client](notes-app-client) (React.js frontend)

```
nvm list
which node
which npm
which npx
node --version
npm --version
npx --version
npm install serverless -g
npm list -g | grep serverless
which serverless
which sls
sls version
serverless version
serverless help

cd notes-app-api
serverless deploy --verbose
serverless deploy list
serverless info
curl -s https://<endpoint-string>.execute-api.ap-southeast-2.amazonaws.com/dev/hello | jq
{
  "message": "Go Serverless v1.0! Your function executed successfully! (with a delay)"
}
serverless invoke -f hello -l
serverless invoke local -f hello -l
```

> [Serverless Framework AWS Deploying: How it works](https://serverless.com/framework/docs/providers/aws/guide/deploying/)

> The Serverless Framework was designed to provision your AWS Lambda Functions, Events and infrastructure Resources safely and quickly. It does this via a couple of methods designed for different types of deployments.

> The Serverless Framework translates all syntax in `serverless.yml` to a single AWS CloudFormation template. 

- `serverless deploy` will
    - create CloudFormation `aws cloudformation list-stacks`
- CloudFormation will further
    - create S3 serverless deployment bucket `aws s3 ls`
    - create API Gateway `aws apigateway get-rest-apis`
    - create Lambda functions `aws lambda list-functions`
    - create LogGroups `aws logs describe-log-groups`
    - so on...
- Through [plugins](https://serverless.com/framework/docs/providers/aws/guide/plugins/), `serverless deploy` may create more AWS resources as used in a plugin e.g. use of [`serverless-domain-manager`](https://serverless.com/plugins/serverless-domain-manager/) plugin would create Route53 records
- `local` invocation still persist in the persistence store e.g. DynamoDB

```
serverless invoke local --function create --path mocks/create-event.json

aws dynamodb list-tables
{
    "TableNames": [
        "notes"
    ]
}

aws dynamodb scan --table-name notes
{
    "Items": [
        {
            "attachment": {
                "S": "hello.jpg"
            },
            "content": {
                "S": "hello world"
            },
            "createdAt": {
                "N": "1573180369478"
            },
            "noteId": {
                "S": "0e688e60-01d0-11ea-99f8-d17d01685a2b"
            },
            "userId": {
                "S": "USER-SUB-1234"
            }
        }
    ],
    "Count": 1,
    "ScannedCount": 1,
    "ConsumedCapacity": null
}

serverless invoke local --function list --path mocks/list-event.json
{
    "statusCode": 200,
    "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
    },
    "body": "[{\"attachment\":\"hello.jpg\",\"content\":\"hello world\",\"createdAt\":1573180369478,\"noteId\":\"0e688e60-01d0-11ea-99f8-d17d01685a2b\",\"userId\":\"USER-SUB-1234\"}]"
}

serverless invoke local --function get --path mocks/get-event.json
{
    "statusCode": 200,
    "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
    },
    "body": "{\"attachment\":\"hello.jpg\",\"content\":\"hello world\",\"createdAt\":1573180369478,\"noteId\":\"0e688e60-01d0-11ea-99f8-d17d01685a2b\",\"userId\":\"USER-SUB-1234\"}"
}

serverless invoke local --function update --path mocks/update-event.json
{
    "statusCode": 200,
    "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
    },
    "body": "{\"status\":true}"
}

serverless invoke local --function get --path mocks/get-event.json
{
    "statusCode": 200,
    "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
    },
    "body": "{\"attachment\":\"new.jpg\",\"content\":\"new world\",\"createdAt\":1573180369478,\"noteId\":\"0e688e60-01d0-11ea-99f8-d17d01685a2b\",\"userId\":\"USER-SUB-1234\"}"
}

aws dynamodb scan --table-name notes
{
    "Items": [
        {
            "attachment": {
                "S": "new.jpg"
            },
            "content": {
                "S": "new world"
            },
            "createdAt": {
                "N": "1573180369478"
            },
            "noteId": {
                "S": "0e688e60-01d0-11ea-99f8-d17d01685a2b"
            },
            "userId": {
                "S": "USER-SUB-1234"
            }
        }
    ],
    "Count": 1,
    "ScannedCount": 1,
    "ConsumedCapacity": null
}

serverless invoke local --function delete --path mocks/delete-event.json
{
    "statusCode": 200,
    "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
    },
    "body": "{\"status\":true}"
}

serverless invoke local --function list --path mocks/list-event.json
{
    "statusCode": 200,
    "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
    },
    "body": "[]"
}

aws dynamodb scan --table-name notes
{
    "Items": [],
    "Count": 0,
    "ScannedCount": 0,
    "ConsumedCapacity": null
}
```
