app.controller('GalleryController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Gallery';

	OnClickDefault();
	$scope.LoadData = function () {

		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();


		$scope.currentPages = {
			Gallery: 1,

		};

		$scope.searchData = {
			Gallery: '',

		};

		$scope.perPage = {
			Gallery: GlobalServices.getPerPageRow(),

		};

		$scope.newGallery = {
			GalleryId: null,
			Title: '',
			Description: '',
			Image: '',
			OrderNo: 0,
			Mode: 'Save'
		};

		$scope.GetAllGallerList();

	}

	function OnClickDefault() {
		document.getElementById('notice-form').style.display = "none";

		document.getElementById('open-form-btn').onclick = function () {
			$scope.ClearGallery();
			document.getElementById('table-listing').style.display = "none";
			document.getElementById('notice-form').style.display = "block";
		}
		document.getElementById('back-to-list').onclick = function () {
			$scope.ClearGallery();
			document.getElementById('table-listing').style.display = "block";
			document.getElementById('notice-form').style.display = "none";
		}
	};



	$scope.ClearGallery = function () {

		$scope.newGallery = {
			GalleryId: null,
			Title: '',
			Description: '',
			Image: '',
			OrderNo: 0,
			Mode: 'Save'
		};
		myDropzone.removeAllFiles();
	}

	$scope.IsValidGallery = function () {
		if ($scope.newGallery.Title.isEmpty()) {
			Swal.fire('Please ! Enter Title');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateGallery = function () {
		if ($scope.IsValidGallery() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newGallery.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateGallery();
					}
				});
			} else
				$scope.CallSaveUpdateGallery();

		}
	};

	$scope.CallSaveUpdateGallery = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var filesColl = myDropzone.files;

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/SaveGallery",
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
			data: { jsonData: $scope.newGallery, files: filesColl }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearGallery();
				$scope.GetAllGallerList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllGallerList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.GalleryList = [];

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAllGalleryList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.GalleryList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetGalleryById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			GalleryId: refData.GalleryId
		};

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetGalleryById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newGallery = res.data.Data;

				angular.forEach($scope.newGallery.ImageColl, function (doc)
				{
					var img = new Image();
					img.src = doc.DocPath;
					img.height = 300;
					img.width = 300;

					var mockFile = {
						name: doc.Name,
						size: 12345,
						width: 130,
						height: 130,
						thumbnailWidth: 130,
						thumbnailHeight: 130
					};

					// Call the default addedfile event handler
					myDropzone.emit("addedfile", mockFile);

					// And optionally show the thumbnail of the file:
					myDropzone.emit("thumbnail", mockFile, doc.DocPath);

					myDropzone.emit("complete", mockFile);

                })
				


					document.getElementById('table-listing').style.display = "none";
				document.getElementById('notice-form').style.display = "block";

				$scope.newGallery.Mode = 'Modify';

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};
	$scope.DelGalleryById = function (refData) {

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
					GalleryId: refData.GalleryId
				};

				$http({
					method: 'POST',
					url: base_url + "AppCMS/Creation/DelGallery",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllGalleryList();
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