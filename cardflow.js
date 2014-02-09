'use strict';

angular.module('angular-cardflow', ['ngTouch'])

.directive('cardflowKineticSnap', ['$swipe', '$timeout', function($swipe, $timeout) {
    return {
        'restrict': 'E',
        'template':'<div class="cardflow-wrapper"><div class="cardflow-container" ng-transclude></div></div>',
        transclude: true,
        scope: {model:'='},
        link: function(scope, element, attrs){
            $timeout(function(){
                var cardEls;
                scope.model = scope.model || {};
                scope.model.current = scope.model.current || 0;

                // track cards list
                scope.$watch(function (){ return scope.model.cards; }, function(){
                    cardEls = element.find('div').find('div').children();
                });
                
                // track current card
                scope.$watch(function (){ return scope.model.current; }, function(){
                    if (cardEls){
                        cardEls.removeClass('cardflow-active');
                        angular.element(cardEls[scope.model.current]).addClass('cardflow-active');
                    }
                });


                
            });
        }
    };
}]);