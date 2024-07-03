
output "service_vm_public_ip" {
  value = var.should_setup_vm && var.should_config_public_ip_for_vm ? oci_core_instance.service_instance[0].public_ip : null
}

output "service_vm_private_ip" {
  value = var.should_setup_vm && var.should_config_public_ip_for_vm ? oci_core_instance.service_instance[0].private_ip : null
}


# Autonomous Database output
output "adb_connection_strings" {
  value = var.should_setup_adb ? oci_database_autonomous_database.adb_database[0].connection_strings : null
}


# Opensearch output
output "opensearch_api_endpoint" {
  value = var.should_setup_opensearch_cluster ? oci_opensearch_opensearch_cluster.opensearch_cluster[0].opensearch_fqdn != null ? "${oci_opensearch_opensearch_cluster.opensearch_cluster[0].opensearch_fqdn}:9200" : null : null
}

output "opensearch_api_private_ip" {
  value = var.should_setup_opensearch_cluster ? oci_opensearch_opensearch_cluster.opensearch_cluster[0].opensearch_private_ip : null
}

output "opensearch_dashboards_api_endpoint" {
  value = var.should_setup_opensearch_cluster ? oci_opensearch_opensearch_cluster.opensearch_cluster[0].opendashboard_fqdn != null ? "${oci_opensearch_opensearch_cluster.opensearch_cluster[0].opendashboard_fqdn}:5601" : null : null
}

output "opensearch_dashboard_private_ip" {
  value = var.should_setup_opensearch_cluster ? oci_opensearch_opensearch_cluster.opensearch_cluster[0].opendashboard_private_ip : null
}


# Redis output
output "redis_primay_endpoint" {
  value = var.should_setup_redis_cluster ? oci_redis_redis_cluster.dedicated_redis_cluster[0].primary_fqdn : null
}

output "redis_primay_endpoint_ip" {
  value = var.should_setup_redis_cluster ? oci_redis_redis_cluster.dedicated_redis_cluster[0].primary_endpoint_ip_address : null
}


# Nosql output
output "nosql_compartment" {
  value = var.should_setup_nosql_table ? var.compartment_ocid : null
}


# PostgreSQL output
output "postgresql_primary_db_endpoint" {
  value = var.should_setup_postgresql ? data.oci_psql_db_system_connection_detail.pg_db_system_connection_detail[0].primary_db_endpoint : null
}


# Load Balancer output
output "pg_load_balancer_ip" {
  value = var.should_setup_load_balancer ? oci_load_balancer_load_balancer.pg_load_balancer[0].ip_address_details : null
}



locals {
  ip_address = var.should_setup_vm && var.should_config_public_ip_for_vm ? oci_core_instance.service_instance[0].public_ip : null
}

# API endpoints output
# output "api_demos" {
#   value = {
#     car_service_redis  = "http://${local.ip_address}/car-service-redis/cars",
#     car_service        = "http://${local.ip_address}/car-service/cars",
#     user_service_redis = "http://${local.ip_address}/user-service-redis/users",
#     user_service       = "http://${local.ip_address}/user-service/users",
#     order_search       = "http://${local.ip_address}/order-service/orders",
#     car_health         = "http://${local.ip_address}/car-health/cars/t001"
#   }
# }

output "endpoint_of_car_service_redis" {
  value = "http://${local.ip_address}/car-service-redis/cars"
}

output "car_service" {
  value = "http://${local.ip_address}/car-service/cars"
}

output "user_service_redis" {
  value = "http://${local.ip_address}/user-service-redis/users"
}

output "user_service" {
  value = "http://${local.ip_address}/user-service/users"
}

output "order_search" {
  value = "http://${local.ip_address}/order-service/orders"
}

output "car_health" {
  value = "http://${local.ip_address}/car-health/cars/t001"
}

# OCI CLI Identity output

output "OCI_CLI_FINGERPRINT" {
  value = oci_identity_api_key.user_api_key.fingerprint
}

output "OCI_CLI_KEY_CONTENT" {
  value     = "Please download ${oci_objectstorage_object.private_key_object.object} from bucket ${oci_objectstorage_bucket.oss_bucket.name}"
}

output "OCI_CLI_REGION" {
  value = var.region
}

output "OCI_CLI_TENANCY" {
  value = var.tenancy_ocid
}

output "OCI_CLI_USER" {
  value = var.user_ocid
}

output "OCI_COMPARTMENT_OCID" {
  value = var.compartment_ocid
}

output "OCI_AUTH_TOKEN" {
  value = oci_identity_auth_token.user_auth_token.token
}

output "OCI_DEVOPS_PIPELINE_ID" {
  value = oci_devops_deploy_pipeline.supremo-deploy-pipeline.id
}

# Bastion instance output
output "bastion_instance_public_ip" {
  value = oci_core_instance.bastion_instance[0].public_ip
}
