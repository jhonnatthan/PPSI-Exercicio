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
    restauraDados();
    renderizaHeader();
    renderizaMain();
    renderizaSelects();
    renderizaConteudo();
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
    form.setAttribute('onsubmit', 'buscaTodo(event, this)');

    let buttonSearch = document.createElement('button');
    buttonSearch.type = 'submit';
    let imgSearch = document.createElement('img');
    imgSearch.src = 'assets/img/search.svg';

    let inputSearch = document.createElement('input');
    inputSearch.type = 'text';
    inputSearch.name = 's';
    inputSearch.placeholder = 'Pesquisar todo...';

    let buttonClear = document.createElement('button');
    buttonClear.type = 'reset';
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
        li.setAttribute('onclick', 'mudaFiltro(this)');
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
    
    let filteredTodos = todos;

    for (let index = 0; index < filteredTodos.length; index++) {
        const element = filteredTodos[index];
        if (element.status !== 'deleted') {

            let option = geraTodoOption(element);
            selectTodo.appendChild(option);
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
    
    exibeSeletor(true);
}

function removeNovasOpcoes() {
    let selectPosicao = document.querySelectorAll('#posicao option');

    for (let index = 0; index < selectPosicao.length; index++) {
        const element = selectPosicao[index];

        if (element.value == 'after' || element.value == 'before') {
            element.remove();
        }
    }

    exibeSeletor(false);
}

function renderizaConteudo() {
    console.log(todos);
    let filteredTodos = todos;

    let searchForm = document.querySelector('#searchForm');
    let searchInput = searchForm.querySelector('input');
    let s = searchInput.value;

    if(s != '') {
        filteredTodos = filteredTodos.filter(todo => todo.name.indexOf(s) > -1);
    }

    let navItem = document.querySelector('.todoNav-item.active');
    let categoria = navItem.getAttribute('data-category');

    if (categoria != '') {
        filteredTodos = filteredTodos.filter(todo => todo.status == categoria);
    }

    let lst = document.querySelector('#lstTodo');
    lst.innerHTML = null;

    for (let index = 0; index < filteredTodos.length; index++) {
        const element = filteredTodos[index];

        let obj = {
            id: element.id,
            name: element.name,
            status: element.status
        };

        let todoItem = geraTodo(obj);
        lst.appendChild(todoItem);
    }
}

// Funções auxiliares

function mudaFiltro(menuItem) {
    let navItems = document.querySelectorAll('.todoNav-item');
    for (let index = 0; index < navItems.length; index++) {
        const element = navItems[index];
        element.classList.remove('active');
    }
    menuItem.classList.add('active');
    renderizaConteudo();
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
    let todoEl = document.querySelector('#todo');
    let todoName = todoEl.value;

    if (todoName != '') {

        let obj = {
            id: generateUuid(),
            name: todoName,
            status: 'pending'
        };

        let tObj = {
            todoEl: geraTodo(obj),
            todoOptEl: geraTodoOption(obj),
            obj
        };

        let posicao = document.querySelector('#posicao').value;
        switch (posicao) {
            case 'first':
                inserirInicio(tObj);
                break;
            case 'last':
                inserirFim(tObj)
                break;
            case 'before':
                elementoId = document.querySelector('#elemento').value;
                inserirAntesDe(tObj, elementoId);
                break;
            case 'after':
                elementoId = document.querySelector('#elemento').value;
                inserirDepoisDe(tObj, elementoId);
                break;
            default:
                inserirFim(tObj);
                break;
        }
        todoEl.value = '';
        renderizaConteudo();
        gravaDado('@app:todos', todos);
    } else {
        alert('Preencha o campo antes de salvar!');
    }

    ev.preventDefault();
}

// Inserção do início da lista.
// todoName: Nome do todo digitado no input
function inserirInicio(tObj) {
    if (validLenght() == 1) adicionaNovasOpcoes();

    let todosEl = document.querySelectorAll('.todo-item');
    let lstTodoOpt = document.querySelector('#elemento');

    if (todosEl.length > 0) {
        let firstOpt = lstTodoOpt.querySelector('option');
        lstTodoOpt.insertBefore(tObj.todoOptEl, firstOpt);

        todos.unshift(tObj.obj);
    } else {
        lstTodoOpt.appendChild(tObj.todoOptEl);

        todos.push(tObj.obj);
    }

}

// Inserção no final da lista.
// todoName: Nome do todo digitado no input
function inserirFim(tObj) {
    if (validLenght() == 1) adicionaNovasOpcoes();
    let lstTodoOpt = document.querySelector('#elemento');

    lstTodoOpt.appendChild(tObj.todoOptEl);

    todos.push(tObj.obj);
}

// Inserção antes de algum elemento na lista.
// todoName: Nome do todo digitado no input
// todoId: UUID (ID único) do elemento de referencia para ser inserido antes
function inserirAntesDe(tObj, todoId) {
    if (validLenght() == 1) adicionaNovasOpcoes();
    let lstTodoOpt = document.querySelector('#elemento');
    let optEl = lstTodoOpt.querySelector('option[value="' + todoId + '"]');

    lstTodoOpt.insertBefore(tObj.todoOptEl, optEl);

    todoElIndex = todos.findIndex(todo => todo.id == todoId);

    todos.splice(todoElIndex, 0, tObj.obj);
}

// Inserção depois de algum elemento na lista.
// todoName: Nome do todo digitado no input
// todoId: UUID (ID único) do elemento de referencia para ser inserido antes
function inserirDepoisDe(tObj, todoId) {
    if (validLenght() == 1) adicionaNovasOpcoes();
    let lstTodoOpt = document.querySelector('#elemento');
    let optEl = lstTodoOpt.querySelector('option[value="' + todoId + '"]');

    lstTodoOpt.insertBefore(tObj.todoOptEl, optEl.nextSibling);

    todoElIndex = todos.findIndex(todo => todo.id == todoId);
    todos.splice(todoElIndex + 1, 0, tObj.obj);

}


function removerTodo(todoId) {
    if (validLenght() == 2) {
        removeNovasOpcoes();
        let posicaoTodo = document.querySelector('#posicao');
        if(posicaoTodo.selectedIndex  > 1) {
            posicaoTodoselectedIndex = 0;
        }
    };

    let todoIndex = todos.findIndex(todo => todo.id == todoId);
    todos[todoIndex].status = 'deleted';

    renderizaConteudo();
    gravaDado('@app:todos', todos);
}

function alterarTodo(todoId) {
    let todoEl = document.querySelector('[data-uuid="' + todoId + '"]');

    let options = todoEl.querySelector('.todoOptions');
    options.style.display = 'none';

    let editOptions = todoEl.querySelector('.todoEditOptions');
    editOptions.style.display = 'block';

    let input = todoEl.querySelector('input');
    input.removeAttribute('readonly');
    input.focus();
    input.classList.add('editing');
}

function completarEdicao(todoId) {
    let todoEl = document.querySelector('[data-uuid="' + todoId + '"]');

    let input = todoEl.querySelector('input');
    input.blur();
    input.classList.remove('editing');
    input.setAttribute('readonly', true);

    let editOptions = todoEl.querySelector('.todoEditOptions');
    editOptions.style.display = 'none';

    let options = todoEl.querySelector('.todoOptions');
    options.style.display = 'block';

    let todoIndex = todos.findIndex(todo => todo.id == todoId);
    todos[todoIndex].name = input.value;
}


function completarTodo(todoId) {
    let todoEl = document.querySelector('[data-uuid="' + todoId + '"]');

    let todoIndex = todos.findIndex(todo => todo.id = todoId);
    todos[todoIndex].status = 'completed';

    renderizaConteudo();
    gravaDado('@app:todos', todos);
}

function generateUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function buscaTodo(ev, form) {
    renderizaConteudo();
    ev.preventDefault();
}

function geraTodo(obj) {
    let li = document.createElement('li');
    li.classList.add('todo-item', obj.status);
    li.setAttribute('data-uuid', obj.id);

    let input = document.createElement('input');
    input.classList.add('titulo');
    input.setAttribute('readonly', true);
    input.value = obj.name;

    let sDiv = document.createElement('div');
    sDiv.classList.add('todoOptions');

    let buttonRemove = document.createElement('button');
    buttonRemove.classList.add('remove');
    buttonRemove.setAttribute('onclick', 'removerTodo("' + obj.id + '")');
    let imgRemove = document.createElement('img');
    imgRemove.src = 'assets/img/trash.svg';

    let buttonEdit = document.createElement('button');
    buttonEdit.classList.add('edit');
    buttonEdit.setAttribute('onclick', 'alterarTodo("' + obj.id + '")');
    let imgEdit = document.createElement('img');
    imgEdit.src = 'assets/img/pencil.svg';

    let buttonComplete = document.createElement('button');
    buttonComplete.classList.add('complete');
    buttonComplete.setAttribute('onclick', 'completarTodo("' + obj.id + '")');
    let imgComplete = document.createElement('img');
    imgComplete.src = 'assets/img/checked.svg';

    let tDiv = document.createElement('div');
    tDiv.classList.add('todoEditOptions');
    tDiv.style.display = 'none';    

    let buttonEditComplete = document.createElement('button');
    buttonEditComplete.classList.add('complete');
    buttonEditComplete.setAttribute('onclick', 'completarEdicao("' + obj.id + '")');
    let imgEditComplete = document.createElement('img');
    imgEditComplete.src = 'assets/img/checked.svg';

    buttonRemove.appendChild(imgRemove);
    buttonEdit.appendChild(imgEdit);
    buttonComplete.appendChild(imgComplete);
    buttonEditComplete.appendChild(imgEditComplete);
    sDiv.appendChild(buttonRemove);
    sDiv.appendChild(buttonEdit);
    sDiv.appendChild(buttonComplete);
    tDiv.appendChild(buttonEditComplete);
    li.appendChild(input);
    li.appendChild(sDiv);
    li.appendChild(tDiv);

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