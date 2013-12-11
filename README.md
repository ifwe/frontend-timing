Timing
==

A simple tool for measuring front-end performance. Compatible with the HTML5 Performance Timing API, if available. Also supports arbitrary custom events.

[View the demo!](http://htmlpreview.github.io/?https://github.com/tagged/frontend-timing/blob/master/demo/index.html)

Usage
--

Add `src/timing.js` to your page:

    <script type="text/javascript" src="path/to/timing.js"></script>

Schedule a call after the window's `load` event to access the timing data. By using a `setTimeout` value of `0`, this ensures the browser has completed all relevant actions that are captured by the Performance Timing API:

    <script type="text/javascript">
    (function(window) {
      var timing = new window.tagged.Timing(window.performance && window.performance.timing || {});

      window.addEventListener("load", function() {
        window.setTimeout(function() {
          var allTimingData = timing.getAll();
          console.log('All Timing Data', allTimingData);
        }, 0);
      });
      })(window);
    </script>

Custom Calculations
--

To register a custom calculation, simply call `timing.register` and pass in the name of your custom calculation and a function that accepts a `data` object. The data object will be equal to the performance timing object that was passed in during construction. The function should return a calculation based on the provided data, and will be called each time `timing.getAll()` is called or `timing.get()` with your custom calculation name is called.

      timing.register('firstByte', function(data) {
        return data.responseStart - data.navigationStart;
      });

      var allTimingData = timing.getAll(); // now includes allTimingData.firstByte
      var firstByteTiming = timing.get('firstByte'); // alternative method

Custom Events
--

Custom events can easily be registered by calling `timing.start()` and `timing.end()` with your custom event name. Unless already configured, a custom caculation will be created for you automatically.

    timing.start('myLongProcess');
    /* some code that takes a long time, async included */
    timing.end('myLongProcess');

    var allTimingData = timing.getAll(); // now includes allTimingData.myLongProcess
    var myLongProcessTiming = timing.get('myLongProcess'); // alternative method

TODO
--

Unit tests
