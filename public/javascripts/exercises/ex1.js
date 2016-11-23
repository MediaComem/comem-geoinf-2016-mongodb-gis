(function() {

  var template = `
    <div class="btn-group btn-group-justified">
      <label class="btn btn-primary" ng-model="ctrl.filters.geometryType" uib-btn-radio="'Area'">Area</label>
      <label class="btn btn-primary" ng-model="ctrl.filters.geometryType" uib-btn-radio="'Routes'">Routes</label>
      <label class="btn btn-primary" ng-model="ctrl.filters.geometryType" uib-btn-radio="'Stops'">Stops</label>
    </div>
  `;

  function controller() {
    this.filters = {
      geometryType: 'Area'
    };
  }

  addExercise({
    title: 'Example 1',
    template: template,
    controller: controller
  });
})();
