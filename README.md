# AloClock

Sistema de registro de jornada electrónica basado en Spring Boot y React.

## Backend
- Java 17, Spring Boot 3.
- Endpoints principales para fichajes y administración.
- Seguridad mediante JWT.

Para compilar y ejecutar:
```
mvn spring-boot:run
```

Configure las credenciales de base de datos copiando `src/main/resources/application.properties.example`
a `src/main/resources/application.properties` y ajustando las variables según el entorno.

## Frontend
- React básico con Axios.
- Realiza login y permite fichar entrada/salida.

Para iniciar (reemplazar con su herramienta preferida):
```
npm start