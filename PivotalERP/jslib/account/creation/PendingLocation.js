app.controller('pendingLocationController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Pending Location For Approval';

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

	$scope.GetPendingLocation = function () {

		$scope.PendingLocationColl = [];
		 
		$scope.loadingstatus = 'running';
		showPleaseWait();
		 
		var para = {
			procName: 'U_GetPendingLocationForApproved',
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

	 
	$scope.PostModal = function (obj,ind) {
		    

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
					LedgerId:obj.LedgerId,
					Remarks: obj.Remarks, 
				};


				$http({
					method: 'POST',
					url: base_url + "Account/Creation/ApprovedCustomerLocation",
					dataType: "json",
					data: JSON.stringify(data)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess)
					{
						$scope.PendingLocationColl.splice(ind, 1);
						//$scope.GetPendingLocation();
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
			title: 'Do you want to approved all pending location ? ',
			showCancelButton: true,
			confirmButtonText: 'Post',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();
				 

				$http({
					method: 'POST',
					url: base_url + "Account/Creation/ApprovedAllCustomerLocation",
					dataType: "json", 
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