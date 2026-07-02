app.controller('MfgStockJournalController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Manufacturing Stock Journal';

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		/*	$scope.perPageColl = GlobalServices.getPerPageList();*/

		$scope.beData = {
			ConsumptionColl: [],
			ProductionColl: [],
			CostOfComponentColl: [],
			Mode: 'Save'
		};

		$scope.beData.ConsumptionColl.push({});
		$scope.beData.ProductionColl.push({});
		$scope.beData.CostOfComponentColl.push({});
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
		if ($scope.beData.CostOfComponentColl) {
			if ($scope.beData.CostOfComponentColl.length > ind + 1) {
				$scope.beData.CostOfComponentColl.splice(ind + 1, 0, {
					EmailId: ''
				})
			} else {
				$scope.beData.CostOfComponentColl.push({
					EmailId: ''
				})
			}
		}
	};
	$scope.delAdditionalCostRow = function (ind) {
		if ($scope.beData.CostOfComponentColl) {
			if ($scope.beData.CostOfComponentColl.length > 1) {
				$scope.beData.CostOfComponentColl.splice(ind, 1);
			}
		}
	};

	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});