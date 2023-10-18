import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { ThemeProvider } from "@emotion/react";
import { bulletsTheme } from "../assets/bulletsStyle";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const Running = () => {
  const team = useSelector((state) => state.team.value);
  const [dogs, setDogs] = useState([]);
  const [heightModal, setHeightModal] = useState(0);
  const [historyModal, setHistoryModal] = useState(false);
  const [distances, setDistances] = useState([
    { distanceNow: 0, change: 0, history: [] },
    { distanceNow: 0, change: 0, history: [] },
    { distanceNow: 0, change: 0, history: [] },
    { distanceNow: 0, change: 0, history: [] },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const filterString =
      "(" + team.map((el) => "id='" + el.dog + "'").join("||") + ")";
    axios
      .get(
        "https://flyball-distance.fly.dev/api/collections/dogs/records?filter=" +
          filterString,
        {
          headers: { Authorization: localStorage.getItem("pb_token") },
        }
      )
      .then((res) => {
        if (res.data?.totalItems === 0) {
          localStorage.removeItem("pb_token");
          navigate("/login");
        } else {
          let dogsTemp = JSON.parse(JSON.stringify(res.data.items)).sort(
            (a, b) => {
              return (
                team.map((el) => el.dog).indexOf(a.id) -
                team.map((el) => el.dog).indexOf(b.id)
              );
            }
          );
          setDogs(dogsTemp);
          let tempDistances = JSON.parse(JSON.stringify(distances));
          for (let i = 0; i < dogsTemp.length; i++) {
            const configuration = dogsTemp[i].distances.filter(
              (el) =>
                el.handler === team[i].handler &&
                (i === 0 ? el.after === "first" : el.after === team[i - 1].dog)
            );
            if (configuration.length > 0) {
              tempDistances[i].distanceNow = configuration[0].distance;
            }
          }
          setDistances(tempDistances);
          setHeightModal(Math.min(...dogsTemp.map((el) => el.height)));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <ThemeProvider theme={bulletsTheme}>
      <Modal
        open={heightModal !== 0}
        onClose={() => {
          setHeightModal(0);
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

            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Wysokość hopek
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {heightModal} cm
          </Typography>
        </Box>
      </Modal>
      <Modal
        open={historyModal}
        onClose={() => {
          const configs = [];
          for (let i = 0; i < dogs.length; i++) {
            const configuration = dogs[i].distances.filter(
              (el) =>
                el.handler !== team[i].handler ||
                (i === 0 ? el.after !== "first" : el.after !== team[i - 1].dog)
            );
            configuration.push({
              after: i === 0 ? "first" : dogs[i - 1].id,
              handler: team[i].handler,
              distance: Number(distances[i].distanceNow),
            });
            configs.push(configuration);
          }
          Promise.all(
            configs.map((el, i) =>
              axios.patch(
                "https://flyball-distance.fly.dev/api/collections/dogs/records/" +
                  dogs[i].id,
                { distances: el },
                {
                  headers: {
                    Authorization: localStorage.getItem("pb_token"),
                  },
                }
              )
            )
          )
            .then((val) => {
              console.log(val);
              navigate("/teamselect");
            })
            .catch((e) => {
              console.log(e);
            });
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Change history
          </Typography>
          {dogs.map((el, i) => {
            const historyOfDistance = distances[i].history.join(" ⇾ ");
            console.log(historyOfDistance);
            return (
              <div key={i}>
                <Divider>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    color={"#6f6f6f"}
                  >
                    {el.name}
                  </Typography>
                </Divider>
                <Typography variant="subtitle1" gutterBottom color={"#6f6f6f"}>
                  {historyOfDistance}
                </Typography>
              </div>
            );
          })}
        </Box>
      </Modal>
      <Container maxWidth="sm" sx={{ marginTop: "2rem" }}>
        {dogs.map((el, i) => (
          <div key={i}>
            <Divider>
              <Typography variant="subtitle1" gutterBottom color={"#6f6f6f"}>
                {el.name}
              </Typography>
            </Divider>
            <Box
              my={"1rem"}
              key={i}
              sx={{ minWidth: 120 }}
              display={"flex"}
              gap={"1rem"}
            >
              <FormControl>
                <TextField
                  id="outlined-basic"
                  label="Distance"
                  variant="outlined"
                  value={distances[i].distanceNow}
                  onChange={(e) => {
                    let tempDistances = JSON.parse(JSON.stringify(distances));
                    tempDistances[i].distanceNow = e.target.value;
                    setDistances(tempDistances);
                  }}
                />
              </FormControl>
              <FormControl>
                <TextField
                  id="outlined-basic"
                  label="Change"
                  variant="outlined"
                  error={distances[i].change < 0}
                  color={distances[i].change > 0 ? "primary" : ""}
                  focused={distances[i].change > 0}
                  value={distances[i].change}
                />
              </FormControl>
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  const temp = JSON.parse(JSON.stringify(distances));
                  temp[i].change -= 0.25;
                  setDistances(temp);
                }}
              >
                <RemoveIcon />
              </Button>
              <Button
                size="large"
                variant="outlined"
                onClick={() => {
                  const temp = JSON.parse(JSON.stringify(distances));
                  temp[i].change += 0.25;
                  setDistances(temp);
                }}
              >
                <AddIcon />
              </Button>
            </Box>
          </div>
        ))}
        <Box mt={"3rem"} sx={{ minWidth: 120 }} display={"flex"} gap={"1rem"}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={() => {
              const temp = JSON.parse(JSON.stringify(distances));
              for (let i = 0; i < temp.length; i++) {
                temp[i].history = [...temp[i].history, temp[i].distanceNow];
                temp[i].distanceNow =
                  Number(temp[i].distanceNow) + Number(temp[i].change);
                temp[i].change = 0;
              }
              setDistances(temp);
            }}
          >
            RUN
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              const temp = JSON.parse(JSON.stringify(distances));
              for (let i = 0; i < temp.length; i++) {
                temp[i].history = [...temp[i].history, temp[i].distanceNow];
              }
              setDistances(temp);
              setHistoryModal(true);
            }}
          >
            Finish
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Running;
