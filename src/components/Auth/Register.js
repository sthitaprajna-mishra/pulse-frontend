// React
import React, { useState } from "react";
import { Link as RLink } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
// Axios
import Axios from "axios";
import axios from "../../api/axios";
// Yup
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// MUI
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert, AlertTitle, Badge, IconButton, Modal } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// Error
import { errorList } from "../../config/errorList";
// uuidv4
import { v4 as uuidv4 } from "uuid";

import SuccessIcon from "../../assets/success-svgrepo-com.svg";
import MailIcon from "../../assets/email-part-2-svgrepo-com.svg";
import ErrorIcon from "../../assets/erroricon-svgrepo-com.svg";
import ErrorBg from "../../assets/errorBg-svgrepo-com.svg";
import UserDefaultProfileIcon from "../../assets/defaultprofile.svg";
import InProgress from "../Utility/InProgress";

// const SuccessIcon = require("../assets/success-svgrepo-com.svg").default;

// const MailIcon = require("../assets/email-part-2-svgrepo-com.svg").default;

// const ErrorIcon = require("../assets/erroricon-svgrepo-com.svg").default;

// const ErrorBg = require("../assets/errorBg-svgrepo-com.svg").default;

// const UserDefaultProfileIcon = require("../assets/defaultprofile.svg").default;

const theme = createTheme();

const REGISTER_URL = "/api/auth/register";
const SIGN_URL = "/api/auth/CalculateSignature";

