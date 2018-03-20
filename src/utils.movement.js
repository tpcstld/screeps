
const utilsMovement = {

    isNotInSameRoom: function(creep, obj) {
        return obj.room === undefined || obj.room.name !== creep.room.name;
    },
}
module.exports = utilsMovement;
