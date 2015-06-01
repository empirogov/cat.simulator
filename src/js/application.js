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