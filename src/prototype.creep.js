const utilsLoad = require('utils.load');

Creep.prototype.idle = function() {
  const spawn = this.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: s => s.structureType == STRUCTURE_SPAWN
  });
  this.travelTo(spawn, {
      stuckValue: 8
  });
};

Creep.prototype.refund = function() {
  const spawn = this.getHomeSpawn();
  this.travelTo(spawn);
};

Creep.prototype.goHomeRoom = function() {
  // Assume always exists.
  const homeRoom = Game.rooms[this.memory.homeRoom];

  if (homeRoom.name != this.room.name) {
    const home = this.getHomeSpawn();
    this.travelTo(home);
    return true;
  }
  return false;
}

Creep.prototype.getHomeSpawn = function() {
  const homeRoom = Game.rooms[this.memory.homeRoom];

  return homeRoom.find(FIND_STRUCTURES, {
      filter: s => s.structureType == STRUCTURE_SPAWN
  })[0];
}

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
