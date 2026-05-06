resource "yandex_iam_service_account" "this" {
        name        = var.name
        description = var.description
    }

resource "yandex_resourcemanager_folder_iam_member" "editor" {
        folder_id = var.folder_id
        member    = "serviceAccount:${yandex_iam_service_account.this.id}"
        role      = var.role
    }