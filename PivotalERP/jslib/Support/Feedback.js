app.controller('FeedbackController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'AccountbStatement';
	$scope.LoadData = function () {
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.currentPages = {
			Feedback: 1,
		};

		$scope.searchData = {
			Feedback: '',
		};

		$scope.perPage = {
			Feedback: GlobalServices.getPerPageRow(),
		};

		$scope.newFeedback = {
			FeedbackId: null,
			Title: '',
			Description: '',
			Image: '',
			OrderNo: 0,
			Mode: 'Save'
		};
		/*	$scope.GetAllFeedbackList();*/
	}

	$scope.GetAllFeedbackList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.FeedbackList = [];
		$http({
			method: 'POST',
			url: base_url + "Support/Creation/GetAllFeedbackList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.FeedbackList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}
});