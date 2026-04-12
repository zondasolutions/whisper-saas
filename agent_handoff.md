# 🚀 Handoff Document & System Prompt: Whisper SaaS MVP

Este documento está diseñado para ser introducido como **Contexto / Instrucción Inicial (Prompt)** para cualquier Agente de Inteligencia Artificial o Desarrollador que se una al proyecto, con el fin de que posean el contexto absoluto del estado actual y las tareas inminentes.

---

## 📌 1. Contexto del Proyecto y Propuesta de Valor
**Proyecto:** Whisper SaaS MVP
**Objetivo:** Una plataforma de transcripción web hiper-rápida B2B que procesa archivos de audio (basado en Whisper de OpenAI) acoplada a una estricta política de privacidad **"Zero-Retention"** (El servidor no guarda audios ni textos transcribidos).

**Modelo Freemium Definido:**
- **Anónimos:** Máximo de 3 minutos por audio. Sin historial retenido.
- **Registrados (Free Tier):** Máximo 30 minutos de uso por mes / 3 min máximo por archivo. Con historial local.
- **Premium (Pro Tier):** Suscripción mensual ($15 USD) con Fair Use de **1200 minutos (20 horas)**. Máximo 120 minutos por archivo.

---

## 🛠 2. Stack Tecnológico
- **Frontend:** React (Vite), Tailwind CSS, Framer Motion para animaciones. Estética Glassmorphism moderna.
- **Backend:** FastAPI (Python), PostgreSQL, SQLAlchemy (ORM).
- **Worker/Procesamiento:** Trabajadores Serverless en RunPod utilizando GPUs (con dependencias de Whisper/PyAnnote).
- **Almacenamiento Efímero:** Cloudflare R2 (Presigned URLs limitadas por tiempo para extrema seguridad).

---

## ✅ 3. Estado Actual (Lo que ya está implementado)
Todo el progreso reciente se encuentra respaldado en la rama repositorio: `feature/auth-quotas`.

1. **El Flujo Web Principal (`AppView.jsx`):** Es totalmente funcional. Se conecta con la API de subida (R2) y el Worker (RunPod) polleando por estados asincrónicos.
2. **Reproductor y Exportaciones (`TranscriptionResult.jsx`):** Los resultados muestran un reproductor nativo interactivo HTML5 sincronizado párrafo por párrafo con la transcripción (el texto se ilumina según avanza el audio o viceversa). Existen módulos listos de descarga de TXT y SRT nativos del navegador.
3. **Privacidad de Historial "Zero-Retention" (`HistoryView.jsx`):** Los historiales no tocan la base de datos de PostgreSQL. Todo se codifica de forma segura en el **`localStorage`** del navegador bajo la clave `whisper_history_v1`. El historial cuenta con vista y borrado para usuarios conectados.
4. **Barrera Freemium Parcial (`UploadArea.jsx`):** Se interceptan los binarios de audio en el DOM, se detecta su duración en javascript y bloquea envíos > 3 minutos para los no-logeados.
5. **Componente de Cobro Visual (`PaywallModal.jsx`):** Un modal Premium ya maquetado para interceder cuando el usuario choca contra las cuotas.
6. **Backend Models:** Contamos con `users`, `plans`, `subscriptions` vinculados al proveedor MercadoPago, y se estructuró el modelo fundamental para cuotas mensuales: `UserUsage` (trackea `month_year` y `seconds_used`).

---

## 🎯 4. Próximos Pasos (Tareas para tí)

Tu objetivo inmediato como Desarrollador/Agente en este repositorio es completar la **Integración de Auth y Cuotas (Billing)** uniendo las piezas de Backend y Frontend:

### Paso A: Autenticación Completa (Full-Stack)
- **Frontend Auth Context:** Actualizar o crear un estado global en React (`AuthContext`) que defina la variable `isLoggedIn` a lo largo de la aplicación.
- Conectar la pantalla de login/registro existente usando JWT con las rutas de FastAPI `/api/v1/users`.

### Paso B: Limitación de Cuotas Estricta (Backend)
- Cuando el endpoint FastAPI de transcripción termine exitosamente o despache un evento, debes incrementar el campo `seconds_used` del modelo `UserUsage` de ese usuario.
- Modificar el flujo de validación en Python para que la petición devuelva error/403 si el usuario excede sus 1200 minutos (Premium) o 30 minutos (Free) basándose en su `subscription.status`.

### Paso C: Integración de Pagos en Frontend (MercadoPago)
- Conectar los botones de upgrade del diseño `PaywallModal.jsx` a la pasarela y modelo pre-diseñado de Mercado Pay en el backend.
- Cambiar el usuario a Premium en BD dinamicamente tras recibir los Webhooks de pago de MercadoPago.

---

**Nota Operacional:** Debes mantener estrictos los estándares de legibilidad, comentarios y evitar cambiar la estética "Glassmorphism" y oscura existente en Tailwind. ¡Iniciá revisando los modelos FastAPI primero!
