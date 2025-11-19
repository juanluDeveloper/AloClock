# AloClock

Sistema de **registro de jornada electrónica** para la Clínica Dental Alodent, basado en **Spring Boot 3** (backend) y **React** (frontend), con autenticación mediante **JWT** y panel separado para **trabajadores** y **administradores**.

---

## ✨ Funcionalidades

### Para trabajadores
- Inicio de sesión con email y contraseña.
- Fichajes de:
  - **Entrada**
  - **Pausa**
  - **Reanudación**
  - **Salida**
- Resumen del día:
  - Primera entrada
  - Última salida
  - Minutos trabajados
- Histórico de jornadas con filtros por rango de fechas.
- Vista semanal (lunes–domingo) con:
  - Fichajes por día
  - Total de minutos trabajados por jornada
- Listado de todos los fichajes del usuario (eventos individuales).

### Para administradores
- Gestión de empleados:
  - Alta de nuevos empleados (nombre, email, contraseña, rol).
  - Activar / desactivar empleados.
- Consulta de fichajes:
  - Filtro por empleado.
  - Filtro por rango de fechas.
- Exportación a **CSV** de los fichajes en un rango de fechas.

### Seguridad
- Autenticación con **JWT**.
- Endpoints bajo `/api/admin/**` protegidos con rol **ADMIN**.
- Passwords almacenadas con **BCrypt**.

---

## 🧱 Tecnologías

**Backend**
- Java 17
- Spring Boot 3
- Spring Web
- Spring Security (JWT)
- Spring Data JPA
- PostgreSQL

**Frontend**
- React
- Axios
- Bootstrap 5

---

## 📁 Estructura general

### Backend (Spring Boot)

- `config/`
  - `SecurityConfig.java` → configuración de seguridad, filtros, rutas públicas/privadas.
  - `JwtAuthenticationFilter.java` → filtro que valida el token JWT en cada petición.
- `controller/`
  - `AuthController` → `/api/login`
  - `TimeRecordController` → endpoints de fichajes del propio empleado.
  - `AdminController` → endpoints de administración (empleados, fichajes globales, export).
- `model/`
  - `Employee` → empleado (nombre, email, password, rol, activo).
  - `TimeRecord` → registro de fichaje.
  - `Role`, `RecordType` → enums.
- `service/`
  - `EmployeeService` → lógica de empleados.
  - `TimeRecordService` → lógica de fichajes y cálculo de jornadas.
  - `CustomUserDetailsService` → integración con Spring Security.
  - `JwtService` → generación y validación de tokens JWT.
- `repository/`
  - `EmployeeRepository`
  - `TimeRecordRepository`

### Frontend (React)

- `src/App.jsx` → layout principal, navbar, login / logout y toggle Trabajador/Admin.
- `src/views/LoginView.jsx` → pantalla de login.
- `src/views/UserDashboard.jsx` → panel de trabajador con pestañas:
  - `ResumenTab`
  - `SemanasTab`
  - `EventosTab`
- `src/views/AdminView.jsx` → panel de administración.
- `src/services/`
  - `api.js` → instancia de Axios + interceptor para token.
  - `authService.js` → login.
  - `timeRecordService.js` → fichajes del usuario.
  - `adminService.js` → endpoints de administración.
- `src/utils/dateUtils.js` → utilidades de fechas y horas.
- `src/styles.css` → estilos propios (hero, cards, botones, etc.).

---

## ⚙️ Requisitos previos

- **Java 17** instalado.
- **Maven 3**.
- **Node.js** y **npm**.
- **PostgreSQL** en ejecución.

---

## 🗄️ Configuración de base de datos

En `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/aloclock
spring.datasource.username=aloclock_user
spring.datasource.password=1234

spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.hibernate.ddl-auto=update
