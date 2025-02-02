"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import styles from "@/styles/home.module.css";
import Navbar from "@/components/Navbar";

// Outfit type
interface Outfit {
  handle: string;
  image: string;
  points: { [key: string]: [number, number] };
}

// Props for SwipeableCard
interface SwipeableCardProps {
  outfit: Outfit;
  onSwipe: (direction: "left" | "right", outfitName: string) => void;
}

const outfits: Outfit[] = [
  { 
    handle: 'chillguy', 
    image: '/images/image1.jpeg',
    points: { "xyz": [10, 30], "abc": [20, 40] } 
  },
  { 
    handle: 'fancyguy23', 
    image: '/images/image2.jpg',
    points: { "def": [15, 25], "ghi": [35, 45] } 
  },
  { 
    handle: 'lebron', 
    image: '/images/image3.jpg',
    points: { "jkl": [5, 10], "mno": [50, 60] } 
  },
];

const SWIPE_THRESHOLD = 100;

const SwipeableCard: React.FC<SwipeableCardProps> = ({ outfit, onSwipe }) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const startPoint = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    startPoint.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startPoint.current.x;
    const deltaY = e.clientY - startPoint.current.y;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    finishSwipe();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const touch = e.touches[0];
    startPoint.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPoint.current.x;
    const deltaY = touch.clientY - startPoint.current.y;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    finishSwipe();
  };

  const finishSwipe = () => {
    if (position.x > SWIPE_THRESHOLD) {
      setPosition({ x: 500, y: position.y });
      onSwipe("right", outfit.handle);
    } else if (position.x < -SWIPE_THRESHOLD) {
      setPosition({ x: -500, y: position.y });
      onSwipe("left", outfit.handle);
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const rotate = position.x / 20;

  return (
    <div
      className={styles.card}
      ref={cardRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotate}deg)`,
        transition: isDragging ? "none" : "transform 0.3s ease-out",
        backgroundImage: `url(${outfit.image})`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.cardLabel}>
        <h3>{outfit.handle}</h3>
      </div>
    </div>
  );
};

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState<string | null>(null);
  const [flashColor, setFlashColor] = useState<string | null>(null);

  const handleSwipe = (direction: "left" | "right", outfitName: string) => {
    setLastDirection(direction);
    console.log(`Swiped ${direction} on ${outfitName}`);

    if (direction === "left") {
      setFlashColor("red");
    } else if (direction === "right") {
      setFlashColor("green");
    }

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setFlashColor(null)
    }, 300);
  };

  return (
    <div className={`${styles.container} ${flashColor ? styles[flashColor] : ''}`}>
      <div className={styles.logo}>
        <Image src="/ootd.svg" alt="OOTD Logo" width={150} height={80} />
      </div>

      <div className={styles.swipeArrows}>
        <FaArrowLeft className={styles.arrow} />
        <span className={styles.swipeText}>Swipe</span>
        <FaArrowRight className={styles.arrow} />
      </div>

      <div className={styles.cardContainer}>
        {outfits.slice(currentIndex).map((outfit) => (
          <SwipeableCard
            key={outfit.handle}
            outfit={outfit}
            onSwipe={handleSwipe}
          />
        ))}
      </div>

      {lastDirection && (
        <h2 className={styles.direction}>You swiped {lastDirection}</h2>
      )}

      <Navbar />
    </div>
  );
}