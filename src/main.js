const PROTOTYPES = [
  require('prototype.creep'),
];

const ROLES = {
    "upgrade": require('role.upgrader'),
    "build": require("role.builder"),
    "repair": require('role.repairer'),
    'mine': require('role.miner'),
    'run': require('role.runner'),
    'attack': require('role.attacker'),
    'remoteMine': require('role.remote_miner'),
    'remoteRunner': require('role.remote_runner'),
    'general': require('role.general'),
    'heal': require('role.healer'),
    'refill': require('role.refiller'),
    'invader': require('role.invader'),
    'invaderHeal': require('role.invader_healer'),
    'tower': require('role.tower'),
    'link': require('role.link'),
    'link_refiller': require('role.link_refiller'),
};

var Traveler = require('Traveler');

const loopSpawn = require('loop.spawn');
const loopStats = require('loop.stats');

const EconomyAdvisor = require('advisor.economy');

module.exports.loop = function () {
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    const needs = EconomyAdvisor.getNeeds();
    console.log(needs);

    for (let name in Game.spawns) {
        let spawn = Game.spawns[name];
        loopSpawn.run(spawn);
    }

    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.refund) {
            creep.refund();
            continue;
        }
        if (creep.memory.role) {
            ROLES[creep.memory.role].run(creep);
        }
    }

    const towers = _.filter(Game.structures, s => s.structureType === STRUCTURE_TOWER);
    for (let name in towers) {
        const tower = towers[name];
        ROLES["tower"].run(tower);
    }

    const links = _.filter(Game.structures, s => s.structureType == STRUCTURE_LINK);
    for (let name in links) {
        const link = links[name];
        ROLES["link"].run(link);
    }

    loopStats.run();
}
