'use strict';

describe('Controller: TemplatesNiveauattaqueCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesNiveauattaqueCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesNiveauattaqueCtrl = $controller('TemplatesNiveauattaqueCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesNiveauattaqueCtrl.awesomeThings.length).toBe(3);
  });
});
