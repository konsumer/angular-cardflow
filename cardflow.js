'use strict';

angular.module('angular-cardflow', ['ngTouch']).directive('cardflow', ['$swipe', '$compile', '$window', function($swipe, $compile, $window) {
    return {
        'restrict': 'E',
        'template':'<div class="cardflow-container" ng-transclude ng-swipe-left="swipeLeft($event)" ng-swipe-right="swipeRight($event)"></div>',
        transclude: true,
        'scope': { 'model':'=?', 'atype':'=?', 'current':'=?' },
        'link': function(scope, element, attrs) {
            // model for reaching into this for callbacks and data-binding
            scope.model = scope.model ||  {};
            
            // swipeSnap or swipeSnapOne
            scope.atype = attrs.atype || 'swipeSnapKinetic';

            // currently selected card, can be set with param
            scope.model.current = scope.current || 0;

            scope.$watch('model.current', init );
            
            // internal vars
            var cardWidth, cardEls, positionLimitLeft, positionLimitRight, bound, container = element.find('div');

            // update position
            function setPosition(position){
                cardEls.css({
                    'transform': 'translate3d('+position+'px,0,0)',
                    '-webkit-transform': 'translate3d('+position+'px,0,0)',
                    '-o-transform': 'translate3d('+position+'px,0,0)',
                    '-moz-transform': 'translate3d('+position+'px,0,0)'
                });
            }

            // update offset snapped to current card
            function update(delta){
                positionLimitLeft = cardEls[1].offsetLeft;
                positionLimitRight = positionLimitLeft + cardWidth * cardEls.length;

                // delta bounds
                if (delta === 0 || (delta === -1 && scope.model.current > 0) || (delta === 1 && scope.model.current < (cardEls.length-1) ) ){
                    // do I really need to re-calculate this every time?
                    cardEls = element.children().children();
                    cardWidth = cardEls[1].offsetLeft-cardEls[0].offsetLeft;

                    scope.model.current += delta;
                    scope.position = -(scope.model.current*cardWidth);

                    setPosition(scope.position);

                    cardEls.removeClass('cardflow-active');
                    var active = angular.element(cardEls[scope.model.current]);
                    active.addClass('cardflow-active');
                    if (scope.model.onActive){
                        scope.model.onActive(active, scope.position, scope);
                    }
                }
            }

            // initialize cardflow
            function init(){
                cardEls = element.children().children();
                if (cardEls && cardEls.length){
                    cardWidth = cardEls[1].offsetHeight;

                    update(0);

                    // store transition
                    var transition={};
                    var t = window.getComputedStyle(cardEls[1])['transition'];
                    if (t){
                        transition.transition = t + '';
                    }
                    angular.forEach(['moz','o','webkit'], function(p){
                        t = window.getComputedStyle(cardEls[1])['transition'];
                        if (t){
                            transition[p+'Transition'] = t;
                        }
                    });

                    if (scope.atype == 'swipeSnap' || scope.atype == 'swipeSnapKinetic'){
                        // calculate current card with start/end
                        var transition, position, offset, startTime, startX;

                        // only bind once
                        if (!bound){
                            bound=true;
                            $swipe.bind(element, {
                                start: function(coords){
                                    // disable transition
                                    angular.forEach(['moz','o','webkit'], function(p){
                                        cardEls.css(p+'Transition', 'none');
                                    });
                                    cardEls.css({'transition':'none'});
                                    offset = coords.x-(container[0].clientWidth/2)-cardWidth;
                                    if (scope.atype == 'swipeSnapKinetic'){
                                        startTime = (new Date()).getTime();
                                        startX = coords.x;
                                    }
                                },
                                end: function(coords){
                                    // restore transition
                                    cardEls.css(transition);
                                    var current = Math.floor((position/-cardWidth) + 0.5);

                                    if (scope.atype == 'swipeSnapKinetic'){
                                        var timePassed = (new Date()).getTime() - startTime;
                                        var distance = coords.x - startX;
                                        var direction = distance > 0 ? 1 : -1;
                                        var velocity = Math.abs(distance/timePassed);

                                        if (velocity>0.8){
                                            current += direction * Math.floor(distance/cardWidth);
                                        }

                                        // console.log({distance:distance, direction:direction, velocity:velocity, timePassed:timePassed})
                                    }

                                    if (current >=0){
                                        if (current > (cardEls.length-1)){
                                            current = cardEls.length-1;
                                        }
                                    }else{
                                        current = 0;
                                    }

                                    // trigger update
                                    scope.model.current=-1;
                                    scope.$apply();
                                    scope.model.current=current;
                                    scope.$apply();
                                },
                                // move cards on move (for a grab effect)
                                move: function(coords){
                                    position = scope.position+coords.x-positionLimitLeft - offset - (cardWidth/2);
                                    setPosition(position);
                                }
                            });
                        }
                    }
                }else{
                    // HACK: add active when transcluded elements are available
                    // need to find a better way to do this...
                    setTimeout(init, 100);
                }
            }

            // re-init if anim type changes
            scope.$watch('type', init);

            // on window resize, update translate
            angular.element($window).bind('resize',function(){
                update(0);
            });

            // maybe I should  do these in bindings above

            scope.swipeLeft = function(e){
                if (scope.atype == 'swipeSnapOne'){
                    update(1);
                }
            }

            scope.swipeRight = function(e){
                if (scope.atype == 'swipeSnapOne'){
                    update(-1);
                }
            }
        }
    };
}]);