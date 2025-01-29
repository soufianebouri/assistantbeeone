'use strict';

describe('Controller: TableaudebordTbTechniqueCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TableaudebordTbTechniqueCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TableaudebordTbTechniqueCtrl = $controller('TableaudebordTbTechniqueCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TableaudebordTbTechniqueCtrl.awesomeThings.length).toBe(3);
  });
});
