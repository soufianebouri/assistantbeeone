'use strict';

describe('Controller: ConfigurationReferentielVArticleCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ConfigurationReferentielVArticleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigurationReferentielVArticleCtrl = $controller('ConfigurationReferentielVArticleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConfigurationReferentielVArticleCtrl.awesomeThings.length).toBe(3);
  });
});
