app.controller('FinancialPeriodController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'FinancialPeriod';

	OnClickDefault();

	$scope.LoadData = function () {

		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();


		$scope.currentPages = {
			FinancialPeriod: 1,

		};

		$scope.searchData = {
			FinancialPeriod: '',

		};

		$scope.perPage = {
			FinancialPeriod: GlobalServices.getPerPageRow(),

		};

		$scope.newFinancialPeriod = {
			PeriodId: null,
			Name: '',
			StartDate_TMP: '',
			EndDate_TMP: '',
			Mode: 'Save'
		};


		$scope.GetAllFinancialPeriodList();

	}

	function OnClickDefault() {

		document.getElementById('fp-form').style.display = "none";

		//FinancialPeriod section
		document.getElementById('add-fp').onclick = function () {
			document.getElementById('fp-section').style.display = "none";
			document.getElementById('fp-form').style.display = "block";
			$scope.ClearFinancialPeriod();
		}

		document.getElementById('back-to-list-fp').onclick = function () {
			document.getElementById('fp-form').style.display = "none";
			document.getElementById('fp-section').style.display = "block";
			$scope.ClearFinancialPeriod();
		}

	}

	$scope.ClearFinancialPeriod = function () {

		$timeout(function () {
			$scope.newFinancialPeriod = {
				PeriodId: null,
				Name: '',
				StartDate_TMP: null,
				EndDate_TMP: null,
				Mode: 'Save'
			};
		});
		

	}

	//*************************FinancialPeriod *********************************

	$scope.IsValidFinancialPeriod = function () {
		if ($scope.newFinancialPeriod.Name.isEmpty()) {
			Swal.fire('Please ! Enter FinancialPeriod Name');
			return false;
		}


		return true;
	}

	$scope.SaveUpdateFinancialPeriod = function () {
		if ($scope.IsValidFinancialPeriod() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newFinancialPeriod.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateFinancialPeriod();
					}
				});
			} else
				$scope.CallSaveUpdateFinancialPeriod();

		}
	};

	$scope.CallSaveUpdateFinancialPeriod = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.newFinancialPeriod.StartDate_TMP)
			$scope.newFinancialPeriod.StartDate_AD = $filter('date')(new Date($scope.newFinancialPeriod.StartDateDet.dateAD), 'yyyy-MM-dd');
		else
			$scope.newFinancialPeriod.StartDate_AD = null;

		if ($scope.newFinancialPeriod.EndDate_TMP)
			$scope.newFinancialPeriod.EndDate_AD = $filter('date')(new Date($scope.newFinancialPeriod.EndDateDet.dateAD), 'yyyy-MM-dd');
		else
			$scope.newFinancialPeriod.EndDate_AD = null;

		$http({
			method: 'POST',
			url: base_url + "Attendance/Creation/SaveFinancialPeriod",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newFinancialPeriod }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearFinancialPeriod();
				$scope.GetAllFinancialPeriodList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllFinancialPeriodList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.FinancialPeriodList = [];

		$http({
			method: 'POST',
			url: base_url + "Attendance/Creation/GetAllFinancialPeriodList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.FinancialPeriodList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetFinancialPeriodById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			PeriodId: refData.PeriodId
		};

		$http({
			method: 'POST',
			url: base_url + "Attendance/Creation/GetFinancialPeriodById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newFinancialPeriod = res.data.Data;
				$scope.newFinancialPeriod.Mode = 'Modify';

				if ($scope.newFinancialPeriod.StartDate_AD)
					$scope.newFinancialPeriod.StartDate_TMP = new Date($scope.newFinancialPeriod.StartDate_AD);

				if ($scope.newFinancialPeriod.EndDate_AD)
					$scope.newFinancialPeriod.EndDate_TMP = new Date($scope.newFinancialPeriod.EndDate_AD);

				document.getElementById('fp-section').style.display = "none";
				document.getElementById('fp-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelFinancialPeriodById = function (refData) {

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
					PeriodId: refData.PeriodId
				};

				$http({
					method: 'POST',
					url: base_url + "Attendance/Creation/DelFinancialPeriod",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllFinancialPeriodList();
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