'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '@/../globals.css';
import Navbar from "@/components/Navbar";


// Outfit type
interface Outfit {
  name: string;
  image: string;
  handle: string;
}

const outfits: Outfit[] = [
  { name: 'Casual Chic', image: 'https://source.unsplash.com/400x600/?casual,style', handle: '@casualguru' },
  { name: 'Formal Elegance', image: 'https://source.unsplash.com/400x600/?formal,wear', handle: '@formalqueen' },
  { name: 'Sporty Look', image: 'https://source.unsplash.com/400x600/?sporty', handle: '@sportypro' },
];

const SWIPE_THRESHOLD = 100;

const LeaderboardCard: React.FC<{ outfit: Outfit; rank: number }> = ({ outfit, rank }) => {
  return (
    <div className="relative bg-white rounded-xl shadow-md p-2 mb-4 w-80 mx-auto">
      {/* Rank Badge */}
      <div
        className={`absolute top-2 left-2 text-white font-bold px-3 py-1 rounded-full ${
          rank === 1 ? 'bg-yellow-400' : 'bg-gray-400'
        }`}
      >
        #{rank}
      </div>

      {/* Outfit Image */}
      <div
        className="h-96 w-full rounded-xl bg-cover bg-center"
        style={{ backgroundImage: `url(${outfit.image})` }}
      ></div>

      {/* User Handle */}
      <p className="text-center font-semibold mt-2">{outfit.handle}</p>
    </div>
  );
};

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Logo */}
      <div className="flex justify-center mt-4">
        <Image src="/ootd.svg" alt="OOTD" width={200} height={100} />
      </div>

      {/* Leaderboard */}
      <div className="mt-4">
        {outfits.map((outfit, index) => (
          <LeaderboardCard key={outfit.name} outfit={outfit} rank={index + 1} />
        ))}
      </div>

      <Navbar />
    </div>
  );
}