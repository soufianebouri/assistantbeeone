'use strict';

describe('Controller: SanteplanteFichesdesuividepiquresurfruitsCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SanteplanteFichesdesuividepiquresurfruitsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SanteplanteFichesdesuividepiquresurfruitsCtrl = $controller('SanteplanteFichesdesuividepiquresurfruitsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SanteplanteFichesdesuividepiquresurfruitsCtrl.awesomeThings.length).toBe(3);
  });
});
