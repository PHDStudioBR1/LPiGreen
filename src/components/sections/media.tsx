"use client"

import React from 'react';

export function MediaSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-5xl font-headline font-black text-foreground">
            Notícias na mídia sobre a empresa
          </h2>
          <p className="text-lg text-muted-foreground">
            Veja alguma das inúmeras reportagens que temos na mídia falando sobre nós:
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-2xl border border-border shadow-lg">
            <button
              type="button"
              className="group relative aspect-video w-full cursor-pointer overflow-hidden bg-foreground/10"
              aria-label="Reproduzir: Reportagem sobre a iGreen Energy"
              onClick={() => window.open('https://www.youtube.com/watch?v=fQTie2mMtFA', '_blank')}
            >
              <img
                src="https://img.youtube.com/vi/fQTie2mMtFA/hqdefault.jpg"
                alt="Reportagem sobre a iGreen Energy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 transition-colors group-hover:bg-foreground/30">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/90 shadow-lg transition-transform group-hover:scale-110">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-7 w-7 text-destructive-foreground"
                    aria-hidden="true"
                  >
                    <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

