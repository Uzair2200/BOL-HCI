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
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioUnlockedRef = useRef(false);
  const lastSoundedActionRef = useRef<ActionState>("idle");

  const getAudioContext = () => {
    if (typeof window === "undefined") return null;
    if (!audioContextRef.current) {
      const AudioCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtor) return null;
      audioContextRef.current = new AudioCtor();
    }
    return audioContextRef.current;
  };

  const unlockAudio = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    audioUnlockedRef.current = true;
    if (ctx.state === "suspended") {
      void ctx.resume();
    }
  };

  const playTone = (opts: {
    frequency: number;
    duration?: number;
    volume?: number;
    type?: OscillatorType;
    slideTo?: number;
    attack?: number;
    release?: number;
  }) => {
    if (!audioUnlockedRef.current) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state !== "running") {
      void ctx.resume().then(() => playTone(opts));
      return;
    }

    const now = ctx.currentTime;
    const duration = opts.duration ?? 0.11;
    const attack = opts.attack ?? 0.005;
    const release = opts.release ?? 0.08;
    const volume = opts.volume ?? 0.04;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = opts.type ?? "sine";
    osc.frequency.setValueAtTime(opts.frequency, now);

    if (typeof opts.slideTo === "number") {
      osc.frequency.exponentialRampToValueAtTime(Math.max(30, opts.slideTo), now + duration);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(attack + 0.01, duration - release));

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  };

  const playNoise = (duration = 0.1, volume = 0.02) => {
    if (!audioUnlockedRef.current) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state !== "running") {
      void ctx.resume().then(() => playNoise(duration, volume));
      return;
    }

    const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      channel[i] = (Math.random() * 2 - 1) * Math.exp(-i / (length * 0.6));
    }

    const src = ctx.createBufferSource();
    const hp = ctx.createBiquadFilter();
    const lp = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    hp.type = "highpass";
    hp.frequency.value = 450;
    lp.type = "lowpass";
    lp.frequency.value = 3200;
    gain.gain.value = volume;

    src.buffer = buffer;
    src.connect(hp);
    hp.connect(lp);
    lp.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  };

  const playSoundCue = (cue: "tap" | "giggle" | "honk" | "sneeze" | "ouch" | "ear" | "poke" | "spin" | "throw" | "squish" | "stretch" | "listening") => {
    switch (cue) {
      case "tap":
        playTone({ frequency: 460 + Math.random() * 90, duration: 0.06, volume: 0.018, type: "triangle" });
        break;
      case "giggle":
        playTone({ frequency: 520, slideTo: 690, duration: 0.09, volume: 0.038, type: "triangle" });
        setTimeout(() => playTone({ frequency: 610, slideTo: 790, duration: 0.09, volume: 0.034, type: "triangle" }), 70);
        setTimeout(() => playTone({ frequency: 700, slideTo: 920, duration: 0.07, volume: 0.028, type: "sine" }), 130);
        break;
      case "honk":
        playTone({ frequency: 310, slideTo: 360, duration: 0.1, volume: 0.03, type: "square" });
        break;
      case "sneeze":
        playNoise(0.085, 0.03);
        setTimeout(() => playTone({ frequency: 620, slideTo: 420, duration: 0.07, volume: 0.02, type: "triangle" }), 20);
        break;
      case "ouch":
        playNoise(0.12, 0.048);
        playTone({ frequency: 260, slideTo: 160, duration: 0.17, volume: 0.052, type: "sawtooth" });
        setTimeout(() => playTone({ frequency: 200, slideTo: 130, duration: 0.1, volume: 0.04, type: "triangle" }), 45);
        break;
      case "ear":
        playTone({ frequency: 960, slideTo: 1240, duration: 0.05, volume: 0.018, type: "sine" });
        break;
      case "poke":
        playTone({ frequency: 390, slideTo: 280, duration: 0.07, volume: 0.02, type: "square" });
        break;
      case "spin":
        playTone({ frequency: 380, slideTo: 950, duration: 0.2, volume: 0.022, type: "triangle" });
        break;
      case "throw":
        playTone({ frequency: 820, slideTo: 240, duration: 0.25, volume: 0.026, type: "triangle" });
        break;
      case "squish":
        playTone({ frequency: 180, slideTo: 120, duration: 0.08, volume: 0.024, type: "sine" });
        break;
      case "stretch":
        playTone({ frequency: 180, slideTo: 360, duration: 0.09, volume: 0.022, type: "sine" });
        break;
      case "listening":
        playTone({ frequency: 520, slideTo: 640, duration: 0.07, volume: 0.014, type: "sine" });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        void audioContextRef.current.close();
      }
    };
  }, []);

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
    unlockAudio();
    
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
      playSoundCue("ouch");
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
        playSoundCue("giggle");
        addTapEffect(x, y, "laugh");
        addTapEffect(x - 10, y - 10, "laugh");
        addTapEffect(x + 10, y - 10, "laugh");
        updateMoodPoints(8);
      } else if (zone === "nose") {
        setActionState("sneezing");
        playSoundCue("sneeze");
        addTapEffect(x, y, "honk");
        addTapEffect(x + 10, y - 10, "honk");
        updateMoodPoints(3);
      } else if (zone === "left_eye" || zone === "right_eye") {
        setActionState("eye_poke");
        playSoundCue("ouch");
        addTapEffect(x, y, "ow");
        updateMoodPoints(-8);
      } else {
        setActionState("spinning");
        playSoundCue("spin");
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
        playSoundCue("ear");
        addTapEffect(x, y, "sparkle");
        updateMoodPoints(2);
        break;
        
      case "left_eye":
      case "right_eye":
        setActionState("eye_poke");
        playSoundCue("ouch");
        addTapEffect(x, y, "ow");
        updateMoodPoints(-5);
        break;
        
      case "nose":
        setActionState("nose_honk");
        playSoundCue("honk");
        addTapEffect(x, y, "honk");
        updateMoodPoints(3);
        break;
        
      case "mouth":
        playSoundCue("tap");
        addTapEffect(x, y, "music_note");
        setRotation(prev => prev + (Math.random() > 0.5 ? 10 : -10));
        updateMoodPoints(2);
        break;
        
      case "belly":
        setActionState("giggling");
        playSoundCue("giggle");
        addTapEffect(x, y, "heart");
        addTapEffect(x - 15, y, "heart");
        addTapEffect(x + 15, y, "heart");
        updateMoodPoints(6);
        break;
        
      case "left_arm":
      case "right_arm":
        playSoundCue("tap");
        addTapEffect(x, y, "sparkle");
        setRotation(prev => prev + (Math.random() > 0.5 ? 15 : -15));
        updateMoodPoints(2);
        break;
        
      case "feet":
        playSoundCue("tap");
        addTapEffect(x, y, "star");
        setRotation(prev => prev + (Math.random() > 0.5 ? 15 : -15));
        updateMoodPoints(3);
        break;
        
      default:
        playSoundCue("tap");
        addTapEffect(x, y, "heart");
        setRotation(prev => prev + (Math.random() > 0.5 ? 10 : -10));
        updateMoodPoints(1);
    }
  };

  // Drag handlers
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!containerRef.current) return;
    unlockAudio();
    
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
      playSoundCue("throw");
      
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
    unlockAudio();
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
          playSoundCue("squish");
          addTapEffect(50, 50, "star");
        } else if (delta > 3) {
          setSquishScale(prev => ({
            x: Math.max(0.7, prev.x - 0.05),
            y: Math.min(1.4, prev.y + 0.05)
          }));
          setActionState("stretched");
          playSoundCue("stretch");
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

  useEffect(() => {
    if (!audioUnlockedRef.current || lastSoundedActionRef.current === actionState) {
      lastSoundedActionRef.current = actionState;
      return;
    }

    switch (actionState) {
      case "dizzy":
        playSoundCue("spin");
        break;
      case "listening":
        playSoundCue("listening");
        break;
      default:
        break;
    }

    lastSoundedActionRef.current = actionState;
  }, [actionState]);

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
          className="w-full h-full"
          style={{
            filter: `drop-shadow(0px 12px 20px rgba(40, 40, 48, 0.26)) drop-shadow(0px 4px 6px rgba(24, 24, 30, 0.18)) drop-shadow(0px 0px 30px rgba(170, 190, 210, 0.08))`
          }}
          animate={{ scale: [1, 1.012, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <defs>
            {/* White fur gradients */}
            <radialGradient id="headGradient" cx="35%" cy="28%" r="65%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#F2F4F7" />
              <stop offset="60%" stopColor="#DEE3EA" />
              <stop offset="85%" stopColor="#C4CBD4" />
              <stop offset="100%" stopColor="#AEB6C0" />
            </radialGradient>

            <radialGradient id="bodyGradient" cx="38%" cy="30%" r="70%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#F0F3F6" />
              <stop offset="65%" stopColor="#DCE1E8" />
              <stop offset="90%" stopColor="#C0C7D1" />
              <stop offset="100%" stopColor="#A8B0BB" />
            </radialGradient>

            <radialGradient id="bellyGradient" cx="45%" cy="38%" r="60%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#F4F6F9" />
              <stop offset="75%" stopColor="#E2E7EE" />
              <stop offset="100%" stopColor="#C7CFD9" />
            </radialGradient>

            {/* Black fur gradients */}
            <radialGradient id="earGradient" cx="40%" cy="30%" r="65%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#4A5068" />
              <stop offset="35%" stopColor="#2A2E42" />
              <stop offset="75%" stopColor="#181B2C" />
              <stop offset="100%" stopColor="#0C0E18" />
            </radialGradient>

            <radialGradient id="innerEarGradient" cx="50%" cy="40%" r="55%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#586079" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#343A50" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#1A1E2E" stopOpacity="0.25" />
            </radialGradient>

            <radialGradient id="eyePatchGradient" cx="28%" cy="22%" r="70%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#33384A" />
              <stop offset="30%" stopColor="#171B26" />
              <stop offset="70%" stopColor="#0C0F16" />
              <stop offset="100%" stopColor="#04060A" />
            </radialGradient>

            <radialGradient id="pawGradient" cx="35%" cy="25%" r="70%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#484E68" />
              <stop offset="40%" stopColor="#282C40" />
              <stop offset="80%" stopColor="#141620" />
              <stop offset="100%" stopColor="#080A12" />
            </radialGradient>

            {/* Shines and effects */}
            <radialGradient id="eyeShine" cx="25%" cy="22%" r="55%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="eyeShine2" cx="70%" cy="72%" r="50%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#C8EEFF" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#A8D8FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#88C8FF" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="noseGradient" cx="28%" cy="22%" r="65%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#6B7280" />
              <stop offset="40%" stopColor="#3E4552" />
              <stop offset="80%" stopColor="#1F2430" />
              <stop offset="100%" stopColor="#0B0E14" />
            </radialGradient>

            <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#D4D9E2" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#CCD2DC" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#C4CBD8" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="softShadow" cx="50%" cy="50%" r="50%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#202530" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#141922" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0A0E14" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="aoShadow" cx="50%" cy="50%" r="50%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#262C38" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#161B24" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0A0E14" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="rimLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DCF0FF" stopOpacity="0" />
              <stop offset="70%" stopColor="#C8E8FF" stopOpacity="0" />
              <stop offset="90%" stopColor="#B8DCFF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#A8D0FF" stopOpacity="0.5" />
            </linearGradient>

            <radialGradient id="headRimLight" cx="72%" cy="75%" r="45%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#C8E8FF" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#A8D4FF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#88BCFF" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="bodyRimLight" cx="75%" cy="78%" r="40%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#C8E8FF" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#A8D0FF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#88B8FF" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="topHighlight" cx="50%" cy="50%" r="50%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="40%" stopColor="#F8FBFF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F1F6FF" stopOpacity="0" />
            </radialGradient>

            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g transform={getBodyTransform()}>
            {/* Ground shadow */}
            <ellipse cx="100" cy="204" rx="55" ry="10" fill="url(#softShadow)" />
            <ellipse cx="100" cy="204" rx="40" ry="6" fill="url(#softShadow)" opacity="0.6" />
            <ellipse cx="104" cy="205" rx="52" ry="9" fill="url(#softShadow)" opacity="0.8" />

            {/* Back Legs */}
            <ellipse cx="72" cy="186" rx="24" ry="20" fill="url(#pawGradient)" />
            <ellipse cx="65" cy="179" rx="10" ry="7" fill="#4A5068" opacity="0.5" />
            <ellipse cx="72" cy="192" rx="12" ry="8" fill="#3A3E58" />
            <ellipse cx="63" cy="192" rx="5" ry="4" fill="#4A5068" />
            <ellipse cx="81" cy="192" rx="5" ry="4" fill="#4A5068" />
            <ellipse cx="80" cy="190" rx="9" ry="6" fill="url(#headRimLight)" opacity="0.7" />

            <ellipse cx="128" cy="186" rx="24" ry="20" fill="url(#pawGradient)" />
            <ellipse cx="121" cy="179" rx="10" ry="7" fill="#4A5068" opacity="0.5" />
            <ellipse cx="128" cy="192" rx="12" ry="8" fill="#3A3E58" />
            <ellipse cx="119" cy="192" rx="5" ry="4" fill="#4A5068" />
            <ellipse cx="137" cy="192" rx="5" ry="4" fill="#4A5068" />
            <ellipse cx="136" cy="190" rx="9" ry="6" fill="url(#headRimLight)" opacity="0.7" />

            {/* Body with breathing */}
            <motion.ellipse 
              cx="100" 
              cy="145" 
              rx="60" 
              ry="52" 
              fill="url(#bodyGradient)"
              animate={{ ry: actionState === "falling_asleep" ? [52, 54, 52] : [52, 53, 52] }}
              transition={{
                duration: actionState === "falling_asleep" ? 3 : 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Belly and body shading passes */}
            <ellipse cx="100" cy="152" rx="42" ry="36" fill="url(#bellyGradient)" />
            <ellipse cx="92" cy="140" rx="22" ry="16" fill="url(#topHighlight)" />
            <ellipse cx="58" cy="152" rx="12" ry="30" fill="url(#aoShadow)" opacity="0.7" />
            <ellipse cx="142" cy="152" rx="12" ry="30" fill="url(#aoShadow)" opacity="0.7" />
            <ellipse cx="100" cy="188" rx="46" ry="16" fill="url(#aoShadow)" opacity="0.5" />
            <motion.ellipse
              cx="100"
              cy="145"
              rx="60"
              ry="52"
              fill="url(#bodyRimLight)"
              animate={{ ry: actionState === "falling_asleep" ? [52, 54, 52] : [52, 53, 52] }}
              transition={{
                duration: actionState === "falling_asleep" ? 3 : 2.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <ellipse cx="78" cy="118" rx="14" ry="10" fill="#FFFEF8" opacity="0.6" />
            <ellipse cx="74" cy="115" rx="6" ry="4" fill="#FFFFFF" opacity="0.8" />
            <ellipse cx="100" cy="178" rx="40" ry="12" fill="#E4EBF5" opacity="0.1" />

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
                <ellipse cx="60" cy="140" rx="21" ry="27" fill="url(#pawGradient)" />
                <ellipse cx="140" cy="140" rx="21" ry="27" fill="url(#pawGradient)" />
                <ellipse cx="60" cy="147" rx="10" ry="13" fill="#5A6978" />
                <ellipse cx="140" cy="147" rx="10" ry="13" fill="#5A6978" />
              </>
            )}

            {/* Head */}
            <g transform={currentMood === "curious" ? "rotate(-12 100 80)" : currentMood === "confused" ? "rotate(12 100 80)" : currentMood === "shy" ? "rotate(8 100 80)" : ""}>
              <ellipse cx="100" cy="80" rx="62" ry="60" fill="url(#headGradient)" />
              <ellipse cx="100" cy="132" rx="50" ry="18" fill="url(#aoShadow)" opacity="0.9" />
              <ellipse cx="80" cy="60" rx="32" ry="22" fill="url(#topHighlight)" />
              <ellipse cx="75" cy="55" rx="18" ry="12" fill="#FFFFFF" opacity="0.45" />
              <ellipse cx="70" cy="50" rx="8" ry="6" fill="#FFFFFF" opacity="0.7" />
              <ellipse cx="68" cy="48" rx="4" ry="3" fill="#FFFFFF" opacity="0.9" />
              <ellipse cx="100" cy="80" rx="62" ry="60" fill="url(#headRimLight)" />
              <ellipse cx="108" cy="128" rx="48" ry="10" fill="url(#aoShadow)" opacity="0.5" />
              <ellipse cx="100" cy="128" rx="30" ry="8" fill="#DCE4EE" opacity="0.08" />
              <path d="M 85 58 Q 92 52 98 56" stroke="#D4C8BE" strokeWidth="0.8" fill="none" opacity="0.08" />
              <path d="M 72 68 Q 80 60 88 64" stroke="#D4C8BE" strokeWidth="0.8" fill="none" opacity="0.07" />
              <path d="M 105 58 Q 112 52 118 57" stroke="#D4C8BE" strokeWidth="0.8" fill="none" opacity="0.07" />
              <path d="M 88 100 Q 96 94 104 98" stroke="#D4C8BE" strokeWidth="0.8" fill="none" opacity="0.06" />
              <path d="M 78 130 Q 88 124 98 128" stroke="#D4C8BE" strokeWidth="0.8" fill="none" opacity="0.07" />
              <path d="M 102 130 Q 112 124 120 129" stroke="#D4C8BE" strokeWidth="0.8" fill="none" opacity="0.07" />

              {/* Ears - mood-based */}
              {currentMood === "curious" || currentMood === "learning" || actionState === "listening" ? (
                <>
                  <ellipse cx="60" cy="48" rx="16" ry="20" fill="url(#aoShadow)" opacity="0.6" transform="rotate(-10 60 48)" />
                  <ellipse cx="58" cy="42" rx="23" ry="27" fill="url(#earGradient)" transform="rotate(-10 58 42)" />
                  <ellipse cx="51" cy="34" rx="9" ry="10" fill="#4A5068" opacity="0.6" transform="rotate(-10 51 34)" />
                  <ellipse cx="59" cy="44" rx="11" ry="13" fill="url(#innerEarGradient)" transform="rotate(-10 59 44)" />

                  <ellipse cx="140" cy="48" rx="16" ry="20" fill="url(#aoShadow)" opacity="0.6" transform="rotate(10 140 48)" />
                  <ellipse cx="142" cy="42" rx="23" ry="27" fill="url(#earGradient)" transform="rotate(10 142 42)" />
                  <ellipse cx="135" cy="34" rx="9" ry="10" fill="#4A5068" opacity="0.6" transform="rotate(10 135 34)" />
                  <ellipse cx="141" cy="44" rx="11" ry="13" fill="url(#innerEarGradient)" transform="rotate(10 141 44)" />
                </>
              ) : actionState === "ear_flick" ? (
                <>
                  <ellipse cx="60" cy="54" rx="16" ry="20" fill="url(#aoShadow)" opacity="0.6" />
                  <motion.ellipse 
                    cx="58" 
                    cy="48" 
                    rx="23" 
                    ry="27" 
                    fill="url(#earGradient)"
                    animate={{ ry: [27, 17, 27] }}
                    transition={{ duration: 0.4 }}
                  />
                  <ellipse cx="59" cy="50" rx="11" ry="13" fill="url(#innerEarGradient)" />

                  <ellipse cx="140" cy="54" rx="16" ry="20" fill="url(#aoShadow)" opacity="0.6" />
                  <ellipse cx="142" cy="48" rx="23" ry="27" fill="url(#earGradient)" />
                  <ellipse cx="141" cy="50" rx="11" ry="13" fill="url(#innerEarGradient)" />
                </>
              ) : (
                <>
                  <ellipse cx="60" cy="54" rx="16" ry="20" fill="url(#aoShadow)" opacity="0.6" />
                  <ellipse cx="58" cy="48" rx="23" ry="27" fill="url(#earGradient)" />
                  <ellipse cx="51" cy="40" rx="9" ry="10" fill="#4A5068" opacity="0.6" />
                  <ellipse cx="59" cy="50" rx="11" ry="13" fill="url(#innerEarGradient)" />
                  <ellipse cx="56" cy="45" rx="4" ry="4" fill="#5A6178" opacity="0.35" />
                  <ellipse cx="66" cy="55" rx="6" ry="10" fill="#C8E8FF" opacity="0.25" />

                  <ellipse cx="140" cy="54" rx="16" ry="20" fill="url(#aoShadow)" opacity="0.6" />
                  <ellipse cx="142" cy="48" rx="23" ry="27" fill="url(#earGradient)" />
                  <ellipse cx="135" cy="40" rx="9" ry="10" fill="#4A5068" opacity="0.6" />
                  <ellipse cx="141" cy="50" rx="11" ry="13" fill="url(#innerEarGradient)" />
                  <ellipse cx="138" cy="45" rx="4" ry="4" fill="#5A6178" opacity="0.35" />
                  <ellipse cx="134" cy="55" rx="6" ry="10" fill="#C8E8FF" opacity="0.25" />
                </>
              )}

              {/* Eye patches */}
              <ellipse cx="75" cy="83" rx="23" ry="27" fill="url(#aoShadow)" opacity="0.4" />
              <ellipse cx="75" cy="83" rx="22" ry="26" fill="url(#eyePatchGradient)" />
              <ellipse cx="67" cy="74" rx="8" ry="9" fill="#43495E" opacity="0.38" />
              <ellipse cx="82" cy="92" rx="7" ry="10" fill="#253248" opacity="0.22" />

              <ellipse cx="125" cy="83" rx="23" ry="27" fill="url(#aoShadow)" opacity="0.4" />
              <ellipse cx="125" cy="83" rx="22" ry="26" fill="url(#eyePatchGradient)" />
              <ellipse cx="117" cy="74" rx="8" ry="9" fill="#43495E" opacity="0.38" />
              <ellipse cx="132" cy="92" rx="7" ry="10" fill="#253248" opacity="0.22" />

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
                    r="11" 
                    fill="#1A202C" 
                  />
                  <circle 
                    cx={rightEyeCenter.x + rightPupilOffset.x} 
                    cy={rightEyeCenter.y + rightPupilOffset.y} 
                    r="11" 
                    fill="#1A202C" 
                  />
                  <ellipse cx="71" cy="81" rx="5" ry="6" fill="url(#eyeShine)" />
                  <ellipse cx="121" cy="81" rx="5" ry="6" fill="url(#eyeShine)" />
                  <ellipse cx="80" cy="90" rx="3" ry="3" fill="url(#eyeShine2)" />
                  <ellipse cx="130" cy="90" rx="3" ry="3" fill="url(#eyeShine2)" />
                  <circle cx="69" cy="77" r="2" fill="#FFFFFF" />
                  <circle cx="119" cy="77" r="2" fill="#FFFFFF" />
                </>
              )}

              {/* Cheeks */}
              <ellipse 
                cx="47" 
                cy="96" 
                rx={currentMood === "shy" || currentMood === "excited" ? "16" : "14"} 
                ry="12" 
                fill="url(#cheekBlush)" 
                opacity={currentMood === "shy" || currentMood === "excited" ? "0.22" : "0.16"}
              />
              <ellipse cx="47" cy="96" rx="10" ry="7" fill="#D3D9E2" opacity="0.06" />
              <ellipse 
                cx="153" 
                cy="96" 
                rx={currentMood === "shy" || currentMood === "excited" ? "16" : "14"} 
                ry="12" 
                fill="url(#cheekBlush)"
                opacity={currentMood === "shy" || currentMood === "excited" ? "0.22" : "0.16"}
              />
              <ellipse cx="153" cy="96" rx="10" ry="7" fill="#D3D9E2" opacity="0.06" />

              {/* Nose */}
              {actionState === "nose_honk" ? (
                <motion.ellipse 
                  cx="100" 
                  cy="102" 
                  rx="9" 
                  ry="7" 
                  fill="url(#noseGradient)"
                  filter="url(#softGlow)"
                  animate={{ scaleX: [1, 0.7, 1], scaleY: [1, 0.7, 1] }}
                  transition={{ duration: 0.6 }}
                />
              ) : (
                <ellipse cx="100" cy="102" rx="9" ry="7" fill="url(#noseGradient)" filter="url(#softGlow)" />
              )}
              <ellipse cx="96" cy="99" rx="4" ry="2.5" fill="#9AA5B4" opacity="0.65" />
              <ellipse cx="95" cy="98" rx="2" ry="1.5" fill="#C7D2DF" opacity="0.75" />
              <circle cx="94" cy="98" r="1.2" fill="#FFFFFF" opacity="0.9" />
              <ellipse cx="100" cy="118" rx="18" ry="4" fill="url(#aoShadow)" opacity="0.3" />

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
