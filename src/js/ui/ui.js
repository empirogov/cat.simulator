CatSimulator.UI = {
    chronicle: document.getElementById("chronicle"),
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
    }
};