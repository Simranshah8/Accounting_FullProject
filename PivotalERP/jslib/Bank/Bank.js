app.controller('BankController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'BankGroup';

	OnClickDefault();

	$scope.LoadData = function () {
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();


		$scope.currentPages = {
			BankGroup: 1,
			Bank: 1,
			BankAccount: 1,
			ChequeEntry: 1
		};

		$scope.searchData = {
			BankGroup: '',
			Bank: '',
			BankAccount: '',
			ChequeEntry: '',
		};

		$scope.perPage = {
			BankGroup: GlobalServices.getPerPageRow(),
			Bank: GlobalServices.getPerPageRow(),
			BankAccount: GlobalServices.getPerPageRow(),
			ChequeEntry: GlobalServices.getPerPageRow(),
		};

		$scope.newBankGroup = {
			BankGroupId: null,
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
			AccountNo: '',
			BranchName: '',
			Mode: 'Save'
		};

		$scope.newChequeEntry = {
			TranId: null,
			FromRange: '',
			ToRange: '',
			NoOfCheque: '',
			ChequeName: '',
			Mode: 'Save'
		};


		//$scope.GetAllBankGroup();
		//$scope.GetAllBank();
		//$scope.GetAllBankAccount();
		//$scope.GetAllChequeEntry();
	}


	function OnClickDefault() {
		document.getElementById('BankgroupForm').style.display = "none";
		document.getElementById('BankForm').style.display = "none";
		document.getElementById('bankaccountForm').style.display = "none";
		document.getElementById('ChequeEntryForm').style.display = "none";

		document.getElementById('AddBankGroup').onclick = function () {
			document.getElementById('bankgrouptable').style.display = "none";
			document.getElementById('BankgroupForm').style.display = "block";
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

	$scope.ClearBankAccount = function () {
		$scope.newBankAccount = {
			BankAccountId: null,
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
			NoOfCheque: '',
			ChequeName: '',
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
			url: base_url + "Bank/Creation/SaveBankGroup",
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
				/*$scope.GetAllBankGroup();*/
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllBankGroup = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.BankGroupList = [];
		$http({
			method: 'GET',
			url: base_url + "Bank/Creation/GetAllBankGroup",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BankGroupList = res.data.Data;
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
			url: base_url + "Bank/Creation/GetBankGroupById",
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

	$scope.DelBankGroupById = function (refData) {
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
					BankGroupId: refData.BankGroupId
				};
				$http({
					method: 'POST',
					url: base_url + "Bank/Creation/DeleteBankGroup",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllBankGroup();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	};


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
			url: base_url + "Bank/Creation/SaveBank",
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
				/*$scope.GetAllBank();*/
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllBank = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.BankList = [];
		$http({
			method: 'GET',
			url: base_url + "Bank/Creation/GetAllBank",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BankList = res.data.Data;
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
			url: base_url + "Bank/Creation/GetBankById",
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

	$scope.DelBankById = function (refData) {
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
					BankId: refData.BankId
				};
				$http({
					method: 'POST',
					url: base_url + "Bank/Creation/DeleteBank",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllBank();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	};

	//************************* BankAccount *********************************
	$scope.IsValidBankAccount = function () {
		if ($scope.newBankAccount.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
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
			url: base_url + "Bank/Creation/SaveBankAccount",
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
				/*$scope.GetAllBankAccount();*/
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllBankAccount = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.BankAccountList = [];
		$http({
			method: 'GET',
			url: base_url + "Bank/Creation/GetAllBankAccount",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BankAccountList = res.data.Data;
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
			url: base_url + "Bank/Creation/GetBankAccountById",
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

	$scope.DelBankAccountById = function (refData) {
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
					BankAccountId: refData.BankAccountId
				};
				$http({
					method: 'POST',
					url: base_url + "Bank/Creation/DeleteBankAccount",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllBankAccount();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	};



	//************************* ChequeEntry *********************************
	$scope.IsValidChequeEntry = function () {
		if ($scope.newChequeEntry.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
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
			url: base_url + "Bank/Creation/SaveChequeEntry",
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
				/*$scope.GetAllChequeEntry();*/
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllChequeEntry = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.ChequeEntryList = [];
		$http({
			method: 'GET',
			url: base_url + "Bank/Creation/GetAllChequeEntry",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ChequeEntryList = res.data.Data;
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
			ChequeEntryId: refData.ChequeEntryId
		};
		$http({
			method: 'POST',
			url: base_url + "Bank/Creation/GetChequeEntryById",
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

	$scope.DelChequeEntryById = function (refData) {
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
					ChequeEntryId: refData.ChequeEntryId
				};
				$http({
					method: 'POST',
					url: base_url + "Bank/Creation/DeleteChequeEntry",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllChequeEntry();
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