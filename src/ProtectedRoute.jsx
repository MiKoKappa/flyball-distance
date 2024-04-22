import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router";
import { Box, CircularProgress, ThemeProvider } from "@mui/material";
import { bulletsTheme } from "./assets/bulletsStyle";

const ProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useState(0);
  const authCheck = () => {
    let token = localStorage.getItem("pb_token");
    if (token && token.length > 0) {
      axios
        .post(
          "https://flyball-distance.fly.dev/api/collections/users/auth-refresh",
          {},
          { headers: { Authorization: token } }
        )
        .then((res) => {
          localStorage.setItem("pb_token", res.data.token);
          setAuth(1);
          console.log(res);
        })
        .catch((err) => {
          localStorage.removeItem("pb_token");
          setAuth(2);
          console.log(err);
        });
    } else {
      setAuth(2);
    }
  };
  useEffect(() => {
    authCheck();
    return () => {};
  }, []);

  return auth === 0 ? (
    <ThemeProvider theme={bulletsTheme}>
      <Box
        height={"100vh"}
        width={"100vw"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <CircularProgress />
      </Box>
    </ThemeProvider>
  ) : auth === 1 ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
