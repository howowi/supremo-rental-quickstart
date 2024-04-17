
# Creates a new Autonomous Database
resource "oci_database_autonomous_database" "adb_database" {
  #depends_on = [oci_identity_policy.all_resources_policy]

  count = var.should_setup_adb ? 1 : 0
  #Required
  admin_password = var.adb_admin_password
  compartment_id = var.compartment_ocid
  db_name        = var.adb_db_name

  cpu_core_count           = var.adb_cpu_core_count
  data_storage_size_in_tbs = var.adb_data_storage_size_in_tbs
  #database_edition                    = var.adb_database_edition
  db_version                          = var.adb_db_version
  db_workload                         = var.adb_db_workload
  display_name                        = "${var.adb_display_name}-${random_id.tag.hex}"
  is_auto_scaling_enabled             = var.adb_is_auto_scaling_enabled
  is_auto_scaling_for_storage_enabled = var.adb_is_auto_scaling_for_storage_enabled
  is_mtls_connection_required         = var.adb_is_mtls_connection_required
  license_model                       = var.adb_license_model
  ocpu_count                          = var.adb_ocpu_count
  private_endpoint_label              = var.adb_private_endpoint_label
  subnet_id                           = local.private_subnet_id
}


# Creates and downloads a wallet for the specified Autonomous Database.
resource "oci_database_autonomous_database_wallet" "adb_wallet" {
  count = var.should_setup_adb ? 1 : 0
  #Required
  autonomous_database_id = oci_database_autonomous_database.adb_database[count.index].id
  password               = var.adb_wallet_password

  #Optional
  base64_encode_content = "true"
  generate_type         = var.adb_wallet_generate_type
  is_regional           = var.adb_wallet_is_regional
}

resource "local_file" "adb_wallet_file" {
  count          = var.should_setup_adb ? 1 : 0
  content_base64 = oci_database_autonomous_database_wallet.adb_wallet[count.index].content
  filename       = "${path.module}/adb_wallet.zip"
}
