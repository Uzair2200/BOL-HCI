import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";

export type PetMood = 
  | "happy" 
  | "excited" 
  | "sleepy" 
  | "curious" 
  | "proud" 
  | "shy" 
  | "confused" 
  | "hungry" 
  | "playful" 
  | "calm"
  | "dirty"
  | "sick"
  | "learning";

interface PetDisplayProps {
  mood?: PetMood;
  size?: "sm" | "md" | "lg";
  showBubbles?: boolean;
  isListening?: boolean;
}

type InteractionState = "idle" | "tapped" | "spinning" | "dizzy" | "hurt" | "giggling";

interface TapEffect {
  id: number;
  x: number;
  y: number;
  type: "heart" | "star" | "sparkle" | "ow";
}

export function PetDisplay({ mood = "happy", size = "lg", showBubbles = false, isListening = false }: PetDisplayProps) {
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-56 h-56"
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [interactionState, setInteractionState] = useState<InteractionState>("idle");
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [tapEffects, setTapEffects] = useState<TapEffect[]>([]);
  const [isPressed, setIsPressed] = useState(false);

  // Reset tap count after 1 second of no taps
  useEffect(() => {
    if (tapCount > 0) {
      const timer = setTimeout(() => {
        setTapCount(0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [tapCount, lastTapTime]);

  // Reset interaction state after animation
  useEffect(() => {
    if (interactionState !== "idle") {
      const duration = interactionState === "spinning" ? 800 : 
                       interactionState === "dizzy" ? 2000 :
                       interactionState === "hurt" ? 1200 : 1000;
      const timer = setTimeout(() => {
        setInteractionState("idle");
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [interactionState]);

  // Handle tap/click
  const handleTap = (event: MouseEvent | TouchEvent | PointerEvent) => {
    if (!containerRef.current) return;
    
    const now = Date.now();
    const timeSinceLast = now - lastTapTime;
    
    // Get tap position using ref
    const rect = containerRef.current.getBoundingClientRect();
    let clientX, clientY;
    
    if ("touches" in event) {
      const touch = event.touches[0] || event.changedTouches[0];
      if (!touch) return;
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
    
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    // Determine tap area
    const isBellyTap = x > 30 && x < 70 && y > 50 && y < 75;
    const isHeadTap = x > 25 && x < 75 && y > 15 && y < 50;

    setLastTapTime(now);

    // Count rapid taps
    if (timeSinceLast < 500) {
      setTapCount(prev => prev + 1);
    } else {
      setTapCount(1);
    }

    // Determine reaction based on tap count and area
    if (tapCount >= 5) {
      // Too many taps - gets dizzy/confused
      setInteractionState("dizzy");
      setRotation(prev => prev + 720);
      addTapEffect(x, y, "ow");
    } else if (tapCount >= 3) {
      // Multiple taps - spinning excitement
      setInteractionState("spinning");
      setRotation(prev => prev + 360);
      addTapEffect(x, y, "star");
      addTapEffect(x + 10, y - 10, "star");
    } else if (isBellyTap) {
      // Belly rub - giggles
      setInteractionState("giggling");
      addTapEffect(x, y, "heart");
      addTapEffect(x - 15, y, "heart");
      addTapEffect(x + 15, y, "heart");
    } else if (isHeadTap) {
      // Head pat - happy
      setInteractionState("tapped");
      setRotation(prev => prev + (Math.random() > 0.5 ? 15 : -15));
      addTapEffect(x, y, "sparkle");
    } else {
      // Normal tap
      setInteractionState("tapped");
      setRotation(prev => prev + (Math.random() > 0.5 ? 10 : -10));
      addTapEffect(x, y, "heart");
    }
  };

  const addTapEffect = (x: number, y: number, type: TapEffect["type"]) => {
    const id = Date.now() + Math.random();
    setTapEffects(prev => [...prev, { id, x, y, type }]);
    setTimeout(() => {
      setTapEffects(prev => prev.filter(effect => effect.id !== id));
    }, 1000);
  };

  // Handle long press
  const handlePressStart = () => {
    setIsPressed(true);
  };

  const handlePressEnd = () => {
    if (isPressed) {
      setIsPressed(false);
    }
  };

  // Dynamic animation based on mood and interaction
  const getMoodAnimation = () => {
    if (interactionState === "spinning") {
      return { 
        y: [0, -30, 0],
        rotate: [rotation - 360, rotation],
        scale: [1, 1.1, 1]
      };
    }
    
    if (interactionState === "dizzy") {
      return { 
        rotate: [rotation - 720, rotation],
        x: [-5, 5, -5, 5, 0],
        y: [0, -5, 0]
      };
    }
    
    if (interactionState === "hurt") {
      return { 
        x: [-10, 10, -8, 8, -5, 5, 0],
        rotate: [rotation - 10, rotation + 10, rotation]
      };
    }
    
    if (interactionState === "giggling") {
      return { 
        rotate: [rotation - 5, rotation + 5, rotation - 5, rotation + 5, rotation],
        scale: [1, 1.05, 1, 1.05, 1],
        y: [0, -10, 0, -5, 0]
      };
    }
    
    if (interactionState === "tapped") {
      return { 
        y: [0, -15, 0],
        rotate: [rotation - 20, rotation + 5, rotation],
        scale: [1, 1.08, 1]
      };
    }

    // Default mood-based animations
    switch (mood) {
      case "excited":
      case "playful":
        return { y: [0, -12, 0, -8, 0], rotate: [0, -3, 3, -2, 0] };
      case "sleepy":
        return { y: [0, 3, 0], rotate: [0, -2, 0] };
      case "curious":
        return { y: [0, -5, 0], rotate: [-8, -10, -8] };
      case "proud":
        return { y: [0, -6, 0], scale: [1, 1.02, 1] };
      case "shy":
        return { y: [0, 2, 0], rotate: [5, 7, 5], x: [0, -2, 0] };
      case "confused":
        return { y: [0, -3, 0], rotate: [8, 10, 8] };
      default:
        return { y: [0, -8, 0] };
    }
  };

  const animationDuration = 
    interactionState === "spinning" ? 0.8 :
    interactionState === "dizzy" ? 2 :
    interactionState === "hurt" ? 1.2 :
    interactionState === "giggling" ? 1 :
    interactionState === "tapped" ? 0.6 :
    mood === "excited" || mood === "playful" ? 1.5 : 2;

  // Body position adjustments based on mood
  const getBodyTransform = () => {
    switch (mood) {
      case "curious": return "translate(-8, 0)";
      case "shy": return "translate(5, 2)";
      case "proud": return "translate(0, -3)";
      case "sleepy": return "translate(0, 3)";
      case "playful": return "translate(-3, 0)";
      default: return "translate(0, 0)";
    }
  };

  // Determine current visual mood based on interaction
  const getCurrentMood = (): PetMood => {
    if (interactionState === "dizzy") return "confused";
    if (interactionState === "hurt") return "sick";
    if (interactionState === "giggling") return "excited";
    if (interactionState === "tapped") return "happy";
    if (isPressed) return "shy";
    return mood;
  };

  const currentMood = getCurrentMood();

  return (
    <div className="relative flex items-center justify-center" ref={containerRef}>
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={getMoodAnimation()}
        transition={{
          duration: animationDuration,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        onTap={handleTap}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
      >
        {/* Interactive Virtual Pet Panda */}
        <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-2xl">
          <defs>
            {/* 3D Gradients for volume and depth */}
            <radialGradient id="bodyGradient" cx="45%" cy="35%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F8F9FA" />
              <stop offset="100%" stopColor="#E8EAED" />
            </radialGradient>
            
            <radialGradient id="headGradient" cx="40%" cy="30%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#F8F9FA" />
              <stop offset="100%" stopColor="#E8EAED" />
            </radialGradient>
            
            <radialGradient id="bellyGradient" cx="50%" cy="40%">
              <stop offset="0%" stopColor="#FFF5EB" />
              <stop offset="70%" stopColor="#FFEFD5" />
              <stop offset="100%" stopColor="#FFE4C4" />
            </radialGradient>
            
            <radialGradient id="pawGradient" cx="40%" cy="30%">
              <stop offset="0%" stopColor="#4A5568" />
              <stop offset="60%" stopColor="#374151" />
              <stop offset="100%" stopColor="#1F2937" />
            </radialGradient>
            
            <radialGradient id="earGradient" cx="35%" cy="25%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="70%" stopColor="#1F2937" />
              <stop offset="100%" stopColor="#111827" />
            </radialGradient>
            
            <radialGradient id="eyePatchGradient" cx="30%" cy="25%">
              <stop offset="0%" stopColor="#2D3748" />
              <stop offset="70%" stopColor="#1A202C" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>
            
            <radialGradient id="noseGradient" cx="30%" cy="25%">
              <stop offset="0%" stopColor="#2D3748" />
              <stop offset="100%" stopColor="#1A202C" />
            </radialGradient>
            
            <radialGradient id="cheekBlush" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#FFB3C1" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FFB3C1" stopOpacity="0" />
            </radialGradient>
            
            <radialGradient id="eyeShine" cx="30%" cy="30%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
            
            <radialGradient id="softShadow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g transform={getBodyTransform()}>
            {/* Ground shadow */}
            <ellipse cx="100" cy="200" rx="50" ry="8" fill="url(#softShadow)" />

            {/* Back Legs with 3D volume */}
            <ellipse cx="70" cy="185" rx="23" ry="19" fill="url(#pawGradient)" />
            <ellipse cx="130" cy="185" rx="23" ry="19" fill="url(#pawGradient)" />
            <ellipse cx="64" cy="180" rx="8" ry="6" fill="#4A5568" opacity="0.6" />
            <ellipse cx="124" cy="180" rx="8" ry="6" fill="#4A5568" opacity="0.6" />
            <ellipse cx="70" cy="188" rx="11" ry="8" fill="#5A6978" />
            <ellipse cx="130" cy="188" rx="11" ry="8" fill="#5A6978" />

            {/* Body - rounded and soft with depth */}
            <ellipse cx="100" cy="145" rx="58" ry="50" fill="url(#bodyGradient)" />
            <ellipse cx="100" cy="170" rx="46" ry="20" fill="#E0E3E7" opacity="0.4" />
            
            {/* Belly patch */}
            <ellipse cx="100" cy="150" rx="40" ry="34" fill="url(#bellyGradient)" />
            <ellipse cx="100" cy="138" rx="26" ry="16" fill="#FFFFFF" opacity="0.3" />

            {/* Front Arms - dynamic positioning based on mood */}
            {mood === "excited" || mood === "playful" ? (
              <>
                {/* Arms up in celebration */}
                <ellipse cx="58" cy="125" rx="18" ry="28" fill="url(#pawGradient)" transform="rotate(-25 58 125)" />
                <ellipse cx="142" cy="125" rx="18" ry="28" fill="url(#pawGradient)" transform="rotate(25 142 125)" />
                <ellipse cx="54" cy="118" rx="6" ry="9" fill="#4A5568" opacity="0.5" />
                <ellipse cx="138" cy="118" rx="6" ry="9" fill="#4A5568" opacity="0.5" />
                <ellipse cx="58" cy="132" rx="10" ry="13" fill="#5A6978" />
                <ellipse cx="142" cy="132" rx="10" ry="13" fill="#5A6978" />
              </>
            ) : mood === "shy" ? (
              <>
                {/* Arms covering face slightly */}
                <ellipse cx="65" cy="100" rx="18" ry="24" fill="url(#pawGradient)" transform="rotate(-15 65 100)" />
                <ellipse cx="135" cy="135" rx="18" ry="24" fill="url(#pawGradient)" />
                <ellipse cx="61" cy="95" rx="6" ry="9" fill="#4A5568" opacity="0.5" />
                <ellipse cx="131" cy="130" rx="6" ry="9" fill="#4A5568" opacity="0.5" />
              </>
            ) : mood === "curious" ? (
              <>
                {/* One paw raised slightly */}
                <ellipse cx="58" cy="138" rx="18" ry="24" fill="url(#pawGradient)" />
                <ellipse cx="145" cy="120" rx="18" ry="26" fill="url(#pawGradient)" transform="rotate(15 145 120)" />
                <ellipse cx="54" cy="133" rx="6" ry="9" fill="#4A5568" opacity="0.5" />
                <ellipse cx="141" cy="115" rx="6" ry="9" fill="#4A5568" opacity="0.5" />
              </>
            ) : (
              <>
                {/* Normal arm position */}
                <ellipse cx="60" cy="140" rx="19" ry="25" fill="url(#pawGradient)" />
                <ellipse cx="140" cy="140" rx="19" ry="25" fill="url(#pawGradient)" />
                <ellipse cx="56" cy="133" rx="7" ry="10" fill="#4A5568" opacity="0.5" />
                <ellipse cx="136" cy="133" rx="7" ry="10" fill="#4A5568" opacity="0.5" />
                <ellipse cx="60" cy="147" rx="10" ry="13" fill="#5A6978" />
                <ellipse cx="140" cy="147" rx="10" ry="13" fill="#5A6978" />
                <circle cx="60" cy="153" r="3" fill="#4A5568" />
                <circle cx="140" cy="153" r="3" fill="#4A5568" />
              </>
            )}

            {/* Head - with dynamic tilt based on mood */}
            <g transform={mood === "curious" ? "rotate(-12 100 80)" : mood === "confused" ? "rotate(12 100 80)" : mood === "shy" ? "rotate(8 100 80)" : ""}>
              <ellipse cx="100" cy="80" rx="62" ry="60" fill="url(#headGradient)" />
              <ellipse cx="88" cy="55" rx="30" ry="17" fill="#FFFFFF" opacity="0.35" />
              <ellipse cx="100" cy="62" rx="36" ry="20" fill="#FFFFFF" opacity="0.2" />

              {/* Ears - with mood-based positioning */}
              {mood === "curious" || mood === "learning" ? (
                <>
                  {/* Perked up ears */}
                  <ellipse cx="58" cy="42" rx="21" ry="25" fill="url(#earGradient)" transform="rotate(-10 58 42)" />
                  <ellipse cx="142" cy="42" rx="21" ry="25" fill="url(#earGradient)" transform="rotate(10 142 42)" />
                  <ellipse cx="54" cy="38" rx="8" ry="9" fill="#4A5568" opacity="0.4" />
                  <ellipse cx="138" cy="38" rx="8" ry="9" fill="#4A5568" opacity="0.4" />
                </>
              ) : (
                <>
                  {/* Normal ears */}
                  <ellipse cx="58" cy="48" rx="21" ry="24" fill="url(#earGradient)" />
                  <ellipse cx="142" cy="48" rx="21" ry="24" fill="url(#earGradient)" />
                  <ellipse cx="54" cy="44" rx="8" ry="9" fill="#4A5568" opacity="0.4" />
                  <ellipse cx="138" cy="44" rx="8" ry="9" fill="#4A5568" opacity="0.4" />
                </>
              )}
              
              <ellipse cx="58" cy="51" rx="12" ry="13" fill="#5A6978" />
              <ellipse cx="142" cy="51" rx="12" ry="13" fill="#5A6978" />
              <ellipse cx="56" cy="48" rx="5" ry="6" fill="#6B7789" opacity="0.6" />
              <ellipse cx="140" cy="48" rx="5" ry="6" fill="#6B7789" opacity="0.6" />

              {/* Eye patches */}
              <ellipse cx="75" cy="83" rx="20" ry="24" fill="url(#eyePatchGradient)" />
              <ellipse cx="125" cy="83" rx="20" ry="24" fill="url(#eyePatchGradient)" />
              <ellipse cx="70" cy="77" rx="7" ry="9" fill="#374151" opacity="0.3" />
              <ellipse cx="120" cy="77" rx="7" ry="9" fill="#374151" opacity="0.3" />

              {/* EYES - Highly expressive for each mood */}
              {mood === "sleepy" ? (
                <>
                  {/* Closed sleepy eyes */}
                  <path d="M 65 83 Q 75 90 85 83" stroke="#1A202C" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                  <path d="M 115 83 Q 125 90 135 83" stroke="#1A202C" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                  <path d="M 65 85 Q 75 89 85 85" stroke="#000000" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.1" />
                  <path d="M 115 85 Q 125 89 135 85" stroke="#000000" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.1" />
                  {/* Sleepy zzz's */}
                  <motion.g
                    animate={{ opacity: [0.4, 0.8, 0.4], y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <text x="145" y="68" fill="#B3A4FF" fontSize="16" fontFamily="Arial, sans-serif" fontWeight="bold">z</text>
                    <text x="153" y="60" fill="#B3A4FF" fontSize="13" fontFamily="Arial, sans-serif" fontWeight="bold" opacity="0.8">z</text>
                    <text x="160" y="54" fill="#B3A4FF" fontSize="10" fontFamily="Arial, sans-serif" fontWeight="bold" opacity="0.6">z</text>
                  </motion.g>
                </>
              ) : mood === "excited" ? (
                <>
                  {/* Wide excited eyes - stars in eyes */}
                  <ellipse cx="75" cy="84" rx="16" ry="19" fill="#FFFFFF" />
                  <ellipse cx="125" cy="84" rx="16" ry="19" fill="#FFFFFF" />
                  <ellipse cx="75" cy="92" rx="13" ry="7" fill="#E8EAED" opacity="0.5" />
                  <ellipse cx="125" cy="92" rx="13" ry="7" fill="#E8EAED" opacity="0.5" />
                  
                  {/* Star-shaped pupils */}
                  <path d="M 75 79 L 77 84 L 82 84 L 78 87 L 80 92 L 75 89 L 70 92 L 72 87 L 68 84 L 73 84 Z" fill="#1A202C" />
                  <path d="M 125 79 L 127 84 L 132 84 L 128 87 L 130 92 L 125 89 L 120 92 L 122 87 L 118 84 L 123 84 Z" fill="#1A202C" />
                  
                  {/* Mega sparkles */}
                  <circle cx="70" cy="78" r="4" fill="#FFD166" opacity="0.9" />
                  <circle cx="120" cy="78" r="4" fill="#FFD166" opacity="0.9" />
                  <circle cx="80" cy="88" r="3" fill="#FFFFFF" />
                  <circle cx="130" cy="88" r="3" fill="#FFFFFF" />
                </>
              ) : mood === "curious" ? (
                <>
                  {/* Wide curious eyes looking to the side */}
                  <ellipse cx="75" cy="83" rx="16" ry="19" fill="#FFFFFF" />
                  <ellipse cx="125" cy="83" rx="16" ry="19" fill="#FFFFFF" />
                  <ellipse cx="75" cy="91" rx="13" ry="7" fill="#E8EAED" opacity="0.5" />
                  <ellipse cx="125" cy="91" rx="13" ry="7" fill="#E8EAED" opacity="0.5" />
                  
                  {/* Pupils looking to the right */}
                  <circle cx="78" cy="84" r="10" fill="#1A202C" />
                  <circle cx="128" cy="84" r="10" fill="#1A202C" />
                  
                  {/* Big curious sparkles */}
                  <ellipse cx="73" cy="79" rx="5" ry="6" fill="url(#eyeShine)" />
                  <ellipse cx="123" cy="79" rx="5" ry="6" fill="url(#eyeShine)" />
                  <circle cx="82" cy="87" r="2.5" fill="#FFFFFF" opacity="0.9" />
                  <circle cx="132" cy="87" r="2.5" fill="#FFFFFF" opacity="0.9" />
                </>
              ) : mood === "proud" ? (
                <>
                  {/* Happy confident eyes - half closed */}
                  <ellipse cx="75" cy="85" rx="14" ry="16" fill="#FFFFFF" />
                  <ellipse cx="125" cy="85" rx="14" ry="16" fill="#FFFFFF" />
                  <path d="M 65 80 Q 75 78 85 80" stroke="#1A202C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 115 80 Q 125 78 135 80" stroke="#1A202C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  
                  <circle cx="75" cy="88" r="8" fill="#1A202C" />
                  <circle cx="125" cy="88" r="8" fill="#1A202C" />
                  
                  <ellipse cx="71" cy="84" rx="4" ry="5" fill="url(#eyeShine)" />
                  <ellipse cx="121" cy="84" rx="4" ry="5" fill="url(#eyeShine)" />
                  <circle cx="78" cy="91" r="2" fill="#FFFFFF" opacity="0.9" />
                  <circle cx="128" cy="91" r="2" fill="#FFFFFF" opacity="0.9" />
                </>
              ) : mood === "shy" ? (
                <>
                  {/* Looking down shyly */}
                  <ellipse cx="75" cy="85" rx="14" ry="17" fill="#FFFFFF" />
                  <ellipse cx="125" cy="85" rx="14" ry="17" fill="#FFFFFF" />
                  <ellipse cx="75" cy="93" rx="11" ry="6" fill="#E8EAED" opacity="0.5" />
                  <ellipse cx="125" cy="93" rx="11" ry="6" fill="#E8EAED" opacity="0.5" />
                  
                  {/* Pupils looking down */}
                  <circle cx="75" cy="90" r="9" fill="#1A202C" />
                  <circle cx="125" cy="90" r="9" fill="#1A202C" />
                  
                  <ellipse cx="71" cy="87" rx="4" ry="4" fill="url(#eyeShine)" />
                  <ellipse cx="121" cy="87" rx="4" ry="4" fill="url(#eyeShine)" />
                  <circle cx="78" cy="92" r="2" fill="#FFFFFF" opacity="0.8" />
                  <circle cx="128" cy="92" r="2" fill="#FFFFFF" opacity="0.8" />
                </>
              ) : mood === "confused" ? (
                <>
                  {/* One eye bigger than the other - confused look */}
                  <ellipse cx="75" cy="83" rx="15" ry="18" fill="#FFFFFF" />
                  <ellipse cx="125" cy="85" rx="13" ry="16" fill="#FFFFFF" />
                  <ellipse cx="75" cy="91" rx="12" ry="6" fill="#E8EAED" opacity="0.5" />
                  <ellipse cx="125" cy="93" rx="10" ry="6" fill="#E8EAED" opacity="0.5" />
                  
                  <circle cx="75" cy="85" r="9" fill="#1A202C" />
                  <circle cx="125" cy="87" r="8" fill="#1A202C" />
                  
                  <ellipse cx="71" cy="81" rx="4" ry="5" fill="url(#eyeShine)" />
                  <ellipse cx="121" cy="83" rx="3" ry="4" fill="url(#eyeShine)" />
                  <circle cx="78" cy="88" r="2" fill="#FFFFFF" opacity="0.9" />
                  <circle cx="128" cy="90" r="2" fill="#FFFFFF" opacity="0.9" />
                </>
              ) : mood === "hungry" ? (
                <>
                  {/* Pleading hungry eyes */}
                  <ellipse cx="75" cy="84" rx="16" ry="20" fill="#FFFFFF" />
                  <ellipse cx="125" cy="84" rx="16" ry="20" fill="#FFFFFF" />
                  <ellipse cx="75" cy="93" rx="13" ry="8" fill="#E8EAED" opacity="0.5" />
                  <ellipse cx="125" cy="93" rx="13" ry="8" fill="#E8EAED" opacity="0.5" />
                  
                  {/* Large pupils for pleading look */}
                  <circle cx="75" cy="87" r="11" fill="#1A202C" />
                  <circle cx="125" cy="87" r="11" fill="#1A202C" />
                  
                  <ellipse cx="70" cy="82" rx="5" ry="6" fill="url(#eyeShine)" />
                  <ellipse cx="120" cy="82" rx="5" ry="6" fill="url(#eyeShine)" />
                  <circle cx="80" cy="90" r="3" fill="#FFFFFF" opacity="0.9" />
                  <circle cx="130" cy="90" r="3" fill="#FFFFFF" opacity="0.9" />
                </>
              ) : mood === "playful" ? (
                <>
                  {/* Mischievous wink - one eye closed */}
                  <path d="M 65 85 Q 75 92 85 85" stroke="#1A202C" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                  <ellipse cx="125" cy="84" rx="16" ry="19" fill="#FFFFFF" />
                  <ellipse cx="125" cy="92" rx="13" ry="7" fill="#E8EAED" opacity="0.5" />
                  
                  <circle cx="125" cy="86" r="10" fill="#1A202C" />
                  <ellipse cx="120" cy="81" rx="5" ry="6" fill="url(#eyeShine)" />
                  <circle cx="130" cy="89" r="2.5" fill="#FFFFFF" opacity="0.9" />
                </>
              ) : mood === "calm" ? (
                <>
                  {/* Peaceful eyes - slightly closed */}
                  <ellipse cx="75" cy="84" rx="14" ry="16" fill="#FFFFFF" />
                  <ellipse cx="125" cy="84" rx="14" ry="16" fill="#FFFFFF" />
                  <path d="M 65 79 Q 75 77 85 79" stroke="#1A202C" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
                  <path d="M 115 79 Q 125 77 135 79" stroke="#1A202C" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
                  
                  <circle cx="75" cy="87" r="8" fill="#1A202C" />
                  <circle cx="125" cy="87" r="8" fill="#1A202C" />
                  
                  <ellipse cx="71" cy="83" rx="4" ry="4" fill="url(#eyeShine)" />
                  <ellipse cx="121" cy="83" rx="4" ry="4" fill="url(#eyeShine)" />
                  <circle cx="78" cy="89" r="2" fill="#FFFFFF" opacity="0.8" />
                  <circle cx="128" cy="89" r="2" fill="#FFFFFF" opacity="0.8" />
                </>
              ) : (
                <>
                  {/* Happy default eyes */}
                  <ellipse cx="75" cy="84" rx="15" ry="18" fill="#FFFFFF" />
                  <ellipse cx="125" cy="84" rx="15" ry="18" fill="#FFFFFF" />
                  <ellipse cx="75" cy="92" rx="12" ry="6" fill="#E8EAED" opacity="0.5" />
                  <ellipse cx="125" cy="92" rx="12" ry="6" fill="#E8EAED" opacity="0.5" />
                  
                  <circle cx="75" cy="86" r="10" fill="#1A202C" />
                  <circle cx="125" cy="86" r="10" fill="#1A202C" />
                  
                  <ellipse cx="71" cy="81" rx="5" ry="6" fill="url(#eyeShine)" />
                  <ellipse cx="121" cy="81" rx="5" ry="6" fill="url(#eyeShine)" />
                  <circle cx="79" cy="89" r="2.5" fill="#FFFFFF" opacity="0.9" />
                  <circle cx="129" cy="89" r="2.5" fill="#FFFFFF" opacity="0.9" />
                </>
              )}

              {/* Cheeks - more prominent when shy or happy */}
              <ellipse 
                cx="48" 
                cy="96" 
                rx={mood === "shy" || mood === "excited" ? "16" : "14"} 
                ry="11" 
                fill="url(#cheekBlush)" 
                opacity={mood === "shy" || mood === "excited" ? "1" : "0.8"}
              />
              <ellipse 
                cx="152" 
                cy="96" 
                rx={mood === "shy" || mood === "excited" ? "16" : "14"} 
                ry="11" 
                fill="url(#cheekBlush)"
                opacity={mood === "shy" || mood === "excited" ? "1" : "0.8"}
              />
              <ellipse cx="46" cy="94" rx="6" ry="4" fill="#FFF" opacity="0.3" />
              <ellipse cx="150" cy="94" rx="6" ry="4" fill="#FFF" opacity="0.3" />

              {/* Nose */}
              <ellipse cx="100" cy="102" rx="8" ry="6" fill="url(#noseGradient)" />
              <ellipse cx="97" cy="100" rx="3" ry="2.5" fill="#FFFFFF" opacity="0.7" />
              <circle cx="96" cy="99" r="1.5" fill="#FFFFFF" opacity="0.9" />

              {/* MOUTH - Highly expressive for each mood */}
              {mood === "happy" ? (
                <>
                  <path d="M 84 110 Q 100 122 116 110" stroke="#1A202C" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  <path d="M 86 112 Q 100 121 114 112" stroke="#000000" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.1" />
                </>
              ) : mood === "excited" ? (
                <>
                  {/* Big open excited mouth */}
                  <ellipse cx="100" cy="116" rx="13" ry="15" fill="#1A202C" />
                  <ellipse cx="100" cy="120" rx="10" ry="11" fill="#FF9EAA" />
                  <ellipse cx="97" cy="114" rx="3" ry="3" fill="#FFFFFF" opacity="0.6" />
                  <ellipse cx="100" cy="123" rx="6" ry="5" fill="#FF7B8A" />
                </>
              ) : mood === "curious" ? (
                <>
                  {/* Small O-shaped curious mouth */}
                  <ellipse cx="100" cy="112" rx="6" ry="8" fill="#1A202C" />
                  <ellipse cx="100" cy="115" rx="4" ry="5" fill="#FF9EAA" opacity="0.6" />
                  <ellipse cx="98" cy="110" rx="2" ry="2" fill="#FFFFFF" opacity="0.5" />
                </>
              ) : mood === "proud" ? (
                <>
                  {/* Confident smile */}
                  <path d="M 84 110 Q 100 118 116 110" stroke="#1A202C" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  <path d="M 84 109 L 89 109" stroke="#1A202C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 111 109 L 116 109" stroke="#1A202C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </>
              ) : mood === "shy" ? (
                <>
                  {/* Small shy smile */}
                  <path d="M 88 112 Q 100 117 112 112" stroke="#1A202C" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <ellipse cx="100" cy="115" rx="8" ry="3" fill="#FFB3C1" opacity="0.3" />
                </>
              ) : mood === "confused" ? (
                <>
                  {/* Wavy confused mouth */}
                  <path d="M 84 112 Q 92 115 100 112 Q 108 109 116 112" stroke="#1A202C" strokeWidth="3" fill="none" strokeLinecap="round" />
                </>
              ) : mood === "hungry" ? (
                <>
                  {/* Drooling hungry mouth */}
                  <ellipse cx="100" cy="114" rx="8" ry="9" fill="#1A202C" />
                  <ellipse cx="100" cy="117" rx="5" ry="6" fill="#FF9EAA" />
                  <ellipse cx="98" cy="112" rx="2" ry="2" fill="#FFFFFF" opacity="0.5" />
                  <path d="M 82 110 Q 90 116 98 110" stroke="#1A202C" strokeWidth="3" fill="none" strokeLinecap="round" />
                  {/* Drool drop */}
                  <ellipse cx="114" cy="125" rx="2" ry="3" fill="#7FD4FF" opacity="0.6" />
                </>
              ) : mood === "playful" ? (
                <>
                  {/* Cheeky grin */}
                  <path d="M 82 110 Q 90 118 100 115 Q 110 113 118 110" stroke="#1A202C" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  <path d="M 84 112 Q 100 117 116 112" stroke="#000000" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.1" />
                </>
              ) : mood === "calm" ? (
                <>
                  {/* Peaceful smile */}
                  <path d="M 88 112 Q 100 118 112 112" stroke="#1A202C" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M 90 113 Q 100 117 110 113" stroke="#000000" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.1" />
                </>
              ) : mood === "sick" ? (
                <>
                  {/* Sick frown */}
                  <path d="M 88 118 Q 100 112 112 118" stroke="#1A202C" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  <path d="M 90 119 Q 100 115 110 119" stroke="#000000" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.1" />
                  <ellipse cx="148" cy="80" rx="11" ry="13" fill="#FF6B6B" opacity="0.4" />
                </>
              ) : mood === "dirty" ? (
                <>
                  <path d="M 88 113 Q 100 117 112 113" stroke="#1A202C" strokeWidth="3" fill="none" strokeLinecap="round" />
                  {/* Dirt marks */}
                  <ellipse cx="120" cy="145" rx="10" ry="8" fill="#8B7355" opacity="0.5" />
                  <ellipse cx="118" cy="143" rx="4" ry="3" fill="#6D5A45" opacity="0.4" />
                  <ellipse cx="64" cy="155" rx="8" ry="7" fill="#8B7355" opacity="0.45" />
                  <circle cx="140" cy="128" r="5" fill="#8B7355" opacity="0.4" />
                  <ellipse cx="75" cy="95" rx="6" ry="5" fill="#8B7355" opacity="0.35" />
                </>
              ) : (
                <>
                  <path d="M 88 113 Q 100 119 112 113" stroke="#1A202C" strokeWidth="3" fill="none" strokeLinecap="round" />
                </>
              )}
            </g>

            {/* Mood-specific decorations and effects */}
            {mood === "excited" && (
              <>
                {/* Celebration sparkles */}
                <motion.g
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <circle cx="145" cy="65" r="5" fill="#FFD166" opacity="0.8" />
                  <circle cx="155" cy="72" r="4" fill="#FFD166" opacity="0.7" />
                  <circle cx="55" cy="65" r="5" fill="#FFD166" opacity="0.8" />
                  <circle cx="45" cy="72" r="4" fill="#FFD166" opacity="0.7" />
                </motion.g>
                <path d="M 148 60 L 149 63 L 152 63 L 150 65 L 151 68 L 148 66 L 145 68 L 146 65 L 144 63 L 147 63 Z" fill="#FFF" opacity="0.9" />
                <path d="M 52 60 L 53 63 L 56 63 L 54 65 L 55 68 L 52 66 L 49 68 L 50 65 L 48 63 L 51 63 Z" fill="#FFF" opacity="0.9" />
              </>
            )}

            {mood === "playful" && (
              <>
                {/* Bouncy hearts */}
                <motion.g
                  animate={{ y: [0, -5, 0], rotate: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <path d="M 155 70 Q 155 65 160 65 Q 165 65 165 70 Q 165 75 160 80 Q 155 75 155 70 Z" fill="#FF6B9D" opacity="0.6" />
                  <path d="M 45 70 Q 45 65 40 65 Q 35 65 35 70 Q 35 75 40 80 Q 45 75 45 70 Z" fill="#FF6B9D" opacity="0.6" />
                </motion.g>
              </>
            )}

            {mood === "curious" && (
              <>
                {/* Question mark */}
                <text x="145" y="62" fill="#8B7FFF" fontSize="24" fontFamily="Arial, sans-serif" fontWeight="bold">?</text>
              </>
            )}

            {mood === "proud" && (
              <>
                {/* Stars of achievement */}
                <path d="M 150 55 L 152 62 L 159 62 L 154 66 L 156 73 L 150 69 L 144 73 L 146 66 L 141 62 L 148 62 Z" fill="#FFD166" opacity="0.8" />
                <circle cx="150" cy="50" r="3" fill="#FFF" opacity="0.7" />
              </>
            )}

            {mood === "learning" && (
              <>
                {/* Floating lightbulb */}
                <motion.g
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <circle cx="150" cy="58" r="10" fill="#FFD166" opacity="0.3" />
                  <circle cx="150" cy="56" r="8" fill="#FFD166" opacity="0.6" />
                  <path d="M 150 52 L 150 48 M 145 54 L 142 51 M 155 54 L 158 51 M 145 60 L 142 63 M 155 60 L 158 63" stroke="#FFD166" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                </motion.g>
              </>
            )}

            {(mood === "calm" || mood === "sleepy") && (
              <>
                {/* Peaceful aura */}
                <motion.circle
                  cx="100"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#B3A4FF"
                  strokeWidth="1"
                  opacity="0.2"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.05, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </>
            )}

            {/* Listening indicator */}
            {isListening && (
              <>
                <motion.g
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <circle cx="100" cy="80" r="75" fill="none" stroke="#8B7FFF" strokeWidth="2" opacity="0.4" />
                  <circle cx="100" cy="80" r="70" fill="none" stroke="#8B7FFF" strokeWidth="2" opacity="0.3" />
                </motion.g>
                {/* Microphone indicator */}
                <circle cx="30" cy="90" r="8" fill="#8B7FFF" opacity="0.8" />
                <path d="M 30 86 L 30 94 M 27 89 L 33 89 M 27 91 L 33 91" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}

            {/* 3D rim lighting */}
            <ellipse cx="110" cy="78" rx="52" ry="50" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.15" />
            <ellipse cx="110" cy="144" rx="48" ry="42" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.1" />
          </g>
        </svg>

        {/* Bath bubbles */}
        {showBubbles && (
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-white/70 rounded-full"
                style={{
                  left: `${15 + Math.random() * 70}%`,
                  bottom: "5%"
                }}
                animate={{
                  y: [-120, -250],
                  x: [0, (Math.random() - 0.5) * 40],
                  opacity: [0.7, 0],
                  scale: [1, 1.8]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.35,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}

        {/* Tap effects */}
        {tapEffects.map(effect => (
          <motion.div
            key={effect.id}
            className="absolute pointer-events-none"
            style={{
              left: `${effect.x}%`,
              top: `${effect.y}%`,
              transform: "translate(-50%, -50%)"
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
              y: [0, -30, -60]
            }}
            transition={{
              duration: 1,
              ease: "easeOut"
            }}
          >
            {effect.type === "heart" && (
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FF6B9D" />
              </svg>
            )}
            {effect.type === "star" && (
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFD166" />
              </svg>
            )}
            {effect.type === "sparkle" && (
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M12 0l2 10 10 2-10 2-2 10-2-10L0 12l10-2z" fill="#8B7FFF" opacity="0.8" />
              </svg>
            )}
            {effect.type === "ow" && (
              <div className="text-red-500 font-bold text-lg">OW!</div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}