const knex = require('../conexao');
const securePassword = require("secure-password");
const pwd = securePassword();
const jwt = require("jsonwebtoken");
const jwtSecret = require('../jwt_secret');


const loginMorador = (req, res) => {

}
const cadastrarMorador = (req, res) => {

}
const listarMorador = (req, res) => {

}

const obterMorador = (req, res) => {

}

const editarMorador = (req, res) => {

}
const deletarMorador = (req, res) => {

}

module.exports = {
    loginMorador,
    cadastrarMorador,
    listarMorador,
    editarMorador,
    deletarMorador
}