app.controller('ReceiptEntryController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'BankGroup';

	OnClickDefault();

	$scope.LoadData = function () {
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		 
		$scope.currentPages = {
			BankGroup: 1,
			Bank: 1,
			Branch: 1,
			ReceiptEntry: 1,
			ChequeRegister:1,
		};

		$scope.searchData = {
			BankGroup: '',
			Bank: '',
			Branch: '',
			ReceiptEntry: '',
			ChequeRegister:''
		};

		$scope.perPage = {
			BankGroup: GlobalServices.getPerPageRow(),
			Bank: GlobalServices.getPerPageRow(),
			Branch: GlobalServices.getPerPageRow(),
			ReceiptEntry: GlobalServices.getPerPageRow(),
			ChequeRegister: GlobalServices.getPerPageRow(),
		};
		 
		$scope.newReceiptEntry = {
			TranId: null,
			FromRange: '',
			ToRange: '',
			NoOfReceipt: 0,
			ReceiptName: '',
			NoOfDigits:0,
			Mode: 'Save'
		};

		$scope.BranchColl = [];
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllBranchListForEntry",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchColl = res.data.Data;
			}
		}, function (reason) {
			alert('Failed' + reason);
		});

		$scope.ReportTypeColl = [{ id: 1, text: 'Pending' }, { id: 2, text: 'Issue' }, { id: 3, text: 'Cancel' },]
		$scope.newChequeRegister = {
			ReportType: 1 
		};
		 
		$scope.GetAllReceiptEntry();
	}

	$scope.LoadChequeRegister = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.ChequeRegisterColl = [];
		var para = {
			ReportType:$scope.newChequeRegister.ReportType
		};
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetReceiptRegister",
			dataType: "json",
			data:JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ChequeRegisterColl = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
    }
	$scope.ChequeNoChanged = function () {

		var f = $scope.newReceiptEntry.FromRange;
		var t = $scope.newReceiptEntry.ToRange;
		var total = 0;
		if (t > 0) {
			total = (t - f) + 1;

			if (total <= 0) {
				$scope.newReceiptEntry.ToRange = 0;
				Swal.fire('Invalid To Range Value');
			} 			
		}

		$scope.newReceiptEntry.NoOfReceipt = total;

		//$scope.newReceiptEntry.NoOfDigits = $scope.newReceiptEntry.FromRange.length;
    }


	function OnClickDefault() {
		 
		document.getElementById('ReceiptEntryForm').style.display = "none";
   
		document.getElementById('AddReceiptEntry').onclick = function () {
			document.getElementById('ReceiptEntrytable').style.display = "none";
			document.getElementById('ReceiptEntryForm').style.display = "block";
		}

		document.getElementById('backtoReceiptEntry').onclick = function () {
			document.getElementById('ReceiptEntryForm').style.display = "none";
			document.getElementById('ReceiptEntrytable').style.display = "block";
		}
	}

	$scope.ClearBankGroup = function () {
		$scope.newBankGroup = {
			BankGroupId: null,
			Name: '',
			Code: '',
			Mode: 'Save'
		};
	}

	$scope.ClearBank = function () {
		$scope.newBank = {
			BankId: null,
			Name: '',
			Code: '',
			BankGroupId: null,
			Mode: 'Save'
		};
	}

	$scope.ClearBranch = function () {
		$scope.newBranch = {
			BranchId: null,
			BankId: null,
			AccountNo: '',
			BranchName: '',
			Mode: 'Save'
		};
	}

	$scope.ClearReceiptEntry = function () {
		$scope.newReceiptEntry = {
			TranId: null,
			FromRange: '',
			ToRange: '',
			NoOfReceipt: 0,
			ReceiptName: '',
			NoOfDigits:0,
			Mode: 'Save'
		};
	}


	//************************* BankGroup *********************************
	$scope.IsValidBankGroup = function () {
		if ($scope.newBankGroup.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateBankGroup = function () {
		if ($scope.IsValidBankGroup() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newBankGroup.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateBankGroup();
					}
				});
			} else
				$scope.CallSaveUpdateBankGroup();
		}
	};

	$scope.CallSaveUpdateBankGroup = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveBankGroup",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newBankGroup }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearBankGroup();
				$scope.GetAllBankGroup();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllBankGroup = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.BankGroupColl = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetAllBankGroup",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BankGroupColl = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetBankGroupById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			BankGroupId: refData.BankGroupId
		};
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetBankGroupById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newBankGroup = res.data.Data;
				$scope.newBankGroup.Mode = 'Modify';

				document.getElementById('bankgrouptable').style.display = "none";
				document.getElementById('BankgroupForm').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DeleteBankGroup = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.Name + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { BankGroupId: refData.BankGroupId };
				$http({
					method: 'POST',
					url: base_url + "Account/Creation/DeleteBankGroup",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.BankGroupColl.splice(ind, 1);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});
	}


	//************************* Bank *********************************
	$scope.IsValidBank = function () {
		if ($scope.newBank.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateBank = function () {
		if ($scope.IsValidBank() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newBank.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateBank();
					}
				});
			} else
				$scope.CallSaveUpdateBank();
		}
	};

	$scope.CallSaveUpdateBank = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveBank",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newBank }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearBank();
				$scope.GetAllBank();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllBank = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.BankColl = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetAllBank",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BankColl = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetBankById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			BankId: refData.BankId
		};
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetBankById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newBank = res.data.Data;
				$scope.newBank.Mode = 'Modify';

				document.getElementById('banktable').style.display = "none";
				document.getElementById('BankForm').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DeleteBank = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.Name + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { BankId: refData.BankId };
				$http({
					method: 'POST',
					url: base_url + "Account/Creation/DeleteBank",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.BankColl.splice(ind, 1);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});
	}

	//************************* Branch *********************************
	$scope.IsValidBranch = function () {
		if ($scope.newBranch.BranchName.isEmpty()) {
			Swal.fire('Please ! Enter BranchName');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateBranch = function () {
		if ($scope.IsValidBranch() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newBranch.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateBranch();
					}
				});
			} else
				$scope.CallSaveUpdateBranch();
		}
	};

	$scope.CallSaveUpdateBranch = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveBranch",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newBranch }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearBranch();
				$scope.GetAllBranch();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllBranch = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.BranchColl = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetAllBranch",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchColl = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetBranchById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			BranchId: refData.BranchId
		};
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetBranchById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newBranch = res.data.Data;
				$scope.newBranch.Mode = 'Modify';

				document.getElementById('Branchtable').style.display = "none";
				document.getElementById('BranchForm').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DeleteBranch = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.BranchName + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { BranchId: refData.BranchId };
				$http({
					method: 'POST',
					url: base_url + "Account/Creation/DeleteBranch",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.BranchColl.splice(ind, 1);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});
	}

	//************************* ReceiptEntry *********************************
	$scope.IsValidReceiptEntry = function () {
		if ($scope.newReceiptEntry.ReceiptName.isEmpty()) {
			Swal.fire('Please ! Enter ReceiptName');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateReceiptEntry = function () {
		if ($scope.IsValidReceiptEntry() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newReceiptEntry.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateReceiptEntry();
					}
				});
			} else
				$scope.CallSaveUpdateReceiptEntry();
		}
	};

	$scope.CallSaveUpdateReceiptEntry = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveReceiptEntry",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newReceiptEntry }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearReceiptEntry();
				$scope.GetAllReceiptEntry();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.SelectedRec = null;
	$scope.ShowAllotedTo = function (refData) {

		if (!refData.AllotedTo || refData.AllotedTo.length == 0) {
			$scope.SelectedRec = refData;
			$('#modal-alloted').modal('show');
        }
    }
	$scope.SaveAllotedTo = function () {

		if ($scope.SelectedRec) {
			$scope.loadingstatus = "running";
			showPleaseWait();
			$http({
				method: 'POST',
				url: base_url + "Account/Creation/SaveAllotedTo",
				headers: { 'Content-Type': undefined },
				transformRequest: function (data) {
					var formData = new FormData();
					formData.append("jsonData", angular.toJson(data.jsonData));
					return formData;
				},
				data: { jsonData: $scope.SelectedRec }
			}).then(function (res) {
				$scope.loadingstatus = "stop";
				hidePleaseWait();
				Swal.fire(res.data.ResponseMSG);
				if (res.data.IsSuccess == true) {
					$('#modal-alloted').modal('hide');
					$scope.GetAllReceiptEntry();
				}
			}, function (errormessage) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
			});
        }
		
	}

	$scope.GetAllReceiptEntry = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.ReceiptEntryColl = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetAllReceiptEntry",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ReceiptEntryColl = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetReceiptEntryById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TranId: refData.TranId
		};
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/getReceiptEntryById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newReceiptEntry = res.data.Data;
				$scope.newReceiptEntry.Mode = 'Modify';

				document.getElementById('ReceiptEntrytable').style.display = "none";
				document.getElementById('ReceiptEntryForm').style.display = "block";
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DeleteReceiptEntry = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.BranchId + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { TranId: refData.TranId };
				$http({
					method: 'POST',
					url: base_url + "Account/Creation/DeleteReceiptEntry",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.ReceiptEntryColl.splice(ind, 1);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});
	}

	$scope.SelectedCheque = null;
	$scope.CancelModal = function (obj) {
		 
		$scope.SelectedCheque = obj;

		$('#modal-cancel').modal('show');

	}
	$scope.CancelVoucher = function () {
		$('#modal-cancel').modal('hide');

		var obj = $scope.SelectedCheque;

		Swal.fire({
			title: 'Do you want to cancel the selected cheque no(' + obj.DisplayChequeNo + ') :- ' + obj.AccountNo + ' ? ',
			showCancelButton: true,
			confirmButtonText: 'Yes',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();

				var para={
					ChequeId: obj.ChequeId,
					CancelRemarks: obj.CancelRemarks, 
				};
  
				$http({
					method: 'POST',
					url: base_url + "Account/Creation/CancelCheque",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.LoadChequeRegister();
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