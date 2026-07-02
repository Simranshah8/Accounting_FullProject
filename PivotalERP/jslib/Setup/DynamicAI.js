

app.controller('DynamicAIController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'AI';
 
	$scope.queryResults = []; // stores ALL query results

	$scope.LoadData = function () {

		$scope.QueryTypes = [{ id: 1, text: 'Inventory' }, { id: 2, text: 'Account' }];
		$scope.newFilter = {
			qry: '',
			queryType: 1
		};

	}

	$scope.getSearchResult = function () {

		if ($scope.newFilter.qry && $scope.newFilter.qry.length > 0) {

			$scope.loadingstatus = "running";
			showPleaseWait();

			var para = {
                qry: $scope.newFilter.qry,
				queryType: $scope.newFilter.queryType
			}
			$http({
				method: 'POST',
				url: base_url + "Setup/ReportWriter/getSearchResult",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess==true && res.data.Data) {
					var result =res.data.Data;

					$scope.queryResults.push({
                        qry: $scope.search,
						time: new Date(),
						data: angular.copy(result)
					});
					 

				} else {
					Swal.fire(res.data.ResponseMSG);
				}

			}, function (reason) {
				Swal.fire('Failed' + reason);
			});

		}
	}
});