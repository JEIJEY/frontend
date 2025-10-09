// Importar dependencias
const express = require('express');
const cors = require('cors');
require('dotenv').config();



// Crear la aplicación de Express
const app = express();

// Definir el puerto desde variables de entorno o 3000 por defecto
const PORT = process.env.PORT || 3000;

// Indicar que la app usará CORS
app.use(cors());

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

