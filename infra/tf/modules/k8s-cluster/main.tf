resource "yandex_kubernetes_cluster" "this" {
    name = var.name
    network_id = var.network_id
    service_account_id = var.service_account_id
    node_service_account_id = var.node_service_account_id

    master {
        master_location{
            zone = var.zone
            subnet_id = var.subnet_id
            }
        public_ip = true
    }
}