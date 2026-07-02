app.controller('PaySlipController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Salary Sheet';


	$scope.LoadData = function () {

		$scope.entity = {
			PaySlip: 434
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


		$scope.GroupList = [];
		$http({
			method: 'Get',
			url: base_url + "HR/Master/GetAllEmployeeGroup",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.GroupList = res.data.Data;
			}  
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.newPaySlip = {
			PaySlipId: null,
			BranchId: null,
			DepartmentId: null,
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			TemplatesColl:[],
			Mode: 'Save'
		};
		$scope.LoadReportTemplates();
	}


	$scope.LoadReportTemplates = function () {

		$http({
			method: 'GET',
			url: base_url + "ReportEngine/GetReportTemplates?entityId=" + $scope.entity.PaySlip + "&voucherId=0&isTran=false",
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

			var EntityId = $scope.entity.PaySlip;

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
					EmployeeId: ($scope.newPaySlip.EmployeeDetails ? $scope.newPaySlip.EmployeeDetails.EmployeeId : 0),
					EmployeeIdColl: '',
					CompanyIdColl: '',
					EmpGroupIdColl: ($scope.newPaySlip.EmployeeGroupId ? $scope.newPaySlip.EmployeeGroupId.toString() : ''),
				};
				var paraQuery = param(rptPara);
				document.body.style.cursor = 'wait';
				document.getElementById("frmRptBillPrint").src = '';
				document.getElementById("frmRptBillPrint").src = base_url + "web/ReportViewer.aspx?" + paraQuery;
				document.body.style.cursor = 'default';
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