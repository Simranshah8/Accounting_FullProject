app.controller('InOutController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'InOutDetails';
	$('.select2').select2();
	LoadData();
	function LoadData() {

		$scope.newInOutDet = {
			FromDate_TMP: new Date(),
			ToDate_TMP: new Date(),
		};

		$scope.entity = {
			InOutDetails: EntityId
		};

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

		$scope.BranchList = [];
		$http({
			method: 'GET',
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
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DepartmentList = res.data.Data;
			} 
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		//designation
		$scope.DesignationList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllDesignation",
			dataType: "json"
		}).then(function (res) {		 
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DesignationList = res.data.Data;
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
			if (res.data.IsSuccess && res.data.Data) {
				$scope.LevelList = res.data.Data;
			}  
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$http({
			method: 'GET',
			url: base_url + "ReportEngine/GetReportTemplates?entityId=" + $scope.entity.InOutDetails + "&voucherId=0&isTran=false",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data)
				$scope.newInOutDet.TemplatesColl = res.data.Data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.PrintInOutDet = function () {
		if ($scope.newInOutDet.FromDateDet && $scope.newInOutDet.ToDateDet) {

			var EntityId = $scope.entity.Tabulation;

			var rptPara = {
				dateFrom: $filter('date')($scope.newInOutDet.FromDateDet.dateAD, 'yyyy-MM-dd'),
				dateTo: $filter('date')($scope.newInOutDet.ToDateDet.dateAD, 'yyyy-MM-dd'),
				dateFromBS: $scope.newInOutDet.FromDateDet.dateBS,
				dateToBS: $scope.newInOutDet.ToDateDet.dateBS,
				period: $scope.newInOutDet.FromDateDet.dateBS + ' TO ' + $scope.newInOutDet.ToDateDet.dateBS,
				rptTranId: $scope.newInOutDet.RptTranId,
				BranchIdColl: $scope.newInOutDet.BranchIdColl ? $scope.newInOutDet.BranchIdColl.toString() : '',
				DepartmentIdColl: $scope.newInOutDet.DepartmentIdColl ? $scope.newInOutDet.DepartmentIdColl.toString() : '',
				DesignationIdColl: $scope.newInOutDet.DesignationIdColl ? $scope.newInOutDet.DesignationIdColl.toString() : '',
				LevelIdColl: $scope.newInOutDet.LevelIdColl ? $scope.newInOutDet.LevelIdColl.toString() : '',
				CompanyIdColl: $scope.newInOutDet.CompanyIdColl ? $scope.newInOutDet.CompanyIdColl.toString() : '',
			};
			var paraQuery = param(rptPara);

			$scope.loadingstatus = 'running';
			document.getElementById("frmRptTabulation").src = '';
			document.getElementById("frmRptTabulation").style.width = '100%';
			document.getElementById("frmRptTabulation").style.height = '1300px';
			document.getElementById("frmRptTabulation").style.visibility = 'visible';
			document.getElementById("frmRptTabulation").src = base_url + "HR/Report/RdlEmpDateWiseInOut?" + paraQuery;

		}

	};

});