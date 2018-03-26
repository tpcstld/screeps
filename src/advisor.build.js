const utilsFind = require('utils.find');
const constants = require('utils.constants');

const BuildAdvisor = {

  getNeeds: function() {
    let needs = [];

    needs = needs.concat(this.getNeedsForConstructionSites());
    needs = needs.concat(this.getNeedsForRepair());

    return needs;
  },

  getNeedsForConstructionSites: function() {
    const needs = [];
    for (let name in Game.constructionSites) {
      const site = Game.constructionSites[name];
      needs.push({
          type: 'build',
          site: site,
      });
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
          id: target.id,
      });
    }

    return needs;
  },
};

module.exports = BuildAdvisor;
