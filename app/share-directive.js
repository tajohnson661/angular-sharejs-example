'use strict';

angular.module('myApp').directive('shareText', ['ShareJS', function (ShareJS) {
    console.log('shareText directive initialization');

    var link = function(scope, elem, attrs, ngModel) {

        var doc = ShareJS.getShareConnection().get('notes', scope.roomId + '_' + scope.index);
        doc.subscribe();

        doc.whenReady(function () {
            if (!doc.type) {
                doc.create('text');
            }
            if (doc.type && doc.type.name === 'text') {
                doc.attachTextarea(elem[0]);
                console.log(doc);
                ngModel.$setViewValue(angular.copy(doc.getSnapshot()));
            }
        });


        elem.on('$destroy', function() {
            console.log('$destroy called');
            if (doc) {
                doc.destroy();
            }

        });

        scope.$watch(function() {
            return ngModel.$modelValue;
        }, function(newValue) {
            console.log('value is: ' + newValue);
        });

    };

    return {
        restrict: 'A',
        scope: {
            index : '@',
            roomId : '@'
        },
        require: 'ngModel',
        link: link
    };
}]);
