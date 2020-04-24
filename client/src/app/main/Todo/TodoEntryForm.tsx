import React, { useCallback } from 'react';
import TextField from '@material-ui/core/TextField';
import useStyles from './styles';
import { useStoreActions } from 'app/store/hooks';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import Todo from 'app/interfaces/todo/Todo';
import { Box, Button } from '@material-ui/core';

const TodoEntrySchema = yup.object().shape({
	title: yup
		.string()
		.trim()
		.min(5, 'Must be at least 5 characters.')
		.max(200, 'Can be no longer than 200 characters')
		.required('Required.'),
});

const TodoEntryForm: React.FC = () => {
	const classes = useStyles({});
	const createTodo = useStoreActions(state => state.todo.createTodo);
	const { register, handleSubmit, errors, reset } = useForm<Todo>({
		validationSchema: TodoEntrySchema,
	});
	const showMessage = useStoreActions(state => state.global.message.showMessage);

	const onSubmit = async (data: Todo) => {
		data.id = Math.random();
		data.userId = 1;
    data.completed = false;
    
    try {
	  await createTodo(data);  
	  showMessage({
        message: "Todo item saved",
        variant: "success",
      });
    } catch (error) {
     showMessage({
        message: "Error creating Todo item. Please try again",
        variant: "error",
      });
    }
		
		reset();
	};



	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate className={classes.formContainer}>
			<TextField
				inputRef={register}
				label="Title"
				name="title"
				fullWidth
				variant="outlined"
				error={!!errors.title}
				helperText={errors.title ? errors.title.message : ''}
			/>

			<Box display="flex" justifyContent="flex-end">
				<Button type="submit" color="primary" variant="contained">
					Add Todo Item
				</Button>
			</Box>
		</form>
	);
};

export default TodoEntryForm;
