import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  number: {
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0
    },
  },
  m10: {
    marginTop: "20px !important"
  }
});
