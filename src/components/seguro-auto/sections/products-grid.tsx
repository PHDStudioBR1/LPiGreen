"use client";

import { motion } from "framer-motion";
import { trackSegurosQuoteClick } from "@/lib/seguros/analytics";
import { Container } from "@/components/seguro-auto/ui/container";
import { SectionHeading } from "@/components/seguro-auto/ui/section-heading";
import { Button } from "@/components/seguro-auto/ui/button";
import { MotionBlock, MotionStagger, MotionItem } from "@/components/seguro-auto/ui/motion";

const VEHICLE_TYPES = [
  {
    id: "auto",
    title: "Seguro Auto",
    subtitle: "Cuidado que chega em até 24 horas.",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop&q=80",
    cta: "Cotar agora",
  },
  {
    id: "moto",
    title: "Seguro Moto",
    subtitle: "Proteção completa para quem vive sobre duas rodas.",
    image:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&h=600&fit=crop&q=80",
    cta: "Saiba mais",
  },
  {
    id: "caminhao",
    title: "Seguro Caminhão",
    subtitle: "Soluções para frotas e caminhoneiros autônomos.",
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&h=600&fit=crop&q=80",
    cta: "Saiba mais",
  },
] as const;

type ProductsGridProps = {
  onQuoteClick?: () => void;
};

export function ProductsGrid({ onQuoteClick }: ProductsGridProps) {
  return (
    <section className="bg-white py-20 md:py-28">
      <Container>
        <MotionBlock>
          <SectionHeading
            title="Proteção para cada tipo de veículo"
            description="Presente em todos os momentos da sua vida para proteger o que mais importa."
          />
        </MotionBlock>

        <MotionStagger className="grid gap-6 md:grid-cols-3 md:gap-8">
          {VEHICLE_TYPES.map((product, index) => (
            <MotionItem key={product.id}>
              <article
                className={`group relative overflow-hidden rounded-[1.75rem] ${
                  index === 0 ? "md:row-span-1" : ""
                }`}
              >
                <div className="relative aspect-[3/4] overflow-hidden sm:aspect-[4/5]">
                  <motion.img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <h3 className="font-sa-headline text-2xl font-bold text-white">
                      {product.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                      {product.subtitle}
                    </p>
                    <Button
                      variant={index === 0 ? "primary" : "secondary"}
                      className={`mt-6 h-11 ${
                        index !== 0
                          ? "border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                          : ""
                      }`}
                      onClick={() => {
                        trackSegurosQuoteClick(`product_${product.id}`);
                        onQuoteClick?.();
                      }}
                    >
                      {product.cta}
                    </Button>
                  </div>
                </div>
              </article>
            </MotionItem>
          ))}
        </MotionStagger>
      </Container>
    </section>
  );
}
