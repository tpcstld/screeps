
const CommandAdvisor = {

  getNeeds: function() {
    let needs = [];
    return needs;
  },

  colonize: function() {
    const flag = Game.flags["Colony"];
    if (!flag) {
      return;
    }
  }
};

module.exports = CommandAdvisor;
