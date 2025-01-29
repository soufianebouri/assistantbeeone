'use strict';

describe('Directive: footerSection', function () {

  // load the directive's module
  beforeEach(module('beeOneWebFrontApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<footer-section></footer-section>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the footerSection directive');
  }));
});
