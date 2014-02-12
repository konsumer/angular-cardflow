'use strict';

(function(){
    // set prefixed matrix transform without changing other elements of matrix
    // I tried out matrix3d, but it had visual artifacts in chrome
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
                    scope.model = scope.model || {};
                    scope.model.cardWidth = 0;
                    scope.model.wrapperEl=angular.element(element.find('div')[0]);
                    scope.model.containerEl=angular.element(scope.model.wrapperEl.find('div')[0]);
                    scope.model.current = scope.current || scope.model.current || 0;
                    scope.model.cards = scope.model.cards || [];
                    scope.mode = attrs.mode || 'swipeSnapKinetic';
                    scope.model.increment=1;

                    // wrapper for just setting X-transform of scope.model.containerEl[0]
                    function setPositionX(position){
                        setTransform(scope.model.containerEl[0], [undefined, undefined, undefined, undefined, position, undefined]);
                    }

                    scope.model.setPositionX = setPositionX;

                    // track cards list, but use scope.model.cardEls just in case no model was set
                    scope.$watch(function (){ return scope.model.cards; }, function(){
                        scope.model.cardEls = scope.model.containerEl.children();
                        if (scope.model.cardEls && scope.model.cardEls[1]){
                            scope.model.cardWidth = scope.model.cardEls[1].offsetLeft-scope.model.cardEls[0].offsetLeft;

                            if (scope.model.cardWidth === 0){
                                scope.model.cardWidth = scope.model.cardEls[0].offsetWidth;
                            }

                            var totalWidth = (scope.model.cardWidth*scope.model.cardEls.length) + scope.model.cardEls[1].offsetLeft;
                            //set container to wide enough to keep  from wrapping
                            scope.model.containerEl.css({'width': totalWidth + 'px'});

                            scope.model.pageSize = Math.floor(scope.model.wrapperEl[0].clientWidth / scope.model.cardWidth);
                            scope.model.increment = (scope.mode == 'swipeSnapOne') ? 1 : scope.model.pageSize;
                        }
                    });                    

                    if ( scope.mode != 'swipe'){
                        scope.$watch(function (){ return scope.model.current; }, function(){
                            if (scope.model.cardEls){
                                scope.model.cardEls.removeClass('cardflow-active');
                                var current = angular.element(scope.model.cardEls[scope.model.current]);
                                current.addClass('cardflow-active');
                                if (scope.model.cardWidth){
                                    setPositionX((scope.model.cardWidth * -scope.model.current));
                                }
                            }
                        });
                    }

                    if (scope.mode == 'swipeSnapOne' || scope.mode == 'swipeSnapPage'){
                        scope.swipeLeft = function(){
                            var current = scope.model.current+scope.model.increment;
                            if (current < scope.model.cardEls.length){
                                scope.model.current = current;
                            }
                        };
                        scope.swipeRight = function(){
                            var current = scope.model.current-scope.model.increment;
                            if (current >= 0){
                                scope.model.current = current;
                            }
                        };
                    }

                    if (scope.mode == 'swipeSnap' || scope.mode == 'swipeSnapKinetic' ||  scope.mode == 'swipe'){

                        // store transition
                        var transition={};
                        var t = window.getComputedStyle(scope.model.containerEl[0])['transition'];
                        if (t){
                            transition.transition = t + '';
                        }
                        angular.forEach(['moz','o','webkit','ms'], function(p){
                            t = window.getComputedStyle(scope.model.containerEl[0])[p+'Transition'];
                            if (t){
                                transition[p+'Transition'] = t;
                            }
                        });

                        var offset = 0, position=0, velocity=0, timestamp;

                        $swipe.bind(scope.model.wrapperEl, {
                            start: function(coords){
                                scope.model.cardEls.removeClass('cardflow-active');
                                offset = (scope.mode == 'swipe') ? coords.x-position : coords.x;
                                
                                // remove transition
                                angular.forEach(['moz','o','webkit','ms'], function(p){
                                    scope.model.containerEl.css(p+'Transition', 'none');
                                });
                                scope.model.containerEl.css({'transition':'none'});

                                if (scope.mode == 'swipeSnapKinetic'){
                                    velocity = 0;
                                    timestamp = Date.now();
                                }
                            },
                            end: function(coords){
                                // restore transition
                                scope.model.containerEl.css(transition);
                                
                                if ( scope.mode != 'swipe'){
                                    // figure out current card from position
                                    var current = Math.floor((position/-scope.model.cardWidth) + 0.5);

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
                                        if (current > (scope.model.cardEls.length-1)){
                                            current = scope.model.cardEls.length-1;
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
                                    position = coords.x - (scope.model.current*scope.model.cardWidth) - offset;
                                }else{
                                    position = coords.x - offset;
                                }

                                setPositionX(position);
                            },
                        });
                    }

                });
            }
        };
    }]);


})();

