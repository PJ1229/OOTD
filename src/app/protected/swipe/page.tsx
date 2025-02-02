"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/home.module.css";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";

// Define the Outfit type
interface Outfit {
  handle: string;
  image: string;
  points?: { [key: string]: [number, number] };
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
  const startPoint = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Mouse event handlers
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

  // Touch event handlers
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

  // Decide what to do when the drag ends
  const finishSwipe = () => {
    if (position.x > SWIPE_THRESHOLD) {
      // If swiped right, animate completely off-screen to the right.
      setPosition({ x: window.innerWidth, y: position.y });
      onSwipe("right", outfit.handle);
    } else if (position.x < -SWIPE_THRESHOLD) {
      // If swiped left, animate off-screen to the left.
      setPosition({ x: -window.innerWidth, y: position.y });
      onSwipe("left", outfit.handle);
    } else {
      // Otherwise, reset the card back to center.
      setPosition({ x: 0, y: 0 });
    }
  };

  // Rotate the card a little based on how far it's dragged
  const rotate = position.x / 20;

  return (
    <div
      className={styles.card}
      style={{
        // Combine the centering with dynamic dragging and rotation.
        transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) rotate(${rotate}deg)`,
        transition: isDragging ? "none" : "transform 0.3s ease-out",
        backgroundImage: `url(${outfit.image})`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // in case the mouse leaves mid-drag
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
  const [flashColor, setFlashColor] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to real-time changes
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

    // Fetch the initial posts
    const fetchPosts = async () => {
      const { data, error } = await supabase.from("posts").select("*");
      if (data) {
        setPosts(data);
      }
      if (error) console.error("Error fetching posts:", error);
    };

    fetchPosts();

    // Clean up the subscription on unmount.
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSwipe = async (
    direction: "left" | "right",
    outfitName: string
  ) => {
    const supabase = createClient();

    console.log(`Swiped ${direction} on ${outfitName}`);
    const currentPost = posts[currentIndex];
    if (!currentPost) return;

    // Update the like/dislike count in Supabase
    if (direction === "left") {
      const { error } = await supabase
        .from("posts")
        .update({ dislikes: (currentPost.dislikes || 0) + 1 })
        .eq("id", currentPost.id);
      if (error) console.error("Error updating dislikes:", error);
      setFlashColor("red");
    } else if (direction === "right") {
      const { error } = await supabase
        .from("posts")
        .update({ likes: (currentPost.likes || 0) + 1 })
        .eq("id", currentPost.id);
      if (error) console.error("Error updating likes:", error);
      setFlashColor("green");
    }

    // Wait for the swipe animation to complete before showing the next card.
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setFlashColor(null);
    }, 300);
  };

  return (
    <div
      className={`${styles.container} ${flashColor ? styles[flashColor] : ""}`}
    >
      <Image src="/ootd.png" alt="OOTD Logo" width={150} height={80} />
      <div className={styles.cardContainer}>
        {posts[currentIndex] ? (
          <SwipeableCard
            key={posts[currentIndex].id} // Ensure a fresh mount for each card.
            outfit={{
              handle: posts[currentIndex].handle,
              image: posts[currentIndex].image,
            }}
            onSwipe={handleSwipe}
          />
        ) : (
          <p>No more posts!</p>
        )}
      </div>
      <Navbar />
    </div>
  );
}
