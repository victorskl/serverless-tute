# Serverless Framework

> NOTE: 🙋 This is a bit blown-up Serverless Framework tute that fusion with Terraform. However, doing so gain lots insight. Do check [sls-simple](../sls-simple), much simpler you seek! 

## About

- https://en.wikipedia.org/wiki/Serverless_Framework
- https://github.com/serverless/serverless
- https://serverless.com/framework/docs/
- https://serverless.com/learn/comparisons/

## Summary

- "Serverless Framework" is a _serverless-application-opinionated deployment_ tool. It comes with CLI (`serverless`, also alias `sls`) and, DSL in YAML (i.e. `serverless.yaml`) with additional plugins for how you might deploy your functions. Written in JavaScript for Node.js runtime. 
- Wording "Framework" part is not about framework as _software framework_, rather _deployment framework_! It may make you ease with the development for "serverless deployment" part of some typical software functions.
- Under the hood, it transforms all deploy-able artifacts into `CloudFormation` on AWS.
- If your production has already used `Terraform`, you might want to _limit_ the use of this tool to some extent. e.g. only to deploy Lambda functions and API Gateway resources. Be careful about which resources are managed by which tool, and not to step over inter-dependency of these resources to void cleaner tear down operation. Read [The definitive guide to using Terraform with the Serverless Framework](https://serverless.com/blog/definitive-guide-terraform-serverless/) for which does what and, best practices.
- e.g. Through [`serverless.yaml` resources node](https://github.com/AnomalyInnovations/serverless-stack-demo-api/blob/master/serverless.yml#L122), it overlaps:
    - [terraform s3](https://github.com/victorskl/serverless-tute/blob/master/sls/notes-app-terraform/main.tf#L35) vs [serverless s3](https://github.com/AnomalyInnovations/serverless-stack-demo-api/blob/master/resources/s3-bucket.yml)
    - [terraform dynamodb](https://github.com/victorskl/serverless-tute/blob/master/sls/notes-app-terraform/main.tf#L17) vs [serverless dynamodb](https://github.com/AnomalyInnovations/serverless-stack-demo-api/blob/master/resources/dynamodb-table.yml)
    - [terraform cognito user pool](https://github.com/victorskl/serverless-tute/blob/master/sls/notes-app-terraform/main.tf#L48) vs [serverless cognito user pool](https://github.com/AnomalyInnovations/serverless-stack-demo-api/blob/master/resources/cognito-user-pool.yml)
    - [terraform cognito identity pool](https://github.com/victorskl/serverless-tute/blob/master/sls/notes-app-terraform/main.tf#L66) vs [serverless cognito identity pool](https://github.com/AnomalyInnovations/serverless-stack-demo-api/blob/master/resources/cognito-identity-pool.yml)
    - ... so on, so ford!
- **Separation of Concerns**: One consideration is that, let Terraform manage on _set-and-go_ part of infrastructure (e.g. Certificate, Database, etc, things that don't change often) and, let Serverless focus on _repetitive_ part of Lambda/FaaS deployment in CI/CD workflow.

## Walk-through

- Tutorials from https://serverless-stack.com But with more simplified version and fusion with terraform!
    - [notes-app-api](notes-app-api) (simple async/await/promise Node.js backend)
    - [notes-app-client](notes-app-client) (React.js frontend)
    - [notes-app-terraform](notes-app-terraform) (provision DynanoDB, S3, ... using terraform instead of sls or AWS Console)
- Added git sub modules from [AnomalyInnovations](https://github.com/AnomalyInnovations) for the more original [notes-app demo](https://demo.serverless-stack.com)

> Note: both frontend and backend application (lambda functions) are just another typical software application, regardless of "Serverless (sls) Framework". You may use any tool to deploy these applications, regardless of "Serverless (sls) Framework".


```
cd notes-app-terraform
terraform plan
terraform apply

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

...

(if all done, tear down Serverless first)
serverless remove --help
serverless remove
aws cloudformation list-stacks

(if all good then tear down terraform)
terraform destroy
aws dynamodb list-tables
aws s3 ls
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

## AWS CLI

[AWS Lambda CLI](https://docs.aws.amazon.com/cli/latest/reference/lambda/index.html) counterpart:

```
aws lambda list-functions

aws lambda get-function --function-name notes-app-api-dev-hello

aws lambda invoke --function-name notes-app-api-dev-hello output.json
{
    "StatusCode": 200,
    "ExecutedVersion": "$LATEST"
}

cat output.json | jq
{
  "statusCode": 200,
  "body": "{\"message\":\"Go Serverless v1.0! Your function executed successfully! (with a delay)\"}"
}
```

## CloudFormation Template

sls (serverless) to [CloudFormation template][cfntpl]

```
sls print
sls print --format json
sls print --help
SLS_DEBUG=* serverless print --STAGE dev

sls package --help
sls package
SLS_DEBUG=* serverless package --STAGE dev

tree .serverless/
.serverless/
├── cloudformation-template-create-stack.json
├── cloudformation-template-update-stack.json
├── create.zip
├── delete.zip
├── get.zip
├── hello.zip
├── list.zip
├── serverless-state.json
└── update.zip

aws cloudformation validate-template --template-body file://.serverless/cloudformation-template-create-stack.json
{
    "Parameters": [],
    "Description": "The AWS CloudFormation template for this Serverless application"
}
```

- https://stackoverflow.com/questions/55852551/serverless-framework-output-compiled-cloudformation
- [Generate and Read Cloudformation template without deploying](https://forum.serverless.com/t/generate-and-read-cloudformation-template-without-deploying/4344/2)
- https://www.serverless.com/framework/docs/providers/aws/cli-reference/package/

Validate [CloudFormation template][cfntpl]:

- https://awscli.amazonaws.com/v2/documentation/api/latest/reference/cloudformation/validate-template.html
- https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-validate-template.html

[cfntpl]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/gettingstarted.templatebasics.html


### SAM Template

sls (serverless) to [SAM template](../sam)

- https://github.com/sapessi/serverless-sam


## Lambda Code Storage

- https://epsagon.com/tools/free-lambda-code-storage-exceeded/

Option 1: Turn off Lambda function deployment versioning in `serverless.yml`
```
provider:
  name: aws
  runtime: python3.6
  versionFunctions: false
  region: ${opt:region, 'us-east-1'}
  stage: ${opt:stage, 'dev'}
```

Option 2: https://github.com/epsagon/clear-lambda-storage

```
cd clear-lambda-storage
pipenv --python 3.7
pipenv shell
pipenv install

python clear_lambda_storage.py --help

export AWS_PROFILE=dev
python clear_lambda_storage.py --regions us-east-1
```

Option 3: https://www.serverless.com/plugins/serverless-prune-plugin

```
yarn add serverless-prune-plugin --dev

sls prune -n 2 --STAGE dev --dryRun
```
