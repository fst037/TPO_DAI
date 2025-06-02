#!/bin/bash
# Script para iniciar todos los servicios necesarios para el proyecto en Codespaces

# Iniciar MySQL
sudo service mysql start

# Ir al directorio del backend y levantar la API
cd "$(dirname "$0")/Back End/demo/demo"
./mvnw spring-boot:run
