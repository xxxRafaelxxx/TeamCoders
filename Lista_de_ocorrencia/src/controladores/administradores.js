const { knex } = require('../conexao');
const securePassword = require("secure-password");
const pwd = securePassword();
const jwt = require("jsonwebtoken");
const jwtSecret = require('../jwt_secret');


const listarAdministrador = async (req, res) => {
    try {
        const administradores = await knex('administradores');
        return res.json(administradores);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao listar os administradores.' });
    }
};

const obterAdmnistrador = async (req, res) => {
    try {
        const { id } = req.params;
        const administrador = await knex('administradores')
            .where({ id });

        return res.json(administrador);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao listar os administradores.' });
    }
};

const cadastrarAdministrador = async (req, res) => {
    try {
        const { condominio_id, nome, email, telefone, senha_hash, status } = req.body;
        let dadosUsuario;

        if (!nome) {
            return res.status(400).json("O campo nome é obrigatorio");
        };
        if (!condominio_id) {
            return res.status(400).json("O campo condominio id é obrigatorio");
        };
        if (!email) {
            return res.status(400).json("O campo email é obrigatorio");
        };
        if (!senha_hash) {
            return res.status(400).json("O campo senha é obrigatorio");
        };
        if (!telefone) {
            return res.status(400).json("O campo telefone é obrigatorio");
        };
        if (!status) {
            return res.status(400).json("O campo status é obrigatorio");
        };


        try {
            const usuarioExistenteAdministrador = await knex('administradores').where({ email }).first();

            if (usuarioExistenteAdministrador) {
                return res.status(400).json("O email já está cadastrado");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao cadastrar o usuário.' });
        };

        const hash = (await pwd.hash(Buffer.from(senha_hash))).toString("hex");
        switch (status.toLowerCase().trim()) {
            case 'administrador':
                dadosUsuario = { condominio_id, nome, email, telefone, senha_hash: hash, status };
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


const editarAdministrador = (req, res) => {

};
const deletarAdministrador = (req, res) => {

};

module.exports = {
    listarAdministrador,
    obterAdmnistrador,
    editarAdministrador,
    deletarAdministrador,
    cadastrarAdministrador
}