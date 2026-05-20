<div align="center">

# Verbum Manet Academy

### Seminario reformado en línea, de acceso libre, en español

*Verbum Domini manet in aeternum* — Isaías 40:8

[![License: CC BY-SA 4.0](https://img.shields.io/badge/Contenido-CC%20BY--SA%204.0-blue.svg)](LICENSE-CONTENT)
[![License: MIT](https://img.shields.io/badge/Código-MIT-green.svg)](LICENSE-CODE)
[![Tradición](https://img.shields.io/badge/Tradici%C3%B3n-Reformada%20confesional-c9a84c)](docs/STYLE-GUIDE-CONTENT.md)
[![Status](https://img.shields.io/badge/Estado-En%20desarrollo-orange)]()

</div>

---

## Qué es esto

**Verbum Manet Academy** es una plataforma de formación teológica reformada en español, distribuida como aplicación web estática instalable (PWA). El proyecto ofrece **20 cursos** estructurados en **143 lecciones**, cubriendo cuatro segmentos:

- **Segmento I** — Fundamentos y herramientas (Prolegómenos)
- **Segmento II** — Historia de la Iglesia
- **Segmento III** — Teología sistemática
- **Segmento IV** — Teología aplicada

Cada lección sigue la estructura canónica de **las cinco vías pedagógicas**:

1. **Formulación confesional** — anclaje en Westminster, Heidelberg, Belga, Dort.
2. **Dimensión eléntica** — refutación reformada de errores históricos y contemporáneos.
3. **Perspectiva de teología bíblica** — recorrido por la historia de la redención.
4. **Aplicación catequética** — vinculación con catecismos clásicos.
5. **Aplicación doxológica** — cierre en adoración trinitaria.

---

## Acceso al sitio

El sitio se sirve desde Cloudflare Pages:

🌐 **[verbummanet.academy](https://verbummanet.academy)** *(próximamente)*

También es **instalable como aplicación** en Android, iOS, Windows y macOS desde el propio navegador. Funciona **offline** una vez visitados los cursos.

---

## Principios del proyecto

1. **Gratuidad como dignidad.** El contenido es libre y siempre lo será. La presentación cuidada no contradice la gratuidad; la encarna.
2. **Privacidad estricta.** Sin tracking, sin cookies de aplicación, sin terceros. Tu progreso vive en tu navegador y puedes exportarlo o importarlo como archivo JSON.
3. **Rigor confesional.** Tradición reformada clásica (Westminster, Heidelberg, Belga, Dort). Ni interconfesional, ni denominacional sectario.
4. **Permanencia técnica.** HTML/CSS/JS vainilla, sin frameworks, sin build. El código que ves es el código que el navegador ejecuta. Diseñado para durar décadas.

---

## Documentación

| Documento | Contenido |
|---|---|
| [`ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Arquitectura técnica completa |
| [`STYLE-GUIDE-CONTENT.md`](docs/STYLE-GUIDE-CONTENT.md) | Guía editorial v1.1 (citas, ortotipografía, doctrina) |
| [`BRANDING-CLAUDE-DESIGN.md`](docs/BRANDING-CLAUDE-DESIGN.md) | Sistema de marca (paleta, tipografía, iconos) |
| [`MEJORAS-ADICIONALES.md`](docs/MEJORAS-ADICIONALES.md) | Roadmap de mejoras futuras |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Cómo contribuir |

---

## Stack técnico

- **HTML5 + CSS3** con tokens OKLCH
- **JavaScript ES2022 vanilla** (sin frameworks, sin build)
- **Web App Manifest** para instalabilidad PWA
- **Cloudflare Pages** para distribución global

**Sin React, sin Vue, sin Astro, sin Next, sin TypeScript, sin Sass, sin Webpack.** El proyecto cumple [cuatro principios arquitectónicos](docs/ARCHITECTURE.md#2-principios-arquitectónicos) inviolables.

---

## Estructura del repositorio

```
verbum-manet-academy/
├── index.html              Shell único de la SPA
├── manifest.json           Web App Manifest (PWA)
├── 404.html                Página de fallback
├── _headers _redirects     Configuración Cloudflare
├── css/                    Sistema de diseño
├── js/                     Router, carga, estudio
├── data/                   Índice de cursos + glosario
├── pages/                  Páginas estáticas
├── courses/                20 cursos en 4 segmentos
│   ├── segment-1/   Fundamentos    (5 cursos)
│   ├── segment-2/   Historia       (4 cursos)
│   ├── segment-3/   Sistemática    (6 cursos)
│   └── segment-4/   Aplicada       (5 cursos)
├── assets/                 Logotipo
├── icons/                  Set PWA completo
└── docs/                   Documentación técnica
```

Detalle en [`ARCHITECTURE.md`](docs/ARCHITECTURE.md#4-topología-de-archivos).

---

## Uso local

Como es estático puro, basta abrir `index.html` en cualquier navegador. Para servirlo con un servidor local mínimo:

```bash
# Python (incluido en macOS/Linux y disponible en Windows)
python -m http.server 8000

# Node (si lo tienes)
npx serve .
```

Luego visita `http://localhost:8000`.

---

## Contribuir

Las contribuciones son bienvenidas dentro del marco confesional del proyecto. Lee [`CONTRIBUTING.md`](CONTRIBUTING.md) antes de proponer cambios. En particular:

- Las contribuciones doctrinales deben alinearse con la tradición reformada confesional clásica.
- Las contribuciones técnicas deben respetar los [cuatro principios arquitectónicos](docs/ARCHITECTURE.md#2-principios-arquitectónicos).
- Toda contribución editorial debe pasar la [auditoría del style guide](docs/STYLE-GUIDE-CONTENT.md).

---

## Licencias

Doble licencia explícita:

- **Contenido teológico** (cursos, lecciones, glosario, documentación): [**CC BY-SA 4.0**](LICENSE-CONTENT). Puedes copiarlo, redistribuirlo, traducirlo y adaptarlo, atribuyendo la fuente y manteniendo la misma licencia abierta.
- **Código fuente** (HTML, CSS, JavaScript, herramientas Python): [**MIT**](LICENSE-CODE). Puedes hacer lo que quieras con él.

Ambas licencias preservan el espíritu de gratuidad del proyecto.

---

## Equipo

**Coordinador editorial y arquitectura web**
Hno. Calet Cáceres Vergara — Fundador
[@cicv.94](https://instagram.com/cicv.94)

Estudioso apasionado de la Palabra de Dios, con formación en Administración y Educación. Convencido de que la teología reformada y las nuevas tecnologías pueden converger para llevar instrucción bíblica a toda persona de habla hispana — sin costo, sin barreras, sin fronteras — puestas al servicio de la gloria de Dios.

---

## Cita

Si usas el proyecto académicamente o en publicaciones, considera citarlo así:

```
Cáceres Vergara, C. (2026). Verbum Manet Academy: Seminario reformado en línea.
https://verbummanet.academy
```

---

<div align="center">

*Soli Deo gloria.*

</div>
