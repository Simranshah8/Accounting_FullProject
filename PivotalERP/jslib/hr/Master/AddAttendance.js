app.controller('AddAttendanceController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Add Attendance';


	$scope.LoadData = function () {

		$('.select2').select2();

		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();


		$scope.currentPages = {
			AddAttendance: 1

		};

		$scope.searchData = {
			AddAttendance: ''

		};

		$scope.perPage = {
			AddAttendance: GlobalServices.getPerPageRow()

		};

		//for department
		$scope.DepartmentList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllDepartment",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DepartmentList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);

		});

		$scope.newEmployeeWise = {
			EmployeeWiseId: null,
			ForDate_TMP: new Date(),
			Present: false,
			EmployeeWiseDetailsColl: [],
			//Mode: 'Save'
		};


		//$scope.GetAllStudentList();
		//$scope.GetAllEmployeeList();


	}
	$scope.ClearEmployeeWise = function () {
		$scope.newEmployeeWise = {
			EmployeeWiseId: null,

			EmployeeWiseDetailsColl: [],
			//Mode: 'Save'
		};
		$scope.newEmployeeWise.EmployeeWiseDetailsColl.push({});
	}




	//************************* Employee Wise *********************************

	$scope.PresentAllEmployee = function () {

		var pAll = $scope.newEmployeeWise.Present;

		if ($scope.newEmployeeWise.EmployeeWiseDetailsColl) {

			angular.forEach($scope.newEmployeeWise.EmployeeWiseDetailsColl, function (st) {
				st.Attendance = (pAll == true ? 1 : 2);
			});
		}
	};

	$scope.GetEmpSummaryList = function () {
		if (isEmptyObj($scope.newEmployeeWise.DepartmentId))
			$scope.newEmployeeWise.DepartmentId = 0;

		if ($scope.newEmployeeWise.DepartmentId >= 0 && $scope.newEmployeeWise.ForDateDet) {

			$scope.loadingstatus = "running";
			showPleaseWait();

			var para = {
				DepartmentIdColl: $scope.newEmployeeWise.DepartmentId.toString()
			}
			$http({
				method: 'POST',
				url: base_url + "HR/Report/GetEmpSummary",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess) {
					$scope.newEmployeeWise.EmployeeWiseDetailsColl = res.data.Data;

					var para1 = {
						DepartmentId: para.DepartmentIdColl,
						forDate: ($filter('date')(new Date($scope.newEmployeeWise.ForDateDet.dateAD), 'yyyy-MM-dd')),
						InOutMode: 3
					};

					$http({
						method: 'POST',
						url: base_url + "HR/Master/GetEmployeeDailyAttendance",
						dataType: "json",
						data: JSON.stringify(para1)
					}).then(function (res1) {

						if (res1.data.IsSuccess && res1.data.Data) {
							var attendanceColl = mx(res1.data.Data);

							angular.forEach($scope.newEmployeeWise.EmployeeWiseDetailsColl, function (st) {

								var att = attendanceColl.firstOrDefault(p1 => p1.EmployeeId == st.EmployeeId);
								st.ForDate = para1.forDate;
								st.Attendance = (att ? att.Attendance : null);
								st.LateMin = (att ? att.LateMin : 0);
								st.Remarks = (att ? att.Remarks : '');
								st.InOutMode = para1.InOutMode;
								st.DepartmentId = para1.DepartmentId;

							});

						} else {
							Swal.fire(res.data.ResponseMSG);
						}

					}, function (reason) {
						Swal.fire('Failed' + reason);
					});


				} else {
					Swal.fire(res.data.ResponseMSG);
				}

			}, function (reason) {
				Swal.fire('Failed' + reason);
			});

		}

	}

	$scope.IsValidEmployeeWise = function () {
		//if ($scope.newEmployeeWise.Exam.isEmpty()) {
		//	Swal.fire('Please ! Select Exam Type');
		//	return false;
		//}

		return true;
	}

	$scope.SaveUpdateEmployeeWise = function () {
		if ($scope.IsValidEmployeeWise() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newEmployeeWise.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateEmployeeWise();
					}
				});
			} else
				$scope.CallSaveUpdateEmployeeWise();

		}
	};

	$scope.CallSaveUpdateEmployeeWise = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.newEmployeeWise.ForDate = $filter('date')(new Date($scope.newEmployeeWise.ForDateDet.dateAD), 'yyyy-MM-dd');
		angular.forEach($scope.newEmployeeWise.EmployeeWiseDetailsColl, function (ew) {
			ew.ForDate = $scope.newEmployeeWise.ForDate; // Set the formatted date for each employee
		});
		$http({
			method: 'POST',
			url: base_url + "HR/Master/SaveEmployeeDailyAttendance",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newEmployeeWise.EmployeeWiseDetailsColl }
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