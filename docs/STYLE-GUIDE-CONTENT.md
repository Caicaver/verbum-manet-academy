# STYLE-GUIDE-CONTENT.md

## Guía editorial de contenido — Verbum Manet Academy

> **Objeto:** normar la redacción, ortotipografía, citación y marcado del contenido académico de la plataforma, de modo que los 20 cursos —escritos en distintas sesiones y posiblemente por distintas manos— mantengan una sola voz, una sola convención y un solo nivel de rigor.
>
> **Alcance:** todo texto visible al usuario en `pages/*.html`, `courses/segment-N/*.html`, `data/courses-index.js` (campos `title`, `description`), `data/glossary.js`, `index.html` (meta, footer), y mensajes de UI generados por `js/*.js`.
>
> **Versión:** 1.1 · **Estado:** normativo · **Última revisión:** 16 de mayo de 2026.
>
> **Cambios desde v1.0:** ajuste retrospectivo para alinear la guía con el estándar emergente del cuerpo de 20 cursos ya producido. Cinco correcciones: (1) terminología canónica «**Dimensión eléntica**» con tilde aguda (no «elenctica») en §10, §19 y aria-labels; (2) rango de longitud por sección de `expandedContent` elevado a 350–500 palabras, alineado con la densidad real del corpus; (3) incorporación del **cierre pastoral latino** como elemento institucional fijo en §17.3 y autorización explícita en §2 y §18; (4) capitalización «**segundo término en minúscula**» en los nombres de las cinco vías (estándar emergente de los cursos); (5) reconocimiento de la **estructura de cinco vías como sistema cerrado** del corpus existente, no como guía generativa.

---

## 0. Índice

1. Principios rectores (incl. §1.1 naturaleza retrospectiva)
2. Voz, tono y persona narrativa (incl. §2.4 autorización del cierre latino)
3. Convenciones de citas bíblicas
4. Ortotipografía castellana
5. Mayúsculas: política reformada
6. Cursivas, negritas y comillas
7. Términos técnicos y extranjerismos
8. Citas largas y referencias patrísticas
9. Tipografía aplicada (clases CSS y `<em>`/`<strong>`)
10. Estructura canónica de cada lección — las cinco vías (incl. §10.2 capitalización y §10.4 cierre latino pastoral)
11. Marcado HTML semántico
12. Glosario: formato de entradas
13. Bibliografía y referencias bibliográficas
14. Accesibilidad textual (a11y de contenido)
15. Internacionalización mínima y nombres propios
16. Numeración, fechas, cifras y unidades
17. Estilo de microcopia de UI (incl. §17.4 repertorio de cierres latinos)
18. Errores comunes a evitar
19. Apéndice — modelo de lección completa (con marcado `ol.vias`)
20. Apéndice — diccionario de abreviaturas

---

## 1. Principios rectores

Tres principios gobiernan toda decisión editorial. Cuando esta guía calle, resuelve por jerarquía:

1. **Fidelidad doctrinal antes que elegancia estilística.** Si una construcción más bella sacrifica precisión teológica, se sacrifica la construcción. La belleza es servidora de la verdad, no al revés.
2. **Claridad antes que erudición.** El lector imaginado es un creyente serio sin formación seminarista previa. Cada término técnico se introduce, se traduce y se ancla en su uso bíblico antes de presuponerse.
3. **Tradición reformada antes que neutralidad académica.** Verbum Manet no es un seminario interconfesional: es una academia confesionalmente reformada. La guía editorial refleja convicciones, no las disimula. Eso no autoriza estridencia: autoriza claridad de posición.

> Regla práctica derivada: ante dos opciones equivalentes, escoge la más legible para un lector de habla hispana sin estudios formales en teología, sin perder el rigor que un graduado de seminario esperaría encontrar.

### 1.1 Naturaleza retrospectiva de esta guía

Esta guía **no es una norma generativa ex nihilo**. Es la codificación explícita de un estándar editorial que ya emergió durante la producción de los 20 cursos del proyecto (~135 lecciones, ~675 vías pedagógicas, ~1 MB de contenido teológico). Su valor es triple:

1. **Documentar lo decidido implícitamente** durante la producción del corpus, para que las decisiones no se pierdan entre sesiones.
2. **Permitir auditoría sistemática** del corpus existente contra norma escrita, detectando inconsistencias menores que se hayan filtrado.
3. **Guiar producción futura** —correcciones, expansiones, contribuciones externas, regeneraciones puntuales— de modo que el resultado sea indistinguible en estilo del corpus consolidado.

Cuando esta guía discrepa del corpus existente en un detalle, **el corpus existente prevalece** y la guía debe corregirse al detectarlo. Cuando esta guía añade reglas no observables todavía en el corpus (por ejemplo, atributo `lang` sistemático en extranjerismos), **la guía orienta** y las correcciones se aplican incrementalmente al corpus al revisarse cada archivo.

---

## 2. Voz, tono y persona narrativa

### 2.1 Persona

La plataforma habla en **tercera persona impersonal** o, cuando la pedagogía lo exige, en **segunda persona singular respetuosa** dirigida al estudiante. **Nunca primera persona del autor.** El contenido no es un blog de opiniones; es un texto académico.

| Persona | Cuándo se usa | Ejemplo |
|---|---|---|
| 3.ª impersonal (default) | Exposición doctrinal, definiciones, análisis | «La justificación es el acto forense por el cual Dios declara…» |
| 2.ª singular pedagógica | Actividades, preguntas de reflexión, instrucciones | «Lee Romanos 5:1–11 y subraya los verbos en tiempo pasado.» |
| 1.ª plural inclusiva (limitada) | Doxología, aplicación catequética | «Confesamos con la Iglesia de todos los tiempos que…» |
| 1.ª singular del autor | **Nunca.** | ~~«Yo creo que Calvino…»~~ |

### 2.2 Tono

- **Sobrio, no solemne.** El registro es académico-eclesial: serio sin pompa, reverente sin formalismo helado.
- **Firme, no polémico.** Las posiciones reformadas se afirman con convicción; las posiciones contrarias se exponen con justicia antes de evaluarse. Cero sarcasmo, cero descalificación personal.
- **Pastoral en la aplicación.** Las secciones doxológicas y catequéticas adoptan un tono más cálido —el del pastor que explica al feligrés—, pero sin pasar a sentimentalismo.

### 2.3 Prohibiciones de tono

- **No uses interjecciones devocionales** («¡Aleluya!», «¡Qué hermoso!», «Gloria a Dios»). La doxología se construye con sustantivos teológicos, no con exclamaciones.
- **No te dirijas al lector como “hermano” o “querido lector”.** El registro académico exige distancia respetuosa.
- **No uses emojis ni símbolos decorativos** (✝, 📖, 🙏) en texto académico. Reservados para microcopia de UI, y sólo cuando la guía lo autorice explícitamente.
- **No utilices fórmulas de cierre devocionales contemporáneas** («Que Dios te bendiga», «en Cristo,», «un abrazo en Cristo»). El texto académico cierra con su última oración doctrinal y punto.

### 2.4 Sí está autorizado: el cierre latino pastoral

A diferencia de las fórmulas devocionales contemporáneas prohibidas arriba, **las expresiones latinas pastorales** —*Soli Deo gloria*, *Coram Deo*, *Solus Christus*, *Verbum Domini manet in aeternum*, etc.— **sí son parte de la identidad editorial del proyecto** y deben usarse con liberalidad medida al cierre de la vía doxológica y como sello final de cada curso completo.

Razón de la asimetría: las fórmulas latinas pertenecen a la tradición confesional reformada y al lenguaje teológico clásico de la Iglesia universal. Las fórmulas devocionales contemporáneas pertenecen al registro epistolar-cristiano moderno, que es un registro distinto e inadecuado al contexto académico.

Para repertorio completo, marcado y reglas de uso, ver §10.4 (regla doctrinal) y §17.4 (microcopia institucional).

---

## 3. Convenciones de citas bíblicas

### 3.1 Versión por defecto: sistema mixto

| Contexto | Versión |
|---|---|
| Citas integradas en el cuerpo del texto | **Reina-Valera 1960 (RVR60)** |
| Citas dentro de la sección de **exégesis** (`Perspectiva de Teología Bíblica`) | **La Biblia de las Américas (LBLA)** |
| Memorización, catequesis, doxología | **RVR60** |
| Comparación textual o análisis del original | **LBLA + griego/hebreo entre paréntesis** |

> Cuando una cita aparezca en una sección de exégesis pero también en otra sección de la misma lección, **prima la versión de la sección donde aparece**, no la primera versión que se usó en la lección.

### 3.2 Indicación obligatoria de versión

Cuando se mezclan versiones en una misma lección, **toda** cita debe llevar la versión entre paréntesis al final, separada por una coma:

> *«Porque por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios» (Ef 2:8, RVR60).*

> *«Porque por gracia ustedes han sido salvados por medio de la fe, y esto no procede de ustedes, sino que es don de Dios» (Ef 2:8, LBLA).*

Cuando una lección use **una sola versión** de principio a fin, basta declararla una vez en una nota inicial:

> *Salvo indicación contraria, todas las citas de esta lección provienen de la Reina-Valera 1960.*

### 3.3 Abreviaturas de libros bíblicos

Usa siempre las **abreviaturas estándar de la Sociedad Bíblica Iberoamericana**, sin punto final y con mayúscula inicial (excepto los libros con prefijo numérico):

