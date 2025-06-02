#!/bin/bash
# Script para detener todos los servicios del proyecto en Codespaces

# Detener la API de Spring Boot (busca el proceso y lo mata)
SPRING_PID=$(ps aux | grep 'spring-boot:run' | grep -v grep | awk '{print $2}')
if [ ! -z "$SPRING_PID" ]; then
  kill $SPRING_PID
  echo "Spring Boot detenido."
else
  echo "Spring Boot no estaba corriendo."
fi

# Detener MySQL
sudo service mysql stop
