const { knex } = require('../conexao');
const jwt = require("jsonwebtoken");
const jwtSecret = require('../jwt_secret');

const listarCondominio = async (req, res) => {
    const condominio = await knex('condominio');
    return res.json(condominio);
}
const obterCondominio = async (req, res) => {

};

const editarCondominio = async (req, res) => {

}
const deletarCondominio = async (req, res) => {

}

module.exports = {
    obterCondominio,
    listarCondominio,
    editarCondominio,
    deletarCondominio
};