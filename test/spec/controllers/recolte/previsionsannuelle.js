'use strict';

describe('Controller: RecoltePrevisionsannuelleCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecoltePrevisionsannuelleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecoltePrevisionsannuelleCtrl = $controller('RecoltePrevisionsannuelleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecoltePrevisionsannuelleCtrl.awesomeThings.length).toBe(3);
  });
});
