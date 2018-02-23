var utilServices = angular.module('utilServices', []);

utilServices.factory('FindSearch',[
    function(){
        return{
            findSearch: function(array,searchValue){
                results = [];
                angular.forEach(array, function(value) {

                    var name = value.nombre.toLowerCase();
                    var search = searchValue.toLowerCase(); 
                    if (name.indexOf(search) >= 0){
                        results.push(value);
                    }
                });
                return results;
            },

            findSearchKey: function(array,searchValue){
                var found = null;

                angular.forEach(array, function(value) {
                    if(!found){
                        if (value.key == searchValue){
                            found = value;
                        }                    
                    }
    
                });

                return found;

            },
            
            findAvailables: function(array){
                results = [];
                angular.forEach(array, function(value) {

                    var available = value.disponibilidad;
                    if (available === true){
                        results.push(value);
                    }
                });
                return results;
            }
        };
    }
]);


var libraryApp = angular.module('libraryApp', ['utilServices', 'ui.bootstrap', ]);

libraryApp.controller('MainCtrl', function ($scope, $http){
    $http.get('https://qodyhvpf8b.execute-api.us-east-1.amazonaws.com/test/books').success(function(data) {
        $scope.books = data;
    });
});


libraryApp.directive('bookList', function (FindSearch) {
    return {
        restrict: 'E',
        scope: {
            books: "=ngBooks"
        },
        templateUrl: 'partial_book_list.html',
        controller: function($scope, $element, $attrs, $templateCache, $rootScope, FindSearch) {

        $scope.showBooksDetail = false;
        $scope.value = 'popularity';
        $scope.availables = FindSearch.findAvailables($scope.books);
        console.info($scope.availables);
        var popularity = $scope.books.sort(function (a, b) {
          return b.popularidad - a.popularidad;
        });
        
        var size = 5;
        $scope.popularity = popularity.slice(0, size);
        
        $scope.results = angular.copy($scope.popularity);

        console.info($scope.popularity);
        
        $scope.showDetails = function(element) {
            $scope.book = element;
            $scope.showBooksDetail = true;
        }

        $scope.cleanSearch = function(){
            $scope.searchValue = '';
            $scope.newValue($scope.value);
        }

        $scope.findValue = function(){
          if($scope.searchValue === ''){
            
            $scope.newValue($scope.value);
            
          } else {
            $scope.results = FindSearch.findSearch($scope.results, $scope.searchValue);
            
          }
        }

        
        $scope.$watch('value', function(value) {
               console.log(value);
         });
    
        $scope.newValue = function(value) {
           console.log(value);
            if(value == 'popularity'){
              $scope.results = angular.copy($scope.popularity);
            } else if(value == 'available'){
              $scope.results = angular.copy($scope.availables);
            } else if(value == 'allB'){
              $scope.results = angular.copy($scope.books);
            }
        }


        },
        link: function(scope, $element, $attrs) {

        }
    };
});


libraryApp.directive('bookDetails', function (FindSearch) {
    return {
        restrict: 'E',
        scope: {
            book: "=ngBook"
        },
        templateUrl: 'partial_book_details.html',
        controller: function($scope, $element, $attrs, $templateCache, $rootScope, FindSearch) {
          console.info($scope.book);
        },
        link: function(scope, $element, $attrs) {

        }
    };
});
