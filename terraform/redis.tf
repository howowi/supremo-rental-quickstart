resource "oci_redis_redis_cluster" "dedicated_redis_cluster" {
  depends_on = [oci_core_security_list.redis_service_security_list]

  count              = var.should_setup_redis_cluster ? 1 : 0
  compartment_id     = var.compartment_ocid
  display_name       = "${var.redis_cluster_display_name}-${random_id.tag.hex}"
  node_count         = var.redis_cluster_node_count
  node_memory_in_gbs = var.redis_cluster_node_memory_in_gbs
  software_version   = var.redis_cluster_software_version
  subnet_id          = local.redis_private_subnet_id
}
