const { knex } = require('../conexao');
const securePassword = require("secure-password");
const pwd = securePassword();
const jwt = require("jsonwebtoken");
const jwtSecret = require('../jwt_secret');


const listarOcorrencias = async (req, res) => {
    try {
        const ocorrencias = await knex('ocorrencias');
        return res.json(ocorrencias);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao listar as ocorrências.' });
    }
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

const obterOcorrencia = async (req, res) => {
    try {
        const { id } = req.params;
        const ocorrencia = await knex('ocorrencias').where({ id }).first();

        if (!ocorrencia) {
            return res.status(404).json({ mensagem: 'Ocorrência não encontrada.' });
        }

        return res.json(ocorrencia);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao obter a ocorrência.' });
    }
}

const editarOcorrencia = async (req, res) => {

};


const deletarOcorrencia = async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await knex('ocorrencias')
            .where({ id })
            .del();

        if (resultado) {
            return res.status(200).json({ mensagem: 'Ocorrência deletada com sucesso.' });
        } else {
            return res.status(404).json({ mensagem: 'Ocorrência não encontrada.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao deletar a ocorrência.' });
    }
};

module.exports = {
    registrarOcorrencia,
    listarOcorrencias,
    obterOcorrencia,
    editarOcorrencia,
    deletarOcorrencia
}