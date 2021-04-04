import PropTypes from "prop-types";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PublishIcon from "@material-ui/icons/Publish";

const useStyles = makeStyles((theme) => ({
  fileUpload: {
    width: "0.1px",
    height: "0.1px",
    opacity: 0,
    overflow: "hidden",
    position: "absolute",
    zIndex: -1,
  },
  fileUploadLabel: {
    "&:focus": {
      outline: "1px dotted #000",
    },
    fontSize: "1rem",
    fontWeight: 700,
    color: "#fff",
    backgroundColor: theme.palette.info.main,
    display: "inline-block",
    padding: theme.spacing(1),
    cursor: "pointer",
    width: "180px",
    paddingTop: "14px",
  },
}));

const FileUpload = ({ name, onChange, width, children, accept }) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <input
        type="file"
        id={name}
        name={name}
        className={classes.fileUpload}
        onChange={onChange}
        accept={accept}
      />
      <label htmlFor={name} className={classes.fileUploadLabel} style={width && { width: width }}>
        <PublishIcon fontSize="small" style={{ paddingTop: "4px" }} />
        {children}
      </label>
    </React.Fragment>
  );
};

FileUpload.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  width: PropTypes.string,
  accept: PropTypes.string,
};

export default FileUpload;
