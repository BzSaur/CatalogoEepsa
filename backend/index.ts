import express, { Request, Response } from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Servir la carpeta de imágenes estáticas (volumen montado del NAS)
app.use('/static/img', express.static('/app/public/img'));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.get('/api/productos', async (req: Request, res: Response) => {
  try {
    const { tags } = req.query;
    
    let query = 'SELECT * FROM productos';
    const values: string[] = [];

    if (tags && typeof tags === 'string') {
        const tagList = tags.split(',');
        // Construimos una query para checar si el arreglo JSONB contiene CUALQUIERA de los tags
        query += ' WHERE etiquetas ?| $1';
        values.push(tagList as any);
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/cotizaciones', async (req: Request, res: Response) => {
  const { cart } = req.body;
  
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'El carrito está vacío o es inválido' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Generar un folio único (ej. EEPSA-COT-7429)
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const folio = `EEPSA-COT-${randomNum}`;

    const quoteRes = await client.query(
      'INSERT INTO cotizaciones (folio) VALUES ($1) RETURNING id',
      [folio]
    );
    const quoteId = quoteRes.rows[0].id;

    // Guardar los items
    for (const item of cart) {
      await client.query(
        'INSERT INTO cotizacion_items (cotizacion_id, producto_id, cantidad) VALUES ($1, $2, $3)',
        [quoteId, item.id, item.cantidad]
      );
    }

    await client.query('COMMIT');

    // -------------------------------------------------------------
    // TODO: PUNTO DE INTEGRACIÓN CON SINV
    // -------------------------------------------------------------
    // Aquí es donde el equipo de SINV deberá enviar el JSON a su API.
    // Ejemplo:
    // await fetch('https://api.sinv.mx/webhooks/nueva_cotizacion', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     folio: folio,
    //     items: cart
    //   })
    // });
    // -------------------------------------------------------------

    res.json({ success: true, folio, message: 'Cotización generada correctamente' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating quote:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
