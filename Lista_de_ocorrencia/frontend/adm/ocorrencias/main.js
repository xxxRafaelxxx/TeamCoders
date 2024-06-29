document.addEventListener("DOMContentLoaded", function () {
    // Seleciona o botão de logout
    const logoutButton = document.getElementById('logout_btn');

    // Adiciona um ouvinte de evento de clique ao botão
    logoutButton.addEventListener('click', function () {
        // Limpa o token do localStorage (ou qualquer outra lógica de logout que você tenha)
        localStorage.removeItem('token');

        // Redireciona para a página de login
        window.location.href = '../../login/index.html'; // Substitua com o caminho correto
    });
});

document.addEventListener("DOMContentLoaded", async function () {
    // Seleciona o elemento onde você deseja mostrar o nome do usuário
    const nomeUsuarioElement = document.querySelector('#user-infos .item-description:first-child');

    // Obtém o nome do usuário do token (supondo que o token e a decodificação já foram feitos)
    const token = localStorage.getItem('token');
    if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const nomeUsuario = decodedToken.nome;

        // Atualiza o conteúdo do elemento com o nome do usuário
        nomeUsuarioElement.textContent = nomeUsuario;
    } else {
        // Caso não tenha token (não autenticado), redireciona para a página de login
        window.location.href = '../../login/index.html'; // Substitua com o caminho correto
    }

    // Busca e exibe as ocorrências ao carregar a página
    await fetchAndDisplayOccurrences();
});

async function fetchAndDisplayOccurrences() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token não encontrado');
        }

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const condominioId = decodedToken.condominio_id;

        const response = await fetch(`http://localhost:3000/administrador/ocorrencias/${condominioId}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar ocorrências');
        }

        const ocorrencias = await response.json();
        const tbody = document.querySelector('.records tbody');
        tbody.innerHTML = ''; // Limpa o conteúdo atual da tabela

        ocorrencias.forEach((ocorrencia) => {
            let emissor;
            if (ocorrencia.morador_id !== null) {
                emissor = ocorrencia.morador_id;
            } else if (ocorrencia.sindico_id !== null) {
                emissor = ocorrencia.sindico_id;
            } else {
                emissor = ocorrencia.porteiro_id;
            }

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${ocorrencia.assunto}</td>
                <td>${ocorrencia.tipo_ocorrencia}</td>
                <td>${formatarData(ocorrencia.data_ocorrido)}</td>
                <td>${emissor}</td>
                <td>
                    <button type="button" class="button blue" onclick="verOcorrencia(${ocorrencia.id})">Ver</button>
                    <button type="button" class="button green" onclick="openModal(this, ${ocorrencia.id})">Colocar Status</button>
                </td>
                <td>
                    <div class="status-inicial">
                        <div class="status Esperando"></div>
                        <p>Esperando Status</p>
                    </div>
                    <div class="status Visto">
                        <p>Visto</p>
                    </div>
                    <div class="status Resolvido">
                        <p>Resolvido</p>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        alert('Erro ao buscar ocorrências');
    }
}

async function verOcorrencia(ocorrenciaId) {
    try {
        const token = localStorage.getItem('token');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const condominioId = decodedToken.condominio_id;

        const response = await fetch(`http://localhost:3000/administrador/ocorrencia/${ocorrenciaId}/${condominioId}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar detalhes da ocorrência');
        }

        const ocorrencia = await response.json();
        let emissor;
        if (ocorrencia.morador_id !== null) {
            emissor = "morador";
        } else if (ocorrencia.sindico_id !== null) {
            emissor = "sindico";
        } else {
            emissor = "porteiro";
        }
        // Preencha o modal com os detalhes da ocorrência
        document.getElementById('assunto').textContent = ocorrencia.assunto;
        document.getElementById('usuario').textContent = emissor;
        document.getElementById('tipo').textContent = ocorrencia.tipo_ocorrencia;
        document.getElementById('detalhes').textContent = ocorrencia.nota;
        document.getElementById('status').textContent = ocorrencia.status;
        document.getElementById('data').textContent = formatarData(ocorrencia.data_ocorrido);
        // Implemente a lógica para exibir anexos se houver

        // Abre o modal
        openModalVer();

    } catch (error) {
        console.error(error);
        alert('Erro ao buscar detalhes da ocorrência');
    }
}

function formatarData(data) {
    const dataObj = new Date(data);
    return `${dataObj.getDate()}/${dataObj.getMonth() + 1}/${dataObj.getFullYear()}`;
}

function openModal(button, ocorrenciaId) {
    var tr = button.closest('tr');
    document.getElementById('statusModal').style.display = 'block';
    document.getElementById('statusModal').setAttribute('data-rowindex', tr.rowIndex);
    document.getElementById('statusModal').setAttribute('data-ocorrenciaid', ocorrenciaId);
}

function closeModal() {
    document.getElementById('statusModal').style.display = 'none';
}

async function updateStatus(status) {
    var modal = document.getElementById('statusModal');
    var rowIndex = modal.getAttribute('data-rowindex');
    var ocorrenciaId = modal.getAttribute('data-ocorrenciaid');
    var tr = document.querySelector('.records tbody').rows[rowIndex];

    if (!tr) {
        console.error('Linha da tabela não encontrada');
        alert('Erro ao atualizar status da ocorrência');
        return;
    }

    var statusElements = tr.querySelectorAll('.status p');
    statusElements.forEach(function (el) {
        el.textContent = 'Esperando Status'; // Reseta todos os status para "Esperando Status"
        el.parentElement.classList.remove('visto', 'resolvido'); // Remove classes de visto e resolvido
    });

    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:3000/administrador/ocorrencias/${ocorrenciaId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar status da ocorrência');
        }

        // Aplica o status na interface após o sucesso da atualização
        if (status === 'visto') {
            tr.querySelector('.status.Visto p').textContent = 'Visto';
            tr.querySelector('.status.Visto').classList.add('visto');
        } else if (status === 'resolvido') {
            tr.querySelector('.status.Resolvido p').textContent = 'Resolvido';
            tr.querySelector('.status.Resolvido').classList.add('resolvido');
        }

        closeModal();
    } catch (error) {
        console.error(error);
        alert('Erro ao atualizar status da ocorrência');
    }
}

// Função para fechar o modal de ver ocorrência
function closeModalVer() {
    document.getElementById('verModal').style.display = 'none';
}

// Função para abrir o modal de ver ocorrência
function openModalVer() {
    document.getElementById('verModal').style.display = 'block';
}
