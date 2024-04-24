#*************************************
#           TF Requirements
#*************************************
variable "region" {
  description = "OCI Region"
  nullable    = false
}

variable "tenancy_ocid" {
  description = "Tenancy OCID"
  nullable    = false
}

variable "compartment_ocid" {
  description = "OCID of the compartment where VCN, Compute and Opensearch will be created"
  nullable    = false
}

variable "user_ocid" {
  description = "OCID of the user who provisioning OCI resources"
  default     = ""
}

variable "private_key_path" {
  default = ""
}

variable "fingerprint" {
  default = ""
}

variable "ssh_public_key" {
  description = "ssh public key"
  default     = ""
}



#*************************************
#           VCN
#*************************************
variable "network_creation_strategy" {
  default     = "CREATE_NEW_VCN_SUBNET"
  description = "Whether to Create a new VCN/Subnet OR Use existing one. Valid values are 'CREATE_NEW_VCN_SUBNET' and 'USE_EXISTING_VCN_SUBNET'. To use existing network, VCN should have public, private subnets and all necessary security lists, route tables, internet gateway, NAT gateway - same as configured in network.tf."

  validation {
    condition     = contains(["CREATE_NEW_VCN_SUBNET", "USE_EXISTING_VCN_SUBNET"], var.network_creation_strategy)
    error_message = "Only valid values are 'CREATE_NEW_VCN_SUBNET' and 'USE_EXISTING_VCN_SUBNET'"
  }
}

variable "vcn_name" {
  description = "VCN Name"
  default     = "open_source_stack_vcn"
}

variable "vcn_cidr" {
  description = "VCN's CIDR IP Block"
  default     = "10.0.0.0/16"
}

variable "subnet_strategy" {
  default     = "SHARED_SUBNET"
  description = "Whether to Use Separate subnet for Redis and Opensearch OR use same shared subnet. Valid values are 'SEPARATE_SUBNET' and 'SHARED_SUBNET'"

  validation {
    condition     = contains(["SEPARATE_SUBNET", "SHARED_SUBNET"], var.subnet_strategy)
    error_message = "Only valid values are 'SEPARATE_SUBNET' and 'SHARED_SUBNET'"
  }
}

variable "existing_vcn_compartment" {
  default = ""
}

variable "existing_vcn_id" {
  default     = ""
  description = "ID of the existing VCN to be used. Mandatory if network_creation_strategy is 'USE_EXISTING_VCN_SUBNET'. eg: ocid1.vcn.oc1.iad.amaaaaaajxxx"
}

variable "existing_subnet_compartment" {
  default = ""
}

variable "existing_private_subnet_id" {
  default     = ""
  description = "ID of the existing private subnet for autonomous database, postgresql, opensearch and redis. Mandatory if network_creation_strategy is 'USE_EXISTING_VCN_SUBNET'. eg: ocid1.subnet.oc1.iad.amaaaaaajxxx"
}

variable "existing_vm_subnet_id" {
  default     = ""
  description = "ID of the existing subnet (public subnet preferred, if connectivity to opensearch needed) to be used for creating VM. Mandatory if network_creation_strategy is 'USE_EXISTING_VCN_SUBNET'. eg: ocid1.subnet.oc1.iad.amaaaaaajxxx"
}

#*************************************
#           Autonomous Database
#*************************************
variable "should_setup_adb" {
  description = "Should setup Autonomous Database?"
  type        = bool
  default     = true
  nullable    = false
}

variable "should_configure_adb_params" {
  type     = bool
  default  = false
  nullable = false
}

variable "adb_admin_password" {
  description = "Autonomous database admin password must be between 12 and 30 characters long."
  default     = "BotWelcome123##"
}

variable "adb_db_name" {
  description = "Autonomous database name"
  default     = "demojsondb"
}

variable "adb_cpu_core_count" {
  description = "The number of CPU cores to be made available to the database"
  default     = 1
}

variable "adb_data_storage_size_in_tbs" {
  description = "The size, in terabytes, of the data volume that will be created and attached to the database"
  default     = 1
}

