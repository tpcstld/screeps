const PROTOTYPES = [
  require('prototype.creep'),
];

const ROLES = {
    'attack': require('role.attacker'),
    'remoteMine': require('role.remote_miner'),
    'remoteRunner': require('role.remote_runner'),
    'general': require('role.general'),
    'heal': require('role.healer'),
    'refill': require('role.refiller'),
    'invader': require('role.invader'),
    'invaderHeal': require('role.invader_healer'),
    'link': require('role.link'),
    'link_refiller': require('role.link_refiller'),
};

var Traveler = require('Traveler');

const loopSpawn = require('loop.spawn');
const loopStats = require('loop.stats');

const advisors = [
  require('advisor.command'),
  require('advisor.defend'),
  require('advisor.economy'),
  require('advisor.upgrade'),
  require('advisor.transport'),
  require('advisor.logistics'),
  require('advisor.build'),
];

const processors = [
  require('processor.spawn')
];

const NeedContainer = require('NeedContainer');
const NeedAssigner = require('NeedAssigner');

module.exports.loop = function () {
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    const container = new NeedContainer();
    for (let name in advisors) {
      const advisor = advisors[name];
      container.addNeeds(advisor.getCreepNeeds());
    }

    NeedAssigner.assignNeedsToCreeps(container);

    let needs = container.getNeeds();

    for (let name in advisors) {
      const advisor = advisors[name];
      needs = needs.concat(advisor.getSpawnNeeds(needs));
    }

    if (needs.length > 0) {
      console.log(JSON.stringify(needs));
    }

    for (let name in processors) {
      const processor = processors[name];
      processor.solveNeeds(needs);
    }

    loopSpawn.run(Game.spawns["Spawn1"])

    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.refund) {
            creep.refund();
            continue;
        }

        const role = ROLES[creep.memory.role];
        if (role) {
          role.run(creep);
        }
    }

    const links = _.filter(Game.structures, s => s.structureType == STRUCTURE_LINK);
    for (let name in links) {
        const link = links[name];
        ROLES["link"].run(link);
    }

    loopStats.run(container);
}
