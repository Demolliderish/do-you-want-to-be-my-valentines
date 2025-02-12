import { gsap } from "gsap";

function createHearts({
  emoji = "💖",
  heartContainer,
  height,
  repeat = false,
}: {
  emoji?: string;
  heartContainer?: HTMLElement;
  height?: number;
  repeat?: boolean;
}) {
  if (!heartContainer || !height) {
    return;
  }

  const heart = document.createElement("span");
  heart.innerHTML = emoji;
  heart.style.left = Math.random() * window.innerWidth + "px";
  heart.style.fontSize = Math.random() * 30 + 20 + "px";
  heartContainer.appendChild(heart);

  gsap.fromTo(
    heart,
    {
      y: height,
      rotation: 0,
    },
    {
      y: -height - 200,
      rotation: 360,
      duration: Math.random() * 3 + 3,
      ease: "power1.out",
      onComplete: () => {
        heart.remove();
        if (repeat) {
          createHearts({
            emoji,
            heartContainer,
            height,
            repeat,
          });
        }
      },
    }
  );
}

export default createHearts;
