import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
//
import API from "../Api/Api";
import SnackbarMessage from "../Layout/SnackbarMessage";

const theme = createTheme();

export default function SignUp() {
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("warning");

    const snackbarClose = () => {
        setSnackbarOpen(false);
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        
        if (
            data.get("firstName") === "" ||
            data.get("lastName") === "" ||
            data.get("email") === "" ||
            data.get("mobile") === "" ||
            data.get("password") === ""
        ) {
            setSnackbarOpen(true);
            setSnackbarSeverity("error");
            setSnackbarMsg("Thông tin không đầy đủ!");
        } else {
            fetch(API + "/api/v1/auth/check-email?email=" + data.get("email")).then((resp) => {
                resp.text().then((result) => {
                    // console.log(result);
                    if (result === "") {
                        fetch(API + "/api/v1/auth/check-mobile?mobile=" + data.get("mobile")).then((resp) => {
                            resp.text().then((result) => {
                                // console.log(result);
                                if (result === "") {
                                    var myHeaders = new Headers();
                                    myHeaders.append("Content-Type", "application/json");

                                    var raw = JSON.stringify({
                                        firstName: data.get("firstName"),
                                        lastName: data.get("lastName"),
                                        email: data.get("email"),
                                        mobile: data.get("mobile"),
                                        password: data.get("password"),
                                    });

                                    var requestOptions = {
                                        method: "POST",
                                        headers: myHeaders,
                                        body: raw,
                                        redirect: "follow",
                                    };
                                    console.log(raw);
                                    fetch(API+"/api/v1/auth/register", requestOptions)
                                        .then((response) => {
                                            if (response.ok) {
                                                return response.json();
                                            }
                                            throw Error(response.status);
                                        })
                                        .then((result) => {
                                            console.log(result);
                                            localStorage.setItem("token", result.token);
                                            window.location = "/profile";
                                        })
                                        .catch((error) => {
                                            setSnackbarOpen(true);
                                            setSnackbarSeverity("error");
                                            setSnackbarMsg("False");
                                        });
                                } else {
                                    setSnackbarOpen(true);
                                    setSnackbarSeverity("error");
                                    setSnackbarMsg(result);
                                }
                            });
                        });
                    } else {
                        setSnackbarOpen(true);
                        setSnackbarSeverity("error");
                        setSnackbarMsg(result);
                    }
                });
            });
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <SnackbarMessage open={snackbarOpen} severity={snackbarSeverity} message={snackbarMsg} onClose={snackbarClose} />
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Đăng ký
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required fullWidth id="email" label="Email" name="email" autoComplete="email" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required fullWidth id="mobile" label="Mobile" name="mobile" autoComplete="mobile" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                        </Grid>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Đăng ký
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link to={"/signin"} variant="body2">
                                    Bạn đã có tài khoản? Đăng nhập
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}