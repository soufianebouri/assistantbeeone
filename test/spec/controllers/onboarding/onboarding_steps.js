'use strict';

describe('Controller: OnboardingOnboardingStepsCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var OnboardingOnboardingStepsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OnboardingOnboardingStepsCtrl = $controller('OnboardingOnboardingStepsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OnboardingOnboardingStepsCtrl.awesomeThings.length).toBe(3);
  });
});
