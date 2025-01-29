'use strict';

describe('Controller: TemplatesAddregionmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesAddregionmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesAddregionmodalCtrl = $controller('TemplatesAddregionmodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesAddregionmodalCtrl.awesomeThings.length).toBe(3);
  });
});
