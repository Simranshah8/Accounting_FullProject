app.controller('PayrollConfigurationController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'PayrollConfiguration';

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.VoucherTypeColl = []; //declare an empty array

		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetVoucherList?voucherType=3",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.VoucherTypeColl = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});



		$scope.CostClassColl = []; //declare an empty array

		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetAllCostClasss",
			dataType: "json"
			//data:JSON.stringify(para)
		}).then(function (res) {

			$scope.loadingstatus = 'stop';
			hidePleaseWait();

			if (res.data.IsSuccess && res.data.Data) {
				$timeout(function () {
					$scope.CostClassColl = res.data.Data;
				});
			} else
				alert(res.data.ResponseMSG);

		}, function (reason) {
			alert('Failed' + reason);
		});

		//Added by suresh for Payslip
		$scope.PaySlipReportColl = [];

		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllPaySlipsReport",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {

				var dtColl = res.data.Data;
				dtColl.forEach(function (dt) {
					if (dt.IsActive == true) {
						$scope.PaySlipReportColl.push(dt);
					}
				});
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
		//Ends

		$scope.newPayrollConfig = {
			TranId: null,
			JV_VoucherId: null,
			JV_CostClassId: null,
			JV_AutoGenerate: false,
			JV_AutoCancelRegenerate: false,
			PV_VoucherId: null,
			PV_CostClassId: null,
			PV_AutoGenerate: false,
			PV_AutoCancelRegenerate: false,
			AV_VoucherId: null,
			AV_CostClassId: null,
			AV_AutoGenerate: false,
			AV_AutoCancelRegenerate: false,
			NoOfDecimal: 2,
			PaySlipTemplateId: null,
			//added
			ShowSalAttn: true,
			BlockScreenshot: false,
			AllowPayslipDL: true,
			Mode: 'Save'
		};
		$scope.GetPayrollConfiguration();
	}

	$scope.ClearPayrollConfig = function () {
		$scope.newPayrollConfig = {
			TranId: null,
			JV_VoucherId: null,
			JV_CostClassId: null,
			JV_AutoGenerate: false,
			JV_AutoCancelRegenerate: false,
			PV_VoucherId: null,
			PV_CostClassId: null,
			PV_AutoGenerate: false,
			PV_AutoCancelRegenerate: false,
			AV_VoucherId: null,
			AV_CostClassId: null,
			AV_AutoGenerate: false,
			AV_AutoCancelRegenerate: false,
			NoOfDecimal: 2,
			PaySlipTemplateId: null,
			/*added*/
			ShowSalAttn: true,
			BlockScreenshot: false,
			AllowPayslipDL: true,
			Mode: 'Save'
		}
    }


	//*************************PayrollConfig *********************************

	$scope.IsValidPayrollConfig = function () {
		//if ($scope.newPayrollConfig.Name.isEmpty()) {
		//	Swal.fire('Please ! Enter PayrollConfig Name');
		//	return false;
		//}

		return true;
	}

	$scope.SaveUpdatePayrollConfig = function () {
		if ($scope.IsValidPayrollConfig() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newPayrollConfig.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdatePayrollConfig();
					}
				});
			} else
				$scope.CallSaveUpdatePayrollConfig();

		}
	};

	$scope.CallSaveUpdatePayrollConfig = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SavePayrollConfig",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newPayrollConfig }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				/*$scope.ClearPayrollConfig();*/
				//$scope.GetAllPayrollConfigList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}


	$scope.GetPayrollConfiguration = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.newPayrollConfig = {};

		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/GetPayrollConfiguration",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newPayrollConfig = res.data.Data;
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