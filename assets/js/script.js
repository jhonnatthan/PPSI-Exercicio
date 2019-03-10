// Variaveis da aplicação
let todos = [];
let navMenu = [
    { name: 'Todos', value: '' },
    { name: 'Pendentes', value: 'pending' },
    { name: 'Concluidos', value: 'completed' },
    { name: 'Removidos', value: 'deleted' }
];
let positionOptions = [
    { name: 'Início', value: 'first' },
    { name: 'Fim', value: 'last' }
];

// Função de início
(function () {
    renderizaHeader();
    renderizaMain();
    restauraDados();
    renderizaSelects();
    irParaTodos();
    calcularPosElementos();
})();

// Renderização dos principais elementos da página
function renderizaHeader() {
    let body = document.querySelector('body');

    let header = document.createElement('header');

    let section = document.createElement('section');
    section.classList.add('searchSection');

    let div = document.createElement('div');
    div.classList.add('container');

    // Formulário de Busca
    let form = document.createElement('form');
    form.classList.add('searchForm');
    form.id = 'searchForm';
    form.setAttribute('onsubmit', 'buscaTodo(event)');

    let buttonSearch = document.createElement('button');
    let imgSearch = document.createElement('img');
    imgSearch.src = 'assets/img/search.svg';

    let inputSearch = document.createElement('input');
    inputSearch.type = 'text';
    inputSearch.name = 's';
    inputSearch.placeholder = 'Pesquisar todo...';

    let buttonClear = document.createElement('button');
    let imgClear = document.createElement('img');
    imgClear.src = 'assets/img/times.svg';

    // Navegação de categorias
    let nav = document.createElement('nav');
    nav.classList.add('todoNav');

    let ul = document.createElement('ul');
    ul.id = 'lstNav';

    for (let index = 0; index < navMenu.length; index++) {
        const element = navMenu[index];
        let li = document.createElement('li');
        li.classList.add('todoNav-item');
        if (index == 0) li.classList.add('active');
        li.setAttribute('data-category', element.value);
        li.innerHTML = element.name;
        li.setAttribute('onclick', 'renderizaConteudo("' + element.value + '", this)');
        ul.appendChild(li);
    }

    // Estruturando
    buttonSearch.appendChild(imgSearch);
    buttonClear.appendChild(imgClear);
    form.appendChild(buttonSearch);
    form.appendChild(inputSearch);
    form.appendChild(buttonClear);
    nav.appendChild(ul);
    div.appendChild(form);
    div.appendChild(nav);
    section.appendChild(div);
    header.appendChild(section);
    body.appendChild(header);
}

function renderizaMain() {
    let body = document.querySelector('body');

    let main = document.createElement('main');

    let section = document.createElement('section');
    section.classList.add('todoList', 'container');

    // Formulário de Adição
    let form = document.createElement('form');
    form.id = 'addForm';
    form.setAttribute('onsubmit', 'insereTodo(event)');

    let p = document.createElement('p');
    p.innerHTML = 'INSERIR TODO';

    let fDiv = document.createElement('div');

    let inputAdd = document.createElement('input');
    inputAdd.type = 'text';
    inputAdd.name = 'todo';
    inputAdd.id = 'todo';
    inputAdd.placeholder = 'Digite seu TODO';

    let buttonAdd = document.createElement('button');
    buttonAdd.innerHTML = 'Salvar';

    let sDiv = document.createElement('div');
    sDiv.classList.add('advanced');

    // Listagem
    let ul = document.createElement('ul');
    ul.id = 'lstTodo';

    // Estruturação
    fDiv.appendChild(inputAdd);
    fDiv.appendChild(buttonAdd);
    form.appendChild(p);
    form.appendChild(fDiv);
    form.appendChild(sDiv);
    section.appendChild(form);
    section.appendChild(ul);
    main.appendChild(section);
    body.appendChild(main);
}

function renderizaSelects() {
    let div = document.querySelector('.advanced');
    div.innerHTML = '';

    let selectPosicao = document.createElement('select');
    selectPosicao.name = 'posicao';
    selectPosicao.id = 'posicao';
    selectPosicao.setAttribute('onchange', 'trocaInsercao()');

    for (let index = 0; index < positionOptions.length; index++) {
        const element = positionOptions[index];
        let option = document.createElement('option');
        option.text = element.name;
        option.value = element.value;

        selectPosicao.appendChild(option);
    }

    let selectTodo = document.createElement('select');
    selectTodo.name = 'elemento';
    selectTodo.id = 'elemento';
    selectTodo.style.display = 'none';

    if (validLenght() > 1) {
        for (let index = 0; index < filteredTodos.length; index++) {
            const element = filteredTodos[index];
            if (element.status !== 'deleted') {

                let option = geraTodoOption(element);
                selectTodo.appendChild(option);
            }
        }
    }

    div.appendChild(selectPosicao);
    div.appendChild(selectTodo);

    if (validLenght() > 1) adicionaNovasOpcoes();
}

