app.controller('EmployeeQuickAccessController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Quick Access';
        OnClickDefault();
    $scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();
		$scope.MonthList = GlobalServices.getMonthList();
		$scope.YearList = GlobalServices.getYearList();

		

		$scope.currentPages = {
			ELeaveTaken: 1,
			EMeritRemarks: 1,
			EDemeritRemarks: 1,
			EOtherRemarks: 1,
			Epayrolllist: 1

		};

		$scope.perPage = {
			ELeaveTaken: GlobalServices.getPerPageRow(),
			EMeritRemarks: GlobalServices.getPerPageRow(),
			EDemeritRemarks: GlobalServices.getPerPageRow(),
			EOtherRemarks: GlobalServices.getPerPageRow(),
			Epayrolllist: GlobalServices.getPerPageRow()
		};

		$scope.searchData = {
			EmpRemarks: '',
			ELeaveTaken: '',
			LeaveTaken: '',
			EMeritRemarks: '',
			EDemeritRemarks: '',
			EOtherRemarks: '',
			Epayrolllist: ''
		};

		$scope.GenderColl = [
			{ id: 1, text: 'Male' },
			{ id: 2, text: 'Female' },
			{ id: 3, text: 'Others' },
		]
		$scope.newEmp = {
			EmployeeId: 0,
			DateFrom_TMP: new Date(),
			DateTo_TMP: new Date(),
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
		};


		//for document
		$scope.DocumentList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllDocument",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DocumentList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		//Employee Quick Access
		$scope.newEQuickAccess =
		{
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			EmployeeId: null,
			//PhotoPath: '~/wwwroot/dynamic/images/avatar-img.jpeg'
		};
		//Ends


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
		//for color
		$scope.AttendanceColors = {};
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/GetAllAttendanceColorConfig",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AttendanceColors = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


    };

	function OnClickDefault() {

        document.getElementById('Eform-edit').style.display = "none";
        // Default show Profile
        $('.profilee').show();
        $('.attendancee, .remarkse, .payrolle, .documente').hide();
        $('.card-pe').addClass('current-page');
        $('.card-1e, .card-2e, .card-3e, .card-9e').removeClass('current-page');

        

        // Profile
        $('.card-pe').click(function () {
            $('.profilee').show();
            $('.attendancee, .remarkse, .payrolle, .documente').hide();
            $('.card-pe').addClass('current-page');
            $('.card-1e, .card-2e, .card-3e, .card-9e').removeClass('current-page');
        });

        // Attendance
        $('.card-1e').click(function () {
            $('.attendancee').show();
            $('.profilee, .remarkse, .payrolle, .documente').hide();
            $('.card-1e').addClass('current-page');
            $('.card-pe, .card-2e, .card-3e, .card-9e').removeClass('current-page');
        });

        // Remarks
        $('.card-2e').click(function () {
            $('.remarkse').show();
            $('.profilee, .attendancee, .payrolle, .documente').hide();
            $('.card-2e').addClass('current-page');
            $('.card-pe, .card-1e, .card-3e, .card-9e').removeClass('current-page');
        });

        // payroll
        $('.card-3e').click(function () {
            $('.payrolle').show();
            $('.profilee, .attendancee, .remarkse, .documente').hide();
            $('.card-3e').addClass('current-page');
            $('.card-pe, .card-1e, .card-2e, .card-9e').removeClass('current-page');
        });

        // Document
        $('.card-9e').click(function () {
            $('.documente').show();
            $('.profilee, .attendancee, .remarkse, .payrolle').hide();
            $('.card-9e').addClass('current-page');
            $('.card-pe, .card-1e, .card-2e, .card-3e').removeClass('current-page');
        });


        document.getElementById('editbtn').onclick = function () {
            document.getElementById('Eform-data').style.display = "none";
            document.getElementById('Eform-edit').style.display = "block";
        }

        document.getElementById('EBack').onclick = function () {
            document.getElementById('Eform-edit').style.display = "none";
            document.getElementById('Eform-data').style.display = "block";
        }
	}

	$scope.GetEmployeeById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			EmployeeId: refData.EmployeeId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Report/getEmployeeById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.updateEmployeePF = res.data.Data;

				if ($scope.updateEmployeePF.DOB_AD) {
					$scope.updateEmployeePF.DOB_AD_TMP = new Date($scope.updateEmployeePF.DOB_AD);
				}
				$scope.updateEmployeePF.Mode = 'Modify';
				document.getElementById('Eform-data').style.display = "none";
				document.getElementById('Eform-edit').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	};



	$scope.UpdateEmployee = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.updateEmployeePF.DOB_ADDet) {
			$scope.updateEmployeePF.DOB_AD = $filter('date')(new Date($scope.updateEmployeePF.DOB_ADDet.dateAD), 'yyyy-MM-dd');;
		} else
			$scope.updateEmployeePF.DOB_AD = null;


		$http({
			method: 'POST',
			url: base_url + "HR/Report/UpdateEmployee",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));


				return formData;
			},
			data: { jsonData: $scope.updateEmployeePF }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();


			if (res.data.IsSuccess == true) {
				Swal.fire(res.data.ResponseMSG);
				$scope.getEQuickAccess();
				document.getElementById('Eform-data').style.display = "block";
				document.getElementById('Eform-edit').style.display = "none";
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}



	$scope.getEQuickAccess = function () {
		// Display Profile
		$scope.EmpAttachmentColl = [];
		if ($scope.newEQuickAccess.EmployeeId) {
			var para = {
				EmployeeId: $scope.newEQuickAccess.EmployeeId
			};
			$http({
				method: 'POST',
				url: base_url + "HR/Report/getEmployeeById",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				if (res.data.IsSuccess && res.data.Data) {
					$scope.EmployeePF = res.data.Data;

					// Default profile photo if not available
					if ($scope.EmployeePF.PhotoPath && $scope.EmployeePF.PhotoPath.length == 0)
						$scope.EmployeePF.PhotoPath = '/wwwroot/dynamic/images/avatar-img.jpeg';
					else if (!$scope.EmployeePF.PhotoPath)
						$scope.EmployeePF.PhotoPath = '/wwwroot/dynamic/images/avatar-img.png';

					$scope.EmpAttachmentColl = res.data.Data.AttachmentColl || [];
					$scope.EmpAttachmentColl.forEach(function (att) {
						if (att.Extension === '.pdf') {
							att.DocPathimg = '~/dynamic/images/flaticons/pdf.png';
						} else {
							att.DocPathimg = att.DocPath; // actual image path
						}
					});
				}
				// Call other functions after data is loaded
				$timeout(function () {
					$scope.getEmpAttendance();
				});

			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		}
	};




	$scope.ShowEmpDocPdf = function (item) {
		$scope.viewImg = {
			ContentPath: '',
			FileType: null
		};

		if (item.DocPath && item.DocPath.length > 0) {
			$scope.viewImg.ContentPath = item.DocPath;
			$scope.viewImg.FileType = 'pdf';  // Assuming DocPath is for PDFs
			document.getElementById('pdfViewer').src = item.DocPath;
			$('#EmpDocView').modal('show');
		} else if (item.PhotoPath && item.PhotoPath.length > 0) {
			$scope.viewImg.ContentPath = item.PhotoPath;
			$scope.viewImg.FileType = 'image';  // Assuming PhotoPath is for images
			$('#EmpDocView').modal('show');
		} else if (item.File) {
			var blob = new Blob([item.File], { type: item.File?.type });
			$scope.viewImg.ContentPath = URL.createObjectURL(blob);
			$scope.viewImg.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';

			if ($scope.viewImg.FileType === 'pdf') {
				document.getElementById('pdfViewer').src = $scope.viewImg.ContentPath;
			}

			$('#EmpDocView').modal('show');
		} else {
			Swal.fire('No Image Found');
		}
	};



	$scope.getEmployeepayroll = function () {

		$scope.EmppayrollColl = [];

		if ($scope.newEQuickAccess.EmployeeId) {

			$scope.loadingstatus = "running";
			showPleaseWait();
			var para = {
				EmployeeId: $scope.newEQuickAccess.EmployeeId
			};
			$http({
				method: 'POST',
				url: base_url + "HR/Report/GetEmppayrollForQuickAccess",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					// Process the received data
					$scope.EmppayrollColl = res.data.Data;

				} else {
					Swal.fire(res.data.ResponseMSG);
				}

			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		}
	}
	
	$scope.getEmployeeRemarks = function () {

		/*	$scope.EmpRemarksColl = [];*/
		$scope.EmpMeritRemarksColl = [];
		$scope.EmpDemeritRemarksColl = [];
		$scope.EmpOthersRemarksColl = [];

		if ($scope.newEQuickAccess.EmployeeId) {

			$scope.loadingstatus = "running";
			showPleaseWait();
			var para = {
				EmployeeId: $scope.newEQuickAccess.EmployeeId
			};
			$http({
				method: 'POST',
				url: base_url + "HR/Report/GetEmpRemarksForQuickAccess",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					// Process the received data
					/*$scope.EmpRemarksColl = res.data.Data;*/
					$scope.EmpMeritRemarksColl = [];
					$scope.EmpDemeritRemarksColl = [];
					$scope.EmpOthersRemarksColl = [];

					res.data.Data.forEach(function (dt) {
						if (dt.RemarksFor == 'MERITS')
							$scope.EmpMeritRemarksColl.push(dt)
						else if (dt.RemarksFor == 'DEMERITS')
							$scope.EmpDemeritRemarksColl.push(dt)
						else
							$scope.EmpOthersRemarksColl.push(dt)

					});

				} else {
					Swal.fire(res.data.ResponseMSG);
				}

			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		}

	}
	$scope.getEmpAttendance = function () {
		if (!$scope.newMonthly.YearId) {
			Swal.fire("Please select a year first.");
			return;
		}

		// Reset totals
		$scope.newEmp.TotalDays = 0;
		$scope.newEmp.TotalPresent = 0;
		$scope.newEmp.TotalAbsent = 0;
		$scope.newEmp.TotalWeekEnd = 0;
		$scope.newEmp.TotalHoliday = 0;

		showPleaseWait();

		// FromDate = start of the selected year
		var fromDate = $scope.newMonthly.YearId + '-01-01';

		// ToDate = today's date
		var today = new Date();
		var toDate = today.getFullYear() + '-' +
			('0' + (today.getMonth() + 1)).slice(-2) + '-' +
			('0' + today.getDate()).slice(-2);

		var para = {
			employeeId: $scope.newEQuickAccess.EmployeeId,
			fromDate: fromDate,
			toDate: toDate
		};

		$scope.loadingstatus = "running";

		$http({
			method: 'POST',
			url: base_url + "HR/Report/GetEmpWiseAttendance",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

			if (res.data.IsSuccess) {
				var dataColl = res.data.Data;

				var query = mx(dataColl);
				$scope.newEmp.TotalDays = dataColl.length;
				$scope.newEmp.TotalPresent = query.count(p1 => p1.IsPresent == true);
				$scope.newEmp.TotalWeekEnd = query.count(p1 => p1.IsWeekEnd == true);
				$scope.newEmp.TotalHoliday = query.count(p1 => p1.IsHoliday == true);
				$scope.newEmp.TotalAbsent = dataColl[0]?.TotalAbsent || (
					$scope.newEmp.TotalDays - $scope.newEmp.TotalWeekEnd - $scope.newEmp.TotalPresent - $scope.newEmp.TotalHoliday
				);

				//  Monthly grouping
				var monthlyData = [];
				var monthMap = {};

				dataColl.forEach(function (d) {
					var dt = new Date(d.DateAD);
					var year = dt.getFullYear();
					var month = dt.getMonth(); // 0-11
					var key = year + '-' + (month + 1);
					var day = dt.getDate();

					if (!monthMap[key]) {
						monthMap[key] = {
							MonthName: dt.toLocaleString('default', { month: 'long' }) + ' ' + year,
							TotalDays: 0,
							TotalPresent: 0,
							TotalAbsent: 0,
							TotalLeave: 0,
							TotalWeekend: 0,
							TotalHoliday: 0
						};
						for (var i = 1; i <= 32; i++) monthMap[key]['Day' + i] = '';
					}

					var cellValue = '';
					if (d.IsHoliday) cellValue = 'H';
					else if (d.IsWeekEnd) cellValue = 'W';
					else if (d.IsPresent) cellValue = 'P';
					else cellValue = 'A';

					monthMap[key]['Day' + day] = cellValue;

					monthMap[key].TotalDays += 1;
					if (d.IsPresent) monthMap[key].TotalPresent += 1;
					if (d.IsWeekEnd) monthMap[key].TotalWeekend += 1;
					if (d.IsHoliday) monthMap[key].TotalHoliday += 1;
					if (!d.IsPresent && !d.IsWeekEnd && !d.IsHoliday) monthMap[key].TotalAbsent += 1;
					if (d.IsLeave) monthMap[key].TotalLeave += 1;
				});

				for (var key in monthMap) monthlyData.push(monthMap[key]);

				$scope.EmployeeAttendanceColl = monthlyData;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed ' + reason);
		});
	};



	

});