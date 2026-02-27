"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"
import type Player from "@vimeo/player"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

const VIMEO_VIDEO_ID = "1168986086"
const IFRAME_SRC = `https://player.vimeo.com/video/${VIMEO_VIDEO_ID}?background=1&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0`

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function HeroVideo() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerRef = useRef<Player | null>(null)
  const isDraggingTimelineRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const initPlayer = useCallback(async () => {
    if (!iframeRef.current) return
    try {
      const { default: VimeoPlayer } = await import("@vimeo/player")
      const player = new VimeoPlayer(iframeRef.current) as Player
      playerRef.current = player

      player.on("timeupdate", (data: { seconds: number }) => {
        if (!isDraggingTimelineRef.current) setCurrentTime(data.seconds)
      })
      player.on("durationchange", (data: { duration: number }) => setDuration(data.duration))
      player.on("play", () => setIsPlaying(true))
      player.on("pause", () => setIsPlaying(false))

      const d = await player.getDuration()
      const t = await player.getCurrentTime()
      setDuration(d)
      setCurrentTime(t)
    } catch (e) {
      console.error("Vimeo player init error", e)
    }
  }, [])

  useEffect(() => {
    initPlayer()
    return () => {
      playerRef.current = null
    }
  }, [initPlayer])

  const togglePlay = useCallback(async () => {
    const p = playerRef.current
    if (!p) return
    try {
      if (isPlaying) await p.pause()
      else await p.play()
    } catch (e) {
      console.error("Play/pause error", e)
    }
  }, [isPlaying])

  const toggleMute = useCallback(async () => {
    const p = playerRef.current
    if (!p) return
    try {
      if (isMuted) {
        await p.setVolume(volume)
        setIsMuted(false)
      } else {
        await p.setVolume(0)
        setIsMuted(true)
      }
    } catch (e) {
      console.error("Mute error", e)
    }
  }, [isMuted, volume])

  const onVolumeChange = useCallback(
    async (value: number[]) => {
      const v = value[0] ?? 0
      const vol = v / 100
      setVolume(vol)
      const p = playerRef.current
      if (!p) return
      try {
        await p.setVolume(vol)
        setIsMuted(vol === 0)
      } catch (e) {
        console.error("Volume error", e)
      }
    },
    []
  )

  const onTimelineChange = useCallback(async (value: number[]) => {
    const t = value[0] ?? 0
    setCurrentTime(t)
    const p = playerRef.current
    if (!p) return
    try {
      await p.setCurrentTime(t)
    } catch (e) {
      console.error("Seek error", e)
    }
  }, [])

  return (
    <div className="relative w-full overflow-hidden rounded-[2.5rem] shadow-2xl aspect-video bg-black/20 group">
      <iframe
        ref={iframeRef}
        src={IFRAME_SRC}
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        aria-hidden
        tabIndex={-1}
      />
      {/* Overlay de controles */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 p-3",
          "bg-gradient-to-t from-black/80 to-transparent",
          "opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        )}
      >
        {/* Timeline */}
        <div className="flex items-center gap-2 w-full">
          <Slider
            className="flex-1"
            value={[duration > 0 ? currentTime : 0]}
            max={duration > 0 ? duration : 100}
            step={0.1}
            onValueChange={(value) => {
              isDraggingTimelineRef.current = true
              setCurrentTime(value[0] ?? 0)
            }}
            onValueCommit={(value) => {
              isDraggingTimelineRef.current = false
              onTimelineChange(value)
            }}
          />
          <span className="text-xs text-white/90 tabular-nums shrink-0 w-16 text-right">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-white hover:bg-white/20 hover:text-white"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pausar" : "Reproduzir"}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-white hover:bg-white/20 hover:text-white"
            onClick={toggleMute}
            aria-label={isMuted ? "Ativar som" : "Silenciar"}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
          <div className="flex items-center gap-2 w-24">
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              max={100}
              step={1}
              onValueChange={onVolumeChange}
              className="py-2"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
