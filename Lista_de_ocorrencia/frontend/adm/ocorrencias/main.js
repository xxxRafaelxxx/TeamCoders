function openModal(button) {
    var tr = button.closest('tr');
    document.getElementById('statusModal').style.display = 'block';
    document.getElementById('statusModal').setAttribute('data-rowindex', tr.rowIndex);
}

function closeModal() {
    document.getElementById('statusModal').style.display = 'none';
}

function updateStatus(status) {
    var modal = document.getElementById('statusModal');
    var rowIndex = modal.getAttribute('data-rowindex');
    var tr = document.querySelector('.records tbody').rows[rowIndex];

    var statusElements = tr.querySelectorAll('.status p');
    statusElements.forEach(function(el) {
        el.textContent = 'Esperando Status'; // Reseta todos os status para "Esperando Status"
        el.parentElement.classList.remove('visto', 'resolvido'); // Remove classes de visto e resolvido
    });

    if (status === 'visto') {
        tr.querySelector('.status.visto p').textContent = 'Visto';
        tr.querySelector('.status.visto').classList.add('visto');
    } else if (status === 'resolvido') {
        tr.querySelector('.status.resolvido p').textContent = 'Resolvido';
        tr.querySelector('.status.resolvido').classList.add('resolvido');
    }

    closeModal();
}
