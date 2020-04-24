import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import useStyles from './styles';
import UserSignUp from 'app/interfaces/auth/UserSignUp';
import { AppSplashScreen } from '@app';
import { useStoreActions } from 'app/store/hooks';

const SignUpSchema = yup.object({
	firstName: yup
		.string()
		.trim()
		.required("First Name is required")
		.min(2, "First Name must be at least 3 characters at minimum"),
	lastName: yup
		.string()
		.trim()
		.required("Last Name is required")
		.min(2, "Last Name must be at least 3 characters at minimum"),
	email: yup
		.string()
		.trim()
		.email()
		.required("Email is required"),
	password: yup
		.string()
		.trim()
		.required("Password is required")
		.matches(
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
			"Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
		),
	// passwordConfirmation: yup
	// 	.string()
	// 	.trim()
	// 	.oneOf([yup.ref("password"), null], "Passwords must match"),
});

export default function SignUp() {
  const classes = useStyles({});
  const signUp = useStoreActions(state => state.auth.signUp);
  const showMessage = useStoreActions(state => state.global.message.showMessage);
  const { register, handleSubmit, errors, reset } = useForm<UserSignUp>({
		validationSchema: SignUpSchema,
  });
  
  const [loading, setLoading] = React.useState<boolean>(false);

  const onSubmit = async (data: UserSignUp) => {
    try {

      setLoading(true);
      setTimeout(async function(){ await signUp(data); setLoading(false);}, 7000);
      
        
    } catch (error) {
      console.log(error);
      showMessage({
        message: "Error during Sign Up attempt. Please try again",
        variant: "error",
      })
    }
		
		reset();
  };
  
  if(loading){
    return (<AppSplashScreen />)
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                inputRef={register}
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                error={!!errors.firstName}
				        helperText={errors.firstName ? errors.firstName.message : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
              inputRef={register}
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                error={!!errors.lastName}
				        helperText={errors.lastName ? errors.lastName.message : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
              inputRef={register}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={!!errors.email}
				        helperText={errors.email ? errors.email.message : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
              inputRef={register}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={!!errors.password}
				        helperText={errors.password ? errors.password.message : ''}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <TextField
              inputRef={register}
                variant="outlined"
                required
                fullWidth
                name="passwordConfirmation"
                label="Password (Confirm)"
                type="password"
                id="passwordConfirmation"
                autoComplete="current-password"
                error={!!errors.password}
				        helperText={errors.password ? errors.password.message : ''}
              />
            </Grid> */}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}