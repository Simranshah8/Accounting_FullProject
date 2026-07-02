

app.controller('notApplicableLedController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Allow Godown';

	$scope.LoadData = function () {
		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.searchData = {
			AllowLedgerGroup: '',
		};

		$scope.GetAllLedger();

	}
	 

	//************************* AllowLedgerGroup *********************************
	 
	$scope.GetAllLedger = function () {
		$scope.LedgerColl = [];
		$scope.loadingstatus = "running";
		showPleaseWait();
		 
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetNotApplicableLedger",
			dataType: "json",
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				var idColl = res.data.Data;

				angular.forEach(idColl, function (id) {
					$scope.LedgerColl.push({
						LedgerId:id
					});
				});

				if (!$scope.LedgerColl || $scope.LedgerColl.length == 0) {
					$scope.LedgerColl = [];
					$scope.LedgerColl.push({ LedgerId: null });
                }

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};
	$scope.IsValidData = function () {
		 
		return true;
	}
	$scope.AddRow = function (ind) {
		$scope.LedgerColl.push({ LedgerId: null });
	}
	$scope.delRow = function (ind) {
		if ($scope.LedgerColl) {
			if ($scope.LedgerColl.length > 1) {
				$scope.LedgerColl.splice(ind, 1);				
			}
		}
	}
	$scope.SaveUpdateAllowLedgerGroup = function () {
		if ($scope.IsValidData() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAllowLedgerGroup.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAllowLedgerGroup();
					}
				});
			} else
				$scope.CallSaveUpdateAllowLedgerGroup();

		}
	};

	$scope.CallSaveUpdateAllowLedgerGroup = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var ledgerIdColl = [];
		angular.forEach($scope.LedgerColl, function (led) {
			if (led.LedgerId > 0) {
				ledgerIdColl.push(led.LedgerId);
            }
		});

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SaveNotApplicableLedger",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: ledgerIdColl}
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