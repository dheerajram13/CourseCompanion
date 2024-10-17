# Course Companion Setup Instructions

This document provides a step-by-step guide to set up the Course Companion application on an Ubuntu VM instance, including installation of necessary tools and deployment using Docker.

## Prerequisites

- A cloud provider account (e.g., AWS, Google Cloud, Azure) to create a VM instance.
- Basic familiarity with terminal commands and SSH.

## Step 1: Create a VM Instance

1. **Create a VM instance** with Ubuntu OS.
2. **Connect to the VM instance via SSH**:
3. Enter the commands
    ```bash
    sudo apt update
    sudo apt install git -y
    ```
4. git clone https://github.com/dheerajram13/CourseCompanion
cd CourseCompanion
5. 
 ```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install docker-ce -y
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/
```
6. Docker Swarm 
 ```bash
sudo docker swarm init
sudo docker build -t coursecompanion_frontend:latest ./frontend
sudo docker build -t coursecompanion_backend:latest ./backend
sudo docker stack deploy --compose-file docker-compose.yml coursecompanion
sudo docker stack ps coursecompanion
  ```
7. Rollout and Rollback

 ```bash
sudo docker service update --image coursecompanion_frontend:latest coursecompanion_frontend
sudo docker service rollback coursecompanion_frontend
sudo docker service ps coursecompanion_frontend

  ```