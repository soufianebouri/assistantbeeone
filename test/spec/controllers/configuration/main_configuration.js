'use strict';

describe('Controller: ConfigurationMainConfigurationCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ConfigurationMainConfigurationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigurationMainConfigurationCtrl = $controller('ConfigurationMainConfigurationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConfigurationMainConfigurationCtrl.awesomeThings.length).toBe(3);
  });
});
