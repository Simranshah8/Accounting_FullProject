app.controller('ExpenseClaimController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'ExpenseClaim Entry';

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		//$scope.LanguageColl = GlobalServices.getLangList();
		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();
		
		$scope.ExpenseTypeColl = [{ id: 1, text: 'Travelling Expense(s)' }, { id: 2, text: 'Lodging Expense(s)' }, { id: 3, text: 'Fooding Expense(s)' }, { id: 4, text: 'Meeting Expense(s)' }, { id: 5, text: 'Office Expense(s)' }, { id: 6, text: 'Other Expense(s)' }]

		$scope.currentPages = {
			ExpenseClaim: 1,
		};
		$scope.searchData = {
			ExpenseClaim: '',
		};
		$scope.perPage = {
			ExpenseClaim: GlobalServices.getPerPageRow(),
		};
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

		
		$scope.newExpenseClaim = {
			TranId: null,
			ExpenseClaimForId: null,
			DateFrom_TMP: new Date(),
			DateTo_TMP: new Date(),
			ExpenseTitle: '',
			ExpenseTypeId: null,
			DestinationFrom: '',
			DestinationTo: '',
			DistanceTravelled: 0,
			PurposeOfVisit: '',
			Reason: '',
			ExpAttachment: '',
			DetailsColl: [],
			DocumentColl: [],
			AttechFiles: [],
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			Mode: 'Save',
		};
		$scope.newExpenseClaim.DetailsColl.push({});
	};

	$scope.calculateExpense = function (item, changedField) {

		var qty = parseFloat(item.Quantity) || 0;
		var rate = parseFloat(item.Rate) || 0;
		var amount = parseFloat(item.Amount) || 0;

		// If Quantity or Rate changes → recalculate Amount
		if (changedField === 'qty' || changedField === 'rate') {
			item.Amount = qty * rate;
		}

		// If Amount changes → recalculate Rate (avoid divide by zero)
		if (changedField === 'amount') {
			if (qty !== 0) {
				item.Rate = amount / qty;
			} else {
				item.Rate = 0;
			}
		}
	};
	$scope.ClearExpenseClaim = function () {
		$timeout(function () {
			$scope.newExpenseClaim = {
				TranId: null,
				ExpenseClaimForId: null,
				DateFrom_TMP: new Date(),
				DateTo_TMP: new Date(),
				ExpenseTitle: '',
				ExpenseTypeId: null,
				DestinationFrom: '',
				DestinationTo: '',
				DistanceTravelled: 0,
				PurposeOfVisit: '',
				Reason: '',
				ExpAttachment: '',
				DetailsColl: [],
				AttechFiles: [],
				SelectEmployee: $scope.EmployeeSearchOptions[0].value,
				DocumentColl: [],
				Mode: 'Save',
			};
			$scope.newExpenseClaim.DetailsColl.push({});
		});
		
	};


	$scope.AddExpenseEntryColl = function (ind) {
		if ($scope.newExpenseClaim.DetailsColl) {
			if ($scope.newExpenseClaim.DetailsColl.length > ind + 1) {
				$scope.newExpenseClaim.DetailsColl.splice(ind + 1, 0, {
					Description: ''
				})
			} else {
				$scope.newExpenseClaim.DetailsColl.push({
					Description: ''
				})
			}
		}
	};

	$scope.DelExpenseEntryColl = function (ind) {
		if ($scope.newExpenseClaim.DetailsColl) {
			if ($scope.newExpenseClaim.DetailsColl.length > 1) {
				$scope.newExpenseClaim.DetailsColl.splice(ind, 1);
			}
		}
	};


	$scope.AddMoreFiles = function (files, des) {
		if (files) {
			if (files != null) {
				angular.forEach(files, function (file) {
					$scope.newExpenseClaim.DocumentColl.push({
						File: file,
						Name: file.name,
						Type: file.type,
						Size: file.size,
						Description: des,
						Path: null
					});
				})
				$scope.attachFile = null;
				$scope.docDescription = '';
				$('#flMoreFiles').val('');
			}
		}
	};

	$scope.delAttachmentFiles = function (ind) {
		if ($scope.newExpenseClaim.DocumentColl) {
			if ($scope.newExpenseClaim.DocumentColl.length > 0) {
				$scope.newExpenseClaim.DocumentColl.splice(ind, 1);
			}
		}
	}
	$scope.ShowPersonalImg = function (item) {
		$scope.viewImg = {
			ContentPath: '',
			FileType: null
		};

		if (item.DocPath && item.DocPath.length > 0) {
			$scope.viewImg.ContentPath = item.DocPath;
			$scope.viewImg.FileType = 'pdf';  // Assuming DocPath is for PDFs
			document.getElementById('pdfViewer').src = item.DocPath;
			$('#PersonalImg').modal('show');
		} else if (item.PhotoPath && item.PhotoPath.length > 0) {
			$scope.viewImg.ContentPath = item.PhotoPath;
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

	$scope.IsValidExpenseClaim = function () {
		//if ($scope.newExpenseClaim.Remarks.isEmpty()) {
		//	Swal.fire('Please ! Enter Reason');
		//	return false;
		//}
		return true;
	};

	$scope.SaveUpdateExpenseClaim = function () {
		if ($scope.IsValidExpenseClaim() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newExpenseClaim.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateExpenseClaim();
					}
				});
			} else
				$scope.CallSaveUpdateExpenseClaim();
		}
	};

    $scope.CallSaveUpdateExpenseClaim = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

		var RcPhoto = $scope.newExpenseClaim.DetailsColl;

		var filesColl = $scope.newExpenseClaim.DocumentColl;

        if ($scope.newExpenseClaim.DateFromDet) {
            $scope.newExpenseClaim.DateFrom = $filter('date')(new Date($scope.newExpenseClaim.DateFromDet.dateAD), 'yyyy-MM-dd');
        }
        if ($scope.newExpenseClaim.DateToDet) {
            $scope.newExpenseClaim.DateTo = $filter('date')(new Date($scope.newExpenseClaim.DateToDet.dateAD), 'yyyy-MM-dd');
        }
        $scope.newExpenseClaim.ExpenseClaimForId = $scope.newExpenseClaim.EmployeeDetails.UserId,
			angular.forEach($scope.newExpenseClaim.DetailsColl, function (D) {
                if (D.ExpenseDateDet) {
                    D.ExpenseDate = $filter('date')(new Date(D.ExpenseDateDet.dateAD), 'yyyy-MM-dd');
				}
            });


        $http({
            method: 'POST',
			url: base_url + "HR/Expenses/SaveExpenseClaim",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

				if (data.files) {
					for (var i = 0; i < data.files.length; i++) {
						formData.append("file" + i, data.files[i].File);
					}
				}
				angular.forEach($scope.newExpenseClaim.DetailsColl, function (rg) {
					if (rg.ExpenseCategoryId && rg.ExpenseCategoryId > 0) {
						try {
							if (rg.ReciptImage_TMP && rg.ReciptImage_TMP.length > 0) {
								var fn = 'file2' + rg.ExpenseCategoryId;
								formData.append(fn, rg.ReciptImage_TMP[0]);
							}
						}
						catch (ee) {
							if (rg.ReciptImage_TMP) {
								var fn = 'file2' + rg.ExpenseCategoryId;
								formData.append(fn, rg.ReciptImage_TMP);
							}
						}

					}
				});

				

                return formData;
            },
			data: { jsonData: $scope.newExpenseClaim, rcPhotos: RcPhoto, files: filesColl }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearExpenseClaim();
                //$scope.GetAllExpenseClaimList();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

});