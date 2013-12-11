(function(window) {
  "use strict";

  // Constructor
  var Timing = function(data) {
    this.data = data;
    if (Timing.supportsNavigationTiming()) {
      this.calcs = {
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
        'unloadcalcstart': 'unloadcalcstart',
        'unloadEventEnd': 'unloadEventEnd',
        'domLoading': 'domLoading',
        'domInteractive': 'domInteractive',
        'domContentLoadedcalcstart': 'domContentLoadedcalcstart',
        'domContentLoadedEventEnd': 'domContentLoadedEventEnd',
        'domComplete': 'domComplete',
        'loadcalcstart': 'loadcalcstart',
        'loadEventEnd': 'loadEventEnd',

        // custom calcs
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
      this.calcs = {};
    }
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
    this.calcs[event] = callback;
    return this;
  };

  Timing.prototype.registerAll = function(calcs) {
    for (var event in calcs) {
      this.register(event, calcs[event]);
    }
    return this;
  };

  Timing.prototype.getAll = function() {
    var data = {};

    for (var event in this.calcs) {
      data[event] = this.get(event);
    }

    return data;
  };

  Timing.prototype.get = function(name) {
    var event = this.calcs[name];
      
    switch (typeof event) {
      case 'function':
        return event.call(this, this.data);

      case 'string':
        return this.data[event];
    }

    return data;
  };

  Timing.prototype._customCalculationStartGenerator = function(name) {
    return name + 'Start';
  };

  Timing.prototype._customCalculationEndGenerator = function(name) {
    return name + 'End';
  };

  Timing.prototype._ensureCustomCalculation = function(name) {
    if (!this.calcs[name]) {
      var start = this._customCalculationStartGenerator(name);
      var end = this._customCalculationEndGenerator(name);
      this.calcs[name] = function(data) {
        return data[end] - data[start];
      };
    }
  };

  Timing.prototype.start = function(name) {
    this._ensureCustomCalculation(name);
    var event = this._customCalculationStartGenerator(name);
    this.data[event] = (new Date()).getTime();
    return this;
  };

  Timing.prototype.end = function(name) {
    this._ensureCustomCalculation(name);
    var event = this._customCalculationEndGenerator(name);
    this.data[event] = (new Date()).getTime();
    return this;
  };

  // Expose Timing via global tagged object (module pattern)
  window.tagged = window.tagged || {};
  window.tagged.Timing = Timing;
})(window);
