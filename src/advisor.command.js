
const CommandAdvisor = {

  getNeeds: function() {
    let needs = [];
    needs = needs.concat(this.colonize());
    return needs;
  },

  colonize: function() {
    const needs = []
    const flag = Game.flags["Colony"];
    if (!flag) {
      return needs;
    }

    const colonizers = _.filter(Game.creeps, c => c.memory.role == "colonize");
    if (colonizers.length < 0) {
      // TODO: Closest room should spawn the colonizer.
      const room = Game.spawns["Spawn1"].room;

      needs.push({
          type: "spawn",
          role: "colonize",
          room: room.name,
      });
    }

    return needs;
  }
};

module.exports = CommandAdvisor;
