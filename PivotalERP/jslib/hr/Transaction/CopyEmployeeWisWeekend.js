app.controller('CopyEmployeeWeekendController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Copy Employee Wise Weekend';

	$scope.LoadData = function () {
		$('.select2').select2();

		$scope.MonthList = GlobalServices.getMonthList();
		$scope.YearList = GlobalServices.getYearList();



		$scope.newFilter = {
			FromYearId: null,
			FromMonthId: null,
			ToYearId: null,
			ToMonthId: null
		};

	}


	$scope.CopyEmpWiseWeekend = function () {

		if ($scope.newFilter.FromYearId && $scope.newFilter.FromMonthId && $scope.newFilter.ToYearId && $scope.newFilter.ToMonthId) {
			Swal.fire({
				title: 'Do you want to Copy Employee Wise Weekend of selected Year and Month ?',
				showCancelButton: true,
				confirmButtonText: 'Copy',
			}).then((result) => {
				/* Read more about isConfirmed, isDenied below */
				if (result.isConfirmed) {
					$scope.loadingstatus = "running";
					showPleaseWait();
					var para = {
						FromYearId: $scope.newFilter.FromYearId,
						FromMonthId: $scope.newFilter.FromMonthId,
						ToYearId: $scope.newFilter.ToYearId,
						ToMonthId: $scope.newFilter.ToMonthId
					};
					$http({
						method: 'POST',
						url: base_url + "HR/Transaction/CopyEmpWiseWeekend",
						dataType: "json",
						data: JSON.stringify(para)
					}).then(function (res) {
						hidePleaseWait();
						$scope.loadingstatus = "stop";
						Swal.fire(res.data.ResponseMSG);

					}, function (reason) {
						Swal.fire('Failed' + reason);
					});
				}
			});
		}
	};

	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};
});