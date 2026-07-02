app.controller('MappingController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Mapping';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();
		$scope.currentPages = {
			ShiftMapping: 1,
        };

        $scope.searchData = {
			ShiftMapping: '',

        };

        $scope.perPage = {
			ShiftMapping: GlobalServices.getPerPageRow()
        };

		 
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


		$scope.BranchList = [];
		$http({
			method: 'GET',
			url: base_url + "Setup/Security/GetAllBranchList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		//CategoryList
		$scope.CategoryList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllCategory",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CategoryList = res.data.Data;
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
			method: 'GET',
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
			EmployeeMappings: [],
            Mode: 'Save'
        };
		//$scope.GetAllMappingList();

    };

    $scope.ClearMapping = function () {
        $scope.newMapping = {
            MappingId: null,
            WorkingShiftId: null,
            DateFrom_TMP: null,
            DateTo_TMP: null,
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			EmployeeMappings: [],
            Mode: 'Save'
        };
    }
	$scope.sortEmpData = function (keyname) {
		$scope.sortKeySS = keyname;   //set the sortKey to the param passed
		$scope.reverseSS = !$scope.reverseSS; //if true make it false and vice versa
	}



	//*************************Shift Mapping*********************************

	$scope.SaveShiftMappingColl = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		// Collection to hold all employee mappings
		let ShiftMappingCollection = [];

		angular.forEach($scope.MappingEmployeeList, function (employee) {
			// Convert DateFrom and DateTo to required formats
			if (employee.DateFromDet) {
				employee.DateFromAD = $filter('date')(new Date(employee.DateFromDet.dateAD), 'yyyy-MM-dd');
			}
			if (employee.DateToDet) {
				employee.DateToAD = $filter('date')(new Date(employee.DateToDet.dateAD), 'yyyy-MM-dd');
			}

			// Prepare each employee's shift mapping object
			ShiftMappingCollection.push({
				ShiftMappingId: employee.ShiftMappingId || null,
				EmployeeId: employee.EmployeeId,
				WorkingShiftId: employee.WorkingShiftId || null,
				DateFrom_AD: employee.DateFromAD,
				DateTo_AD: employee.DateToAD,
			});
		});
		if (ShiftMappingCollection.length === 0) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			return; // Prevent submission if no valid data
		}
		// Send data to the backend
		$http({
			method: 'POST',
			url: base_url + "HR/Master/SaveShiftMapping",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				let formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: ShiftMappingCollection }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			//if (res.data.IsSuccess) {
			//	$scope.GetAllMappingList(); // Refresh data if needed
			//}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire("Error", "Failed to save shift mappings", "error");
		});
	};





	$scope.IsValidMapping = function () {
		if (!$scope.MappingEmployeeList || $scope.MappingEmployeeList.length === 0) {
			Swal.fire('Error', 'No employees found to save mapping.', 'error');
			return false;
		}

		for (let i = 0; i < $scope.MappingEmployeeList.length; i++) {
			const item = $scope.MappingEmployeeList[0];
			if (!item.DateFromDet || !item.DateFromDet.dateAD) {
				Swal.fire('Error', `Please enter 'From Date' for Employee ${item.EmployeeId || ''}.`);
				return false;
			}
			if (!item.DateToDet || !item.DateToDet.dateAD) {
				Swal.fire('Error', `Please enter 'To Date' for Employee ${item.EmployeeId || ''}.`);
				return false;
			}
		}
		return true;
	};

	$scope.SaveUpdateMapping = function (employee, index) {
		if ($scope.IsValidMapping()) {
			$scope.loadingstatus = "running";
			showPleaseWait();

			$scope.newMapping = {
				EmployeeMappings: []
			};

			if (employee) {
				if (employee.DateFromDet && !isNaN(new Date(employee.DateFromDet.dateAD))) {
					employee.DateFromAD = $filter('date')(new Date(employee.DateFromDet.dateAD), 'yyyy-MM-dd');
				}
				if (employee.DateToDet && !isNaN(new Date(employee.DateToDet.dateAD))) {
					employee.DateToAD = $filter('date')(new Date(employee.DateToDet.dateAD), 'yyyy-MM-dd');
				}

				$scope.newMapping.EmployeeMappings.push({
					ShiftMappingId: employee.ShiftMappingId || null,
					EmployeeId: employee.EmployeeId,
					WorkingShiftId: employee.WorkingShiftId || null,
					DateFrom_AD: employee.DateFromAD,
					DateTo_AD: employee.DateToAD
				});
			}
			$http({
				method: 'POST',
				url: base_url + "HR/Master/SaveWSM",
				headers: { 'Content-Type': undefined },
				transformRequest: function (data) {
					var formData = new FormData();
					formData.append("jsonData", angular.toJson(data.jsonData));
					return formData;
				},
				data: { jsonData: $scope.newMapping.EmployeeMappings[0] }
			}).then(function (res) {
				$scope.loadingstatus = "stop";
				hidePleaseWait();
				Swal.fire(res.data.ResponseMSG);
				//if (res.data.IsSuccess === true) {
				//	$scope.GetAllMappingList(); // Refresh data if needed
				//}
			}, function (errormessage) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				Swal.fire("Error", "Failed to save shift mapping", "error");
			});
		}
	};

	$scope.IsValidMappingColl = function () {	
		if (!$scope.newMapping.DateFrom_TMP) {
			Swal.fire('Please! Enter Date From');
			return false;
		}
		if (!$scope.newMapping.DateTo_TMP) {
			Swal.fire('Please! Enter Date To');
			return false;
		}
		if (!$scope.newMapping.WorkingShiftId || $scope.newMapping.WorkingShiftId === 0) {
			Swal.fire('Please! Select Working Shift');
			return false;
		}
		if (!$scope.newMapping.BranchId || $scope.newMapping.BranchId === 0) {
			Swal.fire('Please! Select Branch');
			return false;
		}
		return true;
	};
	/*Added some par and remove unwanted code*/
	$scope.GetAllMappingList = function () {
		if ($scope.IsValidMappingColl() == true) {
			$scope.loadingstatus = "running";
			showPleaseWait();
			$scope.MappingEmployeeList = [];
			var para = {
				WorkingShiftId: $scope.newMapping.WorkingShiftId,
				DateFrom: $filter('date')($scope.newMapping.DateFromDet.dateAD, 'yyyy-MM-dd'),
				DateTo: $filter('date')($scope.newMapping.DateToDet.dateAD, 'yyyy-MM-dd'),
				BranchId: $scope.newMapping.BranchId,
				DepartmentId: $scope.newMapping.DepartmentId,
				CategoryId: $scope.newMapping.CategoryId,
				DesignationId: $scope.newMapping.DesignationId,
				CompanyId:$scope.newMapping.CompanyId,
			};
			$http({
				method: 'POST',
				url: base_url + "HR/Master/GetMappingEmployee",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					$scope.MappingEmployeeList = res.data.Data;

					if ($scope.MappingEmployeeList) {
						$scope.MappingEmployeeList.forEach((S) => {
							if (S.DateFrom_AD) {
								S.DateFrom_TMP = new Date(S.DateFrom_AD);
							}
							if (S.DateTo_AD) {
								S.DateTo_TMP = new Date(S.DateTo_AD);
							}
						});
					}

				} else {
					Swal.fire(res.data.ResponseMSG);
				}
			}, function (reason) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				Swal.fire('Failed', reason, 'error');
			});

        }
	};

	$scope.DelMappingById = function (refData) {
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
					ShiftMappingId: refData.ShiftMappingId
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