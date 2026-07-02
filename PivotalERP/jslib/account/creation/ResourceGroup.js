app.controller('ResourceGroupController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'ResourceGroup ';

	$scope.LoadData = function () {
		var glSrv = GlobalServices;
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$('.select2bs4').select2();
		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});
		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.ResourceTypelist = [{ id: 1, text: 'Machine' }, { id: 2, text: 'Labour' }, { id: 2, text: 'Other' }];
		$scope.StatusList = [{ id: 1, text: 'Active' }, { id: 2, text: 'Inactive' }];


		$scope.SalesLedgerColl = [];
		glSrv.getSalesLedger().then(function (res1) {
			$scope.SalesLedgerColl = res1.data.Data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.currentPages = {
			ResourceGroup: 1,
		};

		$scope.searchData = {
			ResourceGroup: '',
		};

		$scope.perPage = {
			ResourceGroup: GlobalServices.getPerPageRow(),
		};

		

		$scope.beData = {
			ResourceGroupId: null,
			Name: '',
			ResourceType: null,
			UOMText: '',
			Status:false,
			ResourceGroupCostingColl: [],
			Mode: 'Save'
		};
		$scope.beData.ResourceGroupCostingColl.push({});
		$scope.GetAllResourceGroup();
	}
	
	$scope.ClearResourceGroup = function () {
		$scope.beData = {
			ResourceGroupId: null,
			Name: '',
			ResourceType: null,
			UOMText: '',
			Status: false,
			ResourceGroupCostingColl: [],
			Mode: 'Save'
		};
		$scope.beData.ResourceGroupCostingColl.push({});
	}


	$scope.AddResourceGroupCosting = function (ind) {
		if ($scope.beData.ResourceGroupCostingColl) {
			if ($scope.beData.ResourceGroupCostingColl.length > ind + 1) {
				$scope.beData.ResourceGroupCostingColl.splice(ind + 1, 0, {
					ClassName: ''
				})
			} else {
				$scope.beData.ResourceGroupCostingColl.push({
					ClassName: ''
				})
			}
		}
	};
	$scope.delResourceGroupCosting = function (ind) {
		if ($scope.beData.ResourceGroupCostingColl) {
			if ($scope.beData.ResourceGroupCostingColl.length > 1) {
				$scope.beData.ResourceGroupCostingColl.splice(ind, 1);
			}
		}
	};


	//************************* ResourceGroup *********************************
	$scope.IsValidResourceGroup = function () {
		if ($scope.beData.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateResourceGroup = function () {
		if ($scope.IsValidResourceGroup() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.beData.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateResourceGroup();
					}
				});
			} else
				$scope.CallSaveUpdateResourceGroup();
		}
	};

	$scope.CallSaveUpdateResourceGroup = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveResourceGroup",
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
				$scope.ClearResourceGroup();
				$scope.GetAllResourceGroup();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllResourceGroup = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.ResourceGroupColl = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetAllResourceGroup",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ResourceGroupColl = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetResourceGroupById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			ResourceGroupId: refData.ResourceGroupId
		};
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/getResourceGroupById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.beData = res.data.Data;

				if (!$scope.beData.ResourceGroupCostingColl || $scope.beData.ResourceGroupCostingColl.length == 0) {
					$scope.beData.ResourceGroupCostingColl = [];
					$scope.beData.ResourceGroupCostingColl.push({});
				}


				$scope.beData.Mode = 'Modify';
				$('#custom-tabs-four-profile-tab').tab('show');
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelResourceGroupById = function (refData) {
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
					ResourceGroupId: refData.ResourceGroupId
				};
				$http({
					method: 'POST',
					url: base_url + "Account/Creation/DeleteResourceGroup",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllResourceGroup();
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