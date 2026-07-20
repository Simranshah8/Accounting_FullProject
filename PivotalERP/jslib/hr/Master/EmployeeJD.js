"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("EmployeeJDController", function ($scope, $window, $filter, $http, $timeout, GlobalServices) {
	$scope.Title = 'Employee Job Description';

	$scope.onBtExportCSV = function () {
		var params = {
			fileName: 'EmployeeJD.csv',
			sheetName: 'Employee Job Description'
		};
		$scope.gridOptions.api.exportDataAsCsv(params);
	}
	$scope.onFilterTextBoxChanged = function () {
		$scope.gridOptions.api.setQuickFilter($scope.search);
	}

	$scope.LoadData = function () {
		OnClickDefault();
		$('.select2').select2();
		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();

		$scope.currentPages = {
			EmployeeJD: 1,
		};

		$scope.searchData = {
			EmployeeJD: '',
		};

		$scope.perPage = {
			EmployeeJD: GlobalServices.getPerPageRow(),
		};

		$scope.PrintPage = function () {
			$window.print();
		};

		$scope.newFilter = {
			EmployeeId: null,
			EmpJdId: null,
			DateFrom_TMP: new Date(),
			DateTo_TMP: new Date()
		};


		$scope.CompanyDetail = [];
		$http({
			method: 'get',
			url: base_url + "HR/Master/GetCompanyDetail",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CompanyDetail = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.EmployeeList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllEmployee",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EmployeeList = res.data.Data;

			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.columnDefs = [
			{ headerName: "SNo.", valueGetter: "node.rowIndex + 1", width: 70, minWidth: 60, cellStyle: { textAlign: "center" }, sortable: false, filter: false },
			{ headerName: "Key Responsibilities", field: "Responsibility", filter: 'agTextColumnFilter', minWidth: 350, flex: 4 },
			{ headerName: "From Date", field: "FromMitti", filter: 'agDateColumnFilter', minWidth: 150, flex: 2 },
			{ headerName: "To Date", field: "ToMitti", filter: 'agDateColumnFilter', minWidth: 150, flex: 2 },
			//{ headerName: "New Add", field: "", filter: 'agTextColumnFilter', minWidth: 120, flex: 1 },
			{ headerName: "Status", field: "JDStatus", filter: 'agTextColumnFilter', minWidth: 150, flex: 2 },
		];

		$scope.gridOptions = {
			defaultColDef: {
				filter: true,
				resizable: true,
				sortable: true
			},
			enableSorting: true,
			multiSortKey: 'ctrl',
			enableColResize: true,
			overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
			overlayNoRowsTemplate: "No Records found",
			rowSelection: 'multiple',
			columnDefs: $scope.columnDefs,
			rowData: null,
			filter: true,
			enableFilter: true
		};

		$timeout(function () {
			var eGridDiv = document.querySelector('#TableData');
			new agGrid.Grid(eGridDiv, $scope.gridOptions);
		});
		$timeout(function () {
			GlobalServices.getListState(EntityId, $scope.gridOptions);
		});


		$scope.GetAllEmployeeJD();

		$scope.newEmployeeJD = {
			EmpJDId: null,
			EmployeeId: null,
			Division: "",
			Age: "",
			WorkStation: "",
			ExpYear: "",
			EmpJDQualificationColl: [],
			EmpJDAchievementColl: [],
			EmpJDTrainingColl: [],
			EmpJDResponsibilityColl: [],
			Mode: "Save"
		}
		$scope.newEmployeeJD.EmpJDQualificationColl.push({});
		$scope.newEmployeeJD.EmpJDAchievementColl.push({});
		$scope.newEmployeeJD.EmpJDTrainingColl.push({});
		$scope.newEmployeeJD.EmpJDResponsibilityColl.push({
			Responsibility: "",
			IsActive: true
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
		
	}



	$scope.GetData = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			EmployeeId: $scope.newFilter.EmployeeId || null,
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Report/GetAllEmpResponsibilityHistory",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DataColl = res.data.Data;
				$scope.gridOptions.api.setRowData($scope.DataColl);

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire('Failed: ' + reason);
		});
	};

	$scope.DownloadAsXls = function () {
		$scope.loadingstatus = 'running';
		showPleaseWait();
		var dataColl = $scope.GetDataForPrint();
		var paraData = {
			//forDate: $filter('date')($scope.newDaily.ForDateDet.dateAD, 'yyyy-MM-dd'),
			//branchIdColl: $scope.newDaily.BranchId
		};
		$http({
			method: 'POST',
			url: base_url + "Global/PrintXlsReportData",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("entityId", EntityId);
				formData.append("jsonData", angular.toJson(data.jsonData));
				formData.append("paraData", angular.toJson(paraData));
				formData.append("RptPath", "");
				return formData;
			},
			data: { jsonData: dataColl }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			if (res.data.IsSuccess && res.data.Data) {
				down_file(base_url + "//" + res.data.Data.ResponseId, "EmployeeJD.xlsx");
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire(errormessage);
		});
	}

	$scope.GetDataForPrint = function () {
		var filterData = [];
		$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
			var dayBook = node.data;
			filterData.push(dayBook);
		});
		return filterData;
	}


	$scope.ClearDetails = function () {
		$scope.newEmployeeJD = {
			EmpJDId: null,
			EmployeeId: null,
			Division: "",
			Age: "",
			WorkStation: "",
			ExpYear: "",
			EmpJDQualificationColl: [],
			EmpJDAchievementColl: [],
			EmpJDTrainingColl: [],
			EmpJDResponsibilityColl: [],
			Mode: "Save"
		}
		$scope.EmpDetails = {};
		$scope.newEmployeeJD.EmpJDQualificationColl.push({});
		$scope.newEmployeeJD.EmpJDAchievementColl.push({});
		$scope.newEmployeeJD.EmpJDTrainingColl.push({});
		$scope.newEmployeeJD.EmpJDResponsibilityColl.push({
			Responsibility: "",
			IsActive: true
		});
	}
	$scope.ShowCompleteForm = true;

	function OnClickDefault() {
		document.getElementById('Form-Section').style.display = "none";
		document.getElementById('Print-Section').style.display = "none";

		document.getElementById('add-Details').onclick = function () {
			document.getElementById('Form-Section').style.display = "block";
			document.getElementById('Table-Section').style.display = "none";
			document.getElementById('Print-Section').style.display = "none";
			$scope.ShowCompleteForm = true;
			$scope.ClearDetails();
		}

		document.getElementById('back-Details').onclick = function () {
			document.getElementById('Table-Section').style.display = "block";
			document.getElementById('Form-Section').style.display = "none";
			document.getElementById('Print-Section').style.display = "none";
			$scope.ClearDetails();
			$scope.GetAllEmployeeJD();
		}
		document.getElementById('back-List').onclick = function () {
			document.getElementById('Table-Section').style.display = "block";
			document.getElementById('Print-Section').style.display = "none";
			document.getElementById('Form-Section').style.display = "none";
			$scope.ClearDetails();
		}
	}
	$scope.AddQualification = function (index) {
		if ($scope.newEmployeeJD.EmpJDQualificationColl) {
			if ($scope.newEmployeeJD.EmpJDQualificationColl.length > index + 1) {
				$scope.newEmployeeJD.EmpJDQualificationColl.splice(index + 1, 0, {})
			}
			else {
				$scope.newEmployeeJD.EmpJDQualificationColl.push({})
			}

		}
	}

	$scope.delQualification = function (index) {
		if ($scope.newEmployeeJD.EmpJDQualificationColl) {
			if ($scope.newEmployeeJD.EmpJDQualificationColl.length > 1) {
				$scope.newEmployeeJD.EmpJDQualificationColl.splice(index, 1);
			}
			else {
				$scope.newEmployeeJD.EmpJDQualificationColl[0] = {}
			}
		}
	}

	$scope.AddAchievement = function (index) {
		if ($scope.newEmployeeJD.EmpJDAchievementColl) {
			if ($scope.newEmployeeJD.EmpJDAchievementColl.length > index + 1) {
				$scope.newEmployeeJD.EmpJDAchievementColl.splice(index + 1, 0, {})
			}
			else {
				$scope.newEmployeeJD.EmpJDAchievementColl.push({});
			}

		}
	}

	$scope.delAchievement = function (index) {
		if ($scope.newEmployeeJD.EmpJDAchievementColl) {
			if ($scope.newEmployeeJD.EmpJDAchievementColl.length > 1) {
				$scope.newEmployeeJD.EmpJDAchievementColl.splice(index, 1);
			}
			else {
				$scope.newEmployeeJD.EmpJDAchievementColl[0] = {}
			}
		}
	}

	$scope.AddTraining = function (index) {
		if ($scope.newEmployeeJD.EmpJDTrainingColl) {
			if ($scope.newEmployeeJD.EmpJDTrainingColl.length > index + 1) {
				$scope.newEmployeeJD.EmpJDTrainingColl.splice(index + 1, 0, {})
			}
			else {
				$scope.newEmployeeJD.EmpJDTrainingColl.push({})
			}

		}
	}

	$scope.delTraining = function (index) {
		if ($scope.newEmployeeJD.EmpJDTrainingColl) {
			if ($scope.newEmployeeJD.EmpJDTrainingColl.length > 1) {
				$scope.newEmployeeJD.EmpJDTrainingColl.splice(index, 1);
			}
			else {
				$scope.newEmployeeJD.EmpJDTrainingColl[0] = {}
			}
		}
	}

	$scope.AddResponsibility = function (index) {
		if (!$scope.newEmployeeJD.EmpJDResponsibilityColl[index].Responsibility){
			Swal.fire({
				title: 'Warning!',
				text: 'Please fill the current row details before adding a new row.',
				icon: 'warning',
				confirmButtonText: 'OK',
				allowOutsideClick: false,
			});

			return;
		}
		if ($scope.newEmployeeJD.EmpJDResponsibilityColl) {

			var newRow = {
				IsActive: true
			};

			if ($scope.newEmployeeJD.EmpJDResponsibilityColl.length > index + 1) {
				$scope.newEmployeeJD.EmpJDResponsibilityColl.splice(index + 1, 0, newRow);
			} else {
				$scope.newEmployeeJD.EmpJDResponsibilityColl.push(newRow);
			}
		}
	};

	$scope.delResponsibility = function (index) {
		if ($scope.newEmployeeJD.EmpJDResponsibilityColl) {
			if ($scope.newEmployeeJD.EmpJDResponsibilityColl.length > 1) {
				$scope.newEmployeeJD.EmpJDResponsibilityColl.splice(index, 1);
			}
			else {
				$scope.newEmployeeJD.EmpJDResponsibilityColl[0] = {}
			}
		}
	}

	$scope.IsValidEmployeeJD = function () {
		if ($scope.hasDuplicateResponsibility()) {
			Swal.fire("warning","Same responsibility cannot be added twice.");
			return false;
		}
		return true;
	}

	$scope.SaveUpdateEmployeeJD = function () {
		if ($scope.IsValidEmployeeJD() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newEmployeeJD.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					if (result.isConfirmed) {
						$scope.CallSaveUpdateEmployeeJD();
					}
				});
			} else
				$scope.CallSaveUpdateEmployeeJD();
		}
	};

	$scope.CallSaveUpdateEmployeeJD = function () {
		
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.newEmployeeJD.EmpJDResponsibilityColl =
			$scope.newEmployeeJD.EmpJDResponsibilityColl.filter(function (row) {
				return row.Responsibility != null && row.Responsibility.trim() !== "";
			});

		$http({
			method: 'Post',
			url: base_url + "HR/Master/SaveEmployeeJD",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newEmployeeJD }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearDetails();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllEmployeeJD = function () {
		$scope.TableData = [];
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetAllEmployeeJD",
			dataType: "json",
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.TableData = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire('Failed: ' + reason);
		});
	}

	$scope.GetEmployeeJDById = function (refData, num) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			EmpJDId: refData.EmpJDId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetEmployeeJDById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newEmployeeJD = res.data.Data;
				if (num == 0) {
					document.getElementById('Form-Section').style.display = "block";
					document.getElementById('Table-Section').style.display = "none";
					document.getElementById('Print-Section').style.display = "none";
					$scope.GetEmployeeDetail($scope.newEmployeeJD);
					$scope.newEmployeeJD.Mode = 'Modify';
					$scope.ShowCompleteForm = true;
				}
				else if (num == 1) {
					document.getElementById('Print-Section').style.display = "block";
					document.getElementById('Form-Section').style.display = "none";
					document.getElementById('Table-Section').style.display = "none";
					
				}
				else {
					document.getElementById('Form-Section').style.display = "block";
					document.getElementById('Table-Section').style.display = "none";
					document.getElementById('Print-Section').style.display = "none";
					$scope.GetEmployeeDetail($scope.newEmployeeJD);

					$scope.newEmployeeJD.Mode = 'Update';
					$scope.ShowCompleteForm = false;
				}
				if ($scope.newEmployeeJD.EmpJDQualificationColl.length == 0) {
					$scope.newEmployeeJD.EmpJDQualificationColl.push({});
				}
				if ($scope.newEmployeeJD.EmpJDAchievementColl.length == 0) {
					$scope.newEmployeeJD.EmpJDAchievementColl.push({});
				}
				if ($scope.newEmployeeJD.EmpJDTrainingColl.length == 0) {
					$scope.newEmployeeJD.EmpJDTrainingColl.push({});
				}
				if ($scope.newEmployeeJD.EmpJDResponsibilityColl.length == 0) {
					$scope.newEmployeeJD.EmpJDResponsibilityColl.push({});
				}
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	};

	$scope.DelEmployeeJDById = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { EmpJDId: refData.EmpJDId };
				$http({
					method: 'POST',
					url: base_url + "HR/Master/DelEmployeeJD",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.GetAllEmployeeJD();
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});

	}

	$scope.GetEmployeeDetail = function (refData) {
		$scope.EmpDetails = {};
		$scope.newEmployeeJD.Age = "";
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			EmployeeId: refData.EmployeeId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Master/getEmployeeById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EmpDetails = res.data.Data;
				if ($scope.EmpDetails.JoinDate) {
					$scope.EmpDetails.JoinDate_TMP = new Date($scope.EmpDetails.JoinDate);
				}
				if ($scope.EmpDetails.DobAD) {
					$scope.EmpDetails.Dob_TMP = new Date($scope.EmpDetails.DobAD);
					$scope.newEmployeeJD.Age = getDOBAge($scope.EmpDetails.Dob_TMP);
				}
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	};

	$scope.hasDuplicateResponsibility = function () {
		let list = $scope.newEmployeeJD.EmpJDResponsibilityColl
			.map(x => (x.Responsibility || "").trim().toLowerCase())
			.filter(x => x !== "");

		return list.length !== new Set(list).size;
	};

})