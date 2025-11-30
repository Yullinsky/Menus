# NutriMenu SMAE 🍎

Aplicación web profesional para la creación y gestión de menús dietéticos basados en el **Sistema Mexicano de Alimentos Equivalentes (SMAE)**.

Esta herramienta permite a nutriólogos y estudiantes calcular automáticamente el aporte nutricional (proteínas, lípidos, carbohidratos y energía) de los tiempos de comida de manera rápida y precisa.

## ✨ Características Principales

- **Cálculo Nutricional en Tiempo Real**: Sumatoria automática de macro y micronutrientes al agregar alimentos.
- **Base de Datos SMAE**: Incluye los grupos de alimentos y factores de conversión oficiales.
- **Gestión de Menús Flexible**:
  - Creación dinámica de tiempos de comida (Desayuno, Colación, Comida, Cena, etc.).
  - Ajuste de porciones y cálculo de equivalentes.
  - Resumen detallado por tiempo de comida y total diario.
- **Panel de Administración Seguro**:
  - Interfaz protegida para gestionar la base de datos de alimentos.
  - Funcionalidad completa para agregar, editar y eliminar alimentos.
- **Persistencia de Datos**: Conexión a base de datos en la nube para asegurar la disponibilidad de la información.
- **Interfaz Moderna**: Diseño limpio y responsivo con estética Glassmorphism.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React.js + Vite
- **Estilos**: CSS3 Moderno (Variables, Flexbox, Grid)
- **Base de Datos**: PostgreSQL (vía Supabase)
- **Autenticación**: Supabase Auth
- **Iconografía**: Lucide React

## 🚀 Configuración Local

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

### 1. Clonar el repositorio

```bash
git clone https://github.com/Yullinsky/menus-smae.git
cd menus-smae
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con tus credenciales de base de datos:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

### 4. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## 👤 Autor

Diseñado y desarrollado por **Yullinsky**.

[GitHub](https://github.com/Yullinsky/)
