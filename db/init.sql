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

-- =================================================================
-- TEMPLATE PARA LLENAR EL CATÁLOGO DE PRODUCTOS (PRODUCCIÓN)
-- =================================================================
-- Usa esta estructura para insertar los productos oficiales de OpticTimes.
-- Cada producto debe agregarse copiando y pegando una línea.
-- Las categorías DEBEN escribirse exactamente como aparecen aquí en el JSON de etiquetas.

INSERT INTO productos (sku, nombre, descripcion, precio_estimado, imagen_url, etiquetas, optic_times_id) VALUES

-- -----------------------------------------------------------------
-- 1. Equipo Activo (Subcategorías: OLT, ONU/ONT, Mini Nodos)
-- -----------------------------------------------------------------
('ZG6516', 'ZG6516 16 Puertos GPON OLT (4x10GE + 2xGE)', 'Dispositivo de acceso óptico GPON con fuente de alimentación y ventilador de diseño modular. Ofrece alta confiabilidad de grado operador y potentes funciones de protección de seguridad (como ACL, ataque anti DoS) para satisfacer las necesidades de acceso de fibra de larga distancia.', 35000.00, 'https://oms.optictimes.mx/file/makeup/02b985b008c543b3911c4385742018f4.jpg', '["Equipo Activo", "OLT"]', '1161'),
('ZG6508', 'ZG6508 8 Puertos GPON OLT (4x10GE + 2xGE)', 'Dispositivo de acceso óptico GPON con fuente de alimentación y ventilador de diseño modular. El producto tiene una fuerte capacidad de acceso GPON, fiabilidad a nivel de operador y capacidades comerciales flexibles QINQ, ideal para acceso de fibra óptica de baja densidad.', 22000.00, 'https://oms.optictimes.mx/file/makeup/4856f19455c34df5a1dce56a79049e8a.jpg', '["Equipo Activo", "OLT"]', '1160'),
('ZX8102WT', 'ONU GPON/EPON 1RF + 1GE + 1FE + 2.4G WiFi', 'Los equipos ONUs GPON/EPON están diseñados para cumplir y operar en las redes FTTX. Ideal si se requiere enviar servicios triple play. Cuenta con tecnología basada en un Chipset Realtek, alto desempeño entre rendimiento y costo.', 550.00, 'https://oms.optictimes.mx/file/makeup/1898983865242451968.jpg', '["Equipo Activo", "ONU/ONT"]', '1205'),
('ZX8102W', 'ONU GPON/EPON 1GE + 1FE + 2.4G WiFi', 'Los equipos ONUs GPON/EPON están diseñados para cumplir y operar en las redes FTTX. Cuenta con tecnología basada en un Chipset Realtek de alto desempeño entre rendimiento y costo.', 450.00, 'https://oms.optictimes.mx/file/makeup/1898978883101360128.jpg', '["Equipo Activo", "ONU/OLT"]', '1201'),
('ZX8414DWL', 'ONU GPON/EPON Doble Banda 4GE+1POT+WiFi 5G', 'Equipo terminal doble banda (AC1200) diseñado para cumplir y operar en las redes FTTX. Cuenta con tecnología basada en un Chipset Realtek de alto desempeño e integra comunicación dual Wi-Fi 5.', 950.00, 'https://oms.optictimes.mx/file/makeup/1900427900188459008.jpg', '["Equipo Activo", "ONU/ONT"]', '1221'),
('OPT-1000M-2', 'Mini Nodo Óptico CATV OPT-1000M-2 (1550nm)', 'Con un diseño compacto y eficiente, este mini nodo está diseñado para ofrecer una transmisión de señales de video y audio a través de red de fibra óptica. Su bajo consumo y tamaño reducido facilita la integración en infraestructuras FTTX.', 650.00, 'https://oms.optictimes.mx/file/makeup/1900141158914949120.png', '["Equipo Activo", "Mini Nodos"]', '1220'),
-- -----------------------------------------------------------------
-- 2. CATV
-- -----------------------------------------------------------------
('WT-1550-2-10', 'Transmisor Óptico 1550nm Modulación Externa (2x10dBm)', 'La serie WT-1550-2-10 es un transmisor óptico de modulación externa equipado con láser DFB de banda estrecha y modulador LiNbO3. Es la opción ideal para transmisión a larga distancia y el equipo central del sistema de red 1550nm para triple play y FTTx.', 65000.00, 'https://oms.optictimes.mx/file/makeup/1905512687831973888.jpg', '["CATV", "Transmisor"]', '1244'),
('OT-1550-2-10', 'Transmisor Óptico 1550nm Modulación Interna (2x10dBm)', 'Transmisor óptico láser DFB diseñado para operar en 1550nm. Está optimizado para aplicaciones de fibra óptica en redes FTTx, distribución CATV y sistemas de comunicación, siendo idóneo para conectar con amplificadores EDFA.', 18500.00, 'https://oms.optictimes.mx/file/makeup/1882252445715365888.jpg', '["CATV", "Transmisor"]', '1198'),
('MEA-3219W', 'Amplificador EDFA WDM 32 Puertos (1550nm)', 'Amplificador de Fibra Dopada con Erbio (EDFA) de 32 salidas con módulo WDM incorporado (combina OLT PON 1310/1490/1270/1577nm con CATV 1550nm). Optimiza la transmisión de contenidos HD y supera la atenuación de fibra en larga distancia.', 55000.00, 'https://oms.optictimes.mx/file/makeup/91b4612d5107441187af312666ed3d06.jpg', '["CATV", "EDFA"]', '1189'),
('MEA-1619W', 'Amplificador EDFA WDM 16 Puertos (1550nm)', 'Amplificador de Fibra Dopada con Erbio (EDFA) de 16 salidas con módulo WDM integrado (1270/1310/1490/1577nm). Supera la atenuación de la fibra en transmisiones de larga distancia y mejora notablemente la calidad de transmisión CATV.', 32000.00, 'https://oms.optictimes.mx/file/makeup/7ee6b87da7ed4823aeb465ba21b9c174.jpg', '["CATV", "EDFA"]', '1188'),

