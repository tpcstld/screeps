function resolveTemplate(parts, energy) {
  const templateCost = _.sum(parts, p => BODYPART_COST[p]);
  const times = Math.floor(energy / templateCost);

  let body = [];
  for (let i = 0; i < times; i++) {
    body = body.concat(parts);
  }
  return body;
}

const kits = {
  'refill': (energy) => [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
  'upgrade': (energy) => resolveTemplate([WORK], Math.min(energy - 150, 900)).concat([CARRY, MOVE, MOVE]),
  'repair': (energy) => resolveTemplate([WORK, CARRY, MOVE], Math.min(energy, 800)),
  'build': (energy) => resolveTemplate([WORK, CARRY, MOVE], Math.min(energy, 800)),
  'mine': (energy) => resolveTemplate([WORK], Math.min(energy - 50, 500)).concat([MOVE]),
  'run': (energy) => resolveTemplate([CARRY, CARRY, MOVE], Math.min(energy, 600)),
  'link_refiller': (energy) => [CARRY, MOVE],
  'colonize': (energy) => [CLAIM, MOVE],
  'general': (energy) => [WORK, CARRY, MOVE],
};

module.exports = kits;
