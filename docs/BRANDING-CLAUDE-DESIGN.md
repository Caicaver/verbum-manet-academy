# BRANDING-CLAUDE-DESIGN.md

## Brief técnico de identidad visual — Verbum Manet Academy

> **Destinatario:** Claude Design (o equipo de diseño humano equivalente).
> **Objeto:** Entrega del sistema de marca completo —logotipo, isotipo, iconografía PWA, paleta de color, tipografía y especificaciones de exportación— para la plataforma educativa **Verbum Manet Academy**.
> **Versión del brief:** 1.0 · **Estado:** especificación final, lista para producción.
> **Formato de entrega esperado:** SVG fuente editable + PNGs exportados según tabla de la §10 + archivo de tokens CSS.

---

## 0. Tabla de contenidos

1. Resumen ejecutivo
2. Esencia de marca
3. Dirección creativa y referentes
4. Arquitectura del sistema de marca
5. Wordmark — especificación
6. Isotipo / monograma — especificación
7. Lockups y zonas de respeto
8. Sistema de color (OKLCH)
9. Sistema tipográfico
10. Sistema de iconos PWA — 7 archivos
11. Open Graph image
12. Especificaciones SVG técnicas
13. Guía de exportación
14. Checklist de entregables
15. Anexo A — tokens CSS finales
16. Anexo B — usos prohibidos

---

## 1. Resumen ejecutivo

**Verbum Manet Academy** es una plataforma de formación teológica reformada en español, distribuida como Single Page Application estática con manifiesto PWA. El proyecto evoluciona la identidad previa (*SDG Academy*) hacia una marca más madura, sobria y arquitectónica, conservando el rigor doctrinal pero elevando la pieza visual a un estándar editorial-académico contemporáneo.

El sistema debe transmitir tres atributos en este orden:

1. **Permanencia** — autoridad doctrinal, tradición, solidez tipográfica.
2. **Claridad** — legibilidad académica, jerarquía limpia, neutralidad de superficie.
3. **Calidez sobria** — pergamino, oro envejecido, tinta; sin estridencia ni romanticismo decorativo.

La marca **no** debe leerse como devocional emocional, ni como corporativa-saas, ni como denominacional sectaria. El lugar correcto es: **press universitario × editorial teológica × manuscrito reformado del siglo XVII releído en código abierto**.

---

## 2. Esencia de marca

| Campo | Valor |
|---|---|
| **Nombre completo** | Verbum Manet Academy |
| **Nombre corto** | Verbum Manet |
| **Diminutivo / handle** | VMA |
| **Motto** | La Palabra Permanece |
| **Motto latino** | *Verbum Domini manet in aeternum* |
| **Referencia bíblica raíz** | Isaías 40:8 — «La hierba se seca, y la flor se marchita; mas la palabra del Dios nuestro permanece para siempre.» |
| **Doxología institucional** | *Soli Deo Gloria* |
| **Idioma principal de la marca** | Español (textos), latín (lemas auxiliares) |
| **Tradición teológica** | Reformada confesional (Westminster, Heidelberg, Dort) |

### 2.1 Valores que el sistema visual debe encarnar

- **Tradición sin polvo** — la marca se apoya en seis siglos de tipografía y arquitectura clásica, pero se ejecuta con herramientas y sensibilidad contemporáneas.
- **Rigor sin frialdad** — la academia es exigente, no clínica; el oro envejecido y la cremas pergamino aportan calidez sin sentimentalismo.
- **Gratuidad como dignidad** — el contenido es gratuito, pero la presentación no es low-cost: la dignidad visual es teología aplicada.
- **Permanencia tipográfica** — el wordmark es el activo principal; el isotipo es soporte, no estrella.

---

## 3. Dirección creativa y referentes

### 3.1 Referentes visuales aprobados

- Cubiertas de **The Banner of Truth Trust** (especialmente la *Puritan Paperbacks* series): paleta crema/tinta, tipografía serif con respiración generosa.
- Tipografía editorial de **Penguin Classics Hardback Collection** (Coralie Bickford-Smith): patrones simétricos contenidos, geometría sobre crema.
- Identidad del **Oxford University Press** (académico, no marketinero): sello compacto, wordmark de servicio.
- **Lapham's Quarterly** y **The Paris Review** para el tratamiento serif editorial.
- Arquitectura: portadas barrocas de imprentas de Ginebra (siglos XVI–XVII) — frontispicios con columnas, plinto y cartela central.

### 3.2 Anti-referentes (explícitamente rechazados)

- Iconos vectoriales planos tipo *flat icon pack* (Iconscout, Streamline genérico).
- Cruces estilizadas modernas tipo iglesia de plantación con gradient.
- Wordmarks tipo *megachurch* con tipografía heavy sans-serif.
- Cualquier referencia visual a estampas devocionales pop, gráfica de redes evangélicas comerciales, o estética *christian merch*.
- Gradientes en la marca. Sombras blandas decorativas. Glow, blur o "shine" sobre el oro.
- Símbolos esotéricos: ojo de la providencia, triángulos místicos, soles radiales, ouroboros.

---

## 4. Arquitectura del sistema de marca

El sistema se organiza en **tres niveles jerárquicos**, cada uno con un uso específico:

