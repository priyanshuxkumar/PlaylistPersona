import axios from "axios";
import { NextResponse } from "next/server";
import qs from "qs";


let tokenCache:any = null;
let tokenExpiry:any = null;

async function getAccessToken() {
  const currentTime = new Date().getTime();

  // Check if cached token is valid
  if (tokenCache && tokenExpiry > currentTime) {
    return tokenCache;
  };

  const data = qs.stringify({
    grant_type: "client_credentials",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      data,
      config
    );
    
    const accessToken = response.data.access_token;
    const expiresIn = response.data.expires_in * 1000; // Convert to milliseconds

    tokenCache = accessToken;
    tokenExpiry = Date.now() + expiresIn;

    return accessToken;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch Spotify token" },
      { status: 500 }
    );
  }
}

async function getPlaylistDetails(token: string, playlistLink: string) {
  const playlistIdMatch = playlistLink.match(/playlist\/([^?]+)/);
  if (!playlistIdMatch) {
    throw new Error("Invalid playlist URL");
  }

  const playlistId = playlistIdMatch[1];

  const ENDPOINT = `https://api.spotify.com/v1/playlists/${playlistId}`;
  try {
    const response = await axios.get(ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch playlist details");
  }
}

async function getTrackFeatures(trackIds: any, token: string) {
  const url = `https://api.spotify.com/v1/audio-features?ids=${trackIds.join(
    ","
  )}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.audio_features;
  } catch (error) {
    throw new Error("Failed to fetch track features");
  }
}

function analyzeMood(trackFeatures: any) {
  const moodProfile = {
    danceability: 0,
    energy: 0,
    valence: 0,
  };

  trackFeatures.forEach((feature: any) => {
    moodProfile.danceability += feature.danceability;
    moodProfile.energy += feature.energy;
    moodProfile.valence += feature.valence;
  });

  const numTracks = trackFeatures.length;
  moodProfile.danceability /= numTracks;
  moodProfile.energy /= numTracks;
  moodProfile.valence /= numTracks;

  return moodProfile;
}



export { getAccessToken, getPlaylistDetails, getTrackFeatures, analyzeMood };
