app.controller('DairyPurchaseController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Dairy Purchase';

	OnClickDefault();
	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.LanguageColl = GlobalServices.getLangList();

		$scope.currentPages = {
			Partywise: 1,


		};

		$scope.searchData = {
			Partywise: '',

		};

		$scope.perPage = {
			Partywise: GlobalServices.getPerPageRow(),

		};

		

	};


	$scope.ClearPartywise = function () {
		$scope.newPartywise = {
			PartywiseId: null,
			PartywiseDate: null,
			PartywiseTypeId: null,
			SourceId: null,
			PartywiseBy: '',
			PhoneNo: null,
			AssignedToId: null,
			ActionTaken: '',
			Remarks: '',

			AttachmentColl: [],
			Description: '',
			Mode: 'Save'
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

	//************************* Class *********************************

	$scope.IsValidPartywise = function () {
		if ($scope.newPartywise.PartywiseBy.isEmpty()) {
			Swal.fire('Please ! Enter who Partywise');
			return false;
		}

		if ($scope.newPartywise.ActionTaken.isEmpty()) {
			Swal.fire('Please ! Enter Action Taken');
			return false;
		}
		if ($scope.newPartywise.Remarks.isEmpty()) {
			Swal.fire('Please ! Enter Remarks');
			return false;
		}



		return true;
	};


	$scope.delAttachmentFiles = function (ind) {
		if ($scope.newPartywise.AttachmentColl) {
			if ($scope.newPartywise.AttachmentColl.length > 0) {
				$scope.newPartywise.AttachmentColl.splice(ind, 1);
			}
		}
	}
	$scope.AddMoreFiles = function (files, docType, des) {

		if (files && docType) {
			if (files != null && docType != null) {

				angular.forEach(files, function (file) {
					$scope.newPartywise.AttachmentColl.push({
						DocumentTypeId: docType.id,
						DocumentTypeName: docType.text,
						File: file,
						Name: file.name,
						Type: file.type,
						Size: file.size,
						Description: des,
						Path: null
					});
				})

				$scope.docType = null;
				$scope.attachFile = null;
				$scope.docDescription = '';
			}
		}
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

