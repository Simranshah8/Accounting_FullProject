app.controller('WorkingShiftController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Working Shft';
	LoadData();

	function LoadData() {
        $('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.currentPages = {
			Create: 1,
		};

		$scope.searchData = {
			Create: '',
		};

		$scope.perPage = {
			Create: GlobalServices.getPerPageRow(),
		};
		$scope.ArrivalCutColl = [
			{ id: 1, text: 'None' },
			{ id: 2, text: 'Cut Half Day' },
			{ id: 3, text: 'Cut Full Day' }

		]
		$scope.OTCalculationList = GlobalServices.GetOtCalculation();
		$scope.FirstWeeklyOffList = GlobalServices.GetWeeklyoff();
		$scope.SecondWeeklyOffTypeList = GlobalServices.GetWeeklyoffType();
		$scope.SinglePunchPolicyList = GlobalServices.GetSinglePunchPolicy();

		$scope.newWorkingShift =
		{
			Name: '',
			Code: null,
			OnDutyTime: '',
			OffDutyTime: '',
			ShiftDuration: 0,
			IsDefault: true,
			EnableTwoShiftInADay: false,
			Break1: false,
			Break1StartTime: '',
			Break1EndTime: '',
			Break1Duration: 0,
			Break2: false,
			Break2StartTime: '',
			Break2EndTime: '',
			Break2Duration: 0,
			HalfDay: false,
			HalfDayStartTime: '',
			HalfDayEndTime: '',
			HalfDayDuration: 0,
			FirstWeeklyOff: null,
			SecondWeeklyOff: null,
			SecondWeeklyOffType: null,
			RemoveDuplicatePunch: 0,
			SinglePunchPolicy: null,
			MaxEarlyMinutesAllow: 0,
			MaxOTAllow: 0,
			NoofPresentforWeeklyOff: 0,
			WAWAbsent: false,
			LWLAbsent: false,
			OTCalculation: 4,

			PermittedLateArrival: null,
			PermittedEarlyDeparture: null,
			HalfDayLessThanHr: null,
			AbsentiLessThanHr: null,
			LateArrival: null,
			LateArrivalCut: null,
			EarlyDeparture: null,
			EarlyDepartureCut: null,
			LateIncoming: false,
			NoOfLateInAMonth: null,
			CutDays: null,
			IgnoreOTDLessthan: null,

			Mode: 'Save'
		};
	}

	$scope.ClearCreate = function () {
		$scope.newWorkingShift = {
			Name: '',
			Code: null,
			OnDutyTime: '',
			OffDutyTime: '',
			ShiftDuration: 0,
			EnableTwoShiftInADay: false,
			Break1: false,
			Break1StartTime: '',
			Break1EndTime: '',
			Break1Duration: 0,
			Break2: false,
			Break2StartTime: '',
			Break2EndTime: '',
			Break2Duration: 0,
			HalfDay: false,
			HalfDayStartTime: '',
			HalfDayEndTime: '',
			HalfDayDuration: 0,
			FirstWeeklyOff: null,
			SecondWeeklyOff: null,
			SecondWeeklyOffType: null,
			RemoveDuplicatePunch: 0,
			SinglePunchPolicy: null,
			MaxEarlyMinutesAllow: 0,
			MaxOTAllow: 0,
			NoofPresentforWeeklyOff: 0,
			WAWAbsent: false,
			LWLAbsent: false,
			OTCalculation: 4,

			PermittedLateArrival: null,
			PermittedEarlyDeparture: null,
			HalfDayLessThanHr: null,
			AbsentiLessThanHr: null,
			LateArrival: null,
			LateArrivalCut: null,
			EarlyDeparture: null,
			EarlyDepartureCut: null,
			LateIncoming: false,
			NoOfLateInAMonth: null,
			CutDays: null,
			IgnoreOTDLessthan: null,

			Mode: 'Save'
		};
	}

	$scope.CalculateDuration = function () {

		$scope.newWorkingShift.ShiftDuration = 0;

		$scope.newWorkingShift.Break1Duration = 0;
		$scope.newWorkingShift.Break2Duration = 0;
		$scope.newWorkingShift.HalfDayDuration = 0;

		if ($scope.newWorkingShift.OnDutyTime && $scope.newWorkingShift.OffDutyTime) {
			$scope.newWorkingShift.ShiftDuration = moment($scope.newWorkingShift.OffDutyTime).diff(moment($scope.newWorkingShift.OnDutyTime), "minutes");
		}

		if ($scope.newWorkingShift.Break1EndTime && $scope.newWorkingShift.Break1StartTime) {
			$scope.newWorkingShift.Break1Duration = moment($scope.newWorkingShift.Break1EndTime).diff(moment($scope.newWorkingShift.Break1StartTime), "minutes");
		}

		if ($scope.newWorkingShift.Break2EndTime && $scope.newWorkingShift.Break2StartTime) {
			$scope.newWorkingShift.Break2Duration = moment($scope.newWorkingShift.Break2EndTime).diff(moment($scope.newWorkingShift.Break2StartTime), "minutes");
		}

		if ($scope.newWorkingShift.HalfDayEndTime && $scope.newWorkingShift.HalfDayStartTime) {
			$scope.newWorkingShift.HalfDayDuration = moment($scope.newWorkingShift.HalfDayEndTime).diff(moment($scope.newWorkingShift.HalfDayStartTime), "minutes");
		}

	}

	//*************************Create Shift *********************************
	$scope.IsValidCreate = function () {
		if ($scope.newWorkingShift.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateCreate = function () {
		if ($scope.IsValidCreate() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newCreate.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateCreate();
					}
				});
			} else
				$scope.CallSaveUpdateCreate();
		}
	};

	$scope.CallSaveUpdateCreate = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.newWorkingShift.OnDutyTime)
			$scope.newWorkingShift.OnDutyTime = $filter('date')($scope.newWorkingShift.OnDutyTime, 'yyyy-MM-dd HH:mm');

		if ($scope.newWorkingShift.OffDutyTime)
			$scope.newWorkingShift.OffDutyTime = $filter('date')($scope.newWorkingShift.OffDutyTime, 'yyyy-MM-dd HH:mm');

		if ($scope.newWorkingShift.Break1StartTime)
			$scope.newWorkingShift.Break1StartTime = $filter('date')($scope.newWorkingShift.Break1StartTime, 'yyyy-MM-dd HH:mm');

		if ($scope.newWorkingShift.Break1EndTime)
			$scope.newWorkingShift.Break1EndTime = $filter('date')($scope.newWorkingShift.Break1EndTime, 'yyyy-MM-dd HH:mm');

		if ($scope.newWorkingShift.Break2StartTime)
			$scope.newWorkingShift.Break2StartTime = $filter('date')($scope.newWorkingShift.Break2StartTime, 'yyyy-MM-dd HH:mm');

		if ($scope.newWorkingShift.Break2EndTime)
			$scope.newWorkingShift.Break2EndTime = $filter('date')($scope.newWorkingShift.Break2EndTime, 'yyyy-MM-dd HH:mm');

		if ($scope.newWorkingShift.HalfDayStartTime)
			$scope.newWorkingShift.HalfDayStartTime = $filter('date')($scope.newWorkingShift.HalfDayStartTime, 'yyyy-MM-dd HH:mm');

		if ($scope.newWorkingShift.HalfDayEndTime)
			$scope.newWorkingShift.HalfDayEndTime = $filter('date')($scope.newWorkingShift.HalfDayEndTime, 'yyyy-MM-dd HH:mm');
		if ($scope.newWorkingShift.AbsentNoticeTime)
			$scope.newWorkingShift.AbsentNoticeTime = $filter('date')($scope.newWorkingShift.AbsentNoticeTime, 'yyyy-MM-dd HH:mm');


		$http({
			method: 'POST',
			url: base_url + "HR/Master/SaveWorkingShift",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newWorkingShift }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$timeout(function () {
					$scope.ClearCreate();
				});
				$timeout(function () {
					$scope.GetAllCreateList();
				});
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllCreateList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.WorkingShiftList = [];
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetAllWorkingShift",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.WorkingShiftList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetCreateById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			WorkingShiftId: refData.WorkingShiftId
		};

		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetWorkingShiftById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				var rData = res.data.Data;
				$scope.newWorkingShift = rData;
				$scope.newWorkingShift.Mode = 'Modify';

				if ($scope.newWorkingShift.OnDutyTime)
					$scope.newWorkingShift.OnDutyTime = new Date(rData.OnDutyTime);

				if ($scope.newWorkingShift.OffDutyTime)
					$scope.newWorkingShift.OffDutyTime = new Date(rData.OffDutyTime);

				if ($scope.newWorkingShift.Break1StartTime)
					$scope.newWorkingShift.Break1StartTime = new Date(rData.Break1StartTime);

				if ($scope.newWorkingShift.Break1EndTime)
					$scope.newWorkingShift.Break1EndTime = new Date(rData.Break1EndTime);

				if ($scope.newWorkingShift.Break2StartTime)
					$scope.newWorkingShift.Break2StartTime = new Date(rData.Break2StartTime);

				if ($scope.newWorkingShift.Break2EndTime)
					$scope.newWorkingShift.Break2EndTime = new Date(rData.Break2EndTime);

				if ($scope.newWorkingShift.HalfDayStartTime)
					$scope.newWorkingShift.HalfDayStartTime = new Date(rData.HalfDayStartTime);

				if ($scope.newWorkingShift.HalfDayEndTime)
					$scope.newWorkingShift.HalfDayEndTime = new Date(rData.HalfDayEndTime);

				if ($scope.newWorkingShift.AbsentNoticeTime)
					$scope.newWorkingShift.AbsentNoticeTime = new Date(rData.AbsentNoticeTime);

				$('#profile-tab').tab('show');

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelCreateById = function (refData) {
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
					WorkingShiftId: refData.WorkingShiftId
				};
				$http({
					method: 'POST',
					url: base_url + "HR/Master/DelWorkingShift",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllCreateList();
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