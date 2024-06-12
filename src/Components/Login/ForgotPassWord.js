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
import API from "../Api/Api";
import SnackbarMessage from "../Layout/SnackbarMessage";

const theme = createTheme();

export default function ForgotPassWord() {
    const [email, setEmail] = React.useState("");
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState("");
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("warning");
    const snackbarClose = () => {
        setSnackbarOpen(false);
    };
    function handleEmailChange(event) {
        const inputValue = event.target.value;
        const emailRegex = /\b[A-Z0-9._%+-]+@gmail\.com\b/i;
        const isValidEmail = emailRegex.test(inputValue);
        setEmail(inputValue);

        if (isValidEmail) {
            console.log("Valid email!");
        } else {
            console.log("Invalid email!");
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault();

        fetch(API+"/api/v1/auth/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
            }),
        })
            .then((response) => {
                console.log(response);
                if (response.ok) {
                    return response.text();
                }
                throw Error(response.status);
            })
            .then((result) => {
                console.log(result);
                if (result === "true") {
                    setSnackbarOpen(true);
                    setSnackbarSeverity("success");
                    setSnackbarMsg("Đã đổi mật khẩu, vui lòng kiểm tra trong gmail.");
                    
                } else {
                    setSnackbarOpen(true);
                    setSnackbarSeverity("error");
                    setSnackbarMsg("Thông tin không chính xác!");
                }
            })
            .catch((error) => {
                console.log("error", error);
                setSnackbarOpen(true);
                setSnackbarSeverity("error");
                setSnackbarMsg("Lỗi hệ thống, vui lòng thử lại sau!");
            });
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
                        Forgot Password
                    </Typography>
                    <Box component={"form"} onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="email"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            autoFocus
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Reset Password
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link to={"/signin"} variant="body2">
                                    {"Đăng nhập"}
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to={"/signup"} variant="body2">
                                    {"Bạn chưa có tài khoản? Đăng ký"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}