| Libro | Abreviatura | Libro | Abreviatura |
|---|---|---|---|
| Génesis | Gn | Mateo | Mt |
| Éxodo | Éx | Marcos | Mr |
| Levítico | Lv | Lucas | Lc |
| Números | Nm | Juan | Jn |
| Deuteronomio | Dt | Hechos | Hch |
| Josué | Jos | Romanos | Ro |
| Salmos | Sal | 1 Corintios | 1 Co |
| Proverbios | Pr | Gálatas | Gl |
| Isaías | Is | Efesios | Ef |
| Jeremías | Jr | Filipenses | Fil |
| Ezequiel | Ez | Colosenses | Col |
| Daniel | Dn | 1 Tesalonicenses | 1 Ts |
| Oseas | Os | 1 Timoteo | 1 Ti |
| Habacuc | Hab | 2 Timoteo | 2 Ti |
| Zacarías | Zac | Tito | Tit |
| Malaquías | Mal | Hebreos | He |
| | | Santiago | Stg |
| | | 1 Pedro | 1 P |
| | | 1 Juan | 1 Jn |
| | | Apocalipsis | Ap |

> El listado completo va en el `Apéndice — diccionario de abreviaturas` (§20).

### 3.4 Formato de referencia

| Tipo | Formato | Ejemplo |
|---|---|---|
| Versículo único | `Libro Cap:Vers` | Jn 3:16 |
| Rango en mismo capítulo | `Libro Cap:V1–V2` | Ro 3:21–26 |
| Rango entre capítulos | `Libro Cap1:V1—Cap2:V2` | Ef 1:3—2:10 |
| Múltiples versículos no contiguos | `Libro Cap:V1, V3, V5–V7` | Sal 119:1, 9, 105–112 |
| Múltiples libros | `Lib1 Cap:V; Lib2 Cap:V` | Jn 1:1; Col 1:15–17; He 1:1–3 |

**Uso obligatorio del guion largo en rangos:** `–` (U+2013, en dash), no `-` (hyphen-minus). Para rangos entre capítulos, **raya** `—` (U+2014, em dash).

### 3.5 Cita integrada vs. cita destacada

**Cita corta integrada en el párrafo** (1–2 líneas): entre comillas latinas, con la referencia entre paréntesis al final.

> Como afirma Pablo, «la fe es por el oír, y el oír por la palabra de Dios» (Ro 10:17, RVR60), y por eso la predicación expositiva ocupa el centro del culto reformado.

**Cita destacada en bloque** (3 líneas o más, o cuando se quiera dar peso retórico): usa `<blockquote>` con marcado específico:

```html
<blockquote class="vma-quote vma-quote--scripture" cite="Isaías 40:8">
  <p>«La hierba se seca, y la flor se marchita; mas la palabra del Dios nuestro permanece para siempre».</p>
  <footer>— <cite>Isaías 40:8</cite>, RVR60</footer>
</blockquote>
```

### 3.6 Tetragrámaton y nombres divinos

| Forma | Cuándo se usa |
|---|---|
| **YHWH** (mayúsculas, sin vocalizar) | Análisis textual del AT, exégesis del hebreo, exposición lingüística |
| **Jehová** | Cita textual de RVR60 (RVR60 traduce así el tetragrámaton); jamás cambies la cita |
| **Señor** (en versalita: `Señor`) | Cita textual de LBLA o cuando expongas la convención septuagintal griega (κύριος) |
| **el Señor** | Referencia general en cuerpo de texto fuera de cita |
| **Dios** | Default para referencia al Dios trino sin especificar Persona |

**Importante:** nunca «corrijas» Jehová a Yahvé en una cita de RVR60. La cita es literal o no es cita. Si tu argumento académico requiere debatir la vocalización, hazlo en nota, no en el texto citado.

### 3.7 Pronombres divinos

- **Mayúscula inicial obligatoria** en pronombres referidos a la Divinidad cuando podría haber ambigüedad referencial: «Cristo llamó a sus discípulos, y Él los envió» (Él se refiere a Cristo).
- **No mayuscules** los pronombres divinos cuando el referente sea inequívoco por el contexto inmediato: «Dios creó al hombre y le dio dominio sobre la creación.»
- **Esta norma se relaja en bloques de cita bíblica**, donde se respeta el original de la versión citada (RVR60 sí mayuscula consistentemente; LBLA, no siempre).

---

## 4. Ortotipografía castellana

### 4.1 Comillas — sistema jerárquico de tres niveles

Verbum Manet adopta el sistema clásico hispano de tres niveles, que es el estándar del español culto y editorial:

| Nivel | Símbolo | Uso |
|---|---|---|
| **1.º** | `« »` (latinas, U+00AB / U+00BB) | Citas literales, frases destacadas, títulos de capítulos |
| **2.º** | `" "` (inglesas dobles, U+201C / U+201D) | Cita dentro de cita |
| **3.º** | `' '` (inglesas simples, U+2018 / U+2019) | Cita dentro de cita dentro de cita |

Ejemplo escalonado:

> Lutero escribió en su tratado: «Cuando Erasmo objetó que "la palabra 'libre albedrío' aparece en los Padres", respondí que la frecuencia no establece doctrina».

**Prohibido:**

- ❌ Comillas rectas verticales `"..."` y `'...'` (resultado de teclado sin sustitución tipográfica).
- ❌ Mezclar sistemas en la misma página.
- ❌ Usar comillas inglesas en el nivel 1.º salvo en `code` HTML para atributos.

### 4.2 Guiones, rayas y signos auxiliares

| Símbolo | Carácter | Uso |
|---|---|---|
| Guion | `-` (U+002D) | Palabras compuestas: «teológico-filosófico» |
| Guion largo (en dash) | `–` (U+2013) | Rangos numéricos: «pp. 23–47», «Jn 3:16–17» |
| Raya (em dash) | `—` (U+2014) | Incisos parentéticos (sin espacios interiores en español culto): «la doctrina —rectamente entendida— exige…» |
| Puntos suspensivos | `…` (U+2026) | Siempre como carácter único, nunca tres puntos sucesivos |
| Signo de interrogación inicial | `¿` | Obligatorio siempre que haya `?` final |
| Signo de exclamación inicial | `¡` | Obligatorio siempre que haya `!` final |

### 4.3 Espacios

- **Espacio fino antes de signos de exclamación, interrogación o puntuación francesa:** no se usa en español. (Es convención francesa, no castellana.)
- **Espacio antes de unidades:** «50 km», «1 200 personas», «s. XVI». Para miles, usa **espacio fino** (`U+202F`) o coma; nunca punto, que es decimal en convención hispana.
- **Espacio fino no separable** (`&nbsp;` / U+00A0) entre referencias y números: «Sal&nbsp;119:105», «p.&nbsp;47», «s.&nbsp;XVII». Esto evita que el navegador parta una referencia bíblica entre líneas.

### 4.4 Tipografía de números

| Caso | Convención | Ejemplo |
|---|---|---|
| Cifras cardinales del 0 al 9 | En letras | «los nueve mandamientos» |
| Cifras del 10 en adelante | En cifras arábigas | «los 95 puntos de Lutero» |
| Excepciones temporales/históricas | Siempre cifras | «1517», «s. XVI» |
| Números bíblicos en referencia | Siempre cifras | «Jn 3:16», «Ro 9:11–13» |
| Siglos | Romanos en versalita | «s. XVI», «s. XVII» |

> Excepción institucional: «los Cinco Solas» se escribe en letras con mayúscula por su valor confesional consolidado.

---

## 5. Mayúsculas — política reformada

Esta es la sección más opinada de la guía. La decisión es: **mayúscula confesional disciplinada**, no mayúscula devocional indiscriminada. Se mayuscula lo que la tradición reformada institucional reconoce como propio (eventos, documentos, doctrinas con nombre técnico consolidado); se minuscula lo común aunque sea religioso.

### 5.1 Siempre con mayúscula inicial

- **Personas divinas:** Dios, Cristo, el Señor, el Espíritu Santo, el Padre, el Hijo, el Verbo.
- **Eventos teológicos únicos:** la Caída, la Encarnación, la Resurrección, la Ascensión, el Pentecostés, el Juicio Final, la Segunda Venida.
- **La Reforma** (sustantivo propio, referencia al movimiento histórico del s. XVI).
- **Documentos confesionales:** la Confesión de Fe de Westminster, el Catecismo Menor, los Cánones de Dort, la Confesión Belga, la Confesión de Heidelberg.
- **Concilios y sínodos:** el Concilio de Nicea, el Sínodo de Dort, la Asamblea de Westminster.
- **Los Cinco Solas:** Sola Scriptura, Sola Fide, Sola Gratia, Solus Christus, Soli Deo Gloria — **en cursiva** (extranjerismos latinos vivos).
- **Pactos teológicos como sistema:** el Pacto de Obras, el Pacto de Gracia, el Pacto de Redención (cuando se refieren a los pactos federales como conceptos técnicos). Minúscula cuando se habla del «pacto» en sentido genérico.
- **Iglesia** cuando se refiere a la Iglesia universal o a una tradición confesional («la Iglesia Reformada», «la Iglesia visible»). Minúscula para edificio o congregación local («fui a la iglesia el domingo»).
- **Escritura/Escrituras** como sinónimo de Biblia. Minúscula cuando es escritura común («la escritura del autor es fluida»).
- **Sagrada Escritura, Palabra de Dios, Sagradas Letras.**
- **Reformada, Reformado** como adjetivo confesional («teología Reformada», «tradición Reformada»). Minúscula cuando es participio común («un cuerpo de leyes reformado»).
- **Calvinismo, Arminianismo, Luteranismo** como sistemas teológicos identificables.

### 5.2 Siempre con minúscula

