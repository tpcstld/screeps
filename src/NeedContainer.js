
class NeedContainer {

  constructor() {
    this.needs = [];
  }

  addNeeds(newNeeds) {
    for (let i in newNeeds) {
      const need = newNeeds[i];
      this.needs.push(need);
    }
  }

  fulfillNeed(need) {
    // Objects are by-reference.
    need.fulfilled = true;
  }

  getNeeds(opts) {
    if (!opts) {
      opts = {};
    }

    let needs = this.needs;

    if (!opts.filter) {
      needs = _.filter(needs, opts.filter);
    }
    needs = _.filter(needs, n => !n.fulfilled);

    return needs;
  }
}

module.exports = NeedContainer;
