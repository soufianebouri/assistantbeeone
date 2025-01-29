'use strict';

describe('Controller: TemplatesModalniveauconformiteCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesModalniveauconformiteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesModalniveauconformiteCtrl = $controller('TemplatesModalniveauconformiteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesModalniveauconformiteCtrl.awesomeThings.length).toBe(3);
  });
});
