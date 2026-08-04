CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio_estimado DECIMAL(10, 2),
    imagen_url VARCHAR(255),
    etiquetas JSONB
);

-- Insertar datos de prueba según la taxonomía de OpticTimes
INSERT INTO productos (sku, nombre, descripcion, precio_estimado, imagen_url, etiquetas) VALUES
('CBL-ADSS-24', 'Cable ADSS 24 Hilos', 'Cable de fibra óptica monomodo ADSS de 24 hilos.', NULL, '/static/img/cbl-adss-24.jpg', '["cable", "adss", "monomodo", "24 hilos"]'),
('CON-SC-APC', 'Conector SC/APC', 'Conector rápido SC/APC para drop.', NULL, '/static/img/con-sc-apc.jpg', '["conector", "sc", "apc", "fast connector"]'),
('SPL-1X8-PLC', 'Splitter PLC 1x8', 'Divisor óptico PLC 1x8 con conectores SC/APC.', NULL, '/static/img/spl-1x8-plc.jpg', '["pasivo", "splitter", "1x8", "plc"]')
ON CONFLICT DO NOTHING;
