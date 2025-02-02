// app/upload/page.tsx
"use client";
import "dotenv/config";

import React, { useState, useRef, useEffect } from "react";
import styles from "@/styles/home.module.css";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

export default function UploadPage() {
  const [showVideo, setShowVideo] = useState(true); // Control visibility of the video feed
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const supabase = createClient();

  // Access the camera and start the video stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: 'environment' } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing the camera:', error);
    }
  };


  // Capture a picture from the video stream
  const capturePicture = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set canvas dimensions to match the video feed
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current frame from the video onto the canvas
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas image to a data URL and set it as the captured image
      const imageDataUrl = canvas.toDataURL("image/png");
      // Upload the captured image to the 'posts' bucket in Supabase
      const blob = await (await fetch(imageDataUrl)).blob();
      const file = new File([blob], "captured-image.png", {
        type: "image/png",
      });

      // Modified path to include 'private' folder as required by the bucket policy
      const fileName = `private/images/${Date.now()}_captured-image.png`;
      const { data, error } = await supabase.storage
        .from("posts")
        .upload(fileName, file);

      if (error) {
        console.error("Failed to upload image:", error.message);
        return;
      }

      // Get the public URL of the uploaded image
      const { data: publicUrl } = supabase.storage
        .from("posts")
        .getPublicUrl(fileName);

      const user = await supabase.auth.getUser();

      console.log(user.data.user?.id);

      // Insert the image URL into the posts table
      const { data: insertData, error: insertError } = await supabase
        .from("posts")
        .insert({
          created_by: user.data.user?.id,
          image: publicUrl.publicUrl,
        });

      if (insertError) {
        console.error(
          "Failed to insert into posts table:",
          insertError.message
        );
      } else {
        console.log("Image uploaded and record created successfully");
      }

      setShowVideo(false); // Hide the video feed after capturing
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}> Image Successfully Captured! </h1>

      {/* Video Feed */}
      {showVideo && (
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={styles.video}
          ></video>
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

          {/* Buttons inside the camera feed */}
          <div className={styles.buttonContainer}>
            <button onClick={capturePicture} className={styles.captureButton}>
              <Image
                src="/circle.svg"
                alt="Capture"
                width={1000}
                height={1000}
              />
            </button>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
}
