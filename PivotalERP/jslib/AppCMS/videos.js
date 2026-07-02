app.controller('VideosController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Videos';

	OnClickDefault();
	$scope.LoadData = function () {

		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();


		$scope.currentPages = {
			Videos: 1,

		};

		$scope.searchData = {
			Videos: '',

		};

		$scope.perPage = {
			Videos: GlobalServices.getPerPageRow(),

		};

		$scope.newVideos = {
			VideosId: null,
			Title: '',
			Description: '',
			AddUrl: '',
			AttachFile: '',
			OrderNo: null,
			Content: '',
			Mode: 'Save',
			UrlColl: [],
			UrlColl1: []
		};

		$scope.newVideos.UrlColl1.push({ AddUrl:''});

		$scope.GetAllVideosList();

	}

	function OnClickDefault() {
		document.getElementById('notice-form').style.display = "none";

		document.getElementById('open-form-btn').onclick = function () {
			$scope.ClearVideos();
			document.getElementById('table-listing').style.display = "none";
			document.getElementById('notice-form').style.display = "block";

		}
		document.getElementById('back-to-list').onclick = function () {
			$scope.ClearVideos();
			document.getElementById('table-listing').style.display = "block";
			document.getElementById('notice-form').style.display = "none";
		}

	};

	//add and del
	$scope.AddNewUrl = function (ind) {
		if ($scope.newVideos.UrlColl1) {
			if ($scope.newVideos.UrlColl1.length > ind + 1) {
				$scope.newVideos.UrlColl1.splice(ind + 1, 0, {
					AddUrl:""
				})
			} else {
				$scope.newVideos.UrlColl1.push({
					AddUrl: ""
				})
			}
		}
	};
	$scope.delURL = function (ind) {
		if ($scope.newVideos.UrlColl1) {
			if ($scope.newVideos.UrlColl1.length > 1) {
				$scope.newVideos.UrlColl1.splice(ind, 1);
			}
		}
	};

	$scope.ClearVideos = function () {
		$('input[type=file]').val('');
		$scope.newVideos = {
			VideosId: null,
			Title: '',
			Description: '',
			AddUrl: '',
			AttachFile: '',
			OrderNo: null,
			Content: '',
			Mode: 'Save',
			UrlColl: [],
			UrlColl1: []
		};

		$scope.newVideos.UrlColl1.push({ AddUrl: '' });

	}

	$scope.IsValidVideos = function () {
		if ($scope.newVideos.Title.isEmpty()) {
			Swal.fire('Please ! Enter Title');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateVideos = function () {
		if ($scope.IsValidVideos() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newVideos.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateVideos();
					}
				});
			} else
				$scope.CallSaveUpdateVideos();

		}
	};

	$scope.CallSaveUpdateVideos = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var filesColl = $scope.newVideos.Files_TMP;
		$scope.newVideos.UrlColl = [];
		angular.forEach($scope.newVideos.UrlColl1, function (ur) {
			$scope.newVideos.UrlColl.push(ur.AddUrl);
		});

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/SaveVideos",
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
			data: { jsonData: $scope.newVideos, files: filesColl }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearVideos();
				$scope.GetAllVideosList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllVideosList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.VideosList = [];

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAllVideosList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.VideosList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetVideosById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			VideosId: refData.VideosId
		};

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetVideosById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newVideos = res.data.Data;
				$scope.newVideos.UrlColl1 = [];
				if (!$scope.newVideos.UrlColl || $scope.newVideos.UrlColl.length == 0)
					$scope.AddNewUrl(0)
				else
				{
					angular.forEach($scope.newVideos.UrlColl, function (ur) {
						$scope.newVideos.UrlColl1.push({
							AddUrl:ur
						});
					});
                }

				document.getElementById('table-listing').style.display = "none";
				document.getElementById('notice-form').style.display = "block";

				$scope.newVideos.Mode = 'Modify';

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};
	$scope.DelVideosById = function (refData) {

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
					VideosId: refData.VideosId
				};

				$http({
					method: 'POST',
					url: base_url + "AppCMS/Creation/DelVideos",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllVideosList();
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