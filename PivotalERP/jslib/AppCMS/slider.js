app.controller('SliderController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Slider';

	OnClickDefault();
	$scope.LoadData = function () {

		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();


		$scope.currentPages = {
			Slider: 1,

		};

		$scope.searchData = {
			Slider: '',

		};

		$scope.perPage = {
			Slider: GlobalServices.getPerPageRow(),

		};

		$scope.newSlider = {
			SliderId: null,
			Title: '',
			Description: '',
			Image: '',
			OrderNo: null,
			Mode: 'Save'
		};

		$scope.GetAllSliderList();

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

			$scope.ClearSlider();
			document.getElementById('table-listing').style.display = "none";
			document.getElementById('notice-form').style.display = "block";

		}
		document.getElementById('back-to-list').onclick = function () {
			$scope.ClearSlider();
			document.getElementById('table-listing').style.display = "block";
			document.getElementById('notice-form').style.display = "none";
		}
	};




	$scope.ClearSliderPhoto = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newSlider.PhotoData = null;
				$scope.newSlider.Photo_TMP = [];
				$scope.newSlider.ImagePath = '';
			});

		});
		$('input[type=file]').val('');		
		$('#imgPhoto1').attr('src', '');

	};


	$scope.ClearSlider = function () {

		$scope.ClearSliderPhoto();


		$scope.newSlider = {
			SliderId: null,
			Title: '',
			Description: '',
			Image: '',
			OrderNo: null,
			Mode: 'Save'
		};

	}

	$scope.IsValidSlider = function () {
		if ($scope.newSlider.Title.isEmpty()) {
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
	$scope.SaveUpdateSlider = function () {
		if ($scope.IsValidSlider() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newSlider.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateSlider();
					}
				});
			} else
				$scope.CallSaveUpdateSlider();

		}
	};

	$scope.CallSaveUpdateSlider = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var filesColl = [];

		if ($scope.newSlider.PhotoData && $scope.newSlider.PhotoData.length > 0)
			filesColl.push(dataURItoFile($scope.newSlider.PhotoData[0]));

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/SaveSlider",
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
			data: { jsonData: $scope.newSlider, files: filesColl }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearSlider();
				$scope.GetAllSliderList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllSliderList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.SliderList = [];

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAllSliderList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.SliderList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetSliderById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			SliderId: refData.SliderId
		};

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetSliderById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newSlider = res.data.Data;
				
				document.getElementById('table-listing').style.display = "none";
				document.getElementById('notice-form').style.display = "block";

				$scope.newSlider.Mode = 'Modify';

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};
	$scope.DelSliderById = function (refData) {

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
					SliderId: refData.SliderId
				};

				$http({
					method: 'POST',
					url: base_url + "AppCMS/Creation/DelSlider",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllSliderList();
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