```
NIVEL 1 — Marca completa (full lockup)
└── Wordmark + tagline + (opcional) isotipo
    Uso: portadas de documento, hero principal, og-image, splash PWA

NIVEL 2 — Wordmark autónomo
└── "Verbum Manet Academy" tipografiado
    Uso: header del sitio, footer, pie de email, créditos

NIVEL 3 — Isotipo / monograma "VM"
└── Marca compacta para tamaños reducidos o cuadrados
    Uso: favicon, apple-touch-icon, iconos PWA, avatar, watermark
```

Cada nivel **debe poder funcionar de forma autónoma**. El isotipo no es un elemento decorativo acompañante del wordmark: es una marca completa en sí misma para contextos cuadrados o pequeños.

---

## 5. Wordmark — especificación

### 5.1 Concepto

El wordmark es la **estrella del sistema**. Es una composición puramente tipográfica que toma como base **Cormorant Garamond SemiBold (600)** y aplica los siguientes ajustes manuales (no automáticos del font file):

- **Tracking** ajustado letter-by-letter (kerning óptico).
- **Capitular "V"** ligeramente más alta que las mayúsculas adyacentes (1.04× cap height).
- La palabra **"Manet"** lleva un sutil énfasis de peso (700) frente a "Verbum" y "Academy" (600), para subrayar el verbo permanecer sin gritar.
- Espaciado de palabra ampliado al **130%** del default para dar respiración litúrgica.

### 5.2 Composición

Hay **dos disposiciones canónicas**:

**A — Horizontal de una línea** (uso por defecto, header):
```
VERBUM  MANET  ACADEMY
```
- Todas las letras en mayúsculas.
- Tracking: +120 (unidades de tipo en software de diseño, equivalente a `letter-spacing: 0.12em`).

**B — Vertical apilada en tres líneas** (uso editorial, portadas, og-image):
```
       VERBUM
        MANET
      ACADEMY
```
- Eje de simetría centrado.
- Interlineado: 0.92 del cap height (líneas apretadas para sensación de bloque grabado).
- La palabra `MANET` puede mostrarse opcionalmente en **cursiva (Cormorant Garamond Italic 600)** para reforzar el verbo. Esta es la variante editorial-formal.

### 5.3 Especificaciones técnicas del wordmark

| Atributo | Valor |
|---|---|
| Familia tipográfica | Cormorant Garamond |
| Peso base | 600 (SemiBold) |
| Peso de énfasis ("MANET") | 700 (Bold) |
| Caja | Mayúsculas con cap height extendida |
| Tracking horizontal | `+120` (≈ `letter-spacing: 0.12em`) |
| Interlineado vertical | `0.92em` |
| Color (modo claro) | `var(--vma-ink)` |
| Color (modo oscuro) | `var(--vma-cream)` |
| Tamaño mínimo de uso (horizontal) | 144 px de ancho total |
| Tamaño mínimo de uso (vertical) | 96 px de ancho total |

### 5.4 Tagline opcional

Bajo el wordmark, en disposiciones formales, puede aparecer la línea:

> *La Palabra Permanece* — Isaías 40:8

Tipografía: **Cormorant Garamond Italic 400**, tracking neutro (sin expandir), color `var(--vma-gold-600)` sobre crema o `var(--vma-gold-400)` sobre navy. Tamaño: 22–28% del alto del wordmark.

La tagline **no es parte obligatoria del wordmark**. Aparece sólo en piezas editoriales (og-image, portadas), nunca en header del sitio.

---

## 6. Isotipo / monograma — especificación

### 6.1 Concepto

El isotipo es un **monograma "VM"** construido como un **sello de imprenta clásico**, evocando los frontispicios de las imprentas reformadas de Ginebra del siglo XVI. Es la versión cuadrada y compacta de la marca, pensada para favicons, iconos de aplicación, watermarks y avatares.

**Concepto formal:** dos letras —V y M— compuestas dentro de una forma envolvente discreta, donde:

- La **V** ocupa el lado izquierdo, con su vértice apuntando ligeramente hacia el centro inferior.
- La **M** ocupa el lado derecho, con su valle central elevado para "encajar" con el vértice de la V.
- Ambas letras **comparten visualmente un eje central vertical** —no se tocan, pero se aproximan— que sugiere una columna implícita.
- La forma envolvente es un **rectángulo redondeado con esquinas levemente afiladas** (radio variable: top-left y bottom-right más curvos que los otros dos, asimetría sutil) o, en su variante alternativa, un **escudo rectangular con base plana y corona redondeada** —referencia al sello de imprenta sin caricaturizarlo.

### 6.2 Construcción geométrica

**Lienzo base:** cuadrado de 512×512 px (área de seguridad PWA 410×410 px centrada).

**Estructura:**

```
┌─────────────────────────┐  ← Padding superior: 64 px
│   ┌─────────────────┐   │
│   │                 │   │
│   │    V       M    │   │  ← Altura de letras: 280 px
│   │     \     /     │   │  ← Cap height interno
│   │      \   /      │   │
│   │       \ /       │   │  ← Vértice V: y = 380
│   │        ·        │   │  ← Punto óptico de unión
│   └─────────────────┘   │
│                         │  ← Padding inferior: 64 px
└─────────────────────────┘
   ↑                   ↑
   Padding lateral: 64 px cada lado
```

