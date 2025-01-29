'use strict';

describe('Controller: TableaudebordPrevisionTabsTlemetrieSaisieCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TableaudebordPrevisionTabsTlemetrieSaisieCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TableaudebordPrevisionTabsTlemetrieSaisieCtrl = $controller('TableaudebordPrevisionTabsTlemetrieSaisieCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TableaudebordPrevisionTabsTlemetrieSaisieCtrl.awesomeThings.length).toBe(3);
  });
});
