app.controller("EmployeeTransferController", function ($scope, $filter, $http, $timeout, GlobalServices) {
	$scope.Title = 'Employee Promotion';

	$scope.LoadData = function () {
		$('.select2').select2({});

		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();

		$scope.currentPages = {
			EmployeeTransfer: 1,
		};

		$scope.searchData = {
			EmployeeTransfer: '',
		};

		$scope.perPage = {
			EmployeeTransfer: GlobalServices.getPerPageRow(),
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


		$scope.newEmployeeTransfer = {
			EmployeeId: null,
			TransferDate: null,
			EffectiveDate: null,
			TransferDate_TMP: new Date(),
			EffectiveDate_TMP: new Date(),
			CompanyId: null,
			BranchId: null,
			DepartmentId: null,
			CategoryId: null,
			DesignationId: null,
			HeadQtr: '',
			NewCompanyId: null,
			NewBranchId: null,
			NewDepartmentId: null,
			NewCategoryId: null,
			NewDesignationId: null,
			NewHeadQuarter: '',
			RecommendedById: null,
			VerifiedById: null,
			RecommendedRemarks: "",
			VerifiedRemarks: "",
			Remarks: "",
            DocumentColl: [],
			AttechFiles: [],
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			Mode: "Save"
		}

		$scope.GetAllEmpTransfer();

	}

	$scope.ClearDetails = function () {
		$scope.newEmployeeTransfer = {
			EmployeeId: null,
			TransferDate: null,
			EffectiveDate: null,
			TransferDate_TMP: new Date(),
			EffectiveDate_TMP: new Date(),
			CompanyId: null,
			BranchId: null,
			DepartmentId: null,
			CategoryId: null,
			DesignationId: null,
			HeadQtr: '',
			NewCompanyId: null,
			NewBranchId: null,
			NewDepartmentId: null,
			NewCategoryId: null,
			NewDesignationId: null,
			NewHeadQuarter: '',
			RecommendedById: null,
			VerifiedById: null,
			RecommendedRemarks: "",
			VerifiedRemarks: "",
			Remarks: "",
			DocumentColl: [],
			AttechFiles: [],
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			Mode: "Save"
		}
	}

	$scope.RemoveAttachment = function (fId, ind) {
		if (fId == 1) {
			$scope.newEmployeeTransfer.DocumentColl.splice(ind, 1);
		}

		else if (fId == 2) {
			$scope.newEmployeeTransfer.AttechFiles.splice(ind, 1);
		}
	}

	$scope.AddMoreFiles = function (files, des) {
		if (!$scope.newEmployeeTransfer.DocumentColl) {
			$scope.newEmployeeTransfer.DocumentColl = [];
		}
		if (files) {
			if (files != null) {
				angular.forEach(files, function (file) {
					$scope.newEmployeeTransfer.DocumentColl.push({
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
		if ($scope.newEmployeeTransfer.DocumentColl) {
			if ($scope.newEmployeeTransfer.DocumentColl.length > 0) {
				$scope.newEmployeeTransfer.DocumentColl.splice(ind, 1);
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
		$scope.newEmployeeTransfer.EmployeeId = ref.EmployeeId;

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
				$scope.newEmployeeTransfer = res.data.Data;
				$scope.newEmployeeTransfer.UserId = ref.EmployeeDetails.UserId;
				$scope.newEmployeeTransfer.SelectEmployee = $scope.EmployeeSearchOptions[0].value;
				$scope.newEmployeeTransfer.TransferDate_TMP = new Date();
				$scope.newEmployeeTransfer.EffectiveDate_TMP = new Date();
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};


	$scope.IsValidEmpTransfer = function () {
		return true;
	}

	$scope.SaveUpdateEmpTransfer = function () {
		if ($scope.IsValidEmpTransfer() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newEmployeeTransfer.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					if (result.isConfirmed) {
						$scope.CallSaveUpdateEmpTransfer();
					}
				});
			} else
				$scope.CallSaveUpdateEmpTransfer();

		}
	};

	$scope.CallSaveUpdateEmpTransfer = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
	
		if ($scope.newEmployeeTransfer.TransferDateDet) {
			$scope.newEmployeeTransfer.TransferDate = $filter('date')(new Date($scope.newEmployeeTransfer.TransferDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newEmployeeTransfer.TransferDate = new Date();

		if ($scope.newEmployeeTransfer.EffectiveDateDet) {
			$scope.newEmployeeTransfer.EffectiveDate = $filter('date')(new Date($scope.newEmployeeTransfer.EffectiveDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newEmployeeTransfer.EffectiveDate = new Date();

		var filesColl = $scope.newEmployeeTransfer.AttechFiles;
		$scope.newEmployeeTransfer.AttechFiles = [];
		$http({
			method: 'Post',
			url: base_url + "HR/Master/SaveEmployeeTransfer",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				var find = 0;
				angular.forEach($scope.newEmployeeTransfer.DocumentColl, function (dc) {
					if (dc.File) {
						formData.append("file" + find, dc.File);
					}
					find++;
				});

				return formData;
			},

			data: { jsonData: $scope.newEmployeeTransfer, files: filesColl }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearDetails();
				$scope.GetAllEmpTransfer();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetAllEmpTransfer = function () {
		$scope.TableData = [];
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetAllEmployeeTransfer",
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

	$scope.GetEmpTransferById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TransferId: refData.TransferId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetEmployeeTransferById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newEmployeeTransfer = res.data.Data;
				$scope.newEmployeeTransfer.Mode = 'Modify';
				$scope.newEmployeeTransfer.SelectEmployee = $scope.EmployeeSearchOptions[0].value;				
				$scope.newEmployeeTransfer.HeadQtr = res.data.Data.NewHeadQuarter;
				if ($scope.newEmployeeTransfer.TransferDate) {
					$scope.newEmployeeTransfer.TransferDate_TMP = new Date($scope.newEmployeeTransfer.TransferDate);
				}
				if ($scope.newEmployeeTransfer.EffectiveDate) {
					$scope.newEmployeeTransfer.EffectiveDate_TMP = new Date($scope.newEmployeeTransfer.EffectiveDate);
				}
				angular.forEach($scope.newEmployeeTransfer.DocumentColl, function (d) {
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
		$scope.TableData.CompanyName = ref.CompanyName;
		$scope.TableData.BranchName = ref.BranchName;
		$scope.TableData.Department = ref.Department;
		$scope.TableData.CategoryName = ref.CategoryName;
		$scope.TableData.NewHeadQuarter = ref.NewHeadQuarter;
		$scope.TableData.TransferMitti = ref.TransferMitti;
		$scope.TableData.EffectiveMitti = ref.EffectiveMitti;
		$scope.TableData.TransferBy = ref.TransferBy;
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.viewData = {};
		var para = {
			TransferId: ref.TransferId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetEmployeeTransferById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.viewData = res.data.Data;
				angular.forEach($scope.viewData.DocumentColl, function (E) {
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

	$scope.PreviewImg = function (item) {

		$scope.viewImg = {

			ContentPath: '',

			FileType: null

		};

		if (item.DocPath && item.DocPath.length > 0) {

			$scope.viewImg.ContentPath = item.DocPath;

			$scope.viewImg.FileType = 'pdf';  // Assuming DocPath is for PDFs

			document.getElementById('previewPdf').src = item.DocPath;

			$('#Preview').modal('show');

		} else if (item.PhotoPath && item.PhotoPath.length > 0) {

			$scope.viewImg.ContentPath = item.PhotoPath;

			$scope.viewImg.FileType = 'image';  // Assuming PhotoPath is for images

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
	
})