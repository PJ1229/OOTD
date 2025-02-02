// app/upload/page.tsx
'use client';
import 'dotenv/config';

import React, { useState, useRef, useEffect } from 'react';
import styles from '../../styles/home.module.css';
import Navbar from "@/components/Navbar";

export default function UploadPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string | null>(null); // For garment upload
  const [updatedImage, setUpdatedImage] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(true); // Control visibility of the video feed
  const [showUploadGarment, setShowUploadGarment] = useState(false); // Control visibility of the garment upload button
  const [taskId, setTaskId] = useState<string | null>(null); // Store the task_id from the API
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // TODO: MAKE SECRET AND REPLACE WITH API KEY
  const APIKEY = "fa-D6ATurJQTwXP-xeUn6ecPlbDmmgRDS9ILpnmq"
  // Access the camera and start the video stream 
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing the camera:', error);
    }
  };

  // Capture a picture from the video stream
  const capturePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions to match the video feed
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current frame from the video onto the canvas
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas image to a data URL and set it as the captured image
      const imageDataUrl = canvas.toDataURL('image/png');
      setCapturedImage(imageDataUrl);
      setShowVideo(false); // Hide the video feed after capturing
      setShowUploadGarment(true); // Show the garment upload button
    }
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
        setShowVideo(false); // Hide the video feed if it's visible
        setShowUploadGarment(true); // Show the garment upload button
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle garment upload
  const handleGarmentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setGarmentImage(e.target?.result as string);
        sendImagesToApi(capturedImage, e.target?.result as string); // Send both images to the API
      };
      reader.readAsDataURL(file);
    }
  };

  // Send images to the API
  const sendImagesToApi = async (modelImage: string | null, garmentImage: string | null) => {
    if (!modelImage || !garmentImage) return;

    setIsLoading(true);

    try {
      // Step 1: Upload images to the API
      const response = await fetch('https://api.fashn.ai/v1/run', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${APIKEY}`, // Replace with your actual API key
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model_image: modelImage, // Captured/uploaded image
          garment_image: garmentImage, // Garment image
          category: 'tops', // Replace with the appropriate category
          restore_background: true, 
          restore_clothes: true, 
        }),
      });

      if (response.ok) {
        const { id } = await response.json();
        setTaskId(id); // Save the task_id
        pollForResult(id); // Start polling for the result
      } else {
        console.error('Failed to upload images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  // Poll the API for the result
  const pollForResult = async (taskId: string) => {
    try {
      let result = null;
      while (!result) {
        const response = await fetch(`https://api.fashn.ai/v1/status/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${APIKEY}`, // Replace with your actual API key
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'completed') {
            result = data.output[0]; // Assuming the API returns the processed image URL
            setUpdatedImage(result);
            setIsLoading(false);
            setShowUploadGarment(false); // Hide the garment upload button
            break;
          } else if (data.status === 'failed') {
            console.error('Image processing failed');
            break;
          }
        } else {
          console.error('Failed to fetch result');
          break;
        }

        // Wait for 2 seconds before polling again
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error('Error polling for result:', error);
    }
  };

  // Reset the page to its original state
  const resetPage = () => {
    setCapturedImage(null);
    setGarmentImage(null);
    setUpdatedImage(null);
    setShowVideo(true);
    setShowUploadGarment(false);
    setTaskId(null);
    startCamera(); // Restart the camera
  };

  // Start the camera when the component mounts
  useEffect(() => {
    startCamera();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Capture or Upload Picture</h1>

      {/* Video Feed */}
      {showVideo && (
        <div className={styles.videoContainer}>
          <video ref={videoRef} autoPlay playsInline className={styles.video}></video>
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

          {/* Buttons inside the camera feed */}
          <div className={styles.buttonContainer}>
            <button onClick={capturePicture} className={styles.captureButton}>
              Capture
            </button>
            <label htmlFor="uploadInput" className={styles.uploadLabel}>
              Upload Image
            </label>
            <input
              id="uploadInput"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.uploadInput}
            />
          </div>
        </div>
      )}

      {/* Display Captured/Uploaded Image and Garment Image */}
      {(capturedImage || garmentImage) && !updatedImage && (
        <div className={styles.imageRow}>
          {capturedImage && (
            <div className={styles.imageContainer}>
              <h2>{showVideo ? 'Captured Image' : 'Uploaded Image'}</h2>
              <img src={capturedImage} alt="Captured/Uploaded" className={styles.originalImage} />
            </div>
          )}
          {garmentImage && (
            <div className={styles.imageContainer}>
              <h2>Garment Image</h2>
              <img src={garmentImage} alt="Garment" className={styles.originalImage} />
            </div>
          )}
        </div>
      )}

      {/* Upload Garment Button */}
      {showUploadGarment && (
        <div className={styles.uploadSection}>
          <label htmlFor="garmentInput" className={styles.uploadLabel}>
            Upload Garment
          </label>
          <input
            id="garmentInput"
            type="file"
            accept="image/*"
            onChange={handleGarmentUpload}
            className={styles.uploadInput}
          />
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Processing your image...</p>
        </div>
      )}

      {/* Display Updated Image */}
      {updatedImage && !isLoading && (
        <div className={styles.imageContainer}>
          <h2>Updated Image</h2>
          <img src={updatedImage} alt="Updated" className={styles.updatedImage} />
        </div>
      )}

      {/* Try Another Fit Button */}
      {updatedImage && !isLoading && (
        <button onClick={resetPage} className={styles.tryAnotherButton}>
          Try Another Fit
        </button>
      )}
      <Navbar />
    </div>
  );
}