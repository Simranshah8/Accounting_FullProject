app.controller('BankController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'BankGroup';

	OnClickDefault();

	$scope.LoadData = function () {
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.FundTransferTypeColl = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetAllFundTransferType",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.FundTransferTypeColl = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});



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

		$scope.BankAccountColl = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetAllBankAccount",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BankAccountColl = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.currentPages = {
			BankGroup: 1,
			Bank: 1,
			BankAccount: 1,
			ChequeEntry: 1,
			ChequeRegister: 1,
			FundTransferType:1,
		};

		$scope.searchData = {
			BankGroup: '',
			Bank: '',
			BankAccount: '',
			ChequeEntry: '',
			ChequeRegister: '',
			FundTransferType:'',
		};

		$scope.perPage = {
			BankGroup: GlobalServices.getPerPageRow(),
			Bank: GlobalServices.getPerPageRow(),
			BankAccount: GlobalServices.getPerPageRow(),
			ChequeEntry: GlobalServices.getPerPageRow(),
			ChequeRegister: GlobalServices.getPerPageRow(),
			FundTransferType: GlobalServices.getPerPageRow(),
		};

		$scope.newBankGroup = {
			BankGroupId: null,
			Name: '',
			Code: '',
			Mode: 'Save'
		};


		$scope.newFundTransferType = {
			FundTransferTypeId: 0,
			Name: '',
			Code: '',
			Mode: 'Save'
		};


		$scope.newBank = {
			BankId: null,
			Name: '',
			Code: '',
			BankGroupId: null,
			Mode: 'Save'
		};

		$scope.newBankAccount = {
			BankAccountId: null,
			BankId: null,
			AccountNo: '',
			BranchName: '',
			Mode: 'Save'
		};

		$scope.newChequeEntry = {
			TranId: null,
			FromRange: '',
			ToRange: '',
			NoOfCheque: 0,
			ChequeName: '',
			NoOfDigits:0,
			Mode: 'Save'
		};

		$scope.ReportTypeColl = [{ id: 1, text: 'Pending' }, { id: 2, text: 'Issue' }, { id: 3, text: 'Cancel' },]
		$scope.newChequeRegister = {
			ReportType: 1 
		};

		$scope.GetAllBankGroup();
		$scope.GetAllFundTransferType();
		$scope.GetAllBank();
		$scope.GetAllBankAccount();
		$scope.GetAllChequeEntry();
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
			url: base_url + "Account/Creation/GetChequeRegister",
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

		var f = $scope.newChequeEntry.FromRange;
		var t = $scope.newChequeEntry.ToRange;
		var total = 0;
		if (t > 0) {
			total = (t - f) + 1;

			if (total <= 0) {
				$scope.newChequeEntry.ToRange = 0;
				Swal.fire('Invalid To Range Value');
			} 			
		}

		$scope.newChequeEntry.NoOfCheque = total;

		//$scope.newChequeEntry.NoOfDigits = $scope.newChequeEntry.FromRange.length;
    }


	function OnClickDefault() {
		document.getElementById('BankgroupForm').style.display = "none";
		document.getElementById('FundTransferTypeForm').style.display = "none";
		document.getElementById('BankForm').style.display = "none";
		document.getElementById('bankaccountForm').style.display = "none";
		document.getElementById('ChequeEntryForm').style.display = "none";

		document.getElementById('AddBankGroup').onclick = function () {
			document.getElementById('bankgrouptable').style.display = "none";
			document.getElementById('BankgroupForm').style.display = "block";
		}

		document.getElementById('AddFundTransferType').onclick = function () {
			document.getElementById('fundtransfertypetable').style.display = "none";
			document.getElementById('FundTransferTypeForm').style.display = "block";
		}

		document.getElementById('backtogroup').onclick = function () {
			document.getElementById('BankgroupForm').style.display = "none";
			document.getElementById('bankgrouptable').style.display = "block";
		}

		document.getElementById('AddBank').onclick = function () {
			document.getElementById('banktable').style.display = "none";
			document.getElementById('BankForm').style.display = "block";
		}

		document.getElementById('backtobank').onclick = function () {
			document.getElementById('BankForm').style.display = "none";
			document.getElementById('banktable').style.display = "block";
		}

		document.getElementById('Addbankaccount').onclick = function () {
			document.getElementById('bankaccounttable').style.display = "none";
			document.getElementById('bankaccountForm').style.display = "block";
		}

		document.getElementById('backtobankaccount').onclick = function () {
			document.getElementById('bankaccountForm').style.display = "none";
			document.getElementById('bankaccounttable').style.display = "block";
		}
		document.getElementById('AddChequeEntry').onclick = function () {
			document.getElementById('ChequeEntrytable').style.display = "none";
			document.getElementById('ChequeEntryForm').style.display = "block";
		}

		document.getElementById('backtoChequeEntry').onclick = function () {
			document.getElementById('ChequeEntryForm').style.display = "none";
			document.getElementById('ChequeEntrytable').style.display = "block";
		}

		document.getElementById('backtoFundTransferType').onclick = function () {
			document.getElementById('FundTransferTypeForm').style.display = "none";
			document.getElementById('fundtransfertypetable').style.display = "block";
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


	$scope.ClearFundTransferType = function () {
		$scope.newFundTransferType = {
			FundTransferTypeId: 0,
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

	$scope.ClearBankAccount = function () {
		$scope.newBankAccount = {
			BankAccountId: null,
			BankId: null,
			AccountNo: '',
			BranchName: '',
			Mode: 'Save'
		};
	}

	$scope.ClearChequeEntry = function () {
		$scope.newChequeEntry = {
			TranId: null,
			FromRange: '',
			ToRange: '',
			NoOfCheque: 0,
			ChequeName: '',
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


	//************************* FundTransferType *********************************
	$scope.IsValidFundTransferType = function () {
		if ($scope.newFundTransferType.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateFundTransferType = function () {
		if ($scope.IsValidFundTransferType() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newFundTransferType.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateFundTransferType();
					}
				});
			} else
				$scope.CallSaveUpdateFundTransferType();
		}
	};

	$scope.CallSaveUpdateFundTransferType = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveFundTransferType",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newFundTransferType }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearFundTransferType();
				$scope.GetAllFundTransferType();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllFundTransferType = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.FundTransferTypeColl = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetAllFundTransferType",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.FundTransferTypeColl = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetFundTransferTypeById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			FundTransferTypeId: refData.FundTransferTypeId
		};
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetFundTransferTypeById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newFundTransferType = res.data.Data;
				$scope.newFundTransferType.Mode = 'Modify';

				document.getElementById('fundtransfertypetable').style.display = "none";
				document.getElementById('FundTransferTypeForm').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DeleteFundTransferType = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.Name + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { FundTransferTypeId: refData.FundTransferTypeId };
				$http({
					method: 'POST',
					url: base_url + "Account/Creation/DeleteFundTransferType",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.FundTransferTypeColl.splice(ind, 1);
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

	//************************* BankAccount *********************************
	$scope.IsValidBankAccount = function () {
		if ($scope.newBankAccount.BranchName.isEmpty()) {
			Swal.fire('Please ! Enter BranchName');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateBankAccount = function () {
		if ($scope.IsValidBankAccount() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newBankAccount.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateBankAccount();
					}
				});
			} else
				$scope.CallSaveUpdateBankAccount();
		}
	};

	$scope.CallSaveUpdateBankAccount = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveBankAccount",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newBankAccount }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearBankAccount();
				$scope.GetAllBankAccount();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllBankAccount = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.BankAccountColl = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetAllBankAccount",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BankAccountColl = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetBankAccountById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			BankAccountId: refData.BankAccountId
		};
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetBankAccountById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newBankAccount = res.data.Data;
				$scope.newBankAccount.Mode = 'Modify';

				document.getElementById('bankaccounttable').style.display = "none";
				document.getElementById('bankaccountForm').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DeleteBankAccount = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.BranchName + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { BankAccountId: refData.BankAccountId };
				$http({
					method: 'POST',
					url: base_url + "Account/Creation/DeleteBankAccount",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.BankAccountColl.splice(ind, 1);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});
	}

	//************************* ChequeEntry *********************************
	$scope.IsValidChequeEntry = function () {
		if ($scope.newChequeEntry.ChequeName.isEmpty()) {
			Swal.fire('Please ! Enter ChequeName');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateChequeEntry = function () {
		if ($scope.IsValidChequeEntry() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newChequeEntry.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateChequeEntry();
					}
				});
			} else
				$scope.CallSaveUpdateChequeEntry();
		}
	};

	$scope.CallSaveUpdateChequeEntry = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveChequeEntry",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newChequeEntry }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearChequeEntry();
				$scope.GetAllChequeEntry();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllChequeEntry = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.ChequeEntryColl = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetAllChequeEntry",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ChequeEntryColl = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetChequeEntryById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TranId: refData.TranId
		};
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/getChequeEntryById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newChequeEntry = res.data.Data;
				$scope.newChequeEntry.Mode = 'Modify';

				document.getElementById('ChequeEntrytable').style.display = "none";
				document.getElementById('ChequeEntryForm').style.display = "block";
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DeleteChequeEntry = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.BankAccountId + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { TranId: refData.TranId };
				$http({
					method: 'POST',
					url: base_url + "Account/Creation/DeleteChequeEntry",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.ChequeEntryColl.splice(ind, 1);
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