import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Container, Checkbox, FormControlLabel } from '@material-ui/core';

import { useStoreState, useStoreActions } from 'app/store/hooks';
import useStyles from './styles';
import TodoEntryForm from './TodoEntryForm';
import { AppSplashScreen } from '@app';

const Todo: React.FC = () => {
	const todos = useStoreState(state => state.todo.items);
	const getTodos = useStoreActions(state => state.todo.getTodos);
	const showMessage = useStoreActions(state => state.global.message.showMessage);
	const toggleCompleted = useStoreActions(state => state.todo.toggleCompleted);
	const classes = useStyles({});
	const [loading, setLoading] = React.useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			await getTodos();
			setLoading(false);
		};

			fetchData();
	}, []); // eslint-disable-line

	if (loading) {
		return <AppSplashScreen />;
	}

	return (
		<div className={classes.root}>
			<Container maxWidth="md">
      <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            Todo List
            </Typography>
				<TodoEntryForm />
				{todos.map(todo => (
					<Card className={classes.entryCard} key={todo.id}>
						<FormControlLabel
							className={'m-4'}
							value="end"
							control={
								<Checkbox
									className={'px-4 ml-4'}
									color={'primary'}
									tabIndex={-1}
									disableRipple
									checked={todo.completed}
									onChange={() => toggleCompleted(todo)}
									onClick={ev => ev.stopPropagation()}
								/>
							}
							label={
								<Typography
									variant="subtitle1"
									className="todo-title truncate"
									color={todo.completed ? 'textSecondary' : 'inherit'}
								>
									{todo.title}
								</Typography>
							}
							labelPlacement="end"
						/>
					</Card>
				))}
			</Container>
		</div>
	);
};

export default Todo;