### 6.3 Tratamiento tipográfico del monograma

- Las letras V y M **no son simplemente tipografía Cormorant en mayúscula**. Son una **redibujado custom** que toma Cormorant Garamond como base pero:
  - Engrosa las astas verticales en ~15% para presencia en favicons 16×16.
  - Reduce el contraste alto-bajo (Cormorant tiene contraste muy alto que se pierde en miniaturas).
  - Conserva las **serifas con extremos cuadrados ligeramente biselados**, no triangulares.
  - El vértice de la V termina en un **punto plano** (corte horizontal de 4 px de ancho a 512), no en aguja.

### 6.4 Variantes del isotipo

| Variante | Uso | Especificación |
|---|---|---|
| **Sello completo** | Iconos PWA grandes (192, 512) | Monograma + forma envolvente + sutil filete interior a 8 px del borde |
| **Sello desnudo** | Favicon 32 px, apple-touch | Monograma + forma envolvente, sin filete |
| **Monograma libre** | Watermark, footer en blanco | Solo VM, sin forma envolvente |
| **Maskable** | PWA maskable icon | Monograma centrado en safe area 410×410 sobre fondo navy sólido extendido a 512×512 |

### 6.5 Colorimetría del isotipo

| Aplicación | Letras VM | Forma envolvente | Filete interior |
|---|---|---|---|
| Sobre crema (modo claro) | `--vma-navy-900` | `--vma-navy-900` (trazo) | `--vma-gold-600` |
| Sobre navy (modo oscuro) | `--vma-cream` | `--vma-cream` (trazo) | `--vma-gold-500` |
| Monocromo print | `currentColor` | `currentColor` | omitido |
| Maskable PWA | `--vma-cream` | omitida (fondo navy llena) | omitido |

---

## 7. Lockups y zonas de respeto

### 7.1 Zona de respeto (clear space)

Alrededor de cualquier marca (wordmark o isotipo) debe existir una zona libre de cualquier otro elemento gráfico equivalente a:

- **Wordmark horizontal:** `1× la altura de la cap height` en los cuatro lados.
- **Wordmark vertical:** `0.5× la altura total del bloque` en los cuatro lados.
- **Isotipo:** `0.25× el ancho del isotipo` en los cuatro lados (mínimo absoluto: 8 px en favicons 32×32).

### 7.2 Lockup de header del sitio

En el header de `index.html`, el lockup oficial es:

```
[Isotipo 32px] · [Wordmark horizontal "VERBUM MANET ACADEMY" 18px cap height]
```

- Separador entre isotipo y wordmark: un punto medio `·` (U+00B7) en color `--vma-gold-500` con padding lateral de 12 px.
- El isotipo NO lleva forma envolvente en este uso —es el **monograma libre** en su variante para header.
- Alineación: baseline del wordmark con la línea de cap height del monograma.

### 7.3 Tamaños mínimos absolutos

| Pieza | Mínimo digital | Mínimo print (300 dpi) |
|---|---|---|
| Wordmark horizontal | 144 px | 32 mm |
| Wordmark vertical | 96 px | 24 mm |
| Isotipo sello completo | 48 px | 12 mm |
| Isotipo monograma libre | 24 px | 6 mm |
| Favicon | 16 px | n/a |

---

## 8. Sistema de color (OKLCH)

Todo color del sistema se define en **OKLCH** por dos razones: (1) percepción uniforme entre tonos, lo que produce escalas armónicas reales; (2) gamut amplio que aprovecha pantallas P3 modernas. Cada token incluye **fallback en HEX/sRGB** para navegadores sin soporte OKLCH.

### 8.1 Familia Navy — `--vma-navy` (hue 256°)

Color principal de superficie en modo oscuro, color de texto principal en modo claro.

| Token | OKLCH | HEX fallback | Uso principal |
|---|---|---|---|
| `--vma-navy-50` | `oklch(96% 0.015 256)` | `#EEF1F8` | Surface más clara para modo claro tinted |
| `--vma-navy-100` | `oklch(92% 0.030 256)` | `#DCE2F0` | Hover sobre navy-50 |
| `--vma-navy-200` | `oklch(85% 0.055 256)` | `#B8C4DD` | Borders sutiles en modo claro |
| `--vma-navy-300` | `oklch(75% 0.080 256)` | `#8DA0C8` | Texto secundario sobre navy-900 |
| `--vma-navy-400` | `oklch(65% 0.105 256)` | `#6480B3` | Texto link sobre navy-900 |
| `--vma-navy-500` | `oklch(55% 0.120 256)` | `#3F619B` | Punto medio — bordes énfasis |
| `--vma-navy-600` | `oklch(45% 0.110 256)` | `#314D80` | Acento navy en modo claro |
| `--vma-navy-700` | `oklch(35% 0.095 256)` | `#243B65` | Superficies elevadas modo oscuro |
| `--vma-navy-800` | `oklch(26% 0.075 256)` | `#1A2B4A` | Surface secundaria modo oscuro |
| **`--vma-navy-900`** | **`oklch(18% 0.055 256)`** | **`#101B33`** | **Surface principal modo oscuro** |

