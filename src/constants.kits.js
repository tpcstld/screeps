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
  'refill': (energy, room) => [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
  'upgrade': (energy, room) => {
    const goodLink = room.controller.pos.findInRange(FIND_STRUCTURES, 3, {
        filter: s => s.structureType == STRUCTURE_LINK
    })[0];
    if (!goodLink) {
      return resolveTemplate([WORK, CARRY, MOVE], Math.min(energy, 900));
    }

    let linkCreepEnergy = 900;
    const storage = room.storage;
    if (storage && storage.store[RESOURCE_ENERGY] >= 250000) {
      linkCreepEnergy = 1000;
    }

    return resolveTemplate([WORK], Math.min(energy - 150, linkCreepEnergy)).concat([CARRY, MOVE, MOVE]);
  },
  'repair': (energy, room) => resolveTemplate([WORK, CARRY, MOVE], Math.min(energy, 800)),
  'build': (energy, room) => resolveTemplate([WORK, CARRY, MOVE], Math.min(energy, 800)),
  'mine': (energy, room) => resolveTemplate([WORK], Math.min(energy - 50, 500)).concat([MOVE]),
  'run': (energy, room) => resolveTemplate([CARRY, CARRY, MOVE], Math.min(energy, 600)),
  'invader': (energy, room) => resolveTemplate([ATTACK, TOUGH, MOVE], Math.min(energy, 600)),
  'link_refiller': (energy, room) => [CARRY, MOVE],
  'colonize': (energy, room) => [CLAIM, MOVE],
  'general': (energy, room) => [WORK, CARRY, MOVE],
  'transport': (energy, room) => resolveTemplate([CARRY, CARRY, MOVE], Math.min(energy, 1200)),
};

module.exports = kits;
