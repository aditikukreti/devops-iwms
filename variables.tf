variable "aws_region" {
  type    = string
  default = "ap-south-1"
}

variable "project_name" {
  type    = string
  default = "inventory-platform"
}

variable "tf_state_bucket_name" {
  type = string
}

variable "tf_lock_table_name" {
  type    = string
  default = "inventory-platform-tf-lock"
}
