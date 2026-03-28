# HU-02: Corrección Reactiva de Diarización y Superposición

**Prioridad: ALTA (7.90 / 10)**
`(F: 10 × 0.3) + (I: 8 × 0.3) + (WTP: 6 × 0.25) + (FT: 6 × 0.15)`

**Sector:** Periodismo / Legal / Academia
**Dolores asociados:** D3, D7

---

```
Como Periodista de Investigación / Moderador de Audiencias,
quiero una interfaz unificada que separe a los hablantes con precisión algorítmica
y me permita fusionar o renombrar masivamente segmentos superpuestos,
para atribuir las citas de forma inequívoca y evitar el tedioso proceso de tener que
escuchar nuevamente toda la entrevista debido a los solapamientos de voz.
```

## Criterios de aceptación

- [ ] Orquestación de algoritmos VAD y Pyannote con políticas de postprocesamiento deterministas orientadas a minimizar los solapamientos erráticos (ej. eliminación automática de segmentos inferiores a 0.5 segundos que representan confirmaciones vocales inertes como "hmm").
- [ ] Interfaz de usuario donde los nombres autogenerados (SPEAKER_00, SPEAKER_01) puedan sustituirse con un clic, propagándose por todo el flujo del documento.
- [ ] Las superposiciones prolongadas deben subdividirse en pistas identificables de manera clara con el texto que corresponde a cada voz.

## Evidencia

Reclamos recurrentes sobre el colapso de las herramientas ante solapamientos de audio o densidad de hablantes en aulas de investigación (DER del 45% en grupos); discusiones técnicas sobre mitigación algorítmica de intersecciones de voz.
