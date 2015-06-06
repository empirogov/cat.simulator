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