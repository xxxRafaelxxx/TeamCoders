require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rotas = require('./rotas');
const app = express();

// Lista de origens permitidas (whitelist) para produção
const whitelist = ['http://127.0.0.1:5500'];

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Cabeçalhos permitidos
};

// Aplicando as opções de CORS
app.use(cors(corsOptions));

// Middleware para tratar JSON
app.use(express.json());

// Adicionando as rotas
app.use(rotas);

// Middleware de erro para tratar erros de CORS
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Unauthorized (CORS)');
    } else {
        next(err);
    }
});


// Iniciando o servidor na porta 3000
app.listen(3000);
