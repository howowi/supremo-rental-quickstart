
locals {
  is_flex_shape = length(regexall("Flex", var.node_shape)) > 0 ? true : false
}

# Creates compute instance
resource "oci_core_instance" "service_instance" {
  depends_on = [oci_database_autonomous_database.adb_database[0], local_file.adb_wallet_file[0]]

  count               = var.should_setup_vm ? 1 : 0
  availability_domain = var.availability_domain_name == "" ? data.oci_identity_availability_domains.ADs.availability_domains[0]["name"] : var.availability_domain_name
  compartment_id      = var.compartment_ocid
  display_name        = "${var.vm_instance_name}-${random_id.tag.hex}"
  shape               = var.node_shape

  dynamic "shape_config" {
    for_each = local.is_flex_shape ? [1] : []
    content {
      memory_in_gbs = var.node_flex_shape_memory
      ocpus         = var.node_flex_shape_ocpus
    }
  }

  create_vnic_details {
    subnet_id        = local.vm_subnet_id
    display_name     = "public-app-instance"
    assign_public_ip = var.should_config_public_ip_for_vm
  }

  source_details {
    source_id               = data.oci_core_images.InstanceImageOCID.images[0].id
    source_type             = "image"
    boot_volume_size_in_gbs = 500
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key == "" ? "${tls_private_key.public_private_key_pair.public_key_openssh}" : "${var.ssh_public_key}\n${tls_private_key.public_private_key_pair.public_key_openssh}"
    user_data = base64encode(templatefile("${path.module}/scripts/vm_init.tftpl", {
      region              = var.region,
      opensearch_username = var.opensearch_cluster_master_user,
      opensearch_password = var.opensearch_cluster_master_password,
      opensearch_endpoint = "https://${oci_opensearch_opensearch_cluster.opensearch_cluster[0].opensearch_fqdn}:9200",
    }))
  }

  # Copies app.env file to destination vm
  provisioner "file" {
    connection {
      type        = "ssh"
      user        = "opc"
      private_key = tls_private_key.public_private_key_pair.private_key_pem
      host        = self.public_ip
    }
    content = templatefile("${path.module}/scripts/app_env.tftpl", {
      tenancy_ocid     = var.tenancy_ocid,
      region           = var.region,
      user_ocid        = var.user_ocid,
      compartment_ocid = var.compartment_ocid,
      fingerprint      = oci_identity_api_key.user_api_key.fingerprint,

      adb_db_name         = local.adb_db_name,
      adb_admin_password  = var.adb_admin_password,
      adb_wallet_password = var.adb_wallet_password,

      pg_username         = var.db_system_credentials_username,
      pg_password         = var.db_system_credentials_password_details_password,
      pg_primary_endpoint = data.oci_psql_db_system_connection_detail.pg_db_system_connection_detail[0].primary_db_endpoint[0],

      redis_primay_endpoint = oci_redis_redis_cluster.dedicated_redis_cluster[0].primary_fqdn,
      vm_public_ip          = oci_core_instance.service_instance[0].public_ip,
      pg_load_balancer_ip   = oci_load_balancer_load_balancer.pg_load_balancer[0].ip_address_details[0].ip_address,

      opensearch_username = var.opensearch_cluster_master_user,
      opensearch_password = var.opensearch_cluster_master_password,
      opensearch_endpoint = "https://${oci_opensearch_opensearch_cluster.opensearch_cluster[0].opensearch_fqdn}:9200",
    })
    destination = "/home/opc/app.env"
  }

  # Copies the Autonomous Database wallet to destination vm
  provisioner "file" {
    connection {
      type        = "ssh"
      user        = "opc"
      private_key = tls_private_key.public_private_key_pair.private_key_pem
      host        = self.public_ip
    }
    source      = "${path.module}/adb_wallet.zip"
    destination = "/home/opc/wallet/adb_wallet.zip"
  }

  # Copies the Nginx conf file to destination vm
  provisioner "file" {
    connection {
      type        = "ssh"
      user        = "opc"
      private_key = tls_private_key.public_private_key_pair.private_key_pem
      host        = self.public_ip
    }
    source      = "./files/nginx.conf"
    destination = "/home/opc/nginx.conf"
  }

  # Copies db-init to destination
  provisioner "file" {
    connection {
      type        = "ssh"
      user        = "opc"
      private_key = tls_private_key.public_private_key_pair.private_key_pem
      host        = self.public_ip
    }
    source      = "./db-init"
    destination = "/home/opc/db-init"
  }

  # Copies api key file to destination vm
  provisioner "file" {
    connection {
      type        = "ssh"
      user        = "opc"
      private_key = tls_private_key.public_private_key_pair.private_key_pem
      host        = self.public_ip
    }
    source      = "${path.module}/private_key.pem"
    destination = "/home/opc/.oci/car_demo.pem"
  }

  # Copies opensearch-init to destination
  provisioner "file" {
    connection {
      type        = "ssh"
      user        = "opc"
      private_key = tls_private_key.public_private_key_pair.private_key_pem
      host        = self.public_ip
    }
    source      = "./opensearch-init"
    destination = "/home/opc/opensearch-init"
  }

  # Copy loadtest scripts to the VM
  provisioner "file" {
    connection {
      type        = "ssh"
      user        = "opc"
      private_key = tls_private_key.public_private_key_pair.private_key_pem
      host        = self.public_ip
    }
    source      = "./load-test"
    destination = "/home/opc/load-test"
  }

  # Copy private key to .oci_docker for application use.
  provisioner "file" {
    connection {
      type        = "ssh"
      user        = "opc"
      private_key = tls_private_key.public_private_key_pair.private_key_pem
      host        = self.public_ip
    }
    source      = "${path.module}/private_key.pem"
    destination = "/home/opc/.oci_docker/car_demo.pem"
  }
}

