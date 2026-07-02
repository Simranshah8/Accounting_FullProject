app.controller('WhoWeAreController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Who We Are';

	OnClickDefault();
	$scope.LoadData = function () {
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.currentPages = {
			AdmissionProcedure: 1,
			RulesRegulation: 1,
			
		};

		$scope.searchData = {
			AdmissionProcedure: '',
			RulesRegulation: '',
		
		};

		$scope.perPage = {
			AdmissionProcedure: GlobalServices.getPerPageRow(),
			RulesRegulation: GlobalServices.getPerPageRow(),			
		};

		$scope.newAboutUs = {
			AboutUsId: null,
			Content: '',
			Photo: null,
			PhotoPath: null,
			Mode: 'Save'
		};


		$scope.newAdmissionProcedure = {
			AdmissionProcedureId: null,	
			Title: '',
			OrderNo: 0,
			Description: '',
			Photo: null,
			PhotoPath: null,
			Mode: 'Save'
		};

		$scope.newRulesRegulation = {
			RulesRegulationId: null,			
			Title: '',
			OrderNo: 0,
			Description: '',
			Photo: null,
			PhotoPath: null,
			Mode: 'Save'
		};

		$scope.newContact = {
			ContactId: null,
			Address: '',
			ContactNo: '',
			EmailId: '',
			OpeningHours: '',
			MapUrl:'',
			Mode: 'Save'
		};


		$scope.GetAllAboutUsList();
		$scope.GetAllAdmissionProcedureList();
		$scope.GetAllRulesRegulationList();
		$scope.GetContact();
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
		document.getElementById('admission-procedure-form').style.display = "none";
		document.getElementById('rules-form').style.display = "none";
		document.getElementById('contact-form').style.display = "none";	

		// Admission Procedure
		document.getElementById('add-admission-procedure').onclick = function () {
			$scope.ClearAdmissionProcedure();
			document.getElementById('admission-pro-listing').style.display = "none";
			document.getElementById('admission-procedure-form').style.display = "block";

		}
		document.getElementById('back-to-admission-procedure-list').onclick = function () {
			$scope.ClearAdmissionProcedure();
			document.getElementById('admission-pro-listing').style.display = "block";
			document.getElementById('admission-procedure-form').style.display = "none";
		}
		// Rules Form
		document.getElementById('add-rules').onclick = function () {
			$scope.ClearRulesRegulation();
			document.getElementById('rules-listing').style.display = "none";
			document.getElementById('rules-form').style.display = "block";

		}
		document.getElementById('back-to-rules-list').onclick = function () {
			$scope.ClearRulesRegulation();
			document.getElementById('rules-listing').style.display = "block";
			document.getElementById('rules-form').style.display = "none";
		}

		// Contact Detail
		document.getElementById('edit-contact-detail').onclick = function () {
			document.getElementById('contact-detail').style.display = "none";
			document.getElementById('contact-form').style.display = "block";

		}
		document.getElementById('back-to-contact-detail').onclick = function () {
			document.getElementById('contact-detail').style.display = "block";
			document.getElementById('contact-form').style.display = "none";
		}
	};


	$scope.ClearAboutUs = function () {
		$scope.newAboutUs = {
			AboutUsId: null,
			Content: '',
			Photo: null,
			PhotoPath: null,
			Mode: 'Save'
		};
	}

	$scope.ClearAdmissionProcedure = function () {

		$scope.ClearAdmissionProcedurePhotoAdmission();
		$scope.newAdmissionProcedure = {
			AdmissionProcedureId: null,
			Title: '',
			OrderNo: 0,
			Description: '',
			Photo: null,
			PhotoPath: null,
			Mode: 'Save'
		};
	}

	$scope.ClearRulesRegulation = function () {
		$scope.newRulesRegulation = {
			RulesRegulationId: null,
			Title: '',
			OrderNo: 0,
			Description: '',
			Photo: null,
			PhotoPath: null,
			Mode: 'Save'
		};
		$scope.ClearRulesRegulationPhotoRules();
	}

	$scope.ClearContact = function () {
		$scope.newContact = {
			ContactId: null,
			Address: '',
			ContactNo: '',
			EmailId: '',
			OpeningHours: '',
			MapUrl: '',
			Mode: 'Save'
		};
	}

	$scope.ClearAboutUsPhotoLogo = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newAboutUs.PhotoDataLogo = null;
				$scope.newAboutUs.PhotoLogo_TMP = [];
				$scope.newAboutUs.ImagePath = '';
			});

		});
		$('#imgLogo').attr('src', '');
		$('#imgLogo1').attr('src', '');
	};

	$scope.ClearAboutUsPhotoHeader = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newAboutUs.PhotoDataHeader = null;
				$scope.newAboutUs.PhotoHeader_TMP = [];
				$scope.newAboutUs.ImagePath = '';
			});

		});
		$('#imgHeader').attr('src', '');
		$('#imgHeader1').attr('src', '');
	};

	$scope.ClearAboutUsPhotoBanner = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newAboutUs.PhotoDataBanner = null;
				$scope.newAboutUs.PhotoBanner_TMP = [];
				$scope.newAboutUs.ImagePath = '';
			});

		});
		$('#imgBanner').attr('src', '');
		$('#imgBanner1').attr('src', '');
	};

	$scope.ClearAdmissionProcedurePhotoAdmission = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newAdmissionProcedure.PhotoDataAdmission = null;
				$scope.newAdmissionProcedure.PhotoAdmission_TMP = [];				
				$scope.newAdmissionProcedure.ImagePath = '';
			});

		});
		$('#imgAdmission').attr('src', '');
		$('#imgAdmission1').attr('src', '');
	};

	$scope.ClearRulesRegulationPhotoRules = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newRulesRegulation.PhotoDataRules = null;
				$scope.newRulesRegulation.PhotoRules_TMP = [];
				$scope.newRulesRegulation.ImagePath = '';
			});

		});
		$('#imgRules').attr('src', '');
		$('#imgRules1').attr('src', '');
	};

	/*About Us Tab Js*/
	$scope.IsValidAboutUs = function () {
		if ($scope.newAboutUs.Content.isEmpty()) {
			Swal.fire('Please ! Enter Content');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateAboutUs = function () {
		if ($scope.IsValidAboutUs() == true) {
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

		}
	};

	$scope.CallSaveUpdateAboutUs = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		
		var logo = $scope.newAboutUs.PhotoLogo_TMP;
		var img = $scope.newAboutUs.PhotoHeader_TMP;
		var banner = $scope.newAboutUs.PhotoBanner_TMP;


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
			if (res.data.IsSuccess && res.data.Data) {
				if (res.data.Data.length > 0)
					$scope.newAboutUs = res.data.Data[0];

				$scope.newAboutUs.Mode = "Save";
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	/*Admission Procedure Tab Js*/
	$scope.IsValidAdmissionProcedure = function () {
		if ($scope.newAdmissionProcedure.Description.isEmpty()) {
			Swal.fire('Please ! Enter Content');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateAdmissionProcedure = function () {
		if ($scope.IsValidAdmissionProcedure() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAdmissionProcedure.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAdmissionProcedure();
					}
				});
			} else
				$scope.CallSaveUpdateAdmissionProcedure();

		}
	};

	$scope.CallSaveUpdateAdmissionProcedure = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		
		var filesColl = $scope.newAdmissionProcedure.PhotoAdmission_TMP;


		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/SaveAdmissionProcedure",
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

			data: { jsonData: $scope.newAdmissionProcedure, files: filesColl }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearAdmissionProcedure();
				$scope.GetAllAdmissionProcedureList();
				
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAdmissionProcedureById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			AdmissionProcedureId: refData.AdmissionProcedureId
		};
		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAdmissionProcedureById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newAdmissionProcedure = res.data.Data;
				$scope.newAdmissionProcedure.Mode = 'Modify';

				document.getElementById('admission-pro-listing').style.display = "none";
				document.getElementById('admission-procedure-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelAdmissionProcedureById = function (refData) {
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
					AdmissionProcedureId: refData.AdmissionProcedureId
				};

				$http({
					method: 'POST',
					url: base_url + "AppCMS/Creation/DelAdmissionProcedure",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllAdmissionProcedureList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	};

	$scope.GetAllAdmissionProcedureList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.AdmissionProcedureList = [];

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAllAdmissionProcedureList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AdmissionProcedureList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	/*Rules And Regulations Tab Js*/
	$scope.IsValidRulesRegulation = function () {
		if ($scope.newRulesRegulation.Description.isEmpty()) {
			Swal.fire('Please ! Enter Content');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateRulesRegulation = function () {
		if ($scope.IsValidRulesRegulation() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newRulesRegulation.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateRulesRegulation();
					}
				});
			} else
				$scope.CallSaveUpdateRulesRegulation();

		}
	};

	$scope.CallSaveUpdateRulesRegulation = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		
		var filesColl = $scope.newRulesRegulation.PhotoRules_TMP;

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/SaveRulesRegulation",
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

			data: { jsonData: $scope.newRulesRegulation, files: filesColl }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearRulesRegulation();
				$scope.GetAllRulesRegulationList();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetRulesRegulationById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			RulesRegulationId: refData.RulesRegulationId
		};
		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetRulesRegulationById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newRulesRegulation = res.data.Data;
				$scope.newRulesRegulation.Mode = 'Modify';

				document.getElementById('rules-listing').style.display = "none";
				document.getElementById('rules-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.GetAllRulesRegulationList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.RulesRegulationList = [];

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAllRulesRegulationList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.RulesRegulationList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.DelRulesRegulationById = function (refData) {
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
					RulesRegulationId: refData.RulesRegulationId
				};

				$http({
					method: 'POST',
					url: base_url + "AppCMS/Creation/DelRulesRegulation",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllRulesRegulationList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	};


	/*Contact Tab Js*/
	$scope.IsValidContact = function () {
		if ($scope.newContact.Address.isEmpty()) {
			Swal.fire('Please ! Enter Address');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateContact = function () {
		if ($scope.IsValidContact() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newContact.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateContact();
					}
				});
			} else
				$scope.CallSaveUpdateContact();

		}
	};

	$scope.CallSaveUpdateContact = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/SaveContact",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

			
				return formData;
			},

			data: { jsonData: $scope.newContact}
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetContact= function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		
		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetContact",
			dataType: "json",
			//data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newContact = res.data.Data;
				$scope.newContact.Mode = 'Save';

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};


	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};
});