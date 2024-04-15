# Show and Discover Quickstart using Oracle Cloud Infrastructure Resource Manager and Terraform 

This solution allows you to provision show and discover related artifacts using [Terraform](https://www.terraform.io/docs/providers/oci/index.html) and [Oracle Cloud Infrastructure Resource Manager](https://docs.cloud.oracle.com/en-us/iaas/Content/ResourceManager/Concepts/resourcemanager.htm).

Below is a list of all artifacts that will be provisioned:

| Component          | Notes         
|--------------------|:---------------
| VCN                | VCN to which all the resources will be attached to.
| Private Subnet     | Private subnet in the VCN where Autonomous Database, PostgreSQL, NoSQL, Opensearch and Redis will be created. 
| Public Subnet      | Public subnet in the VCN where VM instance will be created.
| Network Resources  | NAT Gateway, Internet Gateway, Route tables and Security Lists created in the VCN.  
| Compute Instance   | VM instance with Public IP. Used to connect to database/opensearch/redis in private subnet. 
| Policies           | Policies created for provisioning all resources.  
| Autonomous Database| Autonomous Database (AJD).
| PostgreSQL         | PostgreSQL.
| NoSQL              | NoSQL table.
| OpenSearch Cluster | OpenSearch Cluster to store the data.
| Redis Cluster      | Redis Cluster . 
| Load Balancer      | PostgreSQL Load Balancer.


## Prerequisite

- Terraform version should be 1.2 or higher
- You need a user with an **Administrator** privileges to execute the ORM stack or Terraform scripts.
- Make sure your tenancy has service limits availabilities for the above components in the table.
- Make sure that public IP is available in the IP pool for the tenancy. 

## Deploy Using the Terraform CLI through Resource Manager Stacks
 
 Refer to the documentation: Getting Started with Managing Stacks and Jobs  https://docs.oracle.com/en-us/iaas/Content/ResourceManager/Tasks/managingstacksandjobs.htm

1. Create a Stack in Resource manager through OCI console. 
2. Make sure you select **My Configurations** and then upload the *show-discover-quickstart* folder in this repo.
3. Set a name for the stack and click Next.
4. Set the required variables values, optional variables values and then Create.
5. Create Jobs to plan and apply releases
6. Once the setup is completed, connection can be made to the Application by sshing to the public VM instance. IP Address and API Key will be available in the Job page.

## Deploy Using the Terraform CLI through Local Setup

### Prerequisites

#### This is required if deployment will be through Local Setup

Create/Modify the `terraform.tfvars` file, and specify the following variables:

```
# Authentication
tenancy_ocid        = "<tenancy_ocid>"
user_ocid           = "<user_ocid>"
fingerprint         = "<finger_print>"
private_key_path    = "<pem_private_key_path>"

region              = "<oci_region>"
compartment_ocid    = "<compartment_ocid>"
```

### Create the Resources
Run the following commands:

    1. terraform init
    2. terraform plan
    3. terraform apply

 ##### If there is an error while executing terraform init the command regarding hashicorp/Template v2.2.0 installation in macOS M1 chip, refer to this (https://discuss.hashicorp.com/t/template-v2-2-0-does-not-have-a-package-available-mac-m1/35099/4) .


### Connect to the compute instance

```ssh -i <path_of_private_key> opc@<public_ip>```

```<path_of_private_key>``` Create this file with the output of the command ```terraform output -raw generated_ssh_private_key```  <br>
```<public_ip>``` of instance can be obtained from ```terraform.tfstate``` or from the OCI console

### Destroy the Deployment
When you no longer need the deployment, you can run this command to destroy the resources:

    terraform destroy

###