function adicionaNovasOpcoes() {
    let selectPosicao = document.querySelector('#posicao');

    let newOptions = [
        { name: 'Antes de', value: 'before' },
        { name: 'Depois de', value: 'after' }
    ];

    for (let index = 0; index < newOptions.length; index++) {
        const element = newOptions[index];
        let option = document.createElement('option');
        option.text = element.name;
        option.value = element.value;

        selectPosicao.appendChild(option);
    }
}

function removeNovasOpcoes() {
    let selectPosicao = document.querySelectorAll('#posicao option');

    for (let index = 0; index < selectPosicao.length; index++) {
        const element = selectPosicao[index];

        if (element.value == 'after' || element.value == 'before') {
            element.remove();
        }
    }
}

function renderizaConteudo(categoria, menuItem) {
    let navItems = document.querySelectorAll('.todoNav-item');
    for (let index = 0; index < navItems.length; index++) {
        const element = navItems[index];
        element.classList.remove('active');
    }
    menuItem.classList.add('active');

    let lst = document.querySelector('#lstTodo');
    lst.innerHTML = null;
    let filteredTodos;
    if (categoria != '') {
        filteredTodos = todos.filter(todo => todo.status == categoria);
    } else {
        filteredTodos = todos;
    }

    for (let index = 0; index < filteredTodos.length; index++) {
        const element = filteredTodos[index];

        let todoItem = geraTodo(element);
        lst.appendChild(todoItem);
    }
}

// Funções auxiliares
function irParaTodos() {
    let navItems = document.querySelectorAll('.todoNav-item');
    renderizaConteudo('', navItems[0]);
}

function restauraDados() {
    let storageTodos = recuperaDado('@app:todos');
    if (storageTodos) todos = storageTodos;
}

function trocaInsercao() {
    let posicao = document.querySelector('#posicao').value;

    if (posicao == 'after' || posicao == 'before') {
        exibeSeletor(true);
    } else {
        exibeSeletor(false);
    }
}

function exibeSeletor(status) {
    let seletorElemento = document.querySelector('#elemento');
    seletorElemento.style.display = status ? 'block' : 'none';
}

// Handler do Submit do formulário
function insereTodo(ev) {
    let elementoId;
    let todoName = document.querySelector('#todo').value;

    if (todoName != '') {
        let posicao = document.querySelector('#posicao').value;
        switch (posicao) {
            case 'first':
                inserirInicio(todoName);
                break;
            case 'last':
                inserirFim(todoName)
                break;
            case 'before':
                elementoId = document.querySelector('#elemento').value;
                inserirAntesDe(todoName, elementoId);
                break;
            case 'after':
                elementoId = document.querySelector('#elemento').value;
                inserirDepoisDe(todoName, elementoId);
                break;
            default:
                inserirFim(todoName);
                break;
        }
    } else {
        alert('Preencha o campo antes de salvar!');
    }

    ev.preventDefault();
}

// Inserção do início da lista.
// todoName: Nome do todo digitado no input
function inserirInicio(todoName) {
    if (validLenght() == 1) adicionaNovasOpcoes();

    let lstTodo = document.querySelector('#lstTodo');
    let todosEl = document.querySelectorAll('.todo-item');
    let lstTodoOpt = document.querySelector('#elemento');

    let obj = {
        id: generateUuid(),
        name: todoName,
        status: 'pending'
    };
    let newTodo = geraTodo(obj);
    let newTodoOpt = geraTodoOption(obj)

    if (todosEl.length > 0) {
        let firstOpt = lstTodoOpt.querySelector('option');
        lstTodo.insertBefore(newTodo, todosEl[0]);
        lstTodoOpt.insertBefore(newTodoOpt, firstOpt);

        todos.unshift(obj);
    } else {
        lstTodo.appendChild(newTodo);
        lstTodoOpt.appendChild(newTodoOpt);
        todos.push(obj);
    }

    calcularPosElementos();
}

// Inserção no final da lista.
// todoName: Nome do todo digitado no input
function inserirFim(todoName) {
    if (validLenght() == 1) adicionaNovasOpcoes();
    let lstTodo = document.querySelector('#lstTodo');
    let lstTodoOpt = document.querySelector('#elemento');

    let obj = {
        id: generateUuid(),
        name: todoName,
        status: 'pending'
    };
    let newTodo = geraTodo(obj);
    let newTodoOpt = geraTodoOption(obj)

    lstTodo.appendChild(newTodo);
    lstTodoOpt.appendChild(newTodoOpt);

    todos.push(obj);

    calcularPosElementos();
}

