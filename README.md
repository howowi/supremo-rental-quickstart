## Supremo Rental Quickstart



### Module 1: 
**IMPORTANT**: Must complete the quickstart before following the steps below.

#### Github Repository Setup

1. Fork the [Supremo Rental Quickstart Github Repository](https://github.com/howowi/supremo-rental-quickstart) to your Github account. Follow the steps in this [link](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo?tool=webui#forking-a-repository) on the steps to fork a repository.

2. Clone the repository on your local terminal or Cloud Shell.

3. Navigate to Github repository settings. Press "Actions" under "Secrets and variables" option.

4. Press "New repository secret" to create the following secrets

    * OCI_CLI_FINGERPRINT
    * OCI_CLI_KEY_CONTENT
    * OCI_CLI_REGION
    * OCI_CLI_TENANCY
    * OCI_CLI_USER
    * OCI_COMPARTMENT_OCID
    * OCI_USERNAME
    * OCI_AUTH_TOKEN
    * OCI_DEVOPS_PIPELINE_ID

#### OKE Setup

1. Create ephemeral network definition on Cloud Shell to acccess the private OKE cluster.

2. Create a namespace for supremo app
```
kubectl create ns supremo
```

3. Create container registry secret to pull container image from OCI Container Registry.
```
kubectl create secret docker-registry ocir-secret --docker-username='<tenancy_name>/<username>' --docker-password='<auth_token>' --docker-server=<region_code>.ocir.io --docker-email='<user_email>' -n supremo
```

4. Check that secret has been created
```
kubectl get secrets -n supremo
```

#### OCI DevOps Setup

1. Navigate to OCI DevOps project.

2. Go to artifact and select "deploy_supremo_react".

3. Copy and paste the content of deployment/deployment_supremo_frontend.yml to the artifact.

#### Update Code and Run Github Action

1. Search for `<backend_ip>` across all the files in this repository and update it with the IP address of the backend server.

2. Commit and push the changes to Github.

3. Observe that Github Action will be triggered and OCI Deployment Pipeline will deploy Supremo frontend to OKE cluster.

4. After deployment is completed, validate that the Supremo app is accessible. Get the public IP of the load balancer by running the command below:
```
kubectl get svc -n supremo
```
