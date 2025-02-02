'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../../styles/home.module.css'; 
import { FaTrophy } from 'react-icons/fa';
import '../../../globals.css';
import Navbar from "@/components/Navbar";

// Dummy leaderboard data
const leaderboardData = [
  { rank: 1, name: "Alice", score: 1500 },
  { rank: 2, name: "Bob", score: 1300 },
  { rank: 3, name: "Charlie", score: 1200 },
  { rank: 4, name: "David", score: 1100 },
  { rank: 5, name: "Eve", score: 1000 },
];

export default function Leaderboard() {
  return (
    <div className={styles.leaderboardContainer}>
      <Navbar />
      <div className={styles.content}>
        <h1 className={styles.title}>Leaderboard</h1>
        <div className={styles.leaderboardList}>
          {leaderboardData.map((entry) => (
            <div key={entry.rank} className={styles.leaderboardItem}>
              <div className={styles.rank}>
                {entry.rank === 1 && <FaTrophy className={styles.trophyIcon} />}
                {entry.rank}
              </div>
              <div className={styles.name}>{entry.name}</div>
              <div className={styles.score}>{entry.score}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
