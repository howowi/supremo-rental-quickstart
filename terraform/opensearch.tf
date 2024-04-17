# Opensearch Cluster

resource "time_sleep" "wait_policy_compilation" {
  #depends_on = [oci_identity_policy.open_search_policy[0]]

  count           = var.should_setup_opensearch_cluster ? 1 : 0
  create_duration = "90s"
}

resource "oci_opensearch_opensearch_cluster" "opensearch_cluster" {
  #depends_on = [time_sleep.wait_policy_compilation[0]]

  count = var.should_setup_opensearch_cluster ? 1 : 0

  compartment_id                     = var.compartment_ocid
  data_node_count                    = local.opensearch_cluster_data_node_count
  data_node_host_memory_gb           = local.opensearch_cluster_data_node_host_memory_gb
  data_node_host_ocpu_count          = local.opensearch_cluster_data_node_host_ocpu_count
  data_node_host_type                = local.opensearch_cluster_data_node_host_type
  data_node_storage_gb               = local.opensearch_cluster_data_node_storage_gb
  display_name                       = "${var.opensearch_cluster_display_name}-${random_id.tag.hex}"
  master_node_count                  = local.opensearch_cluster_master_node_count
  master_node_host_memory_gb         = local.opensearch_cluster_master_node_host_memory_gb
  master_node_host_ocpu_count        = local.opensearch_cluster_master_node_host_ocpu_count
  master_node_host_type              = local.opensearch_cluster_master_node_host_type
  opendashboard_node_count           = local.opensearch_cluster_opendashboard_node_count
  opendashboard_node_host_memory_gb  = local.opensearch_cluster_opendashboard_node_host_memory_gb
  opendashboard_node_host_ocpu_count = local.opensearch_cluster_opendashboard_node_host_ocpu_count
  software_version                   = var.opensearch_cluster_software_version
  security_master_user_name          = var.opensearch_cluster_master_user
  security_master_user_password_hash = var.opensearch_cluster_master_password_hash
  security_mode                      = "ENFORCING"

  subnet_compartment_id = var.compartment_ocid
  subnet_id             = local.opensearch_private_subnet_id
  vcn_compartment_id    = var.compartment_ocid
  vcn_id                = local.vcn_id

}
