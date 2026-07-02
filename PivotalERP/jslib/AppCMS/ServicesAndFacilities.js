app.controller('ServicesAndFacilitiesController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Notice';

	OnClickDefault();
	$scope.LoadData = function () {
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.currentPages = {
			ServicesFacilities: 1,
			AcademicPrograms: 1,
			Feedback:1
		};

		$scope.searchData = {
			ServicesFacilities: '',
			AcademicPrograms: '',
			Feedback: ''
		};

		$scope.perPage = {
			ServicesFacilities: GlobalServices.getPerPageRow(),
			AcademicPrograms: GlobalServices.getPerPageRow(),
			Feedback: GlobalServices.getPerPageRow(),

		};

		$scope.newServicesFacilities = {
			ServicesFacilitiesId: null,
			Title: '',
			OrderNo: null,
			Description: '',
			Content:'',
			Photo: null,
			PhotoPath: null,
			Mode: 'Save'
		};

		$scope.newAcademicPrograms = {
			AcademicProgramsId: null,
			Title: '',
			OrderNo: null,
			Description: '',
			Content: '',
			Photo: null,
			PhotoPath: null,
			Mode: 'Save'
		};

		$scope.newFeedback = {
			FeedbackId: null,			
			Mode: 'Save'
		};

		$scope.GetAllServicesFacilitiesList(); 
		$scope.GetAllFeedbackList();
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
	$scope.GetAllFeedbackList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.FeedbackList = [];

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetFeedbackList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.FeedbackList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


	}
	function OnClickDefault() {
		document.getElementById('sf-form').style.display = "none";
		//document.getElementById('acad-prog-form').style.display = "none";

		document.getElementById('add-sf').onclick = function () {
			$scope.ClearServicesFacilities();
			document.getElementById('sf-table-listing').style.display = "none";
			document.getElementById('sf-form').style.display = "block";
		}
		document.getElementById('back-to-sf-list').onclick = function () {
			$scope.ClearServicesFacilities();
			document.getElementById('sf-table-listing').style.display = "block";
			document.getElementById('sf-form').style.display = "none";
		}
		 
	};

	/*Services and Facilities Tab Js*/
	$scope.ClearServicesFacilitiesPhoto = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newServicesFacilities.PhotoData = null;
				$scope.newServicesFacilities.Photo_TMP = [];
				$scope.newServicesFacilities.ImagePath = '';
			});

		});

		$('#imgPhoto').attr('src', '');
		$('#imgPhoto1').attr('src', '');

	};


	$scope.ClearServicesFacilities = function () {
		$scope.ClearServicesFacilitiesPhoto();
		$scope.newServicesFacilities = {
			ServicesFacilitiesId: null,
			Title: '',
			OrderNo: null,
			Description: '',
			Content: '',
			Photo: null,
			PhotoPath: null,
			Mode: 'Save'
		};
	}

	$scope.IsValidServicesFacilities = function () {
		if ($scope.newServicesFacilities.Title.isEmpty()) {
			Swal.fire('Please ! Enter Title');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateServicesFacilities = function () {
		if ($scope.IsValidServicesFacilities() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newServicesFacilities.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateServicesFacilities();
					}
				});
			} else
				$scope.CallSaveUpdateServicesFacilities();

		}
	};

	$scope.CallSaveUpdateServicesFacilities = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
	
		var filesColl = $scope.newServicesFacilities.Photo_TMP;


		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/SaveServicesAndFacilities",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				if (data.files) {
					for (var i = 0; i < data.files.length; i++) {
						if (data.files[i].File)
							formData.append("photo", data.files[i].File);
						else
							formData.append("photo", data.files[i]);
					}
				}

				return formData;
			},

			data: { jsonData: $scope.newServicesFacilities, files: filesColl }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearServicesFacilities();
				$scope.GetAllServicesFacilitiesList();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllServicesFacilitiesList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.ServicesFacilitiesList = [];

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAllServicesAndFacilitiesList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ServicesFacilitiesList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetServicesFacilitiesById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			ServicesAndFacilitiesId: refData.TranId
		};
		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetServicesAndFacilitiesById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newServicesFacilities = res.data.Data;
				$scope.newServicesFacilities.Mode = 'Modify';

				document.getElementById('sf-table-listing').style.display = "none";
				document.getElementById('sf-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelServicesAndFacilities = function (refData) {

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
					ServicesAndFacilitiesId: refData.TranId
				};

				$http({
					method: 'POST',
					url: base_url + "AppCMS/Creation/DelServicesAndFacilities",
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

	//Academic Program Tab Js Starts From Here	
	$scope.ClearAcademicProgramsPhotoAcadImage = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newAcademicPrograms.PhotoDataAcadImage = null;
				$scope.newAcademicPrograms.PhotoAcadImage_TMP = [];
				$scope.newAcademicPrograms.ImagePath = '';
			});

		});
		$('#imgAcadImage').attr('src', '');
		$('#imgAcadImage1').attr('src', '');
	};

	$scope.ClearAcademicPrograms = function () {
		$scope.ClearAcademicProgramsPhotoAcadImage();
		$scope.newAcademicPrograms = {
			AcademicProgramsId: null,
			Title: '',
			OrderNo: null,
			Description: '',
			Content: '',
			Photo: null,
			PhotoPath: null,
			Mode: 'Save'
		};
	}

	$scope.IsValidAcademicPrograms = function () {
		if ($scope.newAcademicPrograms.Title.isEmpty()) {
			Swal.fire('Please ! Enter Title');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateAcademicPrograms = function () {
		if ($scope.IsValidAcademicPrograms() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAcademicPrograms.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAcademicPrograms();
					}
				});
			} else
				$scope.CallSaveUpdateAcademicPrograms();

		}
	};

	$scope.CallSaveUpdateAcademicPrograms = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		
		var filesColl = $scope.newAcademicPrograms.PhotoAcadImage_TMP;

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/SaveAcademicProgram",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				if (data.files) {
					for (var i = 0; i < data.files.length; i++) {
						if (data.files[i].File)
							formData.append("photo", data.files[i].File);
						else
							formData.append("photo", data.files[i]);
					}
				}
				return formData;
			},

			data: { jsonData: $scope.newAcademicPrograms, files: filesColl }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearAcademicPrograms();
				
				$scope.GetAllAcademicProgramsList();
				
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllAcademicProgramsList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.AcademicProgramsList = [];

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAllAcademicProgramList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AcademicProgramsList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetAcademicProgramsById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			AcademicProgramId: refData.TranId
		};
		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAcademicProgramById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newAcademicPrograms = res.data.Data;
				$scope.newAcademicPrograms.Mode = 'Modify';

				document.getElementById('acad-prog-table-listing').style.display = "none";
				document.getElementById('acad-prog-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelAcademicProgramsById = function (refData) {

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
					AcademicProgramId: refData.TranId
				};

				$http({
					method: 'POST',
					url: base_url + "AppCMS/Creation/DelAcademicProgram",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllAcademicProgramsList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	};

	$scope.currentFeedback = null;
	$scope.ShowResponeDialog = function (feedback) {
		$scope.currentFeedback = feedback;
		$('#replyFeedback').modal('show');
    }

	$scope.UpdateFeedback = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/UpdateFeedback",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				
				return formData;
			},
			data: { jsonData: $scope.currentFeedback  }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);			
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};
});