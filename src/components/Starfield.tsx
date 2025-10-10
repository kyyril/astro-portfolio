import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
  direction: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  angle: number;
}

const Starfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const lastShootingStarTimeRef = useRef<number>(0);

  const STAR_COUNT = 200;
  const SHOOTING_STAR_MIN_INTERVAL = 2000;
  const SHOOTING_STAR_MAX_INTERVAL = 8000;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStar = (): Star => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.2 + 0.3,
      opacity: Math.random(),
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1,
    });

    const createShootingStar = (): ShootingStar => {
      const fromRight = Math.random() > 0.5;
      return {
        x: fromRight ? canvas.width : 0,
        y: Math.random() * (canvas.height / 3),
        length: Math.random() * 60 + 30,
        speed: Math.random() * 4 + 3,
        opacity: 1,
        angle: fromRight
          ? (Math.PI * 3) / 4 + Math.random() * 0.5
          : Math.PI / 4 - Math.random() * 0.5,
      };
    };

    const initStars = () => {
      starsRef.current = Array.from({ length: STAR_COUNT }, createStar);
    };

    const updateStar = (star: Star) => {
      star.opacity += star.direction * star.twinkleSpeed;
      if (star.opacity > 1 || star.opacity < 0.1) {
        star.direction *= -1;
      }
    };

    const updateShootingStar = (shootingStar: ShootingStar): boolean => {
      shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
      shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
      shootingStar.opacity -= 0.01;

      return (
        shootingStar.opacity <= 0 ||
        shootingStar.x < -shootingStar.length ||
        shootingStar.x > canvas.width + shootingStar.length ||
        shootingStar.y > canvas.height + shootingStar.length ||
        shootingStar.y < -shootingStar.length
      );
    };

    const drawStar = (star: Star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
    };

    const drawShootingStar = (shootingStar: ShootingStar) => {
      const gradient = ctx.createLinearGradient(
        shootingStar.x,
        shootingStar.y,
        shootingStar.x + Math.cos(shootingStar.angle) * shootingStar.length,
        shootingStar.y + Math.sin(shootingStar.angle) * shootingStar.length
      );

      gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

      ctx.beginPath();
      ctx.moveTo(shootingStar.x, shootingStar.y);
      ctx.lineTo(
        shootingStar.x + Math.cos(shootingStar.angle) * shootingStar.length,
        shootingStar.y + Math.sin(shootingStar.angle) * shootingStar.length
      );
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const animate = (currentTime: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw stars
      starsRef.current.forEach((star) => {
        updateStar(star);
        drawStar(star);
      });

      // Create shooting stars
      if (
        currentTime - lastShootingStarTimeRef.current >
        SHOOTING_STAR_MIN_INTERVAL +
          Math.random() *
            (SHOOTING_STAR_MAX_INTERVAL - SHOOTING_STAR_MIN_INTERVAL)
      ) {
        shootingStarsRef.current.push(createShootingStar());
        lastShootingStarTimeRef.current = currentTime;
      }

      // Update and draw shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter(
        (shootingStar) => {
          drawShootingStar(shootingStar);
          return !updateShootingStar(shootingStar);
        }
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    setCanvasSize();
    initStars();
    animationRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      setCanvasSize();
      initStars();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
};

export default Starfield;
