const { knex } = require('../conexao');
const securePassword = require("secure-password");
const pwd = securePassword();
const jwt = require("jsonwebtoken");
const jwtSecret = require('../jwt_secret');



const listarOcorrencia = async (req, res) => {
    // adim
    const ocorrencia = await knex('ocorrencias');
    return res.json(ocorrencia);
}

const registrarOcorrencia = async (req, res) => {
    // sind ou mor
    try {
        const { morador_id, assunto, tipo_ocorrencia, nota } = req.body;
        await knex('ocorrencias').insert({
            morador_id,
            assunto,
            tipo_ocorrencia,
            nota
        });
        return res.status(201).json({ mensagem: 'Ocorrência registrada com sucesso.' });
    } catch (error) {
        return res.status(500).json({ erro: 'Erro ao registrar a ocorrência.' });
    }
}

const obterOcorrencia = (req, res) => {

}

const editarOcorrencia = (req, res) => {

}
const deletarOcorrencia = (req, res) => {

}

module.exports = {
    registrarOcorrencia,
    listarOcorrencia,
    editarOcorrencia,
    deletarOcorrencia
}