app.controller('EmailSetupController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'EmailSetup';

	$scope.LoadData = function () {
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.ScheduleTypeColl = [{ id: 1, text: 'One Time' }, { id: 2, text: 'Recurring' }];
		$scope.OccuranceColl = [{ id: 1, text: 'Daily' }, { id: 2, text: 'Weekly' }, { id: 3, text: 'Monthly' }];
		$scope.WeekNumberingColl = [{ id: 1, text: 'First' }, { id: 2, text: 'Second' }, { id: 3, text: 'Third' }, { id: 4, text: 'Fourth' }, { id: 5, text: 'Last' }];
		$scope.DaysColl = [{ id: 1, text: 'Sunday' }, { id: 2, text: 'Monday' }, { id: 3, text: 'Tuesday' }, { id: 4, text: 'Wednesday' }, { id: 5, text: 'Thursday' }, { id: 6, text: 'Friday' }, { id: 7, text: 'Saturday' }, { id: 7, text: 'Day' }, { id: 8, text: 'WeekDay' }, { id: 9, text: 'Weekend Day' }];
		$scope.currentPages = {
			EmailSetup: 1,
		};

		$scope.searchData = {
			EmailSetup: '',
		};

		$scope.perPage = {
			EmailSetup: GlobalServices.getPerPageRow(),
		};

		$scope.newDet = {
			TranId: null,
			ScheduleName: '',
			Enabled: true,
			OnetimeDate: new Date(),
			ScheduleTypeId: 1,
			OneTime_Time:'',
			OccuranceId: 1,
			WeekNumberingId: 1,
			DaysId:1,
			Mode: 'OK'
		};


		/*$scope.GetAllEmailSetup();*/
	}

	


	$scope.ClearEmailSetup = function () {
		$scope.newDet = {
			TranId: null,
			ScheduleName:'',
			Enabled: true,
			OnetimeDate: new Date(),
			ScheduleTypeId: 1,
			OneTime_Time: '',
			OccuranceId: 1,
			WeekNumberingId: 1,
			DaysId: 1,
			Mode: 'Ok'
		};
		
	}

	//************************* EmailSetup *********************************
	$scope.IsValidEmailSetup = function () {
		if ($scope.newDet.ScheduleName.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateEmailSetup = function () {
		if ($scope.IsValidEmailSetup() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newDet.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateEmailSetup();
					}
				});
			} else
				$scope.CallSaveUpdateEmailSetup();
		}
	};

	$scope.CallSaveUpdateEmailSetup = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Master/Creation/SaveEmailSetup",
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
				$scope.ClearEmailSetup();
				$scope.GetAllEmailSetup();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllEmailSetup = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.EmailSetupList = [];
		$http({
			method: 'GET',
			url: base_url + "Master/Creation/GetAllEmailSetup",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EmailSetupList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetEmailSetupById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			EmailSetupId: refData.EmailSetupId
		};
		$http({
			method: 'POST',
			url: base_url + "Master/Creation/GetEmailSetupById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newDet = res.data.Data;
				$scope.newDet.Mode = 'Modify';

				document.getElementById('EmailSetup-section').style.display = "none";
				document.getElementById('EmailSetup-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelEmailSetupById = function (refData) {
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
					EmailSetupId: refData.EmailSetupId
				};
				$http({
					method: 'POST',
					url: base_url + "Master/Creation/DeleteEmailSetup",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllEmailSetup();
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