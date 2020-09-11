terraform {
  required_version = ">= 0.12"
}

provider "template" {
  version = "~> 2.1.2"
}

provider "aws" {
  version = "~> 2.6"
  region = var.region
}

data "aws_caller_identity" "current" {}

// https://serverless-stack.com/chapters/create-a-dynamodb-table.html
resource "aws_dynamodb_table" "notes" {
  name = "notes"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "userId"
  range_key = "noteId"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "noteId"
    type = "S"
  }
}

// https://serverless-stack.com/chapters/create-an-s3-bucket-for-file-uploads.html
resource "aws_s3_bucket" "notes_uploads" {
  bucket = "notesapp-${data.aws_caller_identity.current.account_id}-uploads"
  acl = "private"

  cors_rule {
    allowed_origins = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "HEAD", "DELETE"]
    max_age_seconds = 3000
    allowed_headers = ["*"]
  }
}

// https://serverless-stack.com/chapters/create-a-cognito-user-pool.html
resource "aws_cognito_user_pool" "pool" {
  name = "notesapp-user-pool"
  username_attributes = ["email"]
}

resource "aws_cognito_user_pool_client" "client" {
  name = "notesapp-client"
  user_pool_id = aws_cognito_user_pool.pool.id
  generate_secret = false
  explicit_auth_flows = ["ADMIN_NO_SRP_AUTH"]
}

resource "aws_cognito_user_pool_domain" "domain" {
  domain = "notesapp-dev"
  user_pool_id = aws_cognito_user_pool.pool.id
}

// https://serverless-stack.com/chapters/create-a-cognito-identity-pool.html
resource "aws_cognito_identity_pool" "this" {
  identity_pool_name = "notesapp"
  allow_unauthenticated_identities = false

  cognito_identity_providers {
    client_id = aws_cognito_user_pool_client.client.id
    provider_name = aws_cognito_user_pool.pool.endpoint
    server_side_token_check = false
  }
}

# Assume role policy for authenticated identities
data "template_file" "iam_role_authenticated_assume_role_policy" {
  template = file("policies/iam_role_authenticated_assume_role_policy.json")

  vars = {
    identity_pool_id = aws_cognito_identity_pool.this.id
  }
}

resource "aws_iam_role" "notesapp_auth_role" {
  name = "notesapp-auth-role"
  assume_role_policy = data.template_file.iam_role_authenticated_assume_role_policy.rendered
}

# Resource permission policy for authenticated identities
data "template_file" "iam_role_authenticated_policy" {
  # FIXME: should have a explicit reference to our api
  template = file("policies/iam_role_authenticated_policy.json")
}

resource "aws_iam_role_policy" "role_policy_authenticated" {
  name = "notesapp-authenticated-policy"
  role = aws_iam_role.notesapp_auth_role.id
  policy = data.template_file.iam_role_authenticated_policy.rendered
}

# Attach the IAM role to the identity pool
resource "aws_cognito_identity_pool_roles_attachment" "identity_pool_role_attach" {
  identity_pool_id = aws_cognito_identity_pool.this.id

  roles = {
    "authenticated" = aws_iam_role.notesapp_auth_role.arn
  }
}