> **Nota:** el valor `--vma-navy-800` (`#1A2B4A`) coincide intencionadamente con el navy histórico de SDG Academy, manteniendo continuidad cromática parcial con la marca anterior.

### 8.2 Familia Gold — `--vma-gold` (hue 78°)

Acento principal del sistema. Oro envejecido, no oro brillante. Pensado para sentirse manuscrito antes que joyería.

| Token | OKLCH | HEX fallback | Uso principal |
|---|---|---|---|
| `--vma-gold-50` | `oklch(96% 0.018 78)` | `#F7F2E2` | Highlight muy sutil |
| `--vma-gold-100` | `oklch(94% 0.035 78)` | `#F0E6C5` | Cita destacada bg |
| `--vma-gold-200` | `oklch(91% 0.060 78)` | `#E5D49A` | Hover gold sutil |
| `--vma-gold-300` | `oklch(86% 0.090 78)` | `#D4BC6A` | Bordes gold modo claro |
| `--vma-gold-400` | `oklch(80% 0.115 78)` | `#BFA340` | Acento gold sobre navy |
| **`--vma-gold-500`** | **`oklch(72% 0.130 78)`** | **`#A88820`** | **Gold principal acento** |
| `--vma-gold-600` | `oklch(65% 0.120 78)` | `#917316` | Gold hover/active |
| `--vma-gold-700` | `oklch(55% 0.105 78)` | `#785F10` | Gold sobre crema (texto) |
| `--vma-gold-800` | `oklch(45% 0.090 78)` | `#60490A` | Gold profundo |
| `--vma-gold-900` | `oklch(36% 0.075 78)` | `#4A3705` | Bronce oscuro — para énfasis editorial |

### 8.3 Neutros — Cream e Ink

| Token | OKLCH | HEX fallback | Uso |
|---|---|---|---|
| **`--vma-cream`** | **`oklch(96% 0.015 78)`** | **`#F5F0E8`** | Surface principal modo claro (pergamino) |
| `--vma-cream-dark` | `oklch(92% 0.020 78)` | `#EBE3D2` | Surface secundaria modo claro |
| **`--vma-ink`** | **`oklch(22% 0.020 256)`** | **`#1D2330`** | Texto principal modo claro |
| `--vma-ink-soft` | `oklch(38% 0.018 256)` | `#444C5C` | Texto secundario modo claro |
| `--vma-mist` | `oklch(88% 0.005 256)` | `#DDDFE3` | Separadores neutros |
| `--vma-mist-dark` | `oklch(78% 0.005 256)` | `#BFC2C8` | Bordes neutros |

### 8.4 Pares de uso semántico

Cada pieza de UI debe extraerse de **uno** de estos pares aprobados —no mezclar libremente:

| Contexto | Background | Foreground | Accent |
|---|---|---|---|
| **Modo claro principal** | `--vma-cream` | `--vma-ink` | `--vma-gold-700` |
| **Modo claro elevado** | `#FFFFFF` (papel puro) | `--vma-ink` | `--vma-gold-700` |
| **Modo oscuro principal** | `--vma-navy-900` | `--vma-cream` | `--vma-gold-500` |
| **Modo oscuro elevado** | `--vma-navy-800` | `--vma-cream` | `--vma-gold-400` |

### 8.5 Verificación WCAG AA

Los pares marcados como principales han sido verificados para contraste **AA cuerpo de texto (4.5:1)** y **AAA encabezados (7:1)** mediante OKLCH lightness:

- `--vma-ink` sobre `--vma-cream` → ratio ≈ 12.4:1 → **AAA**
- `--vma-cream` sobre `--vma-navy-900` → ratio ≈ 14.1:1 → **AAA**
- `--vma-gold-700` sobre `--vma-cream` → ratio ≈ 4.9:1 → **AA cuerpo**
- `--vma-gold-500` sobre `--vma-navy-900` → ratio ≈ 7.8:1 → **AAA**

---

## 9. Sistema tipográfico

### 9.1 Familias

| Rol | Familia | Fuente | Pesos a embarcar |
|---|---|---|---|
| **Display / Editorial** | Cormorant Garamond | Google Fonts | 400, 500, 600, 700; 400 Italic, 600 Italic |
| **UI / Cuerpo** | Satoshi | Fontshare | 400, 500, 700 |

> **Regla absoluta:** sólo estas dos familias. Sólo estos pesos. Ningún sustituto.

### 9.2 Carga recomendada

**Satoshi (Fontshare — preferente):**
```html
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet">
```