# variable "adb_database_edition" {
#   description = "The Oracle Database Edition that applies to the Autonomous database"
#   default     = "STANDARD_EDITION"
# }

variable "adb_db_version" {
  description = "A valid Oracle database version for Autonomous database"
  default     = "19c"
}

variable "adb_db_workload" {
  description = "The Autonomous database workload type"
  default     = "AJD"
}

variable "adb_display_name" {
  description = "The user-friendly name for the Autonomous database"
  default     = "demojsondb"
}

variable "adb_is_auto_scaling_enabled" {
  description = "Indicates fi auto scaling is enabled for the Autonomous database CPU core count"
  type        = bool
  default     = true
}

variable "adb_is_auto_scaling_for_storage_enabled" {
  description = "Indicates if auto scaling is enabled for the Autonomous database storage"
  type        = bool
  default     = false
}

variable "adb_is_mtls_connection_required" {
  description = "Indicates whether the Autonomous database requries mTLS connections"
  type        = bool
  default     = false
}

variable "adb_license_model" {
  description = "The Oracle license model that applies to the Oracle Autonomous Database,It is a required field when db_workload is AJD and needs to be set to LICENSE_INCLUDED as AJD does not support default license_model value BRING_YOUR_OWN_LICENSE"
  default     = "LICENSE_INCLUDED"
}

variable "adb_ocpu_count" {
  description = "The number of OCPU cores to be made available to the database"
  default     = 1
}

variable "adb_private_endpoint_label" {
  description = "The resource's private endpoint label"
  default     = ""
}

# Autonomous Database wallet
variable "adb_wallet_password" {
  description = "Autonomous Database wallet password"
  default     = "BotWelcome123##"
}

variable "adb_wallet_generate_type" {
  description = "Autonomous Database wallet generate type"
  default     = ""
}

variable "adb_wallet_is_regional" {
  description = "Autonomous Database wallet is regional"
  type        = bool
  default     = true
}


#*************************************
#           PostgreSQL
#*************************************
variable "should_setup_postgresql" {
  description = "Should setup PostgreSQL?"
  type        = bool
  default     = true
  nullable    = false
}

variable "should_configure_postgresql_params" {
  type     = bool
  default  = false
  nullable = false
}

variable "db_system_db_version" {
  description = "PostgreSQL version"
  type        = number
  default     = 14
}

variable "db_system_display_name" {
  description = "postgress db service name"
  type        = string
  default     = "postgresql" # example value
}


variable "db_system_shape" {
  description = "postgresql shape"
  type        = string
  default     = "PostgreSQL.VM.Standard.E4.Flex.4.64GB" # example value
  #change the shape value as per your requirements
}

variable "db_system_instance_count" {
  description = "postgresql instance count"
  type        = number
  default     = 1 # example value
}

variable "db_system_instance_memory_size_in_gbs" {
  description = "postgresql RAM"
  type        = number
  default     = 64 # example value
}

variable "db_system_instance_ocpu_count" {
  description = "postgresql OCPU count"
  type        = number
  default     = 4 # example value
}

variable "db_system_storage_details_is_regionally_durable" {
  description = "postgresql regional"
  type        = bool
  default     = false
}
variable "db_system_credentials_password_details_password_type" {
  description = "postgresql password type"
  type        = string
  default     = "PLAIN_TEXT"

}

variable "db_system_credentials_password_details_password" {
  description = "postgresql password"
  type        = string
  default     = "BotWelcome123##"
}

variable "db_system_credentials_username" {
  description = "postgresql username"
  type        = string
  default     = "admin" # example value
}

variable "db_system_storage_details_system_type" {
  description = "postgresql storage type"
  type        = string
  default     = "OCI_OPTIMIZED_STORAGE"
}



#*************************************
#           NoSQL
#*************************************

variable "should_setup_nosql_table" {
  description = "Should setup NoSQL table?"
  type        = bool
  default     = true
  nullable    = false
}

