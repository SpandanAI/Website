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

function rayViewportReach(x, y, angle, width, height, margin) {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  let reach = Number.POSITIVE_INFINITY;
  if (dx > 0.001) reach = Math.min(reach, (width - margin - x) / dx);
  else if (dx < -0.001) reach = Math.min(reach, (margin - x) / dx);
  if (dy > 0.001) reach = Math.min(reach, (height - margin - y) / dy);
  else if (dy < -0.001) reach = Math.min(reach, (margin - y) / dy);
  return Math.max(0, Number.isFinite(reach) ? reach : 0);
}

function pickInwardAngle(originX, originY, width, height, desiredLength) {
  const margin = 10;
  const samples = [];
  for (let index = 0; index < 12; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    samples.push({
      angle,
      reach: rayViewportReach(originX, originY, angle, width, height, margin)
    });
  }
  samples.sort((a, b) => b.reach - a.reach);
  const usable = samples.filter((sample) => sample.reach >= Math.min(desiredLength * 0.65, 22));
  const pool = usable.length ? usable.slice(0, 4) : samples.slice(0, 3);
  return pool[Math.floor(Math.random() * pool.length)];
}

function pointAlongPolyline(points, t) {
  if (points.length === 1) return { ...points[0], heading: 0 };
  const clamped = clamp(t, 0, 1);
  let total = 0;
  const lengths = [];
  for (let index = 1; index < points.length; index += 1) {
    const segment = Math.hypot(points[index].x - points[index - 1].x, points[index].y - points[index - 1].y);
    lengths.push(segment);
    total += segment;
  }
  if (total <= 0) {
    return { x: points[0].x, y: points[0].y, heading: 0 };
  }
  let remaining = clamped * total;
  for (let index = 0; index < lengths.length; index += 1) {
    const segment = lengths[index];
    if (remaining > segment && index < lengths.length - 1) {
      remaining -= segment;
      continue;
    }
    const start = points[index];
    const end = points[index + 1];
    const ratio = segment > 0 ? remaining / segment : 0;
    return {
      x: start.x + (end.x - start.x) * ratio,
      y: start.y + (end.y - start.y) * ratio,
      heading: Math.atan2(end.y - start.y, end.x - start.x)
    };
  }
  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  return { x: last.x, y: last.y, heading: Math.atan2(last.y - prev.y, last.x - prev.x) };
}

function shuffleInPlace(list) {
  for (let index = list.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    const temp = list[index];
    list[index] = list[swap];
    list[swap] = temp;
  }
  return list;
}

function generateJaggedPath(startX, startY, angle, length, options = {}) {
  const width = options.width;
  const height = options.height;
  const margin = options.margin ?? 8;
  const kinkScale = options.kinkScale ?? 1;
  const followThenDiverge = Boolean(options.followThenDiverge);
  const divergeSide = options.divergeSide ?? 1;
  const forcedSteps = options.steps;
  const minX = margin;
  const maxX = Math.max(margin, width - margin);
  const minY = margin;
  const maxY = Math.max(margin, height - margin);

  let steps = forcedSteps;
  if (!steps) {
    if (length < 14) steps = 2;
    else if (length < 22) steps = 2 + (Math.random() < 0.45 ? 1 : 0);
    else if (length < 34) steps = 4;
    else if (length < 46) steps = 5;
    else steps = 6;
  }

  const points = [{ x: startX, y: startY }];
  let x = startX;
  let y = startY;
  let heading = angle;
  let remaining = length;

  for (let step = 1; step <= steps; step += 1) {
    const last = step === steps;
    const portion = last ? 1 : randomInRange(0.18, 0.44);
    let stepLength = remaining * (last ? 1 : Math.min(portion, 0.55));
    if (!last) remaining = Math.max(3, remaining - stepLength);

    if (followThenDiverge && step === 2) {
      heading = angle + divergeSide * randomInRange(0.65, 1.28);
    } else {
      const amp = (step === 1 ? 0.2 : 0.52) * kinkScale;
      heading += (Math.random() - 0.5) * 2 * amp;
      if (step === 3 || (steps >= 5 && step === 5)) {
        heading = heading * 0.56 + angle * 0.44;
      }
    }

    const reach = rayViewportReach(x, y, heading, width, height, margin);
    stepLength = Math.min(stepLength, Math.max(3.2, reach * 0.9));
    x += Math.cos(heading) * stepLength;
    y += Math.sin(heading) * stepLength;
    points.push({
      x: clamp(x, minX, maxX),
      y: clamp(y, minY, maxY)
    });
  }

  return { points, heading };
}

