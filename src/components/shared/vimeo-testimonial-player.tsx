"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type Player from "@vimeo/player";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function getVimeoChromelessUrl(vimeoId: string) {
  const params = new URLSearchParams({
    controls: "0",
    title: "0",
    byline: "0",
    portrait: "0",
    badge: "0",
    pip: "0",
    fullscreen: "0",
    watch_full_video: "0",
    dnt: "1",
  });

  return `https://player.vimeo.com/video/${vimeoId}?${params.toString()}`;
}

const END_SCREEN_GUARD_SECONDS = 0.2;

type VimeoTestimonialPlayerProps = {
  vimeoId: string;
  title: string;
  className?: string;
};

export function VimeoTestimonialPlayer({
  vimeoId,
  title,
  className,
}: VimeoTestimonialPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<Player | null>(null);
  const isDraggingTimelineRef = useRef(false);
  const endScreenGuardRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [coverEndScreen, setCoverEndScreen] = useState(false);
  const [hasError, setHasError] = useState(false);

  const resetPlayback = useCallback(async () => {
    const player = playerRef.current;
    if (!player) return;

    try {
      await player.pause();
      await player.setCurrentTime(0);
      setCurrentTime(0);
      setIsPlaying(false);
    } catch (error) {
      console.error("Reset playback error", error);
    }
  }, []);

  const handleNearEnd = useCallback(async () => {
    if (endScreenGuardRef.current) return;

    endScreenGuardRef.current = true;
    setCoverEndScreen(true);

    try {
      await resetPlayback();
    } finally {
      setCoverEndScreen(false);
    }
  }, [resetPlayback]);

  const initPlayer = useCallback(async () => {
    if (!iframeRef.current) return;

    try {
      const { default: VimeoPlayer } = await import("@vimeo/player");
      const player = new VimeoPlayer(iframeRef.current) as Player;
      playerRef.current = player;

      player.on("error", () => setHasError(true));

      player.on("timeupdate", (data: { seconds: number; duration: number }) => {
        if (!isDraggingTimelineRef.current) {
          setCurrentTime(data.seconds);
        }

        if (
          data.duration > 0 &&
          data.duration - data.seconds <= END_SCREEN_GUARD_SECONDS
        ) {
          void handleNearEnd();
        }
      });
      player.on("durationchange", (data: { duration: number }) => {
        setDuration(data.duration);
      });
      player.on("play", () => {
        endScreenGuardRef.current = false;
        setIsPlaying(true);
      });
      player.on("pause", () => setIsPlaying(false));
      player.on("ended", () => {
        void handleNearEnd();
      });

      const [nextDuration, nextTime] = await Promise.all([
        player.getDuration(),
        player.getCurrentTime(),
      ]);

      setDuration(nextDuration);
      setCurrentTime(nextTime);
      setHasError(false);
    } catch (error) {
      console.error("Vimeo testimonial player init error", error);
      setHasError(true);
    }
  }, [handleNearEnd]);

  useEffect(() => {
    endScreenGuardRef.current = false;
    setHasError(false);
    void initPlayer();

    return () => {
      playerRef.current = null;
    };
  }, [initPlayer, vimeoId]);

  const togglePlay = useCallback(async () => {
    const player = playerRef.current;
    if (!player) return;

    try {
      if (isPlaying) {
        await player.pause();
      } else {
        endScreenGuardRef.current = false;
        await player.play();
      }
    } catch (error) {
      console.error("Play/pause error", error);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(async () => {
    const player = playerRef.current;
    if (!player) return;

    try {
      if (isMuted) {
        await player.setVolume(volume > 0 ? volume : 1);
        setIsMuted(false);
      } else {
        await player.setVolume(0);
        setIsMuted(true);
      }
    } catch (error) {
      console.error("Mute error", error);
    }
  }, [isMuted, volume]);

  const onVolumeChange = useCallback(async (value: number[]) => {
    const nextVolume = (value[0] ?? 0) / 100;
    setVolume(nextVolume);

    const player = playerRef.current;
    if (!player) return;

    try {
      await player.setVolume(nextVolume);
      setIsMuted(nextVolume === 0);
    } catch (error) {
      console.error("Volume error", error);
    }
  }, []);

  const onTimelineCommit = useCallback(async (value: number[]) => {
    const nextTime = value[0] ?? 0;
    isDraggingTimelineRef.current = false;
    setCurrentTime(nextTime);

    const player = playerRef.current;
    if (!player) return;

    try {
      await player.setCurrentTime(nextTime);
    } catch (error) {
      console.error("Seek error", error);
    }
  }, []);

  return (
    <div className={cn("relative aspect-video w-full overflow-hidden bg-black", className)}>
      {hasError ? (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-neutral-900 px-4 text-center"
          role="status"
        >
          <p className="text-sm text-white/80">
            Vídeo temporariamente indisponível. Tente novamente mais tarde.
          </p>
        </div>
      ) : null}

      <iframe
        ref={iframeRef}
        src={getVimeoChromelessUrl(vimeoId)}
        className="pointer-events-none absolute inset-0 h-full w-full border-0"
        allow="autoplay"
        referrerPolicy="strict-origin-when-cross-origin"
        title={title}
      />

      {coverEndScreen ? (
        <div className="absolute inset-0 z-[5] bg-black" aria-hidden />
      ) : null}

      {!hasError ? (
      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/55 to-transparent px-3 pb-3 pt-8">
        <div className="mb-2 flex items-center gap-3">
          <Slider
            className="flex-1 [&>span]:h-1 [&>span]:bg-white/25 [&>span>span]:bg-white [&_.block]:size-3 [&_.block]:border-white [&_.block]:bg-white"
            value={[duration > 0 ? currentTime : 0]}
            max={duration > 0 ? duration : 100}
            step={0.1}
            onValueChange={(value) => {
              isDraggingTimelineRef.current = true;
              setCurrentTime(value[0] ?? 0);
            }}
            onValueCommit={onTimelineCommit}
            aria-label="Progresso do vídeo"
          />
          <span className="w-16 shrink-0 text-right text-xs tabular-nums text-white/90">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white transition-colors hover:bg-white/15"
            onClick={() => void togglePlay()}
            aria-label={isPlaying ? "Pausar" : "Reproduzir"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white transition-colors hover:bg-white/15"
            onClick={() => void toggleMute()}
            aria-label={isMuted ? "Ativar som" : "Silenciar"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <Slider
            className="w-24 [&>span]:h-1 [&>span]:bg-white/25 [&>span>span]:bg-white [&_.block]:size-3 [&_.block]:border-white [&_.block]:bg-white"
            value={[isMuted ? 0 : volume * 100]}
            max={100}
            step={1}
            onValueChange={onVolumeChange}
            aria-label="Volume"
          />
        </div>
      </div>
      ) : null}
    </div>
  );
}
