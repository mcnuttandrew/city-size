import {forceSimulation, forceManyBody, forceLink} from 'd3-force';

export function forceDirectLabels(labels) {
  const anchorNodes = labels.map((label, index) => {
    return {
      x: label.x,
      y: label.y,
      fx: label.x,
      fy: label.y,
      index: labels.length + index,
      anchor: true
    };
  });
  const nodes = labels.map((label, index) => {
    return {...label, index};
  });
  const links = labels.map((label, index) => {
    return {
      source: index,
      target: labels.length + index
    };
  });
  const simulation = forceSimulation(nodes.concat(anchorNodes))
      .force('charge', forceManyBody().distanceMax(400).strength(d => d.anchor ? 0 : -3000))
      .force('link', forceLink(links))
      // .force('x', forceX())
      .stop();

  for (let i = 0; i < 4000; i++) {
    simulation.tick();
  }
  return nodes;
}
