// Angular file

// public/core.js
var scotchSection = angular.module('dashboardSection', []);

console.log("inside core.js");

function mainController($scope, $http) {
  $scope.formData = {};
  console.log("getting all sections");
  // When landing on the page (on page load), get all sections and show them
  $http.get('/api/sections')
     .success(function(data) {
       $scope.sections = data; // bind the JSON we get from the API to $scoope.sections
       console.log("success");
       console.log(data[0].text);
     })
     .error(function(data) {
       console.log('Error: ' + data);
     });

   // When submitting the add form, send the text to the node api
   $scope.createSection = function() {
     console.log("creating a section");
     $http.post('/api/sections', $scope.formData)
        .success(function(data) {
          $scope.formData = {} // sclear the form so the user is ready to enter another
          $scope.sections = data;
          console.log(data);
        })
        .error(function(data) {
          console.log("Error:" + data);
        });
    };

   // Delete a section after checking it
   $scope.deleteSection = function(id) {
     console.log("delete a section");
     $http.delete('/api/sections/' + id)
        .success(function(data) {
          $scope.sections = data;
          console.log(data);
        })
        .error(function(data) {
          console.log("Error: " + data);
        });
    }

}
