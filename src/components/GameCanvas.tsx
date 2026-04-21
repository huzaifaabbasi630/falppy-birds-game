import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore, LEVELS } from '../store/gameStore';
import { audio } from './AudioEngine';
import { Pause, Play } from 'lucide-react';

const GRAVITY = 0.25;
const JUMP = -5.5;
const BIRD_RADIUS = 15;
const PIPE_WIDTH = 60;
const BIRD_X = 50;

interface Pipe {
  x: number;
  topHeight: number;
  passed: boolean;
}

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    gameState, 
    setGameState, 
    score, 
    incrementScore, 
    currentLevel, 
    completeLevel,
    resetScore 
  } = useGameStore();
  
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef<number>(null);
  const pipesRef = useRef<Pipe[]>([]);
  const birdRef = useRef({ y: 300, velocity: 0, rotation: 0 });
  const frameCountRef = useRef(0);
  const pipesPassedRef = useRef(0);

  const config = LEVELS[currentLevel];

  const resetGame = useCallback(() => {
    birdRef.current = { y: 300, velocity: 0, rotation: 0 };
    pipesRef.current = [];
    frameCountRef.current = 0;
    pipesPassedRef.current = 0;
    resetScore();
  }, [resetScore]);

  const jump = useCallback(() => {
    if (gameState !== 'playing' || isPaused) return;
    birdRef.current.velocity = JUMP;
    audio.jump();
  }, [gameState, isPaused]);

  // Handle Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') jump();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#70c5ce');
    grad.addColorStop(1, '#98e0e0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update Bird
    if (!isPaused) {
      birdRef.current.velocity += GRAVITY;
      birdRef.current.y += birdRef.current.velocity;
      birdRef.current.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, birdRef.current.velocity * 0.1));
    }

    // Draw Bird
    ctx.save();
    ctx.translate(BIRD_X, birdRef.current.y);
    ctx.rotate(birdRef.current.rotation);
    
    // Body
    ctx.fillStyle = '#fce303';
    ctx.beginPath();
    ctx.arc(0, 0, BIRD_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Eye
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(8, -5, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(10, -5, 2, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#ff8c00';
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(22, 5);
    ctx.lineTo(12, 10);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();

    // Update & Draw Pipes
    if (!isPaused) {
      if (frameCountRef.current % Math.floor(config.pipeFrequency) === 0) {
        const topHeight = Math.random() * (canvas.height - config.gapSize - 100) + 50;
        pipesRef.current.push({ x: canvas.width, topHeight, passed: false });
      }
      frameCountRef.current++;

      pipesRef.current.forEach(pipe => {
        pipe.x -= config.speed;
      });

      // Filter off-screen pipes
      pipesRef.current = pipesRef.current.filter(p => p.x > -PIPE_WIDTH);
    }

    pipesRef.current.forEach(pipe => {
      // Top Pipe
      ctx.fillStyle = '#2e8b57';
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      ctx.strokeStyle = '#000';
      ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);

      // Bottom Pipe
      const bottomY = pipe.topHeight + config.gapSize;
      ctx.fillRect(pipe.x, bottomY, PIPE_WIDTH, canvas.height - bottomY);
      ctx.strokeRect(pipe.x, bottomY, PIPE_WIDTH, canvas.height - bottomY);

      // Pipe Caps
      ctx.fillStyle = '#3cb371';
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, PIPE_WIDTH + 10, 20);
      ctx.strokeRect(pipe.x - 5, pipe.topHeight - 20, PIPE_WIDTH + 10, 20);
      ctx.fillRect(pipe.x - 5, bottomY, PIPE_WIDTH + 10, 20);
      ctx.strokeRect(pipe.x - 5, bottomY, PIPE_WIDTH + 10, 20);

      // Collision Detection
      const birdBox = {
        left: BIRD_X - BIRD_RADIUS + 5,
        right: BIRD_X + BIRD_RADIUS - 5,
        top: birdRef.current.y - BIRD_RADIUS + 5,
        bottom: birdRef.current.y + BIRD_RADIUS - 5
      };

      const pipeTopBox = { left: pipe.x, right: pipe.x + PIPE_WIDTH, top: 0, bottom: pipe.topHeight };
      const pipeBottomBox = { left: pipe.x, right: pipe.x + PIPE_WIDTH, top: bottomY, bottom: canvas.height };

      const collides = (b: any, p: any) => {
        return b.left < p.right && b.right > p.left && b.top < p.bottom && b.bottom > p.top;
      };

      if (collides(birdBox, pipeTopBox) || collides(birdBox, pipeBottomBox)) {
        audio.hit();
        setGameState('gameover');
      }

      // Check Score
      if (!pipe.passed && pipe.x + PIPE_WIDTH < BIRD_X) {
        pipe.passed = true;
        incrementScore();
        pipesPassedRef.current++;
        audio.score();
        
        if (pipesPassedRef.current >= config.pipesToWin) {
          completeLevel();
        }
      }
    });

    // Floor/Ceiling collision
    if (birdRef.current.y < 0 || birdRef.current.y > canvas.height) {
      audio.hit();
      setGameState('gameover');
    }

  }, [config, incrementScore, isPaused, setGameState, completeLevel]);

  const frame = useCallback(() => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    draw(ctx);
    gameLoopRef.current = requestAnimationFrame(frame);
  }, [gameState, draw]);

  useEffect(() => {
    if (gameState === 'playing') {
      resetGame();
      gameLoopRef.current = requestAnimationFrame(frame);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, frame, resetGame]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-900 overflow-hidden select-none touch-none">
      <canvas
        ref={canvasRef}
        width={400}
        height={600}
        className="w-full max-w-[400px] h-full max-h-[600px] bg-white cursor-pointer"
        onClick={jump}
      />
      
      {/* HUD */}
      <div className="absolute top-4 left-0 right-0 flex justify-between px-6 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white font-bold border border-white/20">
          Level {currentLevel + 1}
        </div>
        <div className="text-4xl font-black text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">
          {score}
        </div>
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="pointer-events-auto bg-black/40 backdrop-blur-md p-2 rounded-full text-white border border-white/20 hover:bg-black/60 transition-colors"
        >
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
        </button>
      </div>

      {isPaused && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl shadow-2xl text-center space-y-6 animate-in fade-in zoom-in duration-300">
            <h2 className="text-3xl font-black text-gray-800">Paused</h2>
            <button
              onClick={() => setIsPaused(false)}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
            >
              Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
