
app.controller('SupportNoticeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'SupportNotice';
	OnClickDefault();


	function OnClickDefault() {

		document.getElementById('SupportNotice-details').style.display = "none";

		document.getElementById('SupportNotice').onclick = function () {
			document.getElementById('SupportNotice-details').style.display = "block";
			document.getElementById('SupportNotice-list').style.display = "none";

		}

		document.getElementById('back-to-list').onclick = function () {
			document.getElementById('SupportNotice-list').style.display = "block";
			document.getElementById('SupportNotice-details').style.display = "none";
		}

	};



	//************************* SupportNotice *********************************

	$scope.SaveUpdateSupportNotice = function () {
		if ($scope.IsValidSupportNotice() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newSupportNotice.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateSupportNotice();
					}
				});
			} else
				$scope.CallSaveUpdateSupportNotice();

		}
	};

	$scope.CallSaveUpdateSupportNotice = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "SupportNotice/Creation/SaveSupportNotice",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newSupportNotice }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearSupportNotice();
				$scope.GetAllSupportNoticeList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllSupportNoticeList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.SupportNoticeList = [];

		$http({
			method: 'POST',
			url: base_url + "SupportNotice/Creation/GetAllSupportNoticeList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.SupportNoticeList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	};

	$scope.GetSupportNoticeById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			SupportNoticeId: refData.SupportNoticeId
		};

		$http({
			method: 'POST',
			url: base_url + "SupportNotice/Creation/GetSupportNoticeById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newSupportNotice = res.data.Data;
				$scope.newSupportNotice.Mode = 'Modify';
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});