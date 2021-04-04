import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import LectureRoomService from "../services/LectureRoomService";
import { useReducerState } from "../utils/customHooks";
import { validateLectureRoom } from "../utils/validate";
import LectureRoomForm from "../components/LectureRoomForm";

const useStyles = makeStyles((theme) => ({
  mainSection: {
    paddingTop: theme.spacing(5),
  },
}));

const CreateLectureRoom = (props) => {
  const classes = useStyles();
  const [alert, setAlert] = useReducerState({
    open: false,
    message: "",
    type: "success",
  });

  const showAlert = (msg, type) => {
    setAlert({ open: true, message: msg, type: type });
  };

  const hideAlert = () => {
    setAlert({ open: false });
  };

  const handleSubmit = async (data) => {
    if (validateLectureRoom(data)) {
      try {
        const createdLectureRoom = await LectureRoomService.create(data);
        props.history.push({
          pathname: `/lecturerooms/${createdLectureRoom._id}`,
          state: { created: true },
        });
      } catch (err) {
        showAlert("Failed to create lecture room. Please try again later.", "error");
        console.log(err);
      }
    } else {
      showAlert("Please make sure you have entered all the fields", "warning");
    }
  };

  return (
    <Container className={classes.mainSection}>
      <Snackbar
        open={alert.open}
        autoHideDuration={5000}
        onClose={hideAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert elevation={6} variant="filled" onClose={hideAlert} severity={alert.type}>
          {alert.message}
        </MuiAlert>
      </Snackbar>
      <Typography variant="h4">Create Lecture Room</Typography>
      <LectureRoomForm onSubmit={handleSubmit} submitText="Create Lecture Room" />
    </Container>
  );
};

export default CreateLectureRoom;
