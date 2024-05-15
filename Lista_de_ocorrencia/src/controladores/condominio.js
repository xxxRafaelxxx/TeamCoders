const { knex } = require('../conexao');
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

const listarCondominio = async (req, res) => {
    const condominio = await knex('condominio');
    return res.json(condominio);
};

const obterCondominio = async (req, res) => {

};

const editarCondominio = async (req, res) => {

}
const deletarCondominio = async (req, res) => {

}

module.exports = {
    cadastrarCondominio,
    obterCondominio,
    listarCondominio,
    editarCondominio,
    deletarCondominio
};