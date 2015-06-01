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