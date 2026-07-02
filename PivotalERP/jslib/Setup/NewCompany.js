
app.controller('newCompanyDetailsController', function ($scope, $http, $timeout, $filter, GlobalServices) {

	$scope.Title = 'Company Details';


	$scope.LoadData = function () {

		$scope.DefaultPhoto = '/wwwroot/dynamic/images/avatar-img.jpg';

		$timeout(function () {
			$scope.MaintainColl = [];

			$http({
				method: 'GET',
				url: base_url + "Global/GetMainTainTypes",
				dataType: "json"
			}).then(function (res) {
				if (res.data.IsSuccess && res.data.Data) {
					$scope.MaintainColl = res.data.Data;
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		});


		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.newCompanyDetails = {
			CompanyDetailsId: null,
			Name: '',
			MailingName:'',
			City:'',
			DisplayName: '',
			Address: '',
			District: '',
			State: '',
			Zone: '',
			Country: '',
			ZipCode: '',
			RegdNo: '',
			PanVatNo: '',

			Photo: null,
			PhotoPath: '',
			CompanyLogoPath:'',
			PhoneNo1: '',
			PhoneNo2: '',
			FaxNo: '',
			EmailId: '',
			Website: '',
			Maintain: 0,
			IsSymbolSuffixedToAmount:true,
			Mode: 'Save'
		};
		 

	}

	$scope.IsValidCompanyDetails = function () {
		if ($scope.newCompanyDetails.Name.isEmpty()) {
			Swal.fire('Please ! Enter Company Name');
			return false;
		}

		if (!$scope.newCompanyDetails.StartDateDet) {
			Swal.fire('Please ! Enter Start Date');
			return false;
		}

		if (!$scope.newCompanyDetails.EndDateDet) {
			Swal.fire('Please ! Enter End Date');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateCompanyDetails = function () {
		if ($scope.IsValidCompanyDetails() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newCompanyDetails.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateCompanyDetails();
					}
				});
			} else
				$scope.CallSaveUpdateCompanyDetails();

		}
	};

	$scope.CallSaveUpdateCompanyDetails = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var logo = $scope.newCompanyDetails.CompanyLogo_TMP;

		$scope.newCompanyDetails.StartDate = $filter('date')(new Date($scope.newCompanyDetails.StartDateDet.dateAD), 'yyyy-MM-dd');
		$scope.newCompanyDetails.EndDate = $filter('date')(new Date($scope.newCompanyDetails.EndDateDet.dateAD), 'yyyy-MM-dd');

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SaveNewCompanyDet",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				if (data.logoFile && data.logoFile.length > 0)
					formData.append("logo", data.logoFile[0]);

				return formData;
			},
			data: { jsonData: $scope.newCompanyDetails, logoFile: logo }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});


	}
	  

});