app.controller('EventController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'EventType';

	OnClickDefault();
	$scope.LoadData = function () {

		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();


		$scope.currentPages = {
			EventType: 1,

		};

		$scope.searchData = {
			EventType: '',

		};

		$scope.perPage = {
			EventType: GlobalServices.getPerPageRow(),

		};

		$scope.newEventType = {
			EventTypeId: null,
			EType: 1,
			Mode: 'Save'
		};

		$scope.GetAllEventTypeList();

	}

	function OnClickDefault() {
		/*document.getElementById('notice-form').style.display = "none";*/

		//document.getElementById('open-form-btn').onclick = function () {
		//	$scope.ClearEventType();
		//	document.getElementById('table-listing').style.display = "none";
		//	document.getElementById('notice-form').style.display = "block";
		//	$scope.ClearEventType();

		//}
		//document.getElementById('back-to-list').onclick = function () {
		//	$scope.ClearEventType();
		//	document.getElementById('table-listing').style.display = "block";
		//	document.getElementById('notice-form').style.display = "none";
		//	$scope.ClearEventType();
		//}
	};

	$scope.ClearEventTypePhoto = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newEventType.PhotoData = null;
				$scope.newEventType.Photo_TMP = [];
			});

			$('input[type=file]').val('');
			$('#imgPhoto').attr('src', '');
			$('#imgPhoto1').attr('src', '');
		});

	};


	$scope.ClearEventType = function () {

		$scope.newEventType = {
			EventTypeId: null,
			EType: 1,
			Mode: 'Save'
		};
		$scope.ClearEventTypePhoto();

	}

	$scope.IsValidEventType = function () {
		if ($scope.newEventType.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateEventType = function () {
		if ($scope.IsValidEventType() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newEventType.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateEventType();
					}
				});
			} else
				$scope.CallSaveUpdateEventType();

		}
	};

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

	$scope.CallSaveUpdateEventType = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var filesColl = [];

		if ($scope.newEventType.PhotoData && $scope.newEventType.PhotoData.length > 0)
			filesColl.push(dataURItoFile($scope.newEventType.PhotoData));

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/SaveEventType",
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
			data: { jsonData: $scope.newEventType, files: filesColl }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearEventType();
				$scope.GetAllEventTypeList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllEventTypeList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.EventTypeList = [];

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAllEventTypeList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EventTypeList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetEventTypeById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.ClearEventType();
		var para = {
			EventTypeId: refData.EventTypeId
		};

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetEventTypeById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newEventType = res.data.Data;

				$('#custom-tabs-four-profile-tab').tab('show');
				//document.getElementById('table-listing').style.display = "none";
				//document.getElementById('notice-form').style.display = "block";

				$scope.newEventType.Mode = 'Modify';

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};
	$scope.DelEventTypeById = function (refData) {

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
					EventTypeId: refData.EventTypeId
				};

				$http({
					method: 'POST',
					url: base_url + "AppCMS/Creation/DelEventType",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllEventTypeList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};

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

});