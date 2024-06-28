document.addEventListener("DOMContentLoaded", function () {
    // Seleciona o botão de logout
    const logoutButton = document.getElementById('logout_btn');

    // Adiciona um ouvinte de evento de clique ao botão
    logoutButton.addEventListener('click', function () {
        // Limpa o token do localStorage (ou qualquer outra lógica de logout que você tenha)
        localStorage.removeItem('token');

        // Redireciona para a página de login
        window.location.href = '../login/index.html'; // Substitua com o caminho correto
    });
});
document.addEventListener("DOMContentLoaded", function () {
    // Seleciona o elemento onde você deseja mostrar o nome do usuário
    const nomeUsuarioElement = document.querySelector('#user-infos .item-description:first-child');

    // Obtém o nome do usuário do token (supondo que o token e a decodificação já foram feitos)
    const token = localStorage.getItem('token');
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const nomeUsuario = decodedToken.nome;

    // Atualiza o conteúdo do elemento com o nome do usuário
    nomeUsuarioElement.textContent = nomeUsuario;
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const form = event.target;

        const token = localStorage.getItem('token');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const condominioId = decodedToken.condominio_id;
        const moradorId = decodedToken.id; // Ou qualquer lógica para obter o ID do morador

        const dadosEnvio = {
            condominio_id: condominioId,
            morador_id: moradorId,
            assunto: form.querySelector('[name="assunto"]').value,
            tipo_ocorrencia: form.querySelector('[name="tipo"]').value,
            nota: form.querySelector('[name="detalhes"]').value,
            data_ocorrido: form.querySelector('[name="data"]').value,
            foto: null, // Se você quiser enviar a foto como um link ou base64, precisa tratar isso de outra forma
            status: 'pendente' // Ou qualquer status inicial
        };
        console.log(dadosEnvio);
        try {
            const response = await fetch(`http://localhost:3000/morador/ocorrencia/registrar/${condominioId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dadosEnvio)
            });

            if (!response.ok) {
                throw new Error('Erro ao registrar a ocorrência');
            }

            alert('Ocorrência registrada com sucesso');
            form.reset(); // Limpa o formulário após o envio bem-sucedido
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao registrar ocorrência');
        }
    });
});
