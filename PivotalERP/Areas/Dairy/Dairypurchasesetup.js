app.controller('DairyPurchaseSetup', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Dairy Purchase';

	OnClickDefault();
	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.loadingstatus = "stop";
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.currentPages = {
			Partywise: 1,
			Shift:1

		};

		$scope.searchData = {
			Partywise: '',
			Shift: '',
		};

		$scope.perPage = {
			Partywise: GlobalServices.getPerPageRow(),
			Shift: GlobalServices.getPerPageRow(),
		};

	};


	



	function OnClickDefault() {
		document.getElementById('tableform').style.display = "none";
		document.getElementById('shiftform').style.display = "none";

		document.getElementById('addpartywise').onclick = function () {
			document.getElementById('tableform').style.display = "block";
			document.getElementById('showtable').style.display = "none";
			$scope.ClearClass();
		}

		document.getElementById('backpartywise').onclick = function () {
			document.getElementById('tableform').style.display = "none";
			document.getElementById('showtable').style.display = "block";
			$scope.ClearClass();
		}

		document.getElementById('addshift').onclick = function () {
			document.getElementById('shiftform').style.display = "block";
			document.getElementById('showshifttable').style.display = "none";
			$scope.ClearClass();
		}

		document.getElementById('backshift').onclick = function () {
			document.getElementById('shiftform').style.display = "none";
			document.getElementById('showshifttable').style.display = "block";
			$scope.ClearClass();
		}
	};

	//************************* PArtywise *********************************

	$scope.IsValidPartywise = function () {
		if ($scope.newPartywise.PartywiseBy.isEmpty()) {
			Swal.fire('Please ! Enter who Partywise');
			return false;
		}		
		return true;
	};


	$scope.SaveUpdatePartywise = function () {
		if ($scope.IsValidPartywise() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newPartywise.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdatePartywise();
					}
				});
			} else
				$scope.CallSaveUpdatePartywise();

		}
	};

	$scope.CallSaveUpdatePartywise = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.newPartywise.PartywiseDateDet) {
			$scope.newPartywise.PartywiseDate = $scope.newPartywise.PartywiseDateDet.dateAD;
		} else
			$scope.newPartywise.PartywiseDate = null;


		$http({
			method: 'POST',
			url: base_url + "FrontDesk/Transaction/SavePartywise",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newPartywise }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearPartywise();
				$scope.GetAllPartywiseList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	};

	$scope.GetAllPartywiseList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.PartywiseList = [];

		$http({
			method: 'POST',
			url: base_url + "FrontDesk/Transaction/GetAllPartywiseList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.PartywiseList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	};

	$scope.GetPartywiseById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			PartywiseId: refData.PartywiseId
		};

		$http({
			method: 'POST',
			url: base_url + "FrontDesk/Transaction/GetPartywiseById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newPartywise = res.data.Data;
				$scope.newPartywise.Mode = 'Modify';

				document.getElementById('class-section').style.display = "none";
				document.getElementById('class-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelPartywiseById = function (refData) {

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
					PartywiseId: refData.PartywiseId
				};

				$http({
					method: 'POST',
					url: base_url + "FrontDesk/Transaction/DelPartywise",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllPartywiseList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};


	// Shift starts
	$scope.SaveUpdateShift = function () {
		if ($scope.IsValidShift() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newShift.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateShift();
					}
				});
			} else
				$scope.CallSaveUpdateShift();

		}
	};

	$scope.CallSaveUpdateShift = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.newShift.ShiftDateDet) {
			$scope.newShift.ShiftDate = $scope.newShift.ShiftDateDet.dateAD;
		} else
			$scope.newShift.ShiftDate = null;


		$http({
			method: 'POST',
			url: base_url + "FrontDesk/Transaction/SaveShift",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newShift }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearShift();
				$scope.GetAllShiftList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	};

	$scope.GetAllShiftList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.ShiftList = [];

		$http({
			method: 'POST',
			url: base_url + "FrontDesk/Transaction/GetAllShiftList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ShiftList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	};

	$scope.GetShiftById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			ShiftId: refData.ShiftId
		};

		$http({
			method: 'POST',
			url: base_url + "FrontDesk/Transaction/GetShiftById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newShift = res.data.Data;
				$scope.newShift.Mode = 'Modify';

				document.getElementById('class-section').style.display = "none";
				document.getElementById('class-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelShiftById = function (refData) {

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
					ShiftId: refData.ShiftId
				};

				$http({
					method: 'POST',
					url: base_url + "FrontDesk/Transaction/DelShift",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllShiftList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};
});

