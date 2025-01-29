'use strict';

describe('Controller: RecolteProfileCalibreDataIntegrationCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecolteProfileCalibreDataIntegrationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecolteProfileCalibreDataIntegrationCtrl = $controller('RecolteProfileCalibreDataIntegrationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecolteProfileCalibreDataIntegrationCtrl.awesomeThings.length).toBe(3);
  });
});
