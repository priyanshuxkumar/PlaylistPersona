import axios from "axios";
import { NextResponse } from "next/server";
import qs from "qs";

export async function GET() {
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
    return NextResponse.json(response.data.access_token);
  } catch (error) {
    console.log("error occured", error);
    return NextResponse.json({ error: 'Failed to fetch Spotify token' }, { status: 500 });
  }
}
