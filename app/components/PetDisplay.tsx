import { motion, useAnimation, AnimatePresence } from "motion/react";
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

type BodyZone = "left_ear" | "right_ear" | "left_eye" | "right_eye" | "nose" | "mouth" | "belly" | "left_arm" | "right_arm" | "feet" | "body";

type ActionState = 
  | "idle"
  | "blinking"
  | "yawning"
  | "scratching"
  | "looking_around"
  | "falling_asleep"
  | "waking_up"
  | "giggling"
  | "spinning"
  | "dizzy"
  | "hurt"
  | "excited"
  | "sneezing"
  | "hiccuping"
  | "stretching"
  | "dancing"
  | "scared"
  | "nose_honk"
  | "ear_flick"
  | "eye_poke"
  | "belly_tickle"
  | "dragging"
  | "thrown"
  | "squished"
  | "stretched"
  | "listening";

type EmotionalState = "happy" | "content" | "bored" | "needy" | "grumpy" | "overexcited";

type TapEffectType = 
  | "heart"
  | "star"
  | "sparkle"
  | "ow"
  | "zzz"
  | "music_note"
  | "laugh"
  | "sweat"
  | "angry"
  | "honk"
  | "question"
  | "love";

interface TapEffect {
  id: number;
  x: number;
  y: number;
  type: TapEffectType;
}

interface PetDisplayProps {
  mood?: PetMood;
  size?: "sm" | "md" | "lg";
  showBubbles?: boolean;
  isListening?: boolean;
  onInteraction?: (zone: BodyZone, action: ActionState) => void;
}

