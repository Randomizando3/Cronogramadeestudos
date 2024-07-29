// selecaodedisciplinas.js

document.addEventListener('DOMContentLoaded', function () {
    const userInfo = JSON.parse(localStorage.getItem('Informacoes'));
    const username = userInfo ? userInfo.Nome : 'Usuário';
    document.getElementById('header-title').textContent = `${username}, quais disciplinas você irá estudar?`;

    var disciplinas = JSON.parse(localStorage.getItem('Informacoes'));
    if (disciplinas && disciplinas.materias) {
        // Limpar a lista para evitar duplicações
        document.getElementById('lista-disciplinas').innerHTML = '';
        Object.keys(disciplinas.materias).forEach(function (disciplina) {
            adicionarItemLista(disciplina, disciplinas.materias[disciplina]);
        });
    }
});

function adicionarDisciplina() {
    var disciplina = document.getElementById('disciplina').value;
    var prioridade = document.getElementById('prioridade').value;

    if (disciplina !== '') {
        adicionarItemLista(disciplina, prioridade);

        var disciplinas = JSON.parse(localStorage.getItem('Informacoes'));
        if (!disciplinas.materias) {
            disciplinas.materias = {};
        }
        disciplinas.materias[disciplina] = prioridade;
        localStorage.setItem('Informacoes', JSON.stringify(disciplinas));

        // Limpar o campo de entrada de disciplina
        document.getElementById('disciplina').value = '';
    } else {
        alert('Por favor, insira o nome da disciplina.');
    }
}

function adicionarItemLista(disciplina, prioridade) {
    var lista = document.getElementById('lista-disciplinas');
    var item = document.createElement('li');
    item.textContent = disciplina + " - " + {
        '4': 'Prioridade máxima',
        '3': 'Importante',
        '2': 'Moderada',
        '1': 'Opcional'
    }[prioridade];
    item.style.color = {
        '4': 'red', // Vermelho para Prioridade máxima
        '3': 'darkorange', // Laranja escuro para Importante
        '2': 'green', // Amarelo para Moderada
        '1': 'blue' // Verde para Opcional
    }[prioridade];

    // Adicionando botão de exclusão
    var deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'x';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = function () {
        removerDisciplina(disciplina);
        lista.removeChild(item);
    };

    item.appendChild(deleteBtn);
    lista.appendChild(item);
}

function removerDisciplina(disciplina) {
    var disciplinas = JSON.parse(localStorage.getItem('Informacoes'));
    if (disciplinas && disciplinas.materias && disciplinas.materias[disciplina]) {
        delete disciplinas.materias[disciplina];
        localStorage.setItem('Informacoes', JSON.stringify(disciplinas));
    }
}

function continuar() {
    window.location.href = 'diasdeestudonasemana.html';
}

function voltar() {
    window.location.href = 'boasvindas.html'; // Redireciona para a página de boas-vindas
}
