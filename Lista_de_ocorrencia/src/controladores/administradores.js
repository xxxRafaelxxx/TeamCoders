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

const editarAdministrador = (req, res) => {

};
const deletarAdministrador = (req, res) => {

};

module.exports = {
    listarAdministrador,
    obterAdmnistrador,
    editarAdministrador,
    deletarAdministrador
}