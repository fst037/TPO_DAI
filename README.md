# TPO_DAI

## Scripts de inicio y apagado en Codespaces

Para facilitar el uso del proyecto en GitHub Codespaces, se agregaron dos scripts en la raíz del repositorio:

### Iniciar todos los servicios
```bash
./start_all.sh
```
Este script:
- Inicia el servidor MySQL
- Inicia la API de Spring Boot (en `/Back End/demo/demo`)

### Apagar todos los servicios
```bash
./stop_all.sh
```
Este script:
- Detiene la API de Spring Boot
- Detiene el servidor MySQL

> Asegúrate de dar permisos de ejecución a los scripts si es la primera vez:
> ```bash
> chmod +x start_all.sh stop_all.sh
> ```

Puedes modificar estos scripts según tus necesidades.

---
