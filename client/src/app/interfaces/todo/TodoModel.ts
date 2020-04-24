import { Action, Computed, Thunk } from 'easy-peasy';
import Todo from './Todo';
import Store from '../Store';

export default interface TodoModel {
	items: Todo[];
	currentTodo?: Todo;
	setTodos: Action<TodoModel, Todo[]>;
	addTodo: Action<TodoModel, Todo>;
	toggleCompleted: Action<TodoModel, Todo>;
	setCurrentTodo: Action<TodoModel, Todo>;
	createTodo: Thunk<TodoModel, Todo>;
	getTodos: Thunk<TodoModel>;
}
