terraform {
  required_version = ">= 1.3.0"

  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"
      version = "~> 0.141"
    }
  }
}

provider "yandex" {
  cloud_id                 = var.cloud_id
  folder_id                = var.folder_id
  zone                     = var.zone
  service_account_key_file = var.service_account_key_file
}

data "yandex_compute_image" "ubuntu" {
  family = var.image_family
}

resource "yandex_vpc_network" "lab_network" {
  name = "${var.project_name}-network"
}

resource "yandex_vpc_subnet" "lab_subnet" {
  name           = "${var.project_name}-subnet"
  zone           = var.zone
  network_id     = yandex_vpc_network.lab_network.id
  v4_cidr_blocks = [var.subnet_cidr]
}

resource "yandex_vpc_security_group" "lab_sg" {
  name       = "${var.project_name}-sg"
  network_id = yandex_vpc_network.lab_network.id

  ingress {
    protocol       = "TCP"
    description    = "SSH"
    port           = 22
    v4_cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    protocol       = "TCP"
    description    = "HTTP frontend"
    port           = 80
    v4_cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    protocol       = "TCP"
    description    = "Client app port"
    port           = 3000
    v4_cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    protocol       = "TCP"
    description    = "Backend app port"
    port           = 8080
    v4_cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol       = "ANY"
    description    = "Allow all outbound"
    from_port      = 0
    to_port        = 65535
    v4_cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "yandex_compute_instance" "vm" {
  name        = var.vm_name
  hostname    = var.vm_name
  platform_id = var.platform_id

  resources {
    cores         = var.cores
    memory        = var.memory_gb
    core_fraction = 100
  }

  boot_disk {
    initialize_params {
      image_id = data.yandex_compute_image.ubuntu.id
      size     = var.disk_size_gb
      type     = var.disk_type
    }
  }

  network_interface {
    subnet_id          = yandex_vpc_subnet.lab_subnet.id
    nat                = true
    security_group_ids = [yandex_vpc_security_group.lab_sg.id]
  }

  metadata = {
    ssh-keys = "${var.ssh_username}:${file(var.ssh_public_key_path)}"
  }
}
