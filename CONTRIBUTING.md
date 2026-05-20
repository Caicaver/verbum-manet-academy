# Cómo contribuir a Verbum Manet Academy

Gracias por tu interés en colaborar. Este proyecto existe para llevar formación teológica reformada de calidad, gratuita y en español a toda persona de habla hispana. Tu aporte puede ayudar a esa misión.

Antes de contribuir, lee esta guía completa. El proyecto tiene convicciones claras —doctrinales y técnicas— y las contribuciones deben respetarlas.

---

## Tipos de contribución

### 1. Correcciones editoriales

Erratas, ortotipografía, enlaces rotos, citas bíblicas mal referenciadas. Son las contribuciones más sencillas y siempre bienvenidas.

**Cómo:** abre un issue con la etiqueta `editorial` indicando el archivo, la línea y la corrección sugerida. O envía directamente un pull request.

**Requisito:** toda corrección editorial debe pasar la auditoría del style guide:

```bash
python -m vma_audit audit courses/segment-N/curso-modificado.html
```

### 2. Mejoras de contenido doctrinal

Ampliaciones, aclaraciones, nuevas referencias confesionales. Estas requieren más cuidado.

**Requisito doctrinal innegociable:** toda contribución de contenido debe alinearse con la **tradición reformada confesional clásica**:

- Confesión de Fe de Westminster y sus catecismos (Mayor y Menor)
- Catecismo de Heidelberg
- Confesión Belga
- Cánones de Dort
- Confesión Bautista de 1689 (donde aplique)

No se aceptan contribuciones que:
- Relativicen o contradigan estas confesiones.
- Introduzcan posiciones arminianas, dispensacionalistas radicales, o de teología liberal.
- Difuminen las distinciones reformadas en aras de un ecumenismo indefinido.

**Cómo:** abre primero un issue con la etiqueta `doctrina` para discutir la propuesta ANTES de escribir el contenido. Esto evita trabajo perdido.

### 3. Mejoras técnicas

Optimizaciones, correcciones de bugs, mejoras de accesibilidad o rendimiento.

**Requisito técnico innegociable:** toda contribución de código debe respetar los **cuatro principios arquitectónicos** documentados en [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md#2-principios-arquitectónicos):

1. **Estática primero** — sin servidor de aplicaciones.
2. **Sin frameworks ni build** — HTML/CSS/JS vanilla. No React, Vue, Astro, Next, TypeScript, Sass, Webpack.
3. **Sin almacenamiento de navegador** — sin localStorage, sessionStorage, IndexedDB ni cookies. Estado en memoria + export/import JSON.
4. **Contenido como datos, presentación como código** — separación estricta.

Las contribuciones que violen estos principios serán rechazadas, por buenas que sean en sí mismas. Consulta la lista de [propuestas explícitamente rechazadas](docs/MEJORAS-ADICIONALES.md) antes de proponer una mejora técnica mayor.

### 4. Traducciones

A portugués prioritariamente (ver roadmap). Requieren colaborador bilingüe y revisor doctrinal.

**Cómo:** abre un issue con la etiqueta `traducción` para coordinar.

---

## Flujo de trabajo con Git

1. **Fork** del repositorio a tu cuenta.
2. **Clona** tu fork localmente.
3. **Crea una rama** descriptiva:
   ```bash
   git checkout -b fix/errata-curso-13
   git checkout -b feat/glosario-audio
   git checkout -b docs/correccion-arquitectura
   ```
4. **Haz tus cambios** siguiendo las convenciones de abajo.
5. **Verifica** que pasan las comprobaciones:
   ```bash
   python -m vma_audit audit courses/
   ```
6. **Commit** con mensaje claro (ver convención de commits).
7. **Push** a tu fork y abre un **Pull Request** contra `main`.

---

## Convención de mensajes de commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<ámbito>): <descripción breve en minúscula>

[cuerpo opcional explicando el porqué]
```

**Tipos:**

| Tipo | Uso |
|---|---|
| `feat` | Nueva funcionalidad o curso |
| `fix` | Corrección de bug o errata |
| `docs` | Cambios en documentación |
| `style` | Formato, ortotipografía (sin cambio de significado) |
| `refactor` | Reestructuración sin cambio de comportamiento |
| `chore` | Tareas de mantenimiento, configuración |

**Ejemplos:**

```
fix(curso-13): corregir referencia bíblica en vía eléntica
docs(architecture): aclarar el flujo de carga de fragmentos
feat(glosario): añadir término «pactum salutis»
style(curso-08): aplicar comillas latinas según style guide
chore(ci): añadir verificación de invariantes
```

---

## Convenciones de estilo

### Contenido (HTML de cursos)

Sigue rigurosamente [`docs/STYLE-GUIDE-CONTENT.md`](docs/STYLE-GUIDE-CONTENT.md):

- Comillas latinas «» en texto, no rectas "".
- Abreviaturas bíblicas en castellano (Gn, Éx, Lv...), no inglesas.
- Términos latinos/griegos/hebreos con `<i lang="...">`.
- Las cinco vías canónicas en cada lección, en orden fijo.
- Mayúscula confesional disciplinada (ver §5 del style guide).

### Código (HTML/CSS/JS)

- Indentación: 2 espacios (configurado en `.editorconfig`).
- Codificación: UTF-8.
- Line endings: LF (configurado en `.gitattributes`).
- Nombres de archivo: kebab-case minúscula sin tildes.
- Clases CSS: convención BEM-modificada (`.bloque__elemento--variante`).

---

## Qué NO contribuir

Para ahorrarte tiempo, estas contribuciones serán rechazadas:

- Migración a cualquier framework (React, Vue, Svelte, Astro, etc.).
- Introducción de TypeScript o cualquier paso de build.
- Sistemas de tracking, analítica con terceros, o publicidad.
- Funcionalidad que requiera localStorage o backend.
- Sistemas de cuentas de usuario.
- Contenido doctrinal ajeno a la tradición reformada confesional.
- Gamificación (puntos, insignias, rankings competitivos).

Consulta la sección §8 de [`docs/MEJORAS-ADICIONALES.md`](docs/MEJORAS-ADICIONALES.md) para la lista completa con sus razones.

---

## Código de conducta

Este es un proyecto cristiano. Esperamos de todos los colaboradores:

- **Caridad fraternal** en el desacuerdo. Los debates doctrinales son bienvenidos cuando se hacen con respeto y caridad.
- **Honestidad intelectual.** Atribuir fuentes, no plagiar, reconocer errores.
- **Edificación mutua.** El objetivo es servir a la Iglesia, no lucirse.

Ver [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) para más detalle.

---

## Preguntas

Si tienes dudas, abre un issue con la etiqueta `pregunta` antes de invertir tiempo en una contribución grande. Es mejor coordinar primero.

---

*Verbum Domini manet in aeternum.*
