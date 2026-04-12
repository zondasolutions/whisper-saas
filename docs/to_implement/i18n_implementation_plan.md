# Implementación de Internacionalización (i18n)

Implementaremos un sistema de multi-lenguaje (Inglés / Español) en el Frontend que reemplace los textos "hardcodeados" estáticos.

## Detección Geográfica Automática
Para cumplir con tu regla ("Español para Argentina, Inglés para el resto"), usaremos las APIs nativas del navegador del usuario sin necesidad de costosas bases de datos de IPs:

1. Evaluaremos la zona horaria: `Intl.DateTimeFormat().resolvedOptions().timeZone` (Si es alguna variante de `America/Argentina/X`, asumimos Argentina).
2. Como fallback evaluaremos su idioma configurado: `navigator.language` (Si incluye `es-AR`).
3. Todo lo que no caiga en estas reglas asignará el idioma Inglés (`en`) por defecto.
4. Ofreceremos un pequeño botón manual en el **Sidebar / Footer** para que el usuario pueda forzar el cambio si está de viaje o usa VPN.

## Herramientas propuestas
- Instalar **`i18next` y `react-i18next`**. Es el estándar en la industria para React, altamente optimizado, lo que mantendrá la plataforma hiper-rápida.

## User Review Required

> [!WARNING]
> **Refactorización Masiva en UI**
> Este cambio requerirá editar los 26 archivos `.jsx` de la aplicación (*Landing, Navbar, Sidebar, Pages, UploadArea, etc.*) para extraer sus textos estáticos y convertirlos en variables dinámicas tipo `{t('hero.title')}`.
>
> ¿Estás de acuerdo con generar un solo archivo global `translations.js` o prefieres que usemos archivos JSON separados ubicados en la carpeta `public/locales/`? (Recomiendo JSON separados para mayor escalabilidad a futuro).

## Proposed Changes

### Dependencies
- `npm install i18next react-i18next i18next-browser-languagedetector`

### Frontend Configuration

#### [NEW] `frontend/src/i18n.js`
Servirá para inicializar el motor de idiomas, conectarlo con `react-i18next` e inyectarle las funciones de detección de huso horario de Argentina.

#### [NEW] `frontend/src/locales/es.json`
Diccionario maestro con las traducciones.
#### [NEW] `frontend/src/locales/en.json`
Diccionario maestro de equivalencias en Inglés.

#### [MODIFY] `frontend/src/main.jsx`
Importar el contexto `i18n.js` antes de renderizar la aplicación para inyectar el estado reactivo del idioma.

#### [MODIFY] *26 Archivos `.jsx` del Frontend*
Inyectaremos el hook `const { t } = useTranslation()` en cada componente y reemplazaremos todos los textos visibles. Esto incluye:
- Landing Page (Hero, Features, Pricing)
- AppView (Upload Area, History, Paywall)
- Navbar / Footer / Sidebar

## Open Questions

> [!IMPORTANT]
> - Para empezar de inmediato, **traduciré el 100% de los elementos clave de los menús, botones y notificaciones de alertas**. Es un trabajo grande. ¿Apruebas este enfoque?
> - ¿Qué pasará con los Toasters de error que provienen desde el `Backend` en FastAPI (HTTP 403, 401)? ¿Quieres que el Backend siga arrojando el error en Inglés o prefieres que FastAPI también envíe diccionarios bilingües? (Recomiendo por ahora mantener el Backend en inglés y traducir todo el frontend, exceptuando los Toast nativos que el servidor envíe o bien mapearlos en el frontend).

## Verification Plan
1. Ejecutar el dev server localmente.
2. Usar las herramientas de desarrollador de Google Chrome para "simular" una zona horaria distinta (`Sensors` -> `Location` -> `Buenos Aires`). Refrescar y ver la app en Español.
3. Cambiar el sensor de Chrome a `London` u otra locación y ver la app saltar de inmediato a Inglés.
