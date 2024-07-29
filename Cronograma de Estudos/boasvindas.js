// boasvindas.js

document.addEventListener('DOMContentLoaded', function () {
    const userInfo = JSON.parse(localStorage.getItem('Informacoes'));
    const username = userInfo ? userInfo.Nome : 'Usuário';

    const userNameElement = document.getElementById('user-name');
    userNameElement.textContent = username;
});

function continuar() {
    // Redirecionamento para selecaodedisciplinas.html ao clicar em "Continuar"
    window.location.href = 'selecaodedisciplinas.html';
}

function voltar() {
    localStorage.clear(); // Limpa o localStorage
    window.location.href = 'cadastro.html'; // Redireciona para a página de cadastro
}
