app.controller('ProductDisplayController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'ProductDisplay';

	OnClickDefault();
	$scope.LoadData = function () {

		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.ProductCategoriesList = [];
		$http({
			method: 'GET',
			url: base_url + "Inventory/Creation/GetProductCategories",
			dataType: "json",
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ProductCategoriesList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.currentPages = {
			ProductDisplay: 1,

		};

		$scope.searchData = {
			ProductDisplay: '',

		};

		$scope.perPage = {
			ProductDisplay: GlobalServices.getPerPageRow(),

		};

		$scope.newProductDisplay = {
			ProductDisplayId: null,
			Title: '',
			Description: '',
			Image: '',
			OrderNo: 0,
			Mode: 'Save'
		};

		$scope.GetAllProductDisplayList();

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

			$scope.ClearProductDisplay();
			document.getElementById('table-listing').style.display = "none";
			document.getElementById('notice-form').style.display = "block";

		}
		document.getElementById('back-to-list').onclick = function () {
			$scope.ClearProductDisplay();
			document.getElementById('table-listing').style.display = "block";
			document.getElementById('notice-form').style.display = "none";
		}
	};




	$scope.ClearProductDisplayPhoto = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newProductDisplay.PhotoData = null;
				$scope.newProductDisplay.Photo_TMP = [];
				$scope.newProductDisplay.ImagePath = '';
			});

		});
		$('input[type=file]').val('');		
		$('#imgPhoto1').attr('src', '');

	};


	$scope.ClearProductDisplay = function () {

		$scope.ClearProductDisplayPhoto();


		$scope.newProductDisplay = {
			ProductDisplayId: null,
			Title: '',
			Description: '',
			Image: '',
			OrderNo: null,
			Mode: 'Save'
		};

	}

	$scope.IsValidProductDisplay = function () {
		if ($scope.newProductDisplay.Title.isEmpty()) {
			Swal.fire('Please ! Enter Title');
			return false;
		}

		return true;
	}
	var BASE64_MARKER = ';base64,';

	 
	$scope.SaveUpdateProductDisplay = function () {
		if ($scope.IsValidProductDisplay() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newProductDisplay.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateProductDisplay();
					}
				});
			} else
				$scope.CallSaveUpdateProductDisplay();

		}
	};

	$scope.CallSaveUpdateProductDisplay = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var filesColl = [];

		if ($scope.newProductDisplay.PhotoData && $scope.newProductDisplay.PhotoData.length > 0)
			filesColl.push($scope.newProductDisplay.Photo_TMP[0]);

			//filesColl.push(dataURItoFile($scope.newProductDisplay.PhotoData[0]));

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/SaveProductDisplay",
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
			data: { jsonData: $scope.newProductDisplay, files: filesColl }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearProductDisplay();
				$scope.GetAllProductDisplayList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllProductDisplayList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.ProductDisplayList = [];

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAllProductDisplayList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ProductDisplayList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetProductDisplayById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			ProductDisplayId: refData.ProductDisplayId
		};

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetProductDisplayById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newProductDisplay = res.data.Data;
				
				document.getElementById('table-listing').style.display = "none";
				document.getElementById('notice-form').style.display = "block";

				$scope.newProductDisplay.Mode = 'Modify';

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};
	$scope.DelProductDisplayById = function (refData) {

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
					ProductDisplayId: refData.ProductDisplayId
				};

				$http({
					method: 'POST',
					url: base_url + "AppCMS/Creation/DelProductDisplay",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllProductDisplayList();
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