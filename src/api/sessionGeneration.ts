let sessionGeneration = 0;

export function getSessionGeneration(): number {
  return sessionGeneration;
}

export function advanceSessionGeneration(): number {
  sessionGeneration += 1;
  return sessionGeneration;
}
