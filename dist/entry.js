var Entry = {};
window.Entry = Entry;
Entry.Model = function() {
  this.data = {};
};
(function(a) {
  a.get = function(b) {
    return this.data[b];
  };
  a.set = function(b) {
    for (var a in b) {
      this.data[a] = b[a];
    }
  };
})(Entry.Model.prototype);
Entry.ObserverModel = function() {
  this.base();
  this._observers = [];
};
Entry.ObserverModel.prototype = new Entry.Model;
(function(a) {
  a.base = Entry.Model;
  a.set = function(b) {
    this.base.prototype.set.call(this, b);
    this.notify();
  };
  a.observe = function(b) {
    this._observers.push(b);
  };
  a.unobserve = function(b) {
    for (var a in this._observers) {
      if (this._observers[a] === b) {
        return this._observers.splice(a, 1), !0;
      }
    }
    return !1;
  };
  a.notify = function() {
    var a = Array.prototype.slice.call(arguments, 0), c;
    for (c in this._observers) {
      this._observers[c].update.apply(null, a);
    }
  };
})(Entry.ObserverModel.prototype);

