// Находим елементы со страницы
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
//const emptyList = document.querySelector('#emptyList');

let tasks = [];

// Сохранить в масив данные хранящиеся в localStorage
if (localStorage.getItem('tasks')){
	tasks = JSON.parse(localStorage.getItem('tasks'));
	console.log(tasks);
};

// Отобразить данные ввиде разметки которые прищли в масив из localStorage
tasks.forEach(function(task){
	// Формируем css class
	const cssClass = task.done ? "task-title--done" : "task-title";

    // Формируем разметку для новой задачи
    const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;

    	
	// Добавляем задачу на страницу
	tasksList.insertAdjacentHTML('beforeEnd', taskHTML)	
});

chekEmptyList(tasks);

// Добавление задач
form.addEventListener('submit', addTask)
// Удаление задач
tasksList.addEventListener('click', deleteTask);
// Отмечаем задачу завершонной
tasksList.addEventListener('click', doneTask);

// Функции
function addTask (event){
	// Отменяем стандартное поведение (отменяем отправку формы)
	event.preventDefault()

    // Достаем текст задачи из поля ввода
    const taskTexst = taskInput.value;

	// Описываем обькт ввода задач
	let newTask = {
		id: Date.now(),
		text: taskTexst,
		done: false	
	};

	// Добавляем задачу (этот объект) в массив задач
	tasks.push(newTask);

	// Добавляем задачу в хранилище браузера localStorage
	saveTolocalStorage();
	
	// Формируем css class
	const cssClass = newTask.done ? "task-title--done" : "task-title";

    // Формируем разметку для новой задачи
    const taskHTML = `<li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${newTask.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;

    	
	// Добавляем задачу на страницу
	tasksList.insertAdjacentHTML('beforeEnd', taskHTML)

	// Очищаем поля воода и добавляем на него фокус
	taskInput.value = '';
	taskInput.focus();

	// Проверка если в списке задач боле одного елмента, то скрываем блок список дел пуст
	// if (tasksList.children.length > 1){
	// 	emptyList.classList.add('none');
	// }

	chekEmptyList(tasks)
};

function deleteTask(event){
	// Провереяем что клик был по кнопке с атрибутом "удалить задачу"
	if (event.target.dataset.action === "delete"){
		const parentNode = event.target.closest('.list-group-item')
		
		// Удаляем задачу из разметки
		parentNode.remove();	
		
		// Определяем id задачи
		const id = Number(parentNode.id);

		// находим индекс задачи в массиве
		const index = tasks.findIndex(function(task){
			if (task.id === id){
				return true				
			}				
		});
		console.log(index);	

		// Удаляем задачу из массива
		tasks.splice(index, 1);
		console.log(tasks);	
		
		// Добавляем задачу в хранилище браузера localStorage
		saveTolocalStorage();
	}

	

	// Проверка есть ли в списке задач одтн елемент, показавем блок "Список дел пуст"
	// if (tasksList.children.length === 1){
	// 	emptyList.classList.remove('none');
	// }

	chekEmptyList(tasks)
};

function doneTask(event){
	// Провереяем что клик был по кнопке с атрибутом "задача выполнена"
	if (event.target.dataset.action === "done"){
		const parentNode = event.target.closest('.list-group-item');
		const taskTitle = parentNode.querySelector('.task-title');
		taskTitle.classList.toggle('task-title--done');	

		// Определяем ID задачи
		const id = Number(parentNode.id);
		const task = tasks.find(function(task){
			if (task.id === id){
				return true
			};
		});		
		task.done = !task.done

		// Добавляем задачу в хранилище браузера localStorage
		saveTolocalStorage();

		//console.log(tasks);
	}
};

function chekEmptyList(){
	if (tasks.length === 0){
		const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li>`

		tasksList.insertAdjacentHTML('beforeBegin', emptyListHTML);
	};

	if (tasks.length > 0){
		const emptyListEL = document.querySelector('#emptyList');
		emptyListEL ? emptyListEL.remove(): null;
	};
};

function saveTolocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks));
};