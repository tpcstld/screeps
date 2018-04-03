const utilsFind = require('utils.find');
const constants = require('utils.constants');

const BuildAdvisor = {

  getCreepNeeds: function() {
    let needs = [];

    needs = needs.concat(this.getNeedsForConstructionSites());
    needs = needs.concat(this.getNeedsForRepair());

    return needs;
  },

  getSpawnNeeds: function(needs) {
    const output = [];

    // Builders
    const buildNeeds = _.filter(needs, n => n.type == "build");
    const builders = _.filter(Game.creeps, c => c.memory.role == "build");
    const numBuilders = Math.ceil(buildNeeds.length / 4 - builders.length);

    for (let i = 0; i < numBuilders; i++) {
      output.push({
          type: "spawn",
          role: "build",
          room: utilsFind.findClosestOwnedRoom(Game.getObjectById(buildNeeds[0].target).room).name
      });
    }

    // Repairers
    const repairNeeds = _.filter(needs, n => n.type == "repair");
    const repairers = _.filter(Game.creeps, c => c.memory.role == "repair");
    const numRepairers = Math.ceil(repairNeeds.length / 4 - repairers.length);

    for (let i = 0; i < numRepairers; i++) {
      output.push({
          type: "spawn",
          role: "repair",
          room: utilsFind.findClosestOwnedRoom(Game.getObjectById(repairNeeds[0].target).room).name
      });
    }

    return output;
  },

  getNeedsForConstructionSites: function() {
    const needs = [];
    for (let name in Game.constructionSites) {
      const site = Game.constructionSites[name];

      const numWorkItems = Math.floor(site.progressTotal / 1500);
      for (let i = 0; i < numWorkItems; i++) {
        needs.push({
            type: 'build',
            target: site.id,
        });
      }
    }

    return needs;
  },

  getNeedsForRepair: function() {
    const needs = [];

    // TODO: Exclude rooms.
    let targets = utilsFind.findInEveryRoom(FIND_STRUCTURES, {
        filter: s => s.hits / s.hitsMax < 0.9
          && (!constants.MAX_HP[s.structureType] || s.hits < constants.MAX_HP[s.structureType])
    });

    targets = _.sortBy(targets, t => t.hits / t.hitsMax);
    for (let name in targets) {
      const target = targets[name];
      needs.push({
          type: 'repair',
          target: target.id,
      });
    }

    return needs;
  },
};

module.exports = BuildAdvisor;
