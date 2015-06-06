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