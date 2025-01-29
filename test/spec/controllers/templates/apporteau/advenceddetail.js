'use strict';

describe('Controller: TemplatesApporteauAdvenceddetailCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesApporteauAdvenceddetailCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesApporteauAdvenceddetailCtrl = $controller('TemplatesApporteauAdvenceddetailCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesApporteauAdvenceddetailCtrl.awesomeThings.length).toBe(3);
  });
});