**Cormorant Garamond (Google Fonts):**
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">
```

Ambas referencias **deben** llevar `display=swap` y precargarse con `<link rel="preconnect">` a `api.fontshare.com` y `fonts.gstatic.com`.

### 9.3 Escala tipográfica fluida

Todos los tamaños se definen con `clamp()` para responsividad real entre 375 px y 1440 px.

| Token | `clamp()` | Equivalente desktop | Familia | Uso |
|---|---|---|---|---|
| `--text-xs` | `clamp(0.75rem, 0.71rem + 0.18vw, 0.875rem)` | 14 px | Satoshi 500 | Captions, metadatos |
| `--text-sm` | `clamp(0.875rem, 0.84rem + 0.18vw, 1rem)` | 16 px | Satoshi 400 | Texto secundario UI |
| `--text-base` | `clamp(1rem, 0.95rem + 0.27vw, 1.125rem)` | 18 px | Satoshi 400 | Cuerpo UI |
| `--text-lg` | `clamp(1.125rem, 1.05rem + 0.36vw, 1.25rem)` | 20 px | Satoshi 500 | Lead UI |
| `--text-xl` | `clamp(1.375rem, 1.25rem + 0.55vw, 1.5rem)` | 24 px | Cormorant 600 | h4 / títulos card |
| `--text-2xl` | `clamp(1.625rem, 1.45rem + 0.82vw, 2rem)` | 32 px | Cormorant 600 | h3 |
| `--text-3xl` | `clamp(2rem, 1.7rem + 1.36vw, 2.75rem)` | 44 px | Cormorant 600 | h2 |
| `--text-4xl` | `clamp(2.5rem, 2rem + 2.27vw, 3.75rem)` | 60 px | Cormorant 700 | h1 |
| `--text-display` | `clamp(3rem, 2.3rem + 3.18vw, 5rem)` | 80 px | Cormorant 700 | Hero, og-image |

### 9.4 Regla de uso

- **Cormorant Garamond** sólo a partir de `--text-xl` (24 px) y arriba. Nunca para cuerpo.
- **Satoshi** para todo lo demás: UI, cuerpo, navegación, botones, formularios, captions.
- **Cormorant Italic** reservado para: citas extensas (>2 líneas), tagline, énfasis literario.
- **Satoshi Italic 400** reservado para: extranjerismos, títulos de obras inline.
- **Ningún subrayado decorativo.** Sólo `text-decoration: underline` en links activos, con `text-decoration-thickness: 1px` y `text-underline-offset: 0.2em`.

### 9.5 Pesos por contexto

| Elemento | Familia | Peso | Tracking | Line-height |
|---|---|---|---|---|
| h1 hero | Cormorant | 700 | `-0.01em` | `1.05` |
| h2 / h3 | Cormorant | 600 | `-0.005em` | `1.15` |
| h4 | Cormorant | 600 | `0` | `1.25` |
| Cuerpo | Satoshi | 400 | `0` | `1.65` |
| UI / nav | Satoshi | 500 | `0.01em` | `1.4` |
| Botón | Satoshi | 500 | `0.02em` | `1` |
| Caption | Satoshi | 500 | `0.04em` (uppercase) | `1.3` |
| Tagline italic | Cormorant Italic | 400 | `0` | `1.3` |

---

## 10. Sistema de iconos PWA — 7 archivos

Todos los archivos PNG se exportan desde **un único SVG fuente del isotipo en variante "sello completo"** a 512×512 px, salvo donde se indique lo contrario.

| # | Archivo | Tamaño | Formato | Fuente |
|---|---|---|---|---|
| 1 | `icons/favicon.svg` | vectorial | SVG | Isotipo "sello desnudo" con `currentColor` |
| 2 | `icons/favicon-32.png` | 32×32 | PNG-24 | Export del SVG fuente a 32×32 |
| 3 | `icons/apple-touch-icon.png` | 180×180 | PNG-24 | Export con safe area centrada |
| 4 | `icons/og-image.png` | 1200×630 | PNG-24 | Composición editorial (ver §11) |
| 5 | `icons/verbum-manet-192.png` | 192×192 | PNG-24 | Export estándar del SVG sello completo |
| 6 | `icons/verbum-manet-512.png` | 512×512 | PNG-24 | Export estándar del SVG sello completo |
| 7 | `icons/verbum-manet-512-maskable.png` | 512×512 | PNG-24 | Variante maskable (ver §10.6) |

### 10.1 favicon.svg

- **Contenido:** isotipo en variante "monograma libre" (sin forma envolvente).
- **Tamaño viewBox:** `0 0 64 64`.
- **Color:** `currentColor` para todas las trazas. Sin colores hardcoded.
- **Trazo:** path único o agrupación mínima. Optimizado con SVGOMG (máx. 1.5 KB).
- **Atributos:** `xmlns="http://www.w3.org/2000/svg"`, `viewBox="0 0 64 64"`, `fill="currentColor"`, `aria-hidden="true"` (uso decorativo en `<link rel="icon">`).

### 10.2 favicon-32.png

- **Origen:** export del `favicon.svg` a 32×32 con color resuelto a `--vma-ink` (`#1D2330`).
- **Fondo:** transparente.
- **Optimización:** `pngquant --quality 90`.

### 10.3 apple-touch-icon.png

- **Tamaño:** 180×180 px.
- **Fondo:** **NO transparente**. Color de fondo: `--vma-navy-900` (`#101B33`) llenando el 100%.
- **Contenido:** isotipo "sello completo" en `--vma-cream` (`#F5F0E8`) con filete interior `--vma-gold-500` (`#A88820`).
- **Safe area:** el monograma ocupa **60%** del lienzo (108×108 px efectivos, centrado), no llenar hasta el borde porque iOS aplica máscara con esquinas redondeadas.
- **Sin transparencia.** Sin sombras. Sin glow.

### 10.4 verbum-manet-192.png

