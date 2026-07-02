app.controller('pendingCustomerController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Pending Customer For Approval';

	var gSrv = GlobalServices;

	$scope.LoadData = function () {
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.currentPages = {
			Attendance: 1,
		};

		$scope.searchData = {
			Attendance: '',
		};

		$scope.perPage = {
			Attendance: GlobalServices.getPerPageRow(),
		};

		$scope.newDailyAttendance = {
			ForDate_TMP: new Date(),
		};
		$scope.AttendanceColl = [];

		$scope.GetPendingLocation();
	}

	$scope.SelecteAllData = function (val) {
		if ($scope.PendingLocationColl) {
			$scope.PendingLocationColl.forEach(function (pl) {
				pl.IsSelected = val;
			});
		}
	}

	$scope.GetPendingLocation = function () {

		$scope.PendingLocationColl = [];
		 
		$scope.loadingstatus = 'running';
		showPleaseWait();
		 
		var para = {
			procName: 'U_GetPendingCustomerForApproved',
			qry: '',
			asParentChild: false,
			tblNames: '',
			colRelations: '',
			paraColl: null,
		}

		$http({
			method: "post",
			url: base_url + "Global/GetCustomData",
			data: JSON.stringify(para),
			dataType: "json"
		}).then(function (res) {

			$scope.loadingstatus = 'done';
			hidePleaseWait();
			if (res.data.IsSuccess == true) {
				$scope.PendingLocationColl = res.data.Data;
				$scope.PendingLocationColl.forEach(function (pl) {
					pl.TranId = pl.CustomerId;
				});
			} else if (res.data.IsSuccess != undefined) {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (errormessage) {

			$scope.loadingstatus = 'stop';

			alert('Unable to Store data. pls try again.' + errormessage.responseText);
		});

	};
	 
	$scope.ShowPersonalImg = function (path) {
		$scope.viewImg = {};
		if (path) {
			$scope.viewImg = {
				ContentPath: path
			}
			$('#PersonalImg').modal('show');
		} else
			Swal.fire('No Image Found');

	};

	 
	$scope.PostModal = function (obj) {
		    

		Swal.fire({
			title: 'Do you want to approved the selected location of (' + obj.Name + ') :- ' + obj.Location + ' ? ',
			showCancelButton: true,
			confirmButtonText: 'Post',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();
				  
				var data={
					TranId: obj.TranId,
					Remarks: obj.Remarks, 
				};


				$http({
					method: 'POST',
					url: base_url + "Account/Creation/ApprovedCustomer",
					dataType: "json",
					data: JSON.stringify(data)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetPendingLocation();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	}


	$scope.ApprovedAll = function () {


		Swal.fire({
			title: 'Do you want to approved all pending customer ? ',
			showCancelButton: true,
			confirmButtonText: 'Post',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();

				var dataColl = [];
				angular.forEach($scope.PendingLocationColl, function (pl) {
					var newData = {
						TranId: pl.TranId,
						Remarks: pl.Remarks,
					};
					dataColl.push(newData);
				});
				$http({
					method: 'POST',
					url: base_url + "Account/Creation/ApprovedAllCustomer",
					dataType: "json",
					data:JSON.stringify(dataColl)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetPendingLocation();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	}

	$scope.DeActiveSelectedAll = function () {

		Swal.fire({
			title: 'Do you want to deactive all selected customer ? ',
			showCancelButton: true,
			confirmButtonText: 'Post',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();

				var dataColl = [];
				angular.forEach($scope.PendingLocationColl, function (pl) {
					var newData = {
						TranId: pl.TranId,
						Remarks: pl.Remarks,
					};
					dataColl.push(newData);
				});
				$http({
					method: 'POST',
					url: base_url + "Account/Creation/DeActiveSelectedCustomer",
					dataType: "json",
					data: JSON.stringify(dataColl)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetPendingLocation();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	}
});