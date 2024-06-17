const express = require('express')
const { knex } = require('./conexao');
const { cadastrarCondominio, listarCondominio, editarCondominio, obterCondominio, deletarCondominio } = require('./controladores/condominio');
const { registrarOcorrencia, listarOcorrencias, obterOcorrencia, editarOcorrencia, deletarOcorrencia } = require('./controladores/ocorrencias');
const { listarAdministrador, obterAdministrador, editarAdministrador, deletarAdministrador } = require('./controladores/administradores');
const { listarUsuarios, cadastrarUsuarios, obterPerfil, listarPorteiros, listarSindicos, editarPerfil, deletarUsuario, listarMoradores } = require('./controladores/usuarios');
const rotas = express();

// testar rotas de ocorrencias;

rotas.use(express.json());

// morador

rotas.get('/morador/perfil/:id', obterPerfil);
rotas.get('/morador/condominio/:id', obterCondominio);

rotas.post('/morador/ocorrencia/registrar', registrarOcorrencia);

rotas.put('/morador/editar/:id', editarPerfil);


// sindico
// rotas.get('/', listarCondominio);
rotas.get('/sindico/porteiros', listarPorteiros);
rotas.get('/sindico/sindicos', listarSindicos);

rotas.get('/sindico/perfil/:id', obterPerfil);
rotas.get('/sindico/condominio/:id', obterCondominio);

rotas.put('/sindico/perfil/editar/:id', editarPerfil);


rotas.post('/sindico/ocorrencia/registrar', registrarOcorrencia);
// rotas.put('/:id', editarCondominio);
rotas.delete('/sindico/deletar/:id', deletarUsuario);

// porteiro

rotas.get('/porteiro/perfil/:id', obterPerfil);
rotas.get('/porteiro/condominio/:id', obterCondominio);

rotas.put('/porteiro/perfil/editar/:id', editarPerfil);

rotas.post('/porteiro/ocorrencia', registrarOcorrencia);



// adiministrador

rotas.get('/administrador/usuarios', listarUsuarios);
rotas.get('/administrador/moradores', listarMoradores);
rotas.get('/administrador/administradores', listarAdministrador);
rotas.get('/administrador/porteiros', listarPorteiros);
rotas.get('/administrador/sindicos', listarSindicos);
rotas.get('/administrador/ocorrencias', listarOcorrencias);
rotas.get('/administrador/condominios', listarCondominio);

rotas.get('/administrador/perfil/:id', obterPerfil);
rotas.get('/administrador/condominio/:id', obterCondominio);

rotas.post('/administrador/condominio/cadastrar', cadastrarCondominio)
rotas.post('/administrador/Usuarios/cadastrar', cadastrarUsuarios)

rotas.put('/administrador/perfil/editar/:id', editarPerfil);
rotas.put('/administrador/condominio/editar/:id', editarCondominio);

rotas.delete('/administrador/usuario/deletar/:id', deletarUsuario);
rotas.delete('/administrador/ocorrencia/deletar/:id', deletarOcorrencia);
rotas.delete('/administrador/condominio/deletar/:id', deletarCondominio);


module.exports = rotas;