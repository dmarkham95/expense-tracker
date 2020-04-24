import React, { useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { useStoreActions } from 'app/store/hooks';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import useStyles from './styles';
import UserLogin from 'app/interfaces/auth/UserLogin';
import { AppSplashScreen } from '@app';
import { Divider } from '@material-ui/core';


const LoginSchema = yup.object().shape({
	email: yup
		.string()
		.trim()
    .required('Required.'),
    password: yup
		.string()
		.trim()
		.required('Required.'),
});

export default function SignInSide() {
  const classes = useStyles({});
  const login = useStoreActions(state => state.auth.login);
  const showMessage = useStoreActions(state => state.global.message.showMessage);
  const { register, handleSubmit, errors, reset } = useForm<UserLogin>({
		validationSchema: LoginSchema,
	});
  
  const [loading, setLoading] = React.useState<boolean>(false);

 
  const onSubmit = async (data: UserLogin) => {
    try {
      setLoading(true);
      await login(data); 
      setLoading(false);
      
        
    } catch (error) {
      setLoading(false);
      showMessage({
        message: "Error during login attempt. Please try again",
        variant: "error",
      });
    }
		
		reset();
  };
  
  if(loading){
    return (<AppSplashScreen />)
  }
  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.form} noValidate>
            <TextField
            inputRef={register}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
            inputRef={register}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                  Forgot password?
                </Link> */}
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
          <div className="flex flex-col items-center">
				<Typography className="text-14 font-600 py-4">Credentials</Typography>

				<Divider className="mb-16 w-256" />

				<table className="text-left w-256">
					<thead>
						<tr>
							<th>
								<Typography className="font-600" color="textSecondary">
                UserName
								</Typography>
							</th>
							<th>
								<Typography className="font-600" color="textSecondary">
                Password
								</Typography>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td style={{width: "200px"}}>
								<Typography>testuser@testing.com</Typography>
							</td>
							<td>
								<Typography>Password123!</Typography>
							</td>
						</tr>

					</tbody>
				</table>
			</div>
        </div>
      </Grid>
    </Grid>
  );
}