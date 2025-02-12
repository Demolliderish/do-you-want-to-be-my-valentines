"use client";

import { useEffect, useRef, useState } from "react";
import useWindowDimensions from "./useWindowDimensions";

const chocolateEmojis = ["🍫", "🍬", "🍩", "🍪", "🎂", "🍭"];
const cellSize = 40;

const ChocolateGrid = () => {
  const [activeCells, setActiveCells] = useState<Set<number>>(new Set());
  const { width, height } = useWindowDimensions();
  const cols = Math.floor(width! / cellSize);
  const rows = Math.floor(height! / cellSize);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const timeoutRefs = useRef<{ [key: number]: NodeJS.Timeout }>({});

  function getNumCell(index: number) {
    const columns = cols;
    if (index === -1) return [];
    const row = Math.floor(index / columns);
    const col = index % columns;
    const neighbors = [];

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const neighborRow = row + i;
        const neighborCol = col + j;
        const neighborIndex = neighborRow * columns + neighborCol;
        if (
          neighborIndex >= 0 &&
          neighborIndex < rows * cols &&
          neighborCol >= 0 &&
          neighborCol < columns
        ) {
          neighbors.push(neighborIndex);
        }
      }
    }
    return neighbors;
  }

  function handleCellHover(idx: number) {
    const neighbors = getNumCell(idx);
    neighbors.forEach((neighbor) => {
      if (timeoutRefs.current[neighbor]) {
        clearTimeout(timeoutRefs.current[neighbor]);
        delete timeoutRefs.current[neighbor];
      }
    });

    setActiveCells((prevCells) => {
      const newCells = new Set(prevCells);
      neighbors.forEach((neighbor) => newCells.add(neighbor));
      return newCells;
    });
  }

  function handleCellLeave(idx: number) {
    const neighbors = getNumCell(idx);
    neighbors.forEach((neighbor) => {
      timeoutRefs.current[neighbor] = setTimeout(() => {
        setActiveCells((prevCells) => {
          const newCells = new Set(prevCells);
          newCells.delete(neighbor);
          return newCells;
        });
        delete timeoutRefs.current[neighbor];
      }, 250);
    });
  }

  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      className="chocolate-grid grid gap-px"
      ref={gridRef}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
      }}
    >
      {Array.from({ length: rows * cols }).map((_, index) => (
        <ChocolateCell
          key={index}
          active={activeCells.has(index)}
          onMouseEnter={() => handleCellHover(index)}
          onMouseLeave={() => handleCellLeave(index)}
        />
      ))}
    </div>
  );
};

interface ChocolateCellProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
}

const ChocolateCell = ({ active = false, ...props }: ChocolateCellProps) => {
  const [emoji] = useState(
    chocolateEmojis[Math.floor(Math.random() * chocolateEmojis.length)]
  );

  return (
    <div
      className="chocolate-cell"
      style={{
        backgroundColor: active ? "#d2691e" : "#f9b3cb",
        width: cellSize,
        height: cellSize,
      }}
      {...props}
    >
      {active && emoji}
    </div>
  );
};

export default ChocolateGrid;
