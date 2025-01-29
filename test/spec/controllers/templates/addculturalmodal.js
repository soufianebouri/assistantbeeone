'use strict';

describe('Controller: TemplatesAddculturalmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesAddculturalmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesAddculturalmodalCtrl = $controller('TemplatesAddculturalmodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesAddculturalmodalCtrl.awesomeThings.length).toBe(3);
  });
});