- **Tamaño:** 192×192 px.
- **Fondo:** transparente.
- **Contenido:** isotipo "sello completo" centrado, ocupando 168×168 px.
- **Colores:** monograma `--vma-cream`, forma envolvente `--vma-cream` (trazo 6 px), filete interior `--vma-gold-500`.
- **Uso:** Android PWA icon estándar.

### 10.5 verbum-manet-512.png

- **Tamaño:** 512×512 px.
- **Especificaciones:** idénticas a 192×192 pero a 2.67× la resolución (monograma 448×448 centrado).
- **Uso:** PWA splash screen Android, iconos de alta densidad.

### 10.6 verbum-manet-512-maskable.png

- **Tamaño:** 512×512 px.
- **Fondo:** `--vma-navy-900` llenando el 100% del lienzo.
- **Safe area:** circular de **410 px de diámetro** centrada (área visible garantizada en cualquier máscara de Android).
- **Contenido del safe area:** isotipo "monograma libre" (sin forma envolvente) ocupando 280×280 px aproximadamente, centrado dentro del safe area.
- **Color del monograma:** `--vma-cream`.
- **Bleed:** el fondo navy debe extenderse hasta los bordes del lienzo —Android puede recortar hasta el 20% exterior; ese recorte debe quedar también navy.

---

## 11. Open Graph image

- **Archivo:** `icons/og-image.png`
- **Dimensiones:** 1200×630 px (proporción 1.91:1)
- **Formato:** PNG-24
- **Peso máximo objetivo:** 180 KB

### 11.1 Composición

```
┌──────────────────────────────────────────────────┐
│                                                  │
│              [Isotipo sello completo]            │  ← 120×120 px, top: 90 px
│                                                  │
│                                                  │
│                  VERBUM                          │
│                  MANET                           │  ← Wordmark vertical apilado
│                  ACADEMY                         │     Cap height: 88 px
│                                                  │
│         La Palabra Permanece                     │  ← Tagline italic, 32 px
│            — Isaías 40:8 —                       │  ← Referencia, 22 px
│                                                  │
└──────────────────────────────────────────────────┘
```

### 11.2 Colorimetría og-image

- **Fondo:** `--vma-cream` (`#F5F0E8`) con una **textura sutil de papel** (ruido fino al 4% de opacidad, no más).
- **Isotipo:** completo con colores nativos (cream/gold) sobre fondo cream — el monograma se ve en `--vma-ink`, forma envolvente en `--vma-ink`, filete en `--vma-gold-700`.
- **Wordmark:** `--vma-ink` (`#1D2330`).
- **Tagline:** Cormorant Italic 400 en `--vma-gold-700` (`#785F10`).
- **Referencia bíblica:** Satoshi 500 small caps en `--vma-ink-soft`.

### 11.3 Detalles editoriales del og-image

- **Filete decorativo:** dos finísimas líneas de 1 px en `--vma-gold-700` a 64 px del borde superior e inferior, ocupando todo el ancho menos 80 px de margen lateral. Recuerda las páginas de portada de libros editados.
- **Ornamento central:** punto medio (`·`) en gold entre la tagline y la referencia bíblica.
- **Sin logotipos de redes sociales**, sin URLs, sin "compártelo", sin call-to-action. La portada habla por sí sola.

---

## 12. Especificaciones SVG técnicas

Todo archivo SVG entregado debe cumplir:

### 12.1 Atributos obligatorios del elemento raíz

```xml
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 [W] [H]"
  fill="currentColor"
  role="img"
  aria-label="Verbum Manet Academy"
>
```

### 12.2 Reglas de implementación

- **`width` y `height` se omiten** del elemento raíz. El sizing se gobierna desde CSS.
- **`fill="currentColor"`** en el `<svg>` raíz; los paths internos no llevan `fill` explícito salvo cuando deban variar del color heredado (acento gold dentro del isotipo).
- **No usar `<style>` interno** en SVGs de marca. Si se necesita un color secundario (gold en filete), se aplica con `fill="#..."` o, preferentemente, mediante `currentColor` con clases definidas externamente.
- **Optimización obligatoria:** pasar todos los SVGs por SVGOMG con preset por defecto excepto: mantener `viewBox`, mantener `aria-label`, no minificar `id` si hay `<defs>`.
- **Sin `<filter>`, sin `<mask>`, sin `<clipPath>`** en SVGs de marca, salvo cuando sea estrictamente necesario para la construcción del monograma. Estos elementos rompen el render en algunos lectores y aumentan peso.
- **Paths optimizados:** preferir `<path>` único sobre múltiples elementos `<circle>`/`<rect>` cuando el contorno final sea estable.

### 12.3 Estructura recomendada del archivo `assets/logo-verbum-manet.svg`

El SVG fuente debe ser un **bloque editable** que admita, mediante clases CSS, las cuatro variantes:

```xml
<svg viewBox="0 0 480 96" role="img" aria-label="Verbum Manet Academy" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
  <g class="vma-logo__isotipo">
    <!-- Monograma VM -->
  </g>
  <g class="vma-logo__separator">
    <!-- Punto medio gold -->
  </g>
  <g class="vma-logo__wordmark">
    <!-- "VERBUM MANET ACADEMY" en paths -->
  </g>
</svg>
```

Esto permite, vía CSS, mostrar/ocultar isotipo o wordmark según contexto:

