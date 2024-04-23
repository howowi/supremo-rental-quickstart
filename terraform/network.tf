resource "oci_core_vcn" "opensearch_redis_vcn" {
  count          = local.should_use_existing_network ? 0 : 1
  cidr_block     = var.vcn_cidr
  compartment_id = var.compartment_ocid
  display_name   = "${var.vcn_name}-${random_id.tag.hex}"
  dns_label      = "appvcn"
}

resource "oci_core_internet_gateway" "internet_gateway" {
  count          = local.should_use_existing_network ? 0 : 1
  compartment_id = var.compartment_ocid
  display_name   = "internet_gateway"
  vcn_id         = oci_core_vcn.opensearch_redis_vcn[count.index].id
}


resource "oci_core_nat_gateway" "nat_gateway" {
  count          = local.should_use_existing_network ? 0 : 1
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.opensearch_redis_vcn[count.index].id
  display_name   = "nat_gateway"
}

resource "oci_core_service_gateway" "service_gateway" {
  count          = local.should_use_existing_network ? 0 : 1
  compartment_id = var.compartment_ocid
  display_name   = "service_gateway"
  services {
    service_id = data.oci_core_services.all_services.services.1.id
  }
  vcn_id = oci_core_vcn.opensearch_redis_vcn[count.index].id
}


resource "oci_core_route_table" "public_route_table" {
  count          = local.should_config_public_subnet ? 1 : 0
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.opensearch_redis_vcn[count.index].id
  display_name   = "RouteTableViaIGW"
  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_internet_gateway.internet_gateway[count.index].id
  }
}

resource "oci_core_route_table" "private_route_table" {
  count          = local.should_use_existing_network ? 0 : 1
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.opensearch_redis_vcn[count.index].id
  display_name   = "RouteTableViaNATGW"
  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_nat_gateway.nat_gateway[count.index].id
  }
}

resource "oci_core_route_table" "routetable-Kubernetesloadbalancers" {
  count          = local.should_use_existing_network ? 0 : 1
  compartment_id = var.compartment_ocid
  display_name   = "routetable-Kubernetesloadbalancers"
  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_internet_gateway.internet_gateway[count.index].id
  }
  vcn_id = oci_core_vcn.opensearch_redis_vcn[count.index].id
}

resource "oci_core_route_table" "routetable-Kubernetesworkernodes" {
  count          = local.should_use_existing_network ? 0 : 1
  compartment_id = var.compartment_ocid
  display_name   = "routetable-Kubernetesworkernodes"
  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_nat_gateway.nat_gateway[count.index].id
  }
  route_rules {
    destination       = data.oci_core_services.all_services.services.1.cidr_block
    destination_type  = "SERVICE_CIDR_BLOCK"
    network_entity_id = oci_core_service_gateway.service_gateway[count.index].id
  }
  vcn_id = oci_core_vcn.opensearch_redis_vcn[count.index].id
}

resource "oci_core_route_table" "routetable-KubernetesAPIendpoint" {
  count          = local.should_use_existing_network ? 0 : 1
  compartment_id = var.compartment_ocid
  display_name   = "routetable-KubernetesAPIendpoint"
  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_nat_gateway.nat_gateway[count.index].id
  }
  route_rules {
    destination       = data.oci_core_services.all_services.services.1.cidr_block
    destination_type  = "SERVICE_CIDR_BLOCK"
    network_entity_id = oci_core_service_gateway.service_gateway[count.index].id
  }
  vcn_id = oci_core_vcn.opensearch_redis_vcn[count.index].id
}

resource "oci_core_security_list" "public_security_list_ssh" {
  count          = local.should_config_public_subnet ? 1 : 0
  compartment_id = var.compartment_ocid
  display_name   = "Public Security List"
  vcn_id         = oci_core_vcn.opensearch_redis_vcn[count.index].id
  egress_security_rules {
    destination = "0.0.0.0/0"
    protocol    = "6"
  }
  ingress_security_rules {
    tcp_options {
      max = 22
      min = 22
    }
    protocol = "6"
    source   = "0.0.0.0/0"
  }
  ingress_security_rules {
    # tcp_options {
    #   max = 80
    #   min = 80
    # }
    protocol = "all"
    source   = var.vcn_cidr
  }
  ingress_security_rules {
    tcp_options {
      max = 80
      min = 80
    }
    protocol = "6"
    source   = "0.0.0.0/0"
  }
}

