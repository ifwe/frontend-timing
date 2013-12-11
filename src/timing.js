(function(window) {
  "use strict";

  // Constructor
  var Timing = function(timing) {
    this.timing = timing;
    if (Timing.supportsNavigationTiming()) {
      this.events = {
        'navigationStart': 'navigationStart',
        'fetchStart': 'fetchStart',
        'domainLookupStart': 'domainLookupStart',
        'domainLookupEnd': 'domainLookupEnd',
        'connectStart': 'connectStart',
        'connectEnd': 'connectEnd',
        'secureConnectionStart': 'secureConnectionStart',
        'requestStart': 'requestStart',
        'redirectStart': 'redirectStart',
        'redirectEnd': 'redirectEnd',
        'responseStart': 'responseStart',
        'responseEnd': 'responseEnd',
        'unloadEventStart': 'unloadEventStart',
        'unloadEventEnd': 'unloadEventEnd',
        'domLoading': 'domLoading',
        'domInteractive': 'domInteractive',
        'domContentLoadedEventStart': 'domContentLoadedEventStart',
        'domContentLoadedEventEnd': 'domContentLoadedEventEnd',
        'domComplete': 'domComplete',
        'loadEventStart': 'loadEventStart',
        'loadEventEnd': 'loadEventEnd',

        // custom events
        'userTime': function(timing) {
          return timing.loadEventEnd - timing.navigationStart;
        },
        'dns': function(timing) {
          return timing.domainLookupEnd - timing.domainLookupStart;
        },
        'connection': function(timing) {
          return timing.connectEnd - timing.connectStart;
        },
        'requestTime': function(timing) {
          return timing.responseEnd - timing.requestStart;
        },
        'fetchTime': function(timing) {
          return timing.responseEnd - timing.fetchStart;
        }
      };
    } else {
      this.events = {};
    }

    this.customEvents = {};
  };

  // Static methods
  Timing.supportsNavigationTiming = function() {
    return !!(window.performance && window.performance.timing);
  };

  // Instance methods
  Timing.prototype.register = function(event, callback) {
    if (!callback) {
      callback = name;
    }
    this.events[event] = callback;
    return this;
  };

  Timing.prototype.registerAll = function(events) {
    for (var event in events) {
      this.register(event, events[event]);
    }
    return this;
  };

  Timing.prototype.getAll = function() {
    var data = {};

    for (var event in this.events) {
      data[event] = this.get(event);
    }

    return data;
  };

  Timing.prototype.get = function(name) {
    var event = this.events[name];
      
    switch (typeof event) {
      case 'function':
        return event.call(this, this.timing);

      case 'string':
        return this.timing[event];
    }

    return data;
  };

  Timing.prototype._customEventStartGenerator = function(name) {
    return name + 'Start';
  };

  Timing.prototype._customEventEndGenerator = function(name) {
    return name + 'End';
  };

  Timing.prototype._ensureCustomEvent = function(name) {
    if (!this.events[name]) {
      var start = this._customEventStartGenerator(name);
      var end = this._customEventEndGenerator(name);
      this.events[name] = function(timing) {
        return timing[end] - timing[start];
      };
    }
  };

  Timing.prototype.start = function(name) {
    this._ensureCustomEvent(name);
    var event = this._customEventStartGenerator(name);
    this.timing[event] = (new Date()).getTime();
    return this;
  };

  Timing.prototype.end = function(name) {
    this._ensureCustomEvent(name);
    var event = this._customEventEndGenerator(name);
    this.timing[event] = (new Date()).getTime();
    return this;
  };

  // Expose Timing via global tagged object (module pattern)
  window.tagged = window.tagged || {};
  window.tagged.Timing = Timing;
})(window);
