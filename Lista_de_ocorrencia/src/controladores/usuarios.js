const { knex } = require('../conexao');
const securePassword = require("secure-password");
const pwd = securePassword();
const jwt = require("jsonwebtoken");
const jwtSecret = require('../jwt_secret');



const listarUsuarios = (req, res) => {

}


const cadastrarUsuarios = async (req, res) => {
    try {
        const { condominio_id, nome, email, telefone, senha_hash, status } = req.body;
        let dadosUsuario;
        const { casa } = req.body;

        switch (status.toLowerCase().trim()) {
            case 'porteiro':
                await knex('porteiros').insert({
                    condominio_id,
                    nome,
                    email,
                    telefone,
                    senha_hash,
                    status
                });
                break;
            case 'sindico':
                dadosUsuario = { condominio_id, nome, email, telefone, senha_hash, status, casa };
                await knex('sindicos').insert(dadosUsuario); await knex('condominio')
                    .where('id', condominio_id)
                    .increment('moradores_total', 1)
                break;
            case 'morador':
                dadosUsuario = { condominio_id, nome, email, telefone, senha_hash, status, casa };
                await knex('moradores').insert(dadosUsuario);
                await knex('condominio')
                    .where('id', condominio_id)
                    .increment('moradores_total', 1)
                break;
            case 'administrador':
                dadosUsuario = { condominio_id, nome, email, telefone, senha_hash, status };
                await knex('administradores').insert(dadosUsuario);
                break;
            default:
                return res.status(400).json({ erro: 'Tipo de usuário inválido.' });
        }

        return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao cadastrar o usuário.' });
    }
};


const obterPerfil = async (req, res) => {

};

const editarPerfil = async (req, res) => {

};

const deletarUsuario = async (req, res) => {

};


const listarPorteiros = async (req, res) => {

};

const listarSindicos = async (req, res) => {
    const sindicos = await knex('sindicos');
    return res.json(sindicos);
};

const listarMoradores = async (req, res) => {
    const moradores = await knex('moradores');
    return res.json(moradores);
};



module.exports = {
    listarUsuarios,
    cadastrarUsuarios,
    obterPerfil,
    editarPerfil,
    deletarUsuario,
    listarPorteiros,
    listarSindicos,
    listarMoradores
};