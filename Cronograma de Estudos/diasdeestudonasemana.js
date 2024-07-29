// diasdeestudonasemana.js

document.addEventListener('DOMContentLoaded', function() {
    const info = JSON.parse(localStorage.getItem('Informacoes'));
    const username = info.Nome || 'Usuário';
    document.getElementById('user-greeting').textContent = `${username}, quais dias da semana você irá estudar?`;
});

function salvarDias() {
    const dias = [
        { id: 'segunda', dia: 'Segunda-feira' },
        { id: 'terca', dia: 'Terça-feira' },
        { id: 'quarta', dia: 'Quarta-feira' },
        { id: 'quinta', dia: 'Quinta-feira' },
        { id: 'sexta', dia: 'Sexta-feira' },
        { id: 'sabado', dia: 'Sábado' },
        { id: 'domingo', dia: 'Domingo' }
    ];

    const diasSelecionados = dias.filter(d => document.getElementById(d.id).checked).map(d => d.dia);
    const info = JSON.parse(localStorage.getItem('Informacoes')) || {};
    info.diasdasemanadeestudo = diasSelecionados;
    localStorage.setItem('Informacoes', JSON.stringify(info));

    window.location.href = 'tempopordiadasemana.html';
}

function voltar() {
    const info = JSON.parse(localStorage.getItem('Informacoes')) || {};
    delete info.diasdasemanadeestudo;
    localStorage.setItem('Informacoes', JSON.stringify(info));
    window.location.href = 'selecaodedisciplinas.html'; // Redireciona para a página de seleção de disciplinas
}
