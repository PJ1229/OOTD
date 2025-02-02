"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import "@/../globals.css";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";

// Outfit type
interface Outfit {
  name: string;
  image: string;
  handle: string;
}

const outfits: Outfit[] = [
  {
    name: "Casual Chic",
    image: "https://source.unsplash.com/400x600/?casual,style",
    handle: "@casualguru",
  },
  {
    name: "Formal Elegance",
    image: "https://source.unsplash.com/400x600/?formal,wear",
    handle: "@formalqueen",
  },
  {
    name: "Sporty Look",
    image: "https://source.unsplash.com/400x600/?sporty",
    handle: "@sportypro",
  },
];

const SWIPE_THRESHOLD = 100;

const LeaderboardCard: React.FC<{ outfit: Outfit; rank: number }> = ({
  outfit,
  rank,
}) => {
  return (
    <div className="relative bg-white rounded-xl shadow-md p-2 mb-4 w-80 mx-auto">
      {/* Rank Badge */}
      <div
        className={`absolute top-2 left-2 text-white font-bold px-3 py-1 rounded-full ${
          rank === 1 ? "bg-yellow-400" : "bg-gray-400"
        }`}
      >
        #{rank}
      </div>

      {/* Outfit Image */}
      <div
        className="h-96 w-full rounded-xl bg-cover bg-center"
        style={{ backgroundImage: `url(${outfit.image})` }}
      ></div>
    </div>
  );
};

export default function Leaderboard() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("posts_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setPosts((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setPosts((prev) =>
              prev.map((post) =>
                post.id === payload.new.id ? payload.new : post
              )
            );
          } else if (payload.eventType === "DELETE") {
            setPosts((prev) =>
              prev.filter((post) => post.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .then(({ data }) => ({
          data: data
            ?.sort((a, b) => b.likes - b.dislikes - (a.likes - a.dislikes))
            .slice(0, 3),
        }));
      if (data) {
        setPosts(data);
      }
      if (error) console.error("Error fetching posts:", error);
    };
    fetchPosts();

    return () => {
      supabase.removeChannel(channel);
    };
  });

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="flex justify-center mt-4">
        <Image src="/ootd.png" alt="OOTD" width={200} height={100} />
      </div>

      <div className="mt-4">
        {posts.map((post, index) => (
          <LeaderboardCard
            key={index}
            outfit={{
              image: post.image,
            }}
            rank={index + 1}
          />
        ))}
      </div>

      <Navbar />
    </div>
  );
}
