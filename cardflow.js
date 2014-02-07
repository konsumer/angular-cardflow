'use strict';

angular.module('angular-cardflow', ['ngTouch']).directive('cardflow', ['$swipe', '$compile', '$window', function($swipe, $compile, $window) {
    return {
        'restrict': 'E',
        'template':'<div class="cardflow-container" ng-transclude ng-swipe-left="swipeLeft()" ng-swipe-right="swipeRight()"></div>',
        transclude: true,
        'scope': { 'model':'=?', 'type':'=?', 'pad':'=?', 'animTime':'=?', 'current':'=?' },
        'link': function(scope, element, attrs) {
            // model for reaching into this for callbacks and data-binding
            scope.model = scope.model ||  {};
            
            // swipeSnap or swipeSnapOne
            scope.type = scope.type || 'swipeSnap';

            // margin for cards
            scope.pad = scope.pad || 10;
            
            //  time that it takes to animate a movemnt in CSS transition 
            scope.animTime = scope.animTime || 0.25;

            // currently selected card, can be set with param
            scope.model.current = scope.current || 0;

            // width of a card, in pixels
            scope.cardWidth = 0;

            
            
            // internal vars
            var cardEls, positionLimitLeft, positionLimitRight;

            function update(){
                cardEls.css({
                    'transform': 'translate3d('+scope.position+'px,0,0)',
                    '-webkit-transform': 'translate3d('+scope.position+'px,0,0)',
                    '-o-transform': 'translate3d('+scope.position+'px,0,0)',
                    '-moz-transform': 'translate3d('+scope.position+'px,0,0)'
                });

                cardEls.removeClass('cardflow-active');
                var active = angular.element(cardEls[scope.model.current]);
                active.addClass('cardflow-active');
                if (scope.model.onActive){
                    scope.model.onActive(active, scope.position, scope);
                }
            }

            // update offset snapped to current card
            function updatePosition(delta){
                positionLimitLeft = cardEls[1].offsetLeft;
                positionLimitRight = positionLimitLeft + scope.cardWidth * cardEls.length;

                // delta bounds
                if (delta === 0 || (delta === -1 && scope.model.current > 0) || (delta === 1 && scope.model.current < (cardEls.length-1) ) ){
                    // do I really need to re-calculate this every time?
                    cardEls = element.children().children();
                    scope.cardWidth = cardEls[1].offsetHeight + scope.pad;

                    scope.model.current += delta;
                    scope.position = -(scope.model.current*scope.cardWidth);

                    update();
                }
            }

            // initialize cardflow
            function init(){
                cardEls = element.children().children();
                scope.cardWidth = cardEls[1].offsetHeight + scope.pad;

                angular.forEach(cardEls, function(el, i){
                    angular.element(el).css({ left: (i * scope.cardWidth) + 'px' });
                });

                updatePosition(0);

                if (scope.type == 'swipeSnap'){
                    /*
                    scope.animationLoop = window.requestAnimationFrame(function(){
                        var position = scope.position + scope.velocity;
                        if(position >= 0)  { scope.velocity = 0; position = 0; }
                        if(position <= positionLimitRight) { scope.velocity = 0; position = positionLimitRight; }
                        scope.position=position;

                        update();
                    });
                    */

                    // calculate card to move to with start/end
                    // move cards on move (for a grab effect)
                    var startTime=0;
                    var startX=0;

                    $swipe.bind(element, {
                        start: function(coords){
                            startTime= (new Date()).getTime();
                            startX = coords.x;
                        },
                        end: function(coords){
                            // figure out pointer velocity, update current to calculated card
                            // inverted velocity, but getting closer
                            var current = scope.model.current - Math.floor((scope.cardWidth / (coords.x - startX)) * ((new Date()).getTime()-startTime)/(scope.animTime*500));

                            console.log(current);

                            // update current
                            if (current <0){ current=0; }
                            if (current > (cardEls.length-1)){ current=(cardEls.length-1); }
                            scope.model.current = current;

                            scope.$apply();
                            updatePosition(0);
                        },
                        /*
                        move: function(coords){
                            // update position to match pointer
                            scope.position = (scope.model.current*scope.cardWidth) - coords.x;
                            cardEls.css({
                                'transform': 'translate3d('+scope.position+'px,0,0)',
                                '-webkit-transform': 'translate3d('+scope.position+'px,0,0)',
                                '-o-transform': 'translate3d('+scope.position+'px,0,0)',
                                '-moz-transform': 'translate3d('+scope.position+'px,0,0)'
                            });
                            // snap to current
                            setTimeout(function(){
                                console.log('snap to active');
                                updatePosition(0);
                            }, scope.animTime*1000);
                        }
                        */
                    });
                }

                
            }

            // HACK: add active when transcluded elements are available
            setTimeout(init, 10);

            // on window resize, update translate
            angular.element($window).bind('resize',function(){
                updatePosition(0);
            });

            scope.swipeLeft = function(){
                if (scope.type == 'swipeSnapOne'){
                    updatePosition(1);
                }
            }

            scope.swipeRight = function(){
                if (scope.type == 'swipeSnapOne'){
                    updatePosition(-1);
                }
            }

            // these work in all modes and are exposed to $scope.model
            scope.model.left = function(){ updatePosition(1); };
            scope.model.right = function(){ updatePosition(-1); };
        }
    };
}]);