resource "oci_core_security_list" "opensearch_security_list" {
  #count          = local.should_config_opensearch_private_subnet ? 1 : 0
  count          = local.should_config_shared_private_subnet ? 1 : 0
  compartment_id = var.compartment_ocid
  display_name   = "Opensearch Security List"
  vcn_id         = oci_core_vcn.opensearch_redis_vcn[count.index].id

  egress_security_rules {
    destination = "0.0.0.0/0"
    protocol    = "all"
  }
  ingress_security_rules {
    protocol = "1"
    source   = var.vcn_cidr
  }
  ingress_security_rules {
    tcp_options {
      max = 22
      min = 22
    }
    protocol = "6"
    source   = var.vcn_cidr
  }
  ingress_security_rules {
    tcp_options {
      max = 5601
      min = 5601
    }
    protocol = "6"
    source   = var.vcn_cidr
  }
  ingress_security_rules {
    tcp_options {
      max = 9200
      min = 9200
    }
    protocol = "6"
    source   = var.vcn_cidr
  }
}


resource "oci_core_security_list" "redis_security_list" {
  #count          = local.should_config_redis_private_subnet ? 1 : 0
  count          = local.should_config_shared_private_subnet ? 1 : 0
  compartment_id = var.compartment_ocid
  display_name   = "Redis Security List"
  vcn_id         = oci_core_vcn.opensearch_redis_vcn[count.index].id

  egress_security_rules {
    destination = "0.0.0.0/0"
    protocol    = "all"
  }
  ingress_security_rules {
    protocol = "1"
    source   = var.vcn_cidr
  }
  ingress_security_rules {
    tcp_options {
      max = 22
      min = 22
    }
    protocol = "6"
    source   = var.vcn_cidr
  }
  ingress_security_rules {
    tcp_options {
      max = 6379
      min = 6379
    }
    protocol = "6"
    source   = var.vcn_cidr
  }
  ingress_security_rules {
    tcp_options {
      max = 16379
      min = 16379
    }
    protocol = "6"
    source   = var.vcn_cidr
  }
}

resource "oci_core_security_list" "app_security_list" {
  count          = local.should_config_shared_private_subnet ? 1 : 0
  compartment_id = var.compartment_ocid
  display_name   = "App Security List"
  vcn_id         = oci_core_vcn.opensearch_redis_vcn[count.index].id

  egress_security_rules {
    destination = "0.0.0.0/0"
    protocol    = "all"
  }
  ingress_security_rules {
    protocol = "1"
    source   = var.vcn_cidr
  }
  ingress_security_rules {
    tcp_options {
      max = 22
      min = 22
    }
    protocol = "6"
    source   = var.vcn_cidr
  }
  ingress_security_rules {
    # tcp_options {
    #   max = 6379
    #   min = 6379
    # }
    protocol = "all"
    source   = var.vcn_cidr
  }
}

# # Added to avoid redis service adding this security list. If Redis service adds this, destroy stack fails
# resource "oci_core_security_list" "redis_service_security_list" {
#   count          = !local.should_use_existing_network && var.should_setup_redis_cluster ? 1 : 0
#   compartment_id = var.compartment_ocid
#   display_name   = "redis-security-list"
#   vcn_id         = oci_core_vcn.opensearch_redis_vcn[count.index].id
#   ingress_security_rules {
#     tcp_options {
#       max = 6379
#       min = 6379
#     }
#     protocol = "6"
#     source   = local.should_config_redis_private_subnet ? cidrsubnet(var.vcn_cidr, 8, 2) : cidrsubnet(var.vcn_cidr, 8, 3)
#   }
# }

