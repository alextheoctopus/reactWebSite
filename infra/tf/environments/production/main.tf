module "network" {
  source = "../../modules/network"
  name = "prod-vpc"
  zone = var.zone
  v4_cidr_blocks = ["172.16.0.0/16"]
}

module "iam" {
  source = "../../modules/iam"
  name = "k8s-prod"
  description = "service account to manage k8s"
  folder_id = var.folder_id
  role = "editor"
}

module "k8s_cluster" {
  source = "../../modules/k8s-cluster"
  name = "zonal-k8s-prod"
  network_id = module.network.network_id
  subnet_id = module.network.subnet_id
  zone = module.network.zone
  service_account_id = module.iam.sa_id
  node_service_account_id = module.iam.sa_id
}

module "node_group" {
  source = "../../modules/node-group"
  name = "prod-k8s-node-group"
  node_min_count = var.node_min_count
  node_max_count = var.node_max_count
  node_initial_count = var.node_initial_count
  cluster_id = module.k8s_cluster.cluster_id
  subnet_id = module.network.subnet_id
}
