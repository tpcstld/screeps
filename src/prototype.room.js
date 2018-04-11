
if (!Room.prototype._find) {
  Room.prototype._find = Room.prototype.find;

  Room.prototype.find = function(type, opts) {
    if (!this.findCache) {
      this.findCache = {};
    }

    const cachedResult = this.findCache[type];
    if (opts == undefined && cachedResult) {
      return cachedResult;
    }

    const result = this._find(type, opts);
    if (opts == undefined) {
      this.findCache[type] = result;
    }
    return result;
  }
}
