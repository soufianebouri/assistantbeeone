'use strict';

describe('Controller: TableaudebordPrevisionTabsHarvastDetailCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TableaudebordPrevisionTabsHarvastDetailCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TableaudebordPrevisionTabsHarvastDetailCtrl = $controller('TableaudebordPrevisionTabsHarvastDetailCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TableaudebordPrevisionTabsHarvastDetailCtrl.awesomeThings.length).toBe(3);
  });
});
