var Entry = {};
window.Entry = Entry;
Entry.Model = function() {
  this.data = {};
};
(function(a) {
  a.get = function(a) {
    return this.data[a];
  };
  a.set = function(a) {
    for (var b in a) {
      this.data[b] = a[b];
    }
  };
})(Entry.Model.prototype);
Entry.ObserverModel = function() {
  this.base();
};
Entry.ObserverModel.prototype = new Entry.Model;
(function(a) {
  a.base = Entry.Model;
  a.set = function(a) {
    this.base.prototype.set.call(this, a);
    this.notify();
  };
  a.observe = function() {
  };
  a.unobserve = function() {
  };
  a.notify = function() {
  };
})(Entry.ObserverModel.prototype);

