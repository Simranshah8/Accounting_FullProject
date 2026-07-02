

app.controller('AllowEntityController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Allow Shift';

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.searchData = {
			AllowEntity: '',

		};

		$scope.newAllowEntity = {
			AllowEntityId: null,
			UserId: null,
			GroupId: null,
			UserWise: 1,
			Full: false,
			View: false,
			Add: false,
			Modify: false,
			Delete: false,
			Print: false,
			Export:false
		};

		$scope.AllowEntityList = [];
		$scope.UserList = [];
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllUserList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.UserList = res.data.Data;

			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.UserGroupList = [];
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllUserGroupList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.UserGroupList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		//$scope.GetAllAllowEntityList();

	}

	$scope.ClearAllowEntity = function () {
		$scope.newAllowEntity = {
			AllowEntityId: null,
			
		};
	}


	//************************* AllowEntity *********************************

	$scope.CheckAllFull = function () {
		var tmpData = $filter('filter')($scope.AllowEntityList, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.Full = $scope.newAllowEntity.Full;
		});
	}
	$scope.CheckAllView = function () {
		var tmpData = $filter('filter')($scope.AllowEntityList, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.View = $scope.newAllowEntity.View;
		});
	}
	$scope.CheckAllAdd = function () {
		var tmpData = $filter('filter')($scope.AllowEntityList, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.Add = $scope.newAllowEntity.Add;
		});
	}
	$scope.CheckAllModify = function () {
		var tmpData = $filter('filter')($scope.AllowEntityList, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.Modify = $scope.newAllowEntity.Modify;
		});
	}
	$scope.CheckAllDelete = function () {
		var tmpData = $filter('filter')($scope.AllowEntityList, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.Delete = $scope.newAllowEntity.Delete;
		});
	}
	$scope.CheckAllPrint = function () {
		var tmpData = $filter('filter')($scope.AllowEntityList, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.Print = $scope.newAllowEntity.Print;
		});
	}
	$scope.CheckAllExport = function () {
		var tmpData = $filter('filter')($scope.AllowEntityList, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.Export = $scope.newAllowEntity.Export;
		});
	}
	$scope.IsValidAllowEntity = function () {

		if (!$scope.AllowEntityList || $scope.AllowEntityList.length == 0) {
				Swal.fire('Not Data Found For Save');
				return false;
        }

		return true;
	}

	$scope.GetAllowEntityList = function () {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			UserId: ($scope.newAllowEntity.UserWise==2 ? null : $scope.newAllowEntity.UserId ),
			GroupId: ($scope.newAllowEntity.UserWise == 1 ? null :$scope.newAllowEntity.GroupId )
		};

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetEntityAccessById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AllowEntityList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.SaveUpdateAllowEntity = function () {
		if ($scope.IsValidAllowEntity() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAllowEntity.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAllowEntity();
					}
				});
			} else
				$scope.CallSaveUpdateAllowEntity();

		}
	};

	$scope.CallSaveUpdateAllowEntity = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SaveEntityAccess",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.AllowEntityList }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);


		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});


	}

});