const modalStyle = {
  position: "absolute", // as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Register() {
  const [post, setPost] = useState(null);
  // imagekitio cloud
  //   const publicKey = process.env.REACT_APP_IMAGEKITIO_PUBLIC_KEY;
  //   const urlEndpoint = `${process.env.REACT_APP_IMAGEKITIO_URL_ENDPOINT$}`;
  //   const authenticationEndpoint = process.env.REACT_APP_IMAGEKITIO_AUTH_ENDPOINT;
  const [base64, setBase64] = useState("");

  //   const [imageFile, setImageFile] = useState();
  const [userProfilePictureSettings, setUserProfilePictureSettings] =
    useState("Default");
  const [userProfilePicture, setUserProfilePicture] = useState(
    UserDefaultProfileIcon
  );
  const [userProfilePictureFileType, setUserProfilePictureFileType] =
    useState(false);
  const [userProfilePictureFileSize, setUserProfilePictureFileSize] =
    useState(false);

  function getBase64(file) {
    return new Promise(function (resolve, reject) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = reject;
      reader.onload = function () {
        resolve(reader.result);
      };
    });
  }

  const handleUserProfilePictureUpload = (e) => {
    const selectedPicture = e.target.files[0];
    console.log("just uploaded");
    console.log(selectedPicture);

    // file type validation
    if (
      !["image/jpeg", "image/jpg", "image/png"].includes(selectedPicture.type)
    ) {
      setUserProfilePictureFileType(true);
      return;
    }
    // file size validation
    if (selectedPicture.size >= 2000000) {
      setUserProfilePictureFileSize(true);
      return;
    }
    setUserProfilePictureFileSize(false);
    setUserProfilePictureFileType(false);
    setUserProfilePicture(URL.createObjectURL(selectedPicture));
    console.log(URL.createObjectURL(selectedPicture));
    // setImageFile(selectedPicture);

    getBase64(selectedPicture).then((res) => {
      setBase64(res + "");
      console.log(base64);
    });

    setUserProfilePictureSettings("Custom");
  };

  // modal
  const [registerStatus, setRegisterStatus] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = (status) => {
    setRegisterStatus(status);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,40}$/;

  // Form Validation
  const schema = yup.object().shape({
    name: yup.string().required("Name is a mandatory field"),
    username: yup.string().required("Username is a mandatory field"),
    dob: yup.date().required("Date of Birth is a mandatory field"),
    email: yup
      .string()
      .email("Email must be a valid email")
      .required("Email is a mandatory field"),
    password: yup
      .string()
      .required("Password is a mandatory field")
      .matches(
        passwordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&). Password must be at least six characters long and at most 40 characters long."
      )
      .min(6, "Password must be at least six characters long")
      .max(40, "Password must be at most 40 characters long"),
    // confirmPassword: yup
    //   .string()
    //   .oneOf(
    //     [yup.ref("password"), null],
    //     "Password and Confirm Password do not match"
    //   )
    //   .required("Confirm Password is a mandatory field"),
  });

  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // on submit
  const onSubmit = (data) => {
    console.log(data);

    setPost("inprocess");

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios
      .get(SIGN_URL)
      .then((res) => {
        console.log(res.data);
        Axios.post(
          "https://upload.imagekit.io/api/v1/files/upload",
          {
            file:
              base64.length > 0
                ? base64
                : "https://xsgames.co/randomusers/avatar.php?g=pixel",
            publicKey: process.env.IMAGEKITIO_PUBLIC_KEY,
            signature: res.data.result.signature,
            expire: res.data.result.expire,
            token: res.data.result.token,
            fileName: uuidv4(),
            useUniqueFileName: true,
          },
          config
        )
          .then((res) => {
            console.log(res);

            console.log(data.dob);

            axios
              .post(REGISTER_URL, {
                DisplayPictureURL: res.data.url,
                Name: data.name,
                DOB: data.dob,
                UserName: data.username,
                Email: data.email,
                Password: data.password,
              })
              .then((res) => {
                console.log(res.data.statusCode);
                setPost("processed");
                if (res.data.statusCode === 200) {
                  handleOpen("success");
                } else {
                  handleOpen(res.data.errors[0]);
                  console.log(registerStatus);
                }
              })
              .catch((err) => {
                handleOpen(err.response.data);
                setPost("processed");
              });
          })
          .catch((err) => {
            console.log(err.response);
            setPost("processed");
          });
      })
      .catch((err) => {
        console.log(err);
        setPost("processed");
      });
    console.log(data);
  };

  // terms and conditions
  //   const [checkTC, setCheckTC] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="140"
                image={registerStatus === "success" ? MailIcon : ErrorBg}
              />
              <CardContent>
                {registerStatus === "success" ? (
                  <>
                    <Typography gutterBottom variant="h5" component="div">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          columnGap: 1,
                        }}
                      >
                        <img
                          alt="Success Icon"
                          style={{ width: 30, height: 30 }}
                          src={SuccessIcon}
                        />
                        <Typography>Email sent successfully!</Typography>
                      </Box>
                    </Typography>
                    <Typography mt={2} variant="body2" color="text.secondary">
                      We've sent an email to <b>{getValues("email")}</b> to
                      verify your email address and activate your account. The
                      link in the email will expire in 6 hours.
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography gutterBottom variant="h5" component="div">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          columnGap: 1,
                        }}
                      >
                        <img
                          alt="Error Icon"
                          style={{ width: 30, height: 30 }}
                          src={ErrorIcon}
                        />
                        <Typography>An error occurred!</Typography>
                      </Box>
                    </Typography>
                    <Typography mt={2} variant="body2" color="text.secondary">
                      {
                        errorList.find((el) => el.title === registerStatus)
                          ?.description
                      }
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Box>
        </Modal>
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <Avatar
                  sx={{
                    bgcolor: "secondary.main",
                    height: 30,
                    width: 30,
                  }}
                >
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={(e) => handleUserProfilePictureUpload(e)}
                  />
                  <PhotoCamera sx={{ height: 20, width: 20 }} />
                </Avatar>
              </IconButton>
            }
          >
            {userProfilePictureSettings === "Default" ? (
              <Avatar
                sx={{
                  mt: 2,
                  height: 60,
                  width: 60,
                  padding: 1,
                  border: `2px solid #bdbdbd`,
                }}
                src={userProfilePicture}
              />
            ) : (
              <Avatar
                sx={{
                  mt: 2,
                  height: 60,
                  width: 60,
                  padding: 0,
                }}
                src={userProfilePicture}
              />
            )}
          </Badge>
          {userProfilePictureFileSize ? (
            <Alert sx={{ mt: 1, textAlign: "left" }} severity="warning">
              <AlertTitle>Warning</AlertTitle>
              Image size must be less than — <strong>2MB</strong>
            </Alert>
          ) : null}
          {userProfilePictureFileType ? (
            <Alert sx={{ mt: 1, textAlign: "left" }} severity="warning">
              <AlertTitle>Warning</AlertTitle>
              We accept images of only — <strong>JPEG / JPG / PNG</strong> type
            </Alert>
          ) : null}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  autoFocus
                  fullWidth
                  id="name"
                  label="Name"
                  {...register("name")}
                  error={errors.name?.message?.toString() ? true : false}
                  helperText={errors.name?.message?.toString()}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  {...register("username")}
                  error={errors.username?.message?.toString() ? true : false}
                  helperText={errors.username?.message?.toString()}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="dob"
                  control={control}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DateTimePicker"]}>
                        <DatePicker
                          {...field}
                          slotProps={{
                            textField: { required: true, size: "small" },
                          }}
                          label="Date of Birth"
                          error={!!errors.dob}
                          helperText={errors.dob?.message?.toString()}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  {...register("email")}
                  error={errors.email?.message?.toString() ? true : false}
                  helperText={errors.email?.message?.toString()}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  {...register("password")}
                  error={errors.password?.message?.toString() ? true : false}
                  helperText={errors.password?.message?.toString()}
                  size="small"
                />
              </Grid>
            </Grid>
            <Button
              //   disabled={!checkTC}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RLink} to="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {post === "inprocess" ? <InProgress /> : <></>}
      </Container>
    </ThemeProvider>
  );
}
