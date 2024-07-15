import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios, { AxiosError } from "axios";
import { Alert, IconButton, Snackbar } from "@mui/material";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string>("");

  const handleOpen = (message: string) => {
    setMessage(message);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessage("");
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    if (file !== undefined) {
      console.log("uploadFile to", url);
      const token = localStorage.getItem("authorization_token");

      try {
        const response = await axios({
          method: "GET",
          url,
          headers: token ? { Authorization: `Basic ${token}` } : undefined,
          params: {
            name: encodeURIComponent(file.name),
          },
        });
        console.log("File to upload: ", file.name);
        console.log("Uploading to: ", response.data);
        const result = await fetch(response.data, {
          method: "PUT",
          body: file,
        });
        console.log("Result: ", result);
        setFile(undefined);
      } catch (err) {
        const error = err as AxiosError;
        handleOpen(
          error.response?.statusText
            ? error.response?.statusText
            : error.message
        );
      }
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
      <Snackbar
        open={isOpen}
        autoHideDuration={50000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert variant="filled" severity={"error"}>
          {message}
          <IconButton aria-label="close" sx={{ p: 0.5 }} onClick={handleClose}>
            <svg viewBox="0 0 24 24" data-testid="CloseIcon" width={20}>
              <path
                fill="white"
                d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              ></path>
            </svg>
          </IconButton>
        </Alert>
      </Snackbar>
    </Box>
  );
}
