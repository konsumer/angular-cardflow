'use strict';

(function(){
    // set prefixed matrix transform without changing other elements of matrix
    var setTransform = function(element, matrix){
        var transform;
        var t = window.getComputedStyle(element);
        var prefix;
        if (t){
            angular.forEach(['moz','o','webkit'], function(p){
                if (t[p + 'Transform']){
                    transform = t[p + 'Transform'];
                    prefix=p;
                }
            });
            if (transform){
                var m = transform.match(/\d+/g);
                if (m && m.length == 6){
                    m = m.map(function(e){ return Number(e); });
                }else{
                    m = [1,0,0,1,0,0];
                }
                for(var i=0; i<6;i++){
                    if (matrix[i] !== undefined){
                        m[i] = matrix[i];
                    }
                }
                var css= {};
                if (!prefix){
                    css['transform'] = 'matrix(' + m.join(',') + ')';
                }else{
                    css[prefix + 'Transform']='matrix(' + m.join(',') + ')';
                }
                angular.element(element).css(css);
            }
        }
    }

    var module = angular.module('angular-cardflow', ['ngTouch']);

    module.directive('cardflow', ['$swipe', '$timeout', function($swipe, $timeout) {
        return {
            'restrict': 'E',
            'template': '<div class="cardflow-wrapper" ng-swipe-left="swipeLeft($event)" ng-swipe-right="swipeRight($event)"><div class="cardflow-container" ng-transclude></div></div>',
            'transclude': true,
            'scope': { 'model' : '=?', 'mode':'=?', 'current':'=?' },
            link: function(scope, element, attrs){
                // next available tick, so element is populated with transcluded content
                $timeout(function(){
                    var cardEls, cardWidth = 0, wrapperEl=angular.element(element.find('div')[0]), containerEl=angular.element(wrapperEl.find('div')[0]), increment=1;
                    scope.model = scope.model || {};
                    scope.model.current = scope.current || scope.model.current || 0;
                    scope.model.cards = scope.model.cards || [];
                    scope.mode = attrs.mode || 'swipeSnapKinetic';

                    // track cards list, but use cardEls just in case no model was set
                    scope.$watch(function (){ return scope.model.cards; }, function(){
                        cardEls = containerEl.children();
                        if (cardEls && cardEls[1]){
                            cardWidth = cardEls[1].offsetLeft-cardEls[0].offsetLeft;

                            if (cardWidth === 0){
                                cardWidth = cardEls[0].offsetWidth;
                            }

                            var totalWidth = (cardWidth*cardEls.length) + cardEls[1].offsetLeft;
                            //set container to wide enough to keep  from wrapping
                            containerEl.css({'width': totalWidth + 'px'});

                            scope.model.pageSize = Math.floor(wrapperEl[0].clientWidth / cardWidth);
                            increment = (scope.mode == 'swipeSnapOne') ? 1 : scope.model.pageSize;
                        }
                    });                    

                    if ( scope.mode != 'swipe'){
                        scope.$watch(function (){ return scope.model.current; }, function(){
                            if (cardEls){
                                cardEls.removeClass('cardflow-active');
                                var current = angular.element(cardEls[scope.model.current]);
                                current.addClass('cardflow-active');
                                if (cardWidth){
                                    setTransform(containerEl[0], [undefined, undefined, undefined, undefined, (cardWidth * -scope.model.current), undefined]);
                                }
                            }
                        });
                    }

                    if (scope.mode == 'swipeSnapOne' || scope.mode == 'swipeSnapPage'){
                        scope.swipeLeft = function(){
                            var current = scope.model.current+increment;
                            if (current < cardEls.length){
                                scope.model.current = current;
                            }
                        };
                        scope.swipeRight = function(){
                            var current = scope.model.current-increment;
                            if (current >= 0){
                                scope.model.current = current;
                            }
                        };
                    }

                    if (scope.mode == 'swipeSnap' || scope.mode == 'swipeSnapKinetic' ||  scope.mode == 'swipe'){

                        // store transition
                        var transition={};
                        var t = window.getComputedStyle(containerEl[0])['transition'];
                        if (t){
                            transition.transition = t + '';
                        }
                        angular.forEach(['moz','o','webkit'], function(p){
                            t = window.getComputedStyle(containerEl[0])[p+'Transition'];
                            if (t){
                                transition[p+'Transition'] = t;
                            }
                        });

                        var offset = 0, position=0, velocity=0, timestamp;

                        $swipe.bind(wrapperEl, {
                            start: function(coords){
                                cardEls.removeClass('cardflow-active');
                                offset = (scope.mode == 'swipe') ? coords.x-position : coords.x;
                                
                                // remove transition
                                angular.forEach(['moz','o','webkit'], function(p){
                                    containerEl.css(p+'Transition', 'none');
                                });
                                containerEl.css({'transition':'none'});

                                if (scope.mode == 'swipeSnapKinetic'){
                                    velocity = 0;
                                    timestamp = Date.now();
                                }
                            },
                            end: function(coords){
                                // restore transition
                                containerEl.css(transition);
                                
                                if ( scope.mode != 'swipe'){
                                    // figure out current card from position
                                    var current = Math.floor((position/-cardWidth) + 0.5);

                                    if (scope.mode == 'swipeSnapKinetic'){
                                        //  calculate velocity here
                                        var now = Date.now();
                                        var elapsed = now-timestamp;
                                        var distance = offset-coords.x;
                                        var velocity = distance/elapsed;

                                        if (Math.abs(velocity) > 1){
                                            current = Math.floor(current + velocity);
                                        }

                                    }

                                    if (current >=0){
                                        if (current > (cardEls.length-1)){
                                            current = cardEls.length-1;
                                        }
                                    }else{
                                        current = 0;
                                    }
                                    
                                    // trigger update
                                    if (scope.model.current==current){
                                        scope.model.current=-1;
                                        scope.$apply();
                                    }
                                    scope.model.current=current;
                                    scope.$apply();
                                }
                            },
                            move: function(coords){
                                // move cards to current position
                                if (scope.mode != 'swipe'){
                                    position = coords.x - (scope.model.current*cardWidth) - offset;
                                }else{
                                    position = coords.x - offset;
                                }

                                setTransform(containerEl[0], [undefined, undefined, undefined, undefined, position, undefined]);
                            },
                        });
                    }

                });
            }
        };
    }]);


})();

