locals {
  should_use_existing_network = var.network_creation_strategy == "USE_EXISTING_VCN_SUBNET" ? true : false

  vcn_id = var.network_creation_strategy == "USE_EXISTING_VCN_SUBNET" ? var.existing_vcn_id : oci_core_vcn.opensearch_redis_vcn[0].id

  # should_config_adb_private_subnet        = var.network_creation_strategy == "CREATE_NEW_VCN_SUBNET" && var.subnet_strategy == "SEPARATE_SUBNET" && var.should_setup_adb ? true : false
  # should_config_postgresql_private_subnet = var.network_creation_strategy == "CREATE_NEW_VCN_SUBNET" && var.subnet_strategy == "SEPARATE_SUBNET" && var.should_setup_postgresql ? true : false
  # should_config_nosql_private_subnet      = var.network_creation_strategy == "CREATE_NEW_VCN_SUBNET" && var.subnet_strategy == "SEPARATE_SUBNET" && var.should_setup_nosql_table ? true : false
  # should_config_opensearch_private_subnet = var.network_creation_strategy == "CREATE_NEW_VCN_SUBNET" && var.subnet_strategy == "SEPARATE_SUBNET" && var.should_setup_opensearch_cluster ? true : false
  # should_config_redis_private_subnet      = var.network_creation_strategy == "CREATE_NEW_VCN_SUBNET" && var.subnet_strategy == "SEPARATE_SUBNET" && var.should_setup_redis_cluster ? true : false
  should_config_shared_private_subnet = var.network_creation_strategy == "CREATE_NEW_VCN_SUBNET" && var.subnet_strategy == "SHARED_SUBNET" ? true : false

  should_config_public_subnet = !local.should_use_existing_network && var.should_setup_vm && var.should_config_public_ip_for_vm
  vm_subnet_id                = local.should_use_existing_network ? var.existing_vm_subnet_id : local.should_config_public_subnet ? oci_core_subnet.vm_public_subnet[0].id : local.private_subnet_id

  private_subnet_id            = local.should_use_existing_network ? var.existing_private_subnet_id : oci_core_subnet.shared_private_subnet[0].id
  opensearch_private_subnet_id = local.should_use_existing_network ? var.existing_private_subnet_id : local.private_subnet_id
  redis_private_subnet_id      = local.should_use_existing_network ? var.existing_private_subnet_id : local.private_subnet_id


  opensearch_cluster_data_node_count                    = 1
  opensearch_cluster_data_node_host_memory_gb           = 20
  opensearch_cluster_data_node_host_ocpu_count          = 4
  opensearch_cluster_data_node_host_type                = "FLEX"
  opensearch_cluster_data_node_storage_gb               = 50
  opensearch_cluster_master_node_count                  = 1
  opensearch_cluster_master_node_host_memory_gb         = 20
  opensearch_cluster_master_node_host_ocpu_count        = 1
  opensearch_cluster_master_node_host_type              = "FLEX"
  opensearch_cluster_opendashboard_node_count           = 1
  opensearch_cluster_opendashboard_node_host_memory_gb  = 16
  opensearch_cluster_opendashboard_node_host_ocpu_count = 1
}
