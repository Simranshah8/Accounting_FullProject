
app.controller('userWiseBranchController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Allow Entity';

	$scope.LoadData = function () {
		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});

		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.searchData = {
			AllowEntity: '',

		};

		$scope.newUserWiseBranch = {		 
			UserId: null, 
			IsAllow:false			 
		};

		$scope.AllowBranchList = [];
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

	 

	}

	$scope.ClearAllowBranch = function () {
		$scope.newUserWiseBranch = {
			UserId: null,
			BranchId: null,
			IsAllow: false
		};
	}


	//************************* AllowEntity *********************************

	$scope.CheckAll = function () {
		var tmpData = $filter('filter')($scope.AllowBranchList, $scope.searchData.AllowEntity);

		angular.forEach(tmpData, function (ent) {
			ent.IsAllow = $scope.newUserWiseBranch.IsAllow;
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

		$scope.newUserWiseBranch.IsAllow = false;
		$scope.AllowBranchList = [];

		var para = {
			forUserId: $scope.newUserWiseBranch.UserId
		};
	 
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetUserWiseBranch",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AllowBranchList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.SaveUpdateAllowBranch = function () {
		if ($scope.AllowBranchList && $scope.AllowBranchList.length > 0) {
			$scope.loadingstatus = "running";
			showPleaseWait();

			var forId = $scope.newUserWiseBranch.UserId;
			 

			$http({
				method: 'POST',
				url: base_url + "Setup/Security/SaveUserWiseBranch",
				headers: { 'Content-Type': undefined },

				transformRequest: function (data) {

					var formData = new FormData();
					formData.append("forId", data.id); 
					formData.append("jsonData", angular.toJson(data.jsonData));

					return formData;
				},
				data: { jsonData: $scope.AllowBranchList, id: forId }
			}).then(function (res) {

				$scope.loadingstatus = "stop";
				hidePleaseWait();

				Swal.fire(res.data.ResponseMSG);

				if (res.data.IsSuccess == true) {
					$scope.newUserWiseBranch.IsAllow = false;				 
				}

			}, function (errormessage) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";

			});
		}

	}

});