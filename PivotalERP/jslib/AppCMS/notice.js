app.controller('NoticeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Notice';

	OnClickDefault();
	$scope.LoadData = function () {

		  
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();


		$scope.currentPages = {
			Notice: 1,

		};

		$scope.searchData = {
			Notice: '',

		};

		$scope.perPage = {
			Notice: GlobalServices.getPerPageRow(),

		};

		$scope.newNotice = {
			NoticeId: null,
			HeadLine: '',
			NoticeDate_TMP: new Date(),
			Description: '',
			PublishedOn_TMP: new Date(),
			PublishedTime: null,
			OrderNo: 0,
			Photo: null,
			PhotoPath: null,
			Content: '',
			AttachmentColl: [],
			Mode: 'Save'
		};

		$scope.CompanyRelationshipList = [];
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetAllCompanyRelationship",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CompanyRelationshipList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		//for department
		$scope.DepartmentList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllDepartment",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DepartmentList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.BranchList = [];
		$http({
			method: 'GET',
			url: base_url + "Setup/Security/GetAllBranchList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});



		$scope.GetAllNoticeList();
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

			$scope.ClearNotice();
			document.getElementById('table-listing').style.display = "none";
			document.getElementById('notice-form').style.display = "block";

		}
		document.getElementById('back-to-list').onclick = function () {
			document.getElementById('table-listing').style.display = "block";
			document.getElementById('notice-form').style.display = "none";
		}
	};

	$scope.delAttachmentFiles = function (ind) {
		if ($scope.newNotice.AttachmentColl) {
			if ($scope.newNotice.AttachmentColl.length > 0) {
				$scope.newNotice.AttachmentColl.splice(ind, 1);
			}
		}
	}
	$scope.AddMoreFiles = function (files, docType, des) {

		if (files && docType) {
			if (files != null && docType != null) {

				angular.forEach(files, function (file) {
					$scope.newNotice.AttachmentColl.push({
						DocumentTypeId: docType.id,
						DocumentTypeName: docType.text,
						File: file,
						Name: file.name,
						Type: file.type,
						Size: file.size,
						Description: des,
						Path: null
					});
				})

				$scope.docType = null;
				$scope.attachFile = null;
				$scope.docDescription = '';
			}
		}
	};
	$scope.ClearNoticePhoto = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newNotice.PhotoData = null;
				$scope.newNotice.Photo_TMP = [];
			});

		});
		$('input[type=file]').val('');
		$('#imgPhoto').attr('src', '');
		$('#imgPhoto1').attr('src', '');

	};

	$scope.ClearNotice = function () {

		$scope.ClearNoticePhoto();

		$('input[type=file]').val('');

		$scope.newNotice = {
			NoticeId: null,
			HeadLine: '',
			NoticeDate_TMP: new Date(),
			Description: '',
			PublishedOn_TMP: new Date(),
			PublishedTime: null,
			OrderNo: 0,
			Photo: null,
			PhotoPath: null,
			Content: '',
			AttachmentColl: [],
			Mode: 'Save'
		};


	}

	$scope.IsValidNotice = function () {
		if ($scope.newNotice.HeadLine.isEmpty()) {
			Swal.fire('Please ! Enter HeadLine');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateNotice = function () {
		if ($scope.IsValidNotice() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newNotice.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateNotice();
					}
				});
			} else
				$scope.CallSaveUpdateNotice();

		}
	};

	$scope.CallSaveUpdateNotice = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var filesColl = $scope.newNotice.AttachmentColl;

		var photo = $scope.newNotice.Photo_TMP;

		if ($scope.newNotice.NoticeDateDet) {
			$scope.newNotice.NoticeDate = $filter('date')(new Date($scope.newNotice.NoticeDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newNotice.NoticeDate = null;

		if ($scope.newNotice.PublishedOnDet) {
			$scope.newNotice.PublishOn = $filter('date')(new Date($scope.newNotice.PublishedOnDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newNotice.PublishOn = null;

		if ($scope.newNotice.PublishTime_TMP)
			$scope.newNotice.PublishTime = $filter('date')(new Date($scope.newNotice.PublishTime_TMP), 'yyyy-MM-dd hh:mm');
		else
			$scope.newNotice.PublishTime = null;

		if ($scope.newNotice.ValidUptoDet) {
			$scope.newNotice.ValidUpto = $filter('date')(new Date($scope.newNotice.ValidUptoDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newNotice.ValidUpto = null;


		if ($scope.newNotice.CompanyColl)
			$scope.newNotice.CompanyIds = $scope.newNotice.CompanyColl.toString();
		else
			$scope.newNotice.CompanyIds = '';

		if ($scope.newNotice.BranchColl)
			$scope.newNotice.BranchIds = $scope.newNotice.BranchColl.toString();
		else
			$scope.newNotice.BranchIds = '';

		if ($scope.newNotice.DepartmentColl)
			$scope.newNotice.DepartmentIds = $scope.newNotice.DepartmentColl.toString();
		else
			$scope.newNotice.DepartmentIds = '';



		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/SaveNotice",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				if (data.files) {
					for (var i = 0; i < data.files.length; i++) {
						formData.append("file" + i, data.files[i].File);
					}
				}

				if (data.stPhoto && data.stPhoto.length > 0)
					formData.append("photo", data.stPhoto[0]);



				return formData;
			},
			data: { jsonData: $scope.newNotice, files: filesColl, stPhoto: photo }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearNotice();
				$scope.GetAllNoticeList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllNoticeList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.NoticeList = [];

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAllNoticeList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.NoticeList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetNoticeById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			NoticeId: refData.NoticeId
		};

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetNoticeById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newNotice = res.data.Data;

				if ($scope.newNotice.NoticeDate)
					$scope.newNotice.NoticeDate_TMP = new Date($scope.newNotice.NoticeDate);

				if ($scope.newNotice.PublishOn)
					$scope.newNotice.PublishedOn_TMP = new Date($scope.newNotice.PublishOn);

				if ($scope.newNotice.PublishTime)
					$scope.newNotice.PublishTime_TMP = new Date($scope.newNotice.PublishTime);

				if ($scope.newNotice.ValidUpto)
					$scope.newNotice.ValidUpto_TMP = new Date($scope.newNotice.ValidUpto);

				$scope.newNotice.CompanyColl = $scope.newNotice.CompanyIds
				$scope.newNotice.BranchColl = $scope.newNotice.BranchIds
				$scope.newNotice.DepartmentColl = $scope.newNotice.DepartmentIds

				document.getElementById('table-listing').style.display = "none";
				document.getElementById('notice-form').style.display = "block";

				$scope.newNotice.Mode = 'Modify';

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};
	$scope.DelNoticeById = function (refData) {

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
					NoticeId: refData.NoticeId
				};

				$http({
					method: 'POST',
					url: base_url + "AppCMS/Creation/DelNotice",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllNoticeList();
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