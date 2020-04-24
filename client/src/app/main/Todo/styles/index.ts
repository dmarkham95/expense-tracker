import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  entryCard: {
    margin: '1rem 0',
  },
  formContainer: {
    margin: '1rem',
    '& .MuiTextField-root': {
      margin: '1rem 0',
    },
  },
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  todoItem: {
		'&.completed': {
			background: 'rgba(0,0,0,0.03)',
			'& .todo-title, & .todo-notes': {
				textDecoration: 'line-through'
			}
		}
	}
});
