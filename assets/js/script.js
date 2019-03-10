let todos = [
    {
        id: generateUuid(),
        name: 'Todo 1',
        status: 'pending'
    },
    {
        id: generateUuid(),
        name: 'Todo 2',
        status: 'pending'
    }
];

let selectedCategory = '';
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

(function () {
    montaHeader();
    montaLista();
    let storageTodos = recuperaDado('@app:todos');
    if (storageTodos) todos = storageTodos;
    montaOpcoes();
    let navItems = document.querySelectorAll('.todoNav-item');
    renderizaConteudo('', navItems[0]);
    calcElPos();
})();

function ativaMenu(el) {

}

function montaHeader() {
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

function montaLista() {
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

function montaOpcoes() {
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

    let selectTodo;
    let filteredTodos = todos.filter(todo => todo.status != 'deleted');
    if (filteredTodos.length > 1) {
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

        selectTodo = document.createElement('select');
        selectTodo.name = 'elemento';
        selectTodo.id = 'elemento';
        selectTodo.style.display = 'none';

        for (let index = 0; index < filteredTodos.length; index++) {
            const element = filteredTodos[index];
            if (element.status !== 'deleted') {
                let option = document.createElement('option');
                option.text = element.name;
                option.value = element.id;

                selectTodo.appendChild(option);
            }
        }
    }

    let div = document.querySelector('.advanced');
    div.appendChild(selectPosicao);
    if (filteredTodos.length > 1) div.appendChild(selectTodo);
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

        let todoItem = geraTodo(element.name, element.id);
        lst.appendChild(todoItem);
        setTimeout(() => {
            todoItem.classList.add('active');
        }, 200);

    }
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

        console.log(todos);
    } else {
        alert('Preencha o campo antes de salvar!');
    }

    ev.preventDefault();
}

function inserirInicio(todoName) {
    let lstTodo = document.querySelector('#lstTodo');
    let todosEl = document.querySelectorAll('.todo-item');

    let obj = {
        id: generateUuid(),
        name: todoName,
        status: 'pending'
    };
    let newTodo = geraTodo(obj.name, obj.id);

    if(todosEl.length > 0) {
        lstTodo.insertBefore(newTodo, todosEl[0]);

        todos.unshift(obj);
    } else {
        lstTodo.appendChild(newTodo);

        todos.push(obj);
    }

    calcElPos();
}

function inserirFim(todoName) {
    let lstTodo = document.querySelector('#lstTodo');

    let obj = {
        id: generateUuid(),
        name: todoName,
        status: 'pending'
    };
    let newTodo = geraTodo(obj.name, obj.id);

    lstTodo.appendChild(newTodo);

    todos.push(obj);

    calcElPos();
}

function inserirAntesDe(todoName, todoId) {
    let lstTodo = document.querySelector('#lstTodo');
    let todoEl = document.querySelector('[data-uuid="'+ todoId +'"]');

    let obj = {
        id: generateUuid(),
        name: todoName,
        status: 'pending'
    };
    let newTodo = geraTodo(obj.name, obj.id);

    lstTodo.insertBefore(newTodo, todoEl);

    todoElIndex = todos.findIndex(todo => todo.id == todoId);

    console.log(todoElIndex);

    todos.splice(todoElIndex, 0, obj);

    calcElPos();
}

function inserirDepoisDe(todoName, todoId) {
    let lstTodo = document.querySelector('#lstTodo');
    let todoEl = document.querySelector('[data-uuid="'+ todoId +'"]');

    let obj = {
        id: generateUuid(),
        name: todoName,
        status: 'pending'
    };
    let newTodo = geraTodo(obj.name, obj.id);

    lstTodo.insertBefore(newTodo, todoEl.nextSibling);

    todoElIndex = todos.findIndex(todo => todo.id == todoId);
    todos.splice(todoElIndex + 1, 0, obj);

    calcElPos();
}

function removerTodo() {
}

function alterarTodo() {
}

function completarTodo() {
}

function calcElPos() {
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

function geraTodo(todo, uiid) {
    let li = document.createElement('li');
    li.classList.add('todo-item');
    li.setAttribute('data-uuid', uiid);

    let fDiv = document.createElement('div');
    fDiv.classList.add('titulo');
    fDiv.innerHTML = todo;

    let sDiv = document.createElement('div');

    let buttonRemove = document.createElement('button');
    buttonRemove.classList.add('remove');
    buttonRemove.setAttribute('onclick', 'removerTodo(this)');
    let imgRemove = document.createElement('img');
    imgRemove.src = 'assets/img/trash.svg';

    let buttonEdit = document.createElement('button');
    buttonEdit.classList.add('edit');
    buttonEdit.setAttribute('onclick', 'alterarTodo(this)');
    let imgEdit = document.createElement('img');
    imgEdit.src = 'assets/img/pencil.svg';

    let buttonComplete = document.createElement('button');
    buttonComplete.classList.add('complete');
    buttonComplete.setAttribute('onclick', 'completarTodo(this)');
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

function gravaDado(nome, dado) {
    return localStorage.setItem(nome, JSON.stringify(dado));
}

function recuperaDado(nome) {
    return JSON.parse(localStorage.getItem(nome));
}