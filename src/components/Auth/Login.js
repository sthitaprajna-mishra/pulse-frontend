// React
import React, { useState, useEffect } from "react";
import { Link as RLink, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
// Axios
import Axios from "axios";
import axios from "../../api/axios";
import { axiosPrivate } from "../../api/axios";
// Yup
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// MUI
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import { Card, CardContent, CardMedia, Modal } from "@mui/material";
// Error
import { errorList } from "../../config/errorList";

import InProgress from "../Utility/InProgress";
import { encryptToken } from "../Utility/AESLogic";

// SVGs
import FacebookOfficial from "../../assets/facebook-official.svg";
import GoogleIcon from "../../assets/google-tile.svg";
import TwitterOfficial from "../../assets/twitter-official.svg";
import ChatBg from "../../assets/undraw_online_connection_6778.svg";
import ErrorIcon from "../../assets/erroricon-svgrepo-com.svg";
import ErrorBg from "../../assets/errorBg-svgrepo-com.svg";

import PULSE from "../../assets/PULSE.jpg";
import PULSE_v2 from "../../assets/PULSE_v2.jpg";

const theme = createTheme();
const LOG_URL = "/api/auth/login";
const secretKey = "Amlan@123456789";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  //   console.log(`navigate: ${navigate}`);
  //   console.log(`location.state: ${location.state}`);
  //   console.log(`from: ${from}`);

  const [post, setPost] = useState(null);
  // Form Validation
  const schema = yup.object().shape({
    loginid: yup.string().required("Username or Email Id is a mandatory field"),
    password: yup
      .string()
      .min(3, "Password must be at least 3 characters")
      .max(40, "Password must be at most 40 characters")
      .required("Password is a mandatory field"),
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [signInStatus, setSignInStatus] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = (status) => {
    setSignInStatus(status);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const onSubmit = (data) => {
    setPost("inprocess");

    localStorage.setItem("loginid", data.loginid);

    // const newAuth = { ...auth, loginId: data.loginid };

    // console.log(`newAuth: ${newAuth.loginId}`);

    axios
      .post(
        LOG_URL,
        {
          LoginId: data.loginid,
          Password: data.password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        setPost("processed");

        // const newAuth = { ...auth, userId: res.data.userId };

        // console.log(`newAuth: ${newAuth}`);

        // setAuth(newAuth);

        localStorage.setItem("userId", res.data.userId);
        // const loginid = getValues("loginid");
        // const password = getValues("password");
        const accessToken = res.data.token;
        const refreshToken = res.data.refreshToken;

        console.log(`REAL ACC TOKEN: ${res.data.token}`);
        console.log(`REAL REF TOKEN: ${res.data.refreshToken}`);

        const encryptedAccessToken = encryptToken(accessToken, secretKey);
        const encryptedRefreshToken = encryptToken(refreshToken, secretKey);

        console.log(`ENC ACC TOKEN: ${encryptedAccessToken}`);
        console.log(`ENC REF TOKEN: ${encryptedRefreshToken}`);

        localStorage.setItem("accessToken", encryptedAccessToken);
        localStorage.setItem("refreshToken", encryptedRefreshToken);

        // const roleIds = res.data.roleIds;
        if (res.data.statusCode === 200) {
          console.log(`from: ${from}`);
          // fetchUserProfile();
          // navigate(from, { replace: true });
          window.location.href = "/";
        } else {
          handleOpen(res.data.errors[0]);
          localStorage.removeItem("loginid");
        }
      })
      .catch((err) => {
        console.log(err);
        setPost("processed");
        handleOpen(err.response.data);
        localStorage.removeItem("loginid");
      });
  };
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia component="img" height="140" image={ErrorBg} />
              <CardContent>
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
                    errorList.find((el) => el.title === signInStatus)
                      ?.description
                  }
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Modal>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            // backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundImage: `url(${PULSE})`, //`url(${ChatBg})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              mt: "25%",
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar> */}
            <Typography component="h1" variant="h5" mb={4}>
              Welcome to Pulse
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1 }}
            >
              <TextField
                variant="standard"
                margin="normal"
                fullWidth
                id="loginid"
                label="Username or Email"
                autoFocus
                {...register("loginid")}
                error={errors.loginid?.message?.toString() ? true : false}
                helperText={errors.loginid?.message?.toString()}
              />
              <TextField
                variant="standard"
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                {...register("password")}
                error={errors.password?.message?.toString() ? true : false}
                helperText={errors.password?.message?.toString()}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "end",
                }}
              >
                {/* <Link
                  component={RLink}
                  to="/requestnewpassword"
                  variant="body2"
                >
                  {"Forgot password?"}
                </Link> */}
                <Link component={RLink} to="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Box>

              {/* <Box sx={{ marginTop: 5 }}>
                <Divider>OR</Divider>
                <Typography
                  sx={{
                    marginTop: 2,
                    marginLeft: "40%",
                    color: "text.secondary",
                  }}
                >
                  Continue with
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <Box style={{ margin: 10, padding: 10 }}>
                  <a href="#">
                    <img
                      alt="Facebook Icon"
                      style={{ width: 60, height: 60 }}
                      src={FacebookOfficial}
                    />
                  </a>
                </Box>
                <Box style={{ margin: 10, padding: 10 }}>
                  <a href="#">
                    <img
                      alt="Google Icon"
                      style={{ width: 70, height: 70 }}
                      src={GoogleIcon}
                    />
                  </a>
                </Box>
                <Box style={{ margin: 10, padding: 10 }}>
                  <a href="#">
                    <img
                      alt="Twitter Icon"
                      style={{ width: 70, height: 60 }}
                      src={TwitterOfficial}
                    />
                  </a>
                </Box>
              </Box> */}
            </Box>
          </Box>
        </Grid>
        {post === "inprocess" ? <InProgress /> : <></>}
      </Grid>
    </ThemeProvider>
  );
}
