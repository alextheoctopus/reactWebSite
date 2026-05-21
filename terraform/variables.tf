variable "cloud_id" {
  description = "Yandex Cloud ID"
  type        = string
}

variable "folder_id" {
  description = "Yandex Cloud folder ID"
  type        = string
}

variable "service_account_key_file" {
  description = "Path to Yandex Cloud service account authorized key JSON"
  type        = string
  default     = "./sa-key.json"
}

variable "zone" {
  description = "Availability zone"
  type        = string
  default     = "ru-central1-a"
}

variable "project_name" {
  description = "Prefix for created resources"
  type        = string
  default     = "reactwebsite"
}

variable "vm_name" {
  description = "VM name"
  type        = string
  default     = "reactwebsite-vm"
}

variable "platform_id" {
  description = "Yandex Compute platform"
  type        = string
  default     = "standard-v1"
}

variable "cores" {
  description = "Number of vCPU cores"
  type        = number
  default     = 2
}

variable "memory_gb" {
  description = "Memory in GB"
  type        = number
  default     = 2
}

variable "disk_size_gb" {
  description = "Boot disk size in GB"
  type        = number
  default     = 20
}

variable "disk_type" {
  description = "Boot disk type"
  type        = string
  default     = "network-hdd"
}

variable "image_family" {
  description = "OS image family"
  type        = string
  default     = "ubuntu-2204-lts"
}

variable "subnet_cidr" {
  description = "Subnet CIDR"
  type        = string
  default     = "10.10.0.0/24"
}

variable "ssh_username" {
  description = "Linux username to inject into VM metadata"
  type        = string
  default     = "eb2022"
}

variable "ssh_public_key_path" {
  description = "Path to local public SSH key"
  type        = string
}
