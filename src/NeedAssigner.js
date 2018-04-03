const ROLES = {
  'mine': require('role.miner'),
  'upgrade': require('role.upgrader'),
  'repair': require('role.repairer'),
  'build': require('role.builder'),
  'colonize': require('role.colonizer'),
};

const NeedAssigner = {

  assignNeedsToCreeps: function(container) {
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
