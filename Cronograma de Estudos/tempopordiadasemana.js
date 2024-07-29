// tempopordiadasemana.js

document.addEventListener('DOMContentLoaded', function() {
    const info = JSON.parse(localStorage.getItem('Informacoes'));
    const username = info.Nome || 'Usuário';
    document.getElementById('user-greeting').textContent = `${username}, quanto tempo você irá estudar por dia?`;
    const diasSelecionados = info.diasdasemanadeestudo || [];
    const lista = document.getElementById('tempo-por-dia-lista');
    
    diasSelecionados.forEach(dia => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${dia}</span>
            <button onclick="alterarTempo('${dia}', -15)">-</button>
            <span id="tempo-${dia}">00:00</span>
            <button onclick="alterarTempo('${dia}', 15)">+</button>
        `;
        lista.appendChild(li);
    });
});

function alterarTempo(dia, delta) {
    const span = document.getElementById(`tempo-${dia}`);
    let [hours, minutes] = span.textContent.split(':').map(Number);
    let totalMinutes = hours * 60 + minutes + delta;
    totalMinutes = Math.max(0, Math.min(480, totalMinutes)); // Limit between 0 and 8 hours
    span.textContent = formatTime(totalMinutes);
}

function repetirTempo() {
    const repetir = document.getElementById('repetir-tempo').checked;
    document.getElementById('tempo-universal').style.display = repetir ? 'block' : 'none';
}

function alterarTempoUniversal(delta) {
    const span = document.getElementById('tempo-todos');
    let [hours, minutes] = span.textContent.split(':').map(Number);
    let totalMinutes = hours * 60 + minutes + delta;
    totalMinutes = Math.max(0, Math.min(480, totalMinutes)); // Limit between 0 and 8 hours
    span.textContent = formatTime(totalMinutes);
    // Set this time for all days
    document.querySelectorAll('#tempo-por-dia-lista span[id^="tempo-"]').forEach(span => {
        span.textContent = formatTime(totalMinutes);
    });
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
}

function salvarTempo() {
    const info = JSON.parse(localStorage.getItem('Informacoes'));
    const diasSelecionados = info.diasdasemanadeestudo || [];
    info.tempopordiadasemana = info.tempopordiadasemana || {};
    diasSelecionados.forEach(dia => {
        const tempo = document.getElementById(`tempo-${dia}`).textContent;
        info.tempopordiadasemana[dia] = tempo;
    });
    localStorage.setItem('Informacoes', JSON.stringify(info));
    window.location.href = 'tempopormateria.html';
}

function voltar() {
    window.location.href = 'diasdeestudonasemana.html'; // Redireciona para a página de seleção dos dias de estudo
}
