'use strict';

describe('Controller: TemplatesProfilCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesProfilCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesProfilCtrl = $controller('TemplatesProfilCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesProfilCtrl.awesomeThings.length).toBe(3);
  });
});
