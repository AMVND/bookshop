import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function SnackbarMessage({ open, severity, message, onClose }) {
  return (
    <Snackbar
      sx={{ marginTop: "50px" }}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
    >
      <Alert
        severity={severity}
        action={[
          <IconButton key={"close"} aria-label="Close" sx={{ p: 0.5 }} onClick={onClose}>
            <CloseIcon />
          </IconButton>,
        ]}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}