-- -----------------------------------------------------------------
-- 3. Cable de Fibra Óptica
-- -----------------------------------------------------------------
('ADSS-12B1-100-S', 'Cable de Fibra Óptica ADSS (12 Hilos, Span 100) - Carrete 5km', 'Cable autosustentable totalmente dieléctrico diseñado para instalaciones aéreas (Span 100m) sin necesidad de soporte metálico. Ideal para despliegues cercanos a líneas eléctricas. Alta resistencia a la intemperie y tracción de 2200N.', 28000.00, 'https://oms.optictimes.mx/file/makeup/1966430520970280960.jpg', '["Cable de Fibra Óptica", "ADSS"]', '1184'),
('ASU-6B1-80M', 'Cable de Fibra Óptica Mini ADSS (6 Hilos, Span 80) - Carrete 5km', 'Cable autosustentable completamente dieléctrico diseñado para instalaciones aéreas (Span 80m). Su diseño compacto y ligero (Mini ADSS/ASU) facilita la instalación reduciendo la carga sobre estructuras, ideal para despliegues FTTH.', 12500.00, 'https://oms.optictimes.mx/file/makeup/1966430196922548224.jpg', '["Cable de Fibra Óptica", "Mini ADSS"]', '1185'),
('GYXTC8Y-6B1', 'Cable de Fibra Óptica Mini Figura 8 (6 Hilos) - Carrete 5km', 'Solución compacta para redes aéreas con mensajero de acero galvanizado integrado que proporciona soporte estructural. Ideal para despliegues autosustentables. Resistente a condiciones adversas y radiación UV con tracción de 1500N.', 14000.00, 'https://oms.optictimes.mx/file/makeup/1966431094935617536.jpg', '["Cable de Fibra Óptica", "Mini Figura 8"]', '1186'),
('GJYXCH-1B6', 'Cable de Fibra Óptica Drop Plana (1 Hilo) - Carrete 2km', 'Cable Drop (Acometida) plano con cubierta LSZH diseñado especialmente para la conexión final en redes FTTH. Cuenta con un mensajero de acero galvanizado (1mm) y es ideal para despliegues tanto interiores como exteriores.', 1500.00, 'https://oms.optictimes.mx/file/makeup/1966431826585812992.jpg', '["Cable de Fibra Óptica", "Drop"]', '1200'),
('GYTS-6', 'Cable de Fibra Óptica Armado GYTS (6 Hilos) - Carrete 5km', 'Solución exterior de alto rendimiento con armadura de cinta de acero y cubierta PE. Su diseño de tubo holgado ofrece protección física extrema contra roedores y aplastamiento. Ideal para conductos subterráneos y redes metropolitanas de larga distancia.', 20000.00, 'https://oms.optictimes.mx/file/makeup/1949672730922811392.png', '["Cable de Fibra Óptica", "Cable Armado"]', '1293'),