function pickSecondaryCount(variant, compact) {
  if (variant === "directional") return Math.random() < 0.82 ? 1 : 2;
  if (variant === "crack") {
    if (compact) return Math.random() < 0.68 ? 2 : 3;
    const roll = Math.random();
    if (roll < 0.48) return 2;
    if (roll < 0.9) return 3;
    return 4;
  }
  if (variant === "energy") return Math.random() < 0.72 ? 1 : 2;

  const roll = Math.random();
  if (roll < 0.08) return 0;
  if (roll < 0.68) return 1;
  if (compact) return Math.random() < 0.78 ? 1 : 2;
  if (roll < 0.94) return 2;
  return 3;
}

function pickBranchAnchors(count) {
  if (count <= 0) return [];
  if (count === 1) {
    return [Math.random() < 0.58 ? randomInRange(0.2, 0.4) : randomInRange(0.54, 0.8)];
  }
  if (count === 2) {
    return [randomInRange(0.14, 0.32), randomInRange(0.64, 0.88)];
  }
  const bands = [
    [0.14, 0.3],
    [0.46, 0.6],
    [0.7, 0.9]
  ];
  const anchors = [];
  for (let index = 0; index < count; index += 1) {
    const band = bands[index % bands.length];
    anchors.push(randomInRange(band[0], band[1]));
  }
  return anchors;
}

function pickAsymmetricSides(count) {
  if (count <= 0) return [];
  const major = Math.random() < 0.5 ? 1 : -1;
  if (count === 1) return [major];
  if (count === 2) {
    if (Math.random() < 0.64) return [major, major];
    return [major, -major];
  }
  const sides = [];
  for (let index = 0; index < count; index += 1) {
    sides.push(index === 1 ? -major : major);
  }
  return shuffleInPlace(sides);
}

function distinctBranchLengths(count, min, max) {
  if (count <= 0) return [];
  if (count === 1) return [randomInRange(min, max * 0.92)];
  if (count === 2) {
    const longer = randomInRange(min + (max - min) * 0.48, max);
    const shorter = randomInRange(min, Math.min(max * 0.52, longer * 0.62));
    return [longer, shorter];
  }
  const span = Math.max(4, max - min);
  const lengths = [];
  for (let index = 0; index < count; index += 1) {
    const slotMin = min + (span * index) / count;
    const slotMax = min + (span * (index + 1)) / count;
    lengths.push(randomInRange(slotMin, slotMax));
  }
  lengths.sort((a, b) => b - a);
  return lengths;
}

function generateSecondaryBranch(fork, primaryAngle, length, side, options) {
  const followThenDiverge = Boolean(options.followThenDiverge);
  const spread = side * randomInRange(0.48, 1.22) + (Math.random() - 0.5) * 0.22;
  const angle = followThenDiverge ? fork.heading * 0.35 + primaryAngle * 0.65 : fork.heading + spread;
  const reach = rayViewportReach(fork.x, fork.y, angle, options.width, options.height, 8);
  const clampedLength = Math.min(length, Math.max(8, reach * 0.9));
  return generateJaggedPath(fork.x, fork.y, angle, clampedLength, {
    width: options.width,
    height: options.height,
    margin: 8,
    kinkScale: 0.92,
    followThenDiverge,
    divergeSide: side,
    steps: clampedLength < 16 ? 2 : 2 + (Math.random() < 0.5 ? 1 : 0)
  });
}

