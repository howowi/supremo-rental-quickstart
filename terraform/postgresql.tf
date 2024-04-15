# Creates PostgreSQL DbSystem
resource "oci_psql_db_system" "pg_db_system" {
  depends_on = [oci_identity_policy.postgresql_policy[0]]

  count = var.should_setup_postgresql ? 1 : 0
  #Required
  compartment_id = var.compartment_ocid
  db_version     = var.db_system_db_version
  display_name   = "${var.db_system_display_name}-${random_id.tag.hex}"
  network_details {
    #Required
    subnet_id = local.private_subnet_id
  }
  shape = var.db_system_shape
  storage_details {
    #Required
    is_regionally_durable = var.db_system_storage_details_is_regionally_durable
    system_type           = var.db_system_storage_details_system_type
    availability_domain   = data.oci_identity_availability_domains.ADs.availability_domains[0]["name"]
  }
  credentials {
    #Required
    password_details {
      #Required
      password_type = var.db_system_credentials_password_details_password_type
      #Optional
      password = var.db_system_credentials_password_details_password
    }
    username = var.db_system_credentials_username
  }
  instance_count              = var.db_system_instance_count
  instance_memory_size_in_gbs = var.db_system_instance_memory_size_in_gbs
  instance_ocpu_count         = var.db_system_instance_ocpu_count
}


data "oci_psql_db_system_connection_detail" "pg_db_system_connection_detail" {
  count = var.should_setup_postgresql ? 1 : 0
  #Required
  db_system_id = oci_psql_db_system.pg_db_system[count.index].id
}