-- -----------------------------------------------------------------
-- 4. Herramientas FTTH
-- -----------------------------------------------------------------
('FTB-C01-144', 'Panel de Conexión de Fibra Óptica ODF 144 Hilos (4U)', 'Panel distribuidor de fibra óptica (ODF) de 144 puertos para montaje en Rack de 19". Fabricado en acero laminado en frío con diseño de cajón extraíble deslizable, facilitando el empalme y la gestión del cableado. Soporta adaptadores SC, LC, FC o ST.', 3200.00, 'https://oms.optictimes.mx/file/makeup/1907332462195343360.jpg', '["Herramientas FTTH", "ODF"]', '1249'),
('FTB-C01-96', 'Panel de Conexión de Fibra Óptica ODF 96 Hilos (3U)', 'Panel distribuidor de fibra óptica (ODF) de 96 puertos para montaje en Rack de 19". Diseño de 3U de altura con cajón deslizante de aluminio y autobloqueo. Ideal para distribución de pigtails en redes LAN, WAN y FTTH.', 2400.00, 'https://oms.optictimes.mx/file/makeup/1907329560517115904.jpg', '["Herramientas FTTH", "ODF"]', '1248'),
('GJS-H016T', 'Cierre de Empalme / CTO IP65 16 Hilos (con 2x Splitter 1:8)', 'Caja de terminación óptica (CTO) con clasificación IP65 impermeable. Diseñada como punto de terminación para conectar el cable alimentador con el de distribución en redes FTTx. Incluye divisores PLC duales 1:8 y soporta hasta 16 fusiones.', 450.00, 'https://oms.optictimes.mx/file/makeup/1946117792674316288.jpg', '["Herramientas FTTH", "Cierre de Empalme"]', '1290'),
('FDB-TX2-16C', 'Caja NAP de Distribución FDB de 16 Núcleos IP65', 'Caja de distribución NAP (Network Access Point) diseñada como punto de acceso intermedio entre la red troncal y los abonados. Fabricada en PC+ABS con protección UV y clasificación IP65 para exterior. Permite empalmes, división y distribución en una sola unidad FTTH.', 400.00, 'https://oms.optictimes.mx/file/makeup/1905103772338192384.jpg', '["Herramientas FTTH", "Cajas de Distribución (NAP)"]', '1242'),
('PLC-16-SA', 'Mini Divisor PLC 1x16 Monomodo (Conectores SC/APC)', 'Divisor óptico PLC de tipo guía de ondas planar para distribución de potencia óptica. Tiene un diseño compacto, baja pérdida de inserción (PDL) y opera entre 1260nm y 1650nm. Particularmente adecuado para dividir la señal en redes ópticas pasivas GPON/EPON.', 120.00, 'https://oms.optictimes.mx/file/makeup/1910576470911844352.jpg', '["Herramientas FTTH", "Divisores & WDM"]', '1259'),

-- -----------------------------------------------------------------
-- 5. Herrajes
-- -----------------------------------------------------------------
('ANY-0910', 'Remate Preformado para ADSS de 9.5 a 10.5mm (Span 100)', 'Abrazadera de tensión (extremo muerto prefabricado) diseñada para conectar de forma segura cables ADSS a postes eléctricos o de telecomunicaciones. Fabricada con acero revestido de aluminio, distribuye la tensión de manera uniforme evitando la sobrecarga en vanos menores a 100m.', 35.00, 'https://oms.optictimes.mx/file/makeup/1915290859552342016.png', '["Herrajes", "Preformados"]', '1277'),
('JJ-D-05', 'Herraje Tipo D Pequeño en Hierro Galvanizado', 'Accesorio de sujeción antivibración en forma de "D", utilizado en instalaciones aéreas para fijar cables de diámetro reducido (Drop o Mini Figura 8) a postes o estructuras de soporte. Fabricado en hierro Q235 galvanizado por inmersión en caliente, altamente resistente a la corrosión.', 15.00, 'https://oms.optictimes.mx/file/makeup/1965584166245072896.png', '["Herrajes", "Tipo D"]', '1295'),
('JJ-SC-05', 'Herraje de Suspensión Tipo J para Cable ADSS', 'Gancho de suspensión tipo J desarrollado para soportar cables ADSS (10-20mm) en soluciones FTTH aéreas exteriores sobre postes intermedios. Fabricado en acero galvanizado (4mm de espesor) y plástico resistente a rayos UV. Soporta una tensión de 8KN.', 40.00, 'https://oms.optictimes.mx/file/makeup/1967401139278938112.jpg', '["Herrajes", "Herraje Tipo J"]', '1296'),

