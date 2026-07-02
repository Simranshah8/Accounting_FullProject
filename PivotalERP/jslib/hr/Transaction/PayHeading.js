app.controller('PayHeadingController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Pay Heading';
	OnClickDefault();
	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.MonthList = GlobalServices.getMonthList();
		$scope.GenderColl = GlobalServices.getGenderList();
		$scope.MaritalCol = [{ id: 1, text: 'Single' }, { id: 2, text: 'Married' }, { id: 3, text: 'Divorced' }];
		$scope.ResidentCol = [{ id: 1, text: 'Resident' }, { id: 2, text: 'Non Resident' }];
		$scope.TaxTypeList = [{ id: 1, text: 'Normal' }, { id: 2, text: 'SSF' }];
		$scope.PayHeadTypeCol = [
			{ id: 1, text: 'Total Salary' },
			{ id: 2, text: 'Earning' },
			{ id: 3, text: 'Deduction' },
			{ id: 4, text: 'Income Tax' },
			{ id: 5, text: 'Exemption Tax' },
			{ id: 6, text: 'Tax' },
			{ id: 7, text: 'Tax Rebate' },
			{ id: 8, text: 'Income Tax Adjustment' },
			{ id: 9, text: 'Tax Adjustment' },
		];

		$scope.CalculationTypeCol = [
			{ id: 1, text: 'On Attendance' },
			{ id: 2, text: 'Flat Amount' },
			{ id: 3, text: 'Manual' },
			{ id: 4, text: 'Auto' }
		];

		$scope.NatureCol = [
			{ id: 1, text: 'Monthly' },
			{ id: 2, text: 'Once' }
		];
		$scope.MonthCol = [
			{ id: 1, text: 'Baishakh' },
			{ id: 2, text: 'Once' }
		];

		$scope.BranchCol = [
			{ id: 1, text: 'Main Branch' },
			{ id: 2, text: 'Branch1' },
			{ id: 3, text: 'Branch2' },
		];
		$scope.LedgerOnColl = [
			{ id: 1, text: 'Employee Group' },
			{ id: 2, text: 'Department' },
			{ id: 3, text: 'Designation' },
			{ id: 4, text: 'Category' },
			{ id: 5, text: 'Level' },
			{ id: 6, text: 'Service Type' }
		];
		$scope.currentPages = {
			PayHeading: 1,
			PayHeadGroup: 1,
			PayHeadCategory: 1

		};

		$scope.searchData = {
			PayHeading: '',
			PayHeadGroup: '',
			PayHeadCategory: ''

		};

		$scope.perPage = {
			PayHeading: GlobalServices.getPerPageRow(),
			PayHeadGroup: GlobalServices.getPerPageRow(),
			PayHeadCategory: GlobalServices.getPerPageRow(),

		};


		$scope.BranchList = [];
		$http({
			method: 'GET',
			url: base_url + "Setup/Security/GetAllBranchList",
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


		$scope.AttendanceTypeList = [];
		$http({
			method: 'Get',
			url: base_url + "HR/Master/GetAllAttendanceType",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AttendanceTypeList = res.data.Data;
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

		$scope.newPayHeading = {
			PayHeadingId: null,
			Name: '',
			DisplayName: '',
			Code: '',
			PayheadTypeId: null,
			NatureId: null,
			CalculationTypeId: null,
			LedgerId: null,
			PayHeadGroupId: null,
			PayHeadCategoryId: null,
			CalcOnHeadingId: null,
			IsActive: true,
			SNo: 0,
			SNoSD: 0,
			IsSalaryDetail: true,
			IsSalarySheet: true,
			IsTaxable: false,
			IsPaySlip: true,
			IsIncentive: true,
			Formula: '',
			PayHeadingDetailsColl: [],
			PayHeadingTaxExemptionColl: [],
			Mode: 'Save'
		};
		$scope.newPayHeading.PayHeadingDetailsColl.push({});
		$scope.newPayHeading.PayHeadingTaxExemptionColl.push({});

		$scope.newPayHeadGroup = {
			PayHeadGroupId: null,
			Name: '',
			Code: '',
			SNo: 0,
			Description: '',
			PayHeadGroupTaxExemptionColl: [],
			Mode: 'Save'
		};
		$scope.newPayHeadGroup.PayHeadGroupTaxExemptionColl.push({});

		$scope.newPayHeadCategory = {
			PayHeadCategoryId: null,
			Name: '',
			Code: '',
			SNo: 0,
			Description: '',
			Mode: 'Save'
		};


		$scope.GetAllPayHeadingList();
		$scope.GetAllPayHeadGroupList();
		$scope.GetAllPayHeadCategoryList();
	}

	$scope.ClearPayHeading = function () {
		$scope.newPayHeading = {
			PayHeadingId: null,
			Name: '',
			DisplayName: '',
			Code: '',
			PayheadTypeId: null,
			NatureId: null,
			CalculationTypeId: null,
			LedgerId: null,
			PayHeadGroupId: null,
			PayHeadCategoryId: null,
			CalcOnHeadingId: null,
			IsActive: true,
			SNo: 0,
			SNoSD: 0,
			IsSalaryDetail: true,
			IsSalarySheet: true,
			IsTaxable: false,
			IsPaySlip: true,
			IsIncentive: true,
			Formula: '',
			PayHeadingDetailsColl: [],
			PayHeadingTaxExemptionColl: [],
			Mode: 'Save'
		};
		$scope.newPayHeading.PayHeadingDetailsColl.push({});
		$scope.newPayHeading.PayHeadingTaxExemptionColl.push({});
	}

	$scope.ClearPayHeadGroup = function () {
		$scope.newPayHeadGroup = {
			PayHeadGroupId: null,
			Name: '',
			Code: '',
			SNo: 0,
			Description: '',
			PayHeadGroupTaxExemptionColl: [],
			Mode: 'Save'

		};
		$scope.newPayHeadGroup.PayHeadGroupTaxExemptionColl.push({});
	}

	$scope.ClearPayHeadCategory = function () {
		$scope.newPayHeadCategory = {
			PayHeadCategoryId: null,
			Name: '',
			Code: '',
			SNo: 0,
			Description: '',
			Mode: 'Save'
		};
	}


	function OnClickDefault() {
		document.getElementById('payheading-form').style.display = "none";
		document.getElementById('phg-form').style.display = "none";
		document.getElementById('phc-form').style.display = "none";

		document.getElementById('add-payheading').onclick = function () {
			document.getElementById('payheadinglist').style.display = "none";
			document.getElementById('payheading-form').style.display = "block";
			$scope.ClearPayHeading();
		}

		document.getElementById('PayHeadingback-btn').onclick = function () {
			document.getElementById('payheading-form').style.display = "none";
			document.getElementById('payheadinglist').style.display = "block";
			$scope.ClearPayHeading();
		}

		document.getElementById('add-phg').onclick = function () {
			document.getElementById('phg-section').style.display = "none";
			document.getElementById('phg-form').style.display = "block";
			$scope.ClearPayHeadGroup();
		}

		document.getElementById('phgback-btn').onclick = function () {
			document.getElementById('phg-form').style.display = "none";
			document.getElementById('phg-section').style.display = "block";
			$scope.ClearPayHeadGroup();
		}

		document.getElementById('add-phc').onclick = function () {
			document.getElementById('phc-section').style.display = "none";
			document.getElementById('phc-form').style.display = "block";
			$scope.ClearPayHeadCategory();
		}

		document.getElementById('phcback-btn').onclick = function () {
			document.getElementById('phc-form').style.display = "none";
			document.getElementById('phc-section').style.display = "block";
			$scope.ClearPayHeadCategory();
		}

	};



	//************************* PayHeadGroup*********************************

	$scope.IsValidPayHeadGroup = function () {
		if ($scope.newPayHeadGroup.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}
		
		 
		return true;
	}

	$scope.AddTEDetails = function (ind) {
		if ($scope.newPayHeadGroup.PayHeadGroupTaxExemptionColl) {
			if ($scope.newPayHeadGroup.PayHeadGroupTaxExemptionColl.length > ind + 1) {
				$scope.newPayHeadGroup.PayHeadGroupTaxExemptionColl.splice(ind + 1, 0, {
					Formula: ''
				})
			} else {
				$scope.newPayHeadGroup.PayHeadGroupTaxExemptionColl.push({
					Formula: ''
				})
			}
		}
	};
	$scope.delTEDetails = function (ind) {
		if ($scope.newPayHeadGroup.PayHeadGroupTaxExemptionColl) {
			if ($scope.newPayHeadGroup.PayHeadGroupTaxExemptionColl.length > 1) {
				$scope.newPayHeadGroup.PayHeadGroupTaxExemptionColl.splice(ind, 1);
			}
		}
	};

	$scope.SaveUpdatePayHeadGroup = function () {
		if ($scope.IsValidPayHeadGroup() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newPayHeadGroup.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					if (result.isConfirmed) {
						$scope.CallSaveUpdatePayHeadGroup();
					}
				});
			} else
				$scope.CallSaveUpdatePayHeadGroup();

		}
	};

	$scope.CallSaveUpdatePayHeadGroup = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SavePayHeadGroup",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newPayHeadGroup }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearPayHeadGroup();
				$scope.GetAllPayHeadGroupList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllPayHeadGroupList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.PayHeadGroupList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllPayHeadGroup",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.PayHeadGroupList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetPayHeadGroupById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			PayHeadGroupId: refData.PayHeadGroupId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/getPayHeadGroupById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newPayHeadGroup = res.data.Data;
				$scope.newPayHeadGroup.Mode = 'Modify';


				if (!$scope.newPayHeadGroup.PayHeadGroupTaxExemptionColl || $scope.newPayHeadGroup.PayHeadGroupTaxExemptionColl.length == 0) {
					$scope.newPayHeadGroup.PayHeadGroupTaxExemptionColl = [];
					$scope.newPayHeadGroup.PayHeadGroupTaxExemptionColl.push({});
				}



				document.getElementById('phg-section').style.display = "none";
				document.getElementById('phg-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};


	$scope.DelPayHeadGroupById = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.Name + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
			//message: 'Are you sure to delete selected Branch :-' + beData.Name,
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { PayHeadGroupId: refData.PayHeadGroupId };
				$http({
					method: 'POST',
					url: base_url + "HR/Transaction/DeletePayHeadGroup",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.PayHeadGroupList.splice(ind, 1);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});
	}



	//*************************PayHeadCategory *********************************

	$scope.IsValidPayHeadCategory = function () {
		if ($scope.newPayHeadCategory.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}


		return true;
	}


	$scope.SaveUpdatePayHeadCategory = function () {
		if ($scope.IsValidPayHeadCategory() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newPayHeadCategory.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdatePayHeadCategory();
					}
				});
			} else
				$scope.CallSaveUpdatePayHeadCategory();
		}
	};

	$scope.CallSaveUpdatePayHeadCategory = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SavePayHeadCategory",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newPayHeadCategory }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearPayHeadCategory();
				$scope.GetAllPayHeadCategoryList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllPayHeadCategoryList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.PayHeadCategoryList = [];

		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllPayHeadCategory",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.PayHeadCategoryList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetPayHeadCategoryById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			PayHeadCategoryId: refData.PayHeadCategoryId
		};

		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/getPayHeadCategoryById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newPayHeadCategory = res.data.Data;
				$scope.newPayHeadCategory.Mode = 'Modify';

				document.getElementById('phc-section').style.display = "none";
				document.getElementById('phc-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelPayHeadCategoryById = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.Name + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
			//message: 'Are you sure to delete selected Branch :-' + beData.Name,
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { PayHeadCategoryId: refData.PayHeadCategoryId };
				$http({
					method: 'POST',
					url: base_url + "HR/Transaction/DeletePayHeadCategory",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.PayHeadCategoryList.splice(ind, 1);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});
	}


	//*************************Pay Heading *********************************
	$scope.AddPHDDetails = function (ind) {
		if ($scope.newPayHeading.PayHeadingDetailsColl) {
			if ($scope.newPayHeading.PayHeadingDetailsColl.length > ind + 1) {
				$scope.newPayHeading.PayHeadingDetailsColl.splice(ind + 1, 0, {
					Formula: ''
				})
			} else {
				$scope.newPayHeading.PayHeadingDetailsColl.push({
					Formula: ''
				})
			}
		}
	};
	$scope.delPHDDetails = function (ind) {
		if ($scope.newPayHeading.PayHeadingDetailsColl) {
			if ($scope.newPayHeading.PayHeadingDetailsColl.length > 1) {
				$scope.newPayHeading.PayHeadingDetailsColl.splice(ind, 1);
			}
		}
	};

	$scope.AddTaxExemptionDetails = function (ind) {
		if ($scope.newPayHeading.PayHeadingTaxExemptionColl) {
			if ($scope.newPayHeading.PayHeadingTaxExemptionColl.length > ind + 1) {
				$scope.newPayHeading.PayHeadingTaxExemptionColl.splice(ind + 1, 0, {
					Formula: ''
				})
			} else {
				$scope.newPayHeading.PayHeadingTaxExemptionColl.push({
					Formula: ''
				})
			}
		}
	};
	$scope.delTaxExemptionDetails = function (ind) {
		if ($scope.newPayHeading.PayHeadingTaxExemptionColl) {
			if ($scope.newPayHeading.PayHeadingTaxExemptionColl.length > 1) {
				$scope.newPayHeading.PayHeadingTaxExemptionColl.splice(ind, 1);
			}
		}
	};



	$scope.IsValidPayHeading = function () {
		if ($scope.newPayHeading.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}

		if ($scope.newPayHeading.PayHeadGroupId == null || $scope.newPayHeading.PayHeadGroupId == undefined || $scope.newPayHeading.PayHeadGroupId == 0) {
			Swal.fire('Please ! Select Group Name');
			return false;
		}

		if ($scope.newPayHeading.PayHeadCategoryId == null || $scope.newPayHeading.PayHeadCategoryId == undefined || $scope.newPayHeading.PayHeadCategoryId == 0) {
			Swal.fire('Please ! Select Category Name');
			return false;
		}


		return true;
	}

	$scope.SaveUpdatePayHeading = function () {
		if ($scope.IsValidPayHeading() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newPayHeading.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdatePayHeading();
					}
				});
			} else
				$scope.CallSaveUpdatePayHeading();
		}
	};

	$scope.CallSaveUpdatePayHeading = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SavePayHeading",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newPayHeading }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearPayHeading();
				$scope.GetAllPayHeadingList();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllPayHeadingList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.PayHeadingList = [];

		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllPayHeading",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.PayHeadingList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetPayHeadingById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			PayHeadingId: refData.PayHeadingId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/GetPayHeadingById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newPayHeading = res.data.Data;

				if (!$scope.newPayHeading.PayHeadingDetailsColl || $scope.newPayHeading.PayHeadingDetailsColl.length == 0) {
					$scope.newPayHeading.PayHeadingDetailsColl = [];
					$scope.newPayHeading.PayHeadingDetailsColl.push({});
				}

				if (!$scope.newPayHeading.PayHeadingTaxExemptionColl || $scope.newPayHeading.PayHeadingTaxExemptionColl.length == 0) {
					$scope.newPayHeading.PayHeadingTaxExemptionColl = [];
					$scope.newPayHeading.PayHeadingTaxExemptionColl.push({});
				}

				$scope.newPayHeading.Mode = 'Modify';
				document.getElementById('payheadinglist').style.display = "none";
				document.getElementById('payheading-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelPayHeadingById = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.Name + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
			//message: 'Are you sure to delete selected Branch :-' + beData.Name,
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { PayHeadingId: refData.PayHeadingId };
				$http({
					method: 'POST',
					url: base_url + "HR/Transaction/DeletePayHeading",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.PayHeadingList.splice(ind, 1);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});
	}




	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});