# Creates a new nosql table
resource "oci_nosql_table" "demo_table" {
  count = var.should_setup_nosql_table ? 1 : 0
  #Required
  compartment_id = var.compartment_ocid
  ddl_statement  = var.nosql_table_ddl_statement
  name           = var.nosql_table_name

  #Optional
  is_auto_reclaimable = var.nosql_table_is_auto_reclaimable
  table_limits {
    #Required
    max_read_units     = var.nosql_table_max_read_units
    max_storage_in_gbs = var.nosql_table_max_storage_in_gbs
    max_write_units    = var.nosql_table_max_write_units
  }
}
