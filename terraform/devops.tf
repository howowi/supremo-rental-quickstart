## ----- Project ----- ##
resource "oci_ons_notification_topic" "devops-notification-topic" {
    compartment_id = var.compartment_ocid
    name = "devops-notification-topic"
}

resource "oci_devops_project" "supremo-devops-project" {
    compartment_id = var.compartment_ocid
    name = "supremo-devops-project"
    notification_config {
        topic_id = oci_ons_notification_topic.devops-notification-topic.id
    }
    description = "Supremo DevOps project"
}

## ----- Environment ----- ##

resource "oci_devops_deploy_environment" "supremo-oke-environment" {
    count          = local.should_config_shared_private_subnet ? 1 : 0
    project_id = oci_devops_project.supremo-devops-project.id
    cluster_id = oci_containerengine_cluster.supremo-oke-cluster[count.index].id
    deploy_environment_type = "OKE_CLUSTER"
    description = "Supremo OKE Environment"
    display_name = "supremo-oke-environment"
    network_channel {
        network_channel_type = "PRIVATE_ENDPOINT_CHANNEL"
        nsg_ids = [
        ]
        subnet_id = oci_core_subnet.KubernetesAPIendpoint[count.index].id
    }
}

## ----- Deployment Pipeline ----- ##
resource "oci_devops_deploy_pipeline" "supremo-deploy-pipeline" {
    project_id = oci_devops_project.supremo-devops-project.id
    description = "Deployment pipeline for Supremo"
    display_name = "supremo-deploy-pipeline"
}

## ----- Artifacts ----- ##
resource oci_devops_deploy_artifact deploy_supremo_react {
  argument_substitution_mode = "SUBSTITUTE_PLACEHOLDERS"
  deploy_artifact_source {
    base64encoded_content = "LS0tCmFwaVZlcnNpb246IHYxCmtpbmQ6IFNlcnZpY2UKbWV0YWRhdGE6CiAgbmFtZTogcmVhY3QtZnJvbnRlbmQtc3ZjCiAgbGFiZWxzOgogICAgdGllcjogZnJvbnRlbmQKICBhbm5vdGF0aW9uczoKICAgIGV4dGVybmFsLWRucy5hbHBoYS5rdWJlcm5ldGVzLmlvL2hvc3RuYW1lOiBzdXByZW1vLm9yYWNsZWRlbW8ub25saW5lCiAgICBvY2kub3JhY2xlY2xvdWQuY29tL2xvYWQtYmFsYW5jZXItdHlwZTogImxiIgogICAgc2VydmljZS5iZXRhLmt1YmVybmV0ZXMuaW8vb2NpLWxvYWQtYmFsYW5jZXItc2hhcGU6ICJmbGV4aWJsZSIKICAgIHNlcnZpY2UuYmV0YS5rdWJlcm5ldGVzLmlvL29jaS1sb2FkLWJhbGFuY2VyLXNoYXBlLWZsZXgtbWluOiAiMTAiCiAgICBzZXJ2aWNlLmJldGEua3ViZXJuZXRlcy5pby9vY2ktbG9hZC1iYWxhbmNlci1zaGFwZS1mbGV4LW1heDogIjEwIgogICAgc2VydmljZS5iZXRhLmt1YmVybmV0ZXMuaW8vb2NpLWxvYWQtYmFsYW5jZXItc3NsLXBvcnRzOiAiNDQzIgogICAgc2VydmljZS5iZXRhLmt1YmVybmV0ZXMuaW8vb2NpLWxvYWQtYmFsYW5jZXItdGxzLXNlY3JldDogc3VwcmVtby1jZXJ0LXByb2QKc3BlYzoKICB0eXBlOiBMb2FkQmFsYW5jZXIKICBwb3J0czoKICAtIG5hbWU6IGh0dHAKICAgIHBvcnQ6IDgwCiAgICB0YXJnZXRQb3J0OiA4MAogIC0gbmFtZTogaHR0cHMKICAgIHBvcnQ6IDQ0MwogICAgdGFyZ2V0UG9ydDogODAKICBzZWxlY3RvcjoKICAgIGFwcDogcmVhY3QtZnJvbnRlbmQKICAgIHRpZXI6IGZyb250ZW5kCi0tLQphcGlWZXJzaW9uOiBhcHBzL3YxCmtpbmQ6IERlcGxveW1lbnQKbWV0YWRhdGE6CiAgbmFtZTogcmVhY3QtZnJvbnRlbmQtZGVwbG95CiAgbGFiZWxzOgogICAgdGllcjogZnJvbnRlbmQKc3BlYzoKICByZXBsaWNhczogMwogIHNlbGVjdG9yOgogICAgbWF0Y2hMYWJlbHM6CiAgICAgIGFwcDogcmVhY3QtZnJvbnRlbmQKICAgICAgdGllcjogZnJvbnRlbmQKICB0ZW1wbGF0ZToKICAgIG1ldGFkYXRhOgogICAgICBsYWJlbHM6CiAgICAgICAgYXBwOiByZWFjdC1mcm9udGVuZAogICAgICAgIHRpZXI6IGZyb250ZW5kCiAgICBzcGVjOgogICAgICBub2RlU2VsZWN0b3I6CiAgICAgICAga3ViZXJuZXRlcy5pby9hcmNoOiBhbWQ2NAogICAgICBjb250YWluZXJzOgogICAgICAtIG5hbWU6IHJlYWN0LWZyb250ZW5kCiAgICAgICAgaW1hZ2U6ICR7SU1HfQogICAgICAgICMgaW1hZ2U6IGJvbS5vY2lyLmlvL2FwYWNjcHQwMS9mcm9udGVuZC9yZWFjdC1zdXByZW1vOiR7QlVJTERSVU5fSEFTSH0KICAgICAgICAjIGltYWdlOiBib20ub2Npci5pby9hcGFjY3B0MDEvZnJvbnRlbmQvcmVhY3Qtc3VwcmVtbzptdWx0aWFyY2guMgogICAgICAgIHBvcnRzOgogICAgICAgIC0gY29udGFpbmVyUG9ydDogODAKICAgICAgICByZXNvdXJjZXM6CiAgICAgICAgICByZXF1ZXN0czoKICAgICAgICAgICAgbWVtb3J5OiAiMjRNaSIKICAgICAgICAgICAgY3B1OiAiMTI1bSIKICAgICAgICAgIGxpbWl0czoKICAgICAgICAgICAgbWVtb3J5OiAiMTI4TWkiCiAgICAgICAgICAgIGNwdTogIjUwMG0iCiAgICAgIGltYWdlUHVsbFNlY3JldHM6CiAgICAgIC0gbmFtZTogb2Npci1zZWNyZXQ="
    deploy_artifact_source_type = "INLINE"
  }
  deploy_artifact_type = "KUBERNETES_MANIFEST"
  description          = "K8s manifest file to deploy Supremo app"
  display_name         = "deploy_supremo_react"
  freeform_tags = {
  }
  project_id = oci_devops_project.supremo-devops-project.id
}

