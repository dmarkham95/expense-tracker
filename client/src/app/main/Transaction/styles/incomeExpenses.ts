import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
createStyles({
  root: {
    flexGrow: 1,
    marginBottom: "20px"
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: "100%",
    display: "flex"
  },
  minus: {
    color: "red"
  },
  plus: {
    color: "green"
  }

}),
);
