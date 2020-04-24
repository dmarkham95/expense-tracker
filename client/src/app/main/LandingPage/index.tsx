import useStyles from './styles';
import React from 'react';
import { Toolbar, Typography, AppBar, Container, Grid, Button } from '@material-ui/core';
import { useStoreState } from 'app/store/hooks';


const LandingPage: React.FC = () => {
    const classes = useStyles();
    const user = useStoreState((state) => state.auth.currentUser);
    const [loading, setLoading] = React.useState<boolean>(false);
    
    return (
        <React.Fragment>
            <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            Welcome to Expense Tracker
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
             A web app created using Reactjs.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary" href="/login" >
                    Login
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary" href="/signup">
                    Sigin up
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>

        </React.Fragment>
    )
}

export default LandingPage;