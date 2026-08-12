"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Music } from "lucide-react";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

// Fix React 19 Lucide icon type compatibility
const IconMusic = Music as unknown as ComponentType<{ className?: string }>;

interface MusicPlayerProps {
  src?: string;
}

export function MusicPlayer({ src }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Use a ref for the playing state to avoid stale closure in callbacks
  const isPlayingRef = useRef(false);

  // Recreate Audio when src changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      isPlayingRef.current = false;
      setIsPlaying(false);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current && src) {
      audioRef.current = new Audio(src);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      audioRef.current.onerror = (e) => {
        console.error("Audio playback error:", e);
        isPlayingRef.current = false;
        setIsPlaying(false);
      };
    }

    if (!audioRef.current) return;

    if (isPlayingRef.current) {
      audioRef.current.pause();
      isPlayingRef.current = false;
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          isPlayingRef.current = true;
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Failed to play audio:", err);
          isPlayingRef.current = false;
          setIsPlaying(false);
        });
      return; // Don't set isPlaying yet - wait for play() to resolve
    }
  }, [src]);

  return (
    <div className="top-20 right-4 z-40 fixed">
      <button
        onClick={togglePlay}
        className={cn(
          "relative flex justify-center items-center w-10 h-10",
          "rounded-full bg-white/80 backdrop-blur-md shadow-card",
          "hover:bg-white/90 hover:shadow-glass transition-all duration-300",
          "border border-white/20",
        )}
        title={isPlaying ? "Pause music" : "Play music"}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        <IconMusic
          className={cn(
            "w-5 h-5 transition-colors duration-300",
            isPlaying
              ? "text-primary animate-spin-slow"
              : "text-muted-text hover:text-foreground",
          )}
        />
      </button>
    </div>
  );
}
