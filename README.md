# Frontend Áreas Deportivas

Aplicación web desarrollada con React para gestionar un sistema de áreas deportivas. El proyecto permite navegar entre módulos de usuarios, reservas, canchas, zonas y administración, con un flujo pensado para la gestión y el acceso a reservas de servicios deportivos.

<img width="1277" height="610" alt="Captura de Pantalla 2026-05-14 a la(s) 10 38 26" src="https://github.com/user-attachments/assets/fe9a0ad3-9d37-4d7a-92ec-5397b8dea95f" />


## Cómo compilar y levantar el proyecto

Una vez clonado el repositorio, posicionarse en la rama FrontendFlujoFinal y ejecuta estos pasos desde la carpeta raíz:

```bash
npm install
npm start
```

La aplicación se abrirá en `http://localhost:3000`.

Si quieres generar una versión optimizada para producción, usa:

```bash
npm run build
```

## ROL ADMINISTRADOR

El rol administrador está orientado a la gestión interna del sistema. Desde este perfil, el administrador puede crear y administrar su área deportiva, registrar sus canchas, revisar un calendario con las reservas realizadas por los clientes y dar seguimiento a los pagos y equipamientos asociados a sus canchas.

### Funciones principales

- Creación y gestión de su área deportiva.
- Registro y administración de canchas.
- Visualización de un calendario con las reservas realizadas por clientes.
- Seguimiento de pagos.
- Administración de los equipamientos disponibles en sus canchas.

### Acceso al registro de administrador

Al ingresar un nuevo Administrador al sistema, el software le permititra añadir informacion y fotos de su area deportiva.

<img width="1267" height="606" alt="Captura de Pantalla 2026-05-14 a la(s) 09 46 10" src="https://github.com/user-attachments/assets/4467a19a-23b4-41c9-824f-999ba76686dc" />
<img width="1270" height="607" alt="Captura de Pantalla 2026-05-14 a la(s) 09 48 08" src="https://github.com/user-attachments/assets/f155a4c9-3ad3-49ac-8e82-08d6975a34e2" />
<img width="1270" height="609" alt="Captura de Pantalla 2026-05-14 a la(s) 09 54 18" src="https://github.com/user-attachments/assets/ec9628b6-2d3d-4ccd-ba76-6c32d8d1e067" />

Una vez creada el area deportiva, el sistema permite crear canchas

<img width="1280" height="613" alt="Captura de Pantalla 2026-05-14 a la(s) 09 57 42" src="https://github.com/user-attachments/assets/8449a2db-bfa8-416f-8022-de026828ddf8" />
<img width="1280" height="613" alt="Captura de Pantalla 2026-05-14 a la(s) 10 01 10" src="https://github.com/user-attachments/assets/06b9db82-f9f5-498e-bf34-732e20bc3653" />

Una vez creada la primer cancha que nos indica que debemos crear las disciplinas que se pueden practicar en esta cancha.

<img width="1277" height="610" alt="Captura de Pantalla 2026-05-14 a la(s) 10 01 50" src="https://github.com/user-attachments/assets/6865e631-ff98-4c50-9713-7fa140c70943" />
<img width="1277" height="610" alt="Captura de Pantalla 2026-05-14 a la(s) 10 03 17" src="https://github.com/user-attachments/assets/e161a41e-a1a9-475d-9642-8b573582d902" />
<img width="1277" height="610" alt="Captura de Pantalla 2026-05-14 a la(s) 10 03 31" src="https://github.com/user-attachments/assets/de8d6cce-d3aa-4378-a58f-7fef33728c8a" />
<img width="1277" height="610" alt="Captura de Pantalla 2026-05-14 a la(s) 10 05 33" src="https://github.com/user-attachments/assets/4a5f8532-a973-4e5f-8b6b-6a7e6796f583" />

### GESTION DE CANCHAS

<img width="1277" height="610" alt="Captura de Pantalla 2026-05-14 a la(s) 10 11 29" src="https://github.com/user-attachments/assets/9885a3f8-e97e-48b5-97dd-98148c8a01da" />
<img width="1277" height="610" alt="Captura de Pantalla 2026-05-14 a la(s) 10 11 56" src="https://github.com/user-attachments/assets/75a599cd-3171-4e88-9b7f-1904e3abaa51" />

