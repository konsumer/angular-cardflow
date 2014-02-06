# Angular Cardflow

This is for making ng-repeat items that flow into a nice & efficient coverflow.  It is inspired by [angular-coverflow](https://github.com/southdesign/angular-coverflow), but differs in a few ways:

*  It can handle images, divs, or whatever you like that is ng-repeating
*  Use Angular's `$swipe`
*  It has multiple interaction modes.

See a [demo](http://konsumer.github.io/angular-cardflow/)

## Usage

See files in `examples` for usage examples, but here's the basics:

1. Include the cardflow.js script provided by this component into your app.
2. Add angular-cardflow as a module dependency to your app.
3. Add CSS to make it look nice. There is an example in `examples/cardflow.css`

### Interaction Modes

You can set different interaction modes with the `type` attribute. Here are the available options:

* `swipeSnap` (default) - swipe left or right, watch velocity & snap to individual card on slow down
* `swipeSnapOne` - swipe left or right to advance 1.

### Advance-card Functions

You can make buttons that call cardflow.left() & cardflow.right(). See examples/index.html.
