
data "oci_objectstorage_namespace" "oss_namespace" {
  compartment_id = var.compartment_ocid
}


resource "oci_objectstorage_bucket" "oss_bucket" {
  compartment_id = var.compartment_ocid
  name           = "${var.objectstorage_bucket}-${random_id.tag.hex}"

  namespace = data.oci_objectstorage_namespace.oss_namespace.namespace
}

resource "oci_objectstorage_object" "private_key_object" {
  depends_on = [local_file.private_key_file]
  bucket     = oci_objectstorage_bucket.oss_bucket.name
  content    = tls_private_key.public_private_key_pair.private_key_pem
  namespace  = oci_objectstorage_bucket.oss_bucket.namespace
  object     = "${random_id.tag.hex}-private_key.pem"
}

resource "oci_objectstorage_object" "public_key_object" {
  depends_on = [local_file.private_key_file]
  bucket     = oci_objectstorage_bucket.oss_bucket.name
  content    = tls_private_key.public_private_key_pair.public_key_pem
  namespace  = oci_objectstorage_bucket.oss_bucket.namespace
  object     = "${random_id.tag.hex}-public_key.pem"
}
