import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";

import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import API from "../Api/Api";

const theme = createTheme();

export default function ChangePassword() {
    const navigation = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log(data.get("passOld"), data.get("passNew"));

        fetch(API + "/api/v1/auth/change-password?passOld=" + data.get("passOld") + "&passNew=" + data.get("passNew"), {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
            .then((response) => {
                console.log(response);
                if (response.ok) {
                    return response.json();
                }
                throw Error(response.status);
            })
            .then((result) => {
                console.log(result);
                if (result !== null) {
                    localStorage.setItem("token", result.token);
                    // console.log("true");
                    navigation("/profile/update");
                } else {
                    alert("Mật khẩu không chính xác");
                }
            })
            .catch((error) => {
                console.log("error", error);
                alert("Email, password are wrong");
            });
    };

    return (
        <ThemeProvider theme={theme}>
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
                        Đổi mật khẩu
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="passOld"
                            label="Mật khẩu cũ"
                            type="password"
                            autoComplete="passOld"
                            autoFocus
                        />
                        <TextField margin="normal" required fullWidth name="passNew" label="Mật khẩu mới" type="password" />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Save
                        </Button>
                        <Button type="button" fullWidth variant="contained" onClick={() => navigation("/profile/update")}>
                            Huỷ
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}