-- -----------------------------------------------------------------
-- 6. Tranceptores
-- -----------------------------------------------------------------
('SFP-10G-CWDM80-1470', 'Módulo SFP+ 10G CWDM 80km (1470nm)', 'Transceptor óptico CWDM SFP+ de 10Gbps con conector dúplex LC. Ideal para redes Gigabit Ethernet y transmisión a larga distancia de hasta 80km sobre fibra monomodo (SMF) mediante tecnología EML/APD.', 4500.00, 'https://oms.optictimes.mx/file/makeup/1921803109431738368.jpg', '["Tranceptores", "Tranceptores Ópticos"]', '1288'),
('SFP-10G-CWDM40-1470', 'Módulo SFP+ 10G CWDM 40km (1470nm)', 'Transceptor óptico CWDM SFP+ de 10Gbps con conector dúplex LC. Facilita la transmisión de datos a alta velocidad soportando enlaces de hasta 40km sobre fibra monomodo (SMF) con tecnología EML/PIN.', 2200.00, 'https://oms.optictimes.mx/file/makeup/1921776811300847616.jpg', '["Tranceptores", "Tranceptores Ópticos"]', '1287'),
('FMC-100M-80', 'Convertidor de Medios Fast Ethernet 10/100M (80km)', 'Convertidor de medios (Cobre a Fibra) con 1 puerto RJ45 (10/100Mbps) y 1 puerto óptico SC. Utiliza fibra óptica monomodo dual en longitud de onda 1550nm, logrando ampliar la distancia de comunicación de red Fast Ethernet hasta 80km. Equipo Plug & Play ideal para FTTx y oficinas.', 400.00, 'https://oms.optictimes.mx/file/makeup/1911969683442728960.jpg', '["Tranceptores", "Convertidores de Medios"]', '1263'),
-- -----------------------------------------------------------------
-- 7. Ensambles Ópticos
-- -----------------------------------------------------------------
('JUP-SC-FC-3M', 'Jumper de Fibra Óptica Simplex SC/APC a FC/APC (3m, 0.9mm)', 'Puente de fibra óptica (Patch Cord) monomodo simplex de 3 metros de longitud con cubierta amarilla (LSZH/PVC). Conectores SC/APC en un extremo y FC/APC en el otro. Ideal para conexión de corto alcance entre equipos ópticos y distribuidores (ODF).', 25.00, 'https://oms.optictimes.mx/file/makeup/1914525672037646336.jpg', '["Ensambles Ópticos", "Jumpers"]', '1272'),
('JUP-SC-SC-3M', 'Jumper de Fibra Óptica Simplex SC/APC a SC/APC (3m, 0.9mm)', 'Puente de fibra óptica (Patch Cord) monomodo simplex de 3 metros de longitud con cubierta LSZH amarilla. Conectores SC/APC en ambos extremos. El estándar ideal para conectar equipos terminales ONU o distribuidores ODF.', 22.00, 'https://oms.optictimes.mx/file/makeup/1912414883566813184.jpg', '["Ensambles Ópticos", "Jumpers"]', '1264'),
('JUP-FC-FC-3M', 'Jumper de Fibra Óptica Simplex FC/APC a FC/APC (3m, 0.9mm)', 'Puente de fibra óptica (Patch Cord) monomodo simplex de 3 metros con cubierta amarilla (LSZH/PVC). Conectores FC/APC de rosca metálica en ambos extremos. Ideal para aplicaciones de CATV y equipos que requieren conexión ultra segura de baja pérdida.', 25.00, 'https://oms.optictimes.mx/file/makeup/1914207256684756992.jpg', '["Ensambles Ópticos", "Jumpers"]', '1270'),
('OPT-FC7D-APC', 'Conector Rápido Mecánico SC/APC (Fast Connector)', 'Consumible pasivo diseñado para operar en redes FTTX (instalaciones domésticas). Permite armar el conector en frío (sin empalmadora) garantizando la continuidad del servicio. Cuenta con seguro semi automático para una inserción de fibra en 50 segundos y pérdida de inserción ≤ 0.5 dB.', 12.00, 'https://oms.optictimes.mx/file/makeup/1904458332798287872.jpg', '["Ensambles Ópticos", "Conectores mecánicos"]', '1234'),
('JUP-LC12-1.5-OM3-Bunch', 'Pigtail Manojo de 12 Fibras OM3 Multimodo (1.5m, LC/UPC)', 'Pigtail de fibra óptica Multimodo OM3 (Aqua) en presentación de manojo (bunch) de 12 hilos. Tiene conectores LC/UPC preinstalados en un extremo y fibra expuesta en el otro. Diseñado para pelarse y empalmarse por fusión dentro de un panel de conexión (ODF) y "descomponer" un cable multifibra.', 350.00, 'https://oms.optictimes.mx/file/makeup/1916764337686151168.jpg', '["Ensambles Ópticos", "Pigtails"]', '1281'),
('SC-APC-SX', 'Acoplador Óptico SC/APC Simplex Monomodo', 'Adaptador (acoplador o cople) utilizado en redes de fibra óptica para unir conectores SC/APC de manera eficiente. Cuenta con un manguito interno de cerámica de circonio que garantiza una conexión de alta calidad con mínima pérdida de inserción. Ideal para ODFs y cajas NAP.', 3.00, 'https://oms.optictimes.mx/file/makeup/1907677842867060736.JPG', '["Ensambles Ópticos", "Acopladores"]', '1250'),
-- -----------------------------------------------------------------
-- 8. Medición y Fusión
-- -----------------------------------------------------------------
('EJEMPLO-MED', 'Empalmadora por Núcleo', 'Empalmadora de alineación directa.', 0.00, 'https://oms.optictimes.mx/file/makeup/1966433080754012160.jpg', '["Medición y Fusión"]', '1000'),

