
resource "tls_private_key" "public_private_key_pair" {
  algorithm = "RSA"
}

resource "local_file" "private_key_file" {
  filename        = "${path.module}/private_key.pem"
  content         = tls_private_key.public_private_key_pair.private_key_pem
  file_permission = "600"
}

resource "local_file" "public_key_file" {
  filename        = "${path.module}/public_key.pem"
  content         = tls_private_key.public_private_key_pair.public_key_pem
  file_permission = "600"
}
