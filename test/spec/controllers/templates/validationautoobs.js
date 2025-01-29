'use strict';

describe('Controller: TemplatesValidationautoobsCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesValidationautoobsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesValidationautoobsCtrl = $controller('TemplatesValidationautoobsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesValidationautoobsCtrl.awesomeThings.length).toBe(3);
  });
});
