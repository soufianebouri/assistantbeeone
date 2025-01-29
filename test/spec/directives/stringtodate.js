'use strict';

describe('Directive: stringToDate', function () {

  // load the directive's module
  beforeEach(module('beeOneWebFrontApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<string-to-date></string-to-date>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the stringToDate directive');
  }));
});
