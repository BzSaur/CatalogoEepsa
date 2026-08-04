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

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
