const express = require('express')
const { cadastrarCondominio, listarCondominio, editarCondominio, obterCondominio, deletarCondominio } = require('./controladores/condominio');
const { registrarOcorrencia, listarOcorrencias, obterOcorrencia, editarOcorrencia, deletarOcorrencia } = require('./controladores/ocorrencias');
const { listarAdministrador, obterAdministrador, editarAdministrador, deletarAdministrador, cadastrarAdministrador } = require('./controladores/administradores');
const { listarUsuarios, cadastrarUsuarios, obterPerfil, listarPorteiros, listarSindicos, editarPerfil, deletarUsuario, listarMoradores } = require('./controladores/usuarios');
const { login } = require('./controladores/login');
const rotas = express();

rotas.use(express.json());

rotas.post('/usuario/cadastro/condominio', cadastrarCondominio);
rotas.post('/usuario/cadastro', cadastrarAdministrador);
rotas.post('/usuario/login', login);
// morador

rotas.get('/morador/perfil/:id', obterPerfil);
rotas.get('/morador/condominio/:id', obterCondominio);

rotas.post('/morador/ocorrencia/registrar/:condominio_id', registrarOcorrencia);

rotas.put('/morador/perfil/editar/:id', editarPerfil);
rotas.put('/morador/ocorrencia/editar/:id', editarOcorrencia);

rotas.delete('/morador/ocorrencia/deletar/:id', deletarOcorrencia);


// sindico
// rotas.get('/', listarCondominio);
rotas.get('/sindico/porteiros', listarPorteiros);
rotas.get('/sindico/sindicos', listarSindicos);

rotas.get('/sindico/perfil/:id', obterPerfil);
rotas.get('/sindico/condominio/:id', obterCondominio);

rotas.put('/sindico/perfil/editar/:id', editarPerfil);


rotas.post('/sindico/ocorrencia/registrar/:condominio_id', registrarOcorrencia);
// rotas.put('/:id', editarCondominio);
rotas.delete('/sindico/deletar/:id', deletarUsuario);
rotas.delete('/sindico/ocorrencia/deletar/:id', deletarOcorrencia);

// porteiro

rotas.get('/porteiro/perfil/:id', obterPerfil);
rotas.get('/porteiro/condominio/:id', obterCondominio);

rotas.put('/porteiro/perfil/editar/:id', editarPerfil);

rotas.post('/porteiro/ocorrencia/registrar/:condominio_id', registrarOcorrencia);

rotas.delete('/porteiro/ocorrencia/deletar/:id', deletarOcorrencia);


// administrador

rotas.get('/administrador/usuarios/:condominio_id', listarUsuarios);
rotas.get('/administrador/moradores', listarMoradores);
rotas.get('/administrador/administradores', listarAdministrador);
rotas.get('/administrador/porteiros/:condominio_id', listarPorteiros);
rotas.get('/administrador/sindicos/:condominio_id', listarSindicos);
rotas.get('/administrador/ocorrencias/:condominio_id', listarOcorrencias);
rotas.get('/administrador/condominios', listarCondominio);

rotas.get('/administrador/perfil/:tipo/:id', obterPerfil);
rotas.get('/administrador/ocorrencia/:id/:condominio_id', obterOcorrencia);
rotas.get('/administrador/condominio/:id', obterCondominio);

rotas.post('/administrador/usuarios/cadastrar/:condominio_id', cadastrarUsuarios)


rotas.patch('/administrador/perfil/editar/:tipo/:id', editarPerfil);
rotas.patch('/administrador/condominio/editar/:id', editarCondominio);
rotas.patch('/administrador/ocorrencias/:id', editarOcorrencia);

rotas.delete('/administrador/usuario/deletar/:tipo/:id', deletarUsuario);
rotas.delete('/administrador/ocorrencia/deletar/:id', deletarOcorrencia);
rotas.delete('/administrador/condominio/deletar/:id', deletarCondominio);


module.exports = rotas;