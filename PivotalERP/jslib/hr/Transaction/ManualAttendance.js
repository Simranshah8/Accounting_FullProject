

app.controller('ManualAttController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'ManualAttendance';

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();
		$scope.currentPages = {
			ManualAttendance: 1,
		};

		$scope.searchData = {
			ManualAttendance: '',
		};

		$scope.perPage = {
			ManualAttendance: GlobalServices.getPerPageRow(),
		};

		$scope.InOutColl = [
			{ id: 1, text: 'In' },
			{ id: 2, text: 'Out' },
			//{ id: 3, text: 'Both' }
		];


		$scope.newManualAttendanceDet = {
			TranId: null,
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			UserId: null,
			MachineId: null,
			ManualAttendanceDetailColl: [],
			Mode:'Save'
		};

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

		$scope.MachineList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllDevices",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.MachineList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.AttendanceModeList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllAttendanceMode",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AttendanceModeList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.newManualAttendanceDet.ManualAttendanceDetailColl.push({ InOutMode:1, AttendanceDate_TMP: new Date(),});

		$scope.GetAllManualAttendance();


	}
		

	$scope.ClearManualAttendance = function () {
		$scope.newManualAttendanceDet = {
			TranId: null,
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			UserId: null,
			MachineId: null,
			ManualAttendanceDetailColl: [],
			Mode: 'Save'
		};
		$scope.newManualAttendanceDet.ManualAttendanceDetailColl.push({ InOutMode: 1,AttendanceDate_TMP: new Date(),});
	}

	$scope.AddManualAttendanceDet = function (index) {
		if ($scope.newManualAttendanceDet.ManualAttendanceDetailColl) {
			var coll = $scope.newManualAttendanceDet.ManualAttendanceDetailColl;
			var currentMode = coll[index].InOutMode || 0;
			var nextMode = 0;
			if (currentMode == 1)
				nextMode = 2;
			else if (currentMode == 2)
				nextMode = 1;
			else
				nextMode = 1;
			coll.splice(index + 1, 0, {
				InOutMode: nextMode,
				AttendanceDate_TMP: new Date()
			});
		}
	};


	$scope.DeleteManualAttendanceDet = function (index) {
		if ($scope.newManualAttendanceDet.ManualAttendanceDetailColl) {
			if ($scope.newManualAttendanceDet.ManualAttendanceDetailColl.length > 1) {
				$scope.newManualAttendanceDet.ManualAttendanceDetailColl.splice(index, 1);
			}
		}
	}

	$scope.formatTime =function(dt) {
		if (!dt) return '';
		var t = new Date(dt);
		if (isNaN(t)) return '';
		var hours = t.getHours();
		var minutes = t.getMinutes();
		var ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12; // hour 0 => 12
		minutes = minutes < 10 ? '0' + minutes : minutes;
		return hours + ':' + minutes + ' ' + ampm;
	}

	//************************Manual Attendance*************

	$scope.IsValidManualAttendance = function () {
		if (!$scope.newManualAttendanceDet.UserId || $scope.newManualAttendanceDet.UserId < 0) {
			Swal.fire('Please ! Select Employee');
			return false;
		}
		return true;
	}
	$scope.SaveUpdateManualAttendance = function () {
		if ($scope.IsValidManualAttendance() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newManualAttendanceDet.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/ Read more about isConfirmed, isDenied below /
					if (result.isConfirmed) {
						$scope.CallSaveUpdateManualAttendance();
					}
				});
			} else
				$scope.CallSaveUpdateManualAttendance();
		}
	};

	$scope.CallSaveUpdateManualAttendance = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		if ($scope.newManualAttendanceDet.ManualAttendanceDetailColl) {
			$scope.newManualAttendanceDet.ManualAttendanceDetailColl.forEach((S) => {
				if (S.AttendanceDateDet)
					S.AttendanceDate = $filter('date')(new Date(S.AttendanceDateDet.dateAD), 'yyyy-MM-dd');
				if (S.InOutTime)
					S.InOutTime = $filter('date')(S.InOutTime, 'yyyy-MM-dd HH:mm');
				if (S.OutTime)
					S.OutTime = $filter('date')(S.OutTime, 'HH:mm');
			});
		}
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SaveManualAttendance",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newManualAttendanceDet }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearManualAttendance();
				$scope.GetAllManualAttendance();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});

	}

	$scope.GetAllManualAttendance = function () {

		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.ManualAttendanceList = [];

		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllManualAttendance",
			dataType: "json"
		}).then(function (res) {

			hidePleaseWait();
			$scope.loadingstatus = "stop";

			if (res.data.IsSuccess && res.data.Data) {

				//// 👉 Group by UserId
				//var attColl = mx(res.data.Data).groupBy(function (p) {
				//	return p.UserId;
				//});

				$scope.ManualAttendanceList = [];
				$scope.ManualAttendanceList = res.data.Data;
				//angular.forEach(attColl, function (group) {

				//	if (group.elements.length > 0) {
				//		var first = group.elements[0];

				//		var sortedRecords = mx(group.elements)
				//			.orderBy(function (p) {
				//				return p.InOutTime;
				//			})
				//			.toArray();

				//		var firstRecord = sortedRecords[0];
				//		var lastRecord = sortedRecords[sortedRecords.length - 1];

				//		var firstIn = firstRecord.InOutTime || null;
				//		var lastOut = lastRecord.OutTime || null;

				//		var inOutTime = '';

				//		var hasIn = sortedRecords.some(x => x.AttMode === "In");
				//		var hasOut = sortedRecords.some(x => x.AttMode === "Out");
				//		var hasNormal = sortedRecords.some(x => x.AttMode === "Normal");

				//		if (hasNormal) {
				//			if (firstIn || lastOut) {
				//				inOutTime =
				//					(firstIn ? $scope.formatTime(firstIn) : '') +
				//					(lastOut ? ' - ' + $scope.formatTime(lastOut) : '');
				//			}
				//		}
				//		else if (hasIn && !hasOut) {
				//			if (firstIn) {
				//				inOutTime = $scope.formatTime(firstIn);
				//			}
				//		}
				//		else if (!hasIn && hasOut) {
				//			if (lastOut) {
				//				inOutTime = $scope.formatTime(lastOut);
				//			}
				//		}
				//		else {
				//			if (firstIn || lastOut) {
				//				inOutTime =
				//					(firstIn ? $scope.formatTime(firstIn) : '') +
				//					(lastOut ? ' - ' + $scope.formatTime(lastOut) : '');
				//			}
				//		}
				//		var firstMode = firstRecord.AttMode || '';
				//		var lastMode = lastRecord.AttMode || '';
				//		var attMode = '';
				//		if (firstMode || lastMode) {
				//			attMode = firstMode + (lastMode ? ' - ' + lastMode : '');
				//		}
				//		var beData = {
				//			TranId: first.TranId,
				//			UserId: group.key,
				//			UserFullName: first.UserFullName,
				//			Machine: first.Machine,
				//			AttendanceDate: first.AttendanceDate,
				//			AttendanceMitti: first.AttendanceMitti,
				//			InOutTimes: inOutTime,
				//			AttMode: attMode
				//		};

				//		$scope.ManualAttendanceList.push(beData);
				//	}
				//});

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire('Failed: ' + reason);
		});
	};



	$scope.GetManualAttendanceById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TranId: refData.TranId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/GetManualAttendanceById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newManualAttendanceDet = res.data.Data;
				$scope.newManualAttendanceDet.SelectEmployee = $scope.EmployeeSearchOptions[0].value;

				if (!$scope.newManualAttendanceDet.ManualAttendanceDetailColl || $scope.newManualAttendanceDet.ManualAttendanceDetailColl.length == 0) {
					$scope.newManualAttendanceDet.ManualAttendanceDetailColl = [];
					$scope.newManualAttendanceDet.ManualAttendanceDetailColl.push({});
				}

				if ($scope.newManualAttendanceDet.ManualAttendanceDetailColl) {
					$scope.newManualAttendanceDet.ManualAttendanceDetailColl.forEach((S) => {
						if (S.AttendanceDate)
							S.AttendanceDate_TMP = new Date(S.AttendanceDate);
						if (S.InOutTime)
							S.InOutTime = new Date(S.InOutTime);
						if (S.OutTime)
							S.OutTime = new Date(S.OutTime);
					});
				}
				$scope.newManualAttendanceDet.Mode = 'Modify';

				$('#custom-tabs-four-profile-tab').tab('show');


			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DeleteManualAttendance = function (refData) {
		Swal.fire({
			title: 'Do you want to delete the selected data?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			/ Read more about isConfirmed, isDenied below /
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();
				var para = {
					TranId: refData.MADetailId
				};
				$http({
					method: 'POST',
					url: base_url + "HR/Transaction/DeleteManualAttendance",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllManualAttendance();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	};

	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});