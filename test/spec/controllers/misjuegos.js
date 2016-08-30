'use strict';

describe('Controller: MisjuegosCtrl', function () {

  // load the controller's module
  beforeEach(module('miQuinielaApp'));

  var MisjuegosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MisjuegosCtrl = $controller('MisjuegosCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MisjuegosCtrl.awesomeThings.length).toBe(3);
  });
});
