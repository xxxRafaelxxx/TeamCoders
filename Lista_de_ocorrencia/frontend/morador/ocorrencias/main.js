document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById('logout_btn');
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('token');
        window.location.href = '../../login/index.html';
    });

    const nomeUsuarioElement = document.querySelector('#user-infos .item-description:first-child');
    const token = localStorage.getItem('token');
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const nomeUsuario = decodedToken.nome;
    nomeUsuarioElement.textContent = nomeUsuario;

    fetchAndDisplayOccurrences();
});

async function fetchAndDisplayOccurrences() {
    try {
        const token = localStorage.getItem('token');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const condominioId = decodedToken.condominio_id;

        const response = await fetch(`http://localhost:3000/administrador/ocorrencias/${condominioId}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar ocorrências');
        }

        const ocorrencias = await response.json();
        const tbody = document.querySelector('.records tbody');
        tbody.innerHTML = '';

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
                    <button type="button" class="button blue" onclick="openModalVer(${ocorrencia.id})">Ver</button>
                    <button type="button" class="button green" onclick="openModalStatus(${ocorrencia.id})">Ver status</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        alert('Erro ao buscar ocorrências');
    }
}

async function verNotas(ocorrenciaId) {
    try {
        const token = localStorage.getItem('token');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const condominioId = decodedToken.condominio_id;

        const response = await fetch(`http://localhost:3000/administrador/ocorrencia/${ocorrenciaId}/${condominioId}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar notas da ocorrência');
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
        document.getElementById('modalAssunto').innerText = ocorrencia.assunto;
        document.getElementById('modalUsuario').innerText = emissor;
        document.getElementById('modalTipo').innerText = ocorrencia.tipo_ocorrencia;
        document.getElementById('modalDetalhes').innerText = ocorrencia.nota;
        document.getElementById('modalData').innerText = formatarData(ocorrencia.data_ocorrido);

        const anexosList = document.getElementById('modalAnexos');
        anexosList.innerHTML = '';
        if (ocorrencia.anexos) {
            ocorrencia.anexos.forEach(anexo => {
                const img = document.createElement('img');
                img.src = anexo;
                anexosList.appendChild(img);
            });
        }

        document.getElementById('verModal').style.display = 'block';
    } catch (error) {
        console.error(error);
        alert('Erro ao buscar notas da ocorrência');
    }
}
function openModalStatus(button, status) {
    document.getElementById('statusModal').style.display = 'block';
    document.getElementById('status').textContent = status;
}

function closeModalStatus() {
    document.getElementById('statusModal').style.display = 'none';
}

async function fetchAndDisplayOccurrences() {
    try {
        const token = localStorage.getItem('token');
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
                    <button type="button" class="button blue" onclick="verNotas(${ocorrencia.id})">Ver</button>
                    <button type="button" class="button green" onclick="openModalStatus(this, '${ocorrencia.status}')">Ver status</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        alert('Erro ao buscar ocorrências');
    }
}


function formatarData(data) {
    const dataObj = new Date(data);
    return `${dataObj.getDate()}/${dataObj.getMonth() + 1}/${dataObj.getFullYear()}`;
}

function openModalVer(ocorrenciaId) {
    verNotas(ocorrenciaId);
}

function closeModalver() {
    document.getElementById('verModal').style.display = 'none';
}
