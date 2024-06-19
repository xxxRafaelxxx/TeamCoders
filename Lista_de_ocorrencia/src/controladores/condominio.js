const { knex } = require('../conexao');
const jwt = require("jsonwebtoken");
const jwtSecret = require('../jwt_secret');


const cadastrarCondominio = async (req, res) => {
    try {
        const { nome, email, senha_hash, localizacao } = req.body;


        await knex('condominio').insert({
            nome,
            email,
            senha_hash,
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
    const { id } = req.params;
    const condominio = await knex('condominio')
        .where({ id });

    return res.json(condominio);
};

const editarCondominio = async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha_hash, localizacao } = req.body;

    try {
        // Verifica se o condomínio existe
        const condominioExistente = await knex('condominio').where({ id }).first();
        if (!condominioExistente) {
            return res.status(404).json({ mensagem: 'Condomínio não encontrado.' });
        }

        // Atualiza os dados do condomínio
        await knex('condominio')
            .where({ id })
            .update({
                nome,
                email,
                senha_hash,
                localizacao
            });

        return res.status(200).json({ mensagem: 'Condomínio atualizado com sucesso.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ erro: 'Erro ao atualizar o condomínio.' });
    }
}
const deletarCondominio = async (req, res) => {
    const { id } = req.params;
    try {

        const resultado = await knex('condominio')
            .where({ id })
            .del();

        if (resultado) {
            return res.status(200).json({ mensagem: 'Condomínio deletado com sucesso.' });
        } else {
            return res.status(404).json({ mensagem: 'Condomínio não encontrado.' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ erro: 'Erro ao deletar o condomínio.' });
    }
};

module.exports = {
    cadastrarCondominio,
    obterCondominio,
    listarCondominio,
    editarCondominio,
    deletarCondominio
};