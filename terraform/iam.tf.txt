
resource "oci_identity_policy" "open_search_policy" {
  count          = var.should_setup_opensearch_cluster ? 1 : 0
  provider       = oci.homeregion
  name           = "OpenSearchPolicy-${random_id.tag.hex}"
  description    = "This policy is created for the OCI Search Service with OpenSearch to be able to use other services and vice-versa"
  compartment_id = var.compartment_ocid
  statements = [
    "Allow service opensearch to manage vcns in compartment id ${var.compartment_ocid}",
    "Allow service opensearch to manage vnics in compartment id ${var.compartment_ocid}",
    "Allow service opensearch to use subnets in compartment id ${var.compartment_ocid}",
    "Allow service opensearch to use network-security-groups in compartment id ${var.compartment_ocid}",
    "Allow service opensearch to manage virtual-network-family in compartment id ${var.compartment_ocid}"
  ]

  provisioner "local-exec" {
    command = "sleep 5"
  }
}

resource "oci_identity_policy" "postgresql_policy" {
  count          = var.should_setup_postgresql ? 1 : 0
  provider       = oci.homeregion
  name           = "PostgreSQLPolicy-${random_id.tag.hex}"
  description    = "This policy is created for the OCI PostgreSQL to be able to use other services and vice-versa"
  compartment_id = var.tenancy_ocid
  statements = [
    "Allow any-user to read compartments in tenancy",
    "Allow any-user to manage postgres-db-systems in tenancy",
    "Allow any-user to manage postgres-backups in tenancy",
    "Allow any-user to read postgres-work-requests in tenancy",
    "Allow any-user to manage postgres-configuration in tenancy",
    "Allow any-user to manage virtual-network-family in tenancy",
    "Allow any-user to read secret-family in tenancy",
    "Allow any-user to read vaults in tenancy",
    "Allow any-user to read metrics in tenancy",
    "Allow any-user to use tag-namespaces in tenancy"
  ]

  provisioner "local-exec" {
    command = "sleep 5"
  }
}

resource "oci_identity_policy" "all_resources_policy" {
  provider       = oci.homeregion
  name           = "AllResourcesPolicy-${random_id.tag.hex}"
  description    = "This policy is created for all resources"
  compartment_id = var.compartment_ocid
  statements = [
    "Allow any-user to manage all-resources in compartment id ${var.compartment_ocid}"
  ]

  provisioner "local-exec" {
    command = "sleep 5"
  }
}
