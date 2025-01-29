'use strict';

describe('Controller: RecolteFichesdesuividagreagedesfruitsCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecolteFichesdesuividagreagedesfruitsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecolteFichesdesuividagreagedesfruitsCtrl = $controller('RecolteFichesdesuividagreagedesfruitsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecolteFichesdesuividagreagedesfruitsCtrl.awesomeThings.length).toBe(3);
  });
});
