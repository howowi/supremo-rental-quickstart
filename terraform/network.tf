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
  count          = local.should_config_opensearch_private_subnet ? 1 : 0
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
  count          = local.should_config_redis_private_subnet ? 1 : 0
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

# Added to avoid redis service adding this security list. If Redis service adds this, destroy stack fails
resource "oci_core_security_list" "redis_service_security_list" {
  count          = !local.should_use_existing_network && var.should_setup_redis_cluster ? 1 : 0
  compartment_id = var.compartment_ocid
  display_name   = "redis-security-list"
  vcn_id         = oci_core_vcn.opensearch_redis_vcn[count.index].id
  ingress_security_rules {
    tcp_options {
      max = 6379
      min = 6379
    }
    protocol = "6"
    source   = local.should_config_redis_private_subnet ? cidrsubnet(var.vcn_cidr, 8, 2) : cidrsubnet(var.vcn_cidr, 8, 3)
  }
}

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

resource "oci_core_subnet" "opensearch_private_subnet" {
  count                      = local.should_config_opensearch_private_subnet ? 1 : 0
  cidr_block                 = cidrsubnet(var.vcn_cidr, 8, 1)
  display_name               = "opensearch-private-subnet"
  compartment_id             = var.compartment_ocid
  vcn_id                     = oci_core_vcn.opensearch_redis_vcn[count.index].id
  route_table_id             = oci_core_route_table.private_route_table[count.index].id
  security_list_ids          = [oci_core_security_list.opensearch_security_list[count.index].id]
  dhcp_options_id            = oci_core_vcn.opensearch_redis_vcn[count.index].default_dhcp_options_id
  prohibit_public_ip_on_vnic = true
  dns_label                  = "opensearchpriv"
}

resource "oci_core_subnet" "redis_private_subnet" {
  count          = local.should_config_redis_private_subnet ? 1 : 0
  cidr_block     = cidrsubnet(var.vcn_cidr, 8, 2)
  display_name   = "redis-private-subnet"
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.opensearch_redis_vcn[count.index].id
  route_table_id = oci_core_route_table.private_route_table[count.index].id
  security_list_ids = [
    oci_core_security_list.redis_security_list[count.index].id,
    oci_core_security_list.redis_service_security_list[count.index].id
  ]
  dhcp_options_id            = oci_core_vcn.opensearch_redis_vcn[count.index].default_dhcp_options_id
  prohibit_public_ip_on_vnic = true
  dns_label                  = "redispriv"
}

resource "oci_core_subnet" "shared_private_subnet" {
  count          = local.should_config_shared_private_subnet ? 1 : 0
  cidr_block     = cidrsubnet(var.vcn_cidr, 8, 3)
  display_name   = "shared-private-subnet"
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.opensearch_redis_vcn[count.index].id
  route_table_id = oci_core_route_table.private_route_table[count.index].id
  security_list_ids = [
    oci_core_security_list.opensearch_redis_security_list[count.index].id,
    oci_core_security_list.redis_service_security_list[count.index].id,
    oci_core_security_list.app_security_list[count.index].id
  ]
  dhcp_options_id            = oci_core_vcn.opensearch_redis_vcn[count.index].default_dhcp_options_id
  prohibit_public_ip_on_vnic = "true"
  dns_label                  = "sharedpriv"
}
