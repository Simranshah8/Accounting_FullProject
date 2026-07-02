app.controller('ProductPriceController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'ProductPrice';
	var glSrv = GlobalServices;
	
	$scope.LoadData = function () {
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();		

		$scope.SearchList = [{ id: 1, text: 'Name' }, { id: 2, text: 'Code' }]
		$scope.currentPages = {
			ProductPrice: 1			
		};

		$scope.searchData = {
			ProductPrice: ''
		};

		$scope.perPage = {
			ProductPrice: GlobalServices.getPerPageRow()			
		};

		$scope.newDet = {
			SearchId: 1
		};

		$scope.beData = {
			showSalesRate: false, 
			showDateFrom: false,
			showPurchaseRate: false,
			showBatch: false,
			showMRP: false,
			showCostingRate: false,
			showSerialNo: false,
			showProductGroup: false,
			showProductType: false,
			showLastSalesRate: false,
			showLastPurchaseRate:false
		};
		$scope.GetAllProductPrice();
		bindShortcuts();
	}


	function bindShortcuts() {
		$(document).keydown(function (event) {
			if (event.altKey && event.key.toLowerCase() === 'l') {
				event.preventDefault();
				$('a[href$="~/HRM/Creation/LeaveRequest"]')[0].click();
			}

			if (event.altKey && event.key.toLowerCase() === 'p') {
				event.preventDefault();
				$('a[href$="~/Account/Creation/SalesmanTarget"]')[0].click();
			}
		});
	}

	$scope.toggleBatch = function (type) {
		if (type === 'serial' && $scope.beData.showSerialNo) {
			$scope.beData.showBatch = false;
		} else if (type === 'batch' && $scope.beData.showBatch) {
			$scope.beData.showSerialNo = false;
		}
	};

	$scope.GetAllProductPrice = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.ProductPriceList = [];
		$http({
			method: 'GET',
			url: base_url + "Inventory/Reporting/GetAllProductPriceList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ProductPriceList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}


	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});