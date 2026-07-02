app.controller('MappingByEmpController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Mapping';

	LoadData();

	function LoadData() {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();
		$scope.currentPages = {
			Mapping: 1,
		};

		$scope.searchData = {
			Mapping: '',

		};

		$scope.perPage = {
			Mapping: GlobalServices.getPerPageRow()
		};

		$scope.WorkingShiftList = [];
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetAllWorkingShift",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.WorkingShiftList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.newMapping = {
			MappingId: null,
			WorkingShiftId: null,
			DateFrom_TMP: null,
			DateTo_TMP: null,
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			WorkShiftColl:[],
			Mode: 'Save'
		};
		$scope.newMapping.WorkShiftColl.push({});

	};

	$scope.ClearMapping = function () {
		$scope.newMapping = {
			MappingId: null,
			WorkingShiftId: null,
			DateFrom_TMP: null,
			DateTo_TMP: null,
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			WorkShiftColl:[],
			Mode: 'Save'
		};
		$scope.newMapping.WorkShiftColl.push({});
	}




	//*************************Shift Mapping*********************************

	$scope.AddWorkShift = function (ind) {
		if ($scope.newMapping.WorkShiftColl) {
			if ($scope.newMapping.WorkShiftColl.length > ind + 1) {
				$scope.newMapping.WorkShiftColl.splice(ind + 1, 0, {
					WorkingShiftId: null
				})
			} else {
				$scope.newMapping.WorkShiftColl.push({
					WorkingShiftId: null
				})
			}
		}
	};
	$scope.delWorkShift = function (ind, workShift) {
		if ($scope.newMapping.WorkShiftColl) {
			if ($scope.newMapping.WorkShiftColl.length > 1) {
				$scope.newMapping.WorkShiftColl.splice(ind, 1);
				if (workShift.ShiftMappingId) {
					var para = {
						ShiftMappingId: workShift.ShiftMappingId
					};
					$http({
						method: 'POST',
						url: base_url + "HR/Master/DelShiftMapping",
						dataType: "json",
						data: JSON.stringify(para)
					});
				}
			}
		}
	};


	$scope.updateDateConstraints = function (workShift) {
		if ($scope.newMapping.IsMultipleShift) {
			// Allow same date for DateFrom and DateTo
			workShift.DateToMin = null; // No restriction
		} else {
			// Restrict DateTo to be after DateFrom
			if (workShift.DateFrom_TMP) {
				let dateFrom = new Date(workShift.DateFrom_TMP);
				workShift.DateToMin = new Date(dateFrom.setDate(dateFrom.getDate() + 1)); // Minimum is the next day
			}
		}
	};

	$scope.IsValidMapping = function () {
		//if (!$scope.newMapping.WorkShiftColl.DateFromDet || !$scope.newMapping.WorkShiftColl.DateFromDet.dateAD) {
		//	Swal.fire('Please ! Enter From Date');
		//	return false;
		//}

		//if (!$scope.newMapping.WorkShiftColl.DateToDet || !$scope.newMapping.WorkShiftColl.DateToDet.dateAD) {
		//	Swal.fire('Please ! Enter To Date');
		//	return false;
		//}
		return true;
	}

	$scope.SaveUpdateMapping = function () {
		if ($scope.IsValidMapping() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newMapping.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateMapping();
					}
				});
			} else
				$scope.CallSaveUpdateMapping();

		}
	};

	$scope.CallSaveUpdateMapping = function () { 
		$scope.loadingstatus = "running";
		showPleaseWait();

		// Process WorkShiftColl
		var processWorkShiftColl = function () {
			var workShiftArray = [];
			for (var i = 0; i < $scope.newMapping.WorkShiftColl.length; i++) {
				var shift = $scope.newMapping.WorkShiftColl[i];

				var dataItem = {
					EmployeeId: $scope.newMapping.EmployeeId,
					IsMultipleShift: $scope.newMapping.IsMultipleShift,
					WorkingShiftId: shift.WorkingShiftId,
					DateFrom_AD: shift.DateFromDet ? $filter('date')(new Date(shift.DateFromDet.dateAD), 'yyyy-MM-dd') : null,
					DateTo_AD: shift.DateToDet ? $filter('date')(new Date(shift.DateToDet.dateAD), 'yyyy-MM-dd') : null
				};

				workShiftArray.push(dataItem);
			}
			return workShiftArray;
		};

		// Prepare data to save
		var workShiftData = processWorkShiftColl();
		$http({
			method: 'POST',
			url: base_url + "HR/Master/SaveShiftMapping",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: workShiftData }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess) {
				$scope.ClearMapping();
				$scope.GetAllMappingList();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire('Failed to save data. Please try again.');
		});
	};

	$scope.GetAllMappingList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.MappingList = [];
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetAllShiftMapping",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.MappingList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.DelDuplicate = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();		
		$http({
			method: 'POST',
			url: base_url + "HR/Master/DelDuplicateWorkingShift",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire(res.data.ResponseMSG);
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}




	$scope.GetShiftMappingByEmp = function (refData) {

		if (refData.EmployeeDetails) {
			$scope.newMapping.EmployeeId = refData.EmployeeDetails.EmployeeId;
		}
		else {
			$scope.newMapping.EmployeeId = null;
		}

		if ($scope.newMapping.EmployeeId > 0) {
			$scope.loadingstatus = "running";
			showPleaseWait();
			var para = {
				EmployeeId: $scope.newMapping.EmployeeId,
			};

			$http({
				method: 'POST',
				url: base_url + "HR/Master/GetShiftMappingByEmp",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					$scope.newMapping.IsMultipleShift = res.data.Data[0].IsMultipleShift;
					$scope.newMapping.WorkShiftColl = res.data.Data;
					if (!$scope.newMapping.WorkShiftColl || $scope.newMapping.WorkShiftColl.length == 0) {
						$scope.newMapping.WorkShiftColl = [];
						$scope.newMapping.WorkShiftColl.push({});
					}
					if ($scope.newMapping.WorkShiftColl) {
						$scope.newMapping.WorkShiftColl.forEach((S) => {
							if (S.DateFrom_AD)
								S.DateFrom_TMP = new Date(S.DateFrom_AD);
							if (S.DateTo_AD)
								S.DateTo_TMP = new Date(S.DateTo_AD);
						});
					}
					$scope.newMapping.Mode = 'Save';

				} else {
					Swal.fire(res.data.ResponseMSG);
				}

			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		}
	};

	$scope.GetMappingById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			MappingId: refData.MappingId
		};

		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetMappingById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newMapping = res.data.Data;
				$scope.newMapping.Mode = 'Modify';
				$('#custom-tabs-four-profile-tab').tab('show');


			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelMappingById = function (workShift) {
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
					ShiftMappingId: workShift.ShiftMappingId,
					EmployeeId: workShift.EmployeeId,
					DateFrom: new Date(workShift.DateFrom_AD),
					DateTo: new Date(workShift.DateTo_AD),
				};

				$http({
					method: 'POST',
					url: base_url + "HR/Master/DelShiftMapping",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllMappingList();
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