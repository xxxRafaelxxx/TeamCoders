const { knex } = require('../conexao');
const securePassword = require("secure-password");
const pwd = securePassword();
const jwt = require("jsonwebtoken");
const jwtSecret = require('../jwt_secret');


const cadastrarCondominio = async (req, res) => {
    try {
        const { nome, email, senha_hash, moradores_total, localizacao } = req.body;


        await knex('condominio').insert({
            nome,
            email,
            senha_hash,
            moradores_total,
            localizacao
        });

        return res.status(201).json({ mensagem: 'Condomínio cadastrado com sucesso.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ erro: 'Erro ao cadastrar o condomínio.' });
    }
};

const cadastrarUsuarios = async (req, res) => {
    try {
        const { condominio_id, nome, email, telefone, senha_hash, status } = req.body;
        let dadosUsuario;
        const { casa } = req.body;

        switch (status.toLowerCase()) {
            case 'porteiro':
                await knex('porteiro').insert({
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
                await knex('administrador').insert(dadosUsuario);
                break;
            default:
                // Se for um tipo de usuário desconhecido, retornar um erro
                return res.status(400).json({ erro: 'Tipo de usuário inválido.' });
        }

        return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao cadastrar o usuário.' });
    }
};


const listarMoradores = async (req, res) => {
    const moradores = await knex('moradores');
    return res.json(moradores);
}
const listarPorteiros = async (req, res) => {
    const porteiros = await knex('porteiro');
    return res.json(porteiros);
}
const listarAdministrador = async (req, res) => {
    const adm = await knex('administrador');
    return res.json(adm);
}
const listarSindicos = async (req, res) => {
    const sindicos = await knex('sindicos');
    return res.json(sindicos);
}

const obterAdmnistrador = (req, res) => {

}

const editarAdministrador = (req, res) => {

}
const deletarAdministrador = (req, res) => {

}

module.exports = {
    cadastrarUsuarios,
    cadastrarCondominio,
    listarAdministrador,
    listarMoradores,
    listarSindicos,
    listarPorteiros,
    editarAdministrador,
    deletarAdministrador
}