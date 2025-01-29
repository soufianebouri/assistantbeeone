'use strict';

describe('Controller: TableaudebordPrevisionTabsRealisationDetailCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TableaudebordPrevisionTabsRealisationDetailCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TableaudebordPrevisionTabsRealisationDetailCtrl = $controller('TableaudebordPrevisionTabsRealisationDetailCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TableaudebordPrevisionTabsRealisationDetailCtrl.awesomeThings.length).toBe(3);
  });
});
