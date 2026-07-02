
app.controller('misCompetitorSalesCtrl', function ($scope, $http, $filter, companyDet) {
    LoadData();


  
    function LoadData() {


       


    }

	$scope.PrintCompetitorSales = function () {
		$scope.loadingstatus = 'running';
		document.getElementById("frmRptTabulation").src = '';
		document.getElementById("frmRptTabulation").style.width = '100%';
		document.getElementById("frmRptTabulation").style.height = '1300px';
		document.getElementById("frmRptTabulation").style.visibility = 'visible';
		document.getElementById("frmRptTabulation").src = base_url + "Inventory/Reporting/RdlCompetitorSales";


	};
});



app.controller('misWeeklySalesCtrl', function ($scope, $http, $filter, companyDet) {
	LoadData();



	function LoadData() {





	}

	$scope.PrintCompetitorSales = function () {
		$scope.loadingstatus = 'running';
		document.getElementById("frmRptTabulation").src = '';
		document.getElementById("frmRptTabulation").style.width = '100%';
		document.getElementById("frmRptTabulation").style.height = '1300px';
		document.getElementById("frmRptTabulation").style.visibility = 'visible';
		document.getElementById("frmRptTabulation").src = base_url + "Inventory/Reporting/RdlWeeklySales";


	};
});