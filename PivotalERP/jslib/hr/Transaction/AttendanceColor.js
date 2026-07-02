app.controller('AttendanceColorController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'AttendanceColor';

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();


        $scope.newDet = {
            TranId: null,
            Present: 'P',
            PColor: '',
            PCellColor: '',
            PresentB: 1,
            Absent: 'A',
            AColor: '',
            ACellColor: '',
            AbsentB: 1,
            Leave: 'L',
            LColor: '',
            LCellColor: '',
            LeaveB: 1,
            Weekend: 'WL',
            WColor: '',
            WCellColor: '',
            WeekendB: 1,
            Holiday: 'H',
            HColor: '',
            HCellColor: '',
            HolidayB: 1,
            Mode: 'Save'
        };
        $scope.GetAttendanceColor();
    }


    $scope.ResetAttendanceColor = function () {
		Swal.fire({
			title: 'Would you like to reset the colors?',
			text: 'This will reset all colors to their default values and update the existing record.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes',
			cancelButtonText: 'No',
		}).then((result) => {
			if (result.isConfirmed) {
				// Retain existing `TranId` and other properties
				$scope.newDet.Present = 'P';
				$scope.newDet.Absent = 'A';
				$scope.newDet.Leave = 'L';
				$scope.newDet.Weekend = 'WL';
				$scope.newDet.Holiday = 'H';
				$scope.newDet.PColor = '#005d5a';
				$scope.newDet.AColor = '#72be44';
				$scope.newDet.LColor = '#264167';
				$scope.newDet.WColor = '#f0fbff';
				$scope.newDet.HColor = '#007955';
				$scope.newDet.PCellColor = '#005d5a';
				$scope.newDet.ACellColor = '#72be44';
				$scope.newDet.LCellColor = '#264167';
				$scope.newDet.WCellColor = '#f0fbff';
				$scope.newDet.HCellColor = '#007955';
				$scope.newDet.PresentB = 1;
				$scope.newDet.AbsentB = 1;
				$scope.newDet.LeaveB = 1;
				$scope.newDet.WeekendB = 1;
				$scope.newDet.HolidayB = 1;
				// Ensure `Mode` is 'Update' to avoid creating a new record
				$scope.newDet.Mode = 'Update';

				$scope.$apply(); // Reflect changes in the UI

				// Call save function to update the existing record
				$scope.CallSaveUpdateAttendanceColor();

				Swal.fire('Colors have been reset and updated!', '', 'success');
			} else {
				Swal.fire('Reset canceled', '', 'info');
			}
		});
	};




	//*************************Theme Config *********************************

	$scope.IsValidAttendanceColor = function () {
		//if ($scope.newDet.PrimaryColor.isEmpty()) {
		//	Swal.fire('Please ! Enter PrimaryColor Name');
		//	return false;
		//}

		return true;
	}

	$scope.SaveUpdateAttendanceColor = function () {
		if ($scope.IsValidAttendanceColor() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newDet.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdatePayrollConfig();
					}
				});
			} else
				$scope.CallSaveUpdateAttendanceColor();

		}
	};

	$scope.CallSaveUpdateAttendanceColor = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SaveAttendanceColorConfig",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newDet }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				/*$scope.ClearPayrollConfig();*/
				//$scope.GetAllPayrollConfigList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}


	$scope.GetAttendanceColor = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.newDet = {};

		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/GetAllAttendanceColorConfig",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newDet = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	};


	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});