app.controller('AccountStatementController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'AccountbStatement';	
	$scope.LoadData = function () {
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.currentPages = {
			AccountStatement: 1,

		};

		$scope.searchData = {
			AccountStatement: '',

		};

		$scope.perPage = {
			AccountStatement: GlobalServices.getPerPageRow(),

		};

		$scope.newAccountStatement = {
			AccountStatementId: null,
			Title: '',
			Description: '',
			Image: '',
			OrderNo: 0,
			Mode: 'Save'
		};

		/*	$scope.GetAllAccountStatementList();*/

	}



	$scope.GetAllAccountStatementList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.AccountStatementList = [];

		$http({
			method: 'POST',
			url: base_url + "Support/Creation/GetAllAccountStatementList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AccountStatementList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}



});