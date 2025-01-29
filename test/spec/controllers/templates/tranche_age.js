'use strict';

describe('Controller: TemplatesTrancheAgeCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesTrancheAgeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesTrancheAgeCtrl = $controller('TemplatesTrancheAgeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesTrancheAgeCtrl.awesomeThings.length).toBe(3);
  });
});