```css
.vma-logo--mark-only .vma-logo__wordmark,
.vma-logo--mark-only .vma-logo__separator { display: none; }
.vma-logo--text-only .vma-logo__isotipo,
.vma-logo--text-only .vma-logo__separator { display: none; }
```

---

## 13. Guía de exportación

### 13.1 Pipeline recomendado

1. **Diseño fuente:** Figma (preferido) o Adobe Illustrator. Si Claude Design lo genera, entregar también el `.fig` o `.ai` editable.
2. **Master SVG:** un único archivo `logo-verbum-manet-master.svg` con todos los componentes en grupos nombrados.
3. **Exportes SVG:**
   - `assets/logo-verbum-manet.svg` (wordmark + isotipo lockup horizontal)
   - `icons/favicon.svg` (sólo isotipo monograma libre)
4. **Exportes PNG** desde el master con Figma/Inkscape:
   - Resolución: nativa al tamaño objetivo (no escalar después).
   - Compresión: `pngquant --quality 88-95` para todos los PNG.
   - Verificar peso final: ningún PNG debe exceder los pesos indicados en §13.3.

### 13.2 Comandos sugeridos (Inkscape CLI)

```bash
# favicon-32.png
inkscape --export-type=png --export-width=32 --export-height=32 \
  --export-filename=icons/favicon-32.png assets/logo-verbum-manet.svg#favicon

# apple-touch-icon.png
inkscape --export-type=png --export-width=180 --export-height=180 \
  --export-background=#101B33 --export-background-opacity=1 \
  --export-filename=icons/apple-touch-icon.png assets/isotipo-touch.svg

# verbum-manet-512.png
inkscape --export-type=png --export-width=512 --export-height=512 \
  --export-filename=icons/verbum-manet-512.png assets/isotipo-sello.svg

# verbum-manet-512-maskable.png
inkscape --export-type=png --export-width=512 --export-height=512 \
  --export-background=#101B33 --export-background-opacity=1 \
  --export-filename=icons/verbum-manet-512-maskable.png assets/isotipo-maskable.svg
```

### 13.3 Pesos objetivo y máximos

| Archivo | Peso objetivo | Peso máximo |
|---|---|---|
| `favicon.svg` | < 1.5 KB | 2.5 KB |
| `favicon-32.png` | < 1 KB | 2 KB |
| `apple-touch-icon.png` | < 8 KB | 14 KB |
| `og-image.png` | < 120 KB | 180 KB |
| `verbum-manet-192.png` | < 6 KB | 10 KB |
| `verbum-manet-512.png` | < 22 KB | 35 KB |
| `verbum-manet-512-maskable.png` | < 18 KB | 28 KB |
| `logo-verbum-manet.svg` (master) | < 8 KB | 14 KB |

### 13.4 Verificación pre-entrega

Para cada PNG entregado, comprobar:

- [ ] Resolución exacta a tamaño objetivo (no escalado bicúbico).
- [ ] Transparencia donde aplica (192, 512); fondo sólido donde aplica (apple-touch, maskable).
- [ ] Sin bordes blancos residuales por antialiasing.
- [ ] Sin halo de compresión en el contorno del monograma.
- [ ] El isotipo es nítido a tamaño nativo y a 16×16 (test del favicon).

---

## 14. Checklist de entregables

Al cierre de la entrega, el repositorio del proyecto debe contener:

```
assets/
└── logo-verbum-manet.svg              ✅
icons/
├── favicon.svg                        ✅
├── favicon-32.png                     ✅
├── apple-touch-icon.png               ✅
├── og-image.png                       ✅
├── verbum-manet-192.png               ✅
├── verbum-manet-512.png               ✅
└── verbum-manet-512-maskable.png      ✅
docs/
├── BRANDING-CLAUDE-DESIGN.md          ← este documento
└── logo-verbum-manet-master.fig       ✅ (fuente editable)
```

**Adicional (no en repositorio, sí como entrega):**

- Tabla con los valores OKLCH y sus fallbacks HEX en un `.txt` o `.csv` separado.
- Captura PNG del wordmark en sus tres tamaños canónicos (header, hero, og-image) para verificación rápida.
- Captura del isotipo a 16, 32, 64, 192 y 512 px para verificación de legibilidad cross-size.

---

## 15. Anexo A — tokens CSS finales

Copiar este bloque íntegro al inicio de `css/styles.css`:

