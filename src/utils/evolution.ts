export interface EvoNode {
  species: { name: string };
  evolves_to: EvoNode[];
}

export function findStage(
  node: EvoNode,
  name: string,
  depth = 0
): number | null {
  if (node.species.name === name) return depth;
  for (const next of node.evolves_to) {
    const d = findStage(next, name, depth + 1);
    if (d !== null) return d;
  }
  return null;
}
