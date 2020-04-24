import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Api } from './_Api';
import Todo from 'app/interfaces/todo/Todo';
import { apiConfig } from './_api-config';

class TodoService extends Api {
	public constructor(config: AxiosRequestConfig) {
		super(config);
	}

	public getTodos = async (): Promise<Array<Todo>> => {
		const todos = await this.get<Array<Todo>>(`/todos?_limit=10`);
		return todos.data;
	};

	public createTodo = async (data: Todo): Promise<void> => {
		await this.post<Todo>(`/todos`, data);
		
	};

}

export const todoService = new TodoService(apiConfig);
