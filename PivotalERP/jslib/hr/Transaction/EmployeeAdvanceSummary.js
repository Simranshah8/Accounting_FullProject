app.controller('EmployeeAdvanceSummaryController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Employee Advance Summary';
	//Monthly Expense Claim
	var columnDefs = [
		{ headerName: "Code", field: "Code", width: 110 },
		{ headerName: "Name", field: "Name", width: 200 },
		{ headerName: "Contact No", field: "ContactNo", width: 150 },
		{ headerName: "Branch", field: "Branch", width: 150 },
		{ headerName: "Department", field: "Department", width: 150 },
		{ headerName: "ServiceType", field: "ServiceType", width: 150 },
		{ headerName: "Designation", field: "Designation", width: 150 },
		{ headerName: "SubBranch", field: "SubBranch", width: 150 },
		{ headerName: "EffectiveDateAD", field: "EffectiveDateAD", width: 150 },
		{ headerName: "EffectiveDateBS", field: "EffectiveDateBS", width: 100 },
	];

	// let the grid know which columns and what data to use
	var gridOptions = {
		columnDefs: columnDefs,
		rowHeight: 31,
		headerHeight: 31,
		defaultColDef: {
			resizable: true,
			sortable: true,
			filter: true,
			resizable: true,
			cellStyle: { 'line-height': '31px' },
			rowSelection: 'multiple'
		},
	};

	// lookup the container we want the Grid to use
	var eGridDiv = document.querySelector('#myGrid1');

	// create the grid passing in the div to use together with the columns & data we want to use
	new agGrid.Grid(eGridDiv, gridOptions);
	var dataColl = [];
	dataColl.push({
		Name: 'Lorem Ipsum',
		Branch: 'Kushma'
	});
	gridOptions.api.setRowData(dataColl);


	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();


		$scope.searchData = {
			EAdvSummary: '',
		};

		$scope.newEAdvSummary = {
			EAdvSummaryId: null,
			Mode: 'Save'
		};
		

	};


});