export function generateClickDischarge(originX, originY, width, height, options = {}) {
  const compact = Boolean(options.compact);
  const roll = Math.random();
  let variant = "normal";
  if (roll < 0.05) variant = "energy";
  else if (roll < 0.2) variant = "crack";
  else if (roll < 0.45) variant = "directional";

  let primaryMin = compact ? 24 : 30;
  let primaryMax = compact ? 45 : 55;
  if (variant === "directional") {
    primaryMin = compact ? 32 : 46;
    primaryMax = compact ? 48 : 65;
  } else if (variant === "crack") {
    primaryMin = compact ? 22 : 28;
    primaryMax = compact ? 36 : 40;
  }

  const desiredLength = randomInRange(primaryMin, primaryMax);
  const chosen = pickInwardAngle(originX, originY, width, height, desiredLength);
  const primaryLength = Math.min(desiredLength, Math.max(18, chosen.reach * 0.92));
  const primary = generateJaggedPath(originX, originY, chosen.angle, primaryLength, {
    width,
    height,
    margin: 10,
    kinkScale: variant === "crack" ? 1.15 : 1
  });

  const branches = [primary.points];
  const branchLives = [1];
  const branchLevels = ["primary"];
  const branchWeights = [1];
  const secondaryCount = pickSecondaryCount(variant, compact);
  const anchors = pickBranchAnchors(secondaryCount);
  const sides = pickAsymmetricSides(secondaryCount);
  const lengths = distinctBranchLengths(
    secondaryCount,
    compact ? 10 : 11,
    compact ? 24 : 30
  );

  for (let index = 0; index < secondaryCount; index += 1) {
    const fork = pointAlongPolyline(primary.points, anchors[index]);
    const followThenDiverge = index === 0 && Math.random() < 0.32;
    const secondary = generateSecondaryBranch(fork, chosen.angle, lengths[index], sides[index], {
      width,
      height,
      followThenDiverge
    });
    const isLead = index === 0;
    const isQuiet = index >= 2;
    branches.push(secondary.points);
    branchLevels.push("secondary");
    branchWeights.push(
      isLead ? randomInRange(0.72, 0.8) : isQuiet ? randomInRange(0.48, 0.58) : randomInRange(0.56, 0.66)
    );
    branchLives.push(
      isLead ? randomInRange(0.7, 0.88) : isQuiet ? randomInRange(0.48, 0.64) : randomInRange(0.54, 0.72)
    );
  }

  const allowTertiary =
    (variant === "energy" && secondaryCount > 0) ||
    (secondaryCount === 1 && variant !== "directional" && Math.random() < 0.12);
  if (allowTertiary) {
    const host = branches[1];
    const fork = pointAlongPolyline(host, randomInRange(0.42, 0.78));
    const tertiarySide = Math.random() < 0.5 ? 1 : -1;
    const tertiaryAngle = fork.heading + tertiarySide * randomInRange(0.7, 1.2);
    const tertiaryLength = randomInRange(6, 11);
    const reach = rayViewportReach(fork.x, fork.y, tertiaryAngle, width, height, 8);
    const length = Math.min(tertiaryLength, Math.max(5, reach * 0.9));
    const tertiary = generateJaggedPath(fork.x, fork.y, tertiaryAngle, length, {
      width,
      height,
      margin: 8,
      kinkScale: 0.7,
      steps: 2
    });
    branches.push(tertiary.points);
    branchLevels.push("tertiary");
    branchWeights.push(randomInRange(0.46, 0.56));
    branchLives.push(randomInRange(0.46, 0.64));
  }

  const fragments = [];
  const fragmentLives = [];
  const fragmentCount = Math.random() < 0.64 ? 0 : Math.round(randomInRange(1, 2));
  for (let index = 0; index < fragmentCount; index += 1) {
    const host = branches[Math.floor(Math.random() * branches.length)];
    const tip = host[host.length - 1];
    const prev = host[Math.max(0, host.length - 2)];
    const heading = Math.atan2(tip.y - prev.y, tip.x - prev.x) + (Math.random() - 0.5) * 1.05;
    const length = randomInRange(4, 7);
    const fragment = generateJaggedPath(tip.x, tip.y, heading, length, {
      width,
      height,
      margin: 6,
      kinkScale: 0.55,
      steps: 2
    });
    fragments.push(fragment.points);
    fragmentLives.push(randomInRange(0.36, 0.54));
  }

  return {
    branches,
    fragments,
    branchLives,
    fragmentLives,
    branchLevels,
    branchWeights,
    variant,
    primaryLength,
    secondaryCount
  };
}
