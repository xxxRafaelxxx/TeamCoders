function showConfirmationMessage(event) {
    event.preventDefault(); // Impede o envio do formulário
    alert('Ocorrência enviada');
    // Reseta o formulário
    event.target.reset();
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('form').addEventListener('submit', showConfirmationMessage);
});