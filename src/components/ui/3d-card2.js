// src/components/ui/3d-card.js
import { cn } from "../../utils/cn"; // Ensure this utility function exists
import React, { createContext, useState, useRef, useEffect } from "react";

export const CardContainer = ({ children, className, containerClassName }) => {
  return (
    <div
      className={cn("py-20 flex flex-wrap items-center justify-center", containerClassName)}
      style={{
        perspective: "1000px",
      }}
    >
      {children}
    </div>
  );
};

export const CardBody = ({ children, className }) => {
  return (
    <div
      className={cn(
        "m-4 h-96 w-96 [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}) => {
  const ref = useRef(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false); // State for flip effect

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    ref.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  const handleMouseEnter = () => {
    setIsMouseEntered(true);
    setIsFlipped(false); // Reset flip on mouse enter
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    setIsMouseEntered(false);
    ref.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  const handleClick = () => {
    setIsFlipped(!isFlipped); // Toggle flip on click
  };

  useEffect(() => {
    handleAnimations();
  }, [isMouseEntered, isFlipped]);

  const handleAnimations = () => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
    } else {
      ref.current.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    }
    // Apply flip effect
    if (isFlipped) {
      ref.current.style.transform += ' rotateY(180deg)'; // Flip effect
    }
  };

  return (
    <Tag
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick} // Add click handler for flip
      className={cn("w-fit border border-i3m-pink shadow-lg shadow-i3m-pink px-4 transition duration-200 ease-linear", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
};