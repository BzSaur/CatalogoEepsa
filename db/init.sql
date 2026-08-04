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

-- Insertar datos de prueba según la taxonomía de OpticTimes
INSERT INTO productos (sku, nombre, descripcion, precio_estimado, imagen_url, etiquetas, optic_times_id) VALUES
('CBL-ADSS-24', 'Cable ADSS 24 Hilos', 'Cable de fibra óptica monomodo ADSS de 24 hilos.', NULL, '/static/img/prueba1.jpg', '["cable", "adss", "monomodo", "24 hilos"]', '1205'),
('CON-SC-APC', 'Conector SC/APC', 'Conector rápido SC/APC para drop.', NULL, '/static/img/prueba2.jpg', '["conector", "sc", "apc", "fast connector"]', '1207'),
('SPL-1X8-PLC', 'Splitter PLC 1x8', 'Divisor óptico PLC 1x8 con conectores SC/APC.', NULL, '/static/img/prueba3.png', '["pasivo", "splitter", "1x8", "plc"]', '1208')
ON CONFLICT DO NOTHING;
