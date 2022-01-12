import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Typography,
  Collapse,
  TextField,
  FormControl,
  FormHelperText,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import MusicPlayer from "./MusicPlayer";
function Room(props) {
  const history = useHistory();
  const [guestCanPause, UpdateGuestCanPause] = useState(false);
  const [votesToSkip, UpdateVotesToSkip] = useState(2);
  const [isHost, UpdateIsHost] = useState(false);
  const [errorMsg, UpdateErrorMsg] = useState("");
  const [successMsg, UpdateSuccessMsg] = useState("");
  const [showSettings, UpdateShowSettings] = useState(false);
  const [spotifyAuthenticated, UpdateSpotifyAuthenticated] = useState(false);
  const [song, UpdateSong] = useState({});
  useEffect(() => {
    fetch("/api/get-room" + "?code=" + props.match.params.roomId)
      .then((response) => {
        if (!response.ok) {
          history.push("/");
        }
        return response.json();
      })
      .then((data) => {
        UpdateGuestCanPause(data.guest_can_pause);
        UpdateVotesToSkip(data.votes_to_skip);
        UpdateIsHost(data.is_host);
        if (data.is_host) {
          authenticateSpotify();
        }
        getCurrentSong();
      });
  }, [showSettings]);
  useEffect(() => {
    const interval = setInterval(getCurrentSong, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  function authenticateSpotify() {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        UpdateSpotifyAuthenticated(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  }
  function getCurrentSong() {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) UpdateSong({});
        else return response.json();
      })
      .then((data) => {
        UpdateSong(data);
      });
  }
  function leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((_response) => {
      history.push("/");
    });
  }
  function handleUpdateButtonPressed() {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: props.match.params.roomId,
      }),
    };
    fetch("/api/update-room", requestOptions).then((response) => {
      response.ok
        ? UpdateSuccessMsg("Room updated!")
        : UpdateErrorMsg("Error updating settings");
    });
  }
  const form1 = "Votes Required To Skip Song";
  const form2 = "Guest Control of Playback State";
  if (showSettings) {
    return (
      <Grid
        container
        spacing={1}
        style={{
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          height: "webkit-fill-available",
        }}
      >
        <Grid item xs={12} align="center">
          <Collapse in={errorMsg != "" || successMsg != ""}>
            {successMsg != "" ? (
              <Alert
                severity="success"
                onClose={() => {
                  UpdateSuccessMsg("");
                }}
              >
                {successMsg}
              </Alert>
            ) : (
              <Alert
                severity="error"
                onClose={() => {
                  UpdateErrorMsg("");
                }}
              >
                {errorMsg}
              </Alert>
            )}
          </Collapse>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            Update Room
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl component="fieldset">
            <FormHelperText style={{ textAlign: "center" }} children={form2} />
            <RadioGroup
              row
              defaultValue="false"
              onChange={(e) => UpdateGuestCanPause(e.target.value)}
            >
              <FormControlLabel
                value="true"
                control={<Radio color="primary" />}
                label="Play/Pause"
                labelPlacement="bottom"
              />
              <FormControlLabel
                value="false"
                control={<Radio color="secondary" />}
                label="No Control"
                labelPlacement="bottom"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
            <TextField
              required={true}
              type="number"
              onChange={(e) => UpdateVotesToSkip(e.target.value)}
              defaultValue={votesToSkip ? votesToSkip : 2}
              inputProps={{
                min: 1,
                style: { textAlign: "center" },
              }}
            />
            <FormHelperText style={{ textAlign: "center" }} children={form1} />
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={() => handleUpdateButtonPressed()}
          >
            Update
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            color="secondary"
            variant="contained"
            onClick={() => UpdateShowSettings(false)}
          >
            Back
          </Button>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid
        container
        spacing={1}
        height="100%"
        alignContent={"center"}
        justifyContent={"center"}
      >
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {props.match.params.roomId}
          </Typography>
        </Grid>

        <MusicPlayer {...song} />

        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="primary"
            disabled={!isHost}
            onClick={() => UpdateShowSettings(true)}
          >
            Settings
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => leaveButtonPressed()}
          >
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default Room;
