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
      var timing = new window.tagged.Timing(window.performance.timing);

      window.addEventListener("load", function() {
        window.setTimeout(function() {
          var data = timing.getAll();
          console.log('All data', data);
        }, 0);
      });
      })(window);
    </script>

Custom Calculations
--

To register a custom calculation, simply call `timing.register` and pass in the name of your custom calculation and a function that accepts a `timing` object. The function return a calculation, and will be called when using `timing.getAll()` or `timing.get()` with your custom calculation name.

      timing.register('firstByte', function(timing) {
        return timing.responseStart - timing.navigationStart;
      });

      var data = timing.getAll(); // now includes data.firstByty
      var firstByte = timing.get('firstByte'); // alternative method

Custom Events
--

Custom events can easily be registered by calling `timing.start()` and `timing.end()` with your custom event name. Unless already configured, a custom caculation will be created for you automatically.

    timing.start('myLongProcess');
    /* some code that takes a long time, async included */
    timing.end('myLongProcess');

    var data = timing.getAll(); // now includes data.myLongProcess
    var myLongProcessDuration = timing.get('myLongProcess'); // alternative method

TODO
--

Unit tests
