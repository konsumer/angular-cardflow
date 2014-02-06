'use strict';

angular.module('angular-cardflow', ['ngTouch']).directive('cardflow', ['$swipe', '$compile', '$window', function($swipe, $compile, $window) {
    return {
        'restrict': 'E',
        'template':'<div class="cardflow-container" ng-transclude ng-swipe-left="updateLeft()" ng-swipe-right="updateRight()"></div>',
        transclude: true,
        'scope': { 'cards': '=', 'model':'=' },
        'link': function(scope, element, attrs) {
            scope.offset = 0;
            scope.model = scope.model ||  {};

            scope.model.current = scope.offset;

            // update offset
            function update(delta){
                scope.cardEls = element.children().children();
                scope.cardWidth = parseInt(window.getComputedStyle(scope.cardEls[1])['left'], 10);

                // delta bounds
                if (delta === 0 || ((delta === 1 && scope.offset < 0) || (delta === -1 && scope.offset > (-1 * scope.cards.length)+1))){
                    scope.offset += delta;
                    scope.model.current = scope.offset * -1;
                    var px = scope.offset*scope.cardWidth;
                    
                    scope.cardEls.css({
                        'transform': 'translate3d('+px+'px,0,0)',
                        '-webkit-transform': 'translate3d('+px+'px,0,0)',
                        '-o-transform': 'translate3d('+px+'px,0,0)',
                        '-moz-transform': 'translate3d('+px+'px,0,0)'
                    }).removeClass('cardflow-active');
                    angular.element(scope.cardEls[scope.offset*-1]).addClass('cardflow-active');
                }
            }

            // ugly hack to add active when scope is available & when window resized
            setTimeout(function(){
                update(0);
            }, 100);

            angular.element($window).bind('resize',function(){
                update(0);
            });

            scope.updateLeft = function(){
                update(-1);
            }
            scope.model.updateLeft = scope.updateLeft;

            scope.updateRight = function(){
                update(1);
            }
            scope.model.updateRight = scope.updateRight;
        }
    };
}]);