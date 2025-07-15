import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import lgbtParade1 from "@/assets/lgbt-parade-1.jpg";
import lgbtParade2 from "@/assets/lgbt-parade-2.jpg";
import lgbtParade3 from "@/assets/lgbt-parade-3.jpg";
import lgbtParade4 from "@/assets/lgbt-parade-4.jpg";
import lgbtParade5 from "@/assets/lgbt-parade-5.jpg";

const images = [
  {
    src: lgbtParade1,
    alt: "London LGBT+ Pride parade 2025 - Rainbow flags with Big Ben",
    caption: "Rainbow flags wave proudly with Big Ben in the background"
  },
  {
    src: lgbtParade2,
    alt: "London LGBT+ Pride parade 2025 - Colorful parade floats",
    caption: "Vibrant parade floats bring color to London streets"
  },
  {
    src: lgbtParade3,
    alt: "London LGBT+ Pride parade 2025 - Community celebration",
    caption: "Diverse community united in celebration"
  },
  {
    src: lgbtParade4,
    alt: "London LGBT+ Pride parade 2025 - Stage performance",
    caption: "Spectacular performances light up the parade"
  },
  {
    src: lgbtParade5,
    alt: "London LGBT+ Pride parade 2025 - Trafalgar Square aerial",
    caption: "Thousands gather in Trafalgar Square for equality"
  }
];

export default function ImageGallery() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          London LGBT+ Pride 2025
        </h2>
        <p className="text-muted-foreground">
          Celebrating love, equality, and community in the heart of London
        </p>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="border-0 bg-transparent">
                  <CardContent className="flex flex-col items-center justify-center p-0">
                    <div className="relative w-full aspect-video overflow-hidden rounded-lg shadow-lg">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-4 px-4">
                      {image.caption}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
      
      <div className="flex justify-center mt-6 space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-muted hover:bg-primary transition-colors cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
}