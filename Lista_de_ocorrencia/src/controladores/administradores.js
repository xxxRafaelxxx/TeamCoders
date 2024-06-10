const { knex } = require('../conexao');
const securePassword = require("secure-password");
const pwd = securePassword();
const jwt = require("jsonwebtoken");
const jwtSecret = require('../jwt_secret');


const listarAdministrador = (req, res) => {

}

const obterAdmnistrador = (req, res) => {

}

const editarAdministrador = (req, res) => {

}
const deletarAdministrador = (req, res) => {

}

module.exports = {
    listarAdministrador,
    obterAdmnistrador,
    editarAdministrador,
    deletarAdministrador
}