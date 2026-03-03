"use client"

import React from 'react';

export function MediaSection() {
  return (
    <section className="py-24 bg-white dark:bg-neutral-950">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-5xl font-headline font-black text-foreground">
            iGreen na mídia
          </h2>
          <p className="text-lg text-muted-foreground">
            Parceria Vibra e Comerc Energia • Mais de 500.000 clientes • Selo GPTW 2025-2026. Veja reportagens sobre a iGreen:
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-2xl border border-border shadow-lg">
            <div className="relative aspect-video w-full overflow-hidden bg-foreground/10">
              <iframe
                src="https://player.vimeo.com/video/1170064148?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1"
                className="absolute inset-0 h-full w-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                title="iGreen na mídia"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

