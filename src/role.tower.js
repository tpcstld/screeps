
const roleTower = {
    
    run: function(tower) {
        const target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            tower.attack(target);
        }
    }
};

module.exports = roleTower;