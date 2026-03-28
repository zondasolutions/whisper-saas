# HU-01: Arquitectura Zero-Retention y On-Premise

**Prioridad: ALTA (8.65 / 10)**
`(F: 7 × 0.3) + (I: 10 × 0.3) + (WTP: 10 × 0.25) + (FT: 7 × 0.15)`

**Sector:** Legal y Salud
**Dolores asociados:** D2

---

```
Como Oficial de Cumplimiento Médico / Abogado Socio Administrador,
quiero una modalidad de transcripción con garantías criptográficas de retención cero
o procesamiento aislado (On-Premise),
para poder transcribir largas declaraciones legales e historias clínicas de pacientes
sin vulnerar los requisitos penales y normativos de la HIPAA, RGPD y la Ley 25.326.
```

## Criterios de aceptación

- [ ] El sistema debe permitir una modalidad de procesamiento efímero donde la señal de audio cargada y los JSON/Textos generados se eliminen de la memoria volátil del servidor inmediatamente después de la entrega, sin grabar información en bases de datos secundarias.
- [ ] Disponibilidad de registros de auditoría completos (Audit Logs) para rastrear la identidad y permisos de acceso, sin visualizar los datos de la transcripción en los logs.
- [ ] Interfaz de exportación segura en un entorno que ofrezca encriptación de datos AES-256 (en reposo) y protocolos TLS (en tránsito).

## Evidencia

Obligaciones regulatorias ineludibles sobre datos sensibles de salud, penalizaciones financieras por infracciones a normativas de retención e impedimentos legales originados por la Ley de Privacidad Biométrica sobre huellas de voz (BIPA).
