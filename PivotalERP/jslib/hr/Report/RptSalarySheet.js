app.controller('RptSalarySheetController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Salary Sheet';

	$scope.LoadData = function () {

		$scope.entity = {
			SalarySheet: 200
		};

		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.MonthList = GlobalServices.getMonthList();
		$scope.YearList = GlobalServices.getYearList();
		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();

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

		//for branch
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

		//for department
		$scope.DepartmentList = [];
		$scope.DepartmentList_QRY = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllDepartment",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DepartmentList = res.data.Data;
                $scope.DepartmentList_QRY = mx(res.data.Data);
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        //CategoryList
        $scope.CategoryList = [];
        $scope.CategoryList_QRY = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllCategory",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CategoryList = res.data.Data;
                $scope.CategoryList_QRY = mx(res.data.Data);
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


		$scope.newPaySlip = {
			PaySlipId: null,
			BranchId: null,
			DepartmentId: null,
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			TemplatesColl: [],
			Mode: 'Save'
		};
		$scope.LoadReportTemplates();
	}


	$scope.LoadReportTemplates = function () {

		$http({
			method: 'GET',
			url: base_url + "ReportEngine/GetReportTemplates?entityId=" + $scope.entity.SalarySheet + "&voucherId=0&isTran=false",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data)
				$scope.newPaySlip.TemplatesColl = res.data.Data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.PrintPaySlip = function () {

		if ($scope.newPaySlip.YearId && $scope.newPaySlip.YearId > 0 && $scope.newPaySlip.MonthId && $scope.newPaySlip.MonthId > 0) {

			var EntityId = $scope.entity.SalarySheet;

			if ($scope.newPaySlip.RptTranId > 0) {
				var rptPara = {
					rpttranid: $scope.newPaySlip.RptTranId,
					istransaction: false,
					entityid: EntityId,
					YearId: $scope.newPaySlip.YearId,
					MonthId: $scope.newPaySlip.MonthId,
					BranchIdColl: ($scope.newPaySlip.SelectedBranch ? $scope.newPaySlip.SelectedBranch.BranchId : ''),
					DepartmentIdColl: ($scope.newPaySlip.SelectedDepartment ? $scope.newPaySlip.SelectedDepartment.DepartmentId : ''),
					CategoryIdColl: ($scope.newPaySlip.SelectedCategory ? $scope.newPaySlip.SelectedCategory.CategoryId : ''),
					EmployeeId: ($scope.newPaySlip.EmployeeId ? $scope.newPaySlip.EmployeeId : 0),
					EmployeeIdColl: '',
					CompanyIdColl: '',
					Branch: ($scope.newPaySlip.SelectedBranch ? $scope.newPaySlip.SelectedBranch.Name : ''),
					Department: ($scope.newPaySlip.SelectedDepartment ? $scope.newPaySlip.SelectedDepartment.Name : ''),
					Category: ($scope.newPaySlip.SelectedCategory ? $scope.newPaySlip.SelectedCategory.Name : ''),
				};
				var paraQuery = param(rptPara);
 

				$scope.loadingstatus = 'running';
				document.getElementById("frmRptBillPrint").src = '';
				document.getElementById("frmRptBillPrint").style.width = '100%';
				document.getElementById("frmRptBillPrint").style.height = '1300px';
				document.getElementById("frmRptBillPrint").style.visibility = 'visible';
				document.getElementById("frmRptBillPrint").src = base_url + "HR/Report/RdlSalarySheet?" + paraQuery;
				 
			} else {
				document.body.style.cursor = 'wait';
				document.getElementById("frmRptBillPrint").src = '';
				document.body.style.cursor = 'default';
			}

		} else {

			document.body.style.cursor = 'wait';
			document.getElementById("frmRptBillPrint").src = '';
			document.body.style.cursor = 'default';

			return;
		}




	};

	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};
});