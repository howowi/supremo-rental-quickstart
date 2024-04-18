resource oci_containerengine_cluster supremo-oke-cluster {
  count          = local.should_config_shared_private_subnet ? 1 : 0
  cluster_pod_network_options {
    cni_type = "FLANNEL_OVERLAY"
  }
  compartment_id = var.compartment_ocid
  endpoint_config {
    is_public_ip_enabled = "false"
    nsg_ids = [
    ]
    subnet_id = oci_core_subnet.KubernetesAPIendpoint[count.index].id
  }
  freeform_tags = {
    "name" = "supremo-oke-cluster"
  }
  image_policy_config {
    is_policy_enabled = "false"
  }
  kubernetes_version = var.kubernetes_version
  name               = "supremo-oke-cluster"
  options {
    add_ons {
      is_kubernetes_dashboard_enabled = "false"
      is_tiller_enabled               = "false"
    }
    admission_controller_options {
      is_pod_security_policy_enabled = "false"
    }
    kubernetes_network_config {
      pods_cidr     = "10.244.0.0/16"
      services_cidr = "10.96.0.0/16"
    }
    persistent_volume_config {
      defined_tags = {
      }
      freeform_tags = {
        "name" = "supremo-oke-cluster"
      }
    }
    service_lb_config {
      defined_tags = {
      }
      freeform_tags = {
        "name" = "supremo-oke-cluster"
      }
    }
    service_lb_subnet_ids = [
      oci_core_subnet.Kubernetesloadbalancers[count.index].id,
    ]
  }
  type   = "BASIC_CLUSTER"
  vcn_id = oci_core_vcn.opensearch_redis_vcn[count.index].id
}

resource oci_containerengine_node_pool pool1 {
  count          = local.should_config_shared_private_subnet ? 1 : 0
  cluster_id     = oci_containerengine_cluster.supremo-oke-cluster[count.index].id
  compartment_id = var.compartment_ocid
  freeform_tags = {
  }
  initial_node_labels {
    key   = "name"
    value = "pool1"
  }
  kubernetes_version = var.kubernetes_version
  name               = "pool1"
  node_config_details {
    defined_tags = {
    }
    freeform_tags = {
    }
    node_pool_pod_network_option_details {
      cni_type = "FLANNEL_OVERLAY"
    }
    nsg_ids = [
    ]
    placement_configs {
      availability_domain = data.oci_identity_availability_domains.ADs.availability_domains[0]["name"]
      fault_domains = [
      ]
      subnet_id = oci_core_subnet.Kubernetesworkernodes[count.index].id
    }
    size = "2"
  }
  node_eviction_node_pool_settings {
    eviction_grace_duration              = "PT1H"
    is_force_delete_after_grace_duration = "false"
  }
  node_metadata = {
  }
  node_shape = var.oke_node_shape
  node_shape_config {
    memory_in_gbs = var.oke_shape_mems
    ocpus         = var.oke_shape_ocpus
  }
  node_source_details {
    image_id    = var.oke_image_os_id
    source_type = "IMAGE"
  }
}
