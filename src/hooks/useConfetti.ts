import confetti from 'canvas-confetti';

export function fireConfetti() {
  // Amapola-themed confetti burst
  const colors = ['#8B2252', '#E8A87C', '#85CDCA', '#D72631', '#F9C80E'];

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors,
    shapes: ['circle', 'square'],
    gravity: 1.2,
    ticks: 200,
  });

  // Secondary burst
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });
  }, 150);
}
