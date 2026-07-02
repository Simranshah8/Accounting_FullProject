app.controller('monthlyTaskController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Create Domain';
	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.ShowPageVal = false;
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		var range = [];
		for (var i = 1; i < 33; i++) {
			range.push(i);
		}
		$scope.dayRange = range;

		$scope.YearColl = [{ id: 2081, text: '2081' }, { id: 2082, text: '2082' }, { id: 2083, text: '2083' }];
		$scope.MonthColl = [];
		var m = 1;
		bsMonths.forEach(function (mn) {
			$scope.MonthColl.push({
				id: m,
				text:mn
			});
			m++;
		});
		 
		$scope.searchData = {
			Monthly: '',		  
		};

		$scope.perPage = {
			Monthly: GlobalServices.getPerPageRow(),			 
		};

		$scope.currentPages = {
			Monthly: 1,			 
		};
		
		$scope.newFilter = {
			YearId: 0,
			MonthId:0		 
		};

		 
	}

	 
	$scope.GetTaskSummary = function () {

		$scope.loadingstatus = 'running';
		showPleaseWait();


		var para = {
			YearId: $scope.newFilter.YearId,
			MonthId: $scope.newFilter.MonthId,			
		};

		$scope.Total = {};


		$scope.DataColl = [];
		$http({
			method: 'POST',
			url: base_url + "Task/Creation/GetMonthlyTask",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DataColl = res.data.Data;

				$scope.DataColl.forEach(function (dc) {

					dc.TotalP = 0;
					$scope.Total.TotalDays = dc.TotalDays;
					for (var d = 1; d < 33; d++) {
						var vName = 'Day' + d;
						 
						if (dc[vName] == 'P') {
							$scope.Total[vName] = isEmptyNum($scope.Total[vName]) + 1;
							dc.TotalP = dc.TotalP + 1;
						}
					}

					$scope.Total.TotalTask = isEmptyNum($scope.Total.TotalTask)+dc.TotalTask;
					$scope.Total.Open = isEmptyNum($scope.Total.Open)+dc.Open;
					$scope.Total.InProgress = isEmptyNum($scope.Total.InProgress)+dc.InProgress;
					$scope.Total.OnHold = isEmptyNum($scope.Total.OnHold)+dc.OnHold;
					$scope.Total.Closed = isEmptyNum($scope.Total.Closed)+dc.Closed;
					$scope.Total.Approved = isEmptyNum( $scope.Total.Approved)+dc.Approved;
				});
				
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	};

	$scope.CurDay = {};
	$scope.OpenDetailModal = function (curRow,dayId)
	{
		curRow.DayId = dayId;
		$scope.CurDay = curRow;
		$scope.DayTaskColl = [];
		var para = {
			YearId: curRow.YearId,
			MonthId: curRow.MonthId,
			DayId: dayId,
			EmployeeId: curRow.EmployeeId,
			ForUserId:curRow.UserId
        }
		$http({
			method: 'POST',
			url: base_url + "Task/Creation/GetDayTask",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DayTaskColl = res.data.Data;
				$("#display-task-modal").modal('show');
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		
	}

});