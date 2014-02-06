'use strict';

angular.module('angular-cardflow', ['ngTouch']).directive('cardflow', ['$swipe', '$compile', '$window', function($swipe, $compile, $window) {
    return {
        'restrict': 'E',
        'template':'<div class="cardflow-container" ng-transclude ng-swipe-left="swipeLeft()" ng-swipe-right="swipeRight()"></div>',
        transclude: true,
        'scope': { 'model':'=?', 'type':'=?', 'pad':'=?' },
        'link': function(scope, element, attrs) {
            scope.model = scope.model ||  {};
            scope.type = scope.type || 'swipeSnap';
            scope.pad = scope.pad || 10;
            
            scope.model.current = 0;

            // update offset
            function update(delta){
                // delta bounds
                if (delta === 0 || (delta === -1 && scope.model.current > 0) || (delta === 1 && scope.model.current < (scope.cardEls.length-1) ) ){
                    
                    // do I really need to re-calculate this every time?
                    // there must be a better way...
                    scope.cardEls = element.children().children();
                    scope.cardWidth = scope.cardEls[1].offsetHeight + scope.pad;

                    scope.model.current += delta;
                    var px = scope.model.current*scope.cardWidth*-1;

                    scope.cardEls.css({
                        'transform': 'translate3d('+px+'px,0,0)',
                        '-webkit-transform': 'translate3d('+px+'px,0,0)',
                        '-o-transform': 'translate3d('+px+'px,0,0)',
                        '-moz-transform': 'translate3d('+px+'px,0,0)'
                    }).removeClass('cardflow-active');
                    
                    var active = angular.element(scope.cardEls[scope.model.current]);
                    active.addClass('cardflow-active');
                    if (scope.model.onActive){
                        scope.model.onActive(active, px, scope);
                    }
                }
            }

            // ugly hack to add active when transcluded elements are available
            setTimeout(function(){
                scope.cardEls = element.children().children();
                scope.cardWidth = scope.cardEls[1].offsetHeight + scope.pad;

                angular.forEach(scope.cardEls, function(el, i){
                    angular.element(el).css({ left: (i * scope.cardWidth) + 'px' });
                });

                update(0);

                if (scope.type == 'swipeSnap'){

                }
            }, 10);

            // on window resize, update translate
            angular.element($window).bind('resize',function(){
                update(0);
            });

            scope.swipeLeft = function(){
                if (scope.type == 'swipeSnapOne'){
                    update(1);
                }
            }

            scope.swipeRight = function(){
                if (scope.type == 'swipeSnapOne'){
                    update(-1);
                }
            }

            scope.model.left = function(){ update(1); };
            scope.model.right = function(){ update(-1); };
        }
    };
}]);