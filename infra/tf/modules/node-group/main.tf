resource "yandex_kubernetes_node_group" "this" {
    cluster_id = var.cluster_id
    name = var.name

    instance_template {
        platform_id = "standard-v1"
        network_interface {
            nat = true
            subnet_ids = [var.subnet_id]
        }
        boot_disk {
            type = var.instance_template_boot_disk_type
            size = var.instance_template_boot_disk_size
        }
        resources {
            cores = var.instance_template_resources_core
            memory = var.instance_template_resources_memory
        }
    }

    scale_policy {
        auto_scale {
            min = var.node_min_count
            max = var.node_max_count
            initial = var.node_initial_count
        }
    }
}
