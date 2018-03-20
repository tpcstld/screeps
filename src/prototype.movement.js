Creep.prototype.idle = function() {
  this.travelTo(Game.flags["Idle"].pos, {
      stuckValue: 8
  });
};

Creep.prototype.refund = function() {
  const spawn = Game.spawns["Spawn1"];
  this.travelTo(spawn);
}
