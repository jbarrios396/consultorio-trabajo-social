(function() {
    "use strict";
  
    app.service("servicio_login", servicio_login);
  
    servicio_login.$inject = ["$http", "$q", "API"];
    function servicio_login($http, $q, API) {
      var control = this;
      var url = API.URL + "api_login.php/";
  
      control.login = login;
  
      ////////////////
  
      function login(data) {
        var defered = $q.defer();
        $http
          .post(url + "login", data)
          .then(function(response) {
            defered.resolve(response);
          })
          .catch(function(error) {
            defered.reject(error);
          });
        return defered.promise;
      }
    }
  })();
  