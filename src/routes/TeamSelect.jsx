import { useSelector, useDispatch } from "react-redux";
import { set } from "../redux/teamSlice";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ThemeProvider } from "@emotion/react";
import { bulletsTheme } from "../assets/bulletsStyle";
import Navbar from "../components/Navbar";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const TeamSelect = () => {
  const team = useSelector((state) => state.team.value);
  const [selectedTeam, setSelectedTeam] = useState(team);
  const [addSquad, setAddSquad] = useState(false);
  const [handlers, setHandlers] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [squads, setSquads] = useState([]);
  const squadName = useRef();

  const navigate = useNavigate();

  const createDogsString = () => {
    let dogsArray = [];
    for (let i = 0; i < selectedTeam.length; i++) {
      if (selectedTeam[i].dog !== "-") {
        dogsArray.push(
          dogs.filter((el) => el.id === selectedTeam[i].dog)[0].name
        );
      }
    }
    return dogsArray.join(" - ");
  };

  const handleDelete = (id) => {
    axios
      .delete(
        "https://flyball-distance.fly.dev/api/collections/squads/records/" + id,
        {
          headers: { Authorization: localStorage.getItem("pb_token") },
        }
      )
      .then((res) => {
        console.log(res);
        if (res.status === 204) {
          setSquads([...squads.filter((el) => el.id !== id)]);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSquadAdd = () => {
    axios
      .post(
        "https://flyball-distance.fly.dev/api/collections/squads/records",
        {
          name: squadName.current.value,
          data: selectedTeam,
          dogs: createDogsString(),
        },
        {
          headers: { Authorization: localStorage.getItem("pb_token") },
        }
      )
      .then((res) => {
        console.log(res);
        setSquads([...squads, res.data]);
        setAddSquad(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

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
    axios
      .get("https://flyball-distance.fly.dev/api/collections/squads/records", {
        headers: { Authorization: localStorage.getItem("pb_token") },
      })
      .then((res) => {
        setSquads(res.data.items);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const dispatch = useDispatch();

  return (
    <ThemeProvider theme={bulletsTheme}>
      <Modal
        open={addSquad}
        onClose={() => {
          setAddSquad(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            boxShadow: 24,
            p: 4,
          }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="squadname"
            label="Squad name"
            name="squadname"
            inputRef={squadName}
            autoComplete="squadname"
            autoFocus
          />
          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={() => {
              handleSquadAdd();
            }}
          >
            Add
          </Button>
        </Box>
      </Modal>
      <Navbar
        subheaderTop={
          <ListSubheader component="div" id="nested-list-subheader">
            Squads
          </ListSubheader>
        }
        childTop={squads.map((el, i) => (
          <ListItem
            key={i}
            disablePadding
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => {
                  handleDelete(el.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemButton component="button">
              <ListItemText
                primary={el.name}
                secondary={el.dogs}
                onClick={() => {
                  setSelectedTeam(el.data);
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        childBottom={
          <ListItem disablePadding>
            <ListItemButton
              component="button"
              onClick={() => {
                setAddSquad(true);
              }}
            >
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary={"Save current squad"} />
            </ListItemButton>
          </ListItem>
        }
      />
      {/* <ListItem key={text} disablePadding>
        <ListItemButton>
          <ListItemText primary={text} />
        </ListItemButton>
      </ListItem> */}
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
