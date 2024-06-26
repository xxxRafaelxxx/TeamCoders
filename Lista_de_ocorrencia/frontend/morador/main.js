document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        const token = localStorage.getItem('token');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const condominioId = decodedToken.condominio_id;

        // Adicionar o condominio_id aos dados do formData
        formData.append('condominio_id', condominioId);


        try {
            const response = await fetch(`http://localhost:3000/morador/ocorrencia/registrar/${condominioId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erro ao registrar a ocorrência');
            }

            alert('Ocorrência registrada com sucesso');
            form.reset(); // Limpa o formulário após o envio bem-sucedido
        } catch (error) {
            console.error('Erro:', error);
            alert('Ocorrência registrada com sucesso');
        }
    });
});
document.addEventListener('DOMContentLoaded', (token) => {
    // Busca o nome do usuário e atualiza o elemento HTML correspondente
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userName = decodedToken.nome;
    const nomeUsuarioElement = document.getElementById('nomeUsuario');

    if (userName) {
        nomeUsuarioElement.textContent = nomeUsuario;
    }
});
