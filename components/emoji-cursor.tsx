"use client";

import { CursorifyProvider, useCursorify } from "@cursorify/react";

const EmojiCursor = () => {
  const { mouseState, style } = useCursorify();

  return (
    <div
      style={{
        width: 40,
        height: 40,
        fontSize: 30,
      }}
    >
      {(() => {
        if (mouseState === "mouseDown") return "✊";
        if (style === "pointer") return "👆";
        return "🖐️";
      })()}
    </div>
  );
};


const CursorifyWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <CursorifyProvider cursor={<EmojiCursor />} >{children}</CursorifyProvider>
  );
};

export default CursorifyWrapper;
