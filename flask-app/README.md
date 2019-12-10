# flask-app

Python Flask API app deploy into AWS Lambda through [Serverless Framework](../SERVERLESS.md)

> plugin: serverless-wsgi
- https://github.com/logandk/serverless-wsgi


Local Dev:
```
mkdir -p flask-app
cd flask-app
vi api.py
vi local.py
vi requirements.txt

pip install -r requirements.txt
python local.py
curl -s localhost:5000/cats
```

Serverless:
```
vi serverless.yml
serverless plugin install -n serverless-wsgi

serverless info
SLS_DEBUG=* serverless deploy

serverless invoke -f api --STAGE dev --path test.json | jq

curl -s https://2edfs4egei.execute-api.us-east-1.amazonaws.com/dev/cats

serverless wsgi serve -p 5000
curl -s localhost:5000/cats

serverless wsgi --help
    Plugin: ServerlessWSGI
    wsgi .......................... Deploy Python WSGI applications
    wsgi serve .................... Serve the WSGI application locally
    wsgi install .................. Install WSGI handler and requirements for local use
    wsgi clean .................... Remove cached requirements
    wsgi command .................. Execute shell commands or scripts remotely
    wsgi command local ............ Execute shell commands or scripts locally
    wsgi exec ..................... Evaluate Python code remotely
    wsgi exec local ............... Evaluate Python code locally
    wsgi manage ................... Run Django management commands remotely
    wsgi manage local ............. Run Django management commands locally
    wsgi flask .................... Run Flask CLI commands remotely
    wsgi flask local .............. Run Flask CLI commands locally

SLS_DEBUG=* serverless remove
```