- **biblia** cuando es ejemplar físico genérico («tengo tres biblias en casa»). Mayúscula sólo como obra: «la Biblia».
- **evangelio** cuando es contenido del mensaje («el evangelio de la gracia»). Mayúscula sólo como género literario o como obra: «el Evangelio según Juan», «los cuatro Evangelios».
- **antiguo testamento, nuevo testamento** cuando son adjetivos comunes («época del antiguo testamento»). Mayúscula como obra: «el Antiguo Testamento», «el Nuevo Testamento».
- **cristiano, protestante, católico, ortodoxo** como adjetivos comunes.
- **iglesia primitiva, iglesia medieval** (descripción cronológica, no nombre propio).
- **fe, gracia, justificación, santificación, glorificación, predestinación, elección** — son doctrinas con nombre común, no nombres propios. Minúscula siempre, salvo título de sección o inicio de oración.
- **cielo, infierno, paraíso.**

### 5.3 Casos delicados

| Forma | Decisión | Justificación |
|---|---|---|
| reino de Dios / Reino de Dios | **reino de Dios** (minúscula) | Es concepto teológico, no entidad política con nombre propio. |
| iglesia local / Iglesia local | **iglesia local** | Una entre muchas; no es referente único. |
| sacramento / Sacramento | **sacramento** | Es categoría, no nombre propio. |
| bautismo / Bautismo | **bautismo** | Acto sacramental, no evento único universal. |
| santa cena / Santa Cena | **Santa Cena** | Nombre propio consolidado de un sacramento específico. |
| nueva creación / Nueva Creación | **nueva creación** | Concepto escatológico, no evento con nombre propio. |
| nuevo pacto / Nuevo Pacto | **Nuevo Pacto** (cuando se refiere al pacto federal técnico); **nuevo pacto** (cuando es expresión común) | Distinción técnico-confesional. |

> Cuando dudes, aplica esta prueba: «¿Sustituiría yo esta expresión por su nombre técnico equivalente sin perder referencia?» Si sí, mayúscula. Si no, minúscula.

---

## 6. Cursivas, negritas y comillas: cuándo usar cada una

### 6.1 Cursiva (`<em>` con clase `vma-italic` cuando proceda)

Usa cursiva para:

- **Extranjerismos vivos no adaptados al español:** *sola fide*, *theopneustos*, *ordo salutis*, *fides quaerens intellectum*, *Heilsgeschichte*, *ad fontes*.
- **Títulos de obras:** *Institución de la Religión Cristiana*, *Cur Deus Homo*, *La Servidumbre de la Voluntad*.
- **Énfasis semántico real** (palabra cuyo subrayado cambia el sentido de la frase): «No es la fe la que justifica, sino *la que confía* en Cristo».
- **Términos técnicos en su primera aparición de la lección.** Después, redondo: «El *ordo salutis* describe la secuencia lógica… Cada etapa del ordo salutis tiene…»
- **Palabras citadas como palabra** (uso metalingüístico): «La palabra *theopneustos* aparece una sola vez en el NT.»

> **Cursiva técnica vs. semántica.** En HTML usa `<em>` para énfasis semántico (lectores de pantalla lo anuncian) y `<i>` para extranjerismos y títulos (uso convencional sin énfasis vocal). Diferenciar mejora la accesibilidad.

### 6.2 Negrita (`<strong>` con clase `vma-bold` cuando proceda)

Usa negrita **muy escasamente**, sólo para:

- **Conceptos definidos en una lección** que el lector debe poder localizar visualmente: «La **justificación** es un acto forense…»
- **Términos del glosario** en su primera aparición lematizada (cuando además abren un tooltip de glosario, el marcado es `<span data-glossary-term="ordo-salutis">ordo salutis</span>` y el estilo CSS aplica cursiva + subrayado punteado, no negrita; reserva negrita para los conceptos no glosados).
- **Imperativos pedagógicos en actividades:** «**Lee** Romanos 5:1–11 y **subraya** los verbos en pretérito».

> Regla cuantitativa: en cualquier párrafo de exposición de más de 200 palabras, no debe haber más de **dos** elementos en negrita. Si tu instinto te pide más, reescribe el párrafo.

### 6.3 Comillas (ver §4.1 para el sistema)

Usa comillas para:

- **Citas textuales** (de la Biblia, de obras teológicas, de personas).
- **Frases destacadas con valor histórico:** «*Aquí estoy, no puedo hacer otra cosa*» (Lutero ante la Dieta de Worms).
- **Acepción semántica específica** o sentido figurado intencionado: La «gracia» en sentido católico-romano no es lo mismo que la «gracia» en sentido paulino.
- **Apodos, motes o títulos no oficiales** entre comillas en su primera aparición: el «doctor angélico» (Tomás de Aquino), el «martillo de los herejes».

> **No uses comillas para:** términos técnicos (usa cursiva), énfasis general (usa cursiva o reescribe), títulos de obras (usa cursiva).

### 6.4 Resumen visual

| Tipo | Marcado | Estilo CSS | Ejemplo |
|---|---|---|---|
| Énfasis semántico | `<em>` | cursiva | «No es *cualquier* fe la que salva.» |
| Extranjerismo | `<i lang="la">` | cursiva | *sola fide* |
| Título de obra | `<cite>` o `<i>` | cursiva | *Institución de la Religión Cristiana* |
| Concepto destacado | `<strong>` | negrita | La **justificación** es… |
| Término del glosario | `<span data-glossary-term>` | cursiva + subrayado punteado | *ordo salutis* |
| Cita textual | `«…»` o `<blockquote>` | redondo | «Por la fe…» |
| Acepción específica | `«…»` redondo | redondo | la «gracia» católico-romana |

---

## 7. Términos técnicos y extranjerismos

### 7.1 Latín, griego, hebreo, alemán

- **Primera aparición en la lección:** cursiva + traducción entre paréntesis. «El *ordo salutis* (orden de la salvación) describe…»
- **Apariciones siguientes:** cursiva sin traducción. «El ordo salutis comienza con la elección…»
- **Si el término aparece más de cinco veces** en la misma lección y es central a su contenido, después de la quinta aparición puede pasar a redondo: «ordo salutis».
- **Términos hebreos/griegos en alfabeto original:** acepta dos formas válidas y mantén consistencia dentro de la lección:
  - **Transliteración:** *theopneustos* (preferida para no exigir fuentes especiales).
  - **Alfabeto original con transliteración entre paréntesis:** θεόπνευστος (*theopneustos*). Reserva para análisis lingüístico explícito.

### 7.2 Atributo `lang` obligatorio

Todo extranjerismo lleva el atributo `lang` correspondiente para accesibilidad y SEO multilingüe:

```html
<i lang="la">sola fide</i>
<i lang="grc">theopneustos</i>
<i lang="he">YHWH</i>
<i lang="de">Heilsgeschichte</i>
```

Códigos ISO: `la` (latín), `grc` (griego clásico), `he` (hebreo), `de` (alemán), `en` (inglés), `fr` (francés).

### 7.3 Glosario inline (tooltip)

Cuando un término esté definido en `data/glossary.js`, usa el marcado de tooltip:

```html
<span data-glossary-term="ordo-salutis"><i lang="la">ordo salutis</i></span>
```

El sistema JS detecta el atributo `data-glossary-term`, asocia el tooltip al ID del glosario, y aplica visualmente subrayado punteado en `--vma-gold-700`. **No** uses esta marca más de una vez por término por lección —la primera vez basta.

---

## 8. Citas largas y referencias patrísticas

### 8.1 Citas de obras teológicas

**En cuerpo de texto, integradas:**

> Según Calvino, el conocimiento de Dios y el conocimiento de nosotros mismos están entrelazados de tal manera que «el uno produce y engendra al otro» (*Institución* I.1.1).

**Cita destacada en bloque:**

```html
<blockquote class="vma-quote vma-quote--theologian" cite="Institución I.1.1">
  <p>«Casi toda la suma de nuestra sabiduría, que pueda ser tenida por verdadera y sólida sabiduría, consta de dos partes: el conocimiento de Dios y el conocimiento de nosotros mismos».</p>
  <footer>— Juan Calvino, <cite>Institución de la Religión Cristiana</cite> I.1.1</footer>
</blockquote>
```

### 8.2 Formato de referencia abreviada

| Obra | Forma corta | Ejemplo |
|---|---|---|
| Calvino, *Institución de la Religión Cristiana* | *Institución* | *Institución* III.21.5 |
| Confesión de Fe de Westminster | CFW | CFW III.1 o CFW 3.1 |
| Catecismo Menor de Westminster | CMW | CMW P. 1 (P. = Pregunta) |
| Catecismo Mayor de Westminster | CMaW | CMaW P. 191 |
| Catecismo de Heidelberg | CH | CH Domingo 11, P. 29 |
| Cánones de Dort | CD | CD I.7 (I = primer capítulo) |
| Confesión Belga | CB | CB Art. 14 |
| Tomás de Aquino, *Summa Theologica* | *Summa* | *Summa* I, q. 1, a. 1 |
| Agustín, *La Ciudad de Dios* | *De Civitate Dei* | *De Civitate Dei* XIV.28 |

### 8.3 Referencias patrísticas

Padre patrístico se cita por **nombre vernáculo en español + obra original en latín** entre cursivas:

- Agustín de Hipona, *Confesiones* III.6.
- Atanasio, *De Incarnatione Verbi* 54.3.
- Ireneo, *Adversus Haereses* III.18.7.

> **No uses** las formas griegas latinizadas («Athanasius», «Irenaeus»). En castellano son Agustín, Atanasio, Ireneo.

### 8.4 Cita de obras contemporáneas (autor + año)

Para citas de obras del s. XX–XXI, formato APA simplificado en el texto y referencia completa en `data/bibliography.js`:

> Como ha mostrado Murray (1955), la expiación se entiende correctamente sólo en su carácter definido y particular.