#### ASIGNAR DISCIPLINAS QUE SE PUEDEN JUGAR EN CANCHAS

<img width="1277" height="610" alt="Captura de Pantalla 2026-05-14 a la(s) 10 12 30" src="https://github.com/user-attachments/assets/97738d62-e4a4-4449-b31b-0d23b581c44d" />

### RESERVAS DESDE CANCHAS
Desde la vista para cliente, el cliente puede realizar la reserva

<img width="1277" height="610" alt="Captura de Pantalla 2026-05-14 a la(s) 10 17 47" src="https://github.com/user-attachments/assets/fa9a5ca6-3101-4d4d-9055-92ef4c25de14" />

En el boton de RESERVAS podemos observar todas las reservas que tiene esa cancha

<img width="1277" height="610" alt="Captura de Pantalla 2026-05-14 a la(s) 10 24 22" src="https://github.com/user-attachments/assets/c91615a8-8032-44f9-8352-59d7e2b3c1d0" />

<img width="1277" height="610" alt="Captura de Pantalla 2026-05-14 a la(s) 10 24 59" src="https://github.com/user-attachments/assets/660695d6-e3b0-4acd-9e86-25f356835274" />

Al presionar en "Generar PDF" se descargara automaticamente un pdf con informacion de la reserva.

<img width="1277" height="610" alt="Captura de Pantalla 2026-05-14 a la(s) 10 27 47" src="https://github.com/user-attachments/assets/e42ae46b-e9c6-4c64-a859-ec0e69957888" />

Al presionar en "Cancelar" se cancelara esa reserva y el horario se vuelve a habilitar para que otro cliente pueda realizar su reserva.

<img width="1280" height="434" alt="Captura de Pantalla 2026-05-14 a la(s) 10 30 06" src="https://github.com/user-attachments/assets/11fe443f-f6a3-4d4e-9c79-e4e4f3ee2301" />

<img width="1278" height="251" alt="Captura de Pantalla 2026-05-14 a la(s) 10 30 27" src="https://github.com/user-attachments/assets/1b4245da-9a11-429d-b12a-e81c6e0433f7" />

### RESERVAS Y CANCELACIONES

En el menu, en la seccion "RESERVAS" podemos visualizar una lista de cancelaciones y reservas.

<img width="1277" height="610" alt="Captura de Pantalla 2026-05-14 a la(s) 10 31 48" src="https://github.com/user-attachments/assets/0d76a194-289b-4c4c-864d-74081eb18244" />

<img width="1277" height="610" alt="Captura de Pantalla 2026-05-14 a la(s) 10 32 42" src="https://github.com/user-attachments/assets/7c6cb2ee-7932-4235-b622-922ccdc5e6a3" />

Tambien podemos ver una lista de clientes que realizaron su reserva

<img width="1277" height="610" alt="Captura de Pantalla 2026-05-14 a la(s) 10 33 08" src="https://github.com/user-attachments/assets/dea03d00-3c09-43da-b574-4c81a1fef175" />

### PAGOS Y TRANSACCIONES

En el menu, en la seccion "PAGOS" podemos visualizar informacion sobre si se realizaron los pagos de las reservas.

<img width="1277" height="610" alt="Captura de Pantalla 2026-05-14 a la(s) 10 33 52" src="https://github.com/user-attachments/assets/ee964ed2-e177-4c22-ac15-47066cbabd02" />

### CALENDARIO

En el menu, en la seccion "CALENDARIO" podemos visualizar todas lasreservas.

<img width="1277" height="610" alt="Captura de Pantalla 2026-05-14 a la(s) 10 35 21" src="https://github.com/user-attachments/assets/330a7606-ed91-40a0-9040-ac7a529cc1b5" />

<img width="1277" height="610" alt="Captura de Pantalla 2026-05-14 a la(s) 10 36 39" src="https://github.com/user-attachments/assets/dd625f87-1f73-4e4c-8562-e73e1fdc37ea" />
