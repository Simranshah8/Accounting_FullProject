app.controller('ExpenseReportController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Expense Report';
	//Monthly Expense Claim
	var columnDefs = [
		{ headerName: "S.No.", field: "SNo", width: 100 },
		{ headerName: "Code", field: "Code", width: 110 },
		{ headerName: "Name", field: "Name", width: 200 },
		{ headerName: "Branch", field: "Branch", width: 150 },
		{ headerName: "Department", field: "Department", width: 150 },
		{ headerName: "Designation", field: "Designation", width: 150 },
		{ headerName: "Category", field: "Category", width: 150 },
		{ headerName: "Rate", field: "Rate", width: 150 },
		{ headerName: "Amount", field: "Amount", width: 100 },
		{ headerName: "Approved Amount", field: "ApprovedAmount", width: 150 },
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
		Rate: '1231313'
	});
	gridOptions.api.setRowData(dataColl);


	//Expenses Claim
	var columnDefs = [
		{ headerName: "S.No.", field: "SNo", width: 130 },
		{ headerName: "Code", field: "Code", width: 130 },
		{ headerName: "Name", field: "Name", width: 200 },
		{ headerName: "Branch", field: "Branch", width: 200 },
		{ headerName: "Department", field: "Department", width: 130 },
		{ headerName: "Designation", field: "Designation", width: 130 },
		{ headerName: "Exp.Category", field: "ExpCategory", width: 150 },
		{ headerName: "Amount", field: "Amount", width: 130 },
		{ headerName: "Remarks", field: "Remarks", width: 200 },
		{ headerName: "Request Date", field: "RequestDate", width: 150 },
	]

	var gridOptions1 = {
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
	var eGridDiv1 = document.querySelector('#myGrid2');
	new agGrid.Grid(eGridDiv1, gridOptions1);
	var dataColl1 = [];
	dataColl1.push({
		Name: 'Suresh',
		Amount: '121'
	});
	gridOptions1.api.setRowData(dataColl1);

	//Expenses Claim Summary
	var columnDefs = [
		{ headerName: "S.No.", field: "SNo", width: 100 },
		{ headerName: "Code", field: "Code", width: 100 },
		{ headerName: "Name", field: "Name", width: 170 },
		{ headerName: "Branch", field: "Branch", width: 150 },
		{ headerName: "Department", field: "Department", width: 150 },
		{ headerName: "Designation", field: "Designation", width: 130 },
		{ headerName: "Category", field: "Category", width: 150 },
		{ headerName: "Not Applicable", field: "NotApplicable", width: 150 },
		{ headerName: "Total", field: "Total", width: 100 },
	]

	var gridOptions3 = {
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
	var eGridDiv3 = document.querySelector('#myGrid3');
	new agGrid.Grid(eGridDiv3, gridOptions3);
	var dataColl3 = [];
	dataColl3.push({
		Name: 'Suresh',
		Amount: '121'
	});
	gridOptions3.api.setRowData(dataColl3);

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();


		$scope.searchData = {
			MonthlyExpenseClaim: '',
			ExpensesClaim: '',
			ExpensesClaimSummary: '',
		};

		$scope.newMonthlyExpenseClaim = {
			MonthlyExpenseClaimId: null,
			Mode: 'Save'
		};
		$scope.newExpensesClaim = {
			ExpensesClaimId: null,
			Mode: 'Save'
		};
		$scope.newExpensesClaimSummary = {
			ExpensesClaimSummaryId: null,
			Mode: 'Save'
		};

	};


});