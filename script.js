// Criamos uma variável global para armazenar nossos dados na memória RAM enquanto a página está aberta.
// Iniciamos como um array vazio [].
let listaTarefas = [];

// Selecionamos os elementos do HTML que o JavaScript precisará "manipular" (DOM - Document Object Model).
const gradeAgenda = document.getElementById('gradeAgenda');
const modal = document.getElementById('modalEdicao');
let idTarefaSendoEditada = null; // Variável de controle para saber qual tarefa a modal deve alterar.

/**
 * FUNÇÃO DE INICIALIZAÇÃO (window.onload)
 * Executa assim que o navegador termina de carregar o HTML e CSS.
 */
window.onload = () => {
    // Tentamos buscar os dados que foram gravados no "disco" do navegador anteriormente.
    const dadosSalvos = localStorage.getItem('tarefasAgendaSemana');
    
    if (dadosSalvos) {
        // Como o LocalStorage só guarda texto, usamos JSON.parse para converter de volta em Array de Objetos.
        listaTarefas = JSON.parse(dadosSalvos);
        // Chamamos a função para desenhar os cards na tela.
        renderizarTarefas();
    }
    
    // Define o campo de data do formulário com a data atual do sistema.
    document.getElementById('entradaData').value = new Date().toISOString().split('T')[0];
};

/**
 * PERSISTÊNCIA (localStorage)
 * Transforma o Array de Objetos em uma String JSON e salva no navegador.
 */
function salvarNoLocalStorage() {
    localStorage.setItem('tarefasAgendaSemana', JSON.stringify(listaTarefas));
}

/**
 * C.R.U.D. - CREATE (Adicionar)
 */
function adicionarTarefa() {
    // .value pega o texto digitado; .trim() remove espaços vazios inúteis no início e fim.
    const titulo = document.getElementById('entradaTarefa').value.trim();
    const obs = document.getElementById('entradaObs').value.trim();
    const data = document.getElementById('entradaData').value;

    // Validação simples: se não tiver título, interrompe a função com um alerta.
    if (!titulo) return alert("Digite um título para o serviço!");

    // Criamos um Objeto Literal com os dados da tarefa.
    const novaTarefa = {
        id: Date.now(),    // Usamos o timestamp (milissegundos atuais) como um ID único (Primary Key).
        titulo: titulo,
        obs: obs,
        data: data,
        concluida: false   // Toda tarefa nova nasce pendente.
    };

    // .unshift() adiciona o novo objeto na PRIMEIRA posição do array.
    listaTarefas.unshift(novaTarefa);
    
    salvarNoLocalStorage(); // Atualiza o "banco de dados" local.
    renderizarTarefas();    // Atualiza a interface.

    // Reseta os campos de texto para o próximo uso.
    document.getElementById('entradaTarefa').value = "";
    document.getElementById('entradaObs').value = "";
}

/**
 * C.R.U.D. - UPDATE (Alternar Estado)
 */
function alternarConclusao(id) {
    // .find() percorre o array e retorna o objeto que possui o ID igual ao clicado.
    const tarefa = listaTarefas.find(t => t.id === id);
    if (tarefa) {
        // Inverte o valor booleano (se true vira false, se false vira true).
        tarefa.concluida = !tarefa.concluida;
        salvarNoLocalStorage();
        renderizarTarefas();
    }
}

/**
 * RENDERIZAÇÃO (Saída de Dados)
 * Esta função limpa a tela e desenha tudo de novo baseada no array listaTarefas.
 */
function renderizarTarefas() {
    // Limpa a grade para não duplicar tarefas existentes.
    gradeAgenda.innerHTML = "";

    // .forEach() é um laço de repetição que executa um bloco de código para cada item da lista.
    listaTarefas.forEach(tarefa => {
        // Converte a data do formato AAAA-MM-DD para DD/MM/AAAA.
        const dataFormatada = new Date(tarefa.data + 'T00:00:00').toLocaleDateString('pt-BR');
        
        // Criamos um novo elemento <div> na memória.
        const card = document.createElement('div');
        // Aplicamos classes CSS. Se tarefa.concluida for true, adiciona a classe 'concluida'.
        card.className = `card-tarefa ${tarefa.concluida ? 'concluida' : ''}`;
        
        // Injetamos o HTML interno do card usando Template Strings (` `).
        card.innerHTML = `
            <div class="conteudo-tarefa">
                <span class="data-exibida">🗓 ${dataFormatada}</span>
                <strong class="titulo-exibido">${tarefa.titulo}</strong>
                ${tarefa.obs ? `<span class="obs-exibida">${tarefa.obs}</span>` : ''}
            </div>
            <div class="acoes">
                <button class="btn-acao btn-check" onclick="alternarConclusao(${tarefa.id})" title="Concluir">✓</button>
                <button class="btn-acao btn-editar" onclick="abrirModal(${tarefa.id})" title="Editar">✎</button>
                <button class="btn-acao btn-excluir" onclick="excluirTarefa(${tarefa.id})" title="Excluir">✕</button>
            </div>
        `;
        // Coloca o card fisicamente dentro da grade na página HTML.
        gradeAgenda.appendChild(card);
    });
}

/**
 * C.R.U.D. - DELETE (Excluir)
 */
function excluirTarefa(id) {
    if (confirm("Remover este registro?")) {
        // .filter() cria uma NOVA lista contendo todos os itens, EXCETO o que tem o ID que queremos apagar.
        listaTarefas = listaTarefas.filter(t => t.id !== id);
        salvarNoLocalStorage();
        renderizarTarefas();
    }
}

/**
 * SISTEMA DE MODAL (Edição)
 */
function abrirModal(id) {
    const tarefa = listaTarefas.find(t => t.id === id);
    if (tarefa) {
        idTarefaSendoEditada = id; // Memoriza qual tarefa estamos editando.
        // Preenche os inputs da modal com os valores atuais da tarefa.
        document.getElementById('editarTitulo').value = tarefa.titulo;
        document.getElementById('editarObs').value = tarefa.obs;
        // Muda o CSS para exibir a modal (display: flex).
        modal.style.display = 'flex';
    }
}

function fecharModal() {
    modal.style.display = 'none';
    idTarefaSendoEditada = null;
}

// Evento do botão "Salvar" dentro da modal.
document.getElementById('btnConfirmarEdicao').onclick = () => {
    const tarefa = listaTarefas.find(t => t.id === idTarefaSendoEditada);
    if (tarefa) {
        // Atualiza as propriedades do objeto com o que foi digitado na modal.
        tarefa.titulo = document.getElementById('editarTitulo').value;
        tarefa.obs = document.getElementById('editarObs').value;
        
        salvarNoLocalStorage();
        renderizarTarefas();
        fecharModal();
    }
};

// Vincula a função de clique ao botão principal de adicionar.
document.getElementById('btnAdicionar').onclick = adicionarTarefa;