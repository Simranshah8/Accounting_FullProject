app.controller('NewJobCard', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'NewJob Card';


	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();

		$scope.beData =
		{
			TranId: 0,
			JobNo: '',
			EntryDateTime: new Date(),
			JobCardTime: '',
			EngineId: null,
			JobCardForId: null,
			Party: '',
			ServiceType: null,
			JobCardType: null,
			TeamLeaderId: null,
			ServiceEngineerId: null,
			Warranty: false,
			AMC: false,
			RunningHR: '',
			RunningKM: '',
			Complain: '',
			JobTobeAttended: '',
			Remarks: '',
			PartyMobileNo: '',
			DriverMobileNo: '',
			EstimatedTime: '',
			EstimatedCost: 0,
			DateOfSale: new Date(),
			Dealer: '',
			SiteLocation: '',
			EngineNo: '',
			EchSrlNo: '',
			RegdNo: '',
			CustomerType: '',
			LastJobNo: '',
			LastDate: new Date(),
			LastHr: '',
			LastKm: '',
			LastServiceType: '',
			LastComplain: '',
			LastFeedBack: '',
			LastRemarks: '',
			NewJobCardColl: [],
		};


		$scope.AddNewJobCardDet = function (ind) {
			if ($scope.beData.NewJobCardColl) {
				if ($scope.beData.NewJobCardColl.length > ind + 1) {
					$scope.beData.NewJobCardColl.splice(ind + 1, 0, {
						Complain: ''
					})
				} else {
					$scope.beData.NewJobCardColl.push({
						Complain: ''
					})
				}
			}
		};

		$scope.delNewJobCardDet = function (ind) {
			if ($scope.beData.NewJobCardColl) {
				if ($scope.beData.NewJobCardColl.length > 1) {
					$scope.beData.NewJobCardColl.splice(ind, 1);
				}
			}
		};

		$scope.beData.NewJobCardColl.push({});
	}

	$scope.ClearNewJobCard = function () {
		$scope.beData =
		{
			TranId: 0,
			JobNo: '',
			EntryDateTime: new Date(),
			JobCardTime: '',
			EngineId: null,
			JobCardForId: null,
			Party: '',
			ServiceType: null,
			JobCardType: null,
			TeamLeaderId: null,
			ServiceEngineerId: null,
			Warranty: false,
			AMC: false,
			RunningHR: '',
			RunningKM: '',
			Complain: '',
			JobTobeAttended: '',
			Remarks: '',
			PartyMobileNo: '',
			DriverMobileNo: '',
			EstimatedTime: '',
			EstimatedCost: 0,
			DateOfSale: new Date(),
			Dealer: '',
			SiteLocation: '',
			EngineNo: '',
			EchSrlNo: '',
			RegdNo: '',
			CustomerType: '',
			LastJobNo: '',
			LastDate: new Date(),
			LastHr: '',
			LastKm: '',
			LastServiceType: '',
			LastComplain: '',
			LastFeedBack: '',
			LastRemarks: '',
			NewJobCardColl: [],
		};
		$scope.beData.NewJobCardColl.push({});
	}


	$scope.IsValidNewJobCard  = function () {
		if ($scope.beData.JobNo.isEmpty()) {
			Swal.fire('Please ! Enter JobNo');
			return false;
		}
		return true;
	}

	$scope.AddNewJobCard = function () {
		if ($scope.IsValidNewJobCard() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.beData.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					if (result.isConfirmed) {
						$scope.CallSaveUpdateNewJobCard();
					}
				});
			} else
				$scope.CallSaveUpdateNewJobCard();
		}
	};

	$scope.CallSaveUpdateNewJobCard = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Setup/JobCard/SaveJobCard",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.beData }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearVehicleEntry();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}


});