variable "should_configure_nosql_table_params" {
  type     = bool
  default  = false
  nullable = false
}

variable "nosql_table_ddl_statement" {
  description = "Nosql table ddl statement"
  type        = string
  #default     = "CREATE TABLE if not exists demo(fullName STRING, contactPhone STRING, ticketNo STRING, confNo STRING,gender  STRING, bagInfo JSON,  PRIMARY KEY ( ticketNo ))"
  default = "CREATE TABLE IF NOT EXISTS CarHealth (carid string, lastservicedate timestamp(6),mileage integer, fueltype string,enginepower string,enginestatus string, transmissiontype string, fuelLevel string, name string, model string, PRIMARY KEY ( carid, lastservicedate ))"
}

variable "nosql_table_name" {
  description = "Nosql table name"
  type        = string
  default     = "CarHealth"
}

variable "nosql_table_is_auto_reclaimable" {
  description = "Nosql table is auto reclaimable?"
  type        = bool
  default     = false
}

variable "nosql_table_max_read_units" {
  description = "Nosql table max_read_units"
  default     = "10"
}

variable "nosql_table_max_storage_in_gbs" {
  description = "Nosql table max_storage_in_gbs"
  default     = "2"
}

variable "nosql_table_max_write_units" {
  description = "Nosql table max_write_units"
  default     = "10"
}



#*************************************
#           Opensearch
#*************************************
variable "should_setup_opensearch_cluster" {
  description = "Should setup Opensearch Cluster?"
  type        = bool
  default     = true
  nullable    = false
}

variable "should_configure_opensearch_params" {
  type     = bool
  default  = false
  nullable = false
}

variable "opensearch_cluster_software_version" {
  default = "2.11.0"
}

variable "opensearch_cluster_display_name" {
  default = "genaiagentopensearchcluster"
}

variable "opensearch_cluster_master_user" {
  default     = "osmaster"
  description = "Master User name to be configured for the Opensearch Cluster"
  nullable    = false
}

variable "opensearch_cluster_master_password_hash" {
  # default password Osmaster@123
  default     = "pbkdf2_stretch_1000$4X9GUAifGwpc1gAdmFzzUR5ckuNRRYyI$Kq/AlpObnt2s8gfahTgYVyM0s2uzrPMqpELUXQZw8YQ="
  description = "To generate this value, Download this jar oci-crypto-common-1.0.0-SNAPSHOT.jar from https://objectstorage.uk-london-1.oraclecloud.com/p/ZcVUX2JmCqwxgS9szgYfk1wyf7UwzxAHyXb2xwDFX5boKrd-JrvOnC7vzRttQxio/n/idee4xpu3dvm/b/os-ops-tools/o/oci-crypto-common-1.0.0-SNAPSHOT.jar. Then execute the command java -jar oci-crypto-common-1.0.0-SNAPSHOT.jar pbkdf2_stretch_1000 <password-in-plain-text>"
  nullable    = false
}

variable "opensearch_cluster_master_password" {
  # default password Osmaster@123
  default     = "Osmaster@123"
  description = "Default Password for Opensearch Cluster"
  nullable    = false
  sensitive   = true
}

#*************************************
#           Redis
#*************************************

variable "should_setup_redis_cluster" {
  description = "Should setup Redis cluster?"
  type        = bool
  default     = true
  nullable    = false
}

variable "should_configure_redis_params" {
  type     = bool
  default  = false
  nullable = false
}

variable "redis_cluster_software_version" {
  description = "Redis Software version to be used"
  default     = "V7_0_5"
}

variable "redis_cluster_display_name" {
  description = "Display name for Redis Cluster"
  default     = "Redis Cluster"
}

variable "redis_cluster_node_count" {
  description = "How many nodes should the cluster have"
  default     = "2"
}

variable "redis_cluster_node_memory_in_gbs" {
  description = "How large should each Redis node be"
  default     = "4"
}

#*************************************
#           Compute Instance
#*************************************
variable "should_setup_vm" {
  description = "Should setup VM (This is needed for configuring PostgreSQL and application resources through this stack)? "
  type        = bool
  default     = true
  nullable    = false
}

