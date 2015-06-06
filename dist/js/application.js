CatSimulator = {
    add: function (key, something) {
        if (this.hasOwnProperty(key)) {
            throw new Error("Poor cat can\'t take this anymore!")
        }
        this[key] = something;
        if (something.hasOwnProperty("onAdd")) {
            something["onAdd"].call(this);
        }
    }
};
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
CatSimulator.Cat = {
    birthday: new Date(),
    parameters: {
        speed: 1,
        energy: 15,
        hunger: 0,
        age: 0
    },
    born: function () {
        this.birthday.setHours(0);
        CatSimulator.UI.log("CAT_WAS_BORN");
        this.takeAnAction();
    },
    getParameters: function () {
        return {
            speed: this.parameters.speed,
            energy: this.parameters.energy,
            hunger: this.parameters.hunger,
            age: this.parameters.age
        }
    },
    isAlive: function () {
        return this.parameters.energy > 0 && this.parameters.hunger < 25
    },
    survive: function (params) {
        return {
            hunger: params.hunger + params.speed,
            age: params.age + 1/params.speed,
            energy: params.energy - params.speed,
            speed: params.speed - params.age/10000
        }
    },
    takeAnAction: function () {
        var action = CatSimulator.Actions.choose();
        this.parameters = this.survive(this.parameters);
        action.perform();
        CatSimulator.UI.log(action.message);
        CatSimulator.UI.renderSidebar();
        if (this.isAlive()) {
            setTimeout(function () {
                CatSimulator.Cat.takeAnAction()
            }, 5000)
        } else {
            CatSimulator.UI.log("CAT_DIED");
        }
    }
};
CatSimulator.Messages = {
    DAY: "Day",
    HOUR: ":00",
    CAT_WAS_BORN: "New Cat was born! Long live the Cat!",
    CAT_DIED: "Poor lazy Cat died. It was your fault!",
    SLEEP: "Cat gracefully sleeping.",
    EAT: "Cat violently eats some food. Food silently disappears.",
    PLAY: "Cat playing with optical mouse. Optical mouse strikes ferocious pose, its single eye glowing with fury.",
    HUNT: "Cat chasing down large angry cockroach. Angry cockroach babbling some nonsense of diverse pussies.",
    PURR: "Cat peacefully purrs."
};
CatSimulator.UI = {
    chronicle: document.getElementById("chronicle"),
    sidebar: document.getElementById("sidebar"),
    log: function (message) {
        message = (CatSimulator.Messages.hasOwnProperty(message))? CatSimulator.Messages[message] : message;
        var text = document.createTextNode(message);
        var entry = document.createElement("p");
        entry.className += "chronicle-entry";
        entry.appendChild(this.time());
        entry.appendChild(text);
        this.chronicle.appendChild(entry);
        this.chronicle.scrollTop = this.chronicle.scrollHeight;
    },
    breaker: function () {
        return document.createElement("br");
    },
    time: function () {
        var time = document.createElement("span");
        time.className += "chronicle-time";
        time.innerHTML = CatSimulator.Utils.getAge();
        return time;
    },
    renderSidebar: function () {
        var params = CatSimulator.Cat.getParameters(),
            holder = document.createDocumentFragment();
        sidebar.innerHTML = "<pre>   ^-^<br/> =' . '=<br/></pre>";
        for (var prop in params) {
            if (params.hasOwnProperty(prop)) {
                var key = document.createElement("span");
                key.className += "sidebar-key";
                key.innerHTML = prop;
                holder.appendChild(key);

                var val = document.createElement("span");
                val.className += "sidebar-value";
                val.innerHTML = params[prop].toFixed(2);
                holder.appendChild(val);
            }
        }
        sidebar.appendChild(holder);
    }
};
CatSimulator.Utils = {
    oneHour: 60*60*1000,
    oneDay: 24*60*60*1000,
    formatAge: function (age) {
        return [
            CatSimulator.Messages.DAY,
            Math.ceil(age/this.oneDay),
            Math.ceil(age/this.oneHour % 24) + CatSimulator.Messages.HOUR
        ].join(" ")
    },
    getAge: function () {
        var now = new Date(CatSimulator.Cat.birthday);
        now.setHours(now.getHours() + CatSimulator.Cat.parameters.age);
       return this.formatAge(now - CatSimulator.Cat.birthday)
    }
};