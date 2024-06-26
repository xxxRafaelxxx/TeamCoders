'use strict';

document.addEventListener("DOMContentLoaded", function () {
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        modal.classList.add('active');
    };

    const closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
    };

    document.getElementById('cadastrarCliente').addEventListener('click', () => openModal('modal-adicionar'));
    document.getElementById('modalClose').addEventListener('click', () => closeModal('modal-adicionar'));
    document.getElementById('modalCloseEditar').addEventListener('click', () => closeModal('modal-editar'));

    const formCadastrar = document.getElementById("formCadastrar");

    if (formCadastrar) {
        formCadastrar.addEventListener("submit", async function (event) {
            event.preventDefault();

            const nome = document.querySelector('#modal-adicionar input[placeholder="Nome do Usuário"]').value;
            const email = document.querySelector('#modal-adicionar input[placeholder="E-mail do Usuário"]').value;
            const senha = document.querySelector('#modal-adicionar input[placeholder="Senha"]').value;
            const celular = document.querySelector('#modal-adicionar input[placeholder="Celular do Usuário"]').value;
            const casa = document.querySelector('#modal-adicionar input[placeholder="Quadra e Apartamento"]').value;
            const tipoUsuario = document.getElementById('userType').value; // Captura o tipo de usuário (status)

            const token = localStorage.getItem('token');
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const condominioId = decodedToken.condominio_id;

            if (!token || !condominioId) {
                console.error('Token ou condominio_id não encontrado');
                return;
            }
            console.log("Dados enviados:", {
                nome,
                email,
                senha,
                celular,
                casa,
                tipoUsuario,
                condominioId,
            });
            try {
                const response = await fetch(`http://localhost:3000/administrador/usuarios/cadastrar/${condominioId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        nome,
                        email,
                        senha_hash: senha,
                        telefone: celular,
                        casa,
                        status: tipoUsuario,
                        condominio_id: condominioId,
                    })
                });

                if (!response.ok) {
                    throw new Error('Erro ao cadastrar usuário');
                }

                // Limpar campos do formulário após cadastro bem-sucedido
                document.querySelector('#modal-adicionar .modal-form').reset();

                // Fechar o modal após cadastro
                closeModal('modal-adicionar');

                // Atualizar a tabela de usuários
                getUsuarios();
            } catch (error) {
                console.error(error);
            }
        });

        // Adicionar evento de clique no botão "Cancelar"
        document.getElementById('btnCancelarCadastrar').addEventListener('click', () => {
            // Fechar o modal de cadastro
            closeModal('modal-adicionar');
        });
    } else {
        console.error('Elemento formCadastrar não encontrado');
    }

    const getUsuarios = async () => {
        const token = localStorage.getItem('token');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const condominioId = decodedToken.condominio_id;

        if (!token || !condominioId) {
            console.error('Token ou condominio_id não encontrado');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/administrador/usuarios/${condominioId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao obter usuários');
            }

            const usuarios = await response.json();
            preencherTabela(usuarios);
        } catch (error) {
            console.error(error);
        }
    };

    const preencherTabela = (usuarios) => {
        const tabela = document.querySelector('table.records tbody');
        tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        usuarios.moradores.forEach(usuario => {
            adicionarLinhaTabela(tabela, usuario, 'morador');
        });

        usuarios.sindicos.forEach(usuario => {
            adicionarLinhaTabela(tabela, usuario, 'sindico');
        });

        usuarios.porteiros.forEach(usuario => {
            adicionarLinhaTabela(tabela, usuario, 'portaria');
        });

        usuarios.administradores.forEach(usuario => {
            adicionarLinhaTabela(tabela, usuario, 'administrador');
        });
    };

    const adicionarLinhaTabela = (tabela, usuario, tipo) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td>${usuario.telefone}</td>
            <td>${usuario.casa || 'N/A'}</td>
            <td>${tipo}</td>
            <td>
                <button type="button" class="button green btnEditar">Editar</button>
                <button type="button" class="button red btnExcluir">Excluir</button>
            </td>
        `;

        row.querySelector('.btnEditar').addEventListener('click', () => {
            document.querySelector('#modal-editar input[placeholder="Nome do Usuário"]').value = usuario.nome;
            document.querySelector('#modal-editar input[placeholder="E-mail do Usuário"]').value = usuario.email;
            document.querySelector('#modal-editar input[placeholder="Celular do Usuário"]').value = usuario.telefone;
            document.querySelector('#modal-editar input[placeholder="Quadra e Apartamento"]').value = usuario.casa || '';
            document.getElementById('userTypeEditar').value = tipo; // Passa o tipo diretamente

            const salvarEditarBtn = document.getElementById('btnSalvarEditar');
            salvarEditarBtn.setAttribute('data-user-id', usuario.id);

            openModal('modal-editar');
        });

        row.querySelector('.btnExcluir').addEventListener('click', async () => {
            const confirmacao = confirm(`Deseja realmente excluir o usuário ${usuario.nome}?`);

            if (confirmacao) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`http://localhost:3000/administrador/usuario/deletar/${tipo}/${usuario.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Erro ao excluir usuário');
                    }

                    getUsuarios();
                } catch (error) {
                    console.error(error);
                }
            }
        });

        tabela.appendChild(row);
    };

    const formEditar = document.getElementById("formEditar");

    if (formEditar) {
        formEditar.addEventListener("submit", async function (event) {
            event.preventDefault();

            const token = localStorage.getItem('token');
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const condominioId = decodedToken.condominio_id;

            if (!token || !condominioId) {
                console.error('Token ou condominio_id não encontrado');
                return;
            }

            const nome = document.querySelector('#modal-editar input[placeholder="Nome do Usuário"]').value;
            const email = document.querySelector('#modal-editar input[placeholder="E-mail do Usuário"]').value;
            const senha = document.querySelector('#modal-editar input[placeholder="Senha"]').value;
            const celular = document.querySelector('#modal-editar input[placeholder="Celular do Usuário"]').value;
            const casa = document.querySelector('#modal-editar input[placeholder="Quadra e Apartamento"]').value;
            const tipoUsuario = document.getElementById('userTypeEditar').value;
            const userId = document.getElementById('btnSalvarEditar').getAttribute('data-user-id');

            try {
                const response = await fetch(`http://localhost:3000/administrador/perfil/editar/${tipoUsuario}/${userId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        nome,
                        email,
                        senha,
                        celular,
                        casa
                    })
                });

                if (!response.ok) {
                    throw new Error('Erro ao editar usuário');
                }

                document.querySelector('#modal-editar .modal-form').reset();

                closeModal('modal-editar');

                getUsuarios();
            } catch (error) {
                console.error(error);
            }
        });

        document.getElementById('btnCancelarEditar').addEventListener('click', () => {
            closeModal('modal-editar');
        });
    } else {
        console.error('Elemento formEditar não encontrado');
    }

    getUsuarios();
});
