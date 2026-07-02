app.controller('UnitOfWorkController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Unit Of Work';

	LoadData();

	function LoadData() {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();


		$scope.currentPages = {
			UnitOfWork: 1,
		};

		$scope.searchData = {
			UnitOfWork: '',
		};

		$scope.perPage = {
			UnitOfWork: GlobalServices.getPerPageRow(),
		};


		$scope.newUnitOfWork = {
			UnitOfWorkId: null,
			Name: '',
			Alias: '',
			Description: '',
			Mode: 'Save'
		};

		//$scope.GetAllUnitOfWorkList();
	}


	$scope.ClearUnitOfWork = function () {

		$timeout(function () {
			$scope.newUnitOfWork = {
				UnitOfWorkId: null,
				Name: '',
				Alias: '',
				Description: '',
				Mode: 'Save'
			};

		});

	}
	//************************* UnitOfWork *********************************


	$scope.IsValidUnitOfWork = function () {
		if ($scope.newUnitOfWork.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateUnitOfWork = function () {
		if ($scope.IsValidUnitOfWork() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newUnitOfWork.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateUnitOfWork();
					}
				});
			} else
				$scope.CallSaveUpdateUnitOfWork();
		}
	};

	$scope.CallSaveUpdateUnitOfWork = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/Master/SaveUpdateUnitsOfWork",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newUnitOfWork }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearUnitOfWork();
				$scope.GetAllUnitOfWorkList();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllUnitOfWorkList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.UnitOfWorkList = [];
		$http({
			method: 'Get',
			url: base_url + "HR/Master/GetAllUnitsOfWork",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.UnitOfWorkList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetUnitsOfWorkById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			UnitsOfWorkId: refData.UnitsOfWorkId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Master/getUnitsOfWorkById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newUnitOfWork = res.data.Data;
				$scope.newUnitOfWork.Mode = 'Modify';
				$('#custom-tabs-four-profile-tab').tab('show');
 

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelUnitOfWorkById = function (refData) {
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
					UnitsOfWorkId: refData.UnitsOfWorkId
				};
				$http({
					method: 'POST',
					url: base_url + "HR/Master/DeleteUnitsOfWorkById",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllUnitOfWorkList();
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