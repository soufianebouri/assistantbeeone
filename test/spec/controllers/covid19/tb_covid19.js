'use strict';

describe('Controller: Covid19TbCovid19Ctrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var Covid19TbCovid19Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Covid19TbCovid19Ctrl = $controller('Covid19TbCovid19Ctrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(Covid19TbCovid19Ctrl.awesomeThings.length).toBe(3);
  });
});
