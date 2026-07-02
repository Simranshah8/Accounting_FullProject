app.controller('SupportExecutiveController', function ($scope, $http, $timeout, $filter, GlobalServices) {
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

		$scope.newSupportExecutive = {
			SupportExecutiveId: null,
			Title: '',
			Description: '',
			Image: '',
			OrderNo: 0,
			Mode: 'Save'
		};

			$scope.GetAllSupportExecutiveList();

	}



	$scope.GetAllSupportExecutiveList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.SupportExecutiveList = [];

		$http({
			method: 'POST',
			url: base_url + "Support/Creation/GetSuppExe",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.SupportExecutive = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}



});