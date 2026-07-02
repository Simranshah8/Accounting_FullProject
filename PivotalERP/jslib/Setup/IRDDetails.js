
app.controller('IRDDetails', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'IRDDetails';

	$scope.LoadData = function () {
		$('.select2').select2();
		
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.IRDDetails = {
			API: '',
			UserName: '',
			Password: '',
			Fyear: '',
			APIUserName: '',
			APIPwd: '',			
			Mode: 'Save'
		};

		$scope.irdData = {
			StartDate_TMP: new Date(),
			EndDate_TMP: new Date(),
			FromVoucherNo: 0,
			ToVoucherNo: 0,
			VoucherType:14
		};
		//$scope.GetIRDDetails(); 

		$scope.BranchList = [];
		$http({
			method: 'GET',
			url: base_url + "Setup/Security/GetAllBranchList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchList = res.data.Data;
				if ($scope.BranchList && $scope.BranchList.length > 0) {
					$scope.IRDDetails.BranchId = $scope.BranchList[0].BranchId;
					$scope.getIRDDetailsForBranch();
                }
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.ClearFields = function () {
		$scope.loadingstatus = "stop";
		$scope.IRDDetails = {
			API: '',
			UserName: '',
			Password: '',
			Fyear: '',
			APIUserName: '',
			APIPwd: '',

			Mode: 'Save'
		}
	}
	$scope.IsValidIRDDetails = function () {
		if ($scope.IRDDetails.API.isEmpty()) {
			Swal.fire('Please ! Enter Valid API Name');
			return false;
		}
		if ($scope.IRDDetails.UserName.isEmpty()) {
			Swal.fire('Please ! Enter Valid UserName');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateIRDDetails = function () {
		if ($scope.IsValidIRDDetails() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.IRDDetails.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateIRDDetails();
					}
				});
			} else
				$scope.CallSaveUpdateIRDDetails();

		}
	};
	$scope.CallSaveUpdateIRDDetails = function () {

		$scope.loadingstatus = 'running';
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SaveIRDDetails",
			headers: { 'content-Type': undefined },

			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.IRDDetails }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			 
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.CallPendingDataSynsIRD = function () {
		$scope.loadingstatus = 'running';
		showPleaseWait();

		var para = {
			StartDate: ($scope.irdData.StartDateDet ? $filter('date')(new Date($scope.irdData.StartDateDet.dateAD), 'yyyy-MM-dd') : null),
			EndDate: ($scope.irdData.EndDateDet ? $filter('date')(new Date($scope.irdData.EndDateDet.dateAD), 'yyyy-MM-dd') : null),
			FromVoucherNo: $scope.irdData.FromVoucherNo,
			ToVoucherNo: $scope.irdData.ToVoucherNo,
			VoucherType:$scope.irdData.VoucherType
		};

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/PendingDataSynsIRD",
			dataType: "json",
			data:JSON.stringify(para)
		}).then(function (res)
		{
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			 
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetIRDDetails = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.IRDDetails = {};

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetIRDDetails",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.IRDDetails = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	};

	$scope.getIRDDetailsForBranch = function () {

		if ($scope.IRDDetails.BranchId && $scope.IRDDetails.BranchId > 0) {
			$scope.loadingstatus = "running";
			showPleaseWait();
			var para = {
				BranchId: $scope.IRDDetails.BranchId
			}
			$http({
				method: 'POST',
				url: base_url + "Setup/Security/GetIRDDetailsForBranch",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					var ird = res.data.Data;
					$scope.IRDDetails.API = ird.API;
					$scope.IRDDetails.UserName = ird.UserName;
					$scope.IRDDetails.Password = ird.Password;
					$scope.IRDDetails.APIPwd = ird.APIPwd;
					$scope.IRDDetails.APIUserName = ird.APIUserName;
					$scope.IRDDetails.FYear = ird.FYear;
				} else {
					$scope.IRDDetails.API = '';
					$scope.IRDDetails.UserName = '';
					$scope.IRDDetails.Password = '';
					$scope.IRDDetails.APIPwd = '';
					$scope.IRDDetails.APIUserName = '';
					$scope.IRDDetails.FYear = '';
                }

			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
        }
		
    }

});