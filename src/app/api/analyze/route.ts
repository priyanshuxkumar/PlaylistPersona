import { safetySettings } from "@/app/utils/gemini-safety-setting";
import {
  analyzeMood,
  getAccessToken,
  getPlaylistDetails,
  getTrackFeatures,
} from "@/app/utils/helper";

import { NextResponse } from "next/server";
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL,
  safetySettings,
});

export async function POST(req: Request) {
  if (req.method === "POST") {
    try {
      const playlistLink = await req.json();

      if (!playlistLink) {
        throw new Error("Please enter a valid Link");
      }

      //Get Token
      const token = await getAccessToken();

      //Get Playlist Details
      const playlistDetail = await getPlaylistDetails(token, playlistLink);

      if (!playlistDetail) {
        throw new Error("Failed to fetch playlist");
      }

      //Fetch Track Id's
      const trackIds = playlistDetail && playlistDetail?.tracks?.items.map(
          (item: { track: { id: string } }) => item.track.id
        );

      //Get Track Feature
      const trackFeatures = await getTrackFeatures(trackIds, token);

      //Anaylyze Mood
      const moodProfile = analyzeMood(trackFeatures);

      //Find Mood Result
      const responseData = await getMoodResponse(moodProfile);

      // Extract JSON string from response text
      const jsonString = responseData.match(/```json\n([\s\S]*?)\n```/)[1];
      const parsedData = JSON.parse(jsonString);

      return NextResponse.json(parsedData);
    } catch (error:any) {
      return NextResponse.json({ error: error.message },{ status: 500 });
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
}

async function getMoodResponse(moodProfile: any) {
  const structuredMoodProfile = JSON.stringify(moodProfile, null, 2);

  const prompt = `Imagine you are a skilled music psychologist. Analyze the following playlist: 
  ${structuredMoodProfile}

  Based on the music selection, craft a detailed personality profile of the playlist owner. Describe their potential personality traits, interests, and lifestyle in a concise and engaging manner. 

  Format your response as a JSON object with two keys:
  * **mood**: A title about person personality. (add emoji according to playlist emotion)
  * **description**: A detailed personality profile of the playlist owner.(Start like this : "You are a... Include a touch of naughtiness if the playlist features old sad songs, suggesting they might be in love or heartbreak or nostalgic.") 
 
  Keep the personality description under 30 words. `;

  const result = await model.generateContent(prompt);
  const response = await result.response.text();

  return response;
}