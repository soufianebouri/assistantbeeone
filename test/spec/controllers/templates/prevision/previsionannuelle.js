'use strict';

describe('Controller: TemplatesPrevisionPrevisionperiodiqueCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesPrevisionPrevisionperiodiqueCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesPrevisionPrevisionperiodiqueCtrl = $controller('TemplatesPrevisionPrevisionperiodiqueCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesPrevisionPrevisionperiodiqueCtrl.awesomeThings.length).toBe(3);
  });
});
