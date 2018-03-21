Creep.prototype.idle = function() {
  this.travelTo(Game.flags["Idle"].pos, {
      stuckValue: 8
  });
};

Creep.prototype.refund = function() {
  const spawn = Game.spawns["Spawn1"];
  this.travelTo(spawn);
};

Creep.prototype.takeResource = function() {
};

Creep.prototype.dropOffResource = function() {
  const storage = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s => s.structureType === STRUCTURE_STORAGE
  });

  // TODO: Handle case with no storage (before RCL4).
  if (!storage) {
    return ERR_NOT_FOUND;
  }

  if (this.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    this.travelTo(storage);
  }
  return OK;
};
