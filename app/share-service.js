'use strict';

angular.module('myApp').service('ShareJS', ['$window', function($window) {

    var s = new BCSocket(null, {reconnect: true});

    var sjs = new $window.sharejs.Connection(s);


    this.getShareConnection = function() {
        return sjs;
    };
}]);
