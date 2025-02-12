"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import createHearts from "./createHearts";
import useWindowDimensions from "./useWindowDimensions";

const heartEmojis = [
  "❤️",
  "💖",
  "💙",
  "💚",
  "💛",
  "💜",
  "🧡",
  "🖤",
  "🤍",
  "🤎",
  "💕",
  "💞",
  "💓",
  "💗",
  "💘",
  "💝",
];

export const YesPage = () => {
  const heartContainer = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLDivElement>(null);
  const { height } = useWindowDimensions();

  useGSAP(() => {
    gsap.set(container.current, {
      rotation: 360,
      scale: 0,
      opacity: 0,
    });

    gsap.fromTo(
      container.current,
      {
        rotation: 360,
        scale: 0,
        opacity: 0,
      },
      {
        rotation: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
      }
    );

    gsap.to(header.current, {
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: "none",
      onUpdate: function () {
        const progress = this.progress();
        const hue = progress * 360;
        gsap.set(header.current, {
          color: `hsl(${hue}, 50%, 50%)`,
        });
      },
    });
    const numberOfStreams = 60;

    for (let i = 0; i < numberOfStreams; i++) {
      gsap.delayedCall(i * 0.1  , () => {
        createHearts({
          emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
          height: height!,
          heartContainer: heartContainer.current!,
          repeat: true,
        });
      });
    }
  });

  return (
    <>
      <div className="hearts" ref={heartContainer}></div>
      <div className="z-[1] pointer-events-none" ref={container}>
        <h1 className="text-[4em]" ref={header}>
          Yay! You made me the happiest! 💕
        </h1>
        <div className="flex justify-center">
          <img
            src="https://media4.giphy.com/media/9XY4f3FgFTT4QlaYqa/giphy.gif"
            className="max-w-full h-auto "
          />
        </div>
      </div>
    </>
  );
};
