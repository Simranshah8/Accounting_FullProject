

app.controller('partyWiseProductRateController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Partywise Charge Setup';


	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();

		 

		$scope.newPartywiseChargeSetup = {
			PartyLedgerId: null,
			Mode: 'Save',
			ApplicableFrom_TMP:new Date(),
			PartywiseChargeSetupDetailsColl: []
		};
		$scope.PartywiseChargeSetupList = [];
		$scope.newPartywiseChargeSetup.PartywiseChargeSetupDetailsColl.push({});

		//$scope.GetAllPartywiseChargeSetupList();

	}



	$scope.ClearPartywiseChargeSetup = function () {

		$scope.newPartywiseChargeSetup = {
			PartyLedgerId: null,
			Mode: 'Save',
			ApplicableFrom_TMP: new Date(),
			PartywiseChargeSetupDetailsColl: []
		};
		$scope.PartywiseChargeSetupList = [];
		$scope.newPartywiseChargeSetup.PartywiseChargeSetupDetailsColl.push({});

	}


	//************************* PartywiseChargeSetup *********************************

	$scope.IsValidPartywiseChargeSetup = function () {
		//if ($scope.newPartywiseChargeSetup.Name.isEmpty()) {
		//	Swal.fire('Please ! Enter PartywiseChargeSetup Name');
		//	return false;
		//}


		return true;
	}

	$scope.SaveUpdatePartywiseChargeSetup = function () {

		if ($scope.IsValidPartywiseChargeSetup() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newLedger.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdatePartywiseChargeSetup();
					}
				});
			} else
				$scope.CallSaveUpdatePartywiseChargeSetup();

		}
		 
	};

	$scope.CallSaveUpdatePartywiseChargeSetup = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var tmpDataColl = [];
		angular.forEach($scope.PartywiseChargeSetupList, function (pc) {

			if (pc.ProductId > 0) {
				var beData = {
					LedgerId: $scope.newPartywiseChargeSetup.PartyLedgerId,
					ProductId: pc.ProductId,
					ApplicationFrom: $filter('date')(new Date($scope.newPartywiseChargeSetup.ApplicableFromDet.dateAD), 'yyyy-MM-dd'),
					PurchaseRate: pc.PurchaseRate,
					SellRate: pc.SellRate,
				};
				tmpDataColl.push(beData);
            }
		});

		$http({
			method: 'POST',
			url: base_url + "Inventory/Creation/SavePartyWiseProductRate",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: tmpDataColl }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearPartywiseChargeSetup();
            }
 

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.PartySelectionChange = function (pdet) {

		$scope.PartywiseChargeSetupList = [];

		if (!$scope.newPartywiseChargeSetup)
			return;

		if ($scope.newPartywiseChargeSetup.PartyLedgerId>0) {

			$scope.loadingstatus = "running";
			showPleaseWait();

			var para = {
				LedgerId: $scope.newPartywiseChargeSetup.PartyLedgerId
			};
			$http({
				method: 'POST',
				url: base_url + "Inventory/Creation/GetPartyWiseProductRate",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					$scope.PartywiseChargeSetupList = res.data.Data;

					if (!$scope.PartywiseChargeSetupList || $scope.PartywiseChargeSetupList.length == 0) {
						$scope.PartywiseChargeSetupList = [];
						$scope.PartywiseChargeSetupList.push({
							PurchaseRate: 0,
							SellRate:0
						});
					}

				} else {
					Swal.fire(res.data.ResponseMSG);
				}

			}, function (reason) {
				Swal.fire('Failed' + reason);
			});

        }
		

	}
	 
	$scope.DelPartywiseChargeSetupById = function (refData) {

		Swal.fire({
			title: 'Do you want to delete the selected data?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();

				var para = {
					PartywiseChargeSetupId: refData.PartywiseChargeSetupId
				};

				$http({
					method: 'POST',
					url: base_url + "Inventory/Creation/DelPartywiseChargeSetup",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllPartywiseChargeSetupList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};


	$scope.AddRow = function (ind) {

		if ($scope.PartywiseChargeSetupList) {
			if ($scope.PartywiseChargeSetupList.length > ind + 1) {

				var selectItem = $scope.PartywiseChargeSetupList[ind + 1];
				if (!selectItem.ProductId || selectItem.ProductId == null || selectItem.ProductId == 0)
					return;

				$scope.PartywiseChargeSetupList.splice(ind + 1, 0, {
					ProductId: null,
					PurchaseRate: 0,
					SellRate: 0
				});
			}
			else if ($scope.PartywiseChargeSetupList.length == (ind + 1)) {
				var selectItem = $scope.PartywiseChargeSetupList[ind];
				if (!selectItem.ProductId || selectItem.ProductId == null || selectItem.ProductId == 0)
					return;

				$scope.PartywiseChargeSetupList.push({
					ProductId: null,
					PurchaseRate: 0,
					SellRate: 0
				});
			}
			else {
				$scope.PartywiseChargeSetupList.push({
					ProductId: null,
					PurchaseRate: 0,
					SellRate: 0
				});
			}

		} 

	}

	$scope.delRow = function (ind) {
		if ($scope.PartywiseChargeSetupList) {
			if ($scope.PartywiseChargeSetupList.length > 1) {
				$scope.PartywiseChargeSetupList.splice(ind, 1);				
			}
		}
	}

	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

	$scope.DelPartyWiseRate = function () {

		if ($scope.newPartywiseChargeSetup.PartyLedgerId > 0) {

		} else
			return;

		Swal.fire({
			title: 'Are you sure you want to delete selected party rate list ? ',
			showCancelButton: true,
			confirmButtonText: 'Delete',
			//message: 'Are you sure to delete selected Branch :-' + beData.Name,
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { LedgerId: $scope.newPartywiseChargeSetup.PartyLedgerId };
				$http({
					method: 'POST',
					url: base_url + "Inventory/Creation/DelPartyWiseProductRate",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.ClearPartywiseChargeSetup();
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});
	}

});