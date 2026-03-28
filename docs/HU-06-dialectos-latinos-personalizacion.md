# HU-06: Compensación de Dialectos Latinos y Personalización Semántica

**Prioridad: MEDIA (6.90 / 10)**
`(F: 8 × 0.3) + (I: 7 × 0.3) + (WTP: 4 × 0.25) + (FT: 9 × 0.15)`

**Sector:** Periodismo / Soporte LatAm
**Dolores asociados:** D1

---

```
Como Reportero de Medios Latinoamericanos / Analista de Calidad de Call Centers,
quiero que el motor de inferencia procese e interprete con precisión modismos dialectales
de España, Centroamérica o la región Andino-Rioplatense, y acepte diccionarios específicos
para nombres corporativos,
para anular la necesidad de re-escritura masiva de alucinaciones introducidas por modelos ASR
sobre-entrenados en fonemas estándar anglosajones o exclusivamente ibéricos.
```

## Criterios de aceptación

- [ ] Apalancar versiones comprobadas como Whisper Large-v3 Turbo, demostradamente más resistentes y precisas a variaciones dialectales intrarregionales.
- [ ] Capacidad de integrar a nivel del sistema un campo dinámico de vocabulario en el que el usuario introduzca nombres propios de marcas, ciudades de la región o acrónimos especializados antes del procesamiento, condicionando las inferencias del tensor subyacente.

## Evidencia

Divergencias estadísticas notables en los índices de error (WER) cuando Whisper evalúa el español latinoamericano, produciendo omisiones problemáticas (como eliminación de consonantes no pronunciadas por acentos locales, e.g. "s" implosiva) frente al desempeño casi perfecto en el dialecto ibérico.
