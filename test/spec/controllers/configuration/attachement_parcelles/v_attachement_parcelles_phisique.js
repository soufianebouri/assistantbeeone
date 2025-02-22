'use strict';

describe('Controller: ConfigurationAttachementParcellesVAttachementParcellesPhisiqueCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ConfigurationAttachementParcellesVAttachementParcellesPhisiqueCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigurationAttachementParcellesVAttachementParcellesPhisiqueCtrl = $controller('ConfigurationAttachementParcellesVAttachementParcellesPhisiqueCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConfigurationAttachementParcellesVAttachementParcellesPhisiqueCtrl.awesomeThings.length).toBe(3);
  });
});
