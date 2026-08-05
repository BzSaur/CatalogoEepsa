CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio_estimado DECIMAL(10, 2),
    imagen_url VARCHAR(255),
    etiquetas JSONB,
    optic_times_id VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS cotizaciones (
    id SERIAL PRIMARY KEY,
    folio VARCHAR(50) UNIQUE NOT NULL,
    estado VARCHAR(50) DEFAULT 'Pendiente',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cotizacion_items (
    id SERIAL PRIMARY KEY,
    cotizacion_id INTEGER REFERENCES cotizaciones(id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES productos(id),
    cantidad INTEGER NOT NULL
);

-- Insertar datos de prueba según la taxonomía oficial de OpticTimes
INSERT INTO productos (sku, nombre, descripcion, precio_estimado, imagen_url, etiquetas, optic_times_id) VALUES
('CBL-ADSS-24', 'Cable ADSS 24 Hilos', 'Cable de fibra óptica monomodo ADSS de 24 hilos.', 450.50, '/static/img/prueba1.jpg', '["Cable de Fira Optica"]', '1205'),
('CBL-DROP-1', 'Cable Drop Plano 1 Hilo', 'Cable drop plano para acometida FTTH.', 12.00, '/static/img/prueba2.jpg', '["Cable de Fira Optica"]', '1206'),
('CON-SC-APC', 'Conector Rápido SC/APC', 'Conector mecánico prepulido SC/APC para red PON.', 25.00, '/static/img/prueba3.jpg', '["Ensambles Opticos"]', '1207'),
('HER-TENS-D', 'Tensor Dieléctrico', 'Herraje tensor dieléctrico para cable ADSS.', 85.30, '/static/img/prueba4.jpg', '["Herajes"]', '1208'),
('NAP-16-OUT', 'Caja NAP 16 Puertos Exterior', 'Caja de distribución óptica (NAP) para exteriores con 16 puertos.', 850.00, '/static/img/prueba5.jpg', '["redes it"]', '1209')
ON CONFLICT DO NOTHING;
