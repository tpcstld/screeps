Creep.prototype.idle = function() {
  creep.travelTo(Game.flags["Idle"].pos, {
      stuckValue: 8
  });
};
