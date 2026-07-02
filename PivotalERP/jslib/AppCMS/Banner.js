app.controller('BannerController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Banner';

	OnClickDefault();
	$scope.LoadData = function () {

		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();


		$scope.currentPages = {
			Banner: 1,

		};

		$scope.searchData = {
			Banner: '',

		};

		$scope.perPage = {
			Banner: GlobalServices.getPerPageRow(),

		};

		$scope.newBanner = {
			BannerId: null,
			Title: '',
			Description: '',
			Image: '',
			OrderNo:0,
			Mode: 'Save'
		};

		$scope.GetAllBannerList();

	}
	$scope.ShowPersonalImg = function (item) {
		$scope.viewImg = {
			ContentPath: ''
		};
		if (item.ImagePath && item.ImagePath.length > 0) {
			$scope.viewImg.ContentPath = item.ImagePath;
			$('#PersonalImg').modal('show');
		} else
			Swal.fire('No Image Found');

	};

	function OnClickDefault() {
		document.getElementById('notice-form').style.display = "none";

		document.getElementById('open-form-btn').onclick = function () {

			$scope.ClearBanner();
			document.getElementById('table-listing').style.display = "none";
			document.getElementById('notice-form').style.display = "block";

		}
		document.getElementById('back-to-list').onclick = function () {
			$scope.ClearBanner();
			document.getElementById('table-listing').style.display = "block";
			document.getElementById('notice-form').style.display = "none";
		}
	};




	$scope.ClearBannerPhoto = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newBanner.PhotoData = null;
				$scope.newBanner.Photo_TMP = [];
				$scope.newBanner.ImagePath = '';
			});

		});
		$('input[type=file]').val('');
		$('#imgPhoto1').attr('src', '');

	};


	$scope.ClearBanner = function () {

		$scope.ClearBannerPhoto();


		$scope.newBanner = {
			BannerId: null,
			Title: '',
			Description: '',
			Image: '',
			OrderNo: 0,
			Mode: 'Save'
		};

	}

	$scope.IsValidBanner = function () {
		if ($scope.newBanner.Title.isEmpty()) {
			Swal.fire('Please ! Enter Title');
			return false;
		}

		return true;
	}
	var BASE64_MARKER = ';base64,';

	// Does the given URL (string) look like a base64-encoded URL?
	function isDataURI(url) {
		return url.split(BASE64_MARKER).length === 2;
	};
	function dataURItoFile(dataURI) {
		if (!isDataURI(dataURI)) { return false; }

		// Format of a base64-encoded URL:
		// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYAAAAEOCAIAAAAPH1dAAAAK
		var mime = dataURI.split(BASE64_MARKER)[0].split(':')[1];
		var filename = 'rc-' + (new Date()).getTime() + '.' + mime.split('/')[1];
		//var filename = 'dataURI-file-' + (new Date()).getTime() + '.jpeg';
		var bytes = atob(dataURI.split(BASE64_MARKER)[1]);
		var writer = new Uint8Array(new ArrayBuffer(bytes.length));

		for (var i = 0; i < bytes.length; i++) {
			writer[i] = bytes.charCodeAt(i);
		}

		return new File([writer.buffer], filename, { type: mime });
	}
	$scope.SaveUpdateBanner = function () {
		if ($scope.IsValidBanner() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newBanner.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateBanner();
					}
				});
			} else
				$scope.CallSaveUpdateBanner();

		}
	};

	$scope.CallSaveUpdateBanner = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var filesColl = [];

		//if ($scope.newBanner.PhotoData && $scope.newBanner.PhotoData.length > 0)
		//	filesColl.push(dataURItoFile($scope.newBanner.PhotoData[0]));

		if ($scope.newBanner.Photo_TMP && $scope.newBanner.Photo_TMP.length > 0)
			filesColl.push($scope.newBanner.Photo_TMP[0]);
		
		if ($scope.newBanner.PublishOnDet) {
			$scope.newBanner.PublishOn = $filter('date')(new Date($scope.newBanner.PublishOnDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newBanner.PublishOn = null;

		if ($scope.newBanner.ValidUpToDet) {
			$scope.newBanner.ValidUpTo = $filter('date')(new Date($scope.newBanner.ValidUpToDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newBanner.ValidUpTo = null;

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/SaveBanner",
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
			data: { jsonData: $scope.newBanner, files: filesColl }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearBanner();
				$scope.GetAllBannerList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllBannerList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.BannerList = [];

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAllBannerList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BannerList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetBannerById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			BannerId: refData.BannerId
		};

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetBannerById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newBanner = res.data.Data;

				if ($scope.newBanner.PublishOn) {
					$scope.newBanner.PublishOn_TMP = new Date($scope.newBanner.PublishOn);
				} 

				if ($scope.newBanner.ValidUpTo) {
					$scope.newBanner.ValidUpTo_TMP = new Date($scope.newBanner.ValidUpTo);
				} 

				document.getElementById('table-listing').style.display = "none";
				document.getElementById('notice-form').style.display = "block";

				$scope.newBanner.Mode = 'Modify';

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};
	$scope.DelBannerById = function (refData) {

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
					BannerId: refData.BannerId
				};

				$http({
					method: 'POST',
					url: base_url + "AppCMS/Creation/DelBanner",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllBannerList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};



});