variable "should_configure_compute_instance_params" {
  type     = bool
  default  = false
  nullable = false
}

variable "availability_domain_name" {
  default = ""
}

variable "vm_instance_name" {
  description = "Name of the compute instance to configure PostgreSQL and/or create Application resources."
  default     = "app-instance"
}

variable "should_config_public_ip_for_vm" {
  description = "Should the VM be configured with public IP?"
  type        = bool
  default     = true
  nullable    = false
}

variable "node_shape" {
  description = "Instance shape to use for master instance."
  default     = "VM.Standard.E4.Flex"
}

variable "node_flex_shape_memory" {
  description = "Flex Instance shape Memory (GB)"
  default     = 32
}

variable "node_flex_shape_ocpus" {
  description = "Flex Instance shape OCPUs"
  default     = 2
}

variable "instance_os" {
  description = "Operating system for compute instances"
  default     = "Oracle Linux"
}

variable "linux_os_version" {
  description = "Operating system version for all Linux instances"
  default     = "9"
}



#*************************************
#           Load Balancer
#*************************************

variable "should_setup_load_balancer" {
  description = "Should setup Load Balancer?"
  type        = bool
  default     = true
  nullable    = false
}

variable "should_configure_load_balancer_params" {
  type     = bool
  default  = false
  nullable = false
}

variable "load_balancer_display_name" {
  description = "A user-friendly name"
  default     = "pg-load-balancer"
}

variable "load_balancer_shape" {
  description = "A template that determines the total pre-provisioned bandwidth (ingress plus egress)"
  default     = "100Mbps"
}

variable "load_balancer_subnet_ids" {
  description = "An array of subnet OCIDs"
  default     = ""
}


variable "load_balancer_is_private" {
  description = "Whether the load balancer has a VCN-local (private) IP address"
  type        = bool
  default     = true
}

variable "load_balancer_network_security_group_ids" {
  description = "An array of NSG OCIDs associated with this load balancer"
  default     = ""
}

variable "backend_set_health_checker_protocol" {
  description = "The protocol the health check must use; either HTTP or TCP"
  default     = "TCP"
}

variable "backend_set_health_checker_interval_ms" {
  description = "The interval between health checks, in milliseconds"
  type        = number
  default     = 1000
}

variable "backend_set_health_checker_port" {
  description = "The backend server port against which to run the health check"
  type        = number
  default     = 5432
}

variable "backend_set_health_checker_response_body_regex" {
  default = ".*"
}

variable "backend_set_health_checker_retries" {
  description = "The number of retries to attempt before a backend server is considered 'unhealthy'"
  type        = number
  default     = 3
}

variable "backend_set_health_checker_return_code" {
  description = "The status code a healthy backend server should return"
  type        = number
  default     = 200
}

variable "backend_set_health_checker_timeout_in_millis" {
  description = "The maximum time, in milliseconds, to wait for a reply to a health check"
  type        = number
  default     = 3000
}


variable "backend_set_health_checker_url_path" {
  default = "/"
}

variable "backend_set_name" {
  description = "A friendly name for the backend set. It must be unique and it cannot be changed"
  default     = "pg_backend_set"
}

variable "backend_set_policy" {
  description = "The load balancer policy for the backend set."
  default     = "LEAST_CONNECTIONS"
}

variable "pg_port" {
  description = "PostgreSQL port"
  default     = "5432"
}

variable "objectstorage_bucket" {
  description = "This bucket used for storing generated files"
  default     = "tf-key-files"
}

#*************************************
#           OKE
#*************************************

variable "kubernetes_version" {
  description = "Kubernetes version"
}

variable "oke_node_shape" {
  description = "Instance shape of the node"
}

variable "oke_shape_ocpus" {
  description = "Number of OCPUs of each node"
}

variable "oke_shape_mems" {
  description = "Memory of each node in GB"
}

variable "oke_image_os_id" {
  description = "OS Image OCID of the node pool"
}
