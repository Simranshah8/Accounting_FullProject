app.controller('ExpenseCategoryController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Expense Category';
	OnClickDefault();
	$scope.LoadData = function () {
		$('.select2').select2();
		var gSrv = GlobalServices;
		$scope.confirmMSG = gSrv.getConfirmMSG();
		$scope.perPageColl = gSrv.getPerPageList();

		$scope.GroupNameList = [{ id: 1, text: 'Nine Star' }, { id: 2, text: 'Hello' }];

		$scope.currentPages = {
			ExpenseRateSetup: 1,
			AllowExpenseCategory: 1,
			ExpenseCategory: 1,
			ExpenseGroup: 1
		};
		$scope.searchData = {
			ExpenseRateSetup: '',
			AllowExpenseCategory: '',
			ExpenseCategory: '',
			ExpenseGroup: ''
		};
		$scope.perPage = {
			ExpenseRateSetup: gSrv.getPerPageRow(),
			AllowExpenseCategory: gSrv.getPerPageRow(),
			ExpenseCategory: gSrv.getPerPageRow(),
			ExpenseGroup: gSrv.getPerPageRow(),
		};

		$scope.ActiveExpenseCategoryList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllExpenseCategory",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {


				var dtColl = res.data.Data;
				dtColl.forEach(function (dt) {
					if (dt.IsActive == true) {
						$scope.ActiveExpenseCategoryList.push(dt);
					}
				});

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});



		$scope.ExpGroupList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllExpenseGroup",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ExpGroupList = res.data.Data;

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

		//$scope.DepartmentList = [];
		//gSrv.getDepartmentList().then(function (res) {
		//	$scope.DepartmentList = res.data.Data;
		//}, function (reason) {
		//	Swal.fire('Failed' + reason);
		//});


		//$scope.CategoryList = [];
		//gSrv.getCategoryList().then(function (res) {
		//	$scope.CategoryList = res.data.Data;
		//}, function (reason) {
		//	Swal.fire('Failed' + reason);
		//});


		$scope.CategoryList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetCategoryListforPayhead",
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

		$scope.newExpenseRateSetup = {
			ExpenseRateSetupId: null,
			BranchId: null,
			DepartmentId: null,
			CategoryId: null,
			ApplicableFrom_TMP: '',
			Mode: 'Save'
		};
		$scope.newAllowExpenseCategory = {
			AllowExpenseCategoryId: null,
			BranchId: null,
			DepartmentId: null,
			CategoryId: null,
			Mode: 'Save'
		};
		$scope.newExpenseCategory = {
			TranId: 0,
			Name: '',
			GroupNameId: null,
			SerialNo: 0,
			CanEdit: false,
			Description: '',
			Mode: 'Save'
		};
		$scope.newExpenseGroup = {
			TranId: 0,
			Name: '',
			SNO: 0,
			NoOfCategory: '',
			Description: '',
			Mode: 'Save'
		};

		$scope.GetAllExpenseCategory();
		$scope.GetAllExpenseGroup();
		//$scope.GetAllExpenseCategoryList();
	}

	$scope.ClearExpenseRateSetup = function () {
		$scope.newExpenseRateSetup = {
			ExpenseRateSetupId: null,
			BranchId: null,
			DepartmentId: null,
			CategoryId: null,
			ApplicableFrom_TMP: '',
			Mode: 'Save'
		};
	}

	$scope.ClearAllowExpenseCategory = function () {
		$scope.newAllowExpenseCategory = {
			AllowExpenseCategoryId: null,
			BranchId: null,
			DepartmentId: null,
			CategoryId: null,
			Mode: 'Save'
		};
	}

	$scope.ClearExpenseCategory = function () {
		$scope.newExpenseCategory = {
			ExpenseCategoryId: null,
			Name: '',
			GroupNameId: null,
			SNo: 0,
			CanEdit: false,
			Description: '',
			Mode: 'Save'
		};
	}

	$scope.ClearExpenseGroup = function () {
		$scope.newExpenseGroup = {
			TranId: 0,
			Name: '',
			SNO: 0,
			NoOfCategory: '',
			Description: '',
			Mode: 'Save'
		};
	}

	function OnClickDefault() {
		document.getElementById('ECForm').style.display = "none";
		document.getElementById('EGForm').style.display = "none";

		document.getElementById('add-expensecategory').onclick = function () {
			document.getElementById('ECSection').style.display = "none";
			document.getElementById('ECForm').style.display = "block";
			$scope.ClearExpenseCategory();
		}
		document.getElementById('ECback-btn').onclick = function () {
			document.getElementById('ECForm').style.display = "none";
			document.getElementById('ECSection').style.display = "block";
			$scope.ClearExpenseCategory();
		}
		document.getElementById('add-EG').onclick = function () {
			document.getElementById('EGSection').style.display = "none";
			document.getElementById('EGForm').style.display = "block";
			$scope.ClearExpenseGroup();
		}
		document.getElementById('EGback-btn').onclick = function () {
			document.getElementById('EGForm').style.display = "none";
			document.getElementById('EGSection').style.display = "block";
			$scope.ClearExpenseGroup();
		}
	};

	//*************************ExpenseCategory *********************************
	$scope.IsValidExpenseCategory = function () {
		if ($scope.newExpenseCategory.Name.isEmpty()) {
			Swal.fire('Please ! Enter Expense Category Name');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateExpenseCategory = function () {
		if ($scope.IsValidExpenseCategory() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newExpenseCategory.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateExpenseCategory();
					}
				});
			} else
				$scope.CallSaveUpdateExpenseCategory();

		}
	};

	$scope.CallSaveUpdateExpenseCategory = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SaveExpenseCategory",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newExpenseCategory }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearExpenseCategory();
				$scope.GetAllExpenseCategory();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllExpenseCategory = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.ExpenseCategoryList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllExpenseCategory",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ExpenseCategoryList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetExpenseCategoryById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TranId: refData.TranId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/getExpenseCategoryById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newExpenseCategory = res.data.Data;
				$scope.newExpenseCategory.Mode = 'Modify';

				document.getElementById('ECSection').style.display = "none";
				document.getElementById('ECForm').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelExpenseCategory = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.Name + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { TranId: refData.TranId };
				$http({
					method: 'POST',
					url: base_url + "HR/Transaction/DeleteExpenseCategory",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.ExpenseCategoryList.splice(ind, 1);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});
	}

	//------------------------------Expense Group-----------------------------------------------------------------
	$scope.IsValidExpenseGroup = function () {
		if ($scope.newExpenseGroup.Name.isEmpty()) {
			Swal.fire('Please ! Enter Expense Group Name');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateExpenseGroup = function () {
		if ($scope.IsValidExpenseGroup() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newExpenseGroup.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					if (result.isConfirmed) {
						$scope.CallSaveUpdateExpenseGroup();
					}
				});
			} else
				$scope.CallSaveUpdateExpenseGroup();

		}
	};

	$scope.CallSaveUpdateExpenseGroup = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SaveExpenseGroup",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newExpenseGroup }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearExpenseGroup();
				$scope.GetAllExpenseGroup();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllExpenseGroup = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.ExpenseGroupList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllExpenseGroup",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ExpenseGroupList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetExpenseGroupById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TranId: refData.TranId
		};

		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/getExpenseGroupById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newExpenseGroup = res.data.Data;
				$scope.newExpenseGroup.Mode = 'Modify';
				document.getElementById('EGSection').style.display = "none";
				document.getElementById('EGForm').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelExpenseGroup = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.Name + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { TranId: refData.TranId };
				$http({
					method: 'POST',
					url: base_url + "HR/Transaction/DeleteExpenseGroup",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.ExpenseGroupList.splice(ind, 1);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});
	}




	//************************* AllowExpenseCategory  *********************************


	//$scope.CheckUnCheckAll = function (val, TranId) {
	//	if ($scope.AllowExpenseCategoryList) {
	//		$scope.AllowExpenseCategoryList.forEach(function (dc) {
	//			dc.ExpenseCategoryColl.forEach(function (ph) {
	//				if (ph.TranId === TranId) {
	//					ph.IsAllow = val;
	//				}
	//			});
	//		});
	//	}
	//};

	$scope.CheckUnCheckAll = function (Exp) {
		if ($scope.AllowExpenseCategoryList) {
			$scope.AllowExpenseCategoryList.forEach(function (dc) {
				if (dc.ExpenseCategoryColl) {
					dc.ExpenseCategoryColl.forEach(function (ph) {
						if (ph.TranId === Exp.TranId) {
							ph.IsAllow = Exp.IsAllow;
						}
					});
				}

			});
		}
	};



	$scope.SaveAllowExpenseCategory = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var dtColl = [];
		$scope.AllowExpenseCategoryList.forEach(function (emp) {
			emp.ExpenseCategoryColl.forEach(function (ph) {
				if (ph.IsAllow == true) {
					dtColl.push({
						EmployeeId: emp.EmployeeId,
						ExpenseCategoryId: ph.TranId
					});
				}
			})
		});
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SaveAllowExpenseCategory",
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

	$scope.GetExpenseCategoryForAllow = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.AllowExpenseCategoryList = [];

		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllEmployeeForAllowExpenseCategory?BranchId=" + $scope.newFilter.BranchId + "&DepartmentId=" + $scope.newFilter.DepartmentId + "&CategoryId=" + $scope.newFilter.CategoryId,
			dataType: "json"
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
						EmployeeId: fst.EmployeeId,
						EmployeeCode: fst.EmployeeCode,
						EmployeeName: fst.EmployeeName,
						EnrollNo: fst.EnrollNo,
						Department: fst.Department,
						Designation: fst.Designation,
						AllowExpenseCategory: fst.ExpenseCategory,
						ExpenseCategoryColl: [],
					};

					$scope.ActiveExpenseCategoryList.forEach(function (pa) {
						var find = subQry.firstOrDefault(p1 => p1.ExpenseCategoryId == pa.TranId);
						beData.ExpenseCategoryColl.push({
							TranId: pa.TranId,
							IsAllow: find ? find.IsAllow : false,
						});
					});

					$scope.AllowExpenseCategoryList.push(beData);
				});



			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}



	//************************* Expense Rate Setup  *********************************
	$scope.SaveExpenseRateSetup = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var dtColl = [];

		//if ($scope.newExpenseRateSetup.ApplicableFromDet) {
		//	$scope.newExpenseRateSetup.ApplicableFrom = $filter('date')(new Date($scope.newExpenseRateSetup.ApplicableFromDet.dateAD), 'yyyy-MM-dd');
		//} else
		//	$scope.newExpenseRateSetup.ApplicableFrom = $filter('date')(new Date(), 'yyyy-MM-dd');


		$scope.ExpenseRateSetupList.forEach(function (emp) {
			emp.ExpenseRateColl.forEach(function (ph) {
				if (ph.Amount > 0 || ph.Amount < 0) {
					dtColl.push({
						EmployeeId: emp.EmployeeId,
						ExpenseCategoryId: ph.TranId,
						Amount: ph.Amount,
						ApplicableFrom: $scope.newExpenseRateSetup.ApplicableFrom
					});
				}
			})
		});
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SaveExpenseRateSetup",
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

	$scope.GetEmloyeeForExpenseRateSetup = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.ExpenseRateSetupList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllEmployeeForExpenseRateSetup?BranchId=" + $scope.newRateFilter.BranchId + "&DepartmentId=" + $scope.newRateFilter.DepartmentId + "&CategoryId=" + $scope.newRateFilter.CategoryId,
			dataType: "json"
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
						EmployeeId: fst.EmployeeId,
						EmployeeCode: fst.EmployeeCode,
						EmployeeName: fst.EmployeeName,
						EnrollNo: fst.EnrollNo,
						Department: fst.Department,
						Designation: fst.Designation,
						ExpenseCategory: fst.ExpenseCategory,
						Amount: fst.Amount,
						ApplicableFrom: fst.ApplicableFrom,
						ExpenseRateColl: [],
					};

					$scope.ActiveExpenseCategoryList.forEach(function (pa) {
						var find = subQry.firstOrDefault(p1 => p1.ExpenseCategoryId == pa.TranId);
						beData.ExpenseRateColl.push({
							TranId: pa.TranId,
							Amount: find ? find.Amount : 0,
						});
					});

					$scope.ExpenseRateSetupList.push(beData);

					if (beData.ApplicableFrom)
						$scope.newExpenseRateSetup.ApplicableFrom = beData.ApplicableFrom;
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