Y en la bibliografía:

```javascript
{
  id: "murray-1955-redemption",
  author: "Murray, John",
  year: 1955,
  title: "La Redención Consumada y Aplicada",
  publisher: "Estandarte de la Verdad",
  city: "Edimburgo",
  language: "es",
  originalTitle: "Redemption Accomplished and Applied",
  originalYear: 1955
}
```

---

## 9. Tipografía aplicada — clases CSS y semántica HTML

Esta sección puentea la guía editorial con `css/styles.css`. Cada decisión de §5–8 tiene un marcado HTML específico.

### 9.1 Clases utilitarias canónicas

| Clase | Aplicación |
|---|---|
| `.vma-prose` | Wrapper de todo bloque de texto académico largo (aplica medida 65ch, ritmo vertical, jerarquía de heads) |
| `.vma-quote` | Cita en bloque genérica |
| `.vma-quote--scripture` | Cita bíblica destacada |
| `.vma-quote--theologian` | Cita de obra teológica |
| `.vma-quote--confession` | Cita de confesión o catecismo |
| `.vma-lead` | Párrafo introductorio de lección (texto ligeramente mayor, sin negrita) |
| `.vma-aside` | Nota lateral, comentario tangencial |
| `.vma-doxology` | Cierre doxológico de lección (texto centrado, cursiva, gold) |
| `.vma-key-term` | Concepto definido en línea (no glosado) |
| `.vma-scripture-ref` | Referencia bíblica en línea (tipografía monoespaciada sutil) |

### 9.2 Estructura HTML mínima de una lección

```html
<article class="vma-prose" lang="es">
  <header>
    <p class="vma-eyebrow">Curso 13 · Unidad 1 · Lección 1.1</p>
    <h1>La preexistencia y la encarnación</h1>
    <p class="vma-lead">El Verbo eterno, sin dejar de ser lo que era, asumió lo que no era.</p>
  </header>

  <ol class="vias">
    <li class="via" id="via-formulacion" aria-labelledby="formulacion">
      <h2 id="formulacion">Formulación <em>confesional</em></h2>
      <div class="via__body">
        <p>…</p>
      </div>
    </li>

    <li class="via" id="via-elentica" aria-labelledby="elentica">
      <h2 id="elentica">Dimensión <em>eléntica</em></h2>
      <div class="via__body">
        <p>…</p>
      </div>
    </li>

    <li class="via" id="via-biblica" aria-labelledby="biblica">
      <h2 id="biblica">Perspectiva de <em>teología bíblica</em></h2>
      <div class="via__body">
        <p>…</p>
      </div>
    </li>

    <li class="via" id="via-catequetica" aria-labelledby="catequetica">
      <h2 id="catequetica">Aplicación <em>catequética</em></h2>
      <div class="via__body">
        <p>…</p>
      </div>
    </li>

    <li class="via" id="via-doxologica" aria-labelledby="doxologica">
      <h2 id="doxologica">Aplicación <em>doxológica</em></h2>
      <div class="via__body">
        <p class="vma-doxology">…</p>
      </div>
    </li>
  </ol>

  <aside class="lesson__source">
    <h3>Fuentes y lecturas adicionales</h3>
    <ul>…</ul>
  </aside>
</article>
```

> **Nota sobre el marcado:** el corpus existente usa `<ol class="vias">` con `<li class="via">` como contenedor canónico de cada vía. El `<em>` dentro del `<h2>` aplica el estilo tipográfico distintivo del segundo término del nombre de la vía (cursiva sutil en la palabra clave: «confesional», «eléntica», «teología bíblica», «catequética», «doxológica»). Este patrón está consolidado en los 20 cursos y es **parte del sistema de diseño**, no decoración opcional.

### 9.3 Jerarquía de heads

- **Una sola `<h1>` por lección**, con el título de la lección.
- **`<h2>` para las cinco secciones canónicas** del `expandedContent`.
- **`<h3>` para subsecciones internas** (raras; reserva para lecciones largas).
- **`<h4>`+ no se usa** en contenido de lección. Si necesitas más profundidad, reestructura.

### 9.4 Saltos de línea y párrafos

- **Nunca** uses `<br>` para separar párrafos. Usa `<p>` con `<p>`.
- **Nunca** uses `<br>` para forzar maquetación. Si necesitas saltos visuales, es CSS (`margin-top` en pseudo-elementos o spacers).
- **Excepción:** poesía bíblica versificada en bloque, donde `<br>` separa esticos:

```html
<blockquote class="vma-quote vma-quote--scripture vma-quote--verse">
  <p>«Bienaventurado el varón que no anduvo en consejo de malos,<br>
    Ni estuvo en camino de pecadores,<br>
    Ni en silla de escarnecedores se ha sentado».</p>
  <footer>— <cite>Salmo 1:1</cite>, RVR60</footer>
</blockquote>
```

---

## 10. Estructura canónica de cada lección — las cinco vías

Toda lección del corpus sigue el mismo sistema de **cinco vías pedagógicas**. Esta estructura es **el sistema canónico cerrado del proyecto** y está completamente implementada en los 20 cursos existentes. La presente sección documenta el estándar; no lo prescribe ex novo.

> **Las cinco vías como sello editorial.** Junto con la tipografía Cormorant + Satoshi, la paleta navy/gold/cream, y el cierre latino pastoral, las cinco vías son uno de los cuatro pilares de la identidad de Verbum Manet Academy. Cualquier contenido nuevo —corrección, expansión, regeneración— debe respetar esta estructura. Cualquier ausencia de una de las vías en una lección existente es un defecto a corregir, no una variante permisible.

### 10.1 Las cinco vías canónicas

> **Nota terminológica importante:** estas cinco secciones son referidas en el corpus existente y en el marcado HTML como **«las cinco vías»** (`<ol class="vias">`, `<li class="via">`). La guía adopta esta nomenclatura. Cuando se hable de «secciones», «vías» o «caminos pedagógicos», los tres términos son intercambiables y refieren al mismo sistema.
>
> **Nota ortográfica importante:** la palabra técnica para la segunda vía es **«eléntica»** (con tilde aguda en la primera *e*), no «elenctica». Esta es la forma fijada en los 20 cursos del proyecto y deriva del griego *elenchos* (ἔλεγχος, «refutación»). Toda referencia en esta guía, en el marcado HTML (`id`, `aria-labelledby`, encabezados `<h2>`) y en el contenido visible debe usar «eléntica».

| # | Vía | Función pedagógica | Voz | Longitud objetivo |
|---|---|---|---|---|
| 1 | **Formulación confesional** | Define la doctrina en lenguaje preciso, anclado en la tradición reformada (Westminster, Heidelberg, Dort, Belga). | 3.ª impersonal | 350–500 palabras |
| 2 | **Dimensión eléntica** | Identifica errores históricos y contemporáneos contra esta doctrina; los expone con justicia y los evalúa desde la Escritura. | 3.ª impersonal | 350–500 palabras |
| 3 | **Perspectiva de teología bíblica** | Traza la doctrina a través de la historia de la redención —cómo se desarrolla progresivamente del AT al NT— siguiendo el método de Geerhardus Vos. | 3.ª impersonal | 400–550 palabras |
| 4 | **Aplicación catequética** | Traduce la doctrina al lenguaje del catecismo y la enseñanza pastoral; conecta con preguntas y respuestas concretas del Catecismo Menor o de Heidelberg. | 3.ª impersonal o 2.ª pedagógica | 350–500 palabras |
| 5 | **Aplicación doxológica** | Cierra la lección llevándola a la adoración: cómo esta doctrina nutre la oración, la alabanza, la vida del creyente. Puede culminar en cierre latino pastoral. | 1.ª plural inclusiva | 250–400 palabras |

**Longitud total objetivo por lección:** 1.700–2.450 palabras de `expandedContent` neto (sin contar encabezados, citas en bloque ni recursos adicionales).

> **Nota sobre los rangos:** estos valores reflejan la densidad real del corpus existente de 135 lecciones generadas. **No son techo:** una lección puede legítimamente exceder el rango superior si la complejidad del *locus* doctrinal lo exige (caso ejemplar: Curso 13 — Cristología y soteriología). **Son piso:** una lección no debería caer por debajo del rango inferior salvo que el tema sea estrictamente introductorio.

### 10.2 Capitalización canónica de los nombres de las vías

Los nombres de las cinco vías siguen el patrón **«Primer término en mayúscula, segundo término en minúscula»**, salvo cuando aparecen como encabezado de sección (donde la mayúscula del segundo término es opcional según jerarquía de heading). Forma normativa en cuerpo de texto:

- ✅ Formulación confesional
- ✅ Dimensión eléntica
- ✅ Perspectiva de teología bíblica
- ✅ Aplicación catequética
- ✅ Aplicación doxológica

❌ «Formulación Confesional», «Dimensión Eléntica», etc. en cuerpo de texto.

En encabezados `<h2>` ambas formas son aceptables; el corpus existente usa la versión con segundo término en minúscula también en `<h2>`, por consistencia visual con el cuerpo. **Recomendación: mantener la minúscula también en encabezados.**

### 10.3 Coherencia entre vías

