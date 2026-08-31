export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function generateElectricalArcPoints(startX, startY, endX, endY, segmentCount, maxJitter) {
  const points = [{ x: startX, y: startY }];
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.hypot(dx, dy) || 1;
  const perpX = -dy / length;
  const perpY = dx / length;
  const segments = Math.max(3, segmentCount);

  for (let index = 1; index < segments; index += 1) {
    const t = index / segments;
    const envelope = Math.sin(t * Math.PI);
    const offset = (Math.random() - 0.5) * 2 * maxJitter * envelope;
    points.push({
      x: startX + dx * t + perpX * offset,
      y: startY + dy * t + perpY * offset
    });
  }

  points.push({ x: endX, y: endY });
  return points;
}

export function generateLocalSparkPoints(originX, originY, radius) {
  const angle = Math.random() * Math.PI * 2;
  const distance = radius * (0.45 + Math.random() * 0.55);
  const endX = originX + Math.cos(angle) * distance;
  const endY = originY + Math.sin(angle) * distance;
  return generateElectricalArcPoints(originX, originY, endX, endY, 4, radius * 0.35);
}

export function pickNearbyNodeIds(nodes, originX, originY, radius, count, excludeId) {
  const candidates = [];

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    if (node.id === excludeId) continue;
    const distance = Math.hypot(node.currentX - originX, node.currentY - originY);
    if (distance < 10 || distance > radius) continue;
    candidates.push({ id: node.id, distance, weight: 1 / (distance + 24) });
  }

  const selected = [];
  const pool = candidates.slice();
  const picks = Math.min(count, pool.length);

  for (let pick = 0; pick < picks; pick += 1) {
    const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
    if (totalWeight <= 0) break;
    let threshold = Math.random() * totalWeight;
    let chosenIndex = 0;
    for (let index = 0; index < pool.length; index += 1) {
      threshold -= pool[index].weight;
      if (threshold <= 0) {
        chosenIndex = index;
        break;
      }
    }
    selected.push(pool[chosenIndex].id);
    pool.splice(chosenIndex, 1);
  }

  return selected;
}

export function findConnectedNeighborIds(nodes, nodeId, connectionDistance, excludeId) {
  const source = nodes[nodeId];
  if (!source) return [];
  const neighbors = [];

  for (let index = 0; index < nodes.length; index += 1) {
    const candidate = nodes[index];
    if (candidate.id === nodeId || candidate.id === excludeId) continue;
    const distance = Math.hypot(candidate.currentX - source.currentX, candidate.currentY - source.currentY);
    if (distance > 12 && distance <= connectionDistance) {
      neighbors.push({ id: candidate.id, distance });
    }
  }

  neighbors.sort((a, b) => a.distance - b.distance);
  return neighbors.map((item) => item.id);
}

export function dischargeEnvelope(progress) {
  if (progress < 0.2) return progress / 0.2;
  if (progress < 0.6) return 1;
  return clamp(1 - (progress - 0.6) / 0.4, 0, 1);
}

export function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

export function generateMicroSparkBranches(originX, originY, radius, branchCount, jitter) {
  const branches = [];
  const count = Math.max(1, branchCount);
  const baseAngle = Math.random() * Math.PI * 2;

  for (let index = 0; index < count; index += 1) {
    const fan = (index - (count - 1) / 2) * 0.85;
    const angle = baseAngle + fan + (Math.random() - 0.5) * 0.55;
    const length = radius * (0.42 + Math.random() * 0.58);
    const endX = originX + Math.cos(angle) * length;
    const endY = originY + Math.sin(angle) * length;
    const segments = 3 + Math.round(Math.random());
    branches.push(generateElectricalArcPoints(originX, originY, endX, endY, segments, jitter));
  }

  return branches;
}
