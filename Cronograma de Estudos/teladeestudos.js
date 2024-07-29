document.addEventListener('DOMContentLoaded', function() {
    const rawInfo = localStorage.getItem('Informacoes');
    if (!rawInfo) {
        console.error('Informações não encontradas no Local Storage.');
        return;
    }

    const info = JSON.parse(rawInfo);
    const diasEstudo = info.diasdasemanadeestudo || [];
    const slider = document.getElementById('study-days-slider');
    if (!slider) {
        console.error('Elemento slider não encontrado.');
        return;
    }

    const today = new Date();
    const weekdays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const todayWeekday = weekdays[today.getDay()];
    const timePerDay = info.tempopordiadasemana;

    let foundToday = false;
    let lastValidIndex = 0;

    diasEstudo.forEach((dia, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.innerHTML = `
            <div class='timeline-container'>
                <div class='progress-line' id='progressLine-${index}'></div>
                <div class='time-marker' id='timeMarker-${index}'>00:00</div>
                <p>${dia}</p>
            </div>
        `;
        slider.appendChild(slide);

        if (dia === todayWeekday) {
            foundToday = true;
            lastValidIndex = index;
        }
        if (!foundToday) {
            lastValidIndex = index;
        }
    });

    const slides = document.querySelectorAll(".slide");
    let currentIndex = foundToday ? lastValidIndex : 0;
    slides[currentIndex].classList.add('active');

    function updateSlideVisibility() {
        slides.forEach((slide, index) => {
            slide.style.display = index === currentIndex ? 'block' : 'none';
        });
    }

    function navigateSlide(step) {
        currentIndex = (currentIndex + step + slides.length) % slides.length;
        updateSlideVisibility();
        initializeTimer(currentIndex);
    }

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.addEventListener('click', () => navigateSlide(-1));
    document.body.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => navigateSlide(1));
    document.body.appendChild(nextButton);

    updateSlideVisibility();
    initializeTimer(currentIndex);
});

function initializeTimer(slideIndex) {
    const info = JSON.parse(localStorage.getItem('Informacoes'));
    const timePerDay = info.tempopordiadasemana;
    const daysOfWeek = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const dayName = daysOfWeek[new Date().getDay()];
    let totalMinutes = timePerDay[dayName] ? parseInt(timePerDay[dayName].split(':')[0]) * 60 + parseInt(timePerDay[dayName].split(':')[1]) : 60;

    const timeMarker = document.getElementById(`timeMarker-${slideIndex}`);
    const progressLine = document.getElementById(`progressLine-${slideIndex}`);

    let elapsedMinutes = 0;

    const timerInterval = setInterval(() => {
        if (elapsedMinutes >= totalMinutes) {
            clearInterval(timerInterval);
            timeMarker.textContent = 'Concluído';
            progressLine.style.width = '100%'; // Completa a linha de progresso
        } else {
            elapsedMinutes++;
            let progress = (elapsedMinutes / totalMinutes) * 100;
            timeMarker.textContent = `${Math.floor(elapsedMinutes / 60)}:${elapsedMinutes % 60 < 10 ? '0' + elapsedMinutes % 60 : elapsedMinutes % 60}`;
            timeMarker.style.left = `${progress}%`;
            progressLine.style.width = `${progress}%`;
        }
    }, 60000); // Atualiza a cada minuto
}


function populateStudyBlocks(container, day, info) {
    // Extrair os tempos de estudo para cada matéria e o tempo total por dia
    const materias = info.materias || {};
    const tempoPorMateria = info.TempoPorMateria || {};
    const tempoPorDia = info.tempopordiadasemana || {};
    const totalDia = tempoPorDia[day] ? parseInt(tempoPorDia[day].replace(':', '.')) * 60 : 0; // Converter horas em minutos

    let blocos = [];
    let startTime = 0;

    // Criar blocos para as matérias que devem ser fixas todos os dias
    Object.keys(tempoPorMateria).forEach(materia => {
        if (materia === "Sociologia") {  // Exemplo de matéria que sempre tem o mesmo horário
            blocos.push({ materia, start: startTime, end: startTime + tempoPorMateria[materia] });
            startTime += tempoPorMateria[materia] + 1;
        }
    });

    // Adicionar matérias restantes de forma aleatória para cada dia
    const materiasRestantes = Object.keys(tempoPorMateria).filter(m => m !== "Sociologia");
    // Embaralhar array para ordem aleatória
    materiasRestantes.sort(() => Math.random() - 0.5);

    materiasRestantes.forEach(materia => {
        if (startTime < totalDia) {
            const endTime = Math.min(startTime + tempoPorMateria[materia], totalDia);
            blocos.push({ materia, start: startTime, end: endTime });
            startTime = endTime + 1;
        }
    });

    // Gerar HTML para cada bloco
    blocos.forEach(({ materia, start, end }) => {
        const blockDiv = document.createElement('div');
        blockDiv.className = 'study-block';
        blockDiv.innerHTML = `<h3>${materia} - Prioridade ${materias[materia]}</h3>
                              <p>${formatTime(start)} até ${formatTime(end)}</p>
                              <textarea placeholder='Anotações para ${materia}'></textarea>
                              <button onclick='saveNotes("${materia}", this.previousSibling.value)'>Salvar Anotações</button>`;
        container.appendChild(blockDiv);
    });
}

function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}
