import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
createStyles({
  cardBorderMinus: {
    borderRight: "solid 5px red",
    width: "100%"
  },
  cardBorderPlus: {
    borderRight: "solid 5px green",
    width: "100%"
  },
  minus: {
    color: "red"
  },
  plus: {
    color: "green"
  }

}),
);
