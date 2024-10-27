# Course Companion Setup Instructions
CourseCompanion is a platform for students to upload study materials, collaborate, and seek help. It addresses challenges in managing resources and connecting with peers.


## Step 1: Setup

1. git clone https://github.com/dheerajram13/CourseCompanion
cd CourseCompanion
2. Create a firebase project and enable fire store, real-time db, and firebase auth. 
Update the firebase keys in firebase-config, adminsdk, service account, etc. 
3. 
5.  Run with docker 
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


The site will be up and running. 


