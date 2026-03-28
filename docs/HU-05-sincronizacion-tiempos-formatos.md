# HU-05: Sincronización de Tiempos y Formatos Estrictos

**Prioridad: MEDIA (7.05 / 10)**
`(F: 6 × 0.3) + (I: 9 × 0.3) + (WTP: 7 × 0.25) + (FT: 6 × 0.15)`

**Sector:** Audiovisual
**Dolores asociados:** D6

---

```
Como Editor de Video / Coordinador de Accesibilidad,
quiero exportaciones multiformato listas para importar en sistemas de edición (SRT, VTT, FCPXML)
con demarcaciones sintácticas precisas y alineación absoluta,
para integrar de forma directa los subtítulos en los procesos de posproducción de
DaVinci, Premiere o Final Cut Pro sin tener que invertir horas re-temporizando desajustes.
```

## Criterios de aceptación

- [ ] Módulo de exportación con delimitadores configurables de caracteres máximos por segundo (CPS) y número de líneas visibles en pantalla.
- [ ] Utilización de alineación rigurosa a nivel de palabra para evitar fenómenos de deriva temporal (drifting).
- [ ] Si el usuario corrige el bloque de texto dentro de la aplicación web, las marcas de tiempo temporales asociadas a esos caracteres deben autoajustarse matemáticamente y propagarse hacia el archivo SRT final.

## Evidencia

El uso de herramientas genéricas fuerza integraciones destructivas; el software específico de video sufre "glitches" o "saltos" en la línea de tiempo cuando el motor subyacente calcula incorrectamente los umbrales de sincronización fonética.
