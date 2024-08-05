"use client";

import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import Loading from "./component/Loader";
import Image from "next/image";
import xlogo from "../../public/x-logo.png";
import Card from "./component/Card";
import ErrorAlert from "./component/ErrorAlert";
import { CircleX } from 'lucide-react';
import Blocked from "./component/Blocked";
import MusicCard from "./component/MusicCard";
import { it } from "node:test";

export default function Home() {
  // Regex for validating Spotify playlist URL
  const spotifyPlaylistUrlRegex = /^https:\/\/open\.spotify\.com\/playlist\/[a-zA-Z0-9]{22}/;

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [playlistLink, setPlaylistLink] = useState<string>("");

  //Error Handling
  const [error, setError] = useState<string>("");

  //Rate Limit
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);

  const [moodProfile, setMoodProfile] = useState<string>("");

  const [isPlaylistUrlInValid , setIsPlaylistUrlInValid] = useState<boolean>(false);

  //Suggestions Songs
  const [suggestedSongs , setSuggestedSongs] = useState([]);

  //Disappear error and Rate Limited UI
  useEffect(() => {
    let errorTimeout: NodeJS.Timeout;
    let rateLimitTimeout: NodeJS.Timeout;

    if (error) {
      errorTimeout = setTimeout(() => {
        setError('');
      }, 4000);
    }

    if (isRateLimited) {
      rateLimitTimeout = setTimeout(() => {
        setIsRateLimited(false);
      }, 10000);
    }

    return () => {
      if (errorTimeout) clearTimeout(errorTimeout);
      if (rateLimitTimeout) clearTimeout(rateLimitTimeout);
    };
  }, [error, isRateLimited]);

  //Api call 
  const getResult = async () => {
    setIsFetching(true);
    const playlistLinkJson = JSON.stringify(playlistLink);
    try {
      const response = await axios.post("/api/analyze", playlistLinkJson);
      if (response.status == 200) {
        setMoodProfile(response.data.data);
        setSuggestedSongs(response.data.data.suggestions)
        setPlaylistLink('');
      }
      if(response.status == 429){
        setIsRateLimited(true);
        setError("Too many requests. Please wait and try again later.");
      }
      setIsFetching(false);
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        setIsRateLimited(true);
        setError("Too many requests. Please wait and try again later.");
      }else{
        setError(error.response.data.error);
      }
    } finally {
      setIsFetching(false);
    }
  };

  //Input On change
  const inputOnChange = (e:  React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPlaylistLink(value);

    // Checking if Playlist Link is Valid
    if (value && !spotifyPlaylistUrlRegex.test(value)) {
      setIsPlaylistUrlInValid(true);
    }else{
      setIsPlaylistUrlInValid(false);
    }
  };
  return (
    <main className="bg-white h-screen max-h-screen flex flex-col justify-between items-center">
      <div className="pt-4">
        <h5 className="text-3xl text-black font-semibold text-center">Playlist Persona</h5>
      </div>

      <div className="w-11/12 lg:w-1/3">

      <div className="border h-10 text-black border-black/50 rounded-md flex items-center">
        <input
          onChange={inputOnChange}
          className="flex h-10 w-full rounded-md text-black bg-transparent px-3 py-2 text-sm placeholder:text-black/60 focus:outline-none  disabled:cursor-not-allowed disabled:opacity-50"
          type="text"
          value={playlistLink}
          placeholder="Drop spotify playlist link"
        ></input>

        {isPlaylistUrlInValid && <span className="px-1"><CircleX strokeWidth={1.5} color="red"/></span>}

        <button
          type="button"
          onClick={() => navigator.clipboard.readText().then(text => setPlaylistLink(text))}
          className="h-10 px-2 rounded-md text-sm text-black">
          Paste
        </button>
        </div>


        <button
          onClick={getResult}
          type="button"
          disabled={!playlistLink || isFetching || isPlaylistUrlInValid}
          className="w-full h-10 mt-2 rounded-md border border-black/50 bg-slate-50 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          {isFetching ? (
            <div className="flex justify-center gap-2">
              <Loading size={20} width={2} /> Analyzing your playlist...
            </div>
          ) : (
            "Show Me!"
          )}
        </button>

        {moodProfile && (
          <div className="w-full my-4">
            <Card data={moodProfile} />
          </div>
        )}

        {/* Songs Suggestions card  */}
        {suggestedSongs &&
        <div className="flex gap-2 mt-2">
          {suggestedSongs.map((item , index)=> <MusicCard key={index} title={item}/>)}
        </div>
        }
      </div>

      <div className="pb-3 flex items-center gap-2">
        <h5 className="text-sm text-center text-slate-800">
          Made by <span className="font-semibold">Priyanshu Kumar</span>
        </h5>{" "}
        <div>
          <a href="https://x.com/priyanshzzz" target="_blank" >
            {" "}
            <Image
              className="w-3 h-3"
              src={xlogo}
              alt="X-LOGO"
              width={100}
              height={100}
            />
          </a>
        </div>
      </div>

      {error && (
        <div className="absolute bottom-5  lg:bottom-6 lg:right-5">
          <ErrorAlert error={error} />
        </div>
      )}

      {
        isRateLimited && 
        <div className="w-screen h-screen pt-10 backdrop-blur-md absolute top-0 left-0 ">
          <Blocked/>
        </div>
      }
    </main>
  );
}
