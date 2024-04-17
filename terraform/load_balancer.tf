
# Creates a new load balancer in the specified compartment
resource "oci_load_balancer_load_balancer" "pg_load_balancer" {
  #depends_on = [oci_identity_policy.all_resources_policy]

  count = var.should_setup_load_balancer ? 1 : 0
  #Required
  compartment_id = var.compartment_ocid
  display_name   = "${var.load_balancer_display_name}-${random_id.tag.hex}"
  shape          = var.load_balancer_shape
  subnet_ids     = [local.private_subnet_id]

  #Optional
  is_private                 = var.load_balancer_is_private
  network_security_group_ids = [oci_core_network_security_group.pg_network_security_group[count.index].id]
}


# Adds a backend set to a load balancer
resource "oci_load_balancer_backend_set" "pg_backend_set" {
  count = var.should_setup_load_balancer ? 1 : 0
  #Required
  health_checker {
    #Required
    protocol = var.backend_set_health_checker_protocol

    #Optional
    interval_ms         = var.backend_set_health_checker_interval_ms
    port                = var.backend_set_health_checker_port
    response_body_regex = var.backend_set_health_checker_response_body_regex
    retries             = var.backend_set_health_checker_retries
    return_code         = var.backend_set_health_checker_return_code
    timeout_in_millis   = var.backend_set_health_checker_timeout_in_millis
    url_path            = var.backend_set_health_checker_url_path
  }
  load_balancer_id = oci_load_balancer_load_balancer.pg_load_balancer[count.index].id
  name             = var.backend_set_name
  policy           = var.backend_set_policy
}

resource "oci_load_balancer_backend" "pg_backend" {
  depends_on = [data.oci_psql_db_system_connection_detail.pg_db_system_connection_detail[0], oci_load_balancer_load_balancer.pg_load_balancer[0]]
  count      = var.should_setup_load_balancer ? 1 : 0
  #Required
  backendset_name  = oci_load_balancer_backend_set.pg_backend_set[count.index].name
  ip_address       = data.oci_psql_db_system_connection_detail.pg_db_system_connection_detail[count.index].primary_db_endpoint[0].ip_address
  port             = var.pg_port
  load_balancer_id = oci_load_balancer_load_balancer.pg_load_balancer[count.index].id
}

resource "oci_core_network_security_group" "pg_network_security_group" {
  count = var.should_setup_load_balancer ? 1 : 0
  #Required
  compartment_id = var.compartment_ocid
  vcn_id         = local.vcn_id
}


resource "oci_load_balancer_listener" "pg_listener" {
  count = var.should_setup_load_balancer ? 1 : 0
  #Required
  default_backend_set_name = oci_load_balancer_backend_set.pg_backend_set[count.index].name
  load_balancer_id         = oci_load_balancer_load_balancer.pg_load_balancer[count.index].id
  name                     = "pg-listener"
  port                     = var.pg_port
  protocol                 = "TCP"

  connection_configuration {
    idle_timeout_in_seconds            = "1200"
    backend_tcp_proxy_protocol_version = "1"
  }
}

