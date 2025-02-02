"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/home.module.css";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";

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
      const { data, error } = await supabase.from("posts").select("*");
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

  const handleSwipe = async (
    direction: "left" | "right",
    outfitName: string
  ) => {
    const supabase = createClient();

    setLastDirection(direction);
    console.log(`Swiped ${direction} on ${outfitName}`);
    const currentPost = posts[currentIndex];

    if (direction === "left") {
      console.log(currentPost);
      const { data, error } = await supabase
        .from("posts")
        .update({ dislikes: (currentPost.dislikes || 0) + 1 })
        .eq("id", currentPost.id);

      if (error) console.error("Error updating dislikes:", error);
      setFlashColor("red");
    } else if (direction === "right") {
      console.log(currentPost);
      const { data, error } = await supabase
        .from("posts")
        .update({ likes: (currentPost.likes || 0) + 1 })
        .eq("id", currentPost.id);
      setFlashColor("green");
    }

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setFlashColor(null);
    }, 300);
  };

  return (
    <div
      className={`${styles.container} ${flashColor ? styles[flashColor] : ""}`}
    >
      <Image src="/ootd.svg" alt="OOTD Logo" width={150} height={80} />
      <div className={styles.cardContainer}>
        {posts.map((post, index) => (
          <SwipeableCard
            key={index}
            outfit={{
              image: post.image,
            }}
            onSwipe={handleSwipe}
          />
        ))}
      </div>

      <Navbar />
    </div>
  );
}