- La **Formulación** establece el vocabulario que usarán las cuatro siguientes. No introduzcas un término en Eléntica que no haya aparecido en Formulación.
- La **Dimensión eléntica** debe nombrar **al menos un error histórico documentado** (con su nombre técnico: pelagianismo, socinianismo, modalismo, arrianismo, nestorianismo) y **al menos un error contemporáneo** (con descripción funcional, sin necesidad de nombre técnico si no lo tiene).
- La **Perspectiva de teología bíblica** debe citar **al menos un texto del AT y uno del NT** —incluso para doctrinas aparentemente neotestamentarias, hay siempre raíz veterotestamentaria.
- La **Aplicación catequética** debe referenciar **al menos una pregunta** del Catecismo Menor de Westminster o del Catecismo de Heidelberg.
- La **Aplicación doxológica** debe terminar en una frase que conecte la doctrina con la **adoración trinitaria**, no con un sentimiento subjetivo. Cuando proceda, puede culminar en una **expresión latina pastoral** —*Soli Deo gloria*, *Coram Deo*, *Solus Christus*, *Per Christum ad Patrem*— como sello doxológico institucional del proyecto.

### 10.4 El cierre latino pastoral

Tradición institucional del proyecto: cada curso completo y, opcionalmente, cada lección individual cierra con una **expresión latina pastoral** que sella el contenido doctrinal con su orientación doxológica. Esta práctica está consolidada en los 20 cursos existentes y es **parte normativa de la identidad editorial de Verbum Manet Academy**.

#### Inventario de cierres latinos autorizados

| Latín | Traducción | Uso recomendado |
|---|---|---|
| *Soli Deo gloria* | Sólo a Dios la gloria | Cierre universal, doxología trinitaria, fin de curso |
| *Soli Deo gloria. Amen* | Sólo a Dios la gloria. Amén | Versión con sello catequético |
| *Coram Deo* | Ante la faz de Dios | Lecciones sobre vida cristiana, ética, vocación |
| *Solus Christus* | Sólo Cristo | Cristología, soteriología, mediación |
| *Sola gratia* | Sólo por gracia | Soteriología, justificación, elección |
| *Sola fide* | Sólo por la fe | Justificación, fe salvadora |
| *Sola Scriptura* | Sólo la Escritura | Bibliología, hermenéutica, autoridad |
| *Per Christum ad Patrem* | Por Cristo al Padre | Trinidad, mediación, oración |
| *In Christo* | En Cristo | Unión con Cristo, eclesiología |
| *Verbum Domini manet in aeternum* | La Palabra del Señor permanece para siempre | Cierre institucional supremo, hitos del proyecto |
| *Vincit qui patitur* | Vence el que padece | Eclesiología del sufrimiento, escatología |
| *Finis coronat opus* | El fin corona la obra | Escatología, glorificación, fin del curso |

#### Formato del cierre latino

- **Siempre en cursiva con `<i lang="la">`**: `<i lang="la">Soli Deo gloria</i>.`
- **Punto final fuera de la cursiva.**
- **Posición:** última oración del párrafo final de la `Aplicación doxológica` (cierre de lección) o párrafo independiente al cierre de un curso (`<p class="vma-coda vma-coda--latin">`).
- **Frecuencia:** no obligatorio en cada lección, pero obligatorio al cierre de cada curso. No abuses: una lección normal no necesita cierre latino si la doxología cierra naturalmente sin él.

#### Ejemplo en marcado

```html
<p class="vma-doxology">
  Toda la gloria de nuestra salvación pertenece al Padre que eligió, al Hijo que cumplió
  y al Espíritu que aplicó. <i lang="la">Soli Deo gloria</i>.
</p>
```

Para cierre de curso completo (al final del archivo `courses/segment-N/[curso].html`, antes de `<nav class="course-nav">`):

```html
<p class="vma-coda vma-coda--latin" lang="la">
  Soli Deo gloria. Amen.
</p>
```

### 10.5 Lo que no es una lección

- **No es un sermón.** Aunque el tono catequético sea cálido, la lección no termina con una invitación devocional ni una llamada al altar.
- **No es un artículo de blog.** No hay opiniones personales del autor, ni anécdotas, ni preguntas retóricas inflamadas.
- **No es un resumen.** Una lección desarrolla; no compendia. Si tu borrador parece una lista de viñetas con conectores, reescríbelo como prosa académica.

---

## 11. Marcado HTML semántico

Recordatorios mínimos no negociables:

- Una sola `<h1>` por documento HTML (incluidas las páginas servidas como fragmentos: la `<h1>` del fragmento es la `<h1>` de la vista, no la del shell).
- Jerarquía de heads sin saltos: nunca `<h1>` seguido de `<h3>`.
- `<section>` para agrupaciones temáticas con `aria-labelledby` apuntando a su `<h2>` interno.
- `<article>` para la lección como contenido autocontenido.
- `<nav>` sólo para navegación primaria (header) y secundaria (índice de lección, breadcrumb).
- `<figure>` + `<figcaption>` para diagramas, imágenes de manuscritos, esquemas.
- `<dl>` + `<dt>` + `<dd>` para listas definicionales (glosario inline en página).
- `<details>` + `<summary>` para acordeones de contenido extenso opcional.
- `<time datetime="ISO-8601">` para fechas históricas y referencias temporales.

### 11.1 Atributos `lang` específicos

El `<html lang="es">` es general, pero todo bloque en otro idioma necesita su `lang` específico:

```html
<p>El término <i lang="grc">theopneustos</i> aparece en 2 Ti 3:16, traducido como «inspirada por Dios».</p>
<blockquote lang="la">
  <p>«Soli Deo gloria».</p>
</blockquote>
```

---

## 12. Glosario — formato de entradas

### 12.1 Estructura de cada entrada en `data/glossary.js`

```javascript
{
  id: "ordo-salutis",
  term: "Ordo salutis",
  pronunciation: "/ˈordo saˈlutis/",
  etymology: "Latín: «orden de la salvación».",
  language: "la",
  definition: "Secuencia lógica —no necesariamente cronológica— de los actos de Dios en la aplicación de la redención al creyente individual. La tradición reformada distingue, en orden lógico: elección, llamado eficaz, regeneración, fe y arrepentimiento, justificación, adopción, santificación, perseverancia, glorificación.",
  scriptural_basis: ["Ro 8:29–30", "Ef 1:3–14"],
  confessional_basis: ["CFW X–XVIII", "CMW P. 30–38"],
  related: ["regeneracion", "justificacion", "santificacion", "perseverancia-santos"],
  used_in_courses: ["curso-13-cristologia-soteriologia", "curso-19-pacto"],
  level: "intermedio"
}
```

### 12.2 Reglas de redacción de definiciones

- **Una sola frase principal**, máximo dos. La definición debe poder leerse en un tooltip de 250×120 px.
- **Sin metáforas**. La definición es técnica.
- **Sin ejemplos** en el campo `definition`. Los ejemplos van en una lección, no en el glosario.
- **Etimología obligatoria** para todo término no castellano: latín, griego, hebreo, alemán.
- **Pronunciación opcional** (formato IPA) para términos cuya pronunciación pueda confundir al lector hispano.

### 12.3 Términos prioritarios para el glosario inicial

Esta lista no es exhaustiva, pero marca los **80 términos mínimos** que la plataforma debe tener antes de su primer lanzamiento público. Distribuidos por curso:

- **Bibliología:** theopneustos, inspiración verbal plenaria, inerrancia, infalibilidad, suficiencia, perspicuidad, canon, regula fidei, sola Scriptura, autógrafos.
- **Teología propia:** aseidad, simplicidad, inmutabilidad, omnisciencia, omnipotencia, omnipresencia, atributos comunicables/incomunicables, perichoresis, homoousios, generación eterna, procesión, filioque, decretos divinos, supralapsarianismo, infralapsarianismo.
- **Antropología/hamartología:** imago Dei, pacto de obras, depravación total, pecado original, esclavitud de la voluntad, libre albedrío, imputación.
- **Cristología/soteriología:** unión hipostática, communicatio idiomatum, kenosis, expiación particular, satisfacción, propiciación, redención, reconciliación, ordo salutis, llamado eficaz, regeneración, fe (notitia, assensus, fiducia), arrepentimiento, justificación, doble imputación, adopción, santificación, glorificación, perseverancia de los santos.
- **Eclesiología/sacramentología:** marcas de la iglesia, iglesia visible/invisible, presbiterianismo, episcopalismo, congregacionalismo, ex opere operato, paedobautismo, credobautismo, presencia espiritual real, transubstanciación, consubstanciación.
- **Escatología:** estado intermedio, amilenialismo, postmilenialismo, premilenialismo, dispensacionalismo, nueva creación.
- **Apologética/método:** apologética presuposicional, TAG (argumento trascendental), fides quaerens intellectum.
- **Histórica/general:** Reforma, contrarreforma, puritanismo, pietismo, neoortodoxia, Heilsgeschichte, ad fontes, sola fide, sola gratia, solus Christus, soli Deo gloria.

---

## 13. Bibliografía y referencias bibliográficas

### 13.1 Formato de entrada en `data/bibliography.js`

```javascript
{
  id: "calvino-institucion",
  type: "book",
  author: "Calvino, Juan",
  year: 1559,
  title: "Institución de la Religión Cristiana",
  originalTitle: "Institutio Christianae Religionis",
  originalLanguage: "la",
  publisher: "Fundación Editorial de Literatura Reformada (FELiRe)",
  translator: "Cipriano de Valera (rev. Luis de Usoz y Río)",
  city: "Rijswijk",
  editionYear: 1986,
  isbn: "978-84-86790-08-9",
  url: "https://www.monergism.com/institutes-christian-religion-ebook",
  language: "es",
  level: "avanzado",
  topics: ["dogmática-reformada", "soteriología", "eclesiología"]
}
```

### 13.2 Jerarquía de fuentes para citación académica

Cuando una lección necesite respaldo bibliográfico, prefiere fuentes en este orden:

