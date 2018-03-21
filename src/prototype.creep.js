const utilsLoad = require('utils.load');

Creep.prototype.idle = function() {
  this.travelTo(Game.flags["Idle"].pos, {
      stuckValue: 8
  });
};

Creep.prototype.refund = function() {
  const spawn = Game.spawns["Spawn1"];
  this.travelTo(spawn);
};

Creep.prototype.takeResource = function(resource, force) {
  // From storage.
  // TODO: Load balance.
  const storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: c => c.structureType === STRUCTURE_STORAGE
        && c.store[resource] > 0
  });

  // TODO: From container.
};

Creep.prototype.dropOffResource = function(resource) {
  const storage = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: s => s.structureType === STRUCTURE_STORAGE
  });

  // TODO: Handle case with no storage (before RCL4).
  if (!storage) {
    return ERR_NOT_FOUND;
  }

  if (this.transfer(storage, resource) == ERR_NOT_IN_RANGE) {
    this.travelTo(storage);
  }
  return OK;
};
