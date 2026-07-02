app.controller('GrievanceFormController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Grievance Form';

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

		$scope.SalesManList = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetAllSalesMan",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.SalesManList = res.data.Data;
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
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.GrievanceTypeList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.ForColl = [
			{ id: 1, text: 'Employee' },
			{ id: 2, text: 'Salesman' },
		]


		$scope.beData = {
			EmployeeOrSalesman: 1,
			TranId: null,
			DateFrom_TMP: new Date(),
			DateTo_TMP: new Date(),
			SideBarData: null,
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			DepartmentId: null,
			UserId: null,
			GrievanceTypeId: null,
			StatusId: 1,
			Description: '',
			LocationOfInc: '',
			Suggestion: '',
			IncidentDate: new Date(),
			Declaration: true,
			Code: '',
			Department: '',
			Designation: '',
			ContactNo: '',
			Email: '',
			Attachment_TMP: '',
			Mode: 'Save'
		};
	}

	$scope.ClearDetails = function () {
		$scope.ClearAttachment();
		$scope.EmpDetails = {}
		$scope.beData = {
			EmployeeOrSalesman: 1,
			TranId: null,
			DateFrom_TMP: new Date(),
			DateTo_TMP: new Date(),
			SideBarData: null,
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			DepartmentId: null,
			UserId: null,
			GrievanceTypeId: null,
			StatusId: 1,
			Description: '',
			LocationOfInc: '',
			Suggestion: '',
			IncidentDate: new Date(),
			Declaration: true,
			Code: '',
			Department: '',
			Designation: '',
			ContactNo: '',
			Email: '',
			Attachment_TMP: '',
			Mode: 'Save'
		};
	}

	$scope.ClearAttachment = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.beData.AttachmentData = null;
				$scope.beData.Attachment_TMP = [];
			});

		});
		$('#choose-file').attr('src', '');
	};

	$scope.AddEmpData = function (refData, f) {
		if (f == 1) {
			if (!refData.EmployeeDetails.UserId) {
				Swal.fire("There is no UserId for this employee!");
				$scope.beData.UserId = null;
				return;
			}
		} else {
			$scope.beData.UserId = refData.UserId;
		}

		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			EmployeeOrSalesman: $scope.beData.EmployeeOrSalesman,
			EmpUserId: $scope.beData.UserId,
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetEmployeeDetByUserId",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EmpDetails = res.data.Data;
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

		if ($scope.beData.IncidentDateDet) {
			$scope.beData.IncidentDate = $filter('date')(new Date($scope.beData.IncidentDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.beData.IncidentDate = new Date();
		var photo = $scope.beData.Attachment_TMP;
		//$scope.beData.UserId = $scope.beData.EmployeeOrSalesman == 1 ? $scope.beData.EmployeeDetails.UserId : $scope.beData.UserId,

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

				data: { jsonData: $scope.beData, emPhoto: photo }
			}).then(function (res) {
				$scope.loadingstatus = "stop";
				hidePleaseWait();
				Swal.fire(res.data.ResponseMSG);
				if (res.data.IsSuccess == true) {
					$scope.ClearDetails();
				}
			}, function (errormessage) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";

			});
	}

});


