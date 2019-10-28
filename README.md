# serverless-tute

Serverless (Functions as a Service) tute

### Concepts
- [Functions as a Service - FaaS](https://en.wikipedia.org/wiki/Function_as_a_service)
- [What is Serverless?](https://serverless-stack.com/chapters/what-is-serverless.html)
- [What is AWS Lambda?](https://serverless-stack.com/chapters/what-is-aws-lambda.html)
- [How does Serverless Architectures compare to other deployment technologies](https://serverless.com/learn/comparisons/)

#### Keywords
- Stateless Functions
- Cold starts vs Warm starts
- Auto-scaling vs PaaS vs FaaS
- Pay-per-execution Pricing Model

#### TL;DR AWS

Basically, the key idea for running a serverless application on AWS means:
- Write/create (usually _server-side_) functions in [AWS Lambda](https://aws.amazon.com/lambda/)
- Then use/route HTTP requests through [AWS API Gateway](https://aws.amazon.com/api-gateway/) 

Optionally,
- If you have a _client-side_ frontend that serving your Lambda backend functions, then you can compile static resources and serve it through [S3](https://aws.amazon.com/s3/) -- with or without [CloudFront](https://aws.amazon.com/cloudfront/).
- Your backend could be just pure compute function for computation only! Otherwise, use persistence backend stack like [RDS](https://aws.amazon.com/rds/) for database, [DynamoDB](https://aws.amazon.com/dynamodb/) or [DocumentDB](https://aws.amazon.com/documentdb/) for NoSQL. And additionally add message queue like [SQS](https://aws.amazon.com/sqs/) or [EventBridge](https://aws.amazon.com/eventbridge/) in the mix!

### Frameworks

- Node.js based [Serverless Framework](https://en.wikipedia.org/wiki/Serverless_Framework)
    - https://github.com/serverless/serverless
    - https://serverless.com/framework/docs/
    - Tutorials from https://serverless-stack.com
        - [notes-app-api](notes-app-api)
        - [notes-app-client](notes-app-client)

- Kubernetes Native Serverless Framework - [Kubeless](https://kubeless.io)

