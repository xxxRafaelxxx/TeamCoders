const { knex } = require('../conexao');
const securePassword = require("secure-password");
const pwd = securePassword();
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');
const nodemailer = require('../nodemailer');
const { text } = require('express');


const listarUsuarios = async (req, res) => {
    try {
        const { condominio_id } = req.params;

        if (!condominio_id) {
            return res.status(400).json("O campo condominio_id é obrigatorio");
        }

        const moradores = await knex('moradores').where({ condominio_id }).select();
        const sindicos = await knex('sindicos').where({ condominio_id }).select();
        const porteiros = await knex('porteiros').where({ condominio_id }).select();
        const administradores = await knex('administradores').where({ condominio_id }).select();

        const usuarios = {
            moradores,
            sindicos,
            porteiros,
            administradores
        };

        return res.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao listar os usuários.' });
    }
};


const cadastrarUsuarios = async (req, res) => {
    const { condominio_id } = req.params;
    try {
        const { nome, email, telefone, senha_hash, status, token } = req.body;
        let dadosUsuario;
        const { casa } = req.body

        if (!nome || !condominio_id || !email || !senha_hash || !telefone || !status || !token) {
            return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
        }

        let usuario;
        try {
            usuario = jwt.verify(token, jwtSecret);
        } catch (error) {
            return res.status(400).json({ erro: 'O token é inválido.' });
        }
        try {
            const usuarioExistentePorteiro = await knex('porteiros').where({ email }).first();
            const usuarioExistenteSindico = await knex('sindicos').where({ email }).first();
            const usuarioExistenteMorador = await knex('moradores').where({ email }).first();
            const usuarioExistenteAdministrador = await knex('administradores').where({ email }).first();

            if (usuarioExistentePorteiro || usuarioExistenteSindico || usuarioExistenteMorador || usuarioExistenteAdministrador) {
                return res.status(400).json("O email já está cadastrado");
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao cadastrar o usuário.' });
        };

        const hash = (await pwd.hash(Buffer.from(senha_hash))).toString("hex");
        switch (status.toLowerCase().trim()) {
            case 'porteiro':
                await knex('porteiros').insert({
                    condominio_id,
                    nome,
                    email,
                    telefone,
                    senha_hash: hash,
                    status
                });
                break;
            case 'sindico':
                dadosUsuario = { condominio_id, nome, email, telefone, senha_hash: hash, status, casa };
                await knex('sindicos').insert(dadosUsuario);
                await knex('condominio')
                    .where('id', condominio_id)
                    .increment('moradores_total', 1);
                break;
            case 'morador':
                dadosUsuario = { condominio_id, nome, email, telefone, senha_hash: hash, status, casa };
                await knex('moradores').insert(dadosUsuario);
                await knex('condominio')
                    .where('id', condominio_id)
                    .increment('moradores_total', 1);
                break;
            case 'administrador':
                dadosUsuario = { condominio_id, nome, email, telefone, senha_hash: hash, status };
                await knex('administradores').insert(dadosUsuario);
                break;
            default:
                return res.status(400).json({ erro: 'Tipo de usuário inválido.' });
        }

        // const dadosEnvio = {
        //     from: 'Codolog <nao-responder@sandboxc5a9087332d94d95a529fa103f5aec83.mailgun.org>',
        //     to: email,
        //     subject: 'Bem vindo ao Codolog',
        //     text: `Olá ${nome}. Você foi cadastrado no nosso site e ja pode fazer o login com o email: ${email} e a ${senha_hash}.
        //     OBS:essa é uma senha padrão lembre de troca-la`
        // }

        // await nodemailer.sendMail(dadosEnvio);

        return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao cadastrar o usuário.' });
    }
};


const obterPerfil = async (req, res) => {
    const { id, tipo } = req.params;

    try {
        let usuario;
        switch (tipo.toLowerCase()) {
            case 'morador':
                usuario = await knex('moradores').where({ id }).first();
                break;
            case 'sindico':
                usuario = await knex('sindicos').where({ id }).first();
                break;
            case 'porteiro':
                usuario = await knex('porteiros').where({ id }).first();
                break;
            case 'administrador':
                usuario = await knex('administradores').where({ id }).first();
                break;
            default:
                return res.status(400).json({ erro: 'Tipo de usuário inválido.' });
        }

        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        return res.status(200).json(usuario);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao obter o perfil do usuário.' });
    }
};


const editarPerfil = async (req, res) => {
    const { id, tipo } = req.params;
    const { email, telefone, senha_hash } = req.body;

    try {
        let tabela;
        switch (tipo.toLowerCase()) {
            case 'morador':
                tabela = 'moradores';
                break;
            case 'sindico':
                tabela = 'sindicos';
                break;
            case 'porteiro':
                tabela = 'porteiros';
                break;
            case 'administrador':
                tabela = 'administradores';
                break;
            default:
                return res.status(400).json({ erro: 'Tipo de usuário inválido.' });
        }

        const usuario = await knex(tabela).where({ id }).first();
        if (!usuario) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        let updateFields = {};
        if (email) {
            updateFields.email = email;
        }
        if (telefone) {
            updateFields.telefone = telefone;
        }
        if (senha_hash) {
            // Hash da senha, se fornecida
            const hash = (await pwd.hash(Buffer.from(senha_hash))).toString("hex");
            updateFields.senha_hash = hash;
        }

        await knex(tabela).where({ id }).update(updateFields);

        return res.status(200).json({ mensagem: 'Usuário atualizado com sucesso.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao atualizar o usuário.' });
    }
};



const deletarUsuario = async (req, res) => {
    const { tipo, id } = req.params;

    let tabela;
    switch (tipo.toLowerCase()) {
        case 'morador':
            tabela = 'moradores';
            break;
        case 'sindico':
            tabela = 'sindicos';
            break;
        case 'porteiro':
            tabela = 'porteiros';
            break;
        case 'administrador':
            tabela = 'administradores';
            break;
        default:
            return res.status(400).json({ erro: 'Tipo de usuário inválido.' });
    }

    try {
        const resultado = await knex(tabela)
            .where({ id })
            .del();

        if (resultado) {
            return res.status(200).json({ mensagem: 'Usuário deletado com sucesso.' });
        } else {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao deletar o usuário.' });
    }
};


const listarPorteiros = async (req, res) => {
    try {
        const { condominio_id } = req.params;

        if (!condominio_id) {
            return res.status(400).json("O campo condominio_id é obrigatorio");
        }

        const porteiros = await knex('porteiros').where({ condominio_id }).select();

        const usuarios = {
            porteiros,
        };

        return res.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao listar os usuários.' });
    }
};

const listarSindicos = async (req, res) => {
    try {
        const { condominio_id } = req.params;

        if (!condominio_id) {
            return res.status(400).json("O campo condominio_id é obrigatorio");
        }

        const sindicos = await knex('sindicos').where({ condominio_id }).select();

        return res.status(200).json(sindicos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao listar os usuários.' });
    }
};

const listarMoradores = async (req, res) => {
    try {
        const moradores = await knex('moradores');
        return res.json(moradores);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao listar os moradores.' });
    }
};



module.exports = {
    listarUsuarios,
    cadastrarUsuarios,
    obterPerfil,
    editarPerfil,
    deletarUsuario,
    listarPorteiros,
    listarSindicos,
    listarMoradores
};