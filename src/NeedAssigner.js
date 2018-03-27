
const ROLES = {
  'mine': require('role.miner')
};

class NeedAssigner {

  assignNeedsToCreeps(container) {
    for (let name in Game.creeps) {
      const creep = Game.creeps["name"];

      const role = ROLES[creep.memory.role];
      if (!role) {
        continue;
      }

      const needs = container.getNeeds();
      const chosenNeed = role.getNeed(needs);
      if (!chosenNeed)  {
        continue;
      }

      role.run(creep, chosenNeed);
      container.fulfillNeed(chosenNeed);
    }
  }
}

module.exports = NeedAssigner;
