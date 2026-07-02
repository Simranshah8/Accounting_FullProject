app.controller('FixedUnitController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Fixed Unit';

	$scope.LoadData = function () {
	/*	$('.select2').select2();*/
		
		$scope.UnitColl = [];
		$http({
			method: 'GET',
			url: base_url + "Inventory/Creation/GetAllUnit",
			dataType: "json"
			//data:JSON.stringify(para)
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.UnitColl = res.data.Data;
			}
		}, function (reason) {
			alert('Failed' + reason);
		});

		$scope.newDet = {
			UnitId1: null,
			UnitId2: null,
			UnitId3: null,
			UnitId4: null,
			UnitId5: null,			
			Mode: 'Save'
		};
		$scope.GetFixedUnit();
	}

	$scope.ClearFixedUnit = function () {
		$scope.newDet = {
			UnitId1: null,
			UnitId2: null,
			UnitId3: null,
			UnitId4: null,
			UnitId5: null,
			Mode: 'Save'
		};
	}

	//*************************Config *********************************

	$scope.SaveFixedUnit = function () {		
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Inventory/Creation/SaveFixedUnit",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newDet }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.GetFixedUnit();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}


	$scope.GetFixedUnit = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.newDet = {};
		$http({
			method: 'POST',
			url: base_url + "Inventory/Creation/GetAllFixedUnit",
			dataType: "json"
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

});