resource "oci_core_security_list" "opensearch_redis_security_list" {
  count          = local.should_config_shared_private_subnet ? 1 : 0
  compartment_id = var.compartment_ocid
  display_name   = "OpenSearch Redis Security List"
  vcn_id         = oci_core_vcn.opensearch_redis_vcn[count.index].id

  egress_security_rules {
    destination = "0.0.0.0/0"
    protocol    = "all"
  }
  ingress_security_rules {
    protocol = "1"
    source   = var.vcn_cidr
  }
  ingress_security_rules {
    tcp_options {
      max = 22
      min = 22
    }
    protocol = "6"
    source   = var.vcn_cidr
  }
  ingress_security_rules {
    tcp_options {
      max = 5601
      min = 5601
    }
    protocol = "6"
    source   = var.vcn_cidr
  }
  ingress_security_rules {
    tcp_options {
      max = 9200
      min = 9200
    }
    protocol = "6"
    source   = var.vcn_cidr
  }
  ingress_security_rules {
    tcp_options {
      max = 6379
      min = 6379
    }
    protocol = "6"
    source   = var.vcn_cidr
  }
  ingress_security_rules {
    tcp_options {
      max = 16379
      min = 16379
    }
    protocol = "6"
    source   = var.vcn_cidr
  }
}

resource "oci_core_security_list" "seclist-Kubernetesloadbalancers" {
  count          = local.should_config_shared_private_subnet ? 1 : 0
  compartment_id = var.compartment_ocid
  display_name   = "seclist-Kubernetesloadbalancers"
  egress_security_rules {
    destination      = cidrsubnet(var.vcn_cidr, 8, 5)
    destination_type = "CIDR_BLOCK"
    protocol         = "all"
    stateless        = "false"
  }
  egress_security_rules {
    destination      = cidrsubnet(var.vcn_cidr, 8, 5)
    destination_type = "CIDR_BLOCK"
    protocol         = "6"
    stateless        = "false"
    tcp_options {
      max = "30613"
      min = "30613"
    }
  }
  egress_security_rules {
    destination      = cidrsubnet(var.vcn_cidr, 8, 5)
    destination_type = "CIDR_BLOCK"
    protocol         = "6"
    stateless        = "false"
    tcp_options {
      max = "10256"
      min = "10256"
    }
  }
  egress_security_rules {
    destination      = cidrsubnet(var.vcn_cidr, 8, 5)
    destination_type = "CIDR_BLOCK"
    protocol         = "6"
    stateless        = "false"
    tcp_options {
      max = "32165"
      min = "32165"
    }
  }
  ingress_security_rules {
    protocol    = "all"
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    stateless   = "false"
  }
  ingress_security_rules {
    protocol    = "6"
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    stateless   = "false"
    tcp_options {
      max = "443"
      min = "443"
    }
  }
  ingress_security_rules {
    protocol    = "6"
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    stateless   = "false"
    tcp_options {
      max = "80"
      min = "80"
    }
  }
  vcn_id = oci_core_vcn.opensearch_redis_vcn[count.index].id
}

resource "oci_core_security_list" "seclist-Kubernetesworkernodes" {
  count          = local.should_config_shared_private_subnet ? 1 : 0
  compartment_id = var.compartment_ocid
  display_name   = "seclist-Kubernetesworkernodes"
  egress_security_rules {
    destination      = "0.0.0.0/0"
    destination_type = "CIDR_BLOCK"
    protocol         = "all"
    stateless        = "false"
  }
  ingress_security_rules {
    protocol    = "all"
    source      = cidrsubnet(var.vcn_cidr, 8, 5)
    source_type = "CIDR_BLOCK"
    stateless   = "false"
  }
  ingress_security_rules {
    protocol    = "6"
    source      = cidrsubnet(var.vcn_cidr, 8, 4)
    source_type = "CIDR_BLOCK"
    stateless   = "false"
  }
  ingress_security_rules {
    protocol    = "1"
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    stateless   = "false"
  }
  ingress_security_rules {
    protocol    = "all"
    source      = cidrsubnet(var.vcn_cidr, 8, 6)
    source_type = "CIDR_BLOCK"
    stateless   = "false"
  }
  ingress_security_rules {
    protocol    = "6"
    source      = cidrsubnet(var.vcn_cidr, 8, 6)
    source_type = "CIDR_BLOCK"
    stateless   = "false"
    tcp_options {
      max = "30613"
      min = "30613"
    }
  }
  ingress_security_rules {
    protocol    = "6"
    source      = cidrsubnet(var.vcn_cidr, 8, 6)
    source_type = "CIDR_BLOCK"
    stateless   = "false"
    tcp_options {
      max = "10256"
      min = "10256"
    }
  }
  ingress_security_rules {
    protocol    = "6"
    source      = cidrsubnet(var.vcn_cidr, 8, 6)
    source_type = "CIDR_BLOCK"
    stateless   = "false"
    tcp_options {
      max = "32165"
      min = "32165"
    }
  }
  vcn_id = oci_core_vcn.opensearch_redis_vcn[count.index].id
}

