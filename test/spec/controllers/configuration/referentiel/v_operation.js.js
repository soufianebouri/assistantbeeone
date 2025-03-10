'use strict';

describe('Controller: ConfigurationReferentielVOperationJsCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ConfigurationReferentielVOperationJsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigurationReferentielVOperationJsCtrl = $controller('ConfigurationReferentielVOperationJsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConfigurationReferentielVOperationJsCtrl.awesomeThings.length).toBe(3);
  });
});
