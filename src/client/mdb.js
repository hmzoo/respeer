module.exports = function() {

    this.tab = [];
    this.tabIndex = {};

    this.exists = function(id) {
        return (id in this.tabIndex)
            ? true
            : false;
    }

    this.getTab = function() {
        return this.tab;
    }

    this.onUpdated = function(tab) {
        console.log(tab);
    }

    this.add = function(id, obj) {

        if (!this.exists(id)) {
            obj.id = id;
            this.tab.push(obj);
            this.tabIndex[id] = this.tab.length - 1;
            this.onUpdated(this.tab);
        } else {
            this.set(id, obj)
        }
    }

    this.del = function(id) {
        if (this.exists(id)) {
            this.tab.splice(this.tabIndex[id], 1);
            delete this.tabIndex[id],
            this.onUpdated(this.tab);
        }
    }

    this.get = function(id) {
        return this.tabIndex[id]
            ? this.tab[this.tabIndex[id]]
            : {};
    }

    this.set = function(id, obj) {
        if (this.exists(id)) {
            for (var key in obj) {
                this.tab[this.tabIndex[id]][key] = obj[key];
            }
    
            this.onUpdated(this.tab);
        }

    }

}
