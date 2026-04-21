export const PIPE_WIDTH = 60;
export const BIRD_X = 50;
export const BIRD_RADIUS = 16;

export interface Box {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export const checkCollision = (bird: Box, pipe: Box) => {
  return (
    bird.left < pipe.right &&
    bird.right > pipe.left &&
    bird.top < pipe.bottom &&
    bird.bottom > pipe.top
  );
};
