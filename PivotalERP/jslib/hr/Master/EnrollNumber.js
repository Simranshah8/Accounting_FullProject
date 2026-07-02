app.controller('EnrollNumberController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Enroll Number';


	$scope.LoadData = function () {

		$('.select2').select2();

		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();


		$scope.currentPages = {
			Employee: 1

		};

		$scope.searchData = {
			Employee: ''

		};

		$scope.perPage = {
			Employee: GlobalServices.getPerPageRow()

		};


		$scope.newEmployee = {
			EmployeeId: null,
			EnrollNumber: 0,
			EmployeeDetailsColl: [],
			Mode: 'Update'
		};
		$scope.newEmployee.EmployeeDetailsColl.push({});

	
		//$scope.GetAllStudentList();
		//$scope.GetAllEmployeeList();


	}
	$scope.ClearEmployee = function () {
		$scope.newEmployee = {
			EmployeeId: null,
			EnrollNumber: 0,
			EmployeeDetailsColl: [],
			Mode: 'Update'
		};
		$scope.newEmployee.EmployeeDetailsColl.push({});


	}




	//************************* Employee *********************************

	$scope.IsValidEmployee = function () {
		//if ($scope.newEmployee.EmployeeDetailsColl.CardNo.isEmpty()) {
		//	Swal.fire('Please ! Enter Card No');
		//	return false;
		//}
		//else
			return true;
	}

	$scope.GetEmployeeList = function () {

		$scope.newEmployee.EmployeeDetailsColl = [];

		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllEmployee",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newEmployee.EmployeeDetailsColl = res.data.Data;
				angular.forEach($scope.newEmployee.EmployeeDetailsColl, function (emp) {
					if (emp.EnrollNumber == null) {
						emp.EnrollNumber = 0;
					}
				});
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	};
	$scope.SaveUpdateEmployee = function () {
		if ($scope.IsValidEmployee() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newEmployee.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateEmployee();
					}
				});
			} else
				$scope.CallSaveUpdateEmployee();

		}
	};


	$scope.CallSaveUpdateEmployee = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "HR/Master/SaveEnrollNumberEmployee",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newEmployee.EmployeeDetailsColl }
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