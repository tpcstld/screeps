
const roleTower = {

  run: function(tower, container) {
    let target = this.findHostileTarget(tower);
    if (target) {
      tower.attack(target);
      return;
    }

    target = this.findRepairTarget(tower, container);
    if (target) {
      tower.repair(target);
      return;
    }
  },

  findHostileTarget: function(tower) {
    let target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
        filter: c => _.filter(c.body, p => p.type == HEAL).length > 0
    });

    if (!target) {
      target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    }

    return target;
  },

  findRepairTarget: function(tower, container) {
    const needs = container.getNeeds();
    const repairNeed = _.filter(needs, n => n.type == "repair")[0];

    if (!repairNeed) {
      return null;
    }

    container.fulfillNeed(repairNeed);
    return Game.getObjectById(repairNeed.target);
  },
};

module.exports = roleTower;