-- -----------------------------------------------------------------
-- 9. Kits de Fibra Óptica
-- -----------------------------------------------------------------
('FTK-MX-09', 'Kit de Herramientas FTTH para Fibra Óptica (8 Piezas)', 'Maletín portátil con 8 herramientas indispensables para la instalación, reparación y mantenimiento de redes FTTx. Incluye cortadora de precisión, localizador visual de fallos (VFL), peladoras, tijeras para Kevlar, limpiadores y dispensador. Ideal para terminación y preparación de empalmes en campo.', 1800.00, 'https://oms.optictimes.mx/file/makeup/1966434447010791424.jpg', '["Kits de Fibra Óptica", "Kit de Instalación FTTX"]', '1282'),
-- -----------------------------------------------------------------
-- 10. Redes IT
-- -----------------------------------------------------------------
('S3500-24T4F', 'Switch Gestionable L2 de 24 Puertos Gigabit + 4 Uplinks SFP', 'Conmutador (Switch) de gestión de capa 2 con 24 puertos RJ45 Gigabit (10/100/1000Mbps) y 4 puertos SFP 1G de enlace ascendente (Uplink). Capacidad de conmutación de 56 Gbps. Soporta VLAN, MSTP, QoS, LACP y seguridad 802.1x/Radius.', 3200.00, 'https://oms.optictimes.mx/file/makeup/52867186c81b44f0a0aacddfe43d64fe.png', '["Redes e IT", "Switch"]', '1157'),
('MG7002', 'Gateway Multifunción Empresarial 6 Puertos (Multi-WAN, Cortafuegos, SD-WAN)', 'Pasarela de seguridad nivel empresarial (Router/Firewall/Gateway) con 5 puertos Gigabit y 1 puerto 2.5G. Integra enrutamiento Multi-WAN, balanceo de carga, cortafuegos y controlador de AP (hasta 32 equipos). Ideal para control inteligente del tráfico y redes VPN/SD-WAN de sucursales.', 4500.00, 'https://oms.optictimes.mx/file/makeup/1881609746700140544.png', '["Redes e IT", "Gateway"]', '1196'),
('AP6760', 'Punto de Acceso Inalámbrico Exterior Wi-Fi 6 (AX3000, IP67)', 'Access Point (AP) para exteriores de alto rendimiento con tecnología Wi-Fi 6 (802.11ax) de doble banda y puerto WAN de 2.5G. Cuenta con antenas omnidireccionales MU-MIMO 2x2 alcanzando velocidades de 3000Mbps. Diseño robusto IP67, ideal para soportar hasta 128 usuarios simultáneos.', 7500.00, 'https://oms.optictimes.mx/file/makeup/1980558107258617856.jpg', '["Redes e IT", "AC&AP"]', '1320'),
('AP6660', 'Punto de Acceso Inalámbrico de Techo Wi-Fi 6 (AX3000)', 'Access Point (AP) para interiores de montaje en techo con tecnología Wi-Fi 6 (802.11ax) de doble banda. Ofrece velocidades de hasta 3000Mbps mediante radios duales MU-MIMO 2x2. Cuenta con 2 puertos Gigabit (WAN/LAN) y soporte PoE 802.3af. Ideal para oficinas, hoteles y salas de conferencias.', 3200.00, 'https://oms.optictimes.mx/file/makeup/1980556711683653632.jpg', '["Redes e IT", "AC&AP"]', '1319')
ON CONFLICT DO NOTHING;
