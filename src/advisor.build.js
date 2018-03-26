
const BuildAdvisor = {

  getNeeds: function() {
    let needs = [];

    needs = needs.concat(this.getNeedsForConstructionSites());

    return needs;
  },

  getNeedsForConstructionSites() {
    const needs = [];
    for (let name in Game.constructionSites) {
      const site = Game.constructionSites[name];
      needs.push({
          type: 'build',
          site: site,
      });
    }

    return needs;
  }
};

module.exports = BuildAdvisor;
