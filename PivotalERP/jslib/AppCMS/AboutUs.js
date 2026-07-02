app.controller('AboutUsController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'About Us';

	

	$scope.LoadData = function () {

		$scope.confirmMSG = GlobalServices.getConfirmMSG();
	
		$scope.newAboutUs = {
			AboutUsId: null,
			Content: '',
			Photo: null,
			PhotoPath: null,
			Mode: 'Save'
		};


		$scope.GetAllAboutUsList();

	}

	$scope.ClearAboutUs = function () {
		$scope.newAboutUs = {
			AboutUsId: null,
			Content:'',
			Photo: null,
			PhotoPath: null,
			Mode: 'Save'
		};
	}

	$scope.ClearAboutUsLogo = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newAboutUs.LogoData = null;
				$scope.newAboutUs.Logo_TMP = [];
			});

		});

		$('#imgLogo').attr('src', '');
		$('#imgLogo1').attr('src', '');

	};

	$scope.ClearAboutUsImage = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newAboutUs.ImageData = null;
				$scope.newAboutUs.Image_TMP = [];
			});

		});


		$('#imgPhoto').attr('src', '');
		$('#imgPhoto1').attr('src', '');

		
	};

	$scope.ClearAboutUsBanner = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newAboutUs.BannerData = null;
				$scope.newAboutUs.Banner_TMP = [];
			});

		});


		$('#imgBanner').attr('src', '');
		$('#imgBanner1').attr('src', '');
	};


	//************************* About us *********************************

	$scope.SaveUpdateAboutUs = function () {
		if ($scope.confirmMSG.Accept == true) {
			var saveModify = $scope.newAboutUs.Mode;
			Swal.fire({
				title: 'Do you want to ' + saveModify + ' the current data?',
				showCancelButton: true,
				confirmButtonText: saveModify,
			}).then((result) => {
				/* Read more about isConfirmed, isDenied below */
				if (result.isConfirmed) {
					$scope.CallSaveUpdateAboutUs();
				}
			});
		} else
			$scope.CallSaveUpdateAboutUs();
	};

	$scope.CallSaveUpdateAboutUs = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var logo = $scope.newAboutUs.Logo_TMP;
		var img = $scope.newAboutUs.Image_TMP;
		var banner = $scope.newAboutUs.Banner_TMP;

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/SaveAboutUs",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				if (data.logo && data.logo.length > 0)
					formData.append("logo", data.logo[0]);

				if (data.img && data.img.length > 0)
					formData.append("image", data.img[0]);

				if (data.banner && data.banner.length > 0)
					formData.append("banner", data.banner[0]);

				return formData;
			},
			data: { jsonData: $scope.newAboutUs, logo: logo, img: img, banner: banner }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);


		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});

		
	}

	$scope.GetAllAboutUsList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		
		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAllAboutUsList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data)
			{
				if(res.data.Data.length>0)
					$scope.newAboutUs = res.data.Data[0];

				$scope.newAboutUs.Mode = "Save";
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}
});