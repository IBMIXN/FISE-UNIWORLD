import PropTypes from "prop-types";
import { MeetingTablePropType } from "../propTypes/EventRoom";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  InputAdornment,
  Avatar,
  Typography,
  Grid,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FileUpload from "./FileUpload";
import { useReducerState } from "../utils/customHooks";
import BlobService from "../services/BlobService";
import { getFileNameFromBlobUrl } from "../utils/blobs";

const useStyles = makeStyles((theme) => ({
  divider: {
    padding: theme.spacing(1),
  },
  textMuted: {
    color: "rgba(0, 0, 0, 0.54)",
  },
  padLeft: {
    paddingLeft: theme.spacing(1),
  },
  padRight: {
    paddingRight: theme.spacing(1),
  },
  flexDisplay: {
    display: "flex",
  },
}));

const TableDialog = ({ open, onClose, onSubmit, updateTable }) => {
  const classes = useStyles();
  const tableInitialState = {
    title: "",
    type: "RoundMeetingTable",
    zoomUrl: "",
    logoUrl: "",
  };
  const [table, setTable] = useReducerState(tableInitialState);
  const [logos, setLogos] = React.useState([]);

  React.useEffect(() => {
    if (updateTable) {
      setTable(updateTable);
    }
  }, [updateTable, setTable]);

  React.useEffect(() => {
    async function fetchLogos() {
      try {
        const fetchedLogos = await BlobService.get("logos");
        if (Array.isArray(fetchedLogos) && fetchedLogos.length > 0) {
          setLogos(fetchedLogos);
          setTable({ logoUrl: fetchedLogos[0] });
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchLogos();
  }, [setTable]);

  const resetTableState = () => {
    setTable(tableInitialState);
    if (Array.isArray(logos) && logos.length > 0) {
      setTable({ logoUrl: logos[0] });
    }
  };

  const handleClose = () => {
    resetTableState();
    onClose();
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file && file.name.match(/\.(jpg|jpeg|png|gif)$/)) {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      const logoUrl = await BlobService.upload(formData, "logos");
      setLogos([...logos, logoUrl]);
      setTable({ logoUrl });
    }
  };

  const handleSubmit = () => {
    table.logoUrl = table.logoUrl === "" ? undefined : table.logoUrl;
    table.zoomUrl = table.zoomUrl === "" ? undefined : table.zoomUrl;
    onSubmit(table);
    resetTableState();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTable({
      [name]: value,
    });
  };

  return (
    <Dialog id="dialog" open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        {!!updateTable ? "Edit" : "Add"} a meeting table
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          id="meetingTitle"
          margin="dense"
          name="title"
          label="Meeting Title"
          placeholder="e.g. Team 1 Project Demo"
          type="text"
          fullWidth
          value={table.title}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <div className={classes.divider} />
        <FormControl component="fieldset">
          <Typography variant="caption" className={classes.textMuted}>
            Table Type
          </Typography>
          <RadioGroup
            aria-label="type"
            id="tableType"
            name="type"
            value={table.type}
            onChange={handleChange}
            row
          >
            <FormControlLabel
              value="RoundMeetingTable"
              control={<Radio color="primary" />}
              label="Round Table"
            />
            <FormControlLabel
              value="RectangularMeetingTable"
              control={<Radio color="primary" />}
              label="Rectangular Table"
            />
          </RadioGroup>
        </FormControl>
        <TextField
          id="zoomUrl"
          margin="dense"
          name="zoomUrl"
          label="Zoom URL"
          placeholder="e.g. https://us04web.zoom.us/..."
          type="text"
          fullWidth
          value={table.zoomUrl}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <div className={classes.divider} />
        <Grid container>
          <Grid className={classes.flexDisplay} item xs>
            <Autocomplete
              id="selectLogo"
              className={classes.padRight}
              fullWidth
              disableClearable
              noOptionsText="No options. Please upload a logo."
              options={logos}
              getOptionLabel={(logo) => getFileNameFromBlobUrl(logo)}
              renderOption={(option) => (
                <React.Fragment>
                  <Avatar alt="logo" src={option || "https://via.placeholder.com/150"} />
                  <span className={classes.padLeft}>{getFileNameFromBlobUrl(option)}</span>
                </React.Fragment>
              )}
              value={table.logoUrl}
              onChange={(e, value) => {
                setTable({ logoUrl: value });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Logo"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        {table.logoUrl && <Avatar alt="logo" src={table.logoUrl} />}
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
            <FileUpload id="uploadLogo" name="uploadLogo" onChange={handleUpload} accept="image/*">
              Upload Logo
            </FileUpload>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button id="closeButton" onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button id="submitButton" onClick={handleSubmit} color="primary">
          Save Meeting Table
        </Button>
      </DialogActions>
    </Dialog>
  );
};

TableDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  updateTable: MeetingTablePropType,
};

TableDialog.defaultProps = {
  updateTable: undefined,
};

export default TableDialog;
