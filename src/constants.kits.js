function resolveTemplate(parts, energy) {
  const templateCost = _.sum(parts, p => BODYPART_COST[p]);
  const times = Math.floor(energy, templateCost);

  let body = [];
  for (let i = 0; i < times; i++) {
    body = body.concat(parts);
  }
  return body;
}

const kits = {
  'refill': (energy) => [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
  'mine': (energy) => resolveTemplate([WORK], Math.min(energy, 500)).concat([MOVE]),
};

module.exports = kits;
