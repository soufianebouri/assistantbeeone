'use strict';

describe('Controller: TemplatesFermesprofilCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TemplatesFermesprofilCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TemplatesFermesprofilCtrl = $controller('TemplatesFermesprofilCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TemplatesFermesprofilCtrl.awesomeThings.length).toBe(3);
  });
});
