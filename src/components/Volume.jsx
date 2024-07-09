import axios from "axios";
import React from "react";
import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";

export default function Volume() {
  const [{ token }] = useStateProvider();

  const setVolume = async (e) => {
    try {
      await axios.put(
        "https://api.spotify.com/v1/me/player/volume",
        {},
        {
          params: {
            volume_percent: parseInt(e.target.value),
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
    } catch (error) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      console.error('Error config:', error.config);
    }
  };

  return (
    <Container>
      <input type="range" onChange={(e) => setVolume(e)} min={0} max={100} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  align-content: center;
  input {
    width: 15rem;
    border-radius: 2rem;
    height: 0.5rem;
  }
`;
