'use strict';

describe('Controller: TableaudebordPrevisionCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TableaudebordPrevisionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TableaudebordPrevisionCtrl = $controller('TableaudebordPrevisionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TableaudebordPrevisionCtrl.awesomeThings.length).toBe(3);
  });
});
