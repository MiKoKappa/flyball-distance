import { useSelector, useDispatch } from "react-redux";
import { set } from "../redux/teamSlice";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { ThemeProvider } from "@emotion/react";
import { bulletsTheme } from "../assets/bulletsStyle";

const TeamSelect = () => {
  const team = useSelector((state) => state.team.value);
  const [selectedTeam, setSelectedTeam] = useState(team);
  const [handlers, setHandlers] = useState([]);
  const [dogs, setDogs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        "https://flyball-distance.fly.dev/api/collections/handlers/records",
        { headers: { Authorization: localStorage.getItem("pb_token") } }
      )
      .then((res) => {
        if (res.data?.totalItems === 0) {
          localStorage.removeItem("pb_token");
          navigate("/login");
        } else {
          setHandlers(res.data.items);
        }
      })
      .catch((e) => {
        console.log(e);
      });
    axios
      .get("https://flyball-distance.fly.dev/api/collections/dogs/records", {
        headers: { Authorization: localStorage.getItem("pb_token") },
      })
      .then((res) => {
        if (res.data?.totalItems === 0) {
          localStorage.removeItem("pb_token");
          navigate("/login");
        } else {
          setDogs(res.data.items);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const dispatch = useDispatch();

  return (
    <ThemeProvider theme={bulletsTheme}>
      <Container maxWidth="sm">
        {selectedTeam.map((el, i) => (
          <Box
            my={"1rem"}
            key={i}
            sx={{ minWidth: 120 }}
            display={"flex"}
            gap={"1rem"}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Handler</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Handler"
                value={selectedTeam[i].handler}
                onChange={(e) => {
                  let temp = JSON.parse(JSON.stringify(selectedTeam));
                  temp[i].handler = e.target.value;
                  setSelectedTeam(temp);
                }}
              >
                <MenuItem value={"-"} key={"-"}>
                  -
                </MenuItem>
                {handlers?.map((el) => (
                  <MenuItem value={el.id} key={el.id}>
                    {el.firstname + " " + el.lastname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Dog</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Dog"
                value={selectedTeam[i].dog}
                onChange={(e) => {
                  let temp = JSON.parse(JSON.stringify(selectedTeam));
                  temp[i].dog = e.target.value;
                  setSelectedTeam(temp);
                }}
              >
                <MenuItem value={"-"} key={"-"}>
                  -
                </MenuItem>
                {dogs?.map((el) => (
                  <MenuItem value={el.id} key={el.id}>
                    {el.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ))}
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            dispatch(set(selectedTeam));
            navigate("/running");
          }}
        >
          Submit
        </Button>
      </Container>
    </ThemeProvider>
  );
};

export default TeamSelect;
