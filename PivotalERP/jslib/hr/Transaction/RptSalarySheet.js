app.controller('RptSalarySheetController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Salary Sheet';

	var gSrv = GlobalServices;

	$scope.LoadData = function () {

		$scope.entity = {
			SalarySheet: 200
		};

		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.MonthList = GlobalServices.getMonthList();
		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();

		$scope.DepartmentList = [];
		gSrv.getDepartmentList().then(function (res) {
			$scope.DepartmentList = res.data.Data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.CategoryList = [];
		gSrv.getCategoryList().then(function (res) {
			$scope.CategoryList = res.data.Data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.AcademicYearColl = [];
		$scope.AcademicYearColl = gSrv.getYearList();

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
					BranchIdColl: ($scope.newPaySlip.BranchId ? $scope.newPaySlip.BranchId : ''),
					DepartmentIdColl: ($scope.newPaySlip.DepartmentId ? $scope.newPaySlip.DepartmentId : ''),
					CategoryIdColl: ($scope.newPaySlip.CategoryId ? $scope.newPaySlip.CategoryId : ''),
					EmployeeId: ($scope.newPaySlip.EmployeeId ? $scope.newPaySlip.EmployeeId : 0),
					EmployeeIdColl: '',
					CompanyIdColl: '',
				};
				var paraQuery = param(rptPara);
 

				$scope.loadingstatus = 'running';
				document.getElementById("frmRptBillPrint").src = '';
				document.getElementById("frmRptBillPrint").style.width = '100%';
				document.getElementById("frmRptBillPrint").style.height = '1300px';
				document.getElementById("frmRptBillPrint").style.visibility = 'visible';
				document.getElementById("frmRptBillPrint").src = base_url + "Attendance/Report/RdlSalarySheet?" + paraQuery;
				 
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