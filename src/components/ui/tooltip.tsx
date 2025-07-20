"use client";

import * as React from "react";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = "top",
  className = "",
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      
      // Calculate position based on side
      let x = 0;
      let y = 0;
      
      switch (side) {
        case "top":
          x = rect.left + rect.width / 2;
          y = rect.top - 10;
          break;
        case "right":
          x = rect.right + 10;
          y = rect.top + rect.height / 2;
          break;
        case "bottom":
          x = rect.left + rect.width / 2;
          y = rect.bottom + 10;
          break;
        case "left":
          x = rect.left - 10;
          y = rect.top + rect.height / 2;
          break;
      }
      
      setPosition({ x, y });
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  // Calculate tooltip position classes
  const getPositionClasses = () => {
    switch (side) {
      case "top":
        return "bottom-full left-1/2 -translate-x-1/2 mb-2";
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-2";
      case "bottom":
        return "top-full left-1/2 -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-2";
      default:
        return "bottom-full left-1/2 -translate-x-1/2 mb-2";
    }
  };

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute z-50 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg whitespace-nowrap ${getPositionClasses()} ${className}`}
          role="tooltip"
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${
              side === "top" ? "bottom-[-4px] left-1/2 -translate-x-1/2" :
              side === "right" ? "left-[-4px] top-1/2 -translate-y-1/2" :
              side === "bottom" ? "top-[-4px] left-1/2 -translate-x-1/2" :
              "right-[-4px] top-1/2 -translate-y-1/2"
            }`}
          />
        </div>
      )}
    </div>
  );
};

export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};