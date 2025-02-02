// app/library/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import styles from "@/styles/library.module.css";

import Navbar from "@/components/Navbar";
// Import the JSON file (replace with your actual path)
import garments from "@/data/favorites.json";

export default function LibraryPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Garment Library</h1>
      <div className={styles.grid}>
        {garments.map((garment) => (
          <Link
            key={garment.id}
            href={`/protected/tryon?garment=${garment.image}`}
            className={styles.card}
          >
            <img
              src={garment.image}
              className={styles.image}
            />
          </Link>
        ))}
      </div>
      <Navbar />
    </div>
  );
}
