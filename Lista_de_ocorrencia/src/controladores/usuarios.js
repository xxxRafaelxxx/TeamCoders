const { knex } = require('../conexao');
const securePassword = require("secure-password");
const pwd = securePassword();
const jwt = require("jsonwebtoken");
const jwtSecret = require('../jwt_secret');



const listarUsuarios = async (req, res) => {
    try {
        const moradores = await knex('moradores').select();
        const sindicos = await knex('sindicos').select();
        const porteiros = await knex('porteiros').select();
        const administradores = await knex('administradores').select();

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
}


const cadastrarUsuarios = async (req, res) => {
    try {
        const { condominio_id, nome, email, telefone, senha_hash, status } = req.body;
        let dadosUsuario;
        const { casa } = req.body;

        switch (status.toLowerCase().trim()) {
            case 'porteiro':
                await knex('porteiros').insert({
                    condominio_id,
                    nome,
                    email,
                    telefone,
                    senha_hash,
                    status
                });
                break;
            case 'sindico':
                dadosUsuario = { condominio_id, nome, email, telefone, senha_hash, status, casa };
                await knex('sindicos').insert(dadosUsuario); await knex('condominio')
                    .where('id', condominio_id)
                    .increment('moradores_total', 1)
                break;
            case 'morador':
                dadosUsuario = { condominio_id, nome, email, telefone, senha_hash, status, casa };
                await knex('moradores').insert(dadosUsuario);
                await knex('condominio')
                    .where('id', condominio_id)
                    .increment('moradores_total', 1)
                break;
            case 'administrador':
                dadosUsuario = { condominio_id, nome, email, telefone, senha_hash, status };
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
    const { id } = req.params;
    const { nome, email, telefone, senha_hash, status, casa, condominio_id } = req.body;

    let tabelaOrigem, tabelaDestino;
    switch (status.toLowerCase()) {
        case 'morador':
            tabelaDestino = 'moradores';
            break;
        case 'sindico':
            tabelaDestino = 'sindicos';
            break;
        case 'porteiro':
            tabelaDestino = 'porteiros';
            break;
        case 'administrador':
            tabelaDestino = 'administradores';
            break;
        default:
            return res.status(400).json({ erro: 'Tipo de usuário inválido.' });
    }

    const tabelas = ['moradores', 'sindicos', 'porteiros', 'administradores'];
    for (const tabela of tabelas) {
        const usuario = await knex(tabela).where({ id }).first();
        if (usuario) {
            tabelaOrigem = tabela;
            break;
        }
    }

    if (!tabelaOrigem) {
        return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    try {
        if (tabelaOrigem === tabelaDestino) {
            await knex(tabelaOrigem)
                .where({ id })
                .update({
                    nome,
                    email,
                    telefone,
                    senha_hash,
                    status,
                    casa
                });
        } else {

            await knex(tabelaDestino).insert({
                id,
                condominio_id,
                nome,
                email,
                telefone,
                senha_hash,
                status,
                casa
            });

            await knex(tabelaOrigem)
                .where({ id })
                .del();
        }

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
        const porteiros = await knex('porteiros');
        return res.json(porteiros);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao listar os porteiros.' });
    }
};

const listarSindicos = async (req, res) => {
    try {
        const sindicos = await knex('sindicos');
        return res.json(sindicos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao listar os sindicos.' });
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