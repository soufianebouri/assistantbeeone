'use strict';

describe('Controller: TemplatesModaltypevarieteCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesModaltypevarieteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesModaltypevarieteCtrl = $controller('TemplatesModaltypevarieteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesModaltypevarieteCtrl.awesomeThings.length).toBe(3);
  });
});
