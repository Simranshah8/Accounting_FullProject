
app.controller('ExpenseController', function ($scope, $http, $timeout, $filter, GlobalServices) {

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.currentPages = {
			Expense: 1,
		};

		$scope.searchData = {
			Expense: '',
		};

		$scope.perPage = {
			Expense: GlobalServices.getPerPageRow(),
		};
		$scope.newFilter = {
			DateFrom: new Date(),
			DateTo: '',
			For: 1,
			StatusId: null,
			EmployeeId: ''

		};

		$scope.newDet = {
			ExpenseTitle: '',
			EmployeeName: '',
			Reason: '',
			StatusId: null,
			EmployeeId: ''

		};

		$scope.ForColl = [
			{ id: 1, text: "Single Date" },
			{ id: 2, text: "Multiple Date" }
		];
		$scope.StatusColl = [
			{ id: 1, text: "Pending" },
			{ id: 2, text: "Verify" },
			{ id: 3, text: "Rejected" },
			{ id: 4, text: "Cancel" },
			{ id: 5, text: "Partial Approve" },
			{ id: 6, text: "Account Clear" }
		];

		$scope.ClearDetails = function () {
			$scope.newDet = {
				DateFrom: new Date(),
				DateTo: '',
				For: 2,
				StatusId: 1,
				EmployeeId: 1

			};

		};
	}

	//$scope.OpenReviewModal = function (SL) {
	//	$('#codeModal').modal('show');
	//};


	$scope.UpdateStatus = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
			angular.forEach($scope.newDet.TranExpenseClaimDetailsColl, function (D) {
				D.StatusId;
				D.StatusRemark;
			});
		$http({
			method: 'POST',
			url: base_url + "Expense/Transaction/UpdateStatus",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));				
				return formData;
			},
			data: { jsonData: $scope.newDet}
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				/*$scope.ClearExpenseClaim();*/
				$('#detailmodal').modal('hide');
				$scope.GetAllExpenseDetail();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllExpenseDetail = function () {
		$scope.ExpenseClaimList = [];


		if ($scope.newFilter.DateFromDet && $scope.newFilter.DateFromDet.dateAD)
			var dateFrom = $filter('date')($scope.newFilter.DateFromDet.dateAD, 'yyyy-MM-dd');

		if ($scope.newFilter.DateToDet && $scope.newFilter.DateToDet.dateAD)
			var dateTo = $filter('date')($scope.newFilter.DateToDet.dateAD, 'yyyy-MM-dd');

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			DateFrom: dateFrom,
			DateTo: dateTo,
			EmployeeId: $scope.newFilter.EmployeeDetails?.UserId || null,
			StatusId: $scope.newFilter.StatusId || null
		};

		$http({
			method: 'POST',
			url: base_url + "Expense/Transaction/GetAllExpClaim",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ExpenseClaimList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG || "No data found.");
			}
		}, function (reason) {
			hidePleaseWait();
			Swal.fire('Failed: ' + reason.statusText);
		});
	};


	$scope.GetExpenseDetailById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		
		var para = {
			TranId: refData.TranId
		};

		$http({
			method: 'POST',
			url: base_url + "Expense/Transaction/GetTranExpenseClaimById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newDet = res.data.Data;
			/*	$scope.newExpenseDetail.Mode = 'Modify';*/

				$('#detailmodal').modal('show');

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.ShowPersonalImg = function (item) {
		$scope.viewImg = {
			ContentPath: '',
			FileType: null
		};

		if (item.ReciptImage && item.ReciptImage.length > 0) {
			$scope.viewImg.ContentPath = item.ReciptImage;
			$scope.viewImg.FileType = 'pdf';  // Assuming DocPath is for PDFs
			document.getElementById('pdfViewer').src = item.ReciptImage;
			$('#PersonalImg').modal('show');
		} else if (item.ReciptImage && item.ReciptImage.length > 0) {
			$scope.viewImg.ContentPath = item.ReciptImage;
			$scope.viewImg.FileType = 'image';  // Assuming PhotoPath is for images
			$('#PersonalImg').modal('show');
		} else if (item.File) {
			var blob = new Blob([item.File], { type: item.File?.type });
			$scope.viewImg.ContentPath = URL.createObjectURL(blob);
			$scope.viewImg.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';

			if ($scope.viewImg.FileType === 'pdf') {
				document.getElementById('pdfViewer').src = $scope.viewImg.ContentPath;
			}

			$('#PersonalImg').modal('show');
		} else {
			Swal.fire('No Image Found');
		}
	};



	$scope.GetAccClearanceDetailById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		
		var para = {
			TranId: refData.TranId
		};

		$http({
			method: 'POST',
			url: base_url + "Expense/Transaction/GetTranExpenseClaimById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newDet = res.data.Data;
				/*	$scope.newExpenseDetail.Mode = 'Modify';*/

				$('#clearancemodal').modal('show');

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};


	$scope.UpdateClearance = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		angular.forEach($scope.newDet.TranExpenseClaimDetailsColl, function (D) {
			D.StatusId;
			D.AcClearanceRemark;
		});
		$http({
			method: 'POST',
			url: base_url + "Expense/Transaction/UpdateAcClearance",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newDet }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$('#clearancemodal').modal('hide');
			/*	$scope.ClearExpenseClaim();*/
				
				$scope.GetAllExpenseDetail();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

});