"use client";

import axios, { AxiosError } from "axios";
import { useState } from "react";
import Loading from "./component/Loader";
import Image from "next/image";
import xlogo from "../../public/x-logo.png";
import Card from "./component/Card";
import ErrorAlert from "./component/ErrorAlert";

export default function Home() {
  const [isFetching, setIsFetching] = useState(false);
  const [playlistLink, setPlaylistLink] = useState("");

  //Error Handling
  const [error, setError] = useState("");

  const [moodProfile, setMoodProfile] = useState("");

  const getResult = async () => {
    setIsFetching(true);
    const playlistLinkJson = JSON.stringify(playlistLink);
    try {
      const response = await axios.post("/api/analyze", playlistLinkJson);
      if (response.status == 200) {
        setMoodProfile(response.data);
        setPlaylistLink('');
      }
      setIsFetching(false);
    } catch (error: any) {
      console.log(error);
      setError(error.response.data.error);
    } finally {
      setIsFetching(false);
    }
  };

  //Disappear error
  if (error != "") {
    setTimeout(() => {
      setError("");
    }, 4000);
  }
  return (
    <main className="bg-[#151515] h-screen flex flex-col justify-between items-center">
      <div className="pt-4">
        <h5 className="text-3xl font-semibold text-center">Playlist Persona</h5>
      </div>

      <div className="w-11/12 lg:w-1/3">
        <input
          onChange={(e) => setPlaylistLink(e.target.value)}
          className="flex h-10 w-full rounded-md border border-white bg-transparent px-3 py-2 text-sm placeholder:text-white/60 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
          type="text"
          value={playlistLink}
          placeholder="Drop spotify playlist link"
        ></input>
        <button
          onClick={getResult}
          type="button"
          disabled={!playlistLink}
          className="w-full mt-2 rounded-md border bg-[#373A40] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#2f333b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          {isFetching ? (
            <div className="flex justify-center gap-2">
              <Loading size={20} width={2} /> Please wait
            </div>
          ) : (
            "Get result!"
          )}
        </button>

        {moodProfile && (
          <div className="w-full my-4">
            <Card data={moodProfile} />
          </div>
        )}
      </div>

      <div className="pb-3 flex items-center gap-2">
        <h5 className="text-sm text-center">
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
    </main>
  );
}
