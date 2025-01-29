'use strict';

describe('Controller: TemplatesModaloperationctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesModaloperationctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesModaloperationctrlCtrl = $controller('TemplatesModaloperationctrlCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesModaloperationctrlCtrl.awesomeThings.length).toBe(3);
  });
});
