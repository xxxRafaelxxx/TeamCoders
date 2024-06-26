'use strict';

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('Token não encontrado');
        return;
    }

    try {
        await getUserInfo(token);
    } catch (erro) {
        messeage.json(erro)
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


};

