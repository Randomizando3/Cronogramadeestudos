// tempopormateria.js

document.addEventListener('DOMContentLoaded', function() {
    const info = JSON.parse(localStorage.getItem('Informacoes') || '{}');
    const username = info.Nome || 'José'; // Nome do usuário
    document.getElementById('user-greeting').textContent = `${username}, aqui está seu cronograma de estudos!`;
    const diasSelecionados = info.diasdasemanadeestudo || [];
    const lista = document.getElementById('materias-lista');

    // Organiza as matérias por prioridade e frequência
    let materiaQueue = organizeMaterias(info.materias);

    // Alocações iniciais de matérias e tempo
    let dailyAllocations = allocateMaterias(diasSelecionados, materiaQueue, info);

    // Ajusta as alocações para não exceder o tempo diário
    adjustAllocations(dailyAllocations, info);

    // Renderiza as alocações para cada dia
    renderSchedule(dailyAllocations, lista);

    // Atualiza o localStorage ao clicar no botão "Continuar"
    document.querySelector('.continuar-btn').addEventListener('click', function() {
        saveAllocationsToLocalStorage(dailyAllocations, info);
        window.location.href = 'loading.html';
    });
});

function organizeMaterias(materias) {
    let queue = [];
    const priorityWeights = { 4: 4, 3: 3, 2: 2, 1: 1 }; // Pesos das prioridades
    Object.entries(materias).forEach(([materia, prioridade]) => {
        for (let i = 0; i < priorityWeights[prioridade]; i++) {
            queue.push({ materia, prioridade: priorityWeights[prioridade] });
        }
    });
    return queue;
}

function allocateMaterias(diasSelecionados, materiaQueue, info) {
    let dailyAllocations = diasSelecionados.reduce((acc, dia) => ({ ...acc, [dia]: [] }), {});
    let indexDia = 0;

    // Distribuir matérias em todos os dias
    materiaQueue.forEach(({ materia, prioridade }) => {
        const dia = diasSelecionados[indexDia];
        dailyAllocations[dia].push({ materia, time: 0, prioridade: prioridade });
        indexDia = (indexDia + 1) % diasSelecionados.length; // Circular pelos dias
    });

    return dailyAllocations;
}

function adjustAllocations(dailyAllocations, info) {
    Object.keys(dailyAllocations).forEach(dia => {
        const timeStr = info.tempopordiadasemana[dia];
        const [hours, minutes] = timeStr.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;

        const totalWeight = dailyAllocations[dia].reduce((acc, item) => acc + item.prioridade, 0);

        dailyAllocations[dia].forEach(item => {
            item.time = Math.floor((item.prioridade / totalWeight) * totalMinutes);
        });

        // Ajustar finamente para usar exatamente o tempo total diário
        let allocatedTime = dailyAllocations[dia].reduce((acc, item) => acc + item.time, 0);
        let difference = totalMinutes - allocatedTime;
        if (difference > 0) {
            dailyAllocations[dia].sort((a, b) => b.prioridade - a.prioridade)[0].time += difference; // Ajusta o item com maior prioridade para compensar a diferença
        }
    });
}

function renderSchedule(dailyAllocations, lista) {
    Object.entries(dailyAllocations).forEach(([dia, materias]) => {
        if (materias.length > 0) { // Verifica se há matérias alocadas para o dia
            const li = document.createElement('li');
            const diaDiv = document.createElement('div');
            diaDiv.className = 'dia';
            diaDiv.textContent = dia;

            const materiasDiv = document.createElement('div');
            materiasDiv.className = 'materias';

            materias.forEach(({ materia, time }) => {
                const divTempoDia = document.createElement('div');
                divTempoDia.className = 'tempo-dia';
                divTempoDia.innerHTML = `
                    <span>${materia}</span>
                    <span class="time-display">${formatTime(time)}</span>
                `;
                materiasDiv.appendChild(divTempoDia);
            });

            li.appendChild(diaDiv);
            li.appendChild(materiasDiv);
            lista.appendChild(li);
        }
    });
}

function saveAllocationsToLocalStorage(dailyAllocations, info) {
    if (!info.tempopormateria) {
        info.tempopormateria = {};
    }

    // Limpa a estrutura tempopormateria antes de salvar os novos blocos
    Object.keys(info.tempopormateria).forEach(dia => {
        delete info.tempopormateria[dia];
    });

    // Atualiza o localStorage com as novas alocações
    Object.entries(dailyAllocations).forEach(([dia, materias]) => {
        if (materias.length > 0) { // Salva apenas dias com alocações
            info.tempopormateria[dia] = materias.map(({ materia, time }) => ({ materia, time }));
        }
    });

    // Remove dias que não estão selecionados ou sem alocações de tempo
    Object.keys(info.tempopormateria).forEach(dia => {
        if (!info.tempopormateria[dia] || info.tempopormateria[dia].length === 0 || !info.diasdasemanadeestudo.includes(dia)) {
            delete info.tempopormateria[dia];
        }
    });

    localStorage.setItem('Informacoes', JSON.stringify(info));
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`; // Formata tempo para exibição
}

function voltar() {
    window.location.href = 'diasdeestudonasemana.html'; // Redireciona para a página de seleção dos dias de estudo
}
