'use strict';

describe('Controller: MainoeuvreetatsTableauBordCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var MainoeuvreetatsTableauBordCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainoeuvreetatsTableauBordCtrl = $controller('MainoeuvreetatsTableauBordCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MainoeuvreetatsTableauBordCtrl.awesomeThings.length).toBe(3);
  });
});
