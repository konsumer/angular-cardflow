'use strict';

angular.module('angular-cardflow', ['ngTouch']).directive('cardflow', ['$swipe', '$compile', '$window', function($swipe, $compile, $window) {
    return {
        'restrict': 'E',
        'template':'<div class="cardflow-container" ng-transclude ng-swipe-left="swipeLeft()" ng-swipe-right="swipeRight()"></div>',
        transclude: true,
        'scope': { 'model':'=?', 'atype':'=?', 'margin':'=?', 'animTime':'=?', 'current':'=?' },
        'link': function(scope, element, attrs) {
            // model for reaching into this for callbacks and data-binding
            scope.model = scope.model ||  {};
            
            // swipeSnap or swipeSnapOne
            scope.atype = attrs.atype || 'swipeSnap';

            // margin for cards
            scope.margin = scope.margin  || 10;
            
            //  time that it takes to animate a movemnt in CSS transition 
            scope.animTime = scope.animTime || 0.25;

            // currently selected card, can be set with param
            scope.model.current = scope.current || 0;
            
            // internal vars
            var cardWidth, cardEls, positionLimitLeft, positionLimitRight;

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
                positionLimitRight = positionLimitLeft + cardWidth * cardEls.length;

                // delta bounds
                if (delta === 0 || (delta === -1 && scope.model.current > 0) || (delta === 1 && scope.model.current < (cardEls.length-1) ) ){
                    // do I really need to re-calculate this every time?
                    cardEls = element.children().children();
                    cardWidth = cardEls[1].offsetHeight + scope.margin;

                    scope.model.current += delta;
                    scope.position = -(scope.model.current*cardWidth);

                    update();
                }
            }

            // initialize cardflow
            function init(){
                cardEls = element.children().children();
                if (cardEls && cardEls.length){
                    cardWidth = cardEls[1].offsetHeight + scope.margin;

                    angular.forEach(cardEls, function(el, i){
                        angular.element(el).css({ left: (i * cardWidth) + 'px' });
                    });

                    updatePosition(0);

                    if (scope.atype == 'swipeSnap'){
                        // calculate current card with start/end
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
                                // scale target to velocity of pointer
                                var realDistance = coords.x - startX;
                                var distance = Math.abs(realDistance);
                                var now = (new Date()).getTime();
                                var velocity = (now-startTime)/(scope.animTime * 100000);
                                velocity = distance * velocity;
                                var direction = realDistance > 0 ? -1 : 1;
                                console.log(velocity, direction);
                                var current = scope.model.current + Math.floor(velocity * direction);

                                // check bounds
                                if (current <0){ current=0; }
                                if (current > (cardEls.length-1)){ current=(cardEls.length-1); }
                                scope.model.current = current;

                                scope.$apply();
                                updatePosition(0);
                            },
                            // move cards on move (for a grab effect)
                            move: function(coords){
                            }
                        });
                    }
                }else{
                    // HACK: add active when transcluded elements are available
                    setTimeout(init, 100);
                }
            }

            // re-init if anim type changes
            scope.$watch('type', init);

            // on window resize, update translate
            angular.element($window).bind('resize',function(){
                updatePosition(0);
            });

            scope.swipeLeft = function(){
                if (scope.atype == 'swipeSnapOne'){
                    updatePosition(1);
                }
            }

            scope.swipeRight = function(){
                if (scope.atype == 'swipeSnapOne'){
                    updatePosition(-1);
                }
            }

            // these work in all modes and are exposed to $scope.model
            scope.model.left = function(){ updatePosition(1); };
            scope.model.right = function(){ updatePosition(-1); };
        }
    };
}]);