1. **Las Escrituras** en RVR60/LBLA, citadas directamente.
2. **Las confesiones y catecismos reformados clásicos** (Westminster, Heidelberg, Dort, Belga, Segunda Helvética, Galicana).
3. **Reformadores del s. XVI:** Calvino, Bullinger, Beza, Vermigli, Ursinus, Olevianus.
4. **Puritanos y reformados ortodoxos del s. XVII:** Owen, Goodwin, Baxter, Turretin, Witsius, Brakel.
5. **Reformados modernos:** Hodge, Warfield, Bavinck, Vos, Murray, Berkhof, Van Til.
6. **Reformados contemporáneos:** Frame, Beeke, Sproul, Horton, Ferguson, Carson, Letham.
7. **Fuentes externas** sólo cuando sean indispensables (filósofos, historiadores, lingüistas).

### 13.3 Repositorios de URL autorizados

Los enlaces externos en `additionalResources` de cada lección deben provenir de estas fuentes verificadas:

- `es.ligonier.org` — Ministerios Ligonier en español.
- `ccel.org` — Christian Classics Ethereal Library (clásicos).
- `monergism.com` — Monergism (incluye sección en español).
- `thegospelcoalition.org` — The Gospel Coalition (sección en español: `tgcespanol.org`).
- `chapellibrary.org` — Chapel Library (recursos puritanos).
- `reformed.org` — Center for Reformed Theology and Apologetics.

> **Prohibido:** YouTube, Wikipedia, blogs personales sin filiación institucional, sitios denominacionales no confesionalmente reformados, agregadores genéricos.

---

## 14. Accesibilidad textual (a11y de contenido)

### 14.1 Reglas mínimas WCAG AA aplicadas al contenido

- **Longitud máxima de línea:** 65 caracteres (`.vma-prose { max-width: 65ch; }`). Esto mejora la legibilidad para todos los lectores, especialmente con dislexia.
- **Contraste:** ya garantizado por la paleta del brief. Verifica que cualquier color personalizado en cita o destacado mantenga 4.5:1 mínimo.
- **Sin justificado total** (`text-align: justify`) en bloques largos — produce ríos verticales y dificulta lectura. Usa `text-align: left` (default).
- **Hyphens automatizados:** activa `hyphens: auto` con `lang="es"` en `.vma-prose`. Mejora densidad sin sacrificar legibilidad.

### 14.2 Imágenes y figuras

- **Todo `<img>` lleva `alt`** descriptivo. Si la imagen es decorativa, `alt=""` explícito.
- **Diagramas teológicos** (árboles confesionales, mapas cronológicos) llevan `alt` corto y descripción larga en `<figcaption>`:

```html
<figure>
  <img src="./assets/diagrams/ordo-salutis.svg" alt="Diagrama del orden de la salvación reformado" width="800" height="500" loading="lazy">
  <figcaption>El <i lang="la">ordo salutis</i> según la tradición reformada, desde la elección eterna hasta la glorificación final.</figcaption>
</figure>
```

### 14.3 Enlaces

- **Texto de enlace descriptivo.** Nunca «haz clic aquí» ni «más info».
- **Enlaces externos:** `target="_blank" rel="noopener noreferrer"` + indicación visual o textual de que abre fuera:

```html
<a href="https://es.ligonier.org/articulos/los-cinco-puntos-del-calvinismo/" target="_blank" rel="noopener noreferrer">
  Los cinco puntos del calvinismo (Ligonier) <span class="vma-sr-only">— abre en nueva pestaña</span>
</a>
```

### 14.4 Tablas

- **Toda tabla lleva `<caption>`** que la describe.
- **`<thead>` con `<th scope="col">`** para encabezados de columna.
- **Si la tabla tiene encabezados de fila**, `<th scope="row">`.
- **Tablas con muchas columnas:** envolver en `<div class="vma-table-wrap" tabindex="0" role="region" aria-label="Tabla desplazable: …">` para scroll horizontal accesible.

### 14.5 Skip links y landmarks

El shell `index.html` ya provee:

```html
<a class="vma-skip-link" href="#main-content">Saltar al contenido principal</a>
```

Cada fragmento de página/curso **no necesita** repetir el skip link, pero **sí** debe envolver su contenido en un landmark adecuado (`<main>` ya viene del shell; usa `<article>` o `<section>` con `aria-labelledby` apropiado).

---

## 15. Internacionalización mínima y nombres propios

### 15.1 Nombres de personas históricas

| Forma castellanizada (preferida) | Forma original (sólo si nunca se castellanizó) |
|---|---|
| Juan Calvino | Jean Calvin |
| Martín Lutero | Martin Luther |
| Ulrico Zuinglio | Huldrych Zwingli |
| Juan Knox | John Knox |
| Agustín de Hipona | Augustinus Hipponensis |
| Tomás de Aquino | Thomas Aquinas |
| Anselmo de Canterbury | Anselmus Cantuariensis |
| Juan Wycliffe | John Wycliffe |
| Juan Hus | Jan Hus |
| Erasmo de Rotterdam | Erasmus Roterodamus |

### 15.2 Nombres que **no** se castellanizan

- **Jonathan Edwards** (no «Juan Edwards»).
- **John Owen** (no «Juan Owen»).
- **B. B. Warfield** (no «B. B. Campo de Guerra», obvio, pero conserva la inicial).
- **J. Gresham Machen**.
- **Geerhardus Vos** (apellido holandés intacto).
- **Cornelius Van Til**.
- **Herman Bavinck**.

**Criterio:** se castellaniza únicamente cuando hay una tradición de castellanización consolidada en la literatura teológica hispana (siglos XVI–XX). Autores del s. XX–XXI mantienen su nombre original.

### 15.3 Topónimos

- **Wittenberg** (no «Wittemberg»).
- **Ginebra** (no «Geneva»; «Genève»).
- **Zúrich** (no «Zurich» sin tilde; sí «Zúrich»).
- **Worms** (intacto).
- **Heidelberg** (intacto).
- **La Haya** (no «The Hague»).
- **Dort** (no «Dordrecht» en uso académico; «Dordrecht» es válido en uso histórico extendido).

---

## 16. Numeración, fechas, cifras y unidades

### 16.1 Fechas

| Tipo | Formato | Ejemplo |
|---|---|---|
| Año concreto | `año` o `año d.C.` cuando hay ambigüedad | 1517, 451 d.C. |
| A. C. / d. C. | Sin espacios, con punto, en versalita | 70 d. C., 587 a. C. |
| Rango de años | `año1–año2` (en dash) | 1509–1564 |
| Década | `década de 1520` (preferido) o «los años 1520» | la década de 1520 |
| Siglo | `s.` + romanos | s. XVI, s. XVII |
| Rango de siglos | `s. XVI–XVII` | la transición s. XVI–XVII |
| Fecha completa | `día de mes de año` | 31 de octubre de 1517 |

### 16.2 Cifras numéricas

- **Decimales con coma**, no con punto: «3,14», no «3.14».
- **Miles con espacio fino** (`U+202F`) o sin separador para 4 dígitos: «1517», «10 000».
- **Versículos no llevan separador** aunque sean números altos: «Sal 119:176».

### 16.3 Porcentajes

- **Con espacio** entre cifra y signo: «90 %», no «90%».

### 16.4 Páginas y secciones

- **«pp.»** para rango de páginas, **«p.»** para una sola: «pp. 23–47», «p. 105».
- **«§»** para sección de obra: «§ 3.2».
- **Punto y coma para múltiples referencias en serie:** «pp. 23–47; 89–95; 112».

---

## 17. Estilo de microcopia de UI

Las cadenas de texto de UI (botones, mensajes de error, tooltips, placeholders) siguen un registro distinto al académico: **breve, directo, en imperativo o frase nominal**.

### 17.1 Botones

| Acción | Texto del botón |
|---|---|
| Avanzar a siguiente lección | «Siguiente lección» |
| Volver a unidad | «Volver a la unidad» |
| Marcar como completada | «Marcar como completada» |
| Descargar archivo | «Descargar PDF» |
| Abrir glosario | «Abrir glosario» |
| Cerrar modal | «Cerrar» |

### 17.2 Mensajes de estado

| Situación | Mensaje |
|---|---|
| Cargando contenido | «Cargando…» (con elipsis tipográfica) |
| Error de red | «No se pudo cargar el contenido. Verifica tu conexión.» |
| Búsqueda sin resultados | «No se encontraron resultados para esta búsqueda.» |
| Lección completada | «Lección completada» |
| Progreso guardado | «Progreso guardado» |

### 17.3 Microcopia institucional fija

| Pieza | Texto exacto |
|---|---|
| Nombre completo | Verbum Manet Academy |
| Nombre corto | Verbum Manet |
| Tagline | La Palabra Permanece |
| Tagline latino | *Verbum Domini manet in aeternum* |
| Referencia institucional | Isaías 40:8 |
| Doxología institucional | *Soli Deo gloria* |
| Pie de página de copyright | «© [año] Verbum Manet Academy · Soli Deo gloria» |
| Descripción meta | «Plataforma académica de formación teológica reformada en español, de acceso libre.» |

### 17.4 Cierres latinos pastorales — repertorio institucional

El proyecto Verbum Manet Academy mantiene una tradición editorial consolidada de cerrar cursos y, opcionalmente, lecciones individuales con una **expresión latina pastoral**. Esta práctica forma parte del sistema de marca textual y debe usarse —no inventarse— del repertorio aprobado:

