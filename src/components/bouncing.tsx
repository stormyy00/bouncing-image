"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { PictureInPicture } from "lucide-react";
import { Label } from "@/components/ui/label";

const Bounce = () => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [velocity, setVelocity] = useState({ dx: 2, dy: 2 });
  const [image, setImage] = useState<string | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!image) return;

    const moveLogo = () => {
      setPosition((prev) => {
        let newX = prev.x + velocity.dx;
        let newY = prev.y + velocity.dy;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const logoWidth = 100;
        const logoHeight = 50;

        let newDx = velocity.dx;
        let newDy = velocity.dy;

        // bouncing the walls
        if (newX <= 0) {
          newX = 0;
          newDx = Math.abs(velocity.dx); //  right
        } else if (newX + logoWidth >= screenWidth) {
          newX = screenWidth - logoWidth;
          newDx = -Math.abs(velocity.dx); //  left
        }

        if (newY <= 0) {
          newY = 0;
          newDy = Math.abs(velocity.dy); //  down
        } else if (newY + logoHeight >= screenHeight) {
          newY = screenHeight - logoHeight;
          newDy = -Math.abs(velocity.dy); // bunce up
        }

        // Update velocity state
        setVelocity({ dx: newDx, dy: newDy });

        return { x: newX, y: newY };
      });

      // Request the next frame
      animationFrameRef.current = requestAnimationFrame(moveLogo);
    };

    // Start the animation
    animationFrameRef.current = requestAnimationFrame(moveLogo);

    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [velocity, image]);

  const imageUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Label className="flex flex-col items-center text-base font-semibold">
        Add an Image
        <PictureInPicture size={25} className="cursor-pointer" />
        <Input
          type="file"
          accept="image/*"
          onChange={imageUpload}
          className="hidden"
        />
      </Label>

      {image && (
        <div
          className="fixed"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          <Image src={image} alt="Moving image" width={100} height={50} />
        </div>
      )}
    </div>
  );
};

export default Bounce;
