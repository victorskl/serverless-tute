# serverless-tute

Serverless (Functions as a Service -- FaaS) tute

### Concepts

- [Functions as a Service](https://en.wikipedia.org/wiki/Function_as_a_service)
- [What is Serverless?](https://serverless-stack.com/chapters/what-is-serverless.html)
- [What is AWS Lambda?](https://serverless-stack.com/chapters/what-is-aws-lambda.html)

Keywords:

- Stateless Functions
- Cold starts vs Warm starts
- Auto-scaling vs PaaS vs FaaS
- Pay-per-execution Pricing Model

### Serverless on AWS

Basically, the key idea for running a serverless application on AWS means:
- Write/create [server-side](https://en.wikipedia.org/wiki/Dynamic_web_page) business logic functions in [AWS Lambda](https://aws.amazon.com/lambda/)
- Then use/route HTTP requests through [AWS API Gateway](https://aws.amazon.com/api-gateway/) 

Optionally,
- If you have a [client-side](https://en.wikipedia.org/wiki/Dynamic_web_page) SPA frontend that XHR to your Lambda backend functions, then you can compile static resources and, serve this client-side SPA through [S3](https://aws.amazon.com/s3/) -- with or without [CloudFront](https://aws.amazon.com/cloudfront/), or [CloudFlare](https://www.cloudflare.com) as [CDN](https://en.wikipedia.org/wiki/Content_delivery_network).
- Your backend could be just pure compute function. Otherwise, some business logic implementation or, data processing and transformation ([ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load) for example) using persistence backend stack like [RDS](https://aws.amazon.com/rds/) for database, [DynamoDB](https://aws.amazon.com/dynamodb/) or [DocumentDB](https://aws.amazon.com/documentdb/) for NoSQL. And additionally a message queue like [SQS](https://aws.amazon.com/sqs/) or [EventBridge](https://aws.amazon.com/eventbridge/) in the mix!

### Approaches

- Node.js based [Serverless Framework](sls)
- AWS [Serverless Application Model](sam)
- Kubernetes Native Serverless Framework - https://kubeless.io
- [Cloudflare Workers](https://www.cloudflare.com/en-au/products/cloudflare-workers/) 
