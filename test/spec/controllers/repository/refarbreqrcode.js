'use strict';

describe('Controller: RepositoryRefarbreqrcodeCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryRefarbreqrcodeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryRefarbreqrcodeCtrl = $controller('RepositoryRefarbreqrcodeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryRefarbreqrcodeCtrl.awesomeThings.length).toBe(3);
  });
});
