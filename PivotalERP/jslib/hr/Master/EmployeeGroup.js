app.controller('EmployeeGroupController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Empoyee group';

	LoadData();

	function LoadData() {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();


		$scope.currentPages = {
			EmployeeGroup: 1,
		};

		$scope.searchData = {
			EmployeeGroup: '',
		};

		$scope.perPage = {
			EmployeeGroup: GlobalServices.getPerPageRow(),
		};

		$scope.BaseGroupList = [];
		$http({
			method: 'Get',
			url: base_url + "HR/Master/GetAllEmployeeGroup",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BaseGroupList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.PayHeadList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllPayHeading",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.PayHeadList = res.data.Data.filter(function (item) {
					return item.IsActive === true;
				});
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.newEmployeeGroup = {
			EmployeeGroupId: null,
			Name: '',
			Alias: '',
			Description: '',
			Mode: 'Save',
            EmployeeGroupWisePayHeadLedgerColl: [{
				LedgerId: null
			}],
		};

		//$scope.GetAllEmployeeGroupList();
	}

	$scope.ClearEmployeeGroup = function () {

		$timeout(function () {
			$scope.clrLedger();
			$scope.newEmployeeGroup = {
				EmployeeGroupId: null,
				Name: '',
				Alias: '',
				Description: '',
				Mode: 'Save',
				EmployeeGroupWisePayHeadLedgerColl: [{
					LedgerId: null
				}],
			};

		});

	}

	$scope.clrLedger = function () {
		angular.forEach($scope.PayHeadList, function (item) {
			item.LedgerId = null;
			item.LedgerGroup = '';
		});
	}

	$scope.PartySelectionChange = function (det) {
		if (det && det.PartyLedger) {
			det.LedgerGroup = det.PartyLedger.GroupName;
		} else {
			det.LedgerGroup = '';
		}
	};

	//************************* EmployeeGroup *********************************


	$scope.IsValidEmployeeGroup = function () {
		if ($scope.newEmployeeGroup.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateEmployeeGroup = function () {
		if ($scope.IsValidEmployeeGroup() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newEmployeeGroup.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateEmployeeGroup();
					}
				});
			} else
				$scope.CallSaveUpdateEmployeeGroup();
		}
	};

	$scope.CallSaveUpdateEmployeeGroup = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var employeeGpWisePayHeadLedger = [];
		angular.forEach($scope.PayHeadList, function (item) {
			if (item.LedgerId) {
				employeeGpWisePayHeadLedger.push({
					PayHeadingId: item.PayHeadingId,
					LedgerId: item.LedgerId
				});
			}
		});
		$scope.newEmployeeGroup.EmployeeGroupWisePayHeadLedgerColl = employeeGpWisePayHeadLedger;
		$http({
			method: 'POST',
			url: base_url + "HR/Master/SaveUpdateEmployeeGroup",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newEmployeeGroup }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearEmployeeGroup();
				$scope.GetAllEmployeeGroupList();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllEmployeeGroupList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.EmployeeGroupList = [];
		$http({
			method: 'Get',
			url: base_url + "HR/Master/GetAllEmployeeGroup",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EmployeeGroupList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetEmployeeGroupById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			EmployeeGroupId: refData.EmployeeGroupId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Master/getEmployeeGroupById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newEmployeeGroup = res.data.Data;
				$scope.newEmployeeGroup.Mode = 'Modify';
				if ($scope.newEmployeeGroup.EmployeeGroupWisePayHeadLedgerColl && $scope.PayHeadList.length > 0) {
					angular.forEach($scope.PayHeadList, function (item) {
						// Find matching PayHeadingId from the mapping list
						var match = $scope.newEmployeeGroup.EmployeeGroupWisePayHeadLedgerColl.find(function (m) {
							return m.PayHeadingId === item.PayHeadingId;
						});
						// If found, assign its LedgerId
						if (match) {
							item.LedgerId = match.LedgerId;
							if ($scope.PayHeadList[0].PartyLedger) {
								item.PartyLedger = angular.copy($scope.PayHeadList[0].PartyLedger);
							}
							$scope.PartySelectionChange(item);
						} else {
							item.LedgerId = null;
							item.LedgerGroup = '';
						}
					});
				}
				$('#custom-tabs-four-profile-tab').tab('show');


			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelEmployeeGroupById = function (refData) {
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
					EmployeeGroupId: refData.EmployeeGroupId
				};
				$http({
					method: 'POST',
					url: base_url + "HR/Master/DeleteEmployeeGroupById",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllEmployeeGroupList();
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