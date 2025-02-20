'use strict';

describe('Controller: ConfigurationReferentielVFamilleCultureCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ConfigurationReferentielVFamilleCultureCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigurationReferentielVFamilleCultureCtrl = $controller('ConfigurationReferentielVFamilleCultureCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConfigurationReferentielVFamilleCultureCtrl.awesomeThings.length).toBe(3);
  });
});
