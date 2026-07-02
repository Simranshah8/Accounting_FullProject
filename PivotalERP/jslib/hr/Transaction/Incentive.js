app.controller('IncentiveController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Incentive';
	OnClickDefault();
	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.MonthList = GlobalServices.getMonthList();

		//$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();
		$scope.currentPages = {
			Incentive: 1,
			IncentiveType: 1,
			Brand: 1
		};

		$scope.searchData = {
			Incentive: '',
			IncentiveType: '',
			Brand: ''
		};

		$scope.perPage = {
			Incentive: GlobalServices.getPerPageRow(),
			IncentiveType: GlobalServices.getPerPageRow(),
			Brand: GlobalServices.getPerPageRow()
		};


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


		$scope.EmployeeList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllEmployee",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EmployeeList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.newIncentive = {
			IncentiveId: null,
			IncDate: new Date(),
			BrandId: null,
			IncentiveTypeId: null,
			EmployeeDetailsColl: [],
			Remarks: '',
			Mode: 'Save'
		};
		$scope.newIncentive.EmployeeDetailsColl.push({});

		$scope.newIncentiveType = {
			IncentiveTypeId: null,
			Name: '',
			Code: '',
			SNo: '',
			PayHeadingId: null,
			Description: '',
			Mode: 'Save'
		};

		$scope.newBrand = {
			BrandId: null,
			Name: '',
			Code: '',
			SNo: 0,
			Description: '',
			Mode: 'Save'
		};

		$scope.GetAllIncentiveList();
		$scope.GetAllIncentiveTypeList();
		$scope.GetAllBrandList();
	}

	$scope.ClearIncentive = function () {
		$scope.newIncentive = {
			IncentiveId: null,
			IncDate: new Date(),
			BrandId: null,
			IncentiveTypeId: null,
			EmployeeDetailsColl: [],
			Remarks: '',
			Mode: 'Save'
		};
		$scope.newIncentive.EmployeeDetailsColl.push({});
	}

	$scope.ClearIncentiveType = function () {
		$scope.newIncentiveType = {
			IncentiveTypeId: null,
			Name: '',
			Code: '',
			SNo: '',
			PayHeadingId: null,
			Description: '',
			Mode: 'Save'
		};
	}

	$scope.ClearBrand = function () {
		$scope.newBrand = {
			BrandId: null,
			Name: '',
			Code: '',
			SNo: 0,
			Description: '',
			Mode: 'Save'
		};
	}

	function OnClickDefault() {
		document.getElementById('Incentive-form').style.display = "none";
		document.getElementById('IncentiveType-form').style.display = "none";
		document.getElementById('Brand-form').style.display = "none";

		document.getElementById('add-Incentive').onclick = function () {
			document.getElementById('Incentivelist').style.display = "none";
			document.getElementById('Incentive-form').style.display = "block";
			$scope.ClearIncentive();
		}

		document.getElementById('Incentiveback-btn').onclick = function () {
			document.getElementById('Incentive-form').style.display = "none";
			document.getElementById('Incentivelist').style.display = "block";
			$scope.ClearIncentive();
		}

		document.getElementById('add-IncentiveType').onclick = function () {
			document.getElementById('IncentiveType-section').style.display = "none";
			document.getElementById('IncentiveType-form').style.display = "block";
			$scope.ClearIncentiveType();
		}

		document.getElementById('IncentiveTypeback-btn').onclick = function () {
			document.getElementById('IncentiveType-form').style.display = "none";
			document.getElementById('IncentiveType-section').style.display = "block";
			$scope.ClearIncentiveType();
		}
		document.getElementById('add-Brand').onclick = function () {
			document.getElementById('Brand-section').style.display = "none";
			document.getElementById('Brand-form').style.display = "block";
			$scope.ClearBrand();
		}

		document.getElementById('Brandback-btn').onclick = function () {
			document.getElementById('Brand-form').style.display = "none";
			document.getElementById('Brand-section').style.display = "block";
			$scope.ClearBrand();
		}


	};


	//*************************Incentive*********************************

	$scope.AddIncentiveDetails = function (ind) {
		if ($scope.newIncentive.EmployeeDetailsColl) {
			if ($scope.newIncentive.EmployeeDetailsColl.length > ind + 1) {
				$scope.newIncentive.EmployeeDetailsColl.splice(ind + 1, 0, {
					ClassName: ''
				})
			} else {
				$scope.newIncentive.EmployeeDetailsColl.push({
					ClassName: ''
				})
			}
		}
	};
	$scope.delIncentiveDetails = function (ind) {
		if ($scope.newIncentive.EmployeeDetailsColl) {
			if ($scope.newIncentive.EmployeeDetailsColl.length > 1) {
				$scope.newIncentive.EmployeeDetailsColl.splice(ind, 1);
			}
		}
	};

	$scope.SaveUpdateIncentive = function () {
		/*if ($scope.IsValidIncentive() == true) {*/
		if ($scope.confirmMSG.Accept == true) {
			var saveModify = $scope.newIncentive.Mode;
			Swal.fire({
				title: 'Do you want to ' + saveModify + ' the current data?',
				showCancelButton: true,
				confirmButtonText: saveModify,
			}).then((result) => {
				if (result.isConfirmed) {
					$scope.CallSaveUpdateIncentive();
				}
			});
		} else
			$scope.CallSaveUpdateIncentive();
		/*}*/
	};

	$scope.CallSaveUpdateIncentive = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.newIncentive.IncDateDet) {
			$scope.newIncentive.IncDate = $filter('date')(new Date($scope.newIncentive.IncDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newIncentive.IncDate = $filter('date')(new Date(), 'yyyy-MM-dd');

		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SaveIncentive",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newIncentive }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearIncentive();
				$scope.GetAllIncentiveList();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllIncentiveList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.IncentiveList = [];

		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllIncentive",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.IncentiveList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetIncentiveById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			IncentiveId: refData.IncentiveId
		};

		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/GetIncentiveById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newIncentive = res.data.Data;

				if (!$scope.newIncentive.EmployeeDetailsColl || $scope.newIncentive.EmployeeDetailsColl.length == 0) {
					$scope.newIncentive.EmployeeDetailsColl = [];
					$scope.newIncentive.EmployeeDetailsColl.push({});
				}

				$scope.newIncentive.Mode = 'Modify';
				document.getElementById('Incentivelist').style.display = "none";
				document.getElementById('Incentive-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelIncentiveById = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.IncentiveName + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
			//message: 'Are you sure to delete selected Branch :-' + beData.Name,
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { IncentiveId: refData.IncentiveId };
				$http({
					method: 'POST',
					url: base_url + "HR/Transaction/DeleteIncentive",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.IncentiveList.splice(ind, 1);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});
	}

	//************************* IncentiveType*********************************

	$scope.IsValidIncentiveType = function () {
		if ($scope.newIncentiveType.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateIncentiveType = function () {
		if ($scope.IsValidIncentiveType() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newIncentiveType.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateIncentiveType();
					}
				});
			} else
				$scope.CallSaveUpdateIncentiveType();

		}
	};

	$scope.CallSaveUpdateIncentiveType = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SaveIncentiveType",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newIncentiveType }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearIncentiveType();
				$scope.GetAllIncentiveTypeList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllIncentiveTypeList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.IncentiveTypeList = [];

		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllIncentiveType",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.IncentiveTypeList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetIncentiveTypeById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TranId: refData.TranId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/getIncentiveTypeById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newIncentiveType = res.data.Data;
				$scope.newIncentiveType.Mode = 'Modify';

				document.getElementById('IncentiveType-section').style.display = "none";
				document.getElementById('IncentiveType-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelIncentiveTypeById = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.Name + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
			//message: 'Are you sure to delete selected Branch :-' + beData.Name,
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { TranId: refData.TranId };
				$http({
					method: 'POST',
					url: base_url + "HR/Transaction/DeleteIncentiveType",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.IncentiveTypeList.splice(ind, 1);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});
	}




	//*************************Brand *********************************

	$scope.IsValidBrand = function () {
		if ($scope.newBrand.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateBrand = function () {
		if ($scope.IsValidBrand() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newBrand.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateBrand();
					}
				});
			} else
				$scope.CallSaveUpdateBrand();

		}
	};

	$scope.CallSaveUpdateBrand = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SaveBrand",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newBrand }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearBrand();
				$scope.GetAllBrandList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllBrandList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.BrandList = [];

		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllBrand",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BrandList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetBrandById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TranId: refData.TranId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/getBrandById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newBrand = res.data.Data;
				$scope.newBrand.Mode = 'Modify';

				document.getElementById('Brand-section').style.display = "none";
				document.getElementById('Brand-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelBrandById = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.Name + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
			//message: 'Are you sure to delete selected Branch :-' + beData.Name,
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { TranId: refData.TranId };
				$http({
					method: 'POST',
					url: base_url + "HR/Transaction/DeleteBrand",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.BrandList.splice(ind, 1);
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