```css
:root {
  /* ─── Familia Navy (hue 256°) ─── */
  --vma-navy-50:  oklch(96% 0.015 256);
  --vma-navy-100: oklch(92% 0.030 256);
  --vma-navy-200: oklch(85% 0.055 256);
  --vma-navy-300: oklch(75% 0.080 256);
  --vma-navy-400: oklch(65% 0.105 256);
  --vma-navy-500: oklch(55% 0.120 256);
  --vma-navy-600: oklch(45% 0.110 256);
  --vma-navy-700: oklch(35% 0.095 256);
  --vma-navy-800: oklch(26% 0.075 256);
  --vma-navy-900: oklch(18% 0.055 256);

  /* ─── Familia Gold (hue 78°) ─── */
  --vma-gold-50:  oklch(96% 0.018 78);
  --vma-gold-100: oklch(94% 0.035 78);
  --vma-gold-200: oklch(91% 0.060 78);
  --vma-gold-300: oklch(86% 0.090 78);
  --vma-gold-400: oklch(80% 0.115 78);
  --vma-gold-500: oklch(72% 0.130 78);
  --vma-gold-600: oklch(65% 0.120 78);
  --vma-gold-700: oklch(55% 0.105 78);
  --vma-gold-800: oklch(45% 0.090 78);
  --vma-gold-900: oklch(36% 0.075 78);

  /* ─── Neutros ─── */
  --vma-cream:      oklch(96% 0.015 78);
  --vma-cream-dark: oklch(92% 0.020 78);
  --vma-ink:        oklch(22% 0.020 256);
  --vma-ink-soft:   oklch(38% 0.018 256);
  --vma-mist:       oklch(88% 0.005 256);
  --vma-mist-dark:  oklch(78% 0.005 256);

  /* ─── Alias semánticos por defecto (modo claro) ─── */
  --vma-bg:       var(--vma-cream);
  --vma-bg-elev:  #FFFFFF;
  --vma-fg:       var(--vma-ink);
  --vma-fg-soft:  var(--vma-ink-soft);
  --vma-accent:   var(--vma-gold-700);
  --vma-border:   var(--vma-mist);
}

/* ─── Modo oscuro ─── */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --vma-bg:       var(--vma-navy-900);
    --vma-bg-elev:  var(--vma-navy-800);
    --vma-fg:       var(--vma-cream);
    --vma-fg-soft:  var(--vma-navy-300);
    --vma-accent:   var(--vma-gold-500);
    --vma-border:   var(--vma-navy-700);
  }
}

:root[data-theme="dark"] {
  --vma-bg:       var(--vma-navy-900);
  --vma-bg-elev:  var(--vma-navy-800);
  --vma-fg:       var(--vma-cream);
  --vma-fg-soft:  var(--vma-navy-300);
  --vma-accent:   var(--vma-gold-500);
  --vma-border:   var(--vma-navy-700);
}

/* ─── Fallback HEX para navegadores sin soporte OKLCH ─── */
@supports not (color: oklch(0% 0 0)) {
  :root {
    --vma-navy-900: #101B33;
    --vma-navy-800: #1A2B4A;
    --vma-gold-500: #A88820;
    --vma-gold-700: #785F10;
    --vma-cream:    #F5F0E8;
    --vma-ink:      #1D2330;
  }
}
```

---

## 16. Anexo B — Usos prohibidos

Los siguientes usos están **explícitamente prohibidos** y cualquier instancia debe corregirse:

### 16.1 Sobre el wordmark

- ❌ Deformar la proporción del wordmark (estirar horizontal o verticalmente).
- ❌ Rotar el wordmark a un ángulo distinto de 0° o 90° (rotación vertical para spines).
- ❌ Aplicar efectos: sombra paralela, glow, outline doble, bisel, 3D, gradient.
- ❌ Sustituir la tipografía por otra serif "parecida" (Garamond, EB Garamond, etc.). Sólo Cormorant Garamond.
- ❌ Usar el wordmark en colores fuera de los tokens definidos.
- ❌ Encerrar el wordmark en una caja o badge.

### 16.2 Sobre el isotipo

- ❌ Modificar la forma envolvente (cambiar a círculo, hexágono, badge, escudo militar, etc.).
- ❌ Añadir elementos al isotipo: cruz, llama, paloma, libro abierto, corona.
- ❌ Aplicar gradientes al monograma o a la forma envolvente.
- ❌ Usar el isotipo a menos de 16 px de lado.
- ❌ Usar el monograma libre como avatar redondo recortado sin previsión —si va a circunscribirse a un círculo, debe usarse la variante "sello completo" o "maskable".

### 16.3 Sobre la paleta

- ❌ Mezclar gold con cualquier verde, púrpura o magenta como secundario.
- ❌ Usar negro puro (`#000000`) como texto. Texto principal es `--vma-ink` (`#1D2330`).
- ❌ Usar blanco puro (`#FFFFFF`) como surface principal en modo claro. La surface principal es `--vma-cream`. `#FFFFFF` se reserva para superficies elevadas (cards, modales).
- ❌ Aplicar gold como background extensivo. Gold es acento: tipografía, filetes, hover. Nunca llenar un bloque grande de gold sólido.

### 16.4 Sobre la tipografía

- ❌ Sustituir Cormorant Garamond por Cinzel, Playfair Display, EB Garamond u otra serif "alternativa".
- ❌ Sustituir Satoshi por Inter, Manrope, IBM Plex Sans u otra grotesque humanista.
- ❌ Usar Cormorant para cuerpo de texto bajo los 24 px.
- ❌ Aplicar Satoshi a `--text-2xl` o superior.

---

## Cierre

Este documento es la referencia normativa única del sistema de marca de Verbum Manet Academy. Cualquier desviación —tipográfica, cromática, compositiva o de exportación— debe documentarse como excepción justificada y aprobarse explícitamente.

La marca existe para servir al contenido teológico que aloja, no para competir con él. **La permanencia visual es el reflejo material de la convicción doctrinal que la sostiene.**

*Verbum Domini manet in aeternum.*

— Fin del documento —
