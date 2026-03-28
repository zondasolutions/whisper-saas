# Plan de Investigación: Dolores de Usuario y Oportunidades para Whisper SaaS

## Objetivo
Identificar los dolores reales de personas y sectores que necesitan transcripción de audio/video, para construir historias de usuario priorizadas por impacto.

---

## 1. Sectores clave a investigar

| Sector | Por qué investigarlo |
|---|---|
| **Periodismo / Medios** | Transcriben entrevistas constantemente. Tiempo = dinero. La precisión con nombres propios y jerga es crítica. |
| **Legal / Jurídico** | Audiencias, declaraciones, mediaciones. Necesitan transcripciones con identificación de hablantes (diarización) y valor probatorio. |
| **Salud** | Consultas médicas, dictado clínico. Terminología especializada, cumplimiento normativo (datos sensibles). |
| **Educación / Academia** | Clases grabadas, entrevistas de investigación cualitativa. Volumen alto, presupuesto bajo. |
| **Call Centers / Soporte** | Miles de llamadas diarias. Necesitan análisis masivo, no transcripción unitaria. |
| **Producción audiovisual / Subtitulado** | Subtítulos, accesibilidad, localización. Necesitan timestamps exactos y formatos específicos (SRT, VTT). |
| **Reuniones corporativas / Equipos remotos** | Actas de reuniones, action items. Competencia directa con Otter.ai, Fireflies, etc. |

## 2. Preguntas de investigación por dolor

Para cada sector, responder:

### Sobre el proceso actual
- ¿Cómo transcriben hoy? (manual, herramienta gratuita, servicio pago, asistente)
- ¿Cuánto tiempo les lleva? ¿Cuánto pagan?
- ¿Qué parte del proceso les genera más frustración?

### Sobre precisión y calidad
- ¿Qué porcentaje de error toleran? ¿Cuánto tiempo dedican a corregir?
- ¿Necesitan vocabulario especializado (médico, legal, técnico)?
- ¿Trabajan con múltiples idiomas o acentos regionales?

### Sobre diarización (quién habla)
- ¿Es crítico saber quién dijo qué? (legal y periodismo: sí; educación: depende)
- ¿Cuántos hablantes típicos tiene su audio?
- ¿Necesitan que los hablantes se identifiquen por nombre?

### Sobre formato y entrega
- ¿Qué formato de salida necesitan? (texto plano, SRT, Word, PDF, JSON)
- ¿Necesitan timestamps? ¿A nivel de palabra o de párrafo?
- ¿Integran la transcripción con otro sistema? (CRM, expediente, editor de video)

### Sobre privacidad y compliance
- ¿Pueden subir audio a la nube? ¿Hay restricciones regulatorias?
- ¿Necesitan que los datos se borren después de procesar?
- ¿Requieren procesamiento on-premise?

### Sobre volumen y flujo de trabajo
- ¿Cuántos archivos transcriben por semana/mes?
- ¿Procesan en lotes o uno a uno?
- ¿Necesitan colaborar sobre la transcripción? (editar, comentar, compartir)

## 3. Fuentes de datos sugeridas

- **Foros y comunidades**: Reddit (r/transcription, r/journalism, r/legaltech), grupos de LinkedIn, comunidades de producción audiovisual.
- **Reviews de competidores**: Reseñas en G2, Capterra y Trustpilot de Otter.ai, Rev, Descript, Trint, Sonix. Buscar quejas recurrentes = dolores no resueltos.
- **Entrevistas directas**: 5-8 entrevistas por sector con profesionales reales. Preguntar sobre su última transcripción: qué hicieron, qué salió mal, qué cambiarían.
- **Datos públicos**: Papers sobre WER (Word Error Rate) de Whisper por idioma/acento. Benchmarks de diarización con pyannote.
- **Búsquedas**: Google Trends para "transcripción automática", "speech to text español", etc. Volumen de búsqueda = demanda.

## 4. Hipótesis de dolores a validar

| # | Hipótesis de dolor | Sector más afectado | Cómo validar |
|---|---|---|---|
| D1 | "Paso más tiempo corrigiendo la transcripción que si la hiciera manual" | Todos, especialmente español con acentos regionales | Entrevistas + WER benchmarks por acento |
| D2 | "No puedo usar servicios cloud por políticas de privacidad de datos" | Legal, Salud | Entrevistas con compliance officers |
| D3 | "Necesito saber quién dijo qué y ninguna herramienta lo hace bien" | Legal, Periodismo | Test comparativo de diarización vs. competidores |
| D4 | "Transcribo 50+ archivos por semana y no hay forma de hacerlo en lote" | Call Centers, Academia | Entrevistas + análisis de features de competidores |
| D5 | "Las herramientas buenas son caras, las baratas son malas" | Freelancers, Educación, ONGs | Análisis de pricing de competidores vs. calidad percibida |
| D6 | "Necesito la transcripción en formato SRT/VTT y siempre tengo que convertir" | Audiovisual, Subtitulado | Reviews de competidores + entrevistas |
| D7 | "El audio tiene ruido de fondo / mala calidad y la transcripción se rompe" | Periodismo de campo, Call Centers | Tests con audio real de baja calidad |

## 5. Template para historias de usuario (post-investigación)

Después de validar los dolores, convertirlos a historias con este formato:

```
Como [persona del sector],
quiero [acción concreta],
para [beneficio / dolor que resuelve].

Criterios de aceptación:
- [ ] ...
- [ ] ...

Dolor asociado: D#
Evidencia: [fuente de la investigación]
Prioridad: [Alta/Media/Baja] basada en frecuencia × intensidad del dolor
```

## 6. Matriz de priorización sugerida

Después de la investigación, puntuar cada historia en:

| Criterio | Peso |
|---|---|
| **Frecuencia del dolor** (¿cuánta gente lo sufre?) | 30% |
| **Intensidad** (¿cuánto les duele?) | 30% |
| **Disposición a pagar** (¿pagarían por resolverlo?) | 25% |
| **Factibilidad técnica** (¿lo podemos hacer con Whisper + pyannote?) | 15% |
