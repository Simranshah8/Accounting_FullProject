app.controller('SFDashboardController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Dashboard';
	var glSrv = GlobalServices;

	$scope.LoadData = function () {


		$scope.GetDashboardDVGrpById();
	}


	$scope.toggleBatch = function (type) {
		if (type === 'serial' && $scope.beData.showSerialNo) {
			$scope.beData.showBatch = false;
		} else if (type === 'batch' && $scope.beData.showBatch) {
			$scope.beData.showSerialNo = false;
		}
	};


	$scope.GetDashboardDVGrpById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			/*		TranId: refData.TranId*/
			TranId: 0
		};
		$http({
			method: 'POST',
			url: base_url + "Dashboard/Common/GetSalesForce",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newDet = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};


	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

	$scope.openLink = function (linkUrl) {
		var url = base_url + linkUrl;
		window.open(url);
    }

});