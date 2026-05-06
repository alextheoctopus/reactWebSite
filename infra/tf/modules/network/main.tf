resource "yandex_vpc_network" "this" {
        name        = var.name
    }

resource "yandex_vpc_subnet" "this" {
        v4_cidr_blocks = var.v4_cidr_blocks
        zone = var.zone
        network_id = yandex_vpc_network.this.id
    }
