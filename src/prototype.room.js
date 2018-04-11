
if (!Room.prototype._find) {
  Room.prototype._find = Room.prototype.find;

  Room.prototype.find = function(type, opts) {
    return this._find(type, opts);
  }
}
