'use strict';

describe('Directive: myTable', function () {

  // load the directive's module
  beforeEach(module('beeOneWebFrontApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<my-table></my-table>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the myTable directive');
  }));
});
