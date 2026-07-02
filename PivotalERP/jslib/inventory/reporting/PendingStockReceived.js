"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("PendingStockRecivedController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
      var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
	LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'PendingStockRecived.csv',
            sheetName: 'PendingStockRecived'
        };
        $scope.gridOptions.api.exportDataAsCsv(params);
    };

    function LoadData() {
        $('.select2').select2({});

        //PendingStockReceived

        $scope.GodownColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetUserWiseGodown",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GodownColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.loadingstatus = "stop";
        $scope.columnDefs = [
            {
                headerName: "Date", width: 170, field: "VoucherDate", dataType: 'DateTime', cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                showRowGroup: true,
                cellRendererParams: {
                    suppressCount: false, // turn off the row count                   
                }, pinned: 'left'
            },
            {
                headerName: "Miti", width: 120, dataType: 'DateTime',
                cellRenderer:
                    function (params) {
                        return DateFormatBS(params.data.NY, params.data.NM, params.data.ND) + '</a ></center>';
                    }, pinned: 'left'

            },
           
            {
                headerName: "Particular's", width: 220, dataType: 'Text',
                valueGetter: function (params) {
                    var beData = params.data;

                    if (beData.IsInventory) {
                        return beData.PartyLedger;
                    }
                    else if (beData.LedgerAllocationColl && beData.LedgerAllocationColl.length > 0)
                        return beData.LedgerAllocationColl[0].LedgerName;
                    else if (beData.LedgerName)
                        return beData.LedgerName;
                    else if (beData.DispalyValue)
                        return beData.DispalyValue;
                    else
                        return params.data;
                }, pinned: 'left', filter: "agTextColumnFilter",
            },
            {
                headerName: "To Godown", width: 220, dataType: 'Text',
                valueGetter: function (params) {
                    var beData = params.data;
                    return beData.Particulars;
                }, pinned: 'left', filter: "agTextColumnFilter",
            },
            {
                headerName: "Qty", width: 80, filter: "agNumberColumnFilter", dataType: 'Number',
                valueGetter: function (params) {
                    var beData = params.data;
                    return beData.ActualQty;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>'
            },
            {
                headerName: "Rate", width: 120, filter: "agNumberColumnFilter", dataType: 'Number',
                valueGetter: function (params) {
                    var beData = params.data;
                    return beData.Rate;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>'
            },
            {
                headerName: "Amount", width: 150, filter: "agNumberColumnFilter", dataType: 'Number',
                valueGetter: function (params) {
                    var beData = params.data;
                    return beData.Amount;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>'
            },
         
            { headerName: "VoucherType", width: 150, field: "VoucherName", filter: true, dataType: 'Text', filter: "agTextColumnFilter", },
            { headerName: "Voucher No.", width: 150, field: "AutoManualNo", filter: true, dataType: 'Text', filter: "agTextColumnFilter", },
            { headerName: "Ref.No.", width: 120, field: "RefNo", filter: true, dataType: 'Text', filter: "agTextColumnFilter", },
            {
                headerName: "Total Amount", width: 150, filter: "agNumberColumnFilter", dataType: 'Number',
                valueGetter: function (params) {
                    var beData = params.data;
                    return beData.TransactionAmt;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>'
            },
            { headerName: "CostClass", width: 120, dataType: 'Text', field: "CostClassName", filter: true, filter: "agTextColumnFilter", },
            { headerName: "User", width: 120, dataType: 'Text', field: "CreatedByName", filter: "agTextColumnFilter", },

            { headerName: "Branch", width: 120, dataType: 'Text', field: "BranchName", filter: "agTextColumnFilter", },
             

            {
                headerName: "Action",
                width: 50,
                cellRenderer: function (params) {
                    return '<div class="btn-group" style="position: fixed; ">' +
                        '<button type="button" class="btn btn-default px-1 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span class="caret"></span>' +
                        '</button>' +
                        '<ul class="dropdown-menu dropdown-menu-right p-2" style="position: absolute; left: 0;">' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Show Document" ng-click="ShowDocument(this.data)"><i class="fas fa-file text-info"></i> Show Document</a>  </li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Print" ng-click="PrintVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ')"><i class="fas fa-print text-info"></i> Print</a></li>' +
                        '<li ng-hide="this.data.VoucherType==14 && ButtonED.IRD == true"><a data-toggle="tooltip" data-placement="top" title="Post" ng-click="PostModal(this)"><i class="fas fa-sticky-note"></i> Post</a> </li>' +

                        '<li ng-hide="this.data.VoucherType==14 && ButtonED.IRD == true"><a data-toggle="tooltip" data-placement="top" title="Cancel" ng-click="CancelModal(this)"><i class="fa fa-times text-danger"></i> Cancel</a> </li>' +
                        '<li ng-hide="this.data.VoucherType==14 && ButtonED.IRD == true"><a data-toggle="tooltip" data-placement="top" title="Verify Voucher" ng-click="VerifyModal(this)"><i class="fa fa-times text-info"></i> Verify</a> </li>' +
                        '<li ng-hide="this.data.VoucherType==14 && ButtonED.IRD == true"><a data-toggle="tooltip" data-placement="top" title="Reject Voucher" ng-click="RejectModal(this)"><i class="fa fa-times text-danger"></i> Reject</a> </li>' +
                        
                        '<li ng-hide="this.data.VoucherType==14 && ButtonED.IRD == true"><a data-toggle="tooltip" data-placement="top" title="Delete Voucher" ng-click="deleteVoucher(this)"><i class="fas fa-trash-alt text-danger"></i> Delete</a></li>' +

                        '</ul>' +
                        '</div>';
                },
                pinned: 'right'
            },
        ];


        $scope.gridOptions = {
			onCellContextMenu: onCellContextMenu, // Handle right-click event			
            // a default column definition with properties that get applied to every column
            angularCompileRows: true,
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,

                // set every column width
                width: 90
            },
			overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
            columnDefs: $scope.columnDefs,
            enableColResize: true,
            rowData: null,
            filter: true,
            enableFilter: true,
            rowSelection: 'multiple',
            suppressHorizontalScroll: true,
            alignedGrids: [],
            onFilterChanged: function (e) {
                //console.log('onFilterChanged', e);

                var dt = {
                    DispalyValue: "TOTAL =>",
                    TransactionAmt: 0,
           
                };

                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var dc = node.data;
                    if (dc.IsParent == true) {
                        dt.TransactionAmt += dc.TransactionAmt;                      
                    }
                });
                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);

            },
            getNodeChildDetails: function (beData) {
                var dataColl = [];
                if (!beData.IsInventory) {
                    var first = true;

                    if (beData.LedgerAllocationColl) {
                        if (beData.LedgerAllocationColl.length > 0) {
                            angular.forEach(beData.LedgerAllocationColl, function (data) {

                                if (first == true) {
                                    first = false;
                                } else
                                    dataColl.push(data);
                            });
                        }
                    }
                    if (beData.Narration && beData.Narration.length > 0)
                        dataColl.push("(" + beData.Narration + ")");
                }
                else if (beData.IsInventory) {

                    //Dynamic.BusinessEntity.Account.VoucherTypes.StockTransfor=19
                    if (beData.VoucherType != 19) {
                        if (beData.Particulars && beData.Particulars.trim().Length > 0)
                            dataColl.Add(beData.Particulars);
                    }

                    if (beData.AditionalCostColl && beData.AditionalCostColl.length > 0) {
                        angular.forEach(beData.AditionalCostColl, function (ad) {
                            dataColl.push(ad);
                        });
                    }

                    if (beData.ItemAllocationColl && beData.ItemAllocationColl.length > 0) {
                        angular.forEach(beData.ItemAllocationColl, function (ias) {
                            dataColl.push(ias);
                        });
                    }

                    if (beData.Narration && beData.Narration.length > 0)
                        dataColl.push("(" + beData.Narration + ")");

                } else
                    return null;

                if (dataColl.length > 0) {
                    return {
                        group: true,
                        children: dataColl,
                        expanded: beData.open
                    };
                } else
                    return null;


            },

        };


        $scope.dataForBottomGrid = [
            {
                DispalyValue: 'Total =>',
            }];

        $scope.gridOptionsBottom = {
            defaultColDef: {
                resizable: true,
                width: 90
            },
            columnDefs: $scope.columnDefs,
            // we are hard coding the data here, it's just for demo purposes
            rowData: $scope.dataForBottomGrid,
            debug: true,
            rowClass: 'bold-row',
            // hide the header on the bottom grid
            headerHeight: 0,
            alignedGrids: []
        };

        $scope.gridOptions.alignedGrids.push($scope.gridOptionsBottom);
        $scope.gridOptionsBottom.alignedGrids.push($scope.gridOptions);

        $scope.gridDivBottom = document.querySelector('#myGridBottom');
        new agGrid.Grid($scope.gridDivBottom, $scope.gridOptionsBottom);



        $scope.PendingStockReceived = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            GodownId: null,            
        };


        $timeout(function () {
            GlobalServices.getCompanyDet().then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.PendingStockReceived.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });
		
		 $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });

    }

    $scope.GetPendingStock = function () {
         
        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);
          
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.PendingStockReceived.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.PendingStockReceived.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.PendingStockReceived.DateToDet)
            dateTo = new Date(($filter('date')($scope.PendingStockReceived.DateToDet.dateAD, 'yyyy-MM-dd')));
         
        var beData = {            
            dateFrom: dateFrom,
            dateTo: dateTo,            
            GodownId: $scope.PendingStockReceived.GodownId,            
        };

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetPendingStockRecived",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {

                var DataColl = res.data.Data;

                var dt = {
                    DispalyValue: "TOTAL =>",
                    TransactionAmt: 0, 
                };
                angular.forEach(DataColl, function (dc) {
                    dt.TransactionAmt += dc.TransactionAmt;                    
                });
                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);

                $scope.gridOptions.api.setRowData(res.data.Data);

                 
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed' + reason);
        });

    };

    $scope.PrintVoucher = function (tranId, voucherType, voucherId) {

        if (voucherType == 14) {
            Swal.fire('Please ! Print Invoice From Voucher Entry');
            return;
        }

        var para = {
            VoucherType: voucherType
        }
        $http({
            method: 'POST',
            url: base_url + "Global/GetEntityByVoucherType",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (rs) {
            if (rs.data.Data) {
                var entityId = rs.data.Data.RId;
                $timeout(function () {

                    if (tranId && tranId > 0) {

                        $http({
                            method: 'GET',
                            url: base_url + "ReportEngine/GetReportTemplates?entityId=" + entityId + "&voucherId=" + voucherId + "&isTran=true",
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

                                    var printed = false;
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
                                                        printed = true;
                                                        if (rptTranId > 0) {
                                                            document.body.style.cursor = 'wait';
                                                            document.getElementById("frmRpt").src = '';
                                                            document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + entityId + "&voucherid=" + voucherId + "&tranid=" + tranId + "&vouchertype=" + voucherType;
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

                                    if (rptTranId > 0 && printed == false) {
                                        document.body.style.cursor = 'wait';
                                        document.getElementById("frmRpt").src = '';
                                        document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + entityId + "&voucherid=" + voucherId + "&tranid=" + tranId + "&vouchertype=" + voucherType;
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

                });
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    };

    $scope.SelectedVoucherP = null;
    $scope.PostModal = function (e) {

        var obj = e.data;

        if (!obj)
            return;

        $scope.SelectedVoucherP = obj;

        var para = {
            voucherId: obj.VoucherId
        };

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetVMForDayBook",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var vm = res.data.Data;

                if (vm.NeedPostRemarks == true) {
                    $scope.SelectedVoucherP.NeedPostRemarks = vm.NeedPostRemarks;
                    $('#modal-post').modal('show');

                } else {
                    $scope.SelectedVoucherP.NeedPostRemarks = false;
                    $scope.PostVoucher();
                }

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });



    }
    $scope.PostVoucher = function () {

        
        var obj = $scope.SelectedVoucherP;

        Swal.fire({
            title: 'Do you want to post the selected voucher(' + obj.VoucherName + ') :- ' + obj.AutoManualNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Post',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var tranColl = [];
                //tranColl.push(obj);

                if ($scope.SelectedVoucherP.NeedPostRemarks == true && isEmptyObj($scope.SelectedVoucherP.VerifyRemarks) == true) {
                    Swal.fire('Remarks missing');
                    return;
                }

                tranColl.push({
                    TranId: obj.TranId,
                    VoucherType: obj.VoucherType,
                    VoucherId: obj.VoucherId,
                    VoucherDate: obj.VoucherDate,
                    VerifyRemarks: obj.VerifyRemarks
                });


                $http({
                    method: 'POST',
                    url: base_url + "Global/PostStockTransfor",
                    dataType: "json",
                    data: JSON.stringify(tranColl)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {

                        $('#modal-post').modal('hide');
                        $scope.GetPendingStock();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }

    $scope.SelectedVoucher = null;
    $scope.CancelModal = function (e) {
         
        var obj = e.data;

        if (!obj)
            return;

        $scope.SelectedVoucher = obj;

        $('#modal-cancel').modal('show');

    }
    $scope.CancelVoucher = function () {
        $('#modal-cancel').modal('hide');

        var obj = $scope.SelectedVoucher;

        Swal.fire({
            title: 'Do you want to cancel the selected voucher(' + obj.VoucherName + ') :- ' + obj.AutoManualNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var tranColl1 = [];
                tranColl1.push({
                    TranId: obj.TranId,
                    VoucherId: obj.VoucherId,
                    VoucherType: obj.VoucherType,
                    CostClassId: obj.CostClassId,
                    IsCancel: obj.IsCancel,
                    VoucherType: obj.VoucherType,
                    CancelRemarks: obj.CancelRemarks,
                    EntryDate: obj.EntryDate,
                    VoucherDate: obj.VoucherDate,
                    IsPost: obj.IsPost,
                    AutoVoucherNo: obj.AutoVoucherNo,
                    ManualVoucherNO: obj.ManualVoucherNO,
                    AutoManualNo: obj.AutoManualNo,
                    RefNo: obj.RefNo,
                    TranType: obj.TranType,
                    CreatedBy: obj.CreatedBy,
                    CreatedByName: obj.CreatedByName,
                    BranchId: obj.BranchId,
                    IsLocked: obj.IsLocked,
                    IsOpening: obj.IsOpening,
                    IsVerify: obj.IsVerify,
                    VerifyRemarks: obj.VerifyRemarks,
                    IsReject: obj.IsReject,
                    RejectRemarks: obj.RejectRemarks,
                    VoucherDateTime: obj.VoucherDateTime,
                    ReferanceTranId: obj.ReferanceTranId,
                    IsInventory: obj.IsInventory,
                    CancelDateTime: obj.CancelDateTime,
                });

                var para = {
                    tranColl: tranColl1,
                    reason: obj.CancelRemarks
                }

                $http({
                    method: 'POST',
                    url: base_url + "Global/CancelAccInvTransaction",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.GetDayBook();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    };

    $scope.VerifyModal = function (e) {


        var obj = e.data;

        if (!obj)
            return;

        $scope.SelectedVoucher = obj;

        $('#modal-verifyv').modal('show');

    }
    $scope.VerifyVoucher = function () {
        $('#modal-verifyv').modal('hide');

        var obj = $scope.SelectedVoucher;

        Swal.fire({
            title: 'Do you want to verify the selected voucher(' + obj.VoucherName + ') :- ' + obj.AutoManualNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var tr = {
                    TranId: obj.TranId,
                    VoucherId: obj.VoucherId,
                    VoucherType: obj.VoucherType,
                    CostClassId: obj.CostClassId,
                    IsCancel: obj.IsCancel,
                    VoucherType: obj.VoucherType,
                    CancelRemarks: obj.CancelRemarks,
                    EntryDate: obj.EntryDate,
                    VoucherDate: obj.VoucherDate,
                    IsPost: obj.IsPost,
                    AutoVoucherNo: obj.AutoVoucherNo,
                    ManualVoucherNO: obj.ManualVoucherNO,
                    AutoManualNo: obj.AutoManualNo,
                    RefNo: obj.RefNo,
                    TranType: obj.TranType,
                    CreatedBy: obj.CreatedBy,
                    CreatedByName: obj.CreatedByName,
                    BranchId: obj.BranchId,
                    IsLocked: obj.IsLocked,
                    IsOpening: obj.IsOpening,
                    IsVerify: obj.IsVerify,
                    VerifyRemarks: obj.VerifyRemarks,
                    IsReject: obj.IsReject,
                    RejectRemarks: obj.RejectRemarks,
                    VoucherDateTime: obj.VoucherDateTime,
                    ReferanceTranId: obj.ReferanceTranId,
                    IsInventory: obj.IsInventory,
                    CancelDateTime: obj.CancelDateTime,
                };



                $http({
                    method: 'POST',
                    url: base_url + "Global/VerifyAccInvTransaction",
                    dataType: "json",
                    data: JSON.stringify(tr)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.GetDayBook();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    };

    $scope.RejectModal = function (e) {


        var obj = e.data;

        if (!obj)
            return;

        $scope.SelectedVoucher = obj;

        $('#modal-rejectv').modal('show');

    }
    $scope.RejectVoucher = function () {
        $('#modal-rejectv').modal('hide');

        var obj = $scope.SelectedVoucher;

        Swal.fire({
            title: 'Do you want to reject the selected voucher(' + obj.VoucherName + ') :- ' + obj.AutoManualNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var tr = {
                    TranId: obj.TranId,
                    VoucherId: obj.VoucherId,
                    VoucherType: obj.VoucherType,
                    CostClassId: obj.CostClassId,
                    IsCancel: obj.IsCancel,
                    VoucherType: obj.VoucherType,
                    CancelRemarks: obj.CancelRemarks,
                    EntryDate: obj.EntryDate,
                    VoucherDate: obj.VoucherDate,
                    IsPost: obj.IsPost,
                    AutoVoucherNo: obj.AutoVoucherNo,
                    ManualVoucherNO: obj.ManualVoucherNO,
                    AutoManualNo: obj.AutoManualNo,
                    RefNo: obj.RefNo,
                    TranType: obj.TranType,
                    CreatedBy: obj.CreatedBy,
                    CreatedByName: obj.CreatedByName,
                    BranchId: obj.BranchId,
                    IsLocked: obj.IsLocked,
                    IsOpening: obj.IsOpening,
                    IsVerify: obj.IsVerify,
                    VerifyRemarks: obj.VerifyRemarks,
                    IsReject: obj.IsReject,
                    RejectRemarks: obj.RejectRemarks,
                    VoucherDateTime: obj.VoucherDateTime,
                    ReferanceTranId: obj.ReferanceTranId,
                    IsInventory: obj.IsInventory,
                    CancelDateTime: obj.CancelDateTime,
                };

                $http({
                    method: 'POST',
                    url: base_url + "Global/RejectAccInvTransaction",
                    dataType: "json",
                    data: JSON.stringify(tr)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.GetDayBook();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

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
