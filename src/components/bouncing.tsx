"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { PictureInPicture } from "lucide-react";
import { Label } from "@/components/ui/label";

type images = {
  src: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
};

const Bounce = () => {
  const [images, setImages] = useState<images[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (images.length === 0) return;

    const moveImages = () => {
      setImages((prevImages) =>
        prevImages.map((img) => {
          const newX = img.x + img.dx;
          const newY = img.y + img.dy;

          const screenWidth = window.innerWidth;
          const screenHeight = window.innerHeight;
          const logoWidth = 100;
          const logoHeight = 50;

          let newDx = img.dx;
          let newDy = img.dy;

          if (newX <= 0 || newX + logoWidth >= screenWidth) {
            newDx = -newDx;
          }
          if (newY <= 0 || newY + logoHeight >= screenHeight) {
            newDy = -newDy;
          }

          return { ...img, x: newX, y: newY, dx: newDx, dy: newDy };
        }),
      );

      animationFrameRef.current = requestAnimationFrame(moveImages);
    };

    animationFrameRef.current = requestAnimationFrame(moveImages);

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [images]);

  const imageUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        src: URL.createObjectURL(file),
        x: Math.random() * window.innerWidth * 0.8,
        y: Math.random() * window.innerHeight * 0.8,
        dx: (Math.random() - 0.5) * 4,
        dy: (Math.random() - 0.5) * 4,
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Label className="flex flex-col items-center text-base font-semibold">
        Add Images
        <PictureInPicture
          size={25}
          className="cursor-pointer hover:scale-105 duration-300 text-black hover:text-blue-600"
        />
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={imageUpload}
          className="hidden"
        />
      </Label>

      {images.map((img, index) => (
        <div
          key={index}
          className="fixed"
          style={{
            left: `${img.x}px`,
            top: `${img.y}px`,
          }}
        >
          <Image
            src={img.src}
            alt={`moving image ${index}`}
            width={100}
            height={50}
          />
        </div>
      ))}
    </div>
  );
};

export default Bounce;