## ----- Deployment Stages ----- ## 
resource oci_devops_deploy_stage Wait-for-approval {
  approval_policy {
    approval_policy_type         = "COUNT_BASED_APPROVAL"
    number_of_approvals_required = "1"
  }
  deploy_pipeline_id = oci_devops_deploy_pipeline.supremo-deploy-pipeline.id
  deploy_stage_predecessor_collection {
    items {
      id = oci_devops_deploy_pipeline.supremo-deploy-pipeline.id
    }
  }
  deploy_stage_type = "MANUAL_APPROVAL"
  description  = "Approval stage"
  display_name = "Wait for approval"
}

resource oci_devops_deploy_stage deploy_app_oke {
  count          = local.should_config_shared_private_subnet ? 1 : 0
  deploy_pipeline_id = oci_devops_deploy_pipeline.supremo-deploy-pipeline.id
  deploy_stage_predecessor_collection {
    items {
      id = oci_devops_deploy_stage.Wait-for-approval.id
    }
  }
  deploy_stage_type = "OKE_DEPLOYMENT"
  description  = "deploy app to OKE"
  display_name = "deploy_app_oke"
  freeform_tags = {
  }
  kubernetes_manifest_deploy_artifact_ids = [
    oci_devops_deploy_artifact.deploy_supremo_react.id,
  ]
  namespace = "supremo"
  oke_cluster_deploy_environment_id = oci_devops_deploy_environment.supremo-oke-environment[count.index].id
  rollback_policy {
    policy_type = "AUTOMATED_STAGE_ROLLBACK_POLICY"
  }
}