'use strict';

describe('Controller: ConfigurationReferentielVEngraisCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ConfigurationReferentielVEngraisCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigurationReferentielVEngraisCtrl = $controller('ConfigurationReferentielVEngraisCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConfigurationReferentielVEngraisCtrl.awesomeThings.length).toBe(3);
  });
});