| Latín | Traducción | Contexto típico |
|---|---|---|
| *Soli Deo gloria* | Sólo a Dios la gloria | Cierre universal por defecto |
| *Soli Deo gloria. Amen* | Sólo a Dios la gloria. Amén | Cierre con sello catequético |
| *Coram Deo* | Ante la faz de Dios | Vida cristiana, ética, vocación |
| *Solus Christus* | Sólo Cristo | Cristología, soteriología, mediación |
| *Sola gratia* | Sólo por gracia | Soteriología, elección |
| *Sola fide* | Sólo por la fe | Justificación |
| *Sola Scriptura* | Sólo la Escritura | Bibliología, hermenéutica |
| *Per Christum ad Patrem* | Por Cristo al Padre | Trinidad, oración |
| *In Christo* | En Cristo | Unión con Cristo, eclesiología |
| *Verbum Domini manet in aeternum* | La Palabra del Señor permanece para siempre | Cierre institucional supremo |
| *Vincit qui patitur* | Vence el que padece | Escatología del sufrimiento |
| *Finis coronat opus* | El fin corona la obra | Fin de curso, glorificación |

**Marcado y reglas de uso:** ver §10.4 para especificación completa (formato `<i lang="la">`, punto fuera de cursiva, una sola expresión por cierre, no abusar).

### 17.5 Tono UI

- **Sin emojis decorativos** (aplica también a UI). Excepción tolerada: ícono SVG de check (✓) en confirmaciones de progreso, como elemento gráfico inline, no como emoji.
- **Sin signos de admiración** en UI (no «¡Bien hecho!»). Sustituir por afirmación neutra («Lección completada»).
- **Sin «usted/tú» inconsistente.** Toda la UI tutea al estudiante (segunda persona singular).

---

## 18. Errores comunes a evitar

Lista de errores recurrentes que aparecen en borradores generados por modelos de lenguaje y que esta guía prohíbe explícitamente:

### 18.1 Errores de tono

- ❌ «¡Qué hermosa doctrina!» (sentimentalismo)
- ❌ «Como veremos a continuación…» (autorreferencialidad pedagógica innecesaria)
- ❌ «Es importante entender que…» (relleno; lo importante se demuestra, no se anuncia)
- ❌ «En resumen…» al final de una sección de 200 palabras (no se resume lo recién dicho)
- ❌ «Cabe destacar que…» (relleno académico cliché)

### 18.2 Errores de mayúscula

- ❌ «la Fe Reformada» (fe en minúscula salvo título de obra)
- ❌ «el Reino de Dios» (reino en minúscula)
- ❌ «la Iglesia local» (cuando «iglesia local» refiere a comunidad genérica)
- ❌ «el Bautismo» como sustantivo común
- ❌ Pronombres divinos mayusculizados en cada aparición («Él dijo a Sus discípulos…»)

### 18.3 Errores ortotipográficos

- ❌ Comillas rectas `"..."` en lugar de latinas `«...»`
- ❌ Triple punto `...` en lugar de carácter de puntos suspensivos `…`
- ❌ Guion corto `-` en rangos numéricos en lugar de en dash `–`
- ❌ Espacios alrededor de em dash en español: «la doctrina — rectamente entendida — exige…» (el español no separa con espacios; el inglés sí)
- ❌ «1ro», «2do» en lugar de «1.º», «2.º»

### 18.4 Errores doctrinales sutiles

- ❌ «Cristo murió por todos» sin contextualizar (la doctrina reformada es expiación particular; cuando la cita es Jn 3:16, contextualizar).
- ❌ «La fe nos justifica» (la fe no justifica; **Dios** justifica al pecador por medio de la fe).
- ❌ «Aceptar a Cristo» como condición soteriológica (lenguaje arminiano; la tradición reformada usa «creer en Cristo», «confiar en Cristo», «venir a Cristo»).
- ❌ «Pedirle a Cristo que entre en tu corazón» (lenguaje devocional moderno sin base bíblica explícita).
- ❌ Sinónimos imprecisos: «regeneración» y «conversión» no son lo mismo, ni «justificación» y «santificación», ni «elección» y «predestinación».

### 18.5 Errores de cita bíblica

- ❌ Citar de memoria sin verificar la versión (RVR60 ≠ NVI ≠ LBLA en cada texto).
- ❌ Mezclar versiones sin indicarlo.
- ❌ Truncar una cita en medio de una cláusula gramatical.
- ❌ Omitir la referencia («como dijo Jesús: "Vengan a mí todos los cansados…"» → debe ir Mt 11:28).

---

## 19. Apéndice — modelo de lección completa

A continuación, un ejemplo íntegro de una lección redactada según esta guía, para servir de plantilla normativa. Es la **Lección 3.3 del Curso 13 — La justificación: el artículo del que se sostiene o cae la iglesia**. El marcado refleja el estándar real del corpus existente: `<ol class="vias">` como contenedor, `<li class="via">` por cada vía, `<em>` en el segundo término del nombre de cada vía dentro del `<h2>`.

```html
<article class="lesson" id="leccion-3-3" data-lesson="3.3" data-course="cristologia-soteriologia">
  <header class="lesson__head">
    <p class="lesson__kicker">Curso 13 · Unidad 3 · Lección 3.3</p>
    <h1>La justificación: <em>el artículo del que se sostiene o cae la iglesia</em></h1>
    <p class="lesson__lead">Lutero llamó a esta doctrina <i lang="la">articulus stantis et cadentis ecclesiae</i>: el artículo del que la iglesia se sostiene o cae. La Reforma entera se jugó aquí.</p>
  </header>

  <div class="lesson__body">
    <p class="lesson__abstract">Estudio de la justificación como acto forense de Dios por el cual declara justo al pecador, recibido sólo por la fe; análisis de la doble imputación; refutación del modelo tridentino de infusión; trazado bíblico desde Gn 15:6 hasta Ro 3:21–26; y apropiación catequética según el Catecismo Menor de Westminster P. 33.</p>

    <ol class="vias">
      <li class="via" id="via-3-3-formulacion" aria-labelledby="formulacion-3-3">
        <h2 id="formulacion-3-3">Formulación <em>confesional</em></h2>
        <div class="via__body">
          <p>La <strong>justificación</strong> es el acto forense por el cual Dios, en su gracia, declara justo al pecador que cree en Cristo, no infundiendo justicia en él, sino imputándole la justicia de Cristo, recibida sólo por la fe.</p>
          <p>La Confesión de Fe de Westminster lo formula así: «Los que Dios llama eficazmente también justifica gratuitamente, no infundiendo justicia en ellos, sino perdonando sus pecados, y reputando y aceptando sus personas como justas» (CFW XI.1). La justificación, por tanto, no se confunde con la santificación: aquella declara, esta transforma; aquella es un acto único, esta es un proceso gradual; aquella nos cambia de posición ante Dios, esta nos cambia de condición.</p>
          <p>El término griego <span data-glossary-term="justificacion"><i lang="grc">dikaióō</i></span> es, en su uso paulino, un término del lenguaje del tribunal. No significa «hacer justo», sino «declarar justo». La distinción es decisiva: <em>todo</em> el debate de la Reforma se condensa en ella.</p>
        </div>
      </li>

      <li class="via" id="via-3-3-elentica" aria-labelledby="elentica-3-3">
        <h2 id="elentica-3-3">Dimensión <em>eléntica</em></h2>
        <div class="via__body">
          <p>El Concilio de Trento (Sesión VI, 1547) definió la justificación como una <em>infusión</em> de justicia en el creyente, mediada por los sacramentos y sostenida por las obras de fe. La doctrina romana confunde justificación y santificación en un mismo proceso, y por tanto convierte la salvación en una sinergia entre la gracia infundida y la cooperación humana. El resultado es que el creyente nunca puede tener certeza de su justificación, pues su justicia depende de un crecimiento que puede perderse.</p>
          <p>En el extremo contrario, ciertas corrientes contemporáneas —el llamado «hipergracia» o el antinomismo práctico— afirman la justificación pero desconectan radicalmente la santificación de la vida del creyente, como si la declaración forense no produjera transformación real. La tradición reformada confiesa lo opuesto: la justificación es por la fe sola, pero la fe que justifica nunca está sola (Stg 2:14–26).</p>
        </div>
      </li>

      <li class="via" id="via-3-3-biblica" aria-labelledby="biblica-3-3">
        <h2 id="biblica-3-3">Perspectiva de <em>teología bíblica</em></h2>
        <div class="via__body">
          <p>El AT prepara el terreno. En Génesis 15:6, Abram «creyó a Jehová, y le fue contado por justicia». No se nos dice que Abram se hiciera justo: se nos dice que su fe le fue <em>imputada</em> como justicia. El verbo hebreo <i lang="he">ḥāšab</i> (contar, imputar, reconocer) es contable, no transformador.</p>
          <p>El profeta Habacuc proclamará: «el justo por su fe vivirá» (Hab 2:4, RVR60), texto que Pablo citará tres veces en sus epístolas (Ro 1:17; Gl 3:11; cf. He 10:38) como bisagra de toda su soteriología.</p>
          <p>En el NT, Romanos 3:21–26 ocupa el lugar central: Dios manifiesta su justicia <em>aparte de la ley</em>, justificando al impío que cree en Jesús. La doble imputación queda explícita en 2 Corintios 5:21: «Al que no conoció pecado, por nosotros lo hizo pecado, para que nosotros fuésemos hechos justicia de Dios en él» (RVR60). El intercambio es completo: nuestros pecados imputados a Cristo en la cruz, su justicia imputada a nosotros en la fe.</p>
        </div>
      </li>

      <li class="via" id="via-3-3-catequetica" aria-labelledby="catequetica-3-3">
        <h2 id="catequetica-3-3">Aplicación <em>catequética</em></h2>
        <div class="via__body">
          <p>El Catecismo Menor de Westminster pregunta: «¿Qué es la justificación?» Y responde: «La justificación es un acto de la libre gracia de Dios, en el cual perdona todos nuestros pecados, y nos acepta como justos a su vista, solamente por causa de la justicia de Cristo, imputada a nosotros, y recibida solamente por la fe» (CMW P. 33).</p>
          <p>Aprende esta respuesta. Repítela hasta que sus términos te sean familiares: <strong>acto</strong> (no proceso), <strong>libre gracia</strong> (no merecida), <strong>solamente por causa de la justicia de Cristo</strong> (no de la tuya), <strong>imputada</strong> (no infundida), <strong>recibida solamente por la fe</strong> (no por obras añadidas).</p>
          <p>Si dudas de tu salvación, no busques certeza en lo que sientes ni en lo que has logrado: vuelve a Cristo y a su justicia imputada. Esa es la base. La única base.</p>
        </div>
      </li>

      <li class="via" id="via-3-3-doxologica" aria-labelledby="doxologica-3-3">
        <h2 id="doxologica-3-3">Aplicación <em>doxológica</em></h2>
        <div class="via__body">
          <p class="vma-doxology">Cuando contemplamos la justificación, contemplamos un evangelio en el que Dios mismo provee lo que él mismo exige. Confesamos con la iglesia de todos los tiempos que somos a la vez justos y pecadores —<i lang="la">simul iustus et peccator</i>—, justos en Cristo, pecadores en nosotros mismos, en peregrinaje hacia la justicia consumada. Toda la gloria de nuestra salvación pertenece al Padre que eligió, al Hijo que cumplió y al Espíritu que aplicó. <i lang="la">Soli Deo gloria</i>.</p>
        </div>
      </li>
    </ol>

    <aside class="lesson__source">
      <h3>Fuentes y lecturas adicionales</h3>
      <ul>
        <li><a href="https://es.ligonier.org/articulos/la-justificacion-solamente-por-la-fe/" target="_blank" rel="noopener noreferrer">R. C. Sproul, «La justificación solamente por la fe» <span class="vma-sr-only">— abre en nueva pestaña</span></a></li>
        <li><a href="https://www.monergism.com/justification-james-buchanan-ebook" target="_blank" rel="noopener noreferrer">James Buchanan, <cite>The Doctrine of Justification</cite> <span class="vma-sr-only">— abre en nueva pestaña</span></a></li>
        <li>Confesión de Fe de Westminster, capítulo XI.</li>
        <li>Catecismo Menor de Westminster, P. 33.</li>
      </ul>
    </aside>
  </div>
</article>
```

