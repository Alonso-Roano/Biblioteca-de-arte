# Biblioteca-de-arte
Repositorio del proyecto de seguridad 
## Integrantes
### Sánchez Roano Carlos Alonso
- Correo: carlosroano201@gmail.com
- Usuario de git: Alonso-Roano

## Pasos para hacer un commit correctamente

### 1. Clonar el repositorio
Si aún no tienes el repositorio en tu máquina, clónalo con:
```sh
 git clone https://github.com/Alonso-Roano/Biblioteca-de-arte
```

### 2. Crear una nueva rama
Antes de hacer cambios, crea una nueva rama basada en `main`:
```sh
 git checkout -b nombre-de-la-rama
```
Ejemplo:
```sh
 git checkout -b feature/agregar-funcionalidad
```

### 3. Hacer cambios y agregarlos al staging
Edita los archivos necesarios y luego agrégalos al área de staging:
```sh
 git add archivo1 archivo2
```
O para agregar todos los cambios:
```sh
 git add .
```

### 4. Crear un commit
Una vez agregados los cambios, haz un commit con un mensaje claro y descriptivo:
```sh
 git commit -m "Descripción breve del cambio"
```
Ejemplo:
```sh
 git commit -m "Corrige el bug en la autenticación de usuarios"
```

### 5. Subir la rama al repositorio remoto
Sube tu nueva rama al repositorio en GitHub:
```sh
 git push origin nombre-de-la-rama
```
Ejemplo:
```sh
 git push origin feature/agregar-funcionalidad
```

### 6. Crear un Pull Request
- Ve a tu repositorio en GitHub.
- Dirígete a la pestaña "Pull Requests".
- Haz clic en "New Pull Request".
- Selecciona la rama que acabas de subir.
- Agrega una descripción y solicita revisión.

### 7. Esperar Revisión
Los administradores revisarán tu código y podrán solicitar cambios antes de fusionarlo con `main`.

---

### Notas Importantes
- Sigue el formato de nombres de ramas (`feature/`, `bugfix/`, `hotfix/`).
- Usa commits descriptivos y concisos.
- Asegúrate de actualizar tu `main` antes de crear nuevas ramas:
  ```sh
  git pull origin main
  

