document.addEventListener('DOMContentLoaded', function () {
    const userInfo = JSON.parse(localStorage.getItem('Informacoes'));
    const username = userInfo ? userInfo.Nome : 'Usuário';

    const userNameElement = document.getElementById('user-name');
    userNameElement.textContent = username;
});

function continuar() {
    // Redirecionamento para selecaodedisciplinas.html ao clicar em "Continuar"
    window.location.href = 'blocodeestudos.html';
}