export function PetDisplay({ mood = "happy", size = "lg", showBubbles = false, isListening = false, onInteraction }: PetDisplayProps) {
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-56 h-56"
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const animationControls = useAnimation();

  // State management
  const [actionState, setActionState] = useState<ActionState>("idle");
  const [emotionalState, setEmotionalState] = useState<EmotionalState>("content");
  const [moodPoints, setMoodPoints] = useState(50);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());
  const [interactionCount, setInteractionCount] = useState(0);
  const [consecutiveHurts, setConsecutiveHurts] = useState(0);
  const [isBeingDragged, setIsBeingDragged] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dragVelocity, setDragVelocity] = useState({ x: 0, y: 0 });
  const [eyeTarget, setEyeTarget] = useState({ x: 50, y: 50 });
  const [squishScale, setSquishScale] = useState({ x: 1, y: 1 });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAttentionBubble, setShowAttentionBubble] = useState(false);
  const [attentionMessage, setAttentionMessage] = useState("");
  const [tapCount, setTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [tapEffects, setTapEffects] = useState<TapEffect[]>([]);

  // Refs for timers and tracking
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressLevel = useRef(0);
  const lastPinchDistance = useRef<number | null>(null);
  const tickleMoves = useRef<number[]>([]);
  const dragHistory = useRef<Array<{ x: number; y: number; time: number }>>([]);
  const pointerMoveRaf = useRef<number | null>(null);

  // Get body zone from tap position
  const getBodyZone = (x: number, y: number): BodyZone => {
    if (x > 20 && x < 42 && y > 8 && y < 28) return "left_ear";
    if (x > 58 && x < 80 && y > 8 && y < 28) return "right_ear";
    if (x > 28 && x < 48 && y > 28 && y < 52) return "left_eye";
    if (x > 52 && x < 72 && y > 28 && y < 52) return "right_eye";
    if (x > 42 && x < 58 && y > 42 && y < 52) return "nose";
    if (x > 30 && x < 70 && y > 52 && y < 62) return "mouth";
    if (x > 25 && x < 75 && y > 60 && y < 78) return "belly";
    if (x > 10 && x < 30 && y > 55 && y < 80) return "left_arm";
    if (x > 70 && x < 90 && y > 55 && y < 80) return "right_arm";
    if (x > 20 && x < 80 && y > 78 && y < 100) return "feet";
    return "body";
  };

  // Add tap effect with type
  const addTapEffect = (x: number, y: number, type: TapEffectType) => {
    const id = Date.now() + Math.random();
    setTapEffects(prev => [...prev, { id, x, y, type }]);
    setTimeout(() => {
      setTapEffects(prev => prev.filter(effect => effect.id !== id));
    }, 1000);
  };

  // Update mood points
  const updateMoodPoints = (delta: number) => {
    setMoodPoints(prev => Math.max(0, Math.min(100, prev + delta)));
  };

  // Reset action state after duration
  useEffect(() => {
    if (actionState === "idle" || actionState === "blinking" || actionState === "listening") return;
    
    const durations: Record<string, number> = {
      spinning: 800,
      dizzy: 2000,
      hurt: 1200,
      giggling: 1000,
      belly_tickle: 1500,
      nose_honk: 600,
      ear_flick: 400,
      eye_poke: 800,
      sneezing: 700,
      yawning: 1200,
      stretching: 1000,
      scratching: 1200,
      looking_around: 2000,
      waking_up: 800,
      scared: 1500,
      excited: 1000,
      dancing: 2000,
      hiccuping: 1000,
      thrown: 1500,
    };
    
    const duration = durations[actionState] || 1000;
    const timer = setTimeout(() => {
      setActionState("idle");
    }, duration);
    
    return () => clearTimeout(timer);
  }, [actionState]);

  // Reset tap count
  useEffect(() => {
    if (tapCount > 0) {
      const timer = setTimeout(() => {
        setTapCount(0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [tapCount, lastTapTime]);

  // Handle tap/click
  const handleTap = (event: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current || isBeingDragged) return;
    
    const now = Date.now();
    const timeSinceLast = now - lastTapTime;
    
    const rect = containerRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;
    
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
    
    const zone = getBodyZone(x, y);
    
    setLastTapTime(now);
    setLastInteractionTime(now);
    setInteractionCount(prev => prev + 1);
    
    // Count rapid taps
    if (timeSinceLast < 500) {
      setTapCount(prev => prev + 1);
    } else {
      setTapCount(1);
    }
    
    // Handle zone-specific reactions
    handleZoneInteraction(zone, x, y, tapCount + 1, timeSinceLast < 500);
    
    // Callback
    if (onInteraction) {
      onInteraction(zone, actionState);
    }
  };

  // Handle zone interactions
  const handleZoneInteraction = (zone: BodyZone, x: number, y: number, currentTapCount: number, isRapid: boolean) => {
    // Too many rapid taps - hurt
    if (currentTapCount >= 5) {
      setActionState("hurt");
      setRotation(prev => prev + 720);
      addTapEffect(x, y, "ow");
      updateMoodPoints(-10);
      setConsecutiveHurts(prev => prev + 1);
      return;
    }
    
    // Rapid taps (3-4)
    if (currentTapCount >= 3) {
      if (zone === "belly") {
        setActionState("belly_tickle");
        addTapEffect(x, y, "laugh");
        addTapEffect(x - 10, y - 10, "laugh");
        addTapEffect(x + 10, y - 10, "laugh");
        updateMoodPoints(8);
      } else if (zone === "nose") {
        setActionState("sneezing");
        addTapEffect(x, y, "honk");
        addTapEffect(x + 10, y - 10, "honk");
        updateMoodPoints(3);
      } else if (zone === "left_eye" || zone === "right_eye") {
        setActionState("eye_poke");
        addTapEffect(x, y, "ow");
        updateMoodPoints(-8);
      } else {
        setActionState("spinning");
        setRotation(prev => prev + 360);
        addTapEffect(x, y, "star");
        addTapEffect(x + 10, y - 10, "star");
        updateMoodPoints(5);
      }
      return;
    }
    
    // Single tap zone reactions
    switch (zone) {
      case "left_ear":
      case "right_ear":
        setActionState("ear_flick");
        addTapEffect(x, y, "sparkle");
        updateMoodPoints(2);
        break;
        
      case "left_eye":
      case "right_eye":
        setActionState("eye_poke");
        addTapEffect(x, y, "ow");
        updateMoodPoints(-5);
        break;
        
      case "nose":
        setActionState("nose_honk");
        addTapEffect(x, y, "honk");
        updateMoodPoints(3);
        break;
        
      case "mouth":
        addTapEffect(x, y, "music_note");
        setRotation(prev => prev + (Math.random() > 0.5 ? 10 : -10));
        updateMoodPoints(2);
        break;
        
      case "belly":
        setActionState("giggling");
        addTapEffect(x, y, "heart");
        addTapEffect(x - 15, y, "heart");
        addTapEffect(x + 15, y, "heart");
        updateMoodPoints(6);
        break;
        
      case "left_arm":
      case "right_arm":
        addTapEffect(x, y, "sparkle");
        setRotation(prev => prev + (Math.random() > 0.5 ? 15 : -15));
        updateMoodPoints(2);
        break;
        
      case "feet":
        addTapEffect(x, y, "star");
        setRotation(prev => prev + (Math.random() > 0.5 ? 15 : -15));
        updateMoodPoints(3);
        break;
        
      default:
        addTapEffect(x, y, "heart");
        setRotation(prev => prev + (Math.random() > 0.5 ? 10 : -10));
        updateMoodPoints(1);
    }
  };

  // Drag handlers
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!containerRef.current) return;
    
    setIsBeingDragged(true);
    setActionState("dragging");
    dragHistory.current = [];
    
    const rect = containerRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;
    
    if ("touches" in e) {
      const touch = e.touches[0];
      if (!touch) return;
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    
    dragHistory.current.push({ x, y, time: Date.now() });
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isBeingDragged || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;
    
    if ("touches" in e) {
      const touch = e.touches[0];
      if (!touch) return;
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = ((clientX - rect.left) / rect.width) * 100 - 50;
    const y = ((clientY - rect.top) / rect.height) * 100 - 50;
    
    setDragPosition({ x: x * 0.3, y: y * 0.3 }); // Constrain drag range
    
    dragHistory.current.push({ x, y, time: Date.now() });
    if (dragHistory.current.length > 5) {
      dragHistory.current.shift();
    }
    
    // Calculate velocity
    if (dragHistory.current.length >= 2) {
      const latest = dragHistory.current[dragHistory.current.length - 1];
      const prev = dragHistory.current[dragHistory.current.length - 2];
      const dt = (latest.time - prev.time) / 16; // normalize to ~60fps
      const vx = (latest.x - prev.x) / Math.max(dt, 1);
      const vy = (latest.y - prev.y) / Math.max(dt, 1);
      setDragVelocity({ x: vx, y: vy });
    }
  };

  const handleDragEnd = () => {
    if (!isBeingDragged) return;
    
    setIsBeingDragged(false);
    setLastInteractionTime(Date.now());
    
    const speed = Math.abs(dragVelocity.x) + Math.abs(dragVelocity.y);
    
    if (speed > 8) {
      // Thrown
      setActionState("thrown");
      
      // Animate throw arc
      const throwX = dragPosition.x + dragVelocity.x * 3;
      const throwY = dragPosition.y + dragVelocity.y * 3;
      
      animationControls.start({
        x: [dragPosition.x, throwX, 0],
        y: [dragPosition.y, throwY, 0],
        rotate: [0, 360, 0],
        transition: { duration: 1.5, times: [0, 0.5, 1], ease: "easeOut" }
      }).then(() => {
        setDragPosition({ x: 0, y: 0 });
        setActionState("dizzy");
        addTapEffect(50, 50, "star");
        addTapEffect(60, 40, "star");
        addTapEffect(40, 40, "star");
      });
    } else {
      // Gentle spring back
      setDragPosition({ x: 0, y: 0 });
      setActionState("idle");
    }
    
    dragHistory.current = [];
  };

  // Long press handlers
  const handlePressStart = (e: React.TouchEvent | React.MouseEvent) => {
    longPressLevel.current = 0;
    
    longPressTimer.current = setTimeout(() => {
      longPressLevel.current = 1;
      setActionState("scared");
      
      longPressTimer.current = setTimeout(() => {
        longPressLevel.current = 2;
        addTapEffect(50, 50, "sweat");
        
        longPressTimer.current = setTimeout(() => {
          longPressLevel.current = 3;
          setDragPosition({ x: 60, y: -40 });
          addTapEffect(50, 50, "sweat");
          updateMoodPoints(-5);
        }, 1500);
      }, 1000);
    }, 500);
  };

  const handlePressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    
    if (longPressLevel.current >= 3) {
      setTimeout(() => {
        setDragPosition({ x: 0, y: 0 });
        setActionState("idle");
      }, 1000);
    }
    
    longPressLevel.current = 0;
  };

  // Pointer move for eye tracking
  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    if (pointerMoveRaf.current) return; // Throttle to ~60fps
    
    pointerMoveRaf.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      let clientX: number, clientY: number;
      
      if ("touches" in e) {
        const touch = e.touches[0];
        if (!touch) {
          pointerMoveRaf.current = null;
          return;
        }
        clientX = touch.clientX;
        clientY = touch.clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      
      setEyeTarget({ x, y });
      
      pointerMoveRaf.current = null;
    });
  };

  // Pinch gesture
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (lastPinchDistance.current !== null) {
        const delta = distance - lastPinchDistance.current;
        
        if (delta < -3) {
          setSquishScale(prev => ({
            x: Math.min(1.4, prev.x + 0.05),
            y: Math.max(0.7, prev.y - 0.05)
          }));
          setActionState("squished");
          addTapEffect(50, 50, "star");
        } else if (delta > 3) {
          setSquishScale(prev => ({
            x: Math.max(0.7, prev.x - 0.05),
            y: Math.min(1.4, prev.y + 0.05)
          }));
          setActionState("stretched");
          addTapEffect(50, 50, "sparkle");
        }
      }
      
      lastPinchDistance.current = distance;
    } else {
      handleDragMove(e);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      lastPinchDistance.current = null;
      setSquishScale({ x: 1, y: 1 });
      if (actionState === "squished" || actionState === "stretched") {
        setActionState("idle");
      }
    }
    
    if (e.touches.length === 0) {
      handleDragEnd();
      handlePressEnd();
    }
  };

  // Update emotional state based on mood points
  useEffect(() => {
    if (moodPoints > 80) setEmotionalState("overexcited");
    else if (moodPoints > 60) setEmotionalState("happy");
    else if (moodPoints > 40) setEmotionalState("content");
    else if (moodPoints > 25) setEmotionalState("bored");
    else if (moodPoints > 10) setEmotionalState("needy");
    else setEmotionalState("grumpy");
    
    // Mood decays over time
    const decayTimer = setInterval(() => {
      setMoodPoints(prev => Math.max(0, prev - 1));
    }, 10000); // -1 point every 10 seconds
    
    return () => clearInterval(decayTimer);
  }, [moodPoints]);

  // Blinking cycle
  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 2500 + Math.random() * 2500;
      blinkTimer.current = setTimeout(() => {
        if (actionState === "idle" || actionState === "listening") {
          setActionState("blinking");
          setTimeout(() => {
            setActionState("idle");
            scheduleBlink();
          }, 200);
        } else {
          scheduleBlink();
        }
      }, delay);
    };
    
    scheduleBlink();
    
    return () => {
      if (blinkTimer.current) clearTimeout(blinkTimer.current);
    };
  }, [actionState]);

  // Idle behavior system
  useEffect(() => {
    const scheduleIdleBehaviour = () => {
      const timeSinceInteraction = Date.now() - lastInteractionTime;
      
      if (timeSinceInteraction < 5000) {
        idleTimer.current = setTimeout(scheduleIdleBehaviour, 1000);
        return;
      }
      
      if (timeSinceInteraction < 15000) {
        // 5–15 seconds: subtle idle animations
        if (actionState === "idle") {
          const behaviours: ActionState[] = ["looking_around", "scratching", "yawning"];
          const chosen = behaviours[Math.floor(Math.random() * behaviours.length)];
          setActionState(chosen);
        }
        idleTimer.current = setTimeout(scheduleIdleBehaviour, 4000);
        return;
      }
      
      if (timeSinceInteraction < 30000) {
        // 15–30 seconds: bored behaviours
        if (actionState === "idle") {
          setActionState("looking_around");
          setShowAttentionBubble(true);
          const messages = [
            "Play with me! 🥺",
            "I'm bored... 😴", 
            "Tap me! 👆",
            "Hello?? 👋",
            "I miss you 💔",
            "Let's practise English! 📚",
          ];
          setAttentionMessage(messages[Math.floor(Math.random() * messages.length)]);
          setTimeout(() => setShowAttentionBubble(false), 3000);
        }
        idleTimer.current = setTimeout(scheduleIdleBehaviour, 6000);
        return;
      }
      
      // 30+ seconds: very bored / falling asleep
      if (actionState === "idle") {
        setActionState("falling_asleep");
        setEmotionalState("bored");
      }
      idleTimer.current = setTimeout(scheduleIdleBehaviour, 5000);
    };
    
    scheduleIdleBehaviour();
    
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [lastInteractionTime, actionState]);

  // Listening mode visual effects
  useEffect(() => {
    if (isListening) {
      setActionState("listening");
      setIsSpeaking(true);
    } else {
      if (actionState === "listening") {
        setActionState("idle");
      }
      setIsSpeaking(false);
    }
  }, [isListening]);

  // Dynamic animation based on action state
  const getMoodAnimation = () => {
    if (isBeingDragged) {
      return {
        x: dragPosition.x,
        y: dragPosition.y,
        rotate: dragVelocity.x * 2,
      };
    }

    if (actionState === "spinning") {
      return { 
        y: [0, -30, 0],
        rotate: [rotation - 360, rotation],
        scale: [1, 1.1, 1]
      };
    }
    
    if (actionState === "dizzy") {
      return { 
        rotate: [rotation - 720, rotation],
        x: [-5, 5, -5, 5, 0],
        y: [0, -5, 0]
      };
    }
    
    if (actionState === "hurt") {
      return { 
        x: [-10, 10, -8, 8, -5, 5, 0],
        rotate: [rotation - 10, rotation + 10, rotation],
        scale: [1, 0.95, 1]
      };
    }
    
    if (actionState === "giggling" || actionState === "belly_tickle") {
      return { 
        rotate: [rotation - 5, rotation + 5, rotation - 5, rotation + 5, rotation],
        scale: [1, 1.05, 1, 1.05, 1],
        y: [0, -10, 0, -5, 0]
      };
    }

    if (actionState === "nose_honk") {
      return {
        scale: [1, 0.95, 1.05, 1],
        y: [0, -8, 0]
      };
    }

    if (actionState === "ear_flick") {
      return {
        rotate: [rotation, rotation - 15, rotation + 15, rotation],
        y: [0, -5, 0]
      };
    }

    if (actionState === "eye_poke") {
      return {
        x: [-5, 5, -5, 5, 0],
        scale: [1, 0.98, 1]
      };
    }

    if (actionState === "sneezing") {
      return {
        y: [0, -3, 5, 0],
        rotate: [rotation, rotation - 5, rotation + 5, rotation],
        scale: [1, 0.98, 1.02, 1]
      };
    }

    if (actionState === "yawning") {
      return {
        scale: [1, 1.05, 1.05, 1],
        y: [0, -3, -3, 0]
      };
    }

    if (actionState === "stretching") {
      return {
        scaleY: [1, 1.15, 1],
        y: [0, -8, 0]
      };
    }

    if (actionState === "scratching") {
      return {
        rotate: [rotation, rotation - 3, rotation + 3, rotation - 3, rotation + 3, rotation],
        x: [-2, 2, -2, 2, 0]
      };
    }

    if (actionState === "looking_around") {
      return {
        rotate: [rotation, rotation - 8, rotation - 8, rotation + 8, rotation + 8, rotation],
        x: [0, -3, -3, 3, 3, 0]
      };
    }

    if (actionState === "falling_asleep") {
      return {
        rotate: [rotation, rotation + 15],
        y: [0, 5],
        scale: [1, 0.98]
      };
    }

    if (actionState === "waking_up") {
      return {
        y: [-10, 0],
        rotate: [rotation - 15, rotation + 15, rotation],
        scale: [0.95, 1.05, 1]
      };
    }

    if (actionState === "scared") {
      return {
        y: [0, -15, -12],
        scale: [1, 0.95, 0.95],
        x: [-2, 2, -2, 2, 0]
      };
    }

    if (actionState === "excited") {
      return {
        y: [0, -15, -10, -15, 0],
        rotate: [rotation - 5, rotation + 5, rotation - 5, rotation + 5, rotation],
        scale: [1, 1.08, 1, 1.08, 1]
      };
    }

    if (actionState === "listening") {
      return {
        y: [0, -5, 0],
        scale: [1, 1.02, 1]
      };
    }

    // Default mood-based animations
    switch (mood) {
      case "excited":
      case "playful":
        return { y: [0, -12, 0, -8, 0], rotate: [rotation, rotation - 3, rotation + 3, rotation - 2, rotation] };
      case "sleepy":
        return { y: [0, 3, 0], rotate: [rotation, rotation - 2, rotation] };
      case "curious":
        return { y: [0, -5, 0], rotate: [rotation - 8, rotation - 10, rotation - 8] };
      case "proud":
        return { y: [0, -6, 0], scale: [1, 1.02, 1] };
      case "shy":
        return { y: [0, 2, 0], rotate: [rotation + 5, rotation + 7, rotation + 5], x: [0, -2, 0] };
      case "confused":
        return { y: [0, -3, 0], rotate: [rotation + 8, rotation + 10, rotation + 8] };
      default:
        return { y: [0, -8, 0], rotate: rotation };
    }
  };

  const animationDuration = 
    actionState === "spinning" ? 0.8 :
    actionState === "dizzy" ? 2 :
    actionState === "hurt" ? 1.2 :
    actionState === "giggling" || actionState === "belly_tickle" ? 1 :
    actionState === "nose_honk" ? 0.6 :
    actionState === "ear_flick" ? 0.4 :
    actionState === "eye_poke" ? 0.8 :
    actionState === "sneezing" ? 0.7 :
    actionState === "yawning" ? 1.2 :
    actionState === "stretching" ? 1 :
    actionState === "scratching" ? 1.2 :
    actionState === "looking_around" ? 2 :
    actionState === "waking_up" ? 0.8 :
    actionState === "scared" ? 1.5 :
    actionState === "excited" ? 1 :
    actionState === "listening" ? 1.5 :
    actionState === "falling_asleep" ? 3 :
    mood === "excited" || mood === "playful" ? 1.5 : 2;

  // Get current visual mood based on action state
  const getCurrentMood = (): PetMood => {
    if (actionState === "dizzy") return "confused";
    if (actionState === "hurt" || actionState === "eye_poke") return "sick";
    if (actionState === "giggling" || actionState === "belly_tickle" || actionState === "excited") return "excited";
    if (actionState === "scared") return "shy";
    if (actionState === "falling_asleep") return "sleepy";
    if (actionState === "listening") return "learning";
    return mood;
  };

  const currentMood = getCurrentMood();

  // Eye tracking calculations
  const shouldTrackEyes = actionState === "idle" || actionState === "listening" || actionState === "blinking";
  
  const leftEyeCenter = { x: 75, y: 86 };
  const rightEyeCenter = { x: 125, y: 86 };
  const maxPupilOffset = 5;
  
  const leftPupilOffset = shouldTrackEyes ? {
    x: ((eyeTarget.x - 50) / 50) * maxPupilOffset,
    y: ((eyeTarget.y - 50) / 50) * maxPupilOffset,
  } : { x: 0, y: 0 };
  
  const rightPupilOffset = shouldTrackEyes ? {
    x: ((eyeTarget.x - 50) / 50) * maxPupilOffset,
    y: ((eyeTarget.y - 50) / 50) * maxPupilOffset,
  } : { x: 0, y: 0 };

  // Body transform based on mood
  const getBodyTransform = () => {
    switch (currentMood) {
      case "curious": return "translate(-8, 0)";
      case "shy": return "translate(5, 2)";
      case "proud": return "translate(0, -3)";
      case "sleepy": return "translate(0, 3)";
      case "playful": return "translate(-3, 0)";
      default: return "translate(0, 0)";
    }
  };

  return (
    <div 
      className="relative flex items-center justify-center" 
      ref={containerRef}
      onMouseMove={handlePointerMove}
      onTouchMove={handleTouchMove}
      style={{ willChange: "transform" }}
    >
      <motion.div
        className={`${sizeClasses[size]} relative cursor-pointer`}
        animate={getMoodAnimation()}
        transition={{
          duration: animationDuration,
          repeat: isBeingDragged ? 0 : Infinity,
          ease: "easeInOut"
        }}
        onClick={handleTap}
        onTouchStart={(e) => {
          handlePressStart(e);
          handleDragStart(e);
        }}
        onTouchEnd={handleTouchEnd}
        onMouseDown={(e) => {
          handlePressStart(e);
          handleDragStart(e);
        }}
        onMouseUp={() => {
          handleDragEnd();
          handlePressEnd();
        }}
        onMouseMove={handleDragMove}
        style={{
          scaleX: squishScale.x,
          scaleY: squishScale.y,
        }}
      >
        {/* Interactive Virtual Pet Panda */}
        <motion.svg 
          viewBox="0 0 200 220" 
          className="w-full h-full drop-shadow-2xl"
          animate={{ scale: [1, 1.012, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <defs>
            {/* Gradients */}
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

            {/* Back Legs */}
            <ellipse cx="70" cy="185" rx="23" ry="19" fill="url(#pawGradient)" />
            <ellipse cx="130" cy="185" rx="23" ry="19" fill="url(#pawGradient)" />
            <ellipse cx="70" cy="188" rx="11" ry="8" fill="#5A6978" />
            <ellipse cx="130" cy="188" rx="11" ry="8" fill="#5A6978" />

            {/* Body with breathing */}
            <motion.ellipse 
              cx="100" 
              cy="145" 
              rx="58" 
              ry="50" 
              fill="url(#bodyGradient)"
              animate={{ ry: actionState === "falling_asleep" ? [50, 52, 50] : [50, 51, 50] }}
              transition={{
                duration: actionState === "falling_asleep" ? 3 : 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Belly patch */}
            <ellipse cx="100" cy="150" rx="40" ry="34" fill="url(#bellyGradient)" />

            {/* Front Arms - mood-based positioning */}
            {currentMood === "excited" || currentMood === "playful" ? (
              <>
                <ellipse cx="58" cy="125" rx="18" ry="28" fill="url(#pawGradient)" transform="rotate(-25 58 125)" />
                <ellipse cx="142" cy="125" rx="18" ry="28" fill="url(#pawGradient)" transform="rotate(25 142 125)" />
                <ellipse cx="58" cy="132" rx="10" ry="13" fill="#5A6978" />
                <ellipse cx="142" cy="132" rx="10" ry="13" fill="#5A6978" />
              </>
            ) : actionState === "scratching" ? (
              <>
                <ellipse cx="58" cy="138" rx="18" ry="24" fill="url(#pawGradient)" />
                <motion.ellipse 
                  cx="145" 
                  cy="90" 
                  rx="18" 
                  ry="26" 
                  fill="url(#pawGradient)" 
                  transform="rotate(15 145 90)"
                  animate={{ rotate: [15, 20, 15, 20, 15] }}
                  transition={{ duration: 0.3, repeat: 4 }}
                />
              </>
            ) : actionState === "stretching" ? (
              <>
                <motion.ellipse 
                  cx="40" 
                  cy="125" 
                  rx="18" 
                  ry="28" 
                  fill="url(#pawGradient)" 
                  animate={{ cx: [60, 40, 60] }}
                  transition={{ duration: 1 }}
                />
                <motion.ellipse 
                  cx="160" 
                  cy="125" 
                  rx="18" 
                  ry="28" 
                  fill="url(#pawGradient)"
                  animate={{ cx: [140, 160, 140] }}
                  transition={{ duration: 1 }}
                />
              </>
            ) : currentMood === "shy" ? (
              <>
                <ellipse cx="65" cy="100" rx="18" ry="24" fill="url(#pawGradient)" transform="rotate(-15 65 100)" />
                <ellipse cx="135" cy="135" rx="18" ry="24" fill="url(#pawGradient)" />
              </>
            ) : currentMood === "curious" ? (
              <>
                <ellipse cx="58" cy="138" rx="18" ry="24" fill="url(#pawGradient)" />
                <ellipse cx="145" cy="120" rx="18" ry="26" fill="url(#pawGradient)" transform="rotate(15 145 120)" />
              </>
            ) : (
              <>
                <ellipse cx="60" cy="140" rx="19" ry="25" fill="url(#pawGradient)" />
                <ellipse cx="140" cy="140" rx="19" ry="25" fill="url(#pawGradient)" />
                <ellipse cx="60" cy="147" rx="10" ry="13" fill="#5A6978" />
                <ellipse cx="140" cy="147" rx="10" ry="13" fill="#5A6978" />
              </>
            )}

            {/* Head */}
            <g transform={currentMood === "curious" ? "rotate(-12 100 80)" : currentMood === "confused" ? "rotate(12 100 80)" : currentMood === "shy" ? "rotate(8 100 80)" : ""}>
              <ellipse cx="100" cy="80" rx="62" ry="60" fill="url(#headGradient)" />

              {/* Ears - mood-based */}
              {currentMood === "curious" || currentMood === "learning" || actionState === "listening" ? (
                <>
                  <ellipse cx="58" cy="42" rx="21" ry="25" fill="url(#earGradient)" transform="rotate(-10 58 42)" />
                  <ellipse cx="142" cy="42" rx="21" ry="25" fill="url(#earGradient)" transform="rotate(10 142 42)" />
                  <ellipse cx="58" cy="51" rx="12" ry="13" fill="#5A6978" />
                  <ellipse cx="142" cy="51" rx="12" ry="13" fill="#5A6978" />
                </>
              ) : actionState === "ear_flick" ? (
                <>
                  <motion.ellipse 
                    cx="58" 
                    cy="42" 
                    rx="21" 
                    ry="25" 
                    fill="url(#earGradient)"
                    animate={{ ry: [25, 15, 25] }}
                    transition={{ duration: 0.4 }}
                  />
                  <ellipse cx="142" cy="48" rx="21" ry="24" fill="url(#earGradient)" />
                  <ellipse cx="58" cy="51" rx="12" ry="13" fill="#5A6978" />
                  <ellipse cx="142" cy="51" rx="12" ry="13" fill="#5A6978" />
                </>
              ) : (
                <>
                  <ellipse cx="58" cy="48" rx="21" ry="24" fill="url(#earGradient)" />
                  <ellipse cx="142" cy="48" rx="21" ry="24" fill="url(#earGradient)" />
                  <ellipse cx="58" cy="51" rx="12" ry="13" fill="#5A6978" />
                  <ellipse cx="142" cy="51" rx="12" ry="13" fill="#5A6978" />
                </>
              )}

              {/* Eye patches */}
              <ellipse cx="75" cy="83" rx="20" ry="24" fill="url(#eyePatchGradient)" />
              <ellipse cx="125" cy="83" rx="20" ry="24" fill="url(#eyePatchGradient)" />

              {/* EYES - Mood-based expressions */}
              {actionState === "blinking" ? (
                <>
                  <path d="M 65 83 Q 75 90 85 83" stroke="#1A202C" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                  <path d="M 115 83 Q 125 90 135 83" stroke="#1A202C" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                </>
              ) : currentMood === "sleepy" || actionState === "falling_asleep" ? (
                <>
                  <path d="M 65 83 Q 75 90 85 83" stroke="#1A202C" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                  <path d="M 115 83 Q 125 90 135 83" stroke="#1A202C" strokeWidth="4.5" fill="none" strokeLinecap="round" />
                  {actionState === "falling_asleep" && (
                    <motion.g
                      animate={{ opacity: [0.4, 0.8, 0.4], y: [0, -3, -6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <text x="145" y="68" fill="#B3A4FF" fontSize="16" fontFamily="Arial" fontWeight="bold">z</text>
                      <text x="153" y="60" fill="#B3A4FF" fontSize="13" fontFamily="Arial" fontWeight="bold" opacity="0.8">z</text>
                      <text x="160" y="54" fill="#B3A4FF" fontSize="10" fontFamily="Arial" fontWeight="bold" opacity="0.6">z</text>
                    </motion.g>
                  )}
                </>
              ) : actionState === "dizzy" ? (
                <>
                  <motion.g animate={{ rotate: [0, 360] }} transition={{ duration: 2, repeat: Infinity }}>
                    <path d="M 70 79 L 72 84 L 77 84 L 73 87 L 75 92 L 70 89 L 65 92 L 67 87 L 63 84 L 68 84 Z" fill="#FFD166" />
                    <path d="M 120 79 L 122 84 L 127 84 L 123 87 L 125 92 L 120 89 L 115 92 L 117 87 L 113 84 L 118 84 Z" fill="#FFD166" />
                  </motion.g>
                </>
              ) : currentMood === "excited" ? (
                <>
                  <ellipse cx="75" cy="84" rx="16" ry="19" fill="#FFFFFF" />
                  <ellipse cx="125" cy="84" rx="16" ry="19" fill="#FFFFFF" />
                  <path d="M 75 79 L 77 84 L 82 84 L 78 87 L 80 92 L 75 89 L 70 92 L 72 87 L 68 84 L 73 84 Z" fill="#1A202C" />
                  <path d="M 125 79 L 127 84 L 132 84 L 128 87 L 130 92 L 125 89 L 120 92 L 122 87 L 118 84 L 123 84 Z" fill="#1A202C" />
                </>
              ) : currentMood === "confused" ? (
                <>
                  <ellipse cx="75" cy="83" rx="15" ry="18" fill="#FFFFFF" />
                  <ellipse cx="125" cy="85" rx="13" ry="16" fill="#FFFFFF" />
                  <circle cx="75" cy="85" r="9" fill="#1A202C" />
                  <circle cx="125" cy="87" r="8" fill="#1A202C" />
                  <ellipse cx="71" cy="81" rx="4" ry="5" fill="url(#eyeShine)" />
                  <ellipse cx="121" cy="83" rx="3" ry="4" fill="url(#eyeShine)" />
                </>
              ) : actionState === "eye_poke" ? (
                <>
                  <path d="M 65 83 Q 75 88 85 83" stroke="#1A202C" strokeWidth="4" fill="none" strokeLinecap="round" />
                  <path d="M 115 83 Q 125 88 135 83" stroke="#1A202C" strokeWidth="4" fill="none" strokeLinecap="round" />
                </>
              ) : currentMood === "sick" ? (
                <>
                  <path d="M 70 85 Q 75 83 80 85" stroke="#1A202C" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <path d="M 120 85 Q 125 83 130 85" stroke="#1A202C" strokeWidth="3" fill="none" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <ellipse cx="75" cy="84" rx="15" ry="18" fill="#FFFFFF" />
                  <ellipse cx="125" cy="84" rx="15" ry="18" fill="#FFFFFF" />
                  <circle 
                    cx={leftEyeCenter.x + leftPupilOffset.x} 
                    cy={leftEyeCenter.y + leftPupilOffset.y} 
                    r="10" 
                    fill="#1A202C" 
                  />
                  <circle 
                    cx={rightEyeCenter.x + rightPupilOffset.x} 
                    cy={rightEyeCenter.y + rightPupilOffset.y} 
                    r="10" 
                    fill="#1A202C" 
                  />
                  <ellipse cx="71" cy="81" rx="5" ry="6" fill="url(#eyeShine)" />
                  <ellipse cx="121" cy="81" rx="5" ry="6" fill="url(#eyeShine)" />
                </>
              )}

              {/* Cheeks */}
              <ellipse 
                cx="48" 
                cy="96" 
                rx={currentMood === "shy" || currentMood === "excited" ? "16" : "14"} 
                ry="11" 
                fill="url(#cheekBlush)" 
                opacity={currentMood === "shy" || currentMood === "excited" ? "1" : "0.8"}
              />
              <ellipse 
                cx="152" 
                cy="96" 
                rx={currentMood === "shy" || currentMood === "excited" ? "16" : "14"} 
                ry="11" 
                fill="url(#cheekBlush)"
                opacity={currentMood === "shy" || currentMood === "excited" ? "1" : "0.8"}
              />

              {/* Nose */}
              {actionState === "nose_honk" ? (
                <motion.ellipse 
                  cx="100" 
                  cy="102" 
                  rx="8" 
                  ry="6" 
                  fill="url(#noseGradient)"
                  animate={{ scaleX: [1, 0.7, 1], scaleY: [1, 0.7, 1] }}
                  transition={{ duration: 0.6 }}
                />
              ) : (
                <ellipse cx="100" cy="102" rx="8" ry="6" fill="url(#noseGradient)" />
              )}
              <ellipse cx="97" cy="100" rx="3" ry="2.5" fill="#FFFFFF" opacity="0.7" />

              {/* MOUTH - Mood-based expressions */}
              {actionState === "yawning" ? (
                <>
                  <ellipse cx="100" cy="118" rx="15" ry="18" fill="#1A202C" />
                  <ellipse cx="100" cy="122" rx="12" ry="14" fill="#FF9EAA" />
                </>
              ) : currentMood === "excited" ? (
                <>
                  <ellipse cx="100" cy="116" rx="13" ry="15" fill="#1A202C" />
                  <ellipse cx="100" cy="120" rx="10" ry="11" fill="#FF9EAA" />
                </>
              ) : currentMood === "happy" ? (
                <path d="M 84 110 Q 100 122 116 110" stroke="#1A202C" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              ) : currentMood === "curious" || actionState === "listening" ? (
                <>
                  <ellipse cx="100" cy="112" rx="6" ry="8" fill="#1A202C" />
                  <ellipse cx="100" cy="115" rx="4" ry="5" fill="#FF9EAA" opacity="0.6" />
                </>
              ) : currentMood === "shy" ? (
                <path d="M 88 112 Q 100 117 112 112" stroke="#1A202C" strokeWidth="3" fill="none" strokeLinecap="round" />
              ) : currentMood === "confused" ? (
                <path d="M 84 112 Q 92 115 100 112 Q 108 109 116 112" stroke="#1A202C" strokeWidth="3" fill="none" strokeLinecap="round" />
              ) : currentMood === "sick" ? (
                <path d="M 88 118 Q 100 112 112 118" stroke="#1A202C" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              ) : (
                <path d="M 88 113 Q 100 119 112 113" stroke="#1A202C" strokeWidth="3" fill="none" strokeLinecap="round" />
              )}
            </g>

            {/* Mood decorations */}
            {currentMood === "excited" && actionState !== "spinning" && actionState !== "dizzy" && (
              <motion.g
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <circle cx="145" cy="65" r="5" fill="#FFD166" opacity="0.8" />
                <circle cx="55" cy="65" r="5" fill="#FFD166" opacity="0.8" />
              </motion.g>
            )}

            {actionState === "scared" && (
              <>
                <motion.g animate={{ y: [0, -2, 0] }} transition={{ duration: 0.3, repeat: Infinity }}>
                  <path d="M 150 85 Q 152 90 154 95" stroke="#7FD4FF" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
                  <circle cx="154" cy="97" r="2" fill="#7FD4FF" opacity="0.7" />
                </motion.g>
              </>
            )}

            {/* Listening mode - sound waves */}
            {isSpeaking && actionState === "listening" && (
              <>
                <motion.circle
                  cx="100"
                  cy="80"
                  r="75"
                  fill="none"
                  stroke="#8B7FFF"
                  strokeWidth="2"
                  opacity="0"
                  animate={{ 
                    r: [65, 85],
                    opacity: [0.4, 0]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0 }}
                />
                <motion.circle
                  cx="100"
                  cy="80"
                  r="75"
                  fill="none"
                  stroke="#8B7FFF"
                  strokeWidth="2"
                  opacity="0"
                  animate={{ 
                    r: [65, 85],
                    opacity: [0.4, 0]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                />
                <motion.circle
                  cx="100"
                  cy="80"
                  r="75"
                  fill="none"
                  stroke="#8B7FFF"
                  strokeWidth="2"
                  opacity="0"
                  animate={{ 
                    r: [65, 85],
                    opacity: [0.4, 0]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                />
              </>
            )}
          </g>
        </motion.svg>

        {/* Bath bubbles */}
        {showBubbles && (
          <div className="absolute inset-0 pointer-events-none">
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

        {/* Attention bubble */}
        <AnimatePresence>
          {showAttentionBubble && (
            <motion.div
              className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg px-4 py-2 pointer-events-none"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <div className="text-sm font-medium text-[#2F2750]">{attentionMessage}</div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tap effects */}
        <AnimatePresence>
          {tapEffects.map(effect => (
            <motion.div
              key={effect.id}
              className="absolute pointer-events-none z-10"
              style={{
                left: `${effect.x}%`,
                top: `${effect.y}%`,
                transform: "translate(-50%, -50%)"
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.2, 1, 0],
                opacity: [0, 1, 1, 0],
                y: [0, -20, -40, -60]
              }}
              exit={{ opacity: 0 }}
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
              {effect.type === "love" && (
                <svg width="32" height="32" viewBox="0 0 32 32">
                  <path d="M16 28l-2-1.8C6 18.5 2 14.8 2 10.5 2 7.3 4.7 5 8 5c1.9 0 3.7.9 5 2.3C14.3 5.9 16.1 5 18 5c3.3 0 6 2.3 6 5.5 0 4.3-4 8-11 15.7L16 28z" fill="#FF1493" />
                  <path d="M16 24l-1.5-1.4C9 17.5 6 14.5 6 11c0-2.5 2-4.5 4.5-4.5 1.5 0 2.9.7 3.5 1.8.6-1.1 2-1.8 3.5-1.8 2.5 0 4.5 2 4.5 4.5 0 3.5-3 6.5-8.5 11.6L16 24z" fill="#FFB3D9" />
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
                <div className="text-red-500 font-bold text-lg drop-shadow-lg">OW!</div>
              )}
              {effect.type === "zzz" && (
                <div className="text-[#B3A4FF] font-bold text-xl">z</div>
              )}
              {effect.type === "music_note" && (
                <div className="text-2xl">♪</div>
              )}
              {effect.type === "laugh" && (
                <div className="text-yellow-400 font-bold text-base drop-shadow-lg">HA</div>
              )}
              {effect.type === "sweat" && (
                <div className="text-4xl">💦</div>
              )}
              {effect.type === "angry" && (
                <div className="text-2xl">💢</div>
              )}
              {effect.type === "honk" && (
                <div className="text-[#2F2750] font-bold text-sm drop-shadow-lg">HONK!</div>
              )}
              {effect.type === "question" && (
                <div className="text-[#8B7FFF] font-bold text-2xl">?</div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
