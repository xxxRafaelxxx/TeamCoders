const express = require('express')
const { knex } = require('./conexao');
const { cadastrarCondominio, listarCondominio, editarCondominio, obterCondominio, deletarCondominio } = require('./controladores/condominio');
const { registrarOcorrencia, listarOcorrencia, editarOcorrencia, deletarOcorrencia } = require('./controladores/ocorrencias');
const { cadastrarCondominio, listarMoradores, listarSindicos, listarAdministrador, listarPorteiros } = require('./controladores/administradores');
const { listarUsuarios, cadastrarUsuarios, obterPerfil, listarPorteiros, listarSindicos } = require('./controladores/usuarios');
const rotas = express();

rotas.use(express.json());

// // morador

rotas.get('/morador/condominio/:id', obterCondominio);
rotas.get('/morador/perfil/:id', obterPerfil);
rotas.post('/morador/ocorrencia', registrarOcorrencia);
// rotas.put('/:id', editarMorador);
// rotas.delete('/:id', deletarMorador);

// // sindico
// rotas.get('/', listarCondominio);
rotas.get('/sindico/porteiros', listarPorteiros);
rotas.get('/sindico/sindicos', listarSindicos);

rotas.get('/sindico/perfil/:id', obterPerfil);
rotas.get('/sindico/:id', obterCondominio);
rotas.post('/sindico/ocorrencia', registrarOcorrencia);
// rotas.put('/:id', editarCondominio);
// rotas.delete('/:id', deletarCondominio);

// porteiro

rotas.get('/porteiro/perfil/:id', obterPerfil);
rotas.get('/porteiro/condominio/:id', obterCondominio);

rotas.post('/porteiro/ocorrencia', registrarOcorrencia);



// adiministrador

rotas.get('/administrador/usuarios', listarUsuarios)
rotas.get('/administrador/administradores', listarAdministrador)
rotas.get('/administrador/porteiro', listarPorteiros)
rotas.get('/administrador/ocorrencias', listarOcorrencia)
rotas.get('/administrador/condominio', listarCondominio)

rotas.get('/administrador/:id', obterCondominio);
rotas.get('/administrador/:id', obterPerfil);

rotas.post('/administrador/cadastarCondominio', cadastrarCondominio)
rotas.post('/administrador/cadastrarUsuarios', cadastrarUsuarios)



module.exports = rotas;