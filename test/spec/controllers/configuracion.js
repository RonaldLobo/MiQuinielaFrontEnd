'use strict';

describe('Controller: ConfiguracionCtrl', function () {

  // load the controller's module
  beforeEach(module('miQuinielaApp'));

  var ConfiguracionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfiguracionCtrl = $controller('ConfiguracionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConfiguracionCtrl.awesomeThings.length).toBe(3);
  });
});
