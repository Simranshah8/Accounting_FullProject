

app.controller('AllowUserWiseAutoPostController', function ($scope, $http, $timeout, $filter, GlobalServices) {

	$scope.Title = 'Allow User Wise AutoPost';

	$scope.LoadData = function () {
		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.searchData = {
			AllowModule: '',
		};

		$scope.newAllowModule = {
			AllowModuleId: null,
			UserId: null,
			GroupId: null,
			UserWise: 1,
			ForTransaction: false,
			ForReporting: false

		};

		$scope.AllowModuleList = [];
		$scope.UserList = [];
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllUserList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.UserList = res.data.Data;

				$scope.GetAllowModuleList();

			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	
		 

	}

	$scope.ClearAllowModule = function () {
		$scope.newAllowModule = {
			AllowModuleId: null,
			UserId: null,
			GroupId: null,
			UserWise: 1,
			ForTransaction: false,
			ForReporting: false

		};
	}


	//************************* AllowModule *********************************


	$scope.CheckAllForTransaction = function () {
		var tmpData = $filter('filter')($scope.AllowModuleList, $scope.searchData.AllowModule);

		angular.forEach(tmpData, function (ent) {
			ent.IsAllow = $scope.newAllowModule.IsAllow;
		});
	}
	$scope.CheckAllForReporting = function () {
		var tmpData = $filter('filter')($scope.AllowModuleList, $scope.searchData.AllowModule);

		angular.forEach(tmpData, function (ent) {
			ent.IsAllow = $scope.newAllowModule.IsAllow;
		});
	}
	$scope.GetAllowModuleList = function () {

		$scope.loadingstatus = "running";
		showPleaseWait();
		 

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetUserWiseAutoPost",
			dataType: "json"			 
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AllowModuleList = angular.copy($scope.UserList);
				var qry = mx(res.data.Data);
				$scope.AllowModuleList.forEach(function (md) {
					if (qry.contains(md.UserId) == true) {
						md.IsAllow = true;
					}
					else {
						md.IsAllow = false;
                    }
				});
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};
	$scope.IsValidAllowModule = function () {

		if (!$scope.AllowModuleList || $scope.AllowModuleList.length == 0) {
			Swal.fire('Not Data Found For Save');
			return false;
		}

		return true;
	}
	$scope.SaveUpdateAllowModule = function () {
		if ($scope.IsValidAllowModule() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAllowModule.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAllowModule();
					}
				});
			} else
				$scope.CallSaveUpdateAllowModule();

		}
	};

	$scope.CallSaveUpdateAllowModule = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var dataColl = [];
		$scope.AllowModuleList.forEach(function (md) {
			if (md.IsAllow == true) {
				dataColl.push(md.UserId);
            }
		});
		 

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SaveUserWiseAutoPost",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();	 
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: dataColl }
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