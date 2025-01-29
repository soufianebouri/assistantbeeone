'use strict';

describe('Controller: TableaudebordPrevisionTabsPrevuRealiseSemaineCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TableaudebordPrevisionTabsPrevuRealiseSemaineCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TableaudebordPrevisionTabsPrevuRealiseSemaineCtrl = $controller('TableaudebordPrevisionTabsPrevuRealiseSemaineCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TableaudebordPrevisionTabsPrevuRealiseSemaineCtrl.awesomeThings.length).toBe(3);
  });
});
