variable "cluster_id" {
  type = string
}

variable "name" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "instance_template_boot_disk_type" {
  type    = string
  default = "network-hdd"
}

variable "instance_template_boot_disk_size" {
  type    = number
  default = 70
}

variable "instance_template_resources_core" {
  type    = number
  default = 2
}

variable "instance_template_resources_memory" {
  type    = number
  default = 4
}

variable "node_min_count" {
  type    = number
  default = 1
}

variable "node_max_count" {
  type    = number
  default = 3
}

variable "node_initial_count" {
  type    = number
  default = 1
}
