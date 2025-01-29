'use strict';

describe('Directive: chooseFile', function () {

  // load the directive's module
  beforeEach(module('beeOneWebFrontApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<choose-file></choose-file>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the chooseFile directive');
  }));
});
