# HU-07: Resiliencia a Ruido Estacionario y Recuperación del Texto

**Prioridad: MEDIA-BAJA (6.10 / 10)**
`(F: 6 × 0.3) + (I: 6 × 0.3) + (WTP: 5 × 0.25) + (FT: 8 × 0.15)`

**Sector:** Periodismo de Campo
**Dolores asociados:** D7

---

```
Como Periodista en la calle / Productor de Documentales "In the Wild",
quiero que el algoritmo extraiga discursos consistentes incluso cuando existen perturbaciones
del entorno de fondo como multitudes, tráfico, sirenas o compresión severa de la señal analógica,
para obtener registros utilizables y comprensibles extraídos de fuentes de campo en escenarios
acústicos que un transcriptor humano hallaría cognitivamente estresantes.
```

## Criterios de aceptación

- [ ] Utilizar un pre-procesador de filtrado y reducción de ruido armónico que acondicione la señal entrante previo a la inferencia de Pyannote y Whisper, preservando la fidelidad temporal.
- [ ] Reporte de umbrales de "Puntuación de Confianza de la Palabra" en la interfaz para alertar explícitamente al profesional sobre áreas inciertas debido a perturbación sónica que requieran doble verificación humana.

## Evidencia

Las varianzas de ruido ambiental interfieren sustancialmente sobre el VAD acarreando fallos en la discriminación del contexto vocal, resultando en que, aunque la transcripción base permanezca, se quiebren las jerarquías discursivas de las partes involucradas.
