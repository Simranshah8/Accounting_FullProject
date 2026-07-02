app.controller('ResourceController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Resource ';

	$scope.LoadData = function () {
		var glSrv = GlobalServices;
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$('.select2').select2();
		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.ResourceTypelist = [{ id: 1, text: 'Machine' }, { id: 2, text: 'Labour' }, { id: 2, text: 'Other' }];
		$scope.StatusList = [{ id: 1, text: 'Active' }, { id: 2, text: 'Inactive' }];
		$scope.ResourceAllocationOnList = [{ id: 1, text: 'Start Date' }, { id: 2, text: 'End Date' }];

		$scope.currentPages = {
			Resource: 1,
		};

		$scope.searchData = {
			Resource: '',
		};

		$scope.perPage = {
			Resource: GlobalServices.getPerPageRow(),
		};

		$scope.SalesLedgerColl = [];
		glSrv.getSalesLedger().then(function (res1) {
			$scope.SalesLedgerColl = res1.data.Data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.ResourceGroupList = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetAllResourceGroup",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ResourceGroupList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});



		$scope.beData = {
			ResourceId: null,
			ResourceNo: null,
			Name: '',
			Alias: '',
			Code: '',
			Description: '',
			ResourceType: null,
			ResourceGroupId: null,
			UOMText: '',
			ResUnitsPerTimePeriod: null,
			R_HH: null,
			R_MM: null,
			R_SS: null,
			ResourceAllocationOn: null,
			Status: false,
			ResourceCostingColl: [],
			Mode: 'Save'
		};
		$scope.beData.ResourceCostingColl.push({});
		
		$scope.GetAllResource();
	}

	

	$scope.ClearResource = function () {
		$scope.beData = {
			ResourceId: null,
			ResourceNo:null,
			Name: '',
			Alias: '',
			Code: '',
			Description: '',
			ResourceType: null,
			ResourceGroupId: null,
			UOMText: '',
			ResUnitsPerTimePeriod: null,
			R_HH: null,
			R_MM: null,
			R_SS: null,
			ResourceAllocationOn: null,
			Status:false,
			ResourceCostingColl: [],			
			Mode: 'Save'
		};
		$scope.beData.ResourceCostingColl.push({});
	}

	$scope.AddResourceGroupCosting = function (ind) {
		if ($scope.beData.ResourceCostingColl) {
			if ($scope.beData.ResourceCostingColl.length > ind + 1) {
				$scope.beData.ResourceCostingColl.splice(ind + 1, 0, {
					ClassName: ''
				})
			} else {
				$scope.beData.ResourceCostingColl.push({
					ClassName: ''
				})
			}
		}
	};
	$scope.delResourceGroupCosting = function (ind) {
		if ($scope.beData.ResourceCostingColl) {
			if ($scope.beData.ResourceCostingColl.length > 1) {
				$scope.beData.ResourceCostingColl.splice(ind, 1);
			}
		}
	};

	//************************* Resource *********************************
	$scope.IsValidResource = function () {
		if ($scope.beData.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateResource = function () {
		if ($scope.IsValidResource() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.beData.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateResource();
					}
				});
			} else
				$scope.CallSaveUpdateResource();
		}
	};

	$scope.CallSaveUpdateResource = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveResource",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.beData }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearResource();
				$scope.GetAllResource();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllResource = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.ResourceList = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetAllResource",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ResourceList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetResourceById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			ResourceId: refData.ResourceId
		};
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/getResourceById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.beData = res.data.Data;
				$scope.beData.Mode = 'Modify';

				if (!$scope.beData.ResourceCostingColl || $scope.beData.ResourceCostingColl.length == 0) {
					$scope.beData.ResourceCostingColl = [];
					$scope.beData.ResourceCostingColl.push({});
				}

				$('#custom-tabs-four-profile-tab').tab('show');
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelResourceById = function (refData) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.Name + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();
				var para = {
					ResourceId: refData.ResourceId
				};
				$http({
					method: 'POST',
					url: base_url + "Account/Creation/DeleteResource",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllResource();
					}
					Swal.fire(res.data.ResponseMSG);

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