resource "oci_core_security_list" "seclist-KubernetesAPIendpoint" {
  count          = local.should_config_shared_private_subnet ? 1 : 0
  compartment_id = var.compartment_ocid
  display_name   = "seclist-KubernetesAPIendpoint"
  egress_security_rules {
    destination      = data.oci_core_services.all_services.services.1.cidr_block
    destination_type = "SERVICE_CIDR_BLOCK"
    protocol         = "all"
    stateless        = "false"
  }
  egress_security_rules {
    destination      = cidrsubnet(var.vcn_cidr, 8, 5)
    destination_type = "CIDR_BLOCK"
    protocol         = "all"
    stateless        = "false"
  }
  egress_security_rules {
    destination      = "0.0.0.0/0"
    destination_type = "CIDR_BLOCK"
    protocol         = "6"
    stateless        = "false"
  }
  ingress_security_rules {
    protocol    = "6"
    source      = cidrsubnet(var.vcn_cidr, 8, 5)
    source_type = "CIDR_BLOCK"
    stateless   = "false"
    tcp_options {
      max = "6443"
      min = "6443"
    }
  }
  ingress_security_rules {
    protocol    = "6"
    source      = cidrsubnet(var.vcn_cidr, 8, 5)
    source_type = "CIDR_BLOCK"
    stateless   = "false"
    tcp_options {
      max = "12250"
      min = "12250"
    }
  }
  ingress_security_rules {
    protocol    = "1"
    source      = cidrsubnet(var.vcn_cidr, 8, 5)
    source_type = "CIDR_BLOCK"
    stateless   = "false"
  }
  ingress_security_rules {
    protocol    = "6"
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    stateless   = "false"
    tcp_options {
      max = "6443"
      min = "6443"
    }
  }
  vcn_id = oci_core_vcn.opensearch_redis_vcn[count.index].id
}


resource "oci_core_subnet" "vm_public_subnet" {
  count                      = local.should_config_public_subnet ? 1 : 0
  cidr_block                 = cidrsubnet(var.vcn_cidr, 8, 0)
  display_name               = "vm-public-subnet"
  compartment_id             = var.compartment_ocid
  vcn_id                     = oci_core_vcn.opensearch_redis_vcn[count.index].id
  route_table_id             = oci_core_route_table.public_route_table[count.index].id
  security_list_ids          = [oci_core_security_list.public_security_list_ssh[count.index].id]
  dhcp_options_id            = oci_core_vcn.opensearch_redis_vcn[count.index].default_dhcp_options_id
  prohibit_public_ip_on_vnic = false
  dns_label                  = "opensearchpub"
}

# resource "oci_core_subnet" "opensearch_private_subnet" {
#   count                      = local.should_config_opensearch_private_subnet ? 1 : 0
#   cidr_block                 = cidrsubnet(var.vcn_cidr, 8, 1)
#   display_name               = "opensearch-private-subnet"
#   compartment_id             = var.compartment_ocid
#   vcn_id                     = oci_core_vcn.opensearch_redis_vcn[count.index].id
#   route_table_id             = oci_core_route_table.private_route_table[count.index].id
#   security_list_ids          = [oci_core_security_list.opensearch_security_list[count.index].id]
#   dhcp_options_id            = oci_core_vcn.opensearch_redis_vcn[count.index].default_dhcp_options_id
#   prohibit_public_ip_on_vnic = true
#   dns_label                  = "opensearchpriv"
# }

# resource "oci_core_subnet" "redis_private_subnet" {
#   count          = local.should_config_redis_private_subnet ? 1 : 0
#   cidr_block     = cidrsubnet(var.vcn_cidr, 8, 2)
#   display_name   = "redis-private-subnet"
#   compartment_id = var.compartment_ocid
#   vcn_id         = oci_core_vcn.opensearch_redis_vcn[count.index].id
#   route_table_id = oci_core_route_table.private_route_table[count.index].id
#   security_list_ids = [
#     oci_core_security_list.redis_security_list[count.index].id,
#     oci_core_security_list.redis_service_security_list[count.index].id
#   ]
#   dhcp_options_id            = oci_core_vcn.opensearch_redis_vcn[count.index].default_dhcp_options_id
#   prohibit_public_ip_on_vnic = true
#   dns_label                  = "redispriv"
# }

resource "oci_core_subnet" "shared_private_subnet" {
  count          = local.should_config_shared_private_subnet ? 1 : 0
  cidr_block     = cidrsubnet(var.vcn_cidr, 8, 3)
  display_name   = "shared-private-subnet"
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.opensearch_redis_vcn[count.index].id
  route_table_id = oci_core_route_table.private_route_table[count.index].id
  security_list_ids = [
    oci_core_security_list.opensearch_redis_security_list[count.index].id,
    #oci_core_security_list.redis_service_security_list[count.index].id,
    oci_core_security_list.app_security_list[count.index].id
  ]
  dhcp_options_id            = oci_core_vcn.opensearch_redis_vcn[count.index].default_dhcp_options_id
  prohibit_public_ip_on_vnic = "true"
  dns_label                  = "sharedpriv"
}

resource "oci_core_subnet" "Kubernetesloadbalancers" {
  count                      = local.should_config_shared_private_subnet ? 1 : 0
  cidr_block                 = cidrsubnet(var.vcn_cidr, 8, 6)
  compartment_id             = var.compartment_ocid
  dhcp_options_id            = oci_core_vcn.opensearch_redis_vcn[count.index].default_dhcp_options_id
  display_name               = "Kubernetesloadbalancers"
  dns_label                  = "kubernetesloadb"
  prohibit_internet_ingress  = "false"
  prohibit_public_ip_on_vnic = "false"
  route_table_id             = oci_core_route_table.routetable-Kubernetesloadbalancers[count.index].id
  security_list_ids = [
    oci_core_security_list.seclist-Kubernetesloadbalancers[count.index].id,
  ]
  vcn_id = oci_core_vcn.opensearch_redis_vcn[count.index].id
}

resource "oci_core_subnet" "Kubernetesworkernodes" {
  count                      = local.should_config_shared_private_subnet ? 1 : 0
  cidr_block                 = cidrsubnet(var.vcn_cidr, 8, 5)
  compartment_id             = var.compartment_ocid
  dhcp_options_id            = oci_core_vcn.opensearch_redis_vcn[count.index].default_dhcp_options_id
  display_name               = "Kubernetesworkernodes"
  dns_label                  = "kubernetesworke"
  prohibit_internet_ingress  = "true"
  prohibit_public_ip_on_vnic = "true"
  route_table_id             = oci_core_route_table.routetable-Kubernetesworkernodes[count.index].id
  security_list_ids = [
    oci_core_security_list.seclist-Kubernetesworkernodes[count.index].id,
  ]
  vcn_id = oci_core_vcn.opensearch_redis_vcn[count.index].id
}

resource "oci_core_subnet" "KubernetesAPIendpoint" {
  count                      = local.should_config_shared_private_subnet ? 1 : 0
  cidr_block                 = cidrsubnet(var.vcn_cidr, 8, 4)
  compartment_id             = var.compartment_ocid
  dhcp_options_id            = oci_core_vcn.opensearch_redis_vcn[count.index].default_dhcp_options_id
  display_name               = "KubernetesAPIendpoint"
  dns_label                  = "kubernetesapien"
  prohibit_internet_ingress  = "true"
  prohibit_public_ip_on_vnic = "true"
  route_table_id             = oci_core_route_table.routetable-KubernetesAPIendpoint[count.index].id
  security_list_ids = [
    oci_core_security_list.seclist-KubernetesAPIendpoint[count.index].id,
  ]
  vcn_id = oci_core_vcn.opensearch_redis_vcn[count.index].id
}
