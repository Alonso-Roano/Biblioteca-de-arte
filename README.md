
# Biblioteca-de-arte
Repositorio del proyecto de seguridad 

## Problematica
En la actualidad, los artistas emergentes enfrentan dificultades para exhibir y comercializar sus obras debido a la falta de espacios accesibles y la alta competencia en plataformas tradicionales. Muchas soluciones existentes están orientadas a artistas consolidados, lo que limita la visibilidad y las oportunidades de los creadores en crecimiento.
Nuestro proyecto busca abordar esta problemática mediante el desarrollo de una plataforma web que permita a los artistas exponer sus obras y conectarse directamente con el público sin intermediarios. La plataforma ofrecerá herramientas avanzadas para la gestión, visualización y comercialización de arte digital, optimizando la experiencia tanto para creadores como para consumidores.

## Integrantes
### Sánchez Roano Carlos Alonso
- Correo: carlosroano201@gmail.com
- Usuario de git: Alonso-Roano

## Dependencias

### Dependencias principales

- `@primeuix/themes`: ^1.0.0
- `@primevue/core`: ^4.2.5
- `@primevue/themes`: ^4.2.5
- `@tailwindcss/vite`: ^4.0.6
- `axios`: ^1.7.9
- `jwt-decode`: ^4.0.0
- `pinia`: ^3.0.1
- `primeicons`: ^7.0.0
- `primevue`: ^4.3.1
- `tailwindcss`: ^4.0.6
- `vue`: ^3.5.13
- `vue-router`: ^4.5.0

### Dependencias de desarrollo

- `@iconify/vue`: ^4.3.0
- `@primevue/core`: ^4.2.5
- `@primevue/themes`: ^4.2.5
- `@tsconfig/node22`: ^22.0.0
- `@types/node`: ^22.13.4
- `@vitejs/plugin-vue`: ^5.2.1
- `@vue/eslint-config-prettier`: ^10.2.0
- `@vue/eslint-config-typescript`: ^14.4.0
- `@vue/tsconfig`: ^0.7.0
- `eslint`: ^9.20.1
- `eslint-plugin-vue`: ^9.32.0
- `jiti`: ^2.4.2
- `npm-run-all2`: ^7.0.2
- `prettier`: ^3.5.1
- `typescript`: ~5.7.3
- `vite`: ^6.1.0
- `vite-plugin-vue-devtools`: ^7.7.2
- `vue-tsc`: ^2.2.2


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
  ```

---

## Cómo correr el proyecto

### 1. Instalar las dependencias
Primero, asegúrate de tener Node.js y npm instalados. Luego, en la raíz del proyecto, instala las dependencias con el siguiente comando:
```sh
npm install
```

### 2. Ejecutar el servidor de desarrollo
Para correr el proyecto en modo de desarrollo, usa el siguiente comando:
```sh
npm run serve
```
Esto abrirá una ventana en tu navegador con la aplicación corriendo localmente en `http://localhost:8080`.

### 3. Abrir la aplicación en el navegador
Una vez que el servidor esté corriendo, puedes ver la aplicación en tu navegador en la dirección indicada anteriormente. Si quieres cambiar el puerto o hacer alguna otra configuración personalizada, puedes modificar el archivo `vue.config.js`.
