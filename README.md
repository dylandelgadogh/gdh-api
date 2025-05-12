# gdh-api

## Información

### Versión

0.0.1

### Descripción

API para la gestion GDH

### Autor

dylan.delgado@interseguro.com.pe

## Compilación

```bash
npm run build
```

## Ejecución

```bash
npm run start
```

## Ejecución en entorno local

```bash
./local
```

## Ejecución de pruebas unitarias

```bash
npm run test
```

Revisar el reporte de pruebas unitarias generadas en:

> test-result/test-report.html

## Endpoints de estado de salud

**Liveness:** Implementado por defecto en la URL:

> localhost:8080/liveness

**Readiness:** Implementar en index.ts, elemento "readinessProbes".

> localhost:8080/readiness

fnm env --use-on-cd | Out-String | Invoke-Expression
fnm use 18