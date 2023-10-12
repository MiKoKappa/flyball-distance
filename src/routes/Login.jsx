import axios from "axios";
import { useRef } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import PetsIcon from "@mui/icons-material/Pets";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import { bulletsTheme } from "../assets/bulletsStyle";
import { useNavigate } from "react-router-dom";

const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/MiKoKappa">
        Tkaczyk
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const Login = () => {
  const navigate = useNavigate();

  const login = useRef();
  const password = useRef();

  const logIn = (login, password) => {
    axios
      .post(
        "https://flyball-distance.fly.dev/api/collections/users/auth-with-password",
        { identity: login, password: password }
      )
      .then((res) => {
        localStorage.setItem("pb_token", res.data.token);
        console.log(res);
        navigate("/teamselect");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ThemeProvider theme={bulletsTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <PetsIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Project Kr0-Check
            </Typography>
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                logIn(
                  e.currentTarget.elements.login.value,
                  e.currentTarget.elements.password.value
                );
              }}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="login"
                label="Login"
                name="login"
                ref={login}
                autoComplete="login"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                ref={password}
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
