
const roleTower = {

    run: function(tower) {
        let target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: _.filter(creep.body, p => p.type == HEAL).length > 0
        });

        if (!target) {
          target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        }

        if (target) {
            tower.attack(target);
        }
    }
};

module.exports = roleTower;
