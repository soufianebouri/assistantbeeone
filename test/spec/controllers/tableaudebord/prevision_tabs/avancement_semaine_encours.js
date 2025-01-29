'use strict';

describe('Controller: TableaudebordPrevisionTabsAvancementSemaineEncoursCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TableaudebordPrevisionTabsAvancementSemaineEncoursCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TableaudebordPrevisionTabsAvancementSemaineEncoursCtrl = $controller('TableaudebordPrevisionTabsAvancementSemaineEncoursCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TableaudebordPrevisionTabsAvancementSemaineEncoursCtrl.awesomeThings.length).toBe(3);
  });
});
