app.controller('dashboardController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'AccountbStatement';
	$scope.LoadData = function () {
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.currentPages = {
			SupportExecutive: 1,
		};

		$scope.searchData = {
			SupportExecutive: '',
		};

		$scope.perPage = {
			SupportExecutive: GlobalServices.getPerPageRow(),

		};

		$scope.GetDashboard();

	}

	$scope.GetDashboard = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.dashB = {}

		$http({
			method: 'POST',
			url: base_url + "Support/Creation/GetDashboard",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.dashB = res.data.Data;
				$scope.SE = $scope.dashB.Executive;
				$timeout(function () {
					$scope.MonthlySummary();
				});

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.MonthlySummary = function () {

		var lbls = [];
		var opentickets = [];
		var holdtickets = [];
		var closetickets = [];

		//Added By Suresh
		var inprogresstickets = [];

		angular.forEach($scope.dashB.MonthlyTicketSumm, function (mt) {
			lbls.push(mt.Name);
			opentickets.push(mt.OpenT);
			holdtickets.push(mt.HoldT);
			closetickets.push(mt.ClosedT);
			//Added By Suresh
			inprogresstickets.push(mt.InprogressT);
		});


		var ctx = document.getElementById('barChart').getContext('2d');
		var barChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: lbls,
				datasets: [{
					label: 'Open',
					data: opentickets,
					backgroundColor: '#d65653',
				},
				{
					label: 'Hold',
					data: holdtickets,
					backgroundColor: '#ff98009e',
				},
				{
					label: 'Closed',
					data: closetickets,
					backgroundColor: '#76be4e',
				},
				//Added By Suresh
				{
					label: 'InProgress',
					data: inprogresstickets,
					backgroundColor: '#5cafd7',
				},
					//Ends
				]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true
						}
					}]
				}
			}
		});
	}

});