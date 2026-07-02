app.controller('ProductPriceController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'ProductPrice';
	var glSrv = GlobalServices;
	  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
	$scope.LoadData = function () {
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();		

		$scope.SearchList = [{ value: 'P.Name', text: 'Name' }, { value: 'P.Code', text: 'Code' }]
		$scope.currentPages = {
			ProductPrice: 1			
		};

		$scope.searchData = {
			ProductPrice: ''
		};

		$scope.perPage = {
			ProductPrice: GlobalServices.getPerPageRow()			
		};

		$scope.newDet = {
			SearchBy: 'P.Code'
		};

		$scope.beData = {
			IncludingVat:true,
			showSalesRate: true, 
			showDateFrom: false,
			showPurchaseRate: false,
			showBatch: false,
			showMRP: false,
			showCostingRate: false,
			showSerialNo: false,
			showProductGroup: false,
			showProductType: false,
			showLastSalesRate: false,
			showLastPurchaseRate: false,
			VatRate:13,
		};

		$scope.paginationOptions = {
			pageNumber: 1,
			pageSize: 25,
			sort: null,
			SearchType: 'text',
			SearchCol: 'P.Code',
			SearchVal: '',			
			pagearray: [],
			pageOptions: [5, 10, 20, 30, 40, 50]
		};


		$scope.EPDet = {};
		$scope.EPColl = [];
		GlobalServices.getRptEntityProperties(EntityId).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EPColl = res.data.Data;
				angular.forEach($scope.EPColl, function (ep) {
					$scope.EPDet[ep.Name] = ep;
					$scope.beData[ep.Name] = ep.DefaultValue;
				});
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.GetAllProductPrice(1);
	}


	$scope.toggleBatch = function (type) {
		if (type === 'serial' && $scope.beData.showSerialNo) {
			$scope.beData.showBatch = false;
		} else if (type === 'batch' && $scope.beData.showBatch) {
			$scope.beData.showSerialNo = false;
		}
	};

	$scope.GetAllProductPrice = function (pageNo) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.ProductPriceList = [];
		var para = {
			PageNumber: pageNo,
			RowsOfPage: $scope.paginationOptions.pageSize,
			SearchBy: $scope.paginationOptions.SearchCol,
			SearchVal:$scope.paginationOptions.SearchVal,
		}
		var qry = param(para);
		$http({
			method: 'GET',
			url: base_url + "Inventory/Reporting/GetAllProductPriceList?"+qry,
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.paginationOptions.TotalRows = res.data.TotalCount;
				$scope.ProductPriceList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}


	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};
	
	    $scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };
	
	 $scope.DelListState = function () {
        GlobalServices.delListStateRpt(EntityId);
    }

    function onCellContextMenu(event) {
        GlobalServices.onCellContextMenu(event, $scope.gridOptions, contextMenu);
    }

    // Hide context menu when clicking outside
    document.addEventListener('click', function () {
        if (contextMenu.contains(event.target)) {
            return;
        }
        contextMenu.style.display = 'none';
    });

    $(document).ready(function () {
        $(this).bind("contextmenu", function (e) {
            e.preventDefault();
        });
    });

});