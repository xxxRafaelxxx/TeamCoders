'use strict';

let editingMode = false;
let sindicoId;
let sindicoStatus;

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('Token não encontrado');
        return;
    }

    try {
        await getUserInfo(token);

        const editarBtn = document.getElementById('editar-btn');
        if (editarBtn) {
            editarBtn.addEventListener('click', async () => {
                if (!editingMode) {
                    enableEdit();
                    editarBtn.textContent = 'Salvar';
                } else {
                    if (validateFields()) {
                        await saveUserInfo(token);
                        editarBtn.textContent = 'Editar';
                    }
                }
                editingMode = !editingMode;
            });
        } else {
            console.error('Elemento editar-btn não encontrado');
        }
    } catch (error) {
        console.error('Erro ao carregar informações do condomínio:', error);
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

        const sindicoInfoResponse = await fetch(`http://localhost:3000/administrador/sindicos/${condominioId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!sindicoInfoResponse.ok) {
            throw new Error('Erro ao obter informações do síndico');
        }

        const sindicoInfo = await sindicoInfoResponse.json();

        fillUserInfo(condominioInfo, userInfo, sindicoInfo);
    } catch (error) {
        console.error('Erro ao obter informações do usuário:', error);
    }
};

const fillUserInfo = (condominioInfo, userInfo, sindicoInfo) => {
    document.getElementById('condominio-nome').textContent = condominioInfo.nome;
    document.getElementById('total-moradores').textContent = condominioInfo.moradores_total;
    document.getElementById('localizacao').textContent = condominioInfo.localizacao;
    document.getElementById('contato-sindico').textContent = sindicoInfo.length > 0 ? sindicoInfo[0].telefone : 'N/A';
    document.getElementById('email-administracao').textContent = userInfo.email;
    document.getElementById('numero-administracao').textContent = userInfo.telefone;
    document.getElementById('numero-portaria').textContent = condominioInfo.telefone_portaria;

    // Armazena o ID e o status do síndico para uso posterior
    if (sindicoInfo.length > 0) {
        sindicoId = sindicoInfo[0].id;
        sindicoStatus = sindicoInfo[0].status;
    }

    disableFormFields();
};

const enableEdit = () => {
    document.getElementById('contato-sindico').contentEditable = true;
    document.getElementById('email-administracao').contentEditable = true;
    document.getElementById('numero-administracao').contentEditable = true;
    document.getElementById('numero-portaria').contentEditable = true;
};

const disableFormFields = () => {
    document.getElementById('contato-sindico').contentEditable = false;
    document.getElementById('email-administracao').contentEditable = false;
    document.getElementById('numero-administracao').contentEditable = false;
    document.getElementById('numero-portaria').contentEditable = false;
};

const validateFields = () => {
    const contatoSindico = document.getElementById('contato-sindico').textContent.trim();
    const emailAdministracao = document.getElementById('email-administracao').textContent.trim();
    const numeroAdministracao = document.getElementById('numero-administracao').textContent.trim();
    const numeroPortaria = document.getElementById('numero-portaria').textContent.trim();

    if (!contatoSindico || !emailAdministracao || !numeroAdministracao || !numeroPortaria) {
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
        const condominioId = decodedToken.condominio_id;

        const telefoneSindico = document.getElementById('contato-sindico').textContent.trim();
        const emailAdministracao = document.getElementById('email-administracao').textContent.trim();
        const numeroAdministracao = document.getElementById('numero-administracao').textContent.trim();
        const numeroPortaria = document.getElementById('numero-portaria').textContent.trim();

        let userData = {
            telefone: numeroAdministracao,
            email: emailAdministracao,
        };

        let condominioData = {
            telefone_portaria: numeroPortaria,
        };

        let sindicoData = {
            telefone: telefoneSindico,
        };

        // Atualiza as informações do usuário
        const userInfoResponse = await fetch(`http://localhost:3000/administrador/perfil/editar/${status}/${userId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!userInfoResponse.ok) {
            throw new Error('Erro ao salvar informações do usuário');
        }

        // Atualiza as informações do condomínio
        const condominioResponse = await fetch(`http://localhost:3000/administrador/condominio/editar/${condominioId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(condominioData),
        });

        if (!condominioResponse.ok) {
            throw new Error('Erro ao salvar informações do condomínio');
        }

        // Atualiza as informações do síndico
        const sindicoResponse = await fetch(`http://localhost:3000/administrador/perfil/editar/${sindicoStatus}/${sindicoId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sindicoData),
        });

        if (!sindicoResponse.ok) {
            throw new Error('Erro ao salvar informações do síndico');
        }

        console.log('Informações salvas com sucesso');
        disableFormFields();
    } catch (error) {
        console.error('Erro ao salvar informações:', error);
    }
};
