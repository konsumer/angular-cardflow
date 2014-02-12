# Angular Cardflow

This is for making ng-repeat items that flow into a nice & efficient coverflow.  It is inspired by [angular-coverflow](https://github.com/southdesign/angular-coverflow) and [angular-carousel](https://github.com/revolunet/angular-carousel), but differs in a few ways:

*  It can handle images, divs, or whatever you like, including ngRepeats. First-level children are the "cards".
*  Uses Angular's `$swipe`
*  It has multiple interaction modes
*  Lots of attribute options with sensible defaults

Here are some more features:

*  mobile-friendly, tested on webkit+firefox. Should work ok on IE8+ (untested)
*  use CSS 3D transformations directly, no `requestAnimationFrame()` or `setTimeout()`.
*  all the look is defined in your own CSS, or use mine, if you want it to look the same.
*  data-binding & callbacks

See a [demo](http://konsumer.github.io/angular-cardflow/)

## Usage

See files in `examples` for usage examples, but here's the basics:

1. Include the cardflow.js script provided by this component into your app. (if you are using bower, type `bower install angular-cardflow`, then add `bower_components/angular-cardflow/cardflow.js` to  your HTML)
2. Add angular-cardflow as a module dependency to your app.
3. Add CSS to make it look nice. I tried to keep all of the look & animation in CSS only, for maximum configurability. There is a simple example in `examples/cardflow.css`, and see `.cardflow-fancy` stuff in `examples/demo.css` for fancier styles. You may not want to use shadows & gradients on things that move (or things under moving things) for good performance on mobile.

## Attributes

### current

You can force the current card, if you don't want it to be the first one.

### mode

You can set different interaction modes with the `mode` attribute. Here are the available options:
* `none` - no swipe interaction: just use model.current to set cards. You will have to do your own bounds checking
* `swipeSnapKinetic` (default) - swipe left or right, watch velocity & snap to individual card on slow down. sort of like [angular-coverflow](https://github.com/southdesign/angular-coverflow), but snap to cards. For some reason, on firefox, this looks like `swipeSnap`. Need to investigate.
* `swipeSnap` - no kinetic, just snap to new active card
* `swipe` - Like swipeSnap, but no snapping to card
* `swipeSnapOne` - swipe left or right to advance 1. sort of like [angular-carousel](https://github.com/revolunet/angular-carousel).
* `swipeSnapPage` - Like swipeSnapOne, but by the page

## model

`model` is used if you need to reach into the directive with data-binding. It's cool for indicators or buttons that jump to specific cards. It gives you access to these:

*  `current` - the read/writable index of the current card. Put a `$watch` on it to do something when current changes
