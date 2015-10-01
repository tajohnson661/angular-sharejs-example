'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', ['ui.router']);

app.config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');

    // For any unmatched url, redirect to root (/)
    $urlRouterProvider.otherwise('/');
    //
    // Set up the states
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'home.html'
        })
        .state('room', {
            url: '/:roomId',
            templateUrl: 'room.html'
        });
}
]);

app.controller('AppCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {

    $scope.padList = [
        {
            text: ''
        },
        {
            text: ''
        }
    ];
    $scope.initData = function() {
        console.log('initData: ' + $stateParams.roomId);
        $scope.roomId = $stateParams.roomId;
    };

    // Socket io not really being used, but I want to see if it works with browserchannel
    $scope.socket = io();


}]);
