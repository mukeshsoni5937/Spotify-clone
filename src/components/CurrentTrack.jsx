import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";

export default function CurrentTrack() {
  const [{ token, currentPlaying }, dispatch] = useStateProvider();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCurrentTrack = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/player/currently-playing",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        if (response.data && response.data.item) {
          const currentPlaying = {
            id: response.data.item.id,
            name: response.data.item.name,
            artists: response.data.item.artists.map((artist) => artist.name),
            image: response.data.item.album.images[2].url,
          };
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying });
        } else {
          dispatch({ type: reducerCases.SET_PLAYING, currentPlaying: null });
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    getCurrentTrack();
  }, [token, dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading current track. Please try again later.</p>;

  return (
    <Container>
      {currentPlaying ? (
        <div className="track">
          <div className="track__image">
            <img src={currentPlaying.image} alt={currentPlaying.name} />
          </div>
          <div className="track__info">
            <h4 className="track__info__track__name">{currentPlaying.name}</h4>
            <h6 className="track__info__track__artists">
              {currentPlaying.artists.join(", ")}
            </h6>
          </div>
        </div>
      ) : (
        <p>No track currently playing.</p>
      )}
    </Container>
  );
}

const Container = styled.div`
  .track {
    display: flex;
    align-items: center;
    gap: 1rem;
    &__image {
      img {
        width: 50px;
        height: 50px;
        border-radius: 4px;
      }
    }
    &__info {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      &__track__name {
        color: white;
        margin: 0;
      }
      &__track__artists {
        color: #b3b3b3;
        margin: 0;
      }
    }
  }
  p {
    color: #b3b3b3;
  }
`;
