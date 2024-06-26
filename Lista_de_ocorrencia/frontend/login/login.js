async function login() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('http://localhost:3000/usuario/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token); // Armazene o token no localStorage


            if (data.status) {
                switch (data.status.toLowerCase().trim()) {
                    case 'porteiro':
                        window.location.href = '../porteiro/index.html'; // Redirecionamento para página do porteiro
                        break;
                    case 'sindico':
                        window.location.href = '../sindico/index.html'; // Redirecionamento para página do síndico
                        break;
                    case 'morador':
                        window.location.href = '../morador/index.html'; // Redirecionamento para página do morador
                        break;
                    case 'administrador':
                        window.location.href = '../adm/index.html'; // Redirecionamento para página do administrador
                        break;
                    default:
                        alert('Status de usuário desconhecido.');
                }
            } else {
                alert('Status de usuário não especificado.');
            }
        } else {
            alert('Email ou senha incorretos.');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login. Por favor, tente novamente.');
    }
}
