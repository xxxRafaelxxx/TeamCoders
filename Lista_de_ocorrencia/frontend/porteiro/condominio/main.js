 // Get the modal
    var modal = document.getElementById("modal");

    // Get the button that opens the modal
    var btn = document.getElementById("editarInformacoes");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Editar informações
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


    