app.controller("EmployeePromotionController", function ($scope, $filter, $http, $timeout, GlobalServices) {
	$scope.Title = 'Employee Promotion';

	$scope.LoadData = function () {
		$('.select2').select2({});

		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();

		$scope.currentPages = {
			EmployeePromotion: 1,
		};

		$scope.searchData = {
			EmployeePromotion: '',
		};

		$scope.perPage = {
			EmployeePromotion: GlobalServices.getPerPageRow(),
		};

		$scope.BranchList = [];
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllBranchList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		
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

		$scope.CategoryList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllCategory",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CategoryList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.ServiceTypeList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllServiceType",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ServiceTypeList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.DesignationList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllDesignation",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DesignationList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.LevelList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllLevel",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.LevelList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.EmployeeList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllEmployee",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EmployeeList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.newEmployeePromotion = {
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			EmployeeId: null,
			PromotionDate: null,
			EffectiveDate: null,
			PromotionDate_TMP: new Date(),
			EffectiveDate_TMP: new Date(),
			BranchId: null,
			DepartmentId: null,
			CategoryId: null,
			JobTitle: "",
			ELevelId: null,
			ServiceTypeId: null,
			DesignationId: null,
			NewBranchId: null,
			NewDepartmentId: null,
			NewCategoryId: null,
			NewJTitle: "",
			NewLevelId: null,
			NewServiceTypeId: null,
			NewDesignationId: null,
			RecommendedById: null,
			VerifiedById: null,
			RecommendedRemarks: "",
			VerifiedRemarks: "",
			Remarks: "",			
			DocumentColl: [],
			AttechFiles: [],
			Mode: "Save"
		}
		$scope.GetAllEmpPromotion();

	}
	$scope.ClearDetails = function () {
		$scope.newEmployeePromotion = {
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			EmployeeId: null,
			PromotionDate: null,
			EffectiveDate: null,
			PromotionDate_TMP: new Date(),
			EffectiveDate_TMP: new Date(),
			BranchId: null,
			DepartmentId: null,
			CategoryId: null,
			JobTitle: "",
			ELevelId: null,
			ServiceTypeId: null,
			DesignationId: null,
			NewBranchId: null,
			NewDepartmentId: null,
			NewCategoryId: null,
			NewJTitle: "",
			NewLevelId: null,
			NewServiceTypeId: null,
			NewDesignationId: null,
			RecommendedById: null,
			VerifiedById: null,
			RecommendedRemarks: "",
			VerifiedRemarks: "",
			Remarks: "",
			DocumentColl: [],
			AttechFiles: [],
			Mode: "Save"
		}

	}
	

	$scope.AddMoreFiles = function (files, des) {
		if (!$scope.newEmployeePromotion.DocumentColl) {
			$scope.newEmployeePromotion.DocumentColl = [];
		}
		if (files) {
			if (files != null) {
				angular.forEach(files, function (file) {
					$scope.newEmployeePromotion.DocumentColl.push({
						File: file,
						Name: file.name,
						Type: file.type,
						Size: file.size,
						Description: des,
						Path: null
					});

				})

				$scope.attachFile = null;

				$scope.docDescription = '';

				$('#flMoreFiles').val('');

			}

		}

	};

	$scope.delAttachmentFiles = function (ind) {
		if ($scope.newEmployeePromotion.DocumentColl) {
			if ($scope.newEmployeePromotion.DocumentColl.length > 0) {
				$scope.newEmployeePromotion.DocumentColl.splice(ind, 1);
			}
		}
	}

	$scope.ShowPersonalImg = function (item) {
		$scope.viewImg = {
			ContentPath: '',
			FileType: null
		};

		if (item.DocPath && item.DocPath.length > 0) {
			$scope.viewImg.ContentPath = item.DocPath;
			$scope.viewImg.FileType = 'pdf';
			document.getElementById('pdfViewer').src = item.DocPath;
			$('#PersonalImg').modal('show');
		} else if (item.PhotoPath && item.PhotoPath.length > 0) {
			$scope.viewImg.ContentPath = item.PhotoPath;
			$scope.viewImg.FileType = 'image';
			$('#PersonalImg').modal('show');
		} else if (item.File) {
			var blob = new Blob([item.File], { type: item.File?.type });
			$scope.viewImg.ContentPath = URL.createObjectURL(blob);
			$scope.viewImg.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';
			if ($scope.viewImg.FileType === 'pdf') {
				document.getElementById('pdfViewer').src = $scope.viewImg.ContentPath;
			}
			$('#PersonalImg').modal('show');
		} else {
			Swal.fire('No Image Found');
		}

	};

	$scope.PreviewImg = function (item) {
		$scope.viewImg = {
			ContentPath: '',
			FileType: null
		};
		if (item.DocPath && item.DocPath.length > 0) {
			$scope.viewImg.ContentPath = item.DocPath;
			$scope.viewImg.FileType = 'pdf';
			document.getElementById('previewPdf').src = item.DocPath;
			$('#Preview').modal('show');
		} else if (item.PhotoPath && item.PhotoPath.length > 0) {
			$scope.viewImg.ContentPath = item.PhotoPath;
			$scope.viewImg.FileType = 'image';
			$('#Preview').modal('show');
		} else if (item.File) {
			var blob = new Blob([item.File], { type: item.File?.type });
			$scope.viewImg.ContentPath = URL.createObjectURL(blob);
			$scope.viewImg.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';
			if ($scope.viewImg.FileType === 'pdf') {
				document.getElementById('previewPdf').src = $scope.viewImg.ContentPath;
			}
			$('#Preview').modal('show');
		} else {
			Swal.fire('No Image Found');
		}

	};

	$scope.CheckRequestNoExists = function (EmployeeId) {
		if (!$scope.newEmployeeTransfer || !$scope.newEmployeeTransfer.length) {
			return true; // nothing to check yet
		}

		var exists = $scope.newEmployeeTransfer.some(function (item) {
			return item.EmployeeId == EmployeeId;
		});
		if (!exists) {
			Swal.fire({
				icon: 'warning',
				title: 'Not Found',
				text: 'This Employee ID does not exist.'
			});

			$scope.newDetails = {
				EmployeeId: EmployeeId
			};

			return false;
		}
		return true;
	};

	$scope.getEmployeeById = function (ref) {

		if (!ref.EmployeeDetails || ref.EmployeeDetails == undefined)
			return;

		ref.EmployeeId = ref.EmployeeDetails.EmployeeId;
		$scope.newEmployeePromotion.EmployeeId = ref.EmployeeId;

		if (!ref || !ref.EmployeeId) {
			return;
		}
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			EmployeeId: ref.EmployeeId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Master/getEmployeeById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newEmployeePromotion = res.data.Data;
				$scope.newEmployeePromotion.UserId = ref.EmployeeDetails.UserId
				$scope.newEmployeePromotion.SelectEmployee=$scope.EmployeeSearchOptions[0].value;
				$scope.newEmployeePromotion.JobTitle = res.data.Data.JTitle;
				$scope.newEmployeePromotion.LevelId = res.data.Data.ELevelId;

				$scope.newEmployeePromotion.PromotionDate_TMP = new Date();
				$scope.newEmployeePromotion.EffectiveDate_TMP = new Date();

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.IsValidEmpPromotion = function () {
		return true;
	};


	$scope.SaveUpdateEmpPromotion = function () {
		if ($scope.IsValidEmpPromotion() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newEmployeePromotion.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					if (result.isConfirmed) {
						$scope.CallSaveUpdateEmpPromotion();
					}
				});
			} else
				$scope.CallSaveUpdateEmpPromotion();

		}
	};

	$scope.CallSaveUpdateEmpPromotion = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.newEmployeePromotion.PromotionDateDet) {
			$scope.newEmployeePromotion.PromotionDate = $filter('date')(new Date($scope.newEmployeePromotion.PromotionDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newEmployeePromotion.PromotionDate = new Date();
		
		if ($scope.newEmployeePromotion.EffectiveDateDet) {
			$scope.newEmployeePromotion.EffectiveDate = $filter('date')(new Date($scope.newEmployeePromotion.EffectiveDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newEmployeePromotion.EffectiveDate = new Date();

		var filesColl = $scope.newEmployeePromotion.AttechFiles;
		$scope.newEmployeePromotion.AttechFiles = [];

		$http({
			method: 'Post',
			url: base_url + "HR/Master/SaveEmployeePromotion",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				var find = 0;
				angular.forEach($scope.newEmployeePromotion.DocumentColl, function (dc) {
					if (dc.File) {
						formData.append("file" + find, dc.File);
					}
					find++;
				});

				return formData;
			},

			data: { jsonData: $scope.newEmployeePromotion, files: filesColl }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearDetails();
				$scope.GetAllEmpPromotion();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllEmpPromotion = function () {
		$scope.TableData = [];
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetAllEmployeePromotion",
			dataType: "json",
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.TableData = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire('Failed: ' + reason);
		});
	}

	$scope.GetEmpPromotionById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			PromotionId: refData.PromotionId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetEmployeePromotionById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newEmployeePromotion = res.data.Data;
				$scope.newEmployeePromotion.SelectEmployee = $scope.EmployeeSearchOptions[0].value;
				$scope.newEmployeePromotion.Mode = 'Modify';
				$scope.newEmployeePromotion.JTitle = res.data.Data.NewJTitle;
				$scope.newEmployeePromotion.ELevelId = res.data.Data.NewLevelId;

				if ($scope.newEmployeePromotion.PromotionDate) {
					$scope.newEmployeePromotion.PromotionDate_TMP = new Date($scope.newEmployeePromotion.PromotionDate);
				}
				
				if ($scope.newEmployeePromotion.EffectiveDate) {
					$scope.newEmployeePromotion.EffectiveDate_TMP = new Date($scope.newEmployeePromotion.EffectiveDate);
				}
				angular.forEach($scope.newEmployeePromotion.DocumentColl, function (d) {
					d.File = null;
					d.Path = d.DocPath;
					d.Name = d.Name;
					d.Id = d.Id;
				});

				
				$('#custom-tabs-four-profile-tab').tab('show');

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	};

	$scope.PreviewDocument = function (ref) {
		$scope.TableData.EmployeeName = ref.EmployeeName;
		$scope.TableData.EmployeeCode = ref.EmployeeCode;
		$scope.TableData.BranchName = ref.BranchName;
		$scope.TableData.Department = ref.Department;
		$scope.TableData.CategoryName = ref.CategoryName;
		$scope.TableData.NewJTitle = ref.NewJTitle;
		$scope.TableData.LevelName = ref.LevelName;
		$scope.TableData.ServiceTypeName = ref.ServiceTypeName;
		$scope.TableData.DesignationName = ref.DesignationName;
		$scope.TableData.PromotionMitti = ref.PromotionMitti;
		$scope.TableData.EffectiveMitti = ref.EffectiveMitti;
		$scope.TableData.PromotionBy = ref.PromotionBy;

		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.EmpPromotion = {};
		var para = {
			PromotionId: ref.PromotionId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetEmployeePromotionById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EmpPromotion = res.data.Data;
				angular.forEach($scope.EmpPromotion.DocumentColl, function (E) {
					E.File = null;
					E.Path = E.DocPath;
					E.Name = E.Name;
					E.Id = E.Id;
				});
				$('#PreviewData').modal('show');

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};


})	