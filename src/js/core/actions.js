CatSimulator.Action = function (message, parameters) {
    this.message = message;
    this.parameters = parameters;
};

CatSimulator.Action.prototype = {
    minEnergy: 10,
    maxEnergy: 25,
    minHunger: 0,
    maxHunger: 10,
    estimate: function () {
        var prev = CatSimulator.Cat.getParameters(),
            next = CatSimulator.Cat.survive(prev);
        for (var param in this.parameters) {
            if (this.parameters.hasOwnProperty(param) && next.hasOwnProperty(param)) {
                next[param] += this.parameters[param];
            }
        }
        var estimate = next.speed*next.speed +
            (next.energy > this.minEnergy ? 1 : -5) +
            (next.hunger < this.maxHunger ? 1 : -5);

        return Math.max(estimate, 0)
    },
    perform: function () {
        for (var param in this.parameters) {
            if (this.parameters.hasOwnProperty(param) && CatSimulator.Cat.parameters.hasOwnProperty(param)) {
                CatSimulator.Cat.parameters[param] += this.parameters[param];
            }
        }
        CatSimulator.Cat.parameters.energy = Math.min(CatSimulator.Cat.parameters.energy, this.maxEnergy);
        CatSimulator.Cat.parameters.hunger = Math.max(CatSimulator.Cat.parameters.hunger, this.minHunger);
    }
};

CatSimulator.Actions = {
    choose: function () {
        var estimations = [],
            best = 0;
        for (var action in this.list) {
            if (this.list.hasOwnProperty(action)) {
                estimations.push(this.list[action].estimate());
            }
        }
        for (var i = 0; i<estimations.length; i++) {
            if (this.prefer(estimations[i], estimations[best])) {
                best = i;
            }
        }
        return this.list[best]
    },
    prefer: function (estimate1, estimate2) {
        var border = estimate1/(estimate1 + estimate2);
        return (Math.random() < border)
    },
    list: [
        new CatSimulator.Action("SLEEP", {hunger: -0.5, energy: 5}),
        new CatSimulator.Action("EAT", {hunger: -5, energy: -0.5}),
        new CatSimulator.Action("PLAY", {hunger: 2, energy: -5, speed: 0.1}),
        new CatSimulator.Action("HUNT", {hunger: -5, energy: -5, speed: 0.05}),
        new CatSimulator.Action("PURR", {hunger: -0.4, energy: -0.4}),
    ]
};