// blocodeestudos.js

document.addEventListener('DOMContentLoaded', function() {
    const info = JSON.parse(localStorage.getItem('Informacoes') || '{}');
    const blocosEstudo = document.getElementById('blocos-estudo');

    document.getElementById('user-name').textContent = info.Nome || 'Usuário';
    
    const currentDate = new Date();
    const daysOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const formattedDate = `${dayOfWeek}, ${currentDate.toLocaleDateString()}`;
    document.querySelector('.user-info').textContent = `Olá, ${info.Nome || 'Usuário'}! ${formattedDate}`;

    let allConcluded = true;
    let hasMaterias = false;

    if (info.tempopormateria) {
        Object.entries(info.tempopormateria).forEach(([dia, materias]) => {
            const diaDiv = document.createElement('div');
            diaDiv.className = 'dia-estudo';
            diaDiv.innerHTML = `<h2>${dia}</h2>`;
            materias.forEach(({ materia, time }, index) => {
                if (time > 0) {  // Garantir que apenas matérias com tempo sejam renderizadas
                    hasMaterias = true;
                    const tempoFormatado = formatTime(time);
                    const uniqueKey = `${dia}-${materia}-${index}`;  // Unique key for each materia per day and index
                    const isChecked = info.concluidos && info.concluidos[uniqueKey] ? 'checked' : '';
                    allConcluded = allConcluded && !!isChecked;
                    const anotacao = info.anotacoes && info.anotacoes[uniqueKey] ? info.anotacoes[uniqueKey] : '';
                    const materiaDiv = document.createElement('div');
                    materiaDiv.className = 'materia-bloco';
                    materiaDiv.innerHTML = `
                        <div class="materia-info">
                            <span class="materia-nome">${materia}</span>
                            <span class="tempo-materia">${tempoFormatado}</span>
                            <input type="text" class="anotacoes" placeholder="Anotações aqui..." value="${anotacao}" oninput="salvarAnotacao('${uniqueKey}', this.value)">
                            <label class="checkbox-label">
                                <input type="checkbox" class="concluido-checkbox" ${isChecked} onclick="salvarConcluido('${uniqueKey}', this.checked)">
                                Concluído
                            </label>
                        </div>
                        <button class="botao-iniciar" data-active="false" onclick="toggleTimer(this, '${time}', '${uniqueKey}')">Iniciar</button>
                    `;
                    diaDiv.appendChild(materiaDiv);
                }
            });
            blocosEstudo.appendChild(diaDiv);
        });
    }

    // Resetar os concluídos se todos estiverem marcados
    if (allConcluded && hasMaterias) {
        Object.keys(info.concluidos || {}).forEach(key => {
            info.concluidos[key] = false;
        });
        localStorage.setItem('Informacoes', JSON.stringify(info));
        // Remover o reload aqui para evitar loop infinito
        // window.location.reload();
    }
});

function toggleTimer(button, tempo, uniqueKey) {
    let isActive = button.getAttribute('data-active') === 'true';
    if (!isActive) {
        let totalMins = parseInt(tempo);

        button.setAttribute('data-active', 'true');
        button.textContent = 'Pausar';

        button.interval = setInterval(() => {
            if (totalMins > 0) {
                totalMins--;
                const h = Math.floor(totalMins / 60);
                const m = totalMins % 60;
                let timeDisplay = button.parentElement.querySelector('.tempo-materia');
                if (timeDisplay) {
                    timeDisplay.textContent = `${h}:${m.toString().padStart(2, '0')}`;
                }
            } else {
                clearInterval(button.interval);
                button.textContent = 'Concluído';
                button.setAttribute('data-active', 'false');
                let checkbox = button.parentElement.querySelector('.concluido-checkbox');
                if (checkbox) {
                    checkbox.checked = true;
                    salvarConcluido(uniqueKey, true);
                }
                
                // Tocar o áudio de alerta
                const beepAudio = document.getElementById('beep-audio');
                if (beepAudio) {
                    beepAudio.play().then(() => {
                        // Mostrar alerta de conclusão
                        alert('Matéria concluída');
                    }).catch((error) => {
                        console.error('Erro ao tocar o áudio:', error);
                        // Mostrar alerta de conclusão mesmo se o áudio falhar
                        alert('Matéria concluída');
                    });
                } else {
                    // Mostrar alerta de conclusão se o elemento de áudio não estiver presente
                    alert('Matéria concluída');
                }
            }
        }, 60000); // Decrementa a cada minuto (60000 ms)
    } else {
        clearInterval(button.interval);
        button.textContent = 'Continuar';
        button.setAttribute('data-active', 'false');
    }
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
}

function salvarConcluido(uniqueKey, isChecked) {
    const info = JSON.parse(localStorage.getItem('Informacoes') || '{}');
    if (!info.concluidos) {
        info.concluidos = {};
    }
    info.concluidos[uniqueKey] = isChecked;
    localStorage.setItem('Informacoes', JSON.stringify(info));
}

function salvarAnotacao(uniqueKey, value) {
    const info = JSON.parse(localStorage.getItem('Informacoes') || '{}');
    if (!info.anotacoes) {
        info.anotacoes = {};
    }
    info.anotacoes[uniqueKey] = value;
    localStorage.setItem('Informacoes', JSON.stringify(info));
}

function confirmarAlteracaoCronograma() {
    if (confirm('Deseja resetar todo o cronograma?')) {
        window.location.href = 'cadastro.html'; // Substitua pelo URL correto
    }
}
