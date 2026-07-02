

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("CancelVoucherSummaryList", function ($scope, $http, $filter, $timeout, uiGridConstants, uiGridTreeViewConstants, GlobalServices) {
    $scope.Title = 'CancelVoucherSummaryList';
	
	  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    var glSrv = GlobalServices;
    LoadData();


    function Numberformat(val) {

        if (!val || val == 0)
            return '';
        return $filter('number')(val, 2);
    }

    function NumberformatAC(val) {
        if (val > 0)
            return $filter('number')(val, 2) + ' DR';
        else if (val < 0)
            return $filter('number')(val, 2) + ' CR';
        else
            return '';

    }
    $scope.DateFormatAD = function (date) {

        if (date) {
            date = new Date(date);
            return $filter('date')(date, 'yyyy-MM-dd');
        }

        return '';
    };
    $scope.padLeft = function (nr, n, str) {

        if (nr && n)
            return Array(n - String(nr).length + 1).join(str || '0') + nr;
        return '';
    };
    $scope.DateFormatBS = function (ny, nm, nd) {
        if (ny && nm && nd)
            return ny + '-' + $scope.padLeft(nm, 2) + '-' + $scope.padLeft(nd, 2);
        return '';
    };

    $scope.DataColl = [];

    function LoadData() {
        $('.select2').select2()
        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: glSrv.getPerPageRow(),
            sort: null,
            SearchType: 'text',
            SearchCol: '',
            SearchVal: '',
            SearchColDet: null,
            pagearray: [],
            pageOptions: [5, 10, 20, 30, 40, 50]
        };
        $scope.VoucherSearchOptions = [{ text: 'Name', value: 'ADS.Name', searchType: 'Text' }, { text: 'Group', value: 'TS.Group', searchType: 'text' }, { text: 'Code', value: 'TS.Code', searchType: 'number' }, { text: 'Alias', value: 'V.Alias', searchType: 'text' }, { text: 'PartNo', value: 'CC.PartNo', searchType: 'text' }, { text: 'Remarks', value: 'LL.Remarks', searchType: 'text' }];

        $scope.confirmMSG = {
            Accept: false,
            Decline: false,
            Delete: false,
            Modify: false,
            Print: false,
            Reset: false
        };
        $scope.HideShow = {
            VoucherType: false,
            CostClass: false,
            AutoVoucherNo: false,
            Agent: true,
            Currency: true,
            RefNo: true,
        };

        //Number,Amount,Date,Text
        $scope.BranchTypeColl = [];
        $scope.VoucherTypeColl = [];
        $scope.LedgerGroupTypeColl = [];
        $scope.ExpressionColl = GlobalServices.getExpression();
        $scope.ConditionColl = GlobalServices.getLogicCondition();
        $scope.ReportTypeColl = [{ text: 'PendingOnly', value: 'PendingOnly', dataType: 'text' }, { text: 'ClearOnly', value: 'ClearOnly', dataType: 'text' }, { text: 'Both', value: 'Both', dataType: 'text' },]
        $scope.FilterColumnColl = [{ text: 'VoucherDate', value: 'VoucherDate', dataType: 'Date' }, { text: 'VoucherName', value: 'VoucherName', dataType: 'text' }, { text: 'VoucherNo', value: 'VoucherNo', dataType: 'Number' }, { text: 'AutoVoucherNo', value: 'AutoVoucherNo', dataType: 'Number' }, { text: 'CostClassName', value: 'CostClassName', dataType: 'text' }, { text: 'Narration', value: 'Narration', dataType: 'text' }, { text: 'NDay', value: 'NDay', dataType: 'text' }, { text: 'NMonth', value: 'NMonth', dataType: 'text' }, { text: 'NYear', value: 'NYear', dataType: 'text' }, { text: 'Particulars', value: 'Particulars', dataType: 'text' }, { text: 'RefNo', value: 'RefNo', dataType: 'number' }, { text: 'UserName', value: 'UserName', dataType: 'text' }, { text: 'DrAmount', value: 'DrAmount', dataType: 'Number' }, { text: 'CrAmount', value: 'CrAmount', dataType: 'Number' }];
        $scope.para = {
            dateFrom: new Date(),
            dateTo: new Date(),
            BranchType: 0,

            LedgerType: 0,
            LedgerId: 0,
            LedgerName: '',
            ItemDetailsColl: [],
            BranchId: 0,
            VoucherId: 0,
            VoucherName: '',
            Ledger: '',
            LedgerGroup: '',
            LedgerGroupId: 0,
            LedgerId: 0

        };

        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchTypeColl = res.data.Data;
                $('#cboVoucherType').select2({
                    placeholder: '*** Select Branch Type ***',
                    allowClear: true,
                    openOnEnter: true,
                    width: '100%',
                    multiple: false,
                    data: $scope.BranchTypeColl
                });

                $('#cboVoucherType').on("change", function (e) {
                    //$scope.gridOptions.columnApi.getColumnState();
                    //$scope.gridOptions.columnApi.applyColumnState({
                    //    state: window.colState,
                    //    applyOrder: true,
                    //});

                    var selectedData = $('#cboVoucherType').select2('data');
                    if (selectedData && selectedData.length > 0) {
                        $scope.para.BranchType = selectedData[0].id;
                        $scope.LoadReport();
                    } else {
                        $scope.para.BranchType = 0;
                    }

                });
            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        //if (VoucherType) {

        //    $http({
        //        method: 'GET',
        //        url: base_url + "Setup/Security/GetConfirmationMSG",
        //        dataType: "json"
        //    }).then(function (res) {
        //        if (res.data.IsSuccess && res.data.Data) {
        //            $scope.confirmMSG = res.data.Data;
        //        } else {
        //            Swal.fire(res.data.ResponseMSG);
        //        }

        //    }, function (reason) {
        //        Swal.fire('Failed' + reason);
        //    });

        //    $http({
        //        method: 'GET',
        //        url: base_url + "Account/Creation/GetVoucherWiseNarration?voucherType=" + VoucherType,
        //        dataType: "json"
        //    }).then(function (res) {
        //        if (res.data.IsSuccess && res.data.Data) {
        //            $scope.NarrationList = res.data.Data;
        //        } else
        //            Swal.fire(res.data.ResponseMSG);
        //    }, function (reason) {
        //        Swal.fire('Failed' + reason);
        //    });


        //    $http({
        //        method: 'GET',
        //        url: base_url + "Setup/Security/GetAccountConfig",
        //        dataType: "json"
        //    }).then(function (res1) {
        //        if (res1.data.IsSuccess && res1.data.Data) {
        //            $scope.Config = res1.data.Data;

        //            $timeout(function () {
        //                $scope.$apply(function () {

        //                    //if ($scope.Config.AllowSchamePer == true)
        //                    //    $scope.HideShow.SchemePer = false;
        //                    //else
        //                    //    $scope.HideShow.SchemePer = true;


        //                });
        //            });
        //        }
        //    }, function (reason) {
        //        Swal.fire('Failed' + reason);
        //    });

        //    $http({
        //        method: 'GET',
        //        url: base_url + "Account/Creation/GetVoucherList?voucherType=" + VoucherType,
        //        dataType: "json"
        //    }).then(function (res) {
        //        if (res.data.IsSuccess && res.data.Data) {
        //            $scope.VoucherTypeColl = res.data.Data;

        //            $http({
        //                method: 'GET',
        //                url: base_url + "Account/Creation/GetCostClassForEntry",
        //                dataType: "json"
        //            }).then(function (res1) {
        //                if (res1.data.IsSuccess && res1.data.Data) {
        //                    $scope.CostClassColl = res1.data.Data;

        //                    $timeout(function () {
        //                        $scope.$apply(function () {
        //                            if ($scope.VoucherTypeColl.length > 0) {
        //                                $scope.SelectedVoucher = $scope.VoucherTypeColl[0];
        //                                $scope.beData.VoucherId = $scope.SelectedVoucher.VoucherId;
        //                            }

        //                            if ($scope.CostClassColl.length > 0) {
        //                                $scope.SelectedCostClass = $scope.CostClassColl[0];
        //                                $scope.beData.CostClassId = $scope.SelectedCostClass.CostClassId;
        //                            }

        //                            if ($scope.VoucherTypeColl.length <= 1)
        //                                $scope.HideShow.VoucherType = true;
        //                            else
        //                                $scope.HideShow.VoucherType = false;

        //                            if ($scope.CostClassColl.length <= 1)
        //                                $scope.HideShow.CostClass = true;
        //                            else
        //                                $scope.HideShow.CostClass = false;

        //                            $scope.getVoucherNo();

        //                            $timeout(function () {

        //                                if (TranId && TranId > 0) {
        //                                    var para = {
        //                                        tranId: TranId
        //                                    };
        //                                    $http({
        //                                        method: 'POST',
        //                                        url: base_url + "Account/Transaction/GetReceiptById",
        //                                        dataType: "json",
        //                                        data: JSON.stringify(para)
        //                                    }).then(function (res) {
        //                                        $timeout(function () {
        //                                            if (res.data.IsSuccess && res.data.Data) {
        //                                                var tran = res.data.Data;
        //                                                $scope.SetData(tran);
        //                                            }
        //                                        });
        //                                    }, function (reason) {
        //                                        Swal.fire('Failed' + reason);
        //                                    });
        //                                }
        //                            });

        //                        });
        //                    });


        //                }
        //            }, function (reason) {
        //                Swal.fire('Failed' + reason);
        //            });

        //        }
        //    }, function (reason) {
        //        Swal.fire('Failed' + reason);
        //    });

        //}

        getterAndSetter();



    }



    $http({
        method: 'GET',
        url: base_url + "Account/Reporting/GetAllVoucherList",
        dataType: "json"
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.VoucherTypeColl = res.data.Data;
            $('#cboVoucher').select2({
                placeholder: '*** Select Voucher Type ***',
                allowClear: true,
                openOnEnter: true,
                width: '100%',
                multiple: false,
                data: $scope.VoucherTypeColl
            });

            $('#cboVoucher').on("change", function (e) {
                //$scope.gridOptions.columnApi.getColumnState();
                //$scope.gridOptions.columnApi.applyColumnState({
                //    state: window.colState,
                //    applyOrder: true,
                //});

                var selectedData = $('#cboVoucher').select2('data');
                if (selectedData && selectedData.length > 0) {
                    $scope.para.VoucherType = selectedData[0].id;
                    $scope.LoadReport();
                } else {
                    $scope.para.VoucherType = 0;
                }

            });
        } else {
            Swal.fire(res.data.ResponseMSG);
        }

    }, function (reason) {
        Swal.fire('Failed' + reason);
    });

    function getterAndSetter() {


        $scope.gridOptions = [];

        $scope.gridOptions = {
			onCellContextMenu: onCellContextMenu, // Handle right-click event			
            showGridFooter: true,
            showColumnFooter: true,
            useExternalPagination: false,
            useExternalSorting: false,
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: true,
            enableSelectAll: true,
            enableGridMenu: true,
            showTreeExpandNoChildren: true,

            columnDefs: [
                {
                    name: "VoucherDate", displayName: "VoucherDate", width: 150, aggregationType: uiGridConstants.aggregationTypes.count,
                    headerCellClass: $scope.highlightFilteredHeader, cellStyle: { 'text-align': 'center' }, headerCellClass: 'headerAligment', footerCellTemplate: '<div class="ui-grid-cell-contents" >ROWS: {{col.getAggregationValue() | number:0 }}</div>'
                },

                { name: "VoucherDateBS", field: "VoucherDateBS", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                { name: "VoucherName", field: "VoucherName", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                { name: "VoucherNo", field: "VoucherNo", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                { name: "VoucherType", field: "VoucherType", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                { name: "Branch", field: "Branch", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                { name: "CreateBy", field: "CreateBy", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                { name: "CancelBy", field: "CancelBy", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                { name: "LogDateTime", field: "LogDateTime", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                { name: "CancelDateTime", field: "CancelDateTime", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return Numberformat(params.value); } },
              ],
            //   rowTemplate: rowTemplate(),
            exporterCsvFilename: 'Ledgerwise.csv',
            exporterPdfDefaultStyle: { fontSize: 9 },
            exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
            exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'blue' },
            exporterPdfHeader: { text: "Dynamic Technosoft Pvt. Ltd. <br> Birgunj Nepal", style: 'headerStyle' },
            exporterPdfFooter: function (currentPage, pageCount) {
                return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
            },
            exporterPdfCustomFormatter: function (docDefinition) {
                docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                return docDefinition;
            },
            exporterPdfOrientation: 'portrait',
            exporterPdfPageSize: 'LETTER',
            exporterPdfMaxGridWidth: 500,
            exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
            exporterExcelFilename: 'daybook.xlsx',
            exporterExcelSheetName: 'DayBook',
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;

                //$scope.gridApi.grid.registerRowsProcessor($scope.singleFilter, 200);

                // Setup events so we're notified when grid state changes.
                //$scope.gridApi.colMovable.on.columnPositionChanged($scope, saveState);
                //$scope.gridApi.colResizable.on.columnSizeChanged($scope, saveState);
                //  $scope.gridApi.grouping.on.aggregationChanged($scope, saveState);
                // $scope.gridApi.grouping.on.groupingChanged($scope, saveState);
                //$scope.gridApi.core.on.columnVisibilityChanged($scope, saveState);
                //$scope.gridApi.core.on.filterChanged($scope, saveState);
                //$scope.gridApi.core.on.sortChanged($scope, saveState);

            }
        };


        //$http({
        //    method: 'GET',
        //    url: base_url + "Global/GetListState?entityId=" + EntityId + "&isReport=true",
        //    dataType: "json"
        //}).then(function(res) {
        //    if (res.data.IsSuccess && res.data.Data) {
        //        if ($scope.gridApi) {
        //            if ($scope.gridApi.saveState) {
        //                var state = JSON.parse(res.data.Data);

        //                $scope.gridApi.saveState.restore($scope, state);
        //            }
        //        }
        //    } else {
        //        Swal.fire(res.data.ResponseMSG);
        //    }

        //}, function(reason) {
        //    Swal.fire('Failed' + reason);
        //});

 $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
		
    };

    //function saveState() {
    //    var state = $scope.gridApi.saveState.save();
    //  //  localStorageService.set('gridState', state);
    //}

    function rowTemplate() {    //custom rowtemplate to enable double click and right click menu options

        return '<div ng-dblclick="grid.appScope.rowDblClick(row)"  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell context-menu="grid.appScope.contextmenuOptions(row)"  data-target="myMenu" ></div>'

    }

    $scope.rowDblClick = function (row) {
        alert('Row double-clicked!\n' + 'Full Name  --> ' + row.entity.VoucherType + ' ' + row.entity.VoucherName)
        //add code here 

    };


    $scope.contextmenuOptions = function (row) {
        console.log("contextmenuOptions called");
        console.log(row);

        var contextMenuData = [];

        $scope.rightClickedRow = row;

        contextMenuData.push(['Show Document Of Selected Voucher', function () {
            alert('Menu Option1 clicked!\n' + 'Full Name -->' + row.entity.VoucherType + ' ' + row.entity.VoucherName)
        }]);

        contextMenuData.push(['Cancel Selected Voucher', function () {
            alert('Menu Option2 clicked!\n' + 'Full Name -->' + row.entity.VoucherType + ' ' + row.entity.VoucherName)

        }]);


        return contextMenuData
    }


    $scope.LoadReport = function () {

        // $scope.gridOptions.api.setRowData(null);
        $scope.gridOptions.data = [];
        $scope.loadingstatus = "running";
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Account/Reporting/GetAllCancelVoucherSummaryList",
            dataType: "json",
            data: JSON.stringify($scope.para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();

            if (res.data.IsSuccess == true) {
                $scope.DataColl = res.data.Data;

                angular.forEach($scope.DataColl, function (dc) {
                    if (dc.IsParent)
                        dc.$$treeLevel = 0;
                });

                $timeout(function () {
                    $scope.$apply(function () {
                        //$scope.gridOptions.api.setRowData($scope.DataColl);
                        $scope.gridOptions.data = $scope.DataColl;
                    });
                });


            } else
                Swal.fire(res.data.ResponseMSG);


        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    };

    $scope.saveRptListState = function () {
        var state = $scope.gridApi.saveState.save();

        $http({
            method: 'POST',
            url: base_url + "Global/SaveListState",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("jsonData", JSON.stringify(data.jsonData));
                formData.append("entityId", EntityId);
                formData.append("isReport", true);

                return formData;
            },
            data: { jsonData: state }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            Swal.fire(res.data.ResponseMSG);

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });

    };
	
	 $scope.DelListState = function () {
        GlobalServices.delListStateRpt(EntityId);
    }

    $scope.filter = function () {
        $scope.gridApi.grid.refresh();
    };

    $scope.singleFilter = function (renderableRows) {
        var matcher = new RegExp($scope.filterValue);
        renderableRows.forEach(function (row) {
            var match = false;
            row.grid.columns.forEach(function (field) {
                if (field.displayName.length > 0) {
                    if (row.entity[field.name].match(matcher)) {
                        match = true;
                    }
                }

            });
            if (!match) {
                row.visible = false;
            }
        });
        return renderableRows;
    };

    $scope.LedgerList = [];
    $http({
        method: 'GET',
        url: base_url + "Account/Reporting/GetAllLedgerList",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.LedgerList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });

    $scope.VoucherList = [];
    $http({
        method: 'GET',
        url: base_url + "Account/Reporting/GetAllVoucherList",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.VoucherList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });
    $scope.BranchList = [];
    $http({
        method: 'GET',
        url: base_url + "Setup/Security/GetAllBranchList",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.BranchList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });
    $scope.UserList = [];
    $http({
        method: 'GET',
        url: base_url + "Setup/Security/GetAllUserList",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.UserList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });
    $scope.LedgerGroupList = [];
    $http({
        method: 'GET',
        url: base_url + "Account/Reporting/GetAllLedgerGroup",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.LedgerGroupList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });
    $scope.GodownList = [];
    $http({
        method: 'GET',
        url: base_url + "Inventory/Reporting/GetAllGodownList",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.GodownList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });
    $scope.ProductList = [];
    $http({
        method: 'GET',
        url: base_url + "Inventory/Reporting/GetAllProduct",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.ProductList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });
    $scope.ProductTypeList = [];
    $http({
        method: 'GET',
        url: base_url + "Inventory/Reporting/GetAllProductType",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.ProductTypeList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });
    $scope.SearchDataColl = [];
    $scope.SearchData = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.paginationOptions.TotalRows = 0;

        var sCol = $scope.paginationOptions.SearchColDet;

        var paraa = {
            filter: {
                DateFrom: null,
                DateTo: null,
                PageNumber: $scope.paginationOptions.pageNumber,
                RowsOfPage: $scope.paginationOptions.pageSize,
                SearchCol: (sCol ? sCol.value : ''),
                SearchVal: $scope.paginationOptions.SearchVal,
                SearchType: (sCol ? sCol.searchType : 'text')
            }
        };

        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/GetTransactionLst",
            dataType: "json",
            data: JSON.stringify(paraa)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.SearchDataColl = res.data.Data;
                $scope.paginationOptions.TotalRows = res.data.TotalCount;
                $('#searVoucherRightBtn').modal('show');

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });


    };
    $scope.ReSearchData = function (pageInd) {
        if (pageInd && pageInd >= 0)
            $scope.paginationOptions.pageNumber = pageInd;
        else if (pageInd == -1)
            $scope.paginationOptions.pageNumber = 1;

        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.paginationOptions.TotalRows = 0;
        var sCol = $scope.paginationOptions.SearchColDet;

        var paraaa = {
            voucherType: VoucherType,
            filter: {
                DateFrom: null,
                DateTo: null,
                PageNumber: $scope.paginationOptions.pageNumber,
                RowsOfPage: $scope.paginationOptions.pageSize,
                SearchCol: (sCol ? sCol.value : ''),
                SearchVal: $scope.paginationOptions.SearchVal,
                SearchType: (sCol ? sCol.searchType : 'text')
            }
        };

        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/GetTransactionLst",
            dataType: "json",
            data: JSON.stringify(paraaa)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.SearchDataColl = res.data.Data;
                $scope.paginationOptions.TotalRows = res.data.TotalCount;

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.AddRowInItemDetails = function (ind, boolAuto) {

        if (boolAuto == true) {
            var len = $scope.para.ItemDetailsColl.length;
            if ((ind + 1) != len)
                return;

            var selectItem = $scope.para.ItemDetailsColl[ind];
            if (!selectItem.VoucherId || selectItem.VoucherId == null || selectItem.VoucherId == 0)
                return;

        }

        if ($scope.para.ItemDetailsColl) {
            if ($scope.para.ItemDetailsColl.length > ind + 1) {
                $scope.para.ItemDetailsColl.splice(ind + 1, 0, {
                    dateFrom: new Date(),
                    dateTo: new Date(),
                    voucherType: 0,
                    LedgerId: 0,
                    LedgerName: '',
                    ItemDetailsColl: [],
                    BranchId: 0,
                    VoucherId: 0,
                    VoucherName: '',
                })
            } else {
                $scope.para.ItemDetailsColl.push({
                    dateFrom: new Date(),
                    dateTo: new Date(),
                    voucherType: 0,
                    LedgerId: 0,
                    LedgerName: '',
                    ItemDetailsColl: [],
                    BranchId: 0,
                    VoucherId: 0,
                    VoucherName: '',
                })
            }
        }

    }

    $scope.delRowFromItemDetails = function (ind) {
        if ($scope.para.ItemDetailsColl) {
            if ($scope.para.ItemDetailsColl.length > 1) {
                $scope.para.ItemDetailsColl.splice(ind, 1);
            }
        }
    }
    $scope.PrintVoucher = function (tranId, vid) {
        $scope.lastTranId = tranId;
        $scope.lastVoucherId = vid;
        $scope.Print();
    }
    $scope.Print = function () {
        if ($scope.lastTranId || $scope.lastVoucherId > 0) {
            var TranId = $scope.lastTranId;

            var vId = $scope.lastVoucherId;

            $http({
                method: 'GET',
                url: base_url + "ReportEngine/GetReportTemplates?entityId=" + EntityId + "&voucherId=" + vId + "&isTran=true",
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    var templatesColl = res.data.Data;
                    if (templatesColl && templatesColl.length > 0) {
                        var templatesName = [];
                        var sno = 1;
                        angular.forEach(templatesColl, function (tc) {
                            templatesName.push(sno + '-' + tc.ReportName);
                            sno++;
                        });
                        var printDone = false;
                        var rptTranId = 0;
                        if (templatesColl.length == 1)
                            rptTranId = templatesColl[0].RptTranId;
                        else {
                            Swal.fire({
                                title: 'Report Templates For Print',
                                input: 'select',
                                inputOptions: templatesName,
                                inputPlaceholder: 'Select a template',
                                showCancelButton: true,
                                inputValidator: (value) => {
                                    return new Promise((resolve) => {
                                        if (value >= 0) {
                                            resolve()
                                            rptTranId = templatesColl[value].RptTranId;
                                            printDone = true;

                                            if (rptTranId > 0) {
                                                document.body.style.cursor = 'wait';
                                                document.getElementById("frmRpt").src = '';
                                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + $scope.SelectedVoucher.VoucherId + "&tranid=" + TranId + "&vouchertype=" + VoucherType;
                                                document.body.style.cursor = 'default';
                                                $('#FrmPrintReport').modal('show');
                                            }
                                        } else {
                                            resolve('You need to select:)')
                                        }
                                    })
                                }
                            })
                        }

                        if (rptTranId > 0) {
                            document.body.style.cursor = 'wait';
                            document.getElementById("frmRpt").src = '';
                            document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + $scope.SelectedVoucher.VoucherId + "&tranid=" + TranId + "&vouchertype=" + VoucherType;
                            document.body.style.cursor = 'default';
                            $('#FrmPrintReport').modal('show');
                        }

                    } else
                        Swal.fire('No Templates found for print');
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });



        }
    };
    $scope.GodownSelectionChange = function () {

        $('#searVoucherRightBtn').modal('show');
    }

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }
	$scope.DownloadAsXls = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var dataColl = $scope.GetDataForPrint();
        var paraData = {
             
        };

        $http({
            method: 'POST',
            url: base_url + "Global/PrintXlsReportData",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("entityId", EntityId);
                formData.append("jsonData", angular.toJson(data.jsonData));
                formData.append("paraData", angular.toJson(paraData));
                formData.append("RptPath", "");
                return formData;
            },
            data: { jsonData: dataColl }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                down_file(base_url + "//" + res.data.Data.ResponseId, "CancelVoucherSummaryList.xlsx");
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });
    }
	
	    $scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };

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