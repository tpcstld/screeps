const ROLES = {
  'mine': require('role.miner'),
  'upgrade': require('role.upgrader'),
  'repair': require('role.repairer'),
  'build': require('role.builder'),
  'colonize': require('role.colonizer'),
  'tower': require('role.tower'),
};

const NeedAssigner = {

  assignNeedsToCreeps: function(container) {
    const towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    for (let name in towers) {
      const tower = towers[name];

      ROLES["tower"].run(tower, container);
    }

    for (let name in Game.creeps) {
      const creep = Game.creeps[name];

      const role = ROLES[creep.memory.role];
      if (!role) {
        continue;
      }

      const needs = container.getNeeds();
      const chosenNeed = role.getNeed(creep, needs);

      role.run(creep, chosenNeed);
      container.fulfillNeed(chosenNeed);
    }

  }
}

module.exports = NeedAssigner;
