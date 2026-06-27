export type VideoTestimonial = {
  id: string;
  youtubeId: string;
};

export const IGREEN_VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  { id: "1", youtubeId: "anmPY2T5TrM" },
  { id: "2", youtubeId: "LIpUReV1TOY" },
  { id: "3", youtubeId: "b6QIJYsbZcg" },
  { id: "4", youtubeId: "danXALufu0Q" },
  { id: "5", youtubeId: "aNiHtSx36s4" },
  { id: "6", youtubeId: "9er77ntLcao" },
];

export function getYouTubeEmbedUrl(youtubeId: string) {
  const params = new URLSearchParams({
    modestbranding: "1",
    rel: "0",
    iv_load_policy: "3",
    playsinline: "1",
    fs: "1",
    controls: "1",
    cc_load_policy: "0",
    disablekb: "1",
  });

  return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`;
}
