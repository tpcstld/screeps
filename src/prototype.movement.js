Creep.prototype.idle = function() {
  this.travelTo(Game.flags["Idle"].pos, {
      stuckValue: 8
  });
};
