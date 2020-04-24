import { action, thunk, computed } from 'easy-peasy';
import TodoModel from 'app/interfaces/todo/TodoModel';
import Todo from 'app/interfaces/todo/Todo';
import { todoService } from 'app/services/apiServices/todo-service';

const TodoStore: TodoModel = {
	items: [],
	currentTodo: undefined,
	setTodos: action((state, payload) => {
		state.items = payload;
	}),
	addTodo: action((state, payload) => {
		state.items.push(payload);
	}),
	toggleCompleted: action((state, payload) => {
		let todoIndex = state.items.findIndex(t => t.id === payload.id);

		state.items[todoIndex].completed = !payload.completed;
	}),
	setCurrentTodo: action((state, payload) => {
		state.currentTodo = payload;
	}),
	createTodo: thunk(async (state, entry): Promise<void> => {
		//await todoService.createTodo(entry);
		state.addTodo(entry);
	}),
	getTodos: thunk(async state => {
		const todos = await todoService.getTodos();
		state.setTodos(todos);
	}),
};

export default TodoStore;
