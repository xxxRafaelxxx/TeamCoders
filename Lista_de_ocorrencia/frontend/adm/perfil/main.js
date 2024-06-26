'use strict';

let editingMode = false; // Variável para controlar o modo de edição

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('Token não encontrado');
        return;
    }

    getUserInfo(token);

    const editarBtn = document.getElementById('editar-btn');

    if (editarBtn) {
        editarBtn.addEventListener('click', () => {
            if (!editingMode) {
                enableEdit(); // Habilita os campos para edição
                editarBtn.textContent = 'Salvar'; // Altera o texto do botão para "Salvar"
            } else {
                if (validateFields()) { // Verifica se os campos estão preenchidos corretamente
                    saveUserInfo(token); // Salva as informações editadas
                    editarBtn.textContent = 'Editar'; // Altera o texto do botão de volta para "Editar"
                }
            }
            editingMode = !editingMode; // Alterna o modo de edição
        });
    } else {
        console.error('Elemento editar-btn não encontrado');
    }
});

const getUserInfo = async (token) => {
    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;
        const status = decodedToken.status;
        const condominioId = decodedToken.condominio_id;

        const userInfoResponse = await fetch(`http://localhost:3000/administrador/perfil/${status}/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!userInfoResponse.ok) {
            throw new Error('Erro ao obter informações do usuário');
        }

        const userInfo = await userInfoResponse.json();

        const condominioResponse = await fetch(`http://localhost:3000/administrador/condominio/${condominioId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!condominioResponse.ok) {
            throw new Error('Erro ao obter informações do condomínio');
        }

        const condominioInfo = await condominioResponse.json();

        fillUserInfo(condominioInfo, userInfo);

    } catch (error) {
        console.error('Erro ao obter informações do usuário:', error);
    }
};

const fillUserInfo = (condominioInfo, userInfo) => {
    document.getElementById('condominio').value = condominioInfo.nome;
    document.getElementById('nome').value = userInfo.nome;
    document.getElementById('telefone').value = userInfo.telefone;
    document.getElementById('email').value = userInfo.email;
    document.getElementById('senha').value = ''; // Limpa o campo de senha para segurança

    disableFormFields(); // Desabilita os campos do formulário após preencher
};

const enableEdit = () => {
    document.getElementById('telefone').disabled = false;
    document.getElementById('email').disabled = false;
    document.getElementById('senha').disabled = false; // Habilita campo de senha para edição
};

const disableFormFields = () => {
    document.getElementById('telefone').disabled = true;
    document.getElementById('email').disabled = true;
    document.getElementById('condominio').disabled = true;
    document.getElementById('senha').disabled = true; // Desabilita campo de senha após salvar
};

const validateFields = () => {
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;

    if (!nome.trim() || !telefone.trim() || !email.trim()) {
        console.error('Por favor, preencha todos os campos.');
        return false;
    }

    return true;
};

const saveUserInfo = async (token) => {
    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;
        const status = decodedToken.status;

        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        let dadosUsuario = {
            nome,
            telefone,
            email,
            senha_hash: senha,

        };

        const response = await fetch(`http://localhost:3000/administrador/perfil/editar/${status}/${userId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosUsuario),
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar informações do usuário');
        }

        console.log('Informações do usuário salvas com sucesso');
        disableFormFields(); // Após salvar, desabilita os campos novamente
    } catch (error) {
        console.error('Erro ao salvar informações do usuário:', error);
    }
};

const toggleMostrarSenha = () => {
    const campoSenha = document.getElementById('senha');
    const checkboxMostrarSenha = document.getElementById('mostrar-senha');

    if (checkboxMostrarSenha.checked) {
        campoSenha.type = 'text'; // Mostra a senha
    } else {
        campoSenha.type = 'password'; // Oculta a senha
    }
};

