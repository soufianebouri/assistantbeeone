'use strict';

describe('Controller: RepositoryGroupeoperationnelCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryGroupeoperationnelCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryGroupeoperationnelCtrl = $controller('RepositoryGroupeoperationnelCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryGroupeoperationnelCtrl.awesomeThings.length).toBe(3);
  });
});
