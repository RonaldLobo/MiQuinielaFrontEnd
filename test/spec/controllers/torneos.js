'use strict';

describe('Controller: TorneosCtrl', function () {

  // load the controller's module
  beforeEach(module('miQuinielaApp'));

  var TorneosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TorneosCtrl = $controller('TorneosCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TorneosCtrl.awesomeThings.length).toBe(3);
  });
});
