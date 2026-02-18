const entradaTarefa = document.getElementById('entradaTarefa');
const entradaObs = document.getElementById('entradaObs');
const entradaData = document.getElementById('entradaData');
const btnAdicionar = document.getElementById('btnAdicionar');
const gradeAgenda = document.getElementById('gradeAgenda');

const modal = document.getElementById('modalEdicao');
const editarTitulo = document.getElementById('editarTitulo');
const editarObs = document.getElementById('editarObs');
const btnSalvarEdicao = document.getElementById('btnSalvarEdicao');

let cardSendoEditado = null;

// Define data de hoje
window.onload = () => {
    entradaData.value = new Date().toISOString().split('T')[0];
};

function adicionarTarefa() {
    const titulo = entradaTarefa.value.trim();
    const obs = entradaObs.value.trim();
    const dataCrua = entradaData.value;

    if (!titulo) return alert("Por favor, digite um título.");

    const dataFormatada = new Date(dataCrua + 'T00:00:00').toLocaleDateString('pt-BR', { 
        weekday: 'short', day: '2-digit', month: '2-digit' 
    });

    const card = document.createElement('div');
    card.className = 'card-tarefa';
    card.innerHTML = `
        <div class="conteudo-tarefa">
            <span class="data-exibida">🗓 ${dataFormatada}</span>
            <strong class="titulo-exibido">${titulo}</strong>
            ${obs ? `<span class="obs-exibida">${obs}</span>` : ''}
        </div>
        <div class="acoes">
            <button class="btn-acao btn-editar" title="Editar"></button>
            <button class="btn-acao btn-excluir" title="Excluir"></button>
        </div>
    `;

    // Evento Excluir
    card.querySelector('.btn-excluir').onclick = () => {
        if(confirm("Deseja excluir esta tarefa?")) card.remove();
    };

    // Evento Editar
    card.querySelector('.btn-editar').onclick = () => {
        cardSendoEditado = card;
        editarTitulo.value = card.querySelector('.titulo-exibido').innerText;
        const obsExistente = card.querySelector('.obs-exibida');
        editarObs.value = obsExistente ? obsExistente.innerText : "";
        modal.style.display = 'flex';
    };

    gradeAgenda.prepend(card);
    entradaTarefa.value = "";
    entradaObs.value = "";
}

function fecharModal() {
    modal.style.display = 'none';
    cardSendoEditado = null;
}

btnSalvarEdicao.onclick = () => {
    if (cardSendoEditado) {
        const novoTitulo = editarTitulo.value.trim();
        const novaObs = editarObs.value.trim();

        if (!novoTitulo) return alert("O título não pode estar vazio.");

        cardSendoEditado.querySelector('.titulo-exibido').innerText = novoTitulo;

        let blocoObs = cardSendoEditado.querySelector('.obs-exibida');
        if (novaObs) {
            if (blocoObs) {
                blocoObs.innerText = novaObs;
            } else {
                const span = document.createElement('span');
                span.className = 'obs-exibida';
                span.innerText = novaObs;
                cardSendoEditado.querySelector('.conteudo-tarefa').appendChild(span);
            }
        } else if (blocoObs) {
            blocoObs.remove();
        }
        fecharModal();
    }
};

btnAdicionar.onclick = adicionarTarefa;

// Fecha modal ao clicar fora
window.onclick = (e) => { if (e.target == modal) fecharModal(); };