resource "oci_core_instance" "bastion_instance" {
  depends_on          = [oci_database_autonomous_database.adb_database[0], local_file.adb_wallet_file[0], oci_opensearch_opensearch_cluster.opensearch_cluster[0]]
  count               = 1
  availability_domain = var.availability_domain_name == "" ? data.oci_identity_availability_domains.ADs.availability_domains[0]["name"] : var.availability_domain_name
  compartment_id      = var.compartment_ocid
  display_name        = "bastion-instance-${random_id.tag.hex}"
  shape               = var.node_shape

  dynamic "shape_config" {
    for_each = local.is_flex_shape ? [1] : []
    content {
      memory_in_gbs = var.node_flex_shape_memory
      ocpus         = var.node_flex_shape_ocpus
    }
  }

  create_vnic_details {
    subnet_id        = local.vm_subnet_id
    display_name     = "bastion-instance"
    assign_public_ip = var.should_config_public_ip_for_vm
  }

  source_details {
    source_id               = data.oci_core_images.InstanceImageOCID.images[0].id
    source_type             = "image"
    boot_volume_size_in_gbs = 50
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key == "" ? "${tls_private_key.public_private_key_pair.public_key_openssh}" : "${var.ssh_public_key}\n${tls_private_key.public_private_key_pair.public_key_openssh}"
    user_data = base64encode(templatefile("${path.module}/scripts/bastion_init.tftpl", {
      region              = var.region,
      opensearch_username = var.opensearch_cluster_master_user,
      opensearch_password = var.opensearch_cluster_master_password,
      opensearch_endpoint = "https://${oci_opensearch_opensearch_cluster.opensearch_cluster[0].opensearch_fqdn}:9200",
    }))
  }

  # Copies app.env file to destination vm
  provisioner "file" {
    connection {
      type        = "ssh"
      user        = "opc"
      private_key = tls_private_key.public_private_key_pair.private_key_pem
      host        = self.public_ip
    }
    content = templatefile("${path.module}/scripts/app_env.tftpl", {
      tenancy_ocid     = var.tenancy_ocid,
      region           = var.region,
      user_ocid        = var.user_ocid,
      compartment_ocid = var.compartment_ocid,
      fingerprint      = oci_identity_api_key.user_api_key.fingerprint,

      adb_db_name         = local.adb_db_name,
      adb_admin_password  = var.adb_admin_password,
      adb_wallet_password = var.adb_wallet_password,

      pg_username         = var.db_system_credentials_username,
      pg_password         = var.db_system_credentials_password_details_password,
      pg_primary_endpoint = data.oci_psql_db_system_connection_detail.pg_db_system_connection_detail[0].primary_db_endpoint[0],

      redis_primay_endpoint = oci_redis_redis_cluster.dedicated_redis_cluster[0].primary_fqdn,
      vm_public_ip          = oci_core_instance.service_instance[0].public_ip,
      pg_load_balancer_ip   = oci_load_balancer_load_balancer.pg_load_balancer[0].ip_address_details[0].ip_address,

      opensearch_username = var.opensearch_cluster_master_user,
      opensearch_password = var.opensearch_cluster_master_password,
      opensearch_endpoint = "https://${oci_opensearch_opensearch_cluster.opensearch_cluster[0].opensearch_fqdn}:9200",
    })
    destination = "/home/opc/app.env"
  }

  # Copies the Autonomous Database wallet to destination vm
  provisioner "file" {
    connection {
      type        = "ssh"
      user        = "opc"
      private_key = tls_private_key.public_private_key_pair.private_key_pem
      host        = self.public_ip
    }
    source      = "${path.module}/adb_wallet.zip"
    destination = "/home/opc/wallet/adb_wallet.zip"
  }

  # Copies the Nginx conf file to destination vm
  provisioner "file" {
    connection {
      type        = "ssh"
      user        = "opc"
      private_key = tls_private_key.public_private_key_pair.private_key_pem
      host        = self.public_ip
    }
    source      = "./files/nginx.conf"
    destination = "/home/opc/nginx.conf"
  }

  # Copies db-init to destination
  provisioner "file" {
    connection {
      type        = "ssh"
      user        = "opc"
      private_key = tls_private_key.public_private_key_pair.private_key_pem
      host        = self.public_ip
    }
    source      = "./db-init"
    destination = "/home/opc/db-init"
  }

  # Copies api key file to destination vm
  provisioner "file" {
    connection {
      type        = "ssh"
      user        = "opc"
      private_key = tls_private_key.public_private_key_pair.private_key_pem
      host        = self.public_ip
    }
    source      = "${path.module}/private_key.pem"
    destination = "/home/opc/.oci/car_demo.pem"
  }

  # Copies opensearch-init to destination
  provisioner "file" {
    connection {
      type        = "ssh"
      user        = "opc"
      private_key = tls_private_key.public_private_key_pair.private_key_pem
      host        = self.public_ip
    }
    source      = "./opensearch-init"
    destination = "/home/opc/opensearch-init"
  }

  # Copy loadtest scripts to the VM
  provisioner "file" {
    connection {
      type        = "ssh"
      user        = "opc"
      private_key = tls_private_key.public_private_key_pair.private_key_pem
      host        = self.public_ip
    }
    source      = "./load-test"
    destination = "/home/opc/load-test"
  }

  # Copy private key to .oci_docker for application use.
  provisioner "file" {
    connection {
      type        = "ssh"
      user        = "opc"
      private_key = tls_private_key.public_private_key_pair.private_key_pem
      host        = self.public_ip
    }
    source      = "${path.module}/private_key.pem"
    destination = "/home/opc/.oci_docker/car_demo.pem"
  }
}
