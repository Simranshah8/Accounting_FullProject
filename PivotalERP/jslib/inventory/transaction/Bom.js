app.controller('BOMController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'BOMController';

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
	/*	$scope.perPageColl = GlobalServices.getPerPageList();*/

		$scope.beData = {
			ConsumptionColl: [],
			ProductionColl: [],
			AdditionalCostColl: [],
			Mode: 'Save'
		};

		$scope.beData.ConsumptionColl.push({});
		$scope.beData.ProductionColl.push({});
		$scope.beData.AdditionalCostColl.push({});
	}
	

	

	$scope.AddConsumptionRow = function (ind) {
		if ($scope.beData.ConsumptionColl) {
			if ($scope.beData.ConsumptionColl.length > ind + 1) {
				$scope.beData.ConsumptionColl.splice(ind + 1, 0, {
					EmailId: ''
				})
			} else {
				$scope.beData.ConsumptionColl.push({
					EmailId: ''
				})
			}
		}
	};
	$scope.delConsumptionRow = function (ind) {
		if ($scope.beData.ConsumptionColl) {
			if ($scope.beData.ConsumptionColl.length > 1) {
				$scope.beData.ConsumptionColl.splice(ind, 1);
			}
		}
	};


	$scope.AddProductionRow = function (ind) {
		if ($scope.beData.ProductionColl) {
			if ($scope.beData.ProductionColl.length > ind + 1) {
				$scope.beData.ProductionColl.splice(ind + 1, 0, {
					EmailId: ''
				})
			} else {
				$scope.beData.ProductionColl.push({
					EmailId: ''
				})
			}
		}
	};
	$scope.delProductionRow = function (ind) {
		if ($scope.beData.ProductionColl) {
			if ($scope.beData.ProductionColl.length > 1) {
				$scope.beData.ProductionColl.splice(ind, 1);
			}
		}
	};


	$scope.AddAdditionalCostRow = function (ind) {
		if ($scope.beData.AdditionalCostColl) {
			if ($scope.beData.AdditionalCostColl.length > ind + 1) {
				$scope.beData.AdditionalCostColl.splice(ind + 1, 0, {
					EmailId: ''
				})
			} else {
				$scope.beData.AdditionalCostColl.push({
					EmailId: ''
				})
			}
		}
	};
	$scope.delAdditionalCostRow = function (ind) {
		if ($scope.beData.AdditionalCostColl) {
			if ($scope.beData.AdditionalCostColl.length > 1) {
				$scope.beData.AdditionalCostColl.splice(ind, 1);
			}
		}
	};

	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});