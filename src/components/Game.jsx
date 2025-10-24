import { useState, useEffect, useRef, useCallback } from 'react';
import { isValidPrefix, isValidWord, isDeadEnd } from '../utils/dictionary';
import './Game.css';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const CAR_WIDTH = 50;
const CAR_HEIGHT = 70;
const LETTER_SIZE = 40;
const LANE_WIDTH = GAME_WIDTH / 3;
const LANES = [0, 1, 2]; // Three lanes
const CAR_SPEED = 15;
const LETTER_SPEED = 2;
const SPAWN_INTERVAL = 2000; // 2 seconds

const Game = () => {
  const [carLane, setCarLane] = useState(1); // Start in middle lane
  const [letters, setLetters] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [message, setMessage] = useState('');
  const gameLoopRef = useRef();
  const spawnTimerRef = useRef();
  const letterIdCounter = useRef(0);

  // Common letters weighted for better gameplay
  const LETTER_POOL = 'EEEEEEAAAAIIIOOOUUUNNNRRRTTTSSSLLLDDDGGGBBBCCMMPPFFHHVVWWYYKJXQZ';

  const getRandomLetter = () => {
    return LETTER_POOL[Math.floor(Math.random() * LETTER_POOL.length)];
  };

  const getRandomLane = () => {
    return LANES[Math.floor(Math.random() * LANES.length)];
  };

  const spawnLetter = useCallback(() => {
    const letter = {
      id: letterIdCounter.current++,
      char: getRandomLetter(),
      lane: getRandomLane(),
      y: -LETTER_SIZE,
    };
    setLetters(prev => [...prev, letter]);
  }, []);

  const checkCollision = (letter) => {
    const carX = carLane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2;
    const carY = GAME_HEIGHT - CAR_HEIGHT - 20;
    const letterX = letter.lane * LANE_WIDTH + (LANE_WIDTH - LETTER_SIZE) / 2;
    const letterY = letter.y;

    return (
      carX < letterX + LETTER_SIZE &&
      carX + CAR_WIDTH > letterX &&
      carY < letterY + LETTER_SIZE &&
      carY + CAR_HEIGHT > letterY
    );
  };

  const collectLetter = useCallback((letter) => {
    const newWord = currentWord + letter.char;

    // Check if this creates a dead end
    if (isDeadEnd(newWord)) {
      setMessage(`💀 DEAD END! "${newWord}" cannot form any words!`);
      setGameOver(true);
      return;
    }

    setCurrentWord(newWord);

    // Check if it's a valid complete word
    if (isValidWord(newWord)) {
      const wordScore = newWord.length * 10;
      setScore(prev => prev + wordScore);
      setMessage(`✓ "${newWord}" +${wordScore} points!`);
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage(`Building: "${newWord}"...`);
      setTimeout(() => setMessage(''), 1500);
    }
  }, [currentWord]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = () => {
      setLetters(prev => {
        const updated = prev
          .map(letter => ({ ...letter, y: letter.y + LETTER_SPEED }))
          .filter(letter => {
            // Remove letters that went off screen
            if (letter.y > GAME_HEIGHT) {
              return false;
            }

            // Check for collision
            if (checkCollision(letter)) {
              collectLetter(letter);
              return false; // Remove collected letter
            }

            return true;
          });

        return updated;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, carLane, collectLetter]);

  // Letter spawning
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    spawnTimerRef.current = setInterval(spawnLetter, SPAWN_INTERVAL);

    return () => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
      }
    };
  }, [gameStarted, gameOver, spawnLetter]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver || !gameStarted) return;

      if (e.key === 'ArrowLeft') {
        setCarLane(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCarLane(prev => Math.min(2, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setCarLane(1);
    setLetters([]);
    setCurrentWord('');
    setScore(0);
    setMessage('');
    letterIdCounter.current = 0;
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setCarLane(1);
    setLetters([]);
    setCurrentWord('');
    setScore(0);
    setMessage('');
    letterIdCounter.current = 0;
  };

  const carX = carLane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2;

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Word Driver</h1>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-label">Score:</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Word:</span>
            <span className="stat-value current-word">
              {currentWord || '---'}
            </span>
          </div>
        </div>
      </div>

      {message && (
        <div className={`message ${gameOver ? 'game-over-message' : ''}`}>
          {message}
        </div>
      )}

      {!gameStarted && !gameOver && (
        <div className="start-screen">
          <h2>How to Play</h2>
          <ul>
            <li>Use ← → arrow keys to move your car</li>
            <li>Drive over letters to collect them</li>
            <li>Build valid words to score points</li>
            <li>Avoid creating letter sequences that cannot form any words</li>
            <li>Those are DEAD ENDS and will end your game!</li>
          </ul>
          <button className="start-button" onClick={startGame}>
            Start Game
          </button>
        </div>
      )}

      {gameOver && (
        <div className="game-over-screen">
          <h2>Game Over!</h2>
          <p className="final-score">Final Score: {score}</p>
          <p className="final-word">
            {currentWord && `Final Word: "${currentWord}"`}
          </p>
          <button className="restart-button" onClick={resetGame}>
            Play Again
          </button>
        </div>
      )}

      <div
        className="game-board"
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
        }}
      >
        {/* Lane dividers */}
        <div className="lane-line" style={{ left: LANE_WIDTH }} />
        <div className="lane-line" style={{ left: LANE_WIDTH * 2 }} />

        {/* Road lines animation */}
        <div className="road-lines" />

        {/* Letters */}
        {letters.map(letter => (
          <div
            key={letter.id}
            className="letter"
            style={{
              left: letter.lane * LANE_WIDTH + (LANE_WIDTH - LETTER_SIZE) / 2,
              top: letter.y,
              width: LETTER_SIZE,
              height: LETTER_SIZE,
            }}
          >
            {letter.char}
          </div>
        ))}

        {/* Car */}
        {gameStarted && (
          <div
            className="car"
            style={{
              left: carX,
              bottom: 20,
              width: CAR_WIDTH,
              height: CAR_HEIGHT,
            }}
          >
            🚗
          </div>
        )}
      </div>

      <div className="controls-hint">
        Use ← → arrow keys to move
      </div>
    </div>
  );
};

export default Game;
