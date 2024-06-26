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
                    <button type="button" class="button green" onclick="openModal(this, ${ocorrencia.status})">Ver status</button>
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
        // Aqui você pode manipular a exibição das notas, por exemplo:
        console.log('Notas da ocorrência:', ocorrencia.nota);
        // Implemente a lógica para exibir as notas no modal ou onde desejar na interface
        alert(ocorrencia.nota);

    } catch (error) {
        console.error(error);
        alert('Erro ao buscar notas da ocorrência');
    }
}

function formatarData(data) {
    const dataObj = new Date(data);
    return `${dataObj.getDate()}/${dataObj.getMonth() + 1}/${dataObj.getFullYear()}`;
}


// Função para chamar a busca e exibição das ocorrências ao carregar a página
document.addEventListener('DOMContentLoaded', fetchAndDisplayOccurrences);
