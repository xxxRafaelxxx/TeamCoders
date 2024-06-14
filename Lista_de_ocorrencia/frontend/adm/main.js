'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => document.getElementById('modal')
    .classList.remove('active')

document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

    var formEditar = document.getElementById("formEditar");

    formEditar.addEventListener("submit", function(event) {
        event.preventDefault();

        document.getElementById("totalMoradores").textContent = document.getElementById("totalMoradoresInput").value;
        document.getElementById("localizacao").textContent = document.getElementById("localizacaoInput").value;
        document.getElementById("contatoSindicos").textContent = document.getElementById("contatoSindicosInput").value;
        document.getElementById("emailAdministracao").textContent = document.getElementById("emailAdministracaoInput").value;
        document.getElementById("numeroAdministracao").textContent = document.getElementById("numeroAdministracaoInput").value;
        document.getElementById("numeroPortaria").textContent = document.getElementById("numeroPortariaInput").value;

        modal.style.display = "none";
    });
