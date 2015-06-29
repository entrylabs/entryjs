var Entry = {};
window.Entry = Entry;
Entry.Model = function() {
  this.data = {};
};
(function(c) {
  c.get = function(a) {
    return this.data[a];
  };
  c.set = function(a) {
    for (var b in a) {
      this.data[b] = a[b];
    }
  };
})(Entry.Model.prototype);
Entry.LoopModel = function() {
  this.base();
  this._observers = [];
};
Entry.LoopModel.prototype = new Entry.Model;
(function(c) {
  c.base = Entry.Model;
  c.bind = function(a) {
    this._observers.push(a);
  };
  c.unbind = function(a) {
    for (var b in this._observers) {
      if (this._observers[b] === a) {
        return this._observers.splice(b, 1), !0;
      }
    }
    return !1;
  };
  c.notify = function() {
    var a = Array.prototype.slice.call(arguments, 0), b;
    for (b in this._observers) {
      this._observers[b].update.apply(null, a);
    }
  };
})(Entry.LoopModel.prototype);
Entry.ObserverModel = function() {
  this.base();
  this._observers = [];
};
Entry.ObserverModel.prototype = new Entry.Model;
(function(c) {
  c.base = Entry.Model;
  c.set = function(a) {
    this.base.prototype.set.call(this, a);
    this.notify();
  };
  c.observe = function(a) {
    this._observers.push(a);
  };
  c.unobserve = function(a) {
    for (var b in this._observers) {
      if (this._observers[b] === a) {
        return this._observers.splice(b, 1), !0;
      }
    }
    return !1;
  };
  c.notify = function() {
    var a = Array.prototype.slice.call(arguments, 0), b;
    for (b in this._observers) {
      this._observers[b].update.apply(null, a);
    }
  };
})(Entry.ObserverModel.prototype);

