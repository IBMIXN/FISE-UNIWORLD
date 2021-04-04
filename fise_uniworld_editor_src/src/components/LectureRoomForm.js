import PropTypes from "prop-types";
import { UpdateLectureRoomPropType } from "../propTypes/LectureRoom";
import React from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from "@material-ui/pickers";
import AddIcon from "@material-ui/icons/Add";
import FileUpload from "../components/FileUpload";
import { useReducerState } from "../utils/customHooks";
import BlobService from "../services/BlobService";
import { convertPdfToImages, convertPreviewImage } from "../utils/pdfToImageUtils";

const useStyles = makeStyles((theme) => ({
  lectureInfoPanel: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
  },
  divider: {
    padding: theme.spacing(1),
  },
  centerTableGrid: {
    display: "flex",
    justifyContent: "center",
  },
  createButton: {
    "&:hover": {
      backgroundColor: theme.palette.success.dark,
    },
    backgroundColor: theme.palette.success.main,
    color: "#fff",
  },
  addIcon: {
    color: "#fff",
    marginRight: theme.spacing(2),
  },
  progressLoader: {
    color: "#fff",
    marginRight: theme.spacing(2),
  },
  padTop: {
    paddingTop: theme.spacing(1),
  },
  padRight: {
    paddingRight: theme.spacing(1),
  },
  flexDisplay: {
    display: "flex",
  },
}));

const LectureRoomForm = ({ onSubmit, submitText, updateLectureRoom }) => {
  const classes = useStyles();
  const [isLoading, setLoading] = React.useState(false);
  const lectureRoomInitialState = {
    title: "",
    module: "",
    lecturer: "",
    startTime: moment().toISOString(),
    endTime: moment().toISOString(),
    firstSlideUrl: "",
    numSlides: 1,
  };
  const [lectureRoom, setLectureRoom] = useReducerState(lectureRoomInitialState);
  const [file, setFile] = React.useState(null);
  const [previewImage, setPreviewImage] = React.useState(null);

  React.useEffect(() => {
    if (updateLectureRoom) {
      setLectureRoom(updateLectureRoom);
    }
  }, [updateLectureRoom, setLectureRoom]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLectureRoom({
      [name]: value,
    });
  };

  const handleUploadLecturePdf = async (e) => {
    e.preventDefault();
    if (e.target.files[0] && e.target.files[0].name.match(/\.(pdf)$/)) {
      setFile(e.target.files[0]);
      setPreviewImage(await convertPreviewImage(e.target.files[0]));
    } else {
      alert("Please select a valid PDF document.");
    }
  };

  const handleDateChange = (val, start) => {
    if (start) {
      setLectureRoom({
        startTime: moment(val).toISOString(),
      });
    } else {
      setLectureRoom({
        endTime: moment(val).toISOString(),
      });
    }
  };

  const handleClickSubmit = async () => {
    setLoading(true);
    let data = { ...lectureRoom };
    if (file) {
      const { numSlides, formData } = await convertPdfToImages(file);
      const slide = await BlobService.upload(formData, "slides");
      data = { ...data, numSlides, firstSlideUrl: slide };
    }
    await onSubmit(data);
    setLectureRoom(lectureRoomInitialState);
    setLoading(false);
  };

  return (
    <Grid container spacing={2}>
      {" "}
      <Grid item md={12}>
        <Card className={classes.lectureInfoPanel}>
          <React.Fragment>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    disabled={isLoading}
                    id="title"
                    name="title"
                    label="Title"
                    placeholder="Enter the lecture title"
                    value={lectureRoom.title}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <div className={classes.divider} />
                  <TextField
                    fullWidth
                    disabled={isLoading}
                    id="module"
                    name="module"
                    label="Module"
                    placeholder="Enter the module"
                    value={lectureRoom.module}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <div className={classes.divider} />
                  <TextField
                    fullWidth
                    disabled={isLoading}
                    id="lecturer"
                    name="lecturer"
                    label="Lecturer"
                    placeholder="Enter lecturer name"
                    value={lectureRoom.lecturer}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDateTimePicker
                      id="startTime"
                      fullWidth
                      disabled={isLoading}
                      disablePast
                      showTodayButton
                      format="h:mm a - YYYY/MM/DD"
                      margin="normal"
                      label="Start Time"
                      value={lectureRoom.startTime}
                      onChange={(val) => {
                        handleDateChange(val, true);
                      }}
                      KeyboardButtonProps={{
                        "aria-label": "change start time",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDateTimePicker
                      id="endTime"
                      fullWidth
                      disabled={isLoading}
                      disablePast
                      showTodayButton
                      format="h:mm a - YYYY/MM/DD"
                      margin="normal"
                      label="End Time"
                      value={lectureRoom.endTime}
                      onChange={(val) => {
                        handleDateChange(val, false);
                      }}
                      KeyboardButtonProps={{
                        "aria-label": "change end time",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                  <div className={classes.divider} />
                  <div className={classes.flexDisplay}>
                    <TextField
                      fullWidth
                      className={classes.padRight}
                      disabled={isLoading}
                      name="firstSlideurl"
                      label="Lecture Slides"
                      placeholder="Upload lecture slides in a PDF format"
                      value={file ? file.name : lectureRoom.firstSlideUrl || ""}
                      onChange={() => {}}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <FileUpload
                      id="lectureSlideUpload"
                      name="lectureSlideUpload"
                      onChange={handleUploadLecturePdf}
                      width="120px"
                      accept="application/pdf"
                    >
                      Upload
                    </FileUpload>
                  </div>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Typography variant="subtitle2">Slide Preview</Typography>
                  <img
                    width="100%"
                    alt="Slide Preview"
                    src={
                      previewImage ||
                      lectureRoom.firstSlideUrl ||
                      "https://via.placeholder.com/700x500.png?text=Placeholder+Slide"
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button
                id="submitButton"
                className={classes.createButton}
                color="primary"
                variant="outlined"
                size="large"
                onClick={handleClickSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress className={classes.progressLoader} size={20} />
                ) : (
                  <AddIcon className={classes.addIcon} />
                )}
                {submitText}
              </Button>
            </CardActions>
          </React.Fragment>
        </Card>
      </Grid>
    </Grid>
  );
};

LectureRoomForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string.isRequired,
  updateLectureRoom: UpdateLectureRoomPropType,
};

LectureRoomForm.defaultProps = {
  updateLectureRoom: undefined,
};

export default LectureRoomForm;
