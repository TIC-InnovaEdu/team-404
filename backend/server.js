const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb'); // Importa ObjectId

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://josearielargudovelez:lucario15@cluster0.rj4opdt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

let db;
client.connect().then(() => {
    db = client.db('juegoppw');
    console.log('Conectado a MongoDB');
});

// Registro de usuario
app.post('/registro', async (req, res) => {
    try {
        const usuarios = db.collection('usuarios');
        const result = await usuarios.insertOne(req.body);
        res.json({ ok: true, id: result.insertedId });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Guardar record (convierte usuario_id a ObjectId)
app.post('/guardar_record', async (req, res) => {
    try {
        const records = db.collection('records');
        const data = { ...req.body };
        if (data.usuario_id) {
            data.usuario_id = new ObjectId(data.usuario_id); // Convierte a ObjectId
        }
        const result = await records.insertOne(data);
        res.json({ ok: true, id: result.insertedId });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Leer records y mostrar nombre del usuario
app.get('/leer_records', async (req, res) => {
    try {
        const nivel = parseInt(req.query.nivel, 10);
        const records = db.collection('records');
        const result = await records.aggregate([
            { $match: { nivel } },
            { $sort: { tiempo_segundos: -1 } }, 
            {
                $group: {
                    _id: "$usuario_id",
                    tiempo_segundos: { $first: "$tiempo_segundos" },
                    nombre: { $first: "$nombre" },
                    record_id: { $first: "$_id" }
                }
            },
            { $sort: { tiempo_segundos: -1 } },
            { $limit: 5 }
        ]).toArray();

        res.json(result);
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Login
app.post('/login', async (req, res) => {
    try {
        const usuarios = db.collection('usuarios');
        const { nombre, clave } = req.body;
        const usuario = await usuarios.findOne({ nombre });
        if (!usuario) return res.json({ ok: false, error: 'Usuario no existe' });
        if (usuario.clave !== clave) return res.json({ ok: false, error: 'Clave incorrecta' });
        res.json({ ok: true, usuario });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor Node.js escuchando en puerto ${PORT}`);
});