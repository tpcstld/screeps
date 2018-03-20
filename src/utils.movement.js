
const utilsMovement = {

    isNotInSameRoom: function(creep, obj) {
        return obj.room === undefined || obj.room.name !== creep.room.name;
    },

    moveToIdle: function(creep) {
        creep.travelTo(Game.flags["Idle"].pos, {
            stuckValue: 8
        });
    }
}
module.exports = utilsMovement;
