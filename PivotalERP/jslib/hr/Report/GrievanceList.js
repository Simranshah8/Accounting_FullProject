app.controller('GrievanceListController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Grievance List';


	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();
		$scope.currentPages = {
			Grievance: 1,
		};
		$scope.searchData = {
			Grievance: '',
		};
		$scope.perPage = {
			Grievance: GlobalServices.getPerPageRow(),
		};

		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();

		
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

		$scope.EmployeeList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllEmployee",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EmployeeList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.GrievanceTypeList = [];
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetAllGrievanceType",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.GrievanceTypeList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.StatusColl = [
			{ id: 0, text: 'All' },
			{ id: 1, text: 'Pending' },
			{ id: 2, text: 'Assigned' },
			{ id: 3, text: 'Under Review' },
			{ id: 4, text: 'Closed' },
			{ id: 5, text: 'Rejected' }
		]
		$scope.ActionTakenColl = [
			{ id: 0, text: 'All' },
			{ id: 1, text: 'Pending' },
			{ id: 2, text: 'Assigned' },
			{ id: 4, text: 'Closed' },
			{ id: 5, text: 'Rejected' }
		]


		$scope.beData = {
			DateFrom_TMP: new Date(),
			DateTo_TMP: new Date(),
			DepartmentId: null,
			EmployeeId: null,
			GrievanceTypeId: null,
			UserId:null,
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			StatusId: 1,
		};

		$scope.newDet = {
			StatusId: null,
			ActionTaken: '',
			AssignedToId: null,
			Notes: '',
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,

		};
	}

	$scope.ClearDetails = function () {
		$scope.beData = {
			DateFrom_TMP: new Date(),
			DateTo_TMP: new Date(),
			DepartmentId: null,
			EmployeeId: null,
			GrievanceTypeId: null,
			UserId:null,
			StatusId: 1,
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			Mode: 'Save'
		};
	}

	
	$scope.GetData = function () {
		$scope.GrievanceList = [];
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			DateFrom: ($scope.beData.DateFromDet ? $filter('date')(new Date($scope.beData.DateFromDet.dateAD), 'yyyy-MM-dd') : null),
			DateTo: ($scope.beData.DateToDet ? $filter('date')(new Date($scope.beData.DateToDet.dateAD), 'yyyy-MM-dd') : null),
			DepartmentId: $scope.beData.DepartmentId,
			ForUserId: $scope.beData.UserId,
			GrievanceTypeId: $scope.beData.GrievanceTypeId,
			StatusId: $scope.beData.StatusId,
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Report/GetAllGrievanceList",
			dataType: "json",
			data: JSON.stringify(para)
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



	$scope.GetGrievanceListById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TranId: refData.TranId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetGrievanceDetailsById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newDet = res.data.Data;
				$scope.newDet.AssignedToId = res.data.Data.AssignedToId;
				$scope.newDet.SelectEmployee = $scope.EmployeeSearchOptions[0].value;
				$('#GrievanceList').modal('show');
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};


	$scope.GetGrievanceListInDetails = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TranId: refData.TranId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetGrievanceDetailsById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newDet = res.data.Data;
				$('#GrievanceListInDetails').modal('show');
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};





	$scope.IsValidGrievance = function () {
		return true;
	}

	$scope.SaveUpdateGrievance = function () {
		if ($scope.IsValidGrievance() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.beData.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					if (result.isConfirmed) {
						$scope.CallSaveUpdateGrievance();
					}
				});
			} else
				$scope.CallSaveUpdateGrievance();

		}
	};


	$scope.CallSaveUpdateGrievance = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.newDet.ActionTakenAt = new Date();
		var photo = $scope.newDet.Attachment_TMP;
		$http({
			method: 'Post',
			url: base_url + "HR/Master/SaveGrievanceForm",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				if (data.emPhoto && data.emPhoto.length > 0)
					formData.append("photo", data.emPhoto[0]);

				return formData;
			},

			data: { jsonData: $scope.newDet, emPhoto: photo }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			$('#GrievanceList').modal('hide');
			$('#GrievanceList').modal('show');

			if (res.data.IsSuccess == true) {
				$scope.ClearDetails();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}




	$scope.ShowPersonalImg = function (item) {
		$scope.viewImg = {
			ContentPath: '',
			FileType: null
		};

		if (item.Doc && item.Doc.length > 0) {
			$scope.viewImg.ContentPath = item.DocPath;
			$scope.viewImg.FileType = 'pdf';  // Assuming DocPath is for PDFs
			document.getElementById('pdfViewer').src = item.Doc;
			$('#PersonalImg').modal('show');
		} else if (item.Doc && item.Doc.length > 0) {
			$scope.viewImg.ContentPath = item.Doc;
			$scope.viewImg.FileType = 'image';  // Assuming PhotoPath is for images
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



	$scope.getEmployeeUserId = function (details) {
		if (!details.EmployeeDetails.UserId) {
			Swal.fire("There is no UserId for this employee!");
			$scope.beData.UserId = null;
			return;
		}
		$scope.beData.UserId = details.EmployeeDetails.UserId;
	};

	$scope.getEmployeeUserIdForUpdate = function (details) {
		if (!details.EmployeeDetails.UserId) {
			Swal.fire("There is no UserId for this employee!");
			$scope.beData.AssignedToId = null;
			return;
		}
		$scope.newDet.AssignedToId = details.EmployeeDetails.UserId;
	};

	

});


