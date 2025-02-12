"use client";

import { useRef, useState } from "react";
import useWindowDimensions from "./useWindowDimensions";
import gsap from "gsap";
import createHearts from "./createHearts";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";

const messages = [
  "Are you sure?",
  "Really sure??",
  "Are you positive?",
  "Pookie please...",
  "Just think about it!",
  "If you say no, I'll be sad...",
  "I'll be very very sad...",
  "My heart will break 💔",
  "Ok fine, I'll stop...",
  "Just kidding, SAY YES! 🥺",
];

const gifs = [
  "https://media1.giphy.com/media/VM1fcpu2bKs1e2Kdbj/giphy.gif",
  "https://media.tenor.com/6xwjsmMIAIoAAAAM/happy-happy-dog.gif",
  "https://gifdb.com/images/high/milk-and-mocha-love-me-rg6ve4g0z8mip842.gif",
  "https://media1.tenor.com/m/XhK036RdGdUAAAAC/jerry-beg.gif",
  "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGtnZ3AyMTNqOThiM2gzZmhyODJweTBnbWJiOWZkY3E3bHRlODVtMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MDJ9IbxxvDUQM/giphy.gif",
];

export const MainPage = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [noMessage, setNoMessage] = useState<string | null>(null);
  const [gifIndex, setGifIndex] = useState(0);
  const { push } = useRouter();
  const heartContainer = useRef<HTMLDivElement>(null);

  const audioRef = useRef<HTMLAudioElement>(null) 

  const { width, height } = useWindowDimensions();

  const yesButton = useRef<HTMLButtonElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);

  const jiggleTlRef = useRef<GSAPTimeline>(
    gsap.timeline({ yoyo: true, repeat: -1 })
  );

  function handleNoClick(e: React.MouseEvent<HTMLButtonElement>) {
    // Change GIF
    setGifIndex((gifIndex + 1) % gifs.length);
    setMessageIndex((messageIndex + 1) % messages.length);
    setNoMessage(messages[(messageIndex + 1) % messages.length]);
    createHearts({
      emoji: "💔",
      heartContainer: heartContainer.current as HTMLDivElement,
      height: height as number,
    });

    if (audioRef.current) {
      audioRef.current.pause()
    }

    audioRef.current = new Audio("/audio/rejected.mp3");
    audioRef.current.play();

    const noButton = e.target as HTMLButtonElement;

    gsap.set(noButton, { position: "fixed" });

    const buttonRect = noButton.getBoundingClientRect();

    const maxLeft = -buttonRect.left;
    const maxRight = width! - (buttonRect.left + buttonRect.width);
    const maxUp = -buttonRect.top;
    const maxDown = height! - (buttonRect.top + buttonRect.height);

    const randomX =
      Math.floor(Math.random() * (maxRight - maxLeft + 1)) + maxLeft;
    const randomY = Math.floor(Math.random() * (maxDown - maxUp + 1)) + maxUp;

    gsap.to(noButton, {
      x: `+=${randomX}`,
      y: `+=${randomY}`,
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(yesButton.current, {
      fontSize: `*=1.3`,
      duration: 0.3,
      ease: "power2.out",
    });
  }

  function handleNoEnter(e: React.MouseEvent<HTMLButtonElement>) {
    if (jiggleTlRef.current.paused()) {
      return jiggleTlRef.current.play();
    }
    jiggleTlRef.current.to(e.target, {
      keyframes: {
        rotation: [0, 5, -5],
      },
      duration: 0.3,
      ease: "none",
    });
  }

  function handleYesClick() {
    const audio = new Audio("/audio/yipeeee.mp3");
    audio.play();
    gsap.to(wrapper.current, {
      rotation: 360,
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: "none",
      onComplete: () => {
        setTimeout(() => {
          push("/yes");
        });
      },
    });
  }

  useGSAP(() => {
    gsap.to("#animated-gif", {
      scale: 1.1,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      duration: 0.3,
    });
  });

  return (
    <>
      <div className="text-center relative z-[1]" ref={wrapper}>
        <h1 className="">Will you be my Valentine? 💖</h1>
        <div className="mt-[20px] relative flex justify-center gap-[20px]">
          <button
            className="font-mono yes-btn px-5 py-4 text-white rounded-3xl relative bg-[#4caf50] whitespace-nowrap"
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
            onClick={handleYesClick}
            ref={yesButton}
          >
            Yes 🥰
          </button>
          <button
            className="px-5 py-4 text-white rounded-3xl relative bg-[#4caf50] invisible"
            style={{ fontSize: "1.5rem" }}
          >
            No 😢
          </button>
          <button
            className="z-[1] cursor-pointer font-mono no-btn px-5 py-4 text-white rounded-3xl bg-[#f44336] fixed left-[51%]"
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
            onClick={handleNoClick}
            onMouseEnter={handleNoEnter}
            onMouseLeave={() => {
              if (!jiggleTlRef.current.paused()) {
                jiggleTlRef.current.pause();
              }
            }}
          >
            {noMessage ?? "No 😢"}
          </button>
        </div>
        <div className="h-[20vh] mt-[20px]">
          <img
            width={500}
            height={500}
            src={gifs[gifIndex]}
            alt="Cute GIF"
            id="animated-gif"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      <div ref={heartContainer} className="hearts" />
    </>
  );
};
