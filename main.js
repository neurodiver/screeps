/*
    Главный скрипт управления колонией
*/

// загрузка модулей управления
var roleHarvester = require('role.harvester'); // модуль управления собирателями
var roleUpgrader = require('role.upgrader');   // модуль управления апгрейдерами
var roleBuilder = require('role.builder');    // модуль управления строителями

// главный цикл уплавления
module.exports.loop = function () {
    // цикл очистки памяти
    for (var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    // перебираем крипов
    for (let name in Game.creeps) {

        var creep = Game.creeps[name];

        // если крип является собирателем
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep); // запускаем функцию управления собирателем из модуля
        }
        // если крип является апгрейдером
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep); // запускаем функцию управления апгрейдером из модуля
        }
        // если крип является строителем
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep); // запускаем функцию управления строителем из модуля
        }
    }
        // инициализация переменных
        name = undefined; // идентификатор крипа
        var minHarvestersPopulation = 10; // минимально допустимое количество собирателей
        var minUpgradersPopulation = 5; // минимально допустимое количество апгрейдеров
        var minBuildersPopulation = 5; // минимально допустимое количество строителей

        var numHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester'); // текуцее количество собирателей
        var numUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader'); // текуцее количество собирателей
        var numBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder'); // текуцее количество собирателей
        // если не достигнута минимальная популяция собирателей
        if (numHarvesters < minHarvestersPopulation){
            // создаем собирателя и отправляем собирать ресурсы
            name = Game.spawns.S_01.createCreep([WORK,WORK,CARRY,MOVE], undefined,
                {role: 'harvester', harvesting: true});
        }
        // если не достигнута минимальная популяция апгрейдеров
        else if (numUpgraders < minUpgradersPopulation) {
            // создаем апгрейдера и отправляем собирать ресурсы
            name = Game.spawns.S_01.createCreep([WORK,CARRY,MOVE,MOVE], undefined,
                {role: 'upgrader', harvesting: true});
        }
        // если не достигнута минимальная популяция строителей
        else if (numBuilders < minBuildersPopulation) {
            // создаем строителя и отправляем собирать ресурсы
            name = Game.spawns.S_01.createCreep([WORK,WORK,CARRY,MOVE], undefined,
                {role: 'builder', harvesting: true});
        }
        // если всего хватает
        else {
            // создаем строителя и отправляем собирать ресурсы в расчёте на то, что если строить будет нечего,
            // он станет апгрейдером, согласно логике в role.builder
            name = Game.spawns.S_01.createCreep([WORK,WORK,CARRY,MOVE], undefined,
                {role: 'builder', harvesting: true});
        }

        // выводим в консоль сообщение о создании крипа
        if (!(name < 0)) {
            console.log("New creep spawned: " + name);
        }

    if (Game.time % 60 == 0) {
        console.log("==> Summary Report. Harvesters: " + numHarvesters + ", upgraders: " + numUpgraders + ", builders: " + numBuilders);
    }

};
