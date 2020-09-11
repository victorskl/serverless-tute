output "region" {
  value = var.region
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.notes.name
}

output "s3_notes_uploads_bucket_name" {
  value = aws_s3_bucket.notes_uploads.bucket
}

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.pool.id
}

output "cognito_user_pool_arn" {
  value = aws_cognito_user_pool.pool.arn
}

output "cognito_user_pool_client_id" {
  value = aws_cognito_user_pool_client.client.id
}

output "cognito_user_pool_domain" {
  value = aws_cognito_user_pool_domain.domain.domain
}

output "cognito_identity_pool_id" {
  value = aws_cognito_identity_pool.this.id
}
