# flask-app

Python Flask API app deploy into AWS Lambda through [Serverless Framework](../../sls/README.md)

> plugin used: serverless-wsgi
- https://github.com/logandk/serverless-wsgi

Bootstrap:
```
mkdir -p flask-app
cd flask-app
vi api.py
vi local.py
vi requirements.txt
```

Local Dev:
```
conda create -n serverless-tute python=3.11
conda activate serverless-tute
pip install -r requirements.txt
python local.py
curl -s localhost:5000/cats
curl -s localhost:5000/dogs/1
```

Serverless:
```
npm install
npx sls plugin install -n serverless-wsgi
npx sls plugin install -n serverless-python-requirements

npx sls doctor
npx sls info
npx sls deploy --debug="*"
npx sls info

npx sls invoke -f api --stage dev --path test.json | jq
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "text/html; charset=utf-8",
    "Content-Length": "4"
  },
  "body": "Cats",
  "isBase64Encoded": false
}

curl -s https://genkhgwtwk.execute-api.ap-southeast-2.amazonaws.com/dev/cats
Cats%

npx sls wsgi --help
npx sls wsgi serve -p 5000
curl -s localhost:5000/cats
Cats%

aws cloudformation list-stacks
aws lambda list-functions
aws apigateway get-rest-apis
aws logs describe-log-groups --query 'logGroups[*].logGroupName'
aws s3 ls

npx sls remove --debug="*"
```