---

## 20. Apéndice — diccionario de abreviaturas

### 20.1 Libros del Antiguo Testamento

| Libro | Abrev. | Libro | Abrev. |
|---|---|---|---|
| Génesis | Gn | Eclesiastés | Ec |
| Éxodo | Éx | Cantares | Cnt |
| Levítico | Lv | Isaías | Is |
| Números | Nm | Jeremías | Jr |
| Deuteronomio | Dt | Lamentaciones | Lm |
| Josué | Jos | Ezequiel | Ez |
| Jueces | Jue | Daniel | Dn |
| Rut | Rt | Oseas | Os |
| 1 Samuel | 1 S | Joel | Jl |
| 2 Samuel | 2 S | Amós | Am |
| 1 Reyes | 1 R | Abdías | Abd |
| 2 Reyes | 2 R | Jonás | Jon |
| 1 Crónicas | 1 Cr | Miqueas | Mi |
| 2 Crónicas | 2 Cr | Nahúm | Nah |
| Esdras | Esd | Habacuc | Hab |
| Nehemías | Neh | Sofonías | Sof |
| Ester | Est | Hageo | Hag |
| Job | Job | Zacarías | Zac |
| Salmos | Sal | Malaquías | Mal |
| Proverbios | Pr | | |

### 20.2 Libros del Nuevo Testamento

| Libro | Abrev. | Libro | Abrev. |
|---|---|---|---|
| Mateo | Mt | 1 Timoteo | 1 Ti |
| Marcos | Mr | 2 Timoteo | 2 Ti |
| Lucas | Lc | Tito | Tit |
| Juan | Jn | Filemón | Flm |
| Hechos | Hch | Hebreos | He |
| Romanos | Ro | Santiago | Stg |
| 1 Corintios | 1 Co | 1 Pedro | 1 P |
| 2 Corintios | 2 Co | 2 Pedro | 2 P |
| Gálatas | Gl | 1 Juan | 1 Jn |
| Efesios | Ef | 2 Juan | 2 Jn |
| Filipenses | Fil | 3 Juan | 3 Jn |
| Colosenses | Col | Judas | Jud |
| 1 Tesalonicenses | 1 Ts | Apocalipsis | Ap |
| 2 Tesalonicenses | 2 Ts | | |

### 20.3 Abreviaturas confesionales

| Documento | Abrev. |
|---|---|
| Confesión de Fe de Westminster | CFW |
| Catecismo Menor de Westminster | CMW |
| Catecismo Mayor de Westminster | CMaW |
| Catecismo de Heidelberg | CH |
| Cánones de Dort | CD |
| Confesión Belga | CB |
| Segunda Confesión Helvética | 2CH |
| Credo de los Apóstoles | CA |
| Credo Niceno | CN |
| Credo Niceno-Constantinopolitano | CNC |
| Credo Atanasiano | CAt |
| Definición de Calcedonia | DCalc |

### 20.4 Abreviaturas académicas generales

| Forma | Significado |
|---|---|
| p. / pp. | página / páginas |
| c. / cc. | capítulo / capítulos |
| § / §§ | sección / secciones |
| v. / vv. | versículo / versículos |
| cf. | <i lang="la">confer</i> (compárese con) |
| cap. | capítulo (en obras teológicas) |
| ed. | editor / edición |
| trad. | traductor / traducción |
| s. v. | <i lang="la">sub voce</i> (bajo la entrada) |
| <i lang="la">op. cit.</i> | obra citada |
| <i lang="la">ibíd.</i> | en el mismo lugar |
| <i lang="la">vid.</i> | véase |
| ca. | <i lang="la">circa</i> (alrededor de, en fechas aproximadas) |
| <i lang="la">et al.</i> | y otros (autores) |

### 20.5 Versiones bíblicas

| Versión | Abreviatura |
|---|---|
| Reina-Valera 1960 | RVR60 |
| Reina-Valera Actualizada 2015 | RVA-2015 |
| Reina-Valera Contemporánea | RVC |
| La Biblia de las Américas | LBLA |
| Nueva Biblia de las Américas | NBLA |
| Nueva Versión Internacional | NVI |
| Dios Habla Hoy | DHH |
| Septuaginta | LXX |
| Vulgata | Vg |
| Texto Masorético | TM |
| Texto Mayoritario | TR |

---

## Cierre

Esta guía es **viva pero estable**: pequeñas precisiones y nuevos casos pueden añadirse a medida que el contenido crezca, pero las decisiones fundamentales (sistema de citas, política de mayúsculas, estructura de las cinco vías, tono pastoral-académico, cierre latino institucional) son inamovibles. Toda enmienda debe documentarse con su fecha y su razón.

El propósito último de esta guía no es la uniformidad estética. Es la **dignidad del lector** —el creyente serio que dedica su tiempo a estudiar las cosas de Dios y merece que se lo respondamos con rigor, claridad y reverencia.

---

### Registro de versiones

**v1.1 — 16 de mayo de 2026** (ajuste retrospectivo)

- §0 — Índice actualizado con las nuevas subsecciones.
- §1.1 (nueva) — Reconocimiento explícito de la naturaleza retrospectiva de la guía respecto al corpus de 20 cursos ya producido.
- §2.3 — Reformulada para distinguir prohibición de fórmulas devocionales contemporáneas vs. autorización del cierre latino.
- §2.4 (nueva) — Autorización explícita del cierre latino pastoral como parte del registro institucional.
- §9.2 — Estructura HTML mínima actualizada para usar `<ol class="vias">` / `<li class="via">` (marcado real del corpus) en lugar de `<section>`.
- §10 — Reescrito completamente. Cambios principales:
  - Renombrado: «las cinco secciones canónicas» → «las cinco vías canónicas» (nomenclatura del corpus).
  - Ortografía fijada: «Dimensión eléntica» (con tilde aguda), no «elenctica».
  - Rangos de longitud por vía elevados de 250–500 a 350–550 palabras, alineados con la densidad real del corpus.
  - §10.2 nueva — Capitalización canónica (segundo término en minúscula).
  - §10.3 (antes §10.2) — Coherencia entre vías.
  - §10.4 nueva — El cierre latino pastoral, con repertorio de 12 expresiones autorizadas, reglas de marcado y ejemplo.
  - §10.5 (antes §10.3) — Lo que no es una lección.
- §17.3 — Microcopia institucional ampliada (nombre corto, tagline latino, doxología en minúscula tipográfica correcta «Soli Deo gloria»).
- §17.4 nueva — Repertorio institucional de cierres latinos pastorales con tabla traducción/contexto.
- §17.5 (antes §17.4) — Tono UI.
- §19 — Modelo de lección completo reescrito con el marcado real del corpus: `<article class="lesson">`, `<ol class="vias">`, `<li class="via">`, `<aside class="lesson__source">`, `<em>` en el segundo término del nombre de cada vía dentro del `<h2>`. Aria-labels corregidas a «elentica» (sin la primera c).

**v1.0 — 16 de mayo de 2026** (versión inicial)

- Redacción inicial completa de 20 secciones + 2 apéndices.
- Decisiones editoriales fundadas: sistema mixto RVR60/LBLA, comillas latinas tripartitas, mayúsculas confesionales disciplinadas, política de cursivas con `lang`, estructura HTML semántica, escala tipográfica fluida.

---

*Verbum Domini manet in aeternum.*

— Fin del documento —