// Inserção antes de algum elemento na lista.
// todoName: Nome do todo digitado no input
// todoId: UUID (ID único) do elemento de referencia para ser inserido antes
function inserirAntesDe(todoName, todoId) {
    if (validLenght() == 1) adicionaNovasOpcoes();
    let lstTodo = document.querySelector('#lstTodo');
    let todoEl = document.querySelector('[data-uuid="' + todoId + '"]');
    let lstTodoOpt = document.querySelector('#elemento');
    let optEl = lstTodoOpt.querySelector('option[value="' + todoId + '"]');

    let obj = {
        id: generateUuid(),
        name: todoName,
        status: 'pending'
    };
    let newTodo = geraTodo(obj);
    let newTodoOpt = geraTodoOption(obj)

    lstTodo.insertBefore(newTodo, todoEl);
    lstTodoOpt.insertBefore(newTodoOpt, optEl);

    todoElIndex = todos.findIndex(todo => todo.id == todoId);

    todos.splice(todoElIndex, 0, obj);

    calcularPosElementos();
}

// Inserção depois de algum elemento na lista.
// todoName: Nome do todo digitado no input
// todoId: UUID (ID único) do elemento de referencia para ser inserido antes
function inserirDepoisDe(todoName, todoId) {
    if (validLenght() == 1) adicionaNovasOpcoes();
    let lstTodo = document.querySelector('#lstTodo');
    let todoEl = document.querySelector('[data-uuid="' + todoId + '"]');
    let lstTodoOpt = document.querySelector('#elemento');
    let optEl = lstTodoOpt.querySelector('option[value="' + todoId + '"]');

    let obj = {
        id: generateUuid(),
        name: todoName,
        status: 'pending'
    };
    let newTodo = geraTodo(obj);
    let newTodoOpt = geraTodoOption(obj)

    lstTodo.insertBefore(newTodo, todoEl.nextSibling);
    lstTodoOpt.insertBefore(newTodoOpt, optEl.nextSibling);

    todoElIndex = todos.findIndex(todo => todo.id == todoId);
    todos.splice(todoElIndex + 1, 0, obj);

    calcularPosElementos();
}


function removerTodo(todoId) {
    if (validLenght() == 2) removeNovasOpcoes();
    let todoEl = document.querySelector('[data-uuid="' + todoId + '"]');
}

function alterarTodo(todoId) {
    let todoEl = document.querySelector('[data-uuid="' + todoId + '"]');
}

function completarTodo(todoId) {
    let todoEl = document.querySelector('[data-uuid="' + todoId + '"]');
}

function calcularPosElementos() {
    let todosEl = document.querySelectorAll('.todo-item');

    for (let index = 0; index < todosEl.length; index++) {
        const element = todosEl[index];
        element.setAttribute('data-epos', index);
    }
}

function calcElArrayPos() {

}

function generateUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function buscaTodo(ev) {
    ev.preventDefault();
}

function geraTodo(obj) {
    let li = document.createElement('li');
    li.classList.add('todo-item', obj.status);
    li.setAttribute('data-uuid', obj.id);

    let fDiv = document.createElement('div');
    fDiv.classList.add('titulo');
    fDiv.innerHTML = obj.name;

    let sDiv = document.createElement('div');

    let buttonRemove = document.createElement('button');
    buttonRemove.classList.add('remove');
    buttonRemove.setAttribute('onclick', 'removerTodo(' + obj.id + ')');
    let imgRemove = document.createElement('img');
    imgRemove.src = 'assets/img/trash.svg';

    let buttonEdit = document.createElement('button');
    buttonEdit.classList.add('edit');
    buttonEdit.setAttribute('onclick', 'alterarTodo(' + obj.id + ')');
    let imgEdit = document.createElement('img');
    imgEdit.src = 'assets/img/pencil.svg';

    let buttonComplete = document.createElement('button');
    buttonComplete.classList.add('complete');
    buttonComplete.setAttribute('onclick', 'completarTodo(' + obj.id + ')');
    let imgComplete = document.createElement('img');
    imgComplete.src = 'assets/img/checked.svg';

    buttonRemove.appendChild(imgRemove);
    buttonEdit.appendChild(imgEdit);
    buttonComplete.appendChild(imgComplete);
    sDiv.appendChild(buttonRemove);
    sDiv.appendChild(buttonEdit);
    sDiv.appendChild(buttonComplete);
    li.appendChild(fDiv);
    li.appendChild(sDiv);


    setTimeout(() => {
        li.classList.add('active');
    }, 250);

    return li;
}

function validLenght() {
    return todos.filter(todo => todo.status != 'deleted').length;
}

function geraTodoOption(obj) {
    let option = document.createElement('option');
    option.text = obj.name;
    option.value = obj.id;

    return option;
}

function gravaDado(nome, dado) {
    return localStorage.setItem(nome, JSON.stringify(dado));
}

function recuperaDado(nome) {
    return JSON.parse(localStorage.getItem(nome));
}