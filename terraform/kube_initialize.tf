## Initialize Kubernetes Cluster ##

## Create Private Endpoint

resource "oci_resourcemanager_private_endpoint" "rms_private_endpoint" {
    count          = local.should_config_shared_private_subnet ? 1 : 0
    compartment_id = var.compartment_ocid
    display_name   = "rms_private_endpoint"
    description    = "rms_private_endpoint"
    vcn_id         = oci_core_vcn.opensearch_redis_vcn[count.index].id
    subnet_id      = oci_core_subnet.KubernetesAPIendpoint[count.index].id
}

data "oci_resourcemanager_private_endpoint_reachable_ip" "private_endpoint_reachable_ips" {
    count               = var.should_setup_vm ? 1 : 0
    private_endpoint_id = oci_resourcemanager_private_endpoint.rms_private_endpoint.id
    private_ip          = oci_core_instance.service_instance[count.index].private_ip
}

resource "null_resource" "remote-exec" {
    count               = var.should_setup_vm ? 1 : 0
    depends_on = [oci_core_instance.service_instance[count.index], oci_containerengine_node_pool.pool1]

    provisioner "remote-exec" {
        connection {
            agent = false
            timeout = "30m"
            host = data.oci_resourcemanager_private_endpoint_reachable_ip.private_endpoint_reachable_ips.ip_address
            user = "opc"
            private_key = tls_private_key.public_private_key_pair.private_key_pem
        }
        inline = [
            "curl -LO https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl",
            "sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl",
            "oci ce cluster create-kubeconfig --cluster-id ${oci_containerengine_cluster.supremo-oke-cluster[count.index].id} --file $HOME/.kube/config --region ${var.region} --token-version 2.0.0  --kube-endpoint PRIVATE_ENDPOINT",
            "kubectl create namespace supremo",
            "kubectl create secret docker-registry ocir-secret --docker-username='${var.OCIR_USERNAME}' --docker-password='${oci_identity_auth_token.user_auth_token.token}' --docker-server=${var.OCIR_URL}' -n supremo"
        ]
    }
}