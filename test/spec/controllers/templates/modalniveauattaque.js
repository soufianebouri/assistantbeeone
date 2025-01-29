'use strict';

describe('Controller: TemplatesModalniveauattaqueCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesModalniveauattaqueCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesModalniveauattaqueCtrl = $controller('TemplatesModalniveauattaqueCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesModalniveauattaqueCtrl.awesomeThings.length).toBe(3);
  });
});
