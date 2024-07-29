document.addEventListener('DOMContentLoaded', function() {
    // Limpar o localStorage ao carregar a página
    localStorage.clear();
});

function continuar() {
    var username = document.getElementById('username').value;
    if (username) {
        localStorage.setItem('Informacoes', JSON.stringify({ Nome: username }));
        window.location.href = 'boasvindas.html'; // Redirecionamento para boasvindas.html
    } else {
        alert('Por favor, digite seu nome.');
    }
}