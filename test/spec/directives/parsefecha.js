'use strict';

describe('Directive: parseFecha', function () {

  // load the directive's module
  beforeEach(module('miQuinielaApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<parse-fecha></parse-fecha>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the parseFecha directive');
  }));
});
