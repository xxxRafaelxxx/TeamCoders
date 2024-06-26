const { knex } = require('../conexao');
const securePassword = require('secure-password');
const pwd = securePassword();
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email) {
        return res.status(400).json("O campo email é obrigatório");
    }
    if (!senha) {
        return res.status(400).json("O campo senha é obrigatório");
    }

    try {
        // Verifique nas diferentes tabelas
        const usuarioExistentePorteiro = await knex('porteiros').where({ email }).first();
        const usuarioExistenteSindico = await knex('sindicos').where({ email }).first();
        const usuarioExistenteMorador = await knex('moradores').where({ email }).first();
        const usuarioExistenteAdministrador = await knex('administradores').where({ email }).first();

        // Combine todos os resultados em uma variável
        const usuario = usuarioExistentePorteiro || usuarioExistenteSindico || usuarioExistenteMorador || usuarioExistenteAdministrador;

        if (!usuario) {
            return res.status(400).json("O email ou senha incorretos");
        }

        // Verifique a senha
        const result = await pwd.verify(Buffer.from(senha), Buffer.from(usuario.senha_hash, 'hex'));

        if (result === securePassword.INVALID || result === securePassword.INVALID_UNRECOGNIZED_HASH) {
            return res.status(400).json("O email ou senha incorretos");
        }

        // Rehash da senha se necessário
        if (result === securePassword.VALID_NEEDS_REHASH) {
            try {
                const improvedHash = await pwd.hash(Buffer.from(senha));
                if (usuarioExistentePorteiro) {
                    await knex('porteiros').where({ id: usuario.id }).update({ senha_hash: improvedHash.toString('hex') });
                } else if (usuarioExistenteSindico) {
                    await knex('sindicos').where({ id: usuario.id }).update({ senha_hash: improvedHash.toString('hex') });
                } else if (usuarioExistenteMorador) {
                    await knex('moradores').where({ id: usuario.id }).update({ senha_hash: improvedHash.toString('hex') });
                } else if (usuarioExistenteAdministrador) {
                    await knex('administradores').where({ id: usuario.id }).update({ senha_hash: improvedHash.toString('hex') });
                }
            } catch (err) {
                console.error('Erro ao rehash a senha:', err);
            }
        }

        // Gerar token JWT
        const token = jwt.sign({ id: usuario.id, nome: usuario.nome, email: usuario.email, status: usuario.status, condominio_id: usuario.condominio_id }, jwtSecret, { expiresIn: '1h' });

        return res.status(200).json({ mensagem: 'Login realizado com sucesso,', token, status: usuario.status });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ erro: 'Erro ao realizar login' });
    }
};

module.exports = { login };
