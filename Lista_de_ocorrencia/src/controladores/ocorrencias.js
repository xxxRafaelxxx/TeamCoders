const { knex } = require('../conexao');
const securePassword = require("secure-password");
const pwd = securePassword();
const jwt = require("jsonwebtoken");
const jwtSecret = require('../jwt_secret');


const listarOcorrencias = async (req, res) => {
    try {
        const { condominio_id } = req.params;

        if (!condominio_id) {
            return res.status(400).json("O campo condominio_id é obrigatorio");
        }

        const ocorrencias = await knex('ocorrencias')
            .leftJoin('moradores', 'ocorrencias.morador_id', 'moradores.id')
            .leftJoin('sindicos', 'ocorrencias.sindico_id', 'sindicos.id')
            .leftJoin('porteiros', 'ocorrencias.porteiro_id', 'porteiros.id')
            .select(
                'ocorrencias.*',
                'moradores.condominio_id as morador_condominio_id',
                'sindicos.condominio_id as sindico_condominio_id',
                'porteiros.condominio_id as porteiro_condominio_id'
            )
            .where('moradores.condominio_id', condominio_id)
            .orWhere('sindicos.condominio_id', condominio_id)
            .orWhere('porteiros.condominio_id', condominio_id);

        return res.status(200).json(ocorrencias);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao listar as ocorrências.' });
    }

};

const listarOcorrenciasDoUsuario = async (req, res) => {
    try {
        const { id, status, condominio_id } = req.params;

        if (!condominio_id || !id || !status) {
            return res.status(400).json("Os campos condominio_id, id e status são obrigatórios");
        }

        const ocorrencias = await knex('ocorrencias')
            .leftJoin('moradores', 'ocorrencias.morador_id', 'moradores.id')
            .leftJoin('sindicos', 'ocorrencias.sindico_id', 'sindicos.id')
            .leftJoin('porteiros', 'ocorrencias.porteiro_id', 'porteiros.id')
            .select(
                'ocorrencias.*',
                'moradores.condominio_id as morador_condominio_id',
                'sindicos.condominio_id as sindico_condominio_id',
                'porteiros.condominio_id as porteiro_condominio_id'
            )
            .where(function () {
                this.where('moradores.id', id).andWhere('moradores.condominio_id', condominio_id).andWhere('moradores.status', status)
                    .orWhere('sindicos.id', id).andWhere('sindicos.condominio_id', condominio_id).andWhere('sindicos.status', status)
                    .orWhere('porteiros.id', id).andWhere('porteiros.condominio_id', condominio_id).andWhere('porteiros.status', status);
            });

        return res.status(200).json(ocorrencias);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao listar as ocorrências.' });
    }
};



const registrarOcorrencia = async (req, res) => {
    const { condominio_id } = req.params;
    console.log(req.body);
    if (!condominio_id) {
        return res.status(400).json("O campo condominio_id é obrigatorio");
    }

    try {
        const { morador_id, sindico_id, porteiro_id, assunto, tipo_ocorrencia, nota, data_ocorrido, status } = req.body;

        if (!morador_id && !sindico_id && !porteiro_id) {
            return res.status(400).json({ erro: 'É necessário especificar quem registrou a ocorrência (morador_id, sindico_id ou porteiro_id).' });
        }

        if ((morador_id && sindico_id) || (morador_id && porteiro_id) || (sindico_id && porteiro_id)) {
            return res.status(400).json({ erro: 'A ocorrência só pode ser registrada por um morador, um síndico ou um porteiro, não mais de um ao mesmo tempo.' });
        }

        await knex('ocorrencias').insert({
            morador_id,
            sindico_id,
            porteiro_id,
            condominio_id,
            assunto,
            tipo_ocorrencia,
            nota,
            data_ocorrido,
            status
        });

        return res.status(201).json({ mensagem: 'Ocorrência registrada com sucesso.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao registrar a ocorrência.' });
    }
};



const obterOcorrencia = async (req, res) => {
    try {
        const { id, condominio_id } = req.params;
        const ocorrencia = await knex('ocorrencias').where({ id, condominio_id }).first();

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
    // sindico, morador ou porteiro
    const { id } = req.params;
    const { assunto, tipo_ocorrencia, nota, data_ocorrido, foto, status } = req.body;

    const ocorrenciaExistente = await knex('ocorrencias').where({ id }).first();
    if (!ocorrenciaExistente) {
        return res.status(404).json({ mensagem: 'Ocorrência não encontrada.' });
    }
    try {
        await knex('ocorrencias').where({ id }).update({

            assunto,
            tipo_ocorrencia,
            nota,
            data_ocorrido,
            foto,
            status
        });

        return res.status(200).json({ mensagem: 'Ocorrência editada com sucesso.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao editar a ocorrência.' });
    }
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
    listarOcorrenciasDoUsuario,
    listarOcorrencias,
    obterOcorrencia,
    editarOcorrencia,
    deletarOcorrencia
}