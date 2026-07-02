app.controller('paymentGatewayController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Payment Gateway';

	OnClickDefault();

	$scope.LoadData = function () {

		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();


		$scope.currentPages = {
			PaymentGateway: 1,

		};

		$scope.searchData = {
			PaymentGateway: '',

		};

		$scope.perPage = {
			PaymentGateway: GlobalServices.getPerPageRow(),

		};

		$scope.newPaymentGateway = {
			PeriodId: null,
			Name: '',
			StartDate_TMP: '',
			EndDate_TMP: '',
			Mode: 'Save'
		};

		$scope.GatewayTypesColl = [];
		$http({
			method: 'GET',
			url: base_url + "Global/GetPaymentGateway",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.GatewayTypesColl = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.GetAllPaymentGatewayList();

	}

	function OnClickDefault() {

		document.getElementById('fp-form').style.display = "none";

		//PaymentGateway section
		document.getElementById('add-fp').onclick = function () {
			document.getElementById('fp-section').style.display = "none";
			document.getElementById('fp-form').style.display = "block";
			$scope.ClearPaymentGateway();
		}

		document.getElementById('back-to-list-fp').onclick = function () {
			document.getElementById('fp-form').style.display = "none";
			document.getElementById('fp-section').style.display = "block";
			$scope.ClearPaymentGateway();
		}

	}

	$scope.ClearPaymentGateway = function () {

		$timeout(function () {
			$scope.ClearSliderPhoto();

			$scope.newPaymentGateway = {
				PeriodId: null,
				Name: '',
				StartDate_TMP: null,
				EndDate_TMP: null,
				Mode: 'Save'
			};
		});


	}

	//*************************PaymentGateway *********************************

	$scope.IsValidPaymentGateway = function () {
		//if ($scope.newPaymentGateway.Name.isEmpty()) {
		//	Swal.fire('Please ! Enter PaymentGateway Name');
		//	return false;
		//}


		return true;
	}


	$scope.ClearSliderPhoto = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newPaymentGateway.PhotoData = null;
				$scope.newPaymentGateway.Photo_TMP = [];
				$scope.newPaymentGateway.IconPath = '';
			});

		});
		$('input[type=file]').val('');
		$('#imgPhoto1').attr('src', '');

	};
	$scope.SaveUpdatePaymentGateway = function () {
		if ($scope.IsValidPaymentGateway() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newPaymentGateway.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdatePaymentGateway();
					}
				});
			} else
				$scope.CallSaveUpdatePaymentGateway();

		}
	};

	 
	$scope.CallSaveUpdatePaymentGateway = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
 

		var filesColl = [];

		if ($scope.newPaymentGateway.PhotoData && $scope.newPaymentGateway.PhotoData.length > 0)
			filesColl.push($scope.newPaymentGateway.Photo_TMP[0]);

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SavePaymentGateway",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				if (data.files) {
					for (var i = 0; i < data.files.length; i++) {
						if (data.files[i].File)
							formData.append("file" + i, data.files[i].File);
						else
							formData.append("file" + i, data.files[i]);
					}
				}

				return formData;
			},
			data: { jsonData: $scope.newPaymentGateway, files: filesColl }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearPaymentGateway();
				$scope.GetAllPaymentGatewayList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllPaymentGatewayList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.PaymentGatewayList = [];

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllPaymentGatewayList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.PaymentGatewayList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetPaymentGatewayById = function (refData) {

		$timeout(function () {
			$scope.newPaymentGateway.TranId = refData.TranId;
			$scope.newPaymentGateway.ForGateWay = refData.ForId;
			$scope.newPaymentGateway.PrivateKey = refData.PrivateKey;
			$scope.newPaymentGateway.PublicKey = refData.PublicKey;
			$scope.newPaymentGateway.LedgerId = refData.LedgerId;
			$scope.newPaymentGateway.LedgerName = refData.LedgerName;
			$scope.newPaymentGateway.SchoolId = refData.SchoolId;
			$scope.newPaymentGateway.Name = refData.Name;
			$scope.newPaymentGateway.IconPath = refData.IconPath;
			$scope.newPaymentGateway.Mode = 'Modify';

			document.getElementById('fp-section').style.display = "none";
			document.getElementById('fp-form').style.display = "block";
		});
		
	};

	$scope.DelPaymentGatewayById = function (refData) {

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
					TranId: refData.TranId
				};

				$http({
					method: 'POST',
					url: base_url + "Setup/Security/DelPaymentGateway",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllPaymentGatewayList();
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