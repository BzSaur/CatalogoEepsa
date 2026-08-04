# Documento de Requerimientos: Catálogo Interactivo y Asistente Nexi (EEPSA)

## 1. Descripción del Proyecto
Desarrollo de una Single Page Application (SPA) para el subdominio `catalogo.eepsa.com.mx`. El sistema permite a los usuarios consultar productos de dos maneras distintas (convencional o mediante un asistente virtual guiado) y finalizar con una simulación de cotización que invita a cerrar la venta offline. 

## 2. Arquitectura y Stack Tecnológico
El proyecto utilizará una arquitectura basada en contenedores (Docker) alojada en un servidor Synology NAS, gestionando el enrutamiento a través del Reverse Proxy del NAS hacia un registro DNS apuntando a la IP estática.

*   **Frontend:** React con TypeScript.
*   **Backend:** FastAPI (o Node.js) exponiendo una API REST ligera.
*   **Base de Datos:** PostgreSQL o MariaDB.
*   **Almacenamiento de Imágenes:** Carpeta física en el Synology NAS (`/volume1/docker/eepsa/img`), montada como volumen en el contenedor del backend para servirse como archivos estáticos.
*   **Estructura del Proyecto:** Monorepo (recomendado) para gestionar simultáneamente los entornos de frontend y backend.

---

## 3. Flujo de Pantallas (UI/UX)

### Pantalla 0: Integración en Inicio (`inicio_eepsa`)
*   **Elemento:** Banner gráfico incrustado en la página principal actual.
*   **Acción:** Botón "Consulta el catálogo interactivo con Nexi".
*   **Comportamiento:** Redirige al usuario a la SPA en el subdominio del catálogo.

### Pantalla 1: Selección de Experiencia (Bifurcación)
*   **Objetivo:** Dividir el flujo según la intención del usuario.
*   **Diseño:** *Split-screen* o dos tarjetas principales.
*   **Opciones:**
    *   *Opción A:* "No estoy seguro de qué necesito. Ayúdame a elegir" (Inicia Flujo 2A).
    *   *Opción B:* "Sé lo que busco. Explorar el catálogo" (Inicia Flujo 2B).

### Pantalla 2A: Asistente Interactivo "Nexi" (Sin IA)
*   **Objetivo:** Guiar al usuario mediante un árbol de decisiones estricto.
*   **Diseño:** Interfaz estilo mensajería (burbujas de chat).
*   **Interacción:** Nexi presenta preguntas con botones de opción múltiple (ej. [Bomba] [Motor] [Tablero]). No hay entrada de texto libre (input text) para el usuario.
*   **Lógica:** Cada respuesta filtra los productos en el frontend mediante etiquetas (`tags`).
*   **Resultado:** Al finalizar el árbol, se muestra un carrusel con 1 a 4 productos sugeridos, cada uno con su imagen, título y un botón "Agregar a mi cotización".

### Pantalla 2B: Catálogo Convencional
*   **Objetivo:** Exploración libre tipo e-commerce.
*   **Diseño:** Cuadrícula (Grid) de tarjetas de productos.
*   **Componentes:**
    *   Barra de búsqueda superior.
    *   Panel lateral (Sidebar) con filtros: Categoría, Especificaciones Técnicas, etc.
    *   *Product Card*: Imagen estática consumida desde el NAS, nombre, descripción corta, precio estimado y botón "Agregar a cotización".

### Pantalla 3: Cotizador (Simulador de Compra)
*   **Objetivo:** Resumen de la intención de compra.
*   **Diseño:** Tabla de artículos similar a un "Carrito de compras" (Imagen miniatura, nombre, cantidad ajustable, subtotal).
*   **Elementos clave:**
    *   Total estimado visible.
    *   *Disclaimer* visualmente destacado: "Los precios mostrados son estimados y de carácter informativo".
    *   **Call to Action (CTA) Finales:** 
        1. "Llamar a un asesor para cerrar pedido" (Acción `tel:`).
        2. "Ubicar tienda física" (Abre Google Maps).

---

## 4. Requerimientos de Base de Datos
Esquema relacional básico. La tabla principal de `productos` debe contener al menos:
*   `id` (Primary Key)
*   `sku` (String)
*   `nombre` (String)
*   `descripcion` (Text)
*   `precio_estimado` (Decimal)
*   `imagen_url` (String - Solo ruta relativa, ej: `/static/img/producto.jpg`)
*   `etiquetas` (JSON o Array - Fundamental para el filtrado del árbol de decisiones de Nexi).

## 5. Endpoints Principales de la API
*   `GET /api/productos`: Devuelve el catálogo completo. Soporta *query parameters* para filtros de la Pantalla 2B.
*   `GET /api/productos?tags=tag1,tag2`: Devuelve los productos que hagan *match* con las etiquetas seleccionadas en el flujo del Asistente Nexi.