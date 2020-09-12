# SAM

AWS Serverless Application Model

- (blurb) https://aws.amazon.com/serverless/sam/
- (follow-this) [What Is SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html)

SAM consists of two components:
1. SAM template spec and translator -- 🐍 https://github.com/aws/serverless-application-model
2. SAM CLI -- 🐍 https://github.com/awslabs/aws-sam-cli

> SAM template is extension of CloudFormation template -- [§ sam-specification](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-specification.html)

## Install SAM CLI
```
brew list
brew list --cask
brew tap aws/tap
brew tap
brew search aws-sam-cli
brew info aws-sam-cli
brew install aws-sam-cli
which sam
ls -l $(which sam)
sam --version
sam --help
```

## Simple World

> 🙋‍♀️ _The [simple](simple) world example!_

This [`template.yaml`](simple/template.yaml) is excerpt from _[Replacing web server functionality with serverless services](https://aws.amazon.com/blogs/compute/replacing-web-server-functionality-with-serverless-services/)_ article.

```
mkdir -p simple/src
cd simple
touch src/index.py
touch src/requirements.txt
touch template.yaml

sam validate
sam build --use-container
sam local invoke SimpleWorldFunction
sam local start-api
curl -s http://localhost:3000/simple | jq

sam deploy --guided

aws cloudformation list-stacks --stack-status-filter "CREATE_COMPLETE"
aws s3 ls
aws iam list-roles | grep simple
aws apigateway get-rest-apis
aws lambda list-functions

curl -s https://5k0zutscud.execute-api.ap-southeast-2.amazonaws.com/Prod/simple/ | jq
aws lambda invoke --function-name simple-app-SimpleWorldFunction-GVWV4GF2UYU1 out.json

sam logs -n simple-app-SimpleWorldFunction-GVWV4GF2UYU1

aws logs describe-log-groups

aws logs describe-log-streams \
    --log-group-name '/aws/lambda/simple-app-SimpleWorldFunction-GVWV4GF2UYU1'

aws logs get-log-events \
    --log-group-name  '/aws/lambda/simple-app-SimpleWorldFunction-GVWV4GF2UYU1' \
    --log-stream-name '2020/09/12/[$LATEST]687335376b9b4d2b9f86885713ef9d26'

aws cloudformation get-template --stack-name simple-app > cfn_processed_tpl.json
aws cloudformation delete-stack --stack-name simple-app

(S3 Conole UI > Select aws-sam-cli-managed-default-samclisourcebucket-1wqpt2f15gasv bucket > Click Empty button)

aws cloudformation delete-stack --stack-name aws-sam-cli-managed-default

aws logs delete-log-group \
    --log-group-name '/aws/lambda/simple-app-SimpleWorldFunction-GVWV4GF2UYU1'
```

<details>
    <summary>Click to expand!</summary>
    
    sam deploy --guided
    
    Configuring SAM deploy
    ======================
    
        Looking for samconfig.toml :  Not found
    
        Setting default arguments for 'sam deploy'
        =========================================
        Stack Name [sam-app]: simple-app
        AWS Region [us-east-1]: ap-southeast-2
        #Shows you resources changes to be deployed and require a 'Y' to initiate deploy
        Confirm changes before deploy [y/N]: y
        #SAM needs permission to be able to create roles to connect to the resources in your template
        Allow SAM CLI IAM role creation [Y/n]: Y
        SimpleWorldFunction may not have authorization defined, Is this okay? [y/N]: y
        Save arguments to samconfig.toml [Y/n]: Y
    
        Looking for resources needed for deployment: Not found.
        Creating the required resources...
        Successfully created!
    
            Managed S3 bucket: aws-sam-cli-managed-default-samclisourcebucket-1wqpt2f15gasv
            A different default S3 bucket can be set in samconfig.toml
    
        Saved arguments to config file
        Running 'sam deploy' for future deployments will use the parameters saved above.
        The above parameters can be changed by modifying samconfig.toml
        Learn more about samconfig.toml syntax at
        https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-config.html
    Uploading to simple-app/b1815a4f46d4a2e61eb5c092f4fcb010  342 / 342.0  (100.00%)
    
        Deploying with following values
        ===============================
        Stack name                 : simple-app
        Region                     : ap-southeast-2
        Confirm changeset          : True
        Deployment s3 bucket       : aws-sam-cli-managed-default-samclisourcebucket-1wqpt2f15gasv
        Capabilities               : ["CAPABILITY_IAM"]
        Parameter overrides        : {}
    
    Initiating deployment
    =====================
    SimpleWorldFunction may not have authorization defined.
    Uploading to simple-app/ee4ef220f20e557ab9ea05f0aa4ed057.template  495 / 495.0  (100.00%)
    
    Waiting for changeset to be created..
    
    CloudFormation stack changeset
    ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    Operation                                                                                 LogicalResourceId                                                                         ResourceType
    ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    + Add                                                                                     ServerlessRestApiDeployment081c5bf10a                                                     AWS::ApiGateway::Deployment
    + Add                                                                                     ServerlessRestApiProdStage                                                                AWS::ApiGateway::Stage
    + Add                                                                                     ServerlessRestApi                                                                         AWS::ApiGateway::RestApi
    + Add                                                                                     SimpleWorldFunctionRole                                                                   AWS::IAM::Role
    + Add                                                                                     SimpleWorldFunctionSimpleWorldPermissionProd                                              AWS::Lambda::Permission
    + Add                                                                                     SimpleWorldFunction                                                                       AWS::Lambda::Function
    ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    Changeset created successfully. arn:aws:cloudformation:ap-southeast-2:123456789012:changeSet/samcli-deploy1599889034/d2362dd6-89a8-4a12-ae43-64214905f07e
    
    
    Previewing CloudFormation changeset before deployment
    ======================================================
    Deploy this changeset? [y/N]: y
    
    2020-09-12 15:37:26 - Waiting for stack create/update to complete
    
    CloudFormation events from changeset
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    ResourceStatus                                                      ResourceType                                                        LogicalResourceId                                                   ResourceStatusReason
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    CREATE_IN_PROGRESS                                                  AWS::IAM::Role                                                      SimpleWorldFunctionRole                                             -
    CREATE_IN_PROGRESS                                                  AWS::IAM::Role                                                      SimpleWorldFunctionRole                                             Resource creation Initiated
    CREATE_COMPLETE                                                     AWS::IAM::Role                                                      SimpleWorldFunctionRole                                             -
    CREATE_IN_PROGRESS                                                  AWS::Lambda::Function                                               SimpleWorldFunction                                                 Resource creation Initiated
    CREATE_IN_PROGRESS                                                  AWS::Lambda::Function                                               SimpleWorldFunction                                                 -
    CREATE_COMPLETE                                                     AWS::Lambda::Function                                               SimpleWorldFunction                                                 -
    CREATE_IN_PROGRESS                                                  AWS::ApiGateway::RestApi                                            ServerlessRestApi                                                   -
    CREATE_COMPLETE                                                     AWS::ApiGateway::RestApi                                            ServerlessRestApi                                                   -
    CREATE_IN_PROGRESS                                                  AWS::ApiGateway::RestApi                                            ServerlessRestApi                                                   Resource creation Initiated
    CREATE_IN_PROGRESS                                                  AWS::Lambda::Permission                                             SimpleWorldFunctionSimpleWorldPermissionProd                        -
    CREATE_IN_PROGRESS                                                  AWS::ApiGateway::Deployment                                         ServerlessRestApiDeployment081c5bf10a                               Resource creation Initiated
    CREATE_IN_PROGRESS                                                  AWS::Lambda::Permission                                             SimpleWorldFunctionSimpleWorldPermissionProd                        Resource creation Initiated
    CREATE_IN_PROGRESS                                                  AWS::ApiGateway::Deployment                                         ServerlessRestApiDeployment081c5bf10a                               -
    CREATE_COMPLETE                                                     AWS::ApiGateway::Deployment                                         ServerlessRestApiDeployment081c5bf10a                               -
    CREATE_COMPLETE                                                     AWS::ApiGateway::Stage                                              ServerlessRestApiProdStage                                          -
    CREATE_IN_PROGRESS                                                  AWS::ApiGateway::Stage                                              ServerlessRestApiProdStage                                          Resource creation Initiated
    CREATE_IN_PROGRESS                                                  AWS::ApiGateway::Stage                                              ServerlessRestApiProdStage                                          -
    CREATE_COMPLETE                                                     AWS::Lambda::Permission                                             SimpleWorldFunctionSimpleWorldPermissionProd                        -
    CREATE_COMPLETE                                                     AWS::CloudFormation::Stack                                          simple-app                                                          -
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    CloudFormation outputs from deployed stack
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    Outputs
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    Key                 SimpleWorldApi
    Description         API Gateway endpoint URL for Prod stage for Simple World function
    Value               https://5k0zutscud.execute-api.ap-southeast-2.amazonaws.com/Prod/simple/
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    Successfully created/updated stack - simple-app in ap-southeast-2    
</details>

## Hello World `sam-app`

- [sam-app](sam-app)
- https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-hello-world.html

#### Init

```
sam init
```

<details>
    <summary>Click to expand!</summary>

    sam init
    Which template source would you like to use?
        1 - AWS Quick Start Templates
        2 - Custom Template Location
    Choice: 1
    
    Which runtime would you like to use?
        1 - nodejs12.x
        2 - python3.8
        3 - ruby2.7
        4 - go1.x
        5 - java11
        6 - dotnetcore3.1
        7 - nodejs10.x
        8 - python3.7
        9 - python3.6
        10 - python2.7
        11 - ruby2.5
        12 - java8.al2
        13 - java8
        14 - dotnetcore2.1
    Runtime: 8
    
    Project name [sam-app]:
    
    Cloning app templates from https://github.com/awslabs/aws-sam-cli-app-templates.git
    
    AWS quick start application templates:
        1 - Hello World Example
        2 - EventBridge Hello World
        3 - EventBridge App from scratch (100+ Event Schemas)
        4 - Step Functions Sample App (Stock Trader)
    Template selection: 1
    
    -----------------------
    Generating application:
    -----------------------
    Name: sam-app
    Runtime: python3.7
    Dependency Manager: pip
    Application Template: hello-world
    Output Directory: .
    
    Next steps can be found in the README file at ./sam-app/README.md
</details>

#### Local First

- Contrary to tute guide ☝️, let's do local first with docker, i.e. 
    - § _Step 4: Testing Your Application Locally_
    - § _Use the SAM CLI to build and test locally_ 👉 [sam-app/README.md](sam-app/README.md)
 
```
cd sam-app
sam build --use-container
sam local invoke HelloWorldFunction --event events/event.json
sam local generate-event apigateway aws-proxy --body "" --path "hello" --method GET > events/api-event.json
sam local invoke HelloWorldFunction --event events/api-event.json
sam local start-api
curl -s http://localhost:3000/hello | jq
```

#### Build & Push to AWS

⚖️ _Let's validate the SAM template!_

```
sam validate --help
sam validate --debug
```

🏗 _Build directly on the host required Python 🐍 environment! Let's use 🦕 conda!_

```
conda create -n py37 python=3.7
conda activate py37
sam build --help
sam build
```

😆 _Kidding, we can build using Python docker container as well!_ 

```
sam build --use-container
```

🙂 _Let's push!_

```
sam deploy --help
sam deploy --guided
```

<details>
    <summary>Click to expand!</summary>
    
    sam deploy --guided
    
    Configuring SAM deploy
    ======================
    
        Looking for samconfig.toml :  Not found
    
        Setting default arguments for 'sam deploy'
        =========================================
        Stack Name [sam-app]:
        AWS Region [us-east-1]: ap-southeast-2
        #Shows you resources changes to be deployed and require a 'Y' to initiate deploy
        Confirm changes before deploy [y/N]: y
        #SAM needs permission to be able to create roles to connect to the resources in your template
        Allow SAM CLI IAM role creation [Y/n]: Y
        HelloWorldFunction may not have authorization defined, Is this okay? [y/N]: y
        Save arguments to samconfig.toml [Y/n]: Y
    
        Looking for resources needed for deployment: Not found.
        Creating the required resources...
        Successfully created!
    
            Managed S3 bucket: aws-sam-cli-managed-default-samclisourcebucket-1jhm7spym3usq
            A different default S3 bucket can be set in samconfig.toml
    
        Saved arguments to config file
        Running 'sam deploy' for future deployments will use the parameters saved above.
        The above parameters can be changed by modifying samconfig.toml
        Learn more about samconfig.toml syntax at
        https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-config.html
    Uploading to sam-app/c508ae148912fb3ec7cb02b06aac8515  538937 / 538937.0  (100.00%)
    
        Deploying with following values
        ===============================
        Stack name                 : sam-app
        Region                     : ap-southeast-2
        Confirm changeset          : True
        Deployment s3 bucket       : aws-sam-cli-managed-default-samclisourcebucket-1jhm7spym3usq
        Capabilities               : ["CAPABILITY_IAM"]
        Parameter overrides        : {}
    
    Initiating deployment
    =====================
    HelloWorldFunction may not have authorization defined.
    Uploading to sam-app/8eae8c1fe33b449315cc3d9fb9312aad.template  1090 / 1090.0  (100.00%)
    
    Waiting for changeset to be created..
    
    CloudFormation stack changeset
    ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    Operation                                                                                 LogicalResourceId                                                                         ResourceType
    ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    + Add                                                                                     HelloWorldFunctionHelloWorldPermissionProd                                                AWS::Lambda::Permission
    + Add                                                                                     HelloWorldFunctionRole                                                                    AWS::IAM::Role
    + Add                                                                                     HelloWorldFunction                                                                        AWS::Lambda::Function
    + Add                                                                                     ServerlessRestApiDeployment47fc2d5f9d                                                     AWS::ApiGateway::Deployment
    + Add                                                                                     ServerlessRestApiProdStage                                                                AWS::ApiGateway::Stage
    + Add                                                                                     ServerlessRestApi                                                                         AWS::ApiGateway::RestApi
    ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    Changeset created successfully. arn:aws:cloudformation:ap-southeast-2:123456789012:changeSet/samcli-deploy1599850642/992d6093-2025-47f8-b4ed-6a583f95394e
    
    
    Previewing CloudFormation changeset before deployment
    ======================================================
    Deploy this changeset? [y/N]: y
    
    2020-09-12 04:59:03 - Waiting for stack create/update to complete
    
    CloudFormation events from changeset
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    ResourceStatus                                                      ResourceType                                                        LogicalResourceId                                                   ResourceStatusReason
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    CREATE_IN_PROGRESS                                                  AWS::IAM::Role                                                      HelloWorldFunctionRole                                              Resource creation Initiated
    CREATE_IN_PROGRESS                                                  AWS::IAM::Role                                                      HelloWorldFunctionRole                                              -
    CREATE_COMPLETE                                                     AWS::IAM::Role                                                      HelloWorldFunctionRole                                              -
    CREATE_IN_PROGRESS                                                  AWS::Lambda::Function                                               HelloWorldFunction                                                  -
    CREATE_IN_PROGRESS                                                  AWS::Lambda::Function                                               HelloWorldFunction                                                  Resource creation Initiated
    CREATE_COMPLETE                                                     AWS::Lambda::Function                                               HelloWorldFunction                                                  -
    CREATE_IN_PROGRESS                                                  AWS::ApiGateway::RestApi                                            ServerlessRestApi                                                   -
    CREATE_IN_PROGRESS                                                  AWS::ApiGateway::RestApi                                            ServerlessRestApi                                                   Resource creation Initiated
    CREATE_COMPLETE                                                     AWS::ApiGateway::RestApi                                            ServerlessRestApi                                                   -
    CREATE_IN_PROGRESS                                                  AWS::ApiGateway::Deployment                                         ServerlessRestApiDeployment47fc2d5f9d                               -
    CREATE_IN_PROGRESS                                                  AWS::Lambda::Permission                                             HelloWorldFunctionHelloWorldPermissionProd                          -
    CREATE_IN_PROGRESS                                                  AWS::Lambda::Permission                                             HelloWorldFunctionHelloWorldPermissionProd                          Resource creation Initiated
    CREATE_COMPLETE                                                     AWS::ApiGateway::Deployment                                         ServerlessRestApiDeployment47fc2d5f9d                               -
    CREATE_IN_PROGRESS                                                  AWS::ApiGateway::Deployment                                         ServerlessRestApiDeployment47fc2d5f9d                               Resource creation Initiated
    CREATE_IN_PROGRESS                                                  AWS::ApiGateway::Stage                                              ServerlessRestApiProdStage                                          -
    CREATE_IN_PROGRESS                                                  AWS::ApiGateway::Stage                                              ServerlessRestApiProdStage                                          Resource creation Initiated
    CREATE_COMPLETE                                                     AWS::ApiGateway::Stage                                              ServerlessRestApiProdStage                                          -
    CREATE_COMPLETE                                                     AWS::Lambda::Permission                                             HelloWorldFunctionHelloWorldPermissionProd                          -
    CREATE_COMPLETE                                                     AWS::CloudFormation::Stack                                          sam-app                                                             -
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    CloudFormation outputs from deployed stack
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    Outputs
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    Key                 HelloWorldFunctionIamRole
    Description         Implicit IAM Role created for Hello World function
    Value               arn:aws:iam::123456789012:role/sam-app-HelloWorldFunctionRole-17RFCWAG7HTQU
    
    Key                 HelloWorldApi
    Description         API Gateway endpoint URL for Prod stage for Hello World function
    Value               https://8shb319j39.execute-api.ap-southeast-2.amazonaws.com/Prod/hello/
    
    Key                 HelloWorldFunction
    Description         Hello World Lambda Function ARN
    Value               arn:aws:lambda:ap-southeast-2:123456789012:function:sam-app-HelloWorldFunction-1GC0G9QLICCNV
    -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    
    Successfully created/updated stack - sam-app in ap-southeast-2
</details>

🧐 _Use Console UI or aws cli to observe the following resources!_

- CloudFormation 👉 Stacks
- S3 👉 Buckets
- IAM 👉 Roles
- Lambda 👉 Functions
- API Gateway 👉 APIs

```
aws cloudformation list-stacks
aws s3 ls
aws iam list-roles
aws iam list-roles | grep sam-app
aws lambda list-functions
aws apigateway get-rest-apis
```

🧪 _Let's test by calling the REST endpoint and invoke ƛ fn_!

```
curl -s https://8shb319j39.execute-api.ap-southeast-2.amazonaws.com/Prod/hello/ | jq
aws lambda invoke --function-name sam-app-HelloWorldFunction-1GC0G9QLICCNV out.json
```

🩺 _Check the CloudWatch log through Console UI and aws/sam cli!_

- CloudWatch 👉 Log groups

```
aws logs describe-log-groups

aws logs describe-log-streams \
    --log-group-name '/aws/lambda/sam-app-HelloWorldFunction-1GC0G9QLICCNV'

aws logs get-log-events \ 
    --log-group-name '/aws/lambda/sam-app-HelloWorldFunction-1GC0G9QLICCNV' \
    --log-stream-name '2020/09/11/[$LATEST]fd581a11e5284bd9906b2ce2ca75196d'

sam logs --help
sam logs --stack-name sam-app --name HelloWorldFunction
sam logs -n sam-app-HelloWorldFunction-1GC0G9QLICCNV
```

#### Clean Up

```
aws cloudformation get-template --stack-name sam-app > cfn_processed_tpl.json
aws cloudformation delete-stack --stack-name sam-app
```

> 🙋‍️ _This only delete Lambda function, API Gateway and IAM role! There are more clean up to be done neatly!_

_This one_ 👉
```
aws cloudformation list-stacks --stack-status-filter "CREATE_COMPLETE"
{
    "StackSummaries": [
        {
            "StackId": "arn:aws:cloudformation:ap-southeast-2:123456789012:stack/aws-sam-cli-managed-default/7aa80190-f460-11ea-8161-0abc5d72d376",
            "StackName": "aws-sam-cli-managed-default",
            "TemplateDescription": "Managed Stack for AWS SAM CLI",
            "CreationTime": "2020-09-11T18:56:20.056000+00:00",
            "LastUpdatedTime": "2020-09-11T18:56:35.536000+00:00",
            "StackStatus": "CREATE_COMPLETE",
            "DriftInformation": {
                "StackDriftStatus": "NOT_CHECKED"
            }
        },
    ]
    ...
}
```

_This one_ 👉
```
aws s3 ls
2020-09-12 04:57:05 aws-sam-cli-managed-default-samclisourcebucket-1jhm7spym3usq
...
```

_This one_ 👉
```
aws logs describe-log-groups
{
    "logGroups": [
        {
            "logGroupName": "/aws/lambda/sam-app-HelloWorldFunction-1GC0G9QLICCNV",
            "creationTime": 1599852649201,
            "metricFilterCount": 0,
            "arn": "arn:aws:logs:ap-southeast-2:123456789012:log-group:/aws/lambda/sam-app-HelloWorldFunction-1GC0G9QLICCNV:*",
            "storedBytes": 0
        },
        ...
    ]
}
```

> 💁‍  _The stack `aws-sam-cli-managed-default` basically create the `aws-sam-cli-managed-default-samclisourcebucket-1jhm7spym3usq` S3 bucket!_

```
aws cloudformation describe-stack-resources --stack-name aws-sam-cli-managed-default
```

<details>
    <summary>Click to expand!</summary>

    aws cloudformation describe-stack-resources --stack-name aws-sam-cli-managed-default
    {
        "StackResources": [
            {
                "StackName": "aws-sam-cli-managed-default",
                "StackId": "arn:aws:cloudformation:ap-southeast-2:123456789012:stack/aws-sam-cli-managed-default/7aa80190-f460-11ea-8161-0abc5d72d376",
                "LogicalResourceId": "SamCliSourceBucket",
                "PhysicalResourceId": "aws-sam-cli-managed-default-samclisourcebucket-1jhm7spym3usq",
                "ResourceType": "AWS::S3::Bucket",
                "Timestamp": "2020-09-11T18:57:02.202000+00:00",
                "ResourceStatus": "CREATE_COMPLETE",
                "DriftInformation": {
                    "StackResourceDriftStatus": "NOT_CHECKED"
                }
            },
            {
                "StackName": "aws-sam-cli-managed-default",
                "StackId": "arn:aws:cloudformation:ap-southeast-2:123456789012:stack/aws-sam-cli-managed-default/7aa80190-f460-11ea-8161-0abc5d72d376",
                "LogicalResourceId": "SamCliSourceBucketBucketPolicy",
                "PhysicalResourceId": "aws-sam-cli-managed-defa-SamCliSourceBucketBucke-19XIX69THKWOA",
                "ResourceType": "AWS::S3::BucketPolicy",
                "Timestamp": "2020-09-11T18:57:05.240000+00:00",
                "ResourceStatus": "CREATE_COMPLETE",
                "DriftInformation": {
                    "StackResourceDriftStatus": "NOT_CHECKED"
                }
            }
        ]
    }
</details>

💣 _So, we shall delete this stack too!_

> 💁‍♂️ _However, we first need to drain the S3 bucket. S3 bucket can't be deleted if there are any objects still exist in the bucket. This is by-design! Hence, if you do not purge out all S3 objects (including all versions) in the bucket, but proceed with stack deletion, it will get **DELETE_FAILED** status with "**The bucket you tried to delete is not empty**" message_.

> 😰 _Also. [Emptying bucket](https://docs.aws.amazon.com/AmazonS3/latest/dev/delete-or-empty-bucket.html) known to be not straight forward either. **TL;DR** just use S3 Console UI > Select Bucket > Empty to purge out all objects. Otherwise, it has to be done through SDK. Hence, I have [wharfie-aws](https://github.com/victorskl/wharfie-aws) for such purpose! Then, delete the stack._

```
aws cloudformation delete-stack --stack-name aws-sam-cli-managed-default
```

🚮 _Trash the log group!_

```
aws logs delete-log-group --log-group-name '/aws/lambda/sam-app-HelloWorldFunction-1GC0G9QLICCNV'
```
