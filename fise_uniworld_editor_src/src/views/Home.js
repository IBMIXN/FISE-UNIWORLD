import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button, Container, Typography } from "@material-ui/core";
import UniWorldScreenShotImg from "../assets/img/uniworldscreenshot.png";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  jumbo: {
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),
    display: "flex",
    alignItems: "center",
    height: "80vh",
  },
  img: {
    width: "100%",
  },
  divider: {
    padding: theme.spacing(1),
  },
  viewButton: {
    "&:hover": {
      backgroundColor: theme.palette.info.dark,
    },
    backgroundColor: theme.palette.info.main,
  },
  createButton: {
    "&:hover": {
      backgroundColor: theme.palette.success.dark,
    },
    marginLeft: theme.spacing(2),
    backgroundColor: theme.palette.success.main,
  },
}));

const Home = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Container>
        <Grid container className={classes.jumbo}>
          <Grid item md={8} xs={12}>
            <Typography variant="h2">UniWorld Editor</Typography>
            <Typography variant="subtitle1">
              This is a web editor tool for managing virtual rooms in the{" "}
              <a href="https://brianmin.tech/uniworld/" target="_blank" rel="noreferrer noopener">
                UniWorld platform
              </a>
            </Typography>
            <div className={classes.divider} />
            <Button
              className={classes.viewButton}
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              to="/eventrooms"
            >
              View Event Rooms
            </Button>
            <Button
              className={classes.createButton}
              variant="contained"
              color="secondary"
              size="large"
              component={RouterLink}
              to="/create"
            >
              Create Event Room
            </Button>
          </Grid>
          <Grid item md={4} xs={12}>
            <img src={UniWorldScreenShotImg} alt="" className={classes.img} />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default Home;
