app.controller('AllowLeaveTypeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Allow Leave Type';

	$scope.LoadData = function () {
		$('.select2').select2();
		var gSrv = GlobalServices;
		$scope.confirmMSG = gSrv.getConfirmMSG();
		$scope.perPageColl = gSrv.getPerPageList();

		$scope.CompanyRelationshipList = [];
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetAllCompanyRelationship",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CompanyRelationshipList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

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
		$scope.DesignationList = [];
		$http({
			method: 'Get',
			url: base_url + "HR/Master/GetAllDesignation",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DesignationList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
		$scope.LevelList = [];
		$http({
			method: 'Get',
			url: base_url + "HR/Master/GetAllLevel",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.LevelList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.GroupList = [];
		$http({
			method: 'Get',
			url: base_url + "HR/Master/GetAllEmployeeGroup",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.GroupList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.LeaveTypeList = [];
		$http({
			method: 'Post',
			url: base_url + "HR/Leave/GetAllLeaveTypeList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.LeaveTypeList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.BranchList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetBranchListforPayhead",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.currentPages = {
			AllowLeaveType: 1,
		};

		$scope.searchData = {
			AllowLeaveType: '',
		};

		$scope.perPage = {
			AllowLeaveType: gSrv.getPerPageRow(),
		};

		$scope.newFilter = {};

	}


	$scope.CheckUnCheckAll = function (payH) {

		if ($scope.AllowLeaveTypeList) {
			$scope.AllowLeaveTypeList.forEach(function (dc) {
				if (dc.LeaveTypeColl) {
					dc.LeaveTypeColl.forEach(function (ph) {
						if (ph.LeaveTypeId === payH.LeaveTypeId) {
							ph.IsAllow = payH.IsAllow;
						}
					});
				}

			});
		}
	};

	$scope.SaveAllowLeaveType = function () {

		Swal.fire({
			title: 'Do you want to save the current data?',
			showCancelButton: true,
			confirmButtonText: 'Save',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();
				var dtColl = [];
				$scope.AllowLeaveTypeList.forEach(function (emp) {
					emp.LeaveTypeColl.forEach(function (ph) {
						if (ph.IsAllow == true) {
							dtColl.push({
								UserId: emp.UserId,
								LeaveTypeId: ph.LeaveTypeId
							});
						}
					})
				});
				$http({
					method: 'POST',
					url: base_url + "HR/Leave/SaveAllowLeaveType",
					headers: { 'Content-Type': undefined },
					transformRequest: function (data) {
						var formData = new FormData();
						formData.append("jsonData", angular.toJson(data.jsonData));
						return formData;
					},
					data: { jsonData: dtColl }
				}).then(function (res) {
					$scope.loadingstatus = "stop";
					hidePleaseWait();
					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						/*    $scope.GetAllAssignCustomer();*/
					}
				}, function (errormessage) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
				});
			}
		});


	}

	$scope.GetLeaveTypeForAllow = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.AllowLeaveTypeList = [];
		var para = {
			BranchId: $scope.newFilter.BranchId ,
			DepartmentId: $scope.newFilter.DepartmentId,
			DesignationId: $scope.newFilter.DesignationId,
			LevelId: $scope.newFilter.LevelId ,
			EmployeeGroupId: $scope.newFilter.EmployeeGroupId ,
			CompanyRelationshipId: $scope.newFilter.CompanyRelationshipId,
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Leave/GetAllEmployeeForAllowLeaveType",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				var dataColl = mx(res.data.Data);

				var query = dataColl.groupBy(t => ({ EmployeeId: t.EmployeeId }));

				angular.forEach(query, function (q) {
					var fst = q.elements[0];
					var subQry = mx(q.elements);

					var beData = {
						TranId: fst.TranId,
						EmployeeId: fst.EmployeeId,
						UserId: fst.UserId,
						EmployeeCode: fst.EmployeeCode,
						EmployeeName: fst.EmployeeName,
						EnrollNo: fst.EnrollNo,
						Department: fst.Department,
						Designation: fst.Designation,
						AllowLeaveType: fst.LeaveType,
						LeaveTypeColl: [],
					};

					$scope.LeaveTypeList.forEach(function (pa) {
						var find = subQry.firstOrDefault(p1 => p1.LeaveTypeId == pa.LeaveTypeId);
						beData.LeaveTypeColl.push({
							LeaveTypeId: pa.LeaveTypeId,
							IsAllow: find ? find.IsAllow : false,
						});
					});

					$scope.AllowLeaveTypeList.push(beData);
				});



			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}



	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});