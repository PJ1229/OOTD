'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import styles from '../../styles/home.module.css';
import { FaTrophy, FaHome, FaPlusSquare, FaStore, FaCamera } from 'react-icons/fa'; // Importing icons
import '../../../globals.css';

// Outfit type
interface Outfit {
  name: string;
  image: string;
}

// Props for SwipeableCard
interface SwipeableCardProps {
  outfit: Outfit;
  onSwipe: (direction: 'left' | 'right', outfitName: string) => void;
}

const outfits: Outfit[] = [
  { name: 'Casual Chic', image: 'https://source.unsplash.com/400x600/?casual,style' },
  { name: 'Formal Elegance', image: 'https://source.unsplash.com/400x600/?formal,wear' },
  { name: 'Sporty Look', image: 'https://source.unsplash.com/400x600/?sporty' },
];

const SWIPE_THRESHOLD = 100;

const SwipeableCard: React.FC<SwipeableCardProps> = ({ outfit, onSwipe }) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
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
      onSwipe('right', outfit.name);
    } else if (position.x < -SWIPE_THRESHOLD) {
      setPosition({ x: -500, y: position.y });
      onSwipe('left', outfit.name);
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
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
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
        <h3>{outfit.name}</h3>
      </div>
    </div>
  );
};

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState<string | null>(null);

  const handleSwipe = (direction: 'left' | 'right', outfitName: string) => {
    setLastDirection(direction);
    console.log(`Swiped ${direction} on ${outfitName}`);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 300);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Rate Outfits</h1>
      <div className={styles.cardContainer}>
        {outfits.slice(currentIndex).map((outfit) => (
          <SwipeableCard key={outfit.name} outfit={outfit} onSwipe={handleSwipe} />
        ))}
      </div>
      {lastDirection && <h2 className={styles.direction}>You swiped {lastDirection}</h2>}

      {/* Bottom Navigation Bar */}
      <nav className={styles.bottomNav}>
        <Link href="/profile" className={styles.iconLink}>
          <FaTrophy className={styles.icon} />
        </Link>
        <Link href="/" className={styles.iconLink}>
          <FaHome className={styles.icon} />
        </Link>
        <Link href="/add" className={styles.iconLink}>
          <FaPlusSquare className={styles.icon} />
        </Link>
        <Link href="/market" className={styles.iconLink}>
          <FaStore className={styles.icon} />
        </Link>
        <Link href="/camera" className={styles.iconLink}>
          <FaCamera className={styles.icon} />
        </Link>
      </nav>
    </div>
  );
}
