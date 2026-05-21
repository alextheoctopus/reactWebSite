output "external_ip" {
  description = "External IP address of the VM"
  value       = yandex_compute_instance.vm.network_interface[0].nat_ip_address
}

output "internal_ip" {
  description = "Internal IP address of the VM"
  value       = yandex_compute_instance.vm.network_interface[0].ip_address
}

output "ssh_command" {
  description = "Ready-to-use SSH command"
  value       = "ssh ${var.ssh_username}@${yandex_compute_instance.vm.network_interface[0].nat_ip_address}"
}
