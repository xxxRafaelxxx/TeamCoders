const express = require('express')
const { knex } = require('./conexao');
const { cadastarCondominio, listarCondominio, editarCondominio, obterCondominio, deletarCondominio } = require('./controladores/condominio');
const { cadastrarMorador, loginMorador, listarMorador, obterMorador, editarMorador, deletarMorador } = require('./controladores/moradores');
const { cadastrarOcorrencia, listarOcorrencia, editarOcorrencia, deletarOcorrencia } = require('./controladores/ocorrencias');
const { cadastrarUsuarios, cadastrarCondominio, listarMoradores, listarSindicos, listarAdministrador, listarPorteiros } = require('./controladores/administradores');
const rotas = express();

rotas.use(express.json());

// // morador
// rotas.get('/', listarMorador);
// rotas.get('/:id', obterMorador);
// rotas.post('/', cadastrarMorador);
// rotas.post('/', loginMorador);
// rotas.put('/:id', editarMorador);
// rotas.delete('/:id', deletarMorador);

// // sindico
// rotas.get('/', listarCondominio);
// rotas.get('/:id', obterCondominio);
// rotas.post('/', cadastarCondominio);
// rotas.put('/:id', editarCondominio);
// rotas.delete('/:id', deletarCondominio);

// porteiro

// adiministrador

rotas.get('/administrador/moradores', listarMoradores)
rotas.get('/administrador/sindicos', listarSindicos)
rotas.get('/administrador/administradores', listarAdministrador)
rotas.get('/administrador/porteiro', listarPorteiros)
rotas.get('/administrador/ocorrencias', listarOcorrencia)
rotas.get('/administrador/condominio', listarCondominio)
rotas.post('/administrador/cadastarCondominio', cadastrarCondominio)
rotas.post('/administrador/cadastrarUsuarios', cadastrarUsuarios)
//ocorrencias




module.exports = rotas;