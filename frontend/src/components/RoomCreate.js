import React, { Component, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControl,
  FormHelperText,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { Link, useHistory } from "react-router-dom";
function RoomCreate(props) {
  const history = useHistory();
  const [guestCanPause, UpdateGuestCanPause] = useState(false);
  const [votesToSkip, UpdateVotesToSkip] = useState(2);
  const handleVotesChange = (e) => {
    UpdateVotesToSkip(e.target.value);
  };
  const handleGuestCanPauseChange = (e) => {
    UpdateGuestCanPause(e.target.value);
  };
  function handleRoomButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => history.push("/room/" + data.code));
  }
  const form1 = "Votes Required To Skip Song";
  const form2 = "Guest Control of Playback State";
  return (
    <Grid container spacing={1} height="100%" alignContent={"center"}>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          Create A Room
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText style={{ textAlign: "center" }} children={form2} />
          <RadioGroup
            row
            defaultValue="true"
            onChange={handleGuestCanPauseChange}
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
            onChange={handleVotesChange}
            defaultValue={votesToSkip}
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
          onClick={handleRoomButtonPressed}
        >
          Create A Room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}

export default RoomCreate;
