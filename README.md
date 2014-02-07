# Angular Cardflow

This is for making ng-repeat items that flow into a nice & efficient coverflow.  It is inspired by [angular-coverflow](https://github.com/southdesign/angular-coverflow) and [angular-carousel](https://github.com/revolunet/angular-carousel), but differs in a few ways:

*  It can handle images, divs, or whatever you like that is ng-repeating
*  Uses Angular's `$swipe`
*  It has multiple interaction modes.
*  Lots of attribute options with sensible defaults

Here are some more features:

*  Mobile friendly, tested on webkit+firefox
*  use CSS 3D transformations and requestAnimationFrame.
*  data-binding & callbacks

See a [demo](http://konsumer.github.io/angular-cardflow/)

## Usage

See files in `examples` for usage examples, but here's the basics:

1. Include the cardflow.js script provided by this component into your app.
2. Add angular-cardflow as a module dependency to your app.
3. Add CSS to make it look nice. There is an example in `examples/cardflow.css`

## Attributes

### type

You can set different interaction modes with the `type` attribute. Here are the available options:

* `swipeSnap` (default) - swipe left or right, watch velocity & snap to individual card on slow down. sort of like [angular-coverflow](https://github.com/southdesign/angular-coverflow), but snap to cards.
* `swipeSnapOne` - swipe left or right to advance 1. sort of like [angular-carousel](https://github.com/revolunet/angular-carousel).

## model

`model` is used if you need to reach into the directive with data-binding. `examples/index.html` uses this. It gives you access to these:

*  `current` - the index of the current card
*  `left()` - trigger moving 1 to the left
*  `right()` - trigger moving 1 to the right
*  `onActive`  - called when an active card is selected. It looks like this: `function(active_element, offset, scope){ }`
