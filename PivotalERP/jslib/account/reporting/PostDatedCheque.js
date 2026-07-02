

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);



app.controller("PostDatedChequeCtrl", function ($scope, $http, $filter, $timeout, GlobalServices) {
    $scope.Title = 'PostDatedCheque';
var PrintPreviewAs = 1;
 const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'PDC.csv',
            sheetName: 'PDC'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function Numberformat(val) {
        return $filter('number')(val, 2);
    }

    function LoadData() {
        $scope.loadingstatus = 'running';

 $scope.GenConfig = {};
        GlobalServices.getGenConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GenConfig = res.data.Data;
                PrintPreviewAs = $scope.GenConfig.PrintPreviewAs;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.currentPages = {
            PendingBill: 1,
        };

        $scope.searchData = {
            PendingBill: '',
        };

        $scope.perPage = {
            PendingBill: GlobalServices.getPerPageRow(),
        };

        $scope.DateAsColl = [{ id: 1, text: 'Cheque Date' }, { id: 2, text: 'Voucher Date' }, { id: 3, text:'Valid Date'}]
        $scope.ReportTypesColl = [{ id: 1, text: 'Cleared Only' }, { id: 2, text: 'Expired Only' }, { id: 3, text: 'Cancel Only' }, { id: 4, text: 'Pending' }, { id: 5, text: 'All' }];

        $scope.BlackListStatusColl = [{ id: 1, text: 'Bank Latter Submited' }, { id: 2, text: 'CICL Charge Deposited' }, { id: 3, text: 'Black Listed' }];
        $scope.LegalStatusColl = [{ id: 1, text: 'Legal Notice' }, { id: 2, text: 'Registered' }, { id: 3, text: 'Legal Won ' }];

        $scope.newPDC = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            filterDateAs: 1,
            reportType: 5 
        };

        $scope.EPDet = {};
        $scope.EPColl = [];
        GlobalServices.getRptEntityProperties(EntityId).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.EPColl = res.data.Data;
                angular.forEach($scope.EPColl, function (ep) {
                    $scope.EPDet[ep.Name] = ep;

                    if (ep.DataType == 'DateTime') {
                        if (ep.DefaultValue) {
                            $scope.newPDC[ep.Name] = new Date(ep.DefaultValue);
                        }
                    } else {
                        $scope.newPDC[ep.Name] = ep.DefaultValue;
                    }
                });
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.columnDefs = [

            {
                headerName: "Action", width: 180, pinned: 'left', cellRenderer:
                    function (params) {

                        var dt = params.data;
                        return '<a class="btn btn-default btn-xs" ng-click="ShowDocument(this.data)" title="Show Documents"><i class="fas fa-file text-info"></i></a>' +
                            '<a class="btn btn-default btn-xs" ng-click="ClearModal(this.data)" title="Clear Cheque"><i class="fas fa-sticky-note"></i></a>' +
                            '<a class="btn btn-default btn-xs" ng-click="CancelModal(this.data)" title="Cancel Cheque"><i class="fa fa-times"></i></a>' +
                            '<a class="btn btn-default btn-xs" ng-click="BounceModal(this.data)" title="Bounce Cheque"><i class="fas fa-trash-alt text-danger"></i></a>' +
                            '<a class="btn btn-default btn-xs" ng-click="BlackListingModal(this.data)" title="Black Listing Cheque"><i class="fas fa-ban text-danger"></i></a>' +
                            '<a class="btn btn-default btn-xs" ng-click="LegalActionModal(this.data)" title="Legal Action Cheque"><i class="fas fa-solid fa-gavel text-danger"></i></a>';
                    }
            },
            { headerName: "S.No", field: "SNo", filter: "agTextColumnFilter", pinned: 'left', width: 90, dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "Type", field: "TypeOfPDC", filter: 'agTextColumnFilter', pinned: 'left', width: 100, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Party Name", field: "LedgerName", filter: 'agTextColumnFilter', pinned: 'left', width: 220, dataType: 'Text',cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", field: "Address", filter: 'agTextColumnFilter', width: 180, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Group", field: "LedgerGroup", filter: 'agTextColumnFilter', width: 180, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Salesman", field: "Agent", filter: 'agTextColumnFilter', width: 180, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Voucher Date", field: "VoucherDate", filter: 'agDateColumnFilter', width: 140, dataType: 'DateTime', cellStyle: { 'text-align': 'Center' } },
            { headerName: "Voucher Miti", field: "VoucherDateBS", filter: 'agTextColumnFilter', width: 140, dataType: 'DateTime', cellStyle: { 'text-align': 'Center' } },
            { headerName: "Bank Name", field: "BankName", filter: 'agTextColumnFilter', width: 180, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Bank Branch", field: "BankBranch", filter: 'agTextColumnFilter', width: 180, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Cheque No.", field: "ChequeNo", filter: 'agTextColumnFilter', width: 180, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Cheque Date", field: "ChequeDate", filter: 'agTextColumnFilter', width: 140, dataType: 'DateTime', cellStyle: { 'text-align': 'Center' } },
            { headerName: "Cheque Miti", field: "ChequeDateBS", filter: 'agTextColumnFilter', width: 140, dataType: 'DateTime', cellStyle: { 'text-align': 'Center' } },
            { headerName: "Amount", field: "Amount", filter: 'agNumberColumnFilter', width: 140, dataType: 'Number', cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Closing Balance", field: "Closing", filter: 'agNumberColumnFilter', width: 160, dataType: 'Number', cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "Notes", field: "Notes", filter: 'agTextColumnFilter', width: 180, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "IsCleared", field: "IsCleared", filter: 'agTextColumnFilter', width: 140, dataType: 'Text', cellStyle: { 'text-align': 'Center' } },
            { headerName: "Cleared Remarks", field: "ClearRemarks", filter: 'agTextColumnFilter', width: 180, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "IsCancel", field: "IsCancel", filter: 'agTextColumnFilter', width: 140, dataType: 'Text' ,cellStyle: { 'text-align': 'Center' } },
            { headerName: "Cancel Date", field: "CancelDate", filter: 'agTextColumnFilter', width: 180, dataType: 'DateTime' ,cellStyle: { 'text-align': 'Center' } },
            { headerName: "Cancel Remarks", field: "CancelRemarks", filter: 'agTextColumnFilter', width: 180, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Canceled By", field: "CanceledBy", filter: 'agTextColumnFilter', width: 180, dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            { headerName: "Bounce Count", field: "BounceCount", filter: 'agTextColumnFilter', width: 180, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Bounce Details", field: "BounceDetails", filter: 'agTextColumnFilter', width: 180, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Receipt No", field: "ReceiptNo", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Valid Days", field: "ValidDays", filter: 'agTextColumnFilter', width: 130, dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Valid Date", field: "ValidDate", filter: 'agDateColumnFilter', width: 140, dataType: 'DateTime', cellStyle: { 'text-align': 'left' } },
            { headerName: "Valid Miti", field: "ValidMiti", filter: 'agTextColumnFilter', width: 140, dataType: 'DateTime', cellStyle: { 'text-align': 'left' } },
            { headerName: "Due Days", field: "DueDays", filter: 'agTextColumnFilter', width: 180, dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Against", field: "Against", filter: 'agTextColumnFilter', width: 180, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "R.V. No.", field: "ReceiptVoucherNo", filter: 'agTextColumnFilter', width: 130, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Branch", field: "Branch", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            { headerName: "Bounce Date", field: "LastBounceDate", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Bounce Miti", field: "LastBounceMiti", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Bounce Remarks", field: "LastBounceRemarks", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
 
            { headerName: "BlackListing Date", field: "BlackListingDate", filter: 'agDateColumnFilter', width: 150, dataType: 'DateTime', cellStyle: { 'text-align': 'left' } },
            { headerName: "BlackListing Miti", field: "BlackListingMiti", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "BlackListing Status", field: "BlackListingStatus", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "BlackListing Remarks", field: "BlackListingRemarks", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "BL NextFollowupDate", field: "BlackListingNextFollowupDate", filter: 'agDateColumnFilter', width: 150, dataType: 'DateTime', cellStyle: { 'text-align': 'left' } },
            { headerName: "BL NextFollowupMiti", field: "BlackListingNextFollowupMiti", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Legal Date", field: "LegalDate", filter: 'agDateColumnFilter', width: 150, dataType: 'DateTime', cellStyle: { 'text-align': 'left' } },
            { headerName: "Legal Miti", field: "LegalMiti", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Legal Status", field: "LegalStatus", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Legal Remarks", field: "LegalRemarks", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Legal NextFollowup Date", field: "LegalNextFollowupDate", filter: 'agDateColumnFilter', width: 150, dataType: 'DateTime', cellStyle: { 'text-align': 'left' } },
            { headerName: "Legal NextFollowup Miti", field: "LegalNextFollowupMiti", filter: 'agTextColumnFilter', width: 150, dataType: 'Text', cellStyle: { 'text-align': 'left' } },


        ];


        $scope.gridOptions = {
			onCellContextMenu: onCellContextMenu, // Handle right-click event			
            angularCompileRows: true,
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                width: 100,

            },
            enableSorting: true,
            multiSortKey: 'ctrl',
            enableColResize: true,
            overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
            overlayNoRowsTemplate: "No Records found",
            rowSelection: 'multiple',
            columnDefs: $scope.columnDefs,
            rowData: null,
            filter: true,
            suppressHorizontalScroll: true,
            alignedGrids: [],
            enableFilter: true,

            onFilterChanged: function () {

                var dt = {
                    LedgerName: 'TOTAL =>',
                    Amount: 0,

                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.Amount += fData.Amount;


                });


                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);
            }

        };
       
        $scope.dataForBottomGrid = [
            {
                SNo: '',
                LedgerName: 'Total =>',
                Amount: 0,

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
        $scope.loadingstatus = "stop";

        $scope.RecVoucherTypeColl = [];
        $scope.PayVoucherTypeColl = [];
        $scope.CostClassColl = [];
        $scope.RecSelectedVoucher = null;
        $scope.PaySelectedVoucher = null;
        $scope.SelectedCostClass = null;

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetVoucherList?voucherType=" + recVoucherType,
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.RecVoucherTypeColl = res.data.Data;

                if ($scope.RecVoucherTypeColl && $scope.RecVoucherTypeColl.length == 1)
                    $scope.RecSelectedVoucher = $scope.RecVoucherTypeColl[0];

                $http({
                    method: 'GET',
                    url: base_url + "Account/Creation/GetCostClassForEntry",
                    dataType: "json"
                }).then(function (res1) {
                    if (res1.data.IsSuccess && res1.data.Data) {
                        $scope.CostClassColl = res1.data.Data;

                        if ($scope.CostClassColl && $scope.CostClassColl.length == 1)
                            $scope.SelectedCostClass = $scope.CostClassColl[0];
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });

            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetVoucherList?voucherType=" + payVoucherType,
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.PayVoucherTypeColl = res.data.Data;

                if ($scope.PayVoucherTypeColl && $scope.PayVoucherTypeColl.length == 1)
                    $scope.PaySelectedVoucher = $scope.PayVoucherTypeColl[0];


            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


$timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });

    }
    $scope.ClearData = function () {

        var DataColl = [];
        $scope.gridOptionsBottom.api.setRowData(DataColl);

        $scope.gridOptions.api.setRowData(DataColl);
    };

    $scope.GetAllPostDatedCheque = function () {

        $scope.ClearData();
        $scope.loadingstatus = 'running';
        showPleaseWait();

        var para = {
            dateFrom: $filter('date')($scope.newPDC.DateFromDet.dateAD, 'yyyy-MM-dd'),
            dateTo: $filter('date')($scope.newPDC.DateToDet.dateAD, 'yyyy-MM-dd'),
            reportType: $scope.newPDC.reportType,
            filterDateAs: $scope.newPDC.filterDateAs 
        };

        $http({
            method: 'POST',
            url: base_url + "Account/Reporting/GetAllPostDatedCheque",
            dataType: "json",
            data:JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = mx(res.data.Data);

                var dt = {
                    LedgerName: 'TOTAL =>',
                    Amount: DataColl.sum(p1 => p1.Amount),

                }

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

    }

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    $scope.onBtExport = function () {
        var params = {
            fileName: 'data.csv',
            sheetName: 'data'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    $scope.Print = function () {
        $http({
            method: 'GET',
            url: base_url + "ReportEngine/GetReportTemplates?entityId=" + EntityId + "&voucherId=0&isTran=false",
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

                    var print = false;

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

                                        if (rptTranId > 0) {
                                            var dataColl = $scope.GetDataForPrint();
                                            print = true;
                                            $http({
                                                method: 'POST',
                                                url: base_url + "Global/PrintReportData",
                                                headers: { 'Content-Type': undefined },

                                                transformRequest: function (data) {

                                                    var formData = new FormData();
                                                    formData.append("entityId", EntityId);
                                                    formData.append("jsonData", angular.toJson(data.jsonData));

                                                    return formData;
                                                },
                                                data: { jsonData: dataColl }
                                            }).then(function (res) {

                                                $scope.loadingstatus = "stop";
                                                hidePleaseWait();
                                                if (res.data.IsSuccess && res.data.Data) {

                                                    document.body.style.cursor = 'wait';
                                                    document.getElementById("frmRpt").src = '';
                                                    document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=false&entityid=" + EntityId + "&voucherid=0&tranid=0&vouchertype=0&sessionid=" + res.data.Data.ResponseId;
                                                    document.body.style.cursor = 'default';
                                                    $('#FrmPrintReport').modal('show');

                                                } else
                                                    Swal.fire('No Templates found for print');

                                            }, function (errormessage) {
                                                hidePleaseWait();
                                                $scope.loadingstatus = "stop";
                                                Swal.fire(errormessage);
                                            });

                                        }

                                    } else {
                                        resolve('You need to select:)')
                                    }
                                })
                            }
                        })
                    }

                    if (rptTranId > 0 && print == false) {
                        var dataColl = $scope.GetDataForPrint();
                        print = true;

                        $http({
                            method: 'POST',
                            url: base_url + "Global/PrintReportData",
                            headers: { 'Content-Type': undefined },

                            transformRequest: function (data) {

                                var formData = new FormData();
                                formData.append("entityId", EntityId);
                                formData.append("jsonData", angular.toJson(data.jsonData));

                                return formData;
                            },
                            data: { jsonData: dataColl }
                        }).then(function (res) {

                            $scope.loadingstatus = "stop";
                            hidePleaseWait();
                            if (res.data.IsSuccess && res.data.Data) {

                                document.body.style.cursor = 'wait';
                                document.getElementById("frmRpt").src = '';
                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=false&entityid=" + EntityId + "&voucherid=0&tranid=0&vouchertype=0&sessionid=" + res.data.Data.ResponseId;
                                document.body.style.cursor = 'default';
                                $('#FrmPrintReport').modal('show');

                            } else
                                Swal.fire('No Templates found for print');

                        }, function (errormessage) {
                            hidePleaseWait();
                            $scope.loadingstatus = "stop";
                            Swal.fire(errormessage);
                        });

                    }

                } else
                    Swal.fire('No Templates found for print');
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.GetDataForPrint = function () {

        var filterData = [];

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var dayBook = node.data;
            filterData.push(dayBook);
        });

        return filterData;
    }

    $scope.SelectedPDC = {};
    $scope.ShowDocument = function (beData) {
        $scope.SelectedPDC = beData;
        $('#modal-showDocument').modal('show');
        
    }
    //$scope.ShowPersonalImg = function (docDet) {
    //    $scope.viewImg = {
    //        ContentPath: '',
    //        File: null,
    //        FileData: null
    //    };
    //    if (docDet.DocPath || docDet.File) {
    //        $scope.viewImg.ContentPath = docDet.DocPath;
    //        $scope.viewImg.File = docDet.File;
    //        $scope.viewImg.FileData = docDet.DocumentData;
    //        $('#PersonalImg').modal('show');
    //    } else
    //        Swal.fire('No Image Found');

    //};
    $scope.ShowPersonalImg = function (item) {
        $scope.viewImg = {
            ContentPath: '',
            FileType: null
        };

        if (item.DocPath && item.DocPath.length > 0) {
            $scope.viewImg.ContentPath = item.DocPath;
            $scope.viewImg.FileType = 'pdf';  // Assuming DocPath is for PDFs
            document.getElementById('pdfViewer').src = item.DocPath;
            $('#PersonalImg').modal('show');
        } else if (item.PhotoPath && item.PhotoPath.length > 0) {
            $scope.viewImg.ContentPath = item.PhotoPath;
            $scope.viewImg.FileType = 'image';  // Assuming PhotoPath is for images
            $('#PersonalImg').modal('show');
        } else if (item.File) {
            var blob = new Blob([item.File], { type: item.File?.type });
            $scope.viewImg.ContentPath = URL.createObjectURL(blob);
            $scope.viewImg.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';

            if ($scope.viewImg.FileType === 'pdf') {
                document.getElementById('pdfViewer').src = $scope.viewImg.ContentPath;
            }

            $('#PersonalImg').modal('show');
        } else {
            Swal.fire('No Image Found');
        }
    };
    $scope.CancelModal = function (beData) {

        if (beData.IsCancel == true) {

            Swal.fire('This PDC was already canceled');
        } else {

            $scope.SelectedPDC = beData;

            $('#modal-cancel').modal('show');
        }

    }
    $scope.CancelPDC = function () {
        $('#modal-cancel').modal('hide');

        var obj = $scope.SelectedPDC;

        Swal.fire({
            title: 'Do you want to cancel the selected PDC (' + obj.LedgerName + ') :- ' + obj.Amount + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/PDCChequeCancel",
                    dataType: "json",
                    data: JSON.stringify($scope.SelectedPDC)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.GetAllPostDatedCheque();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    };


    $scope.ClearModal = function (beData) {

        if (beData.IsCleared == true) {

            Swal.fire('This PDC was already cleared');
        }
        else if(beData.IsCancel==true)
        {
            Swal.fire('This PDC was already canceled');
        }
        else {

            $scope.SelectedPDC = beData;

            if ($scope.SelectedPDC.TypeOfPDC == 'PAY' || $scope.SelectedPDC.TypeOfPDC == 'Pay') {
                $scope.SelectedPDC.VoucherType = 2;
            }
            else if ($scope.SelectedPDC.TypeOfPDC == 'REC' || $scope.SelectedPDC.TypeOfPDC == 'Rec') {
                    $scope.SelectedPDC.VoucherType = 1;
                }

            if (!$scope.SelectedPDC.ClearedDate)
                $scope.SelectedPDC.ClearedDate_TMP = new Date(beData.ChequeDate);

            if (!$scope.SelectedPDC.CancelRemarks || $scope.SelectedPDC.CancelRemarks.length == 0)
                $scope.SelectedPDC.CancelRemarks = 'Cleared';

            if (beData.BillWiseAdjustment == true && beData.TypeOfPDC == "REC") {
                
                 beData.BillRefColl = [];

                $http({
                    method: 'GET',
                    url: base_url + "Inventory/Transaction/getDuesBillList?ledgerId=" + beData.LedgerId + '&branchId=' + beData.BranchId,
                    dataType: "json"
                }).then(function (res) {
                    if (res.data.IsSuccess && res.data.Data) {
                        beData.BillRefColl = res.data.Data;
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });

                $('#mdlPendingBills').modal('show');

            }
            else if (beData.BillWiseAdjustment == true && beData.TypeOfPDC == "PAY") {

                beData.BillRefColl = [];

                $http({
                    method: 'GET',                    
                    url: base_url + "Inventory/Transaction/getPurchaseDuesBillList?ledgerId=" + beData.LedgerId + '&branchId=' + beData.BranchId,
                    dataType: "json"
                }).then(function (res) {
                    if (res.data.IsSuccess && res.data.Data) {
                        beData.BillRefColl = res.data.Data;
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });

                $('#mdlPendingBills').modal('show');

            }
            else {
                $('#modal-cleared').modal('show');
            }

            
        }

    }
    $scope.ClearPDC = function () {
        $('#modal-cleared').modal('hide');
        $('#mdlPendingBills').modal('hide');

        var obj = $scope.SelectedPDC;

        Swal.fire({
            title: 'Do you want to cleared the selected PDC (' + obj.LedgerName + ') :- ' + obj.Amount + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var billColl = [];
                var tmpBillColl = angular.copy($scope.SelectedPDC.BillRefColl);
                if (tmpBillColl) {
                    tmpBillColl.forEach(function (br) {
                        if (br.PaidAmt > 0) {

                            var billRef = {
                                Amount: br.PaidAmt,
                                BillRefType: 2,
                                BillRefId: br.TranId,
                                CreditDays: 0,
                                DrCr: 2,
                                DueDate: $filter('date')(new Date(br.VoucherDate), 'yyyy-MM-dd'),
                                RefName: br.VoucherName,
                                RefVoucherType: br.VoucherType,
                                RefTranId: br.TranId,
                                RefVNo: br.InvoiceNo,
                                DuesAmount: br.Amount,                                
                            };
                            billColl.push(billRef);
                     
                        }
                    });
                }
                $scope.SelectedPDC.BillRefColl = billColl;

                if($scope.SelectedPDC.TypeOfPDC=='REC')
                    $scope.SelectedPDC.VoucherId = $scope.RecSelectedVoucher.VoucherId;
                else
                    $scope.SelectedPDC.VoucherId = $scope.PaySelectedVoucher.VoucherId;

                $scope.SelectedPDC.CostClassId = $scope.SelectedCostClass.CostClassId;

                if ($scope.SelectedPDC.ClearedDateDet)
                    $scope.SelectedPDC.ClearedDate = $filter('date')(new Date($scope.SelectedPDC.ClearedDateDet.dateAD), 'yyyy-MM-dd');

                var data = angular.copy($scope.SelectedPDC);
                if ($scope.SelectedPDC.TypeOfPDC == 'REC')
                    data.TypeOfPDC = 1;
                else
                    data.TypeOfPDC = 2;

                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/PDCCleared",
                    dataType: "json",
                    data: JSON.stringify(data)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.GetAllPostDatedCheque();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    };



    $scope.BounceModal = function (beData) {

        if (beData.IsCleared == true) {

            Swal.fire('This PDC was already cleared');
        }
        else if (beData.IsCancel == true) {
            Swal.fire('This PDC was already canceled');
        }
        else {

            $scope.SelectedPDC = beData;

            $('#modal-bounce').modal('show');
        }

    }
    $scope.BouncePDC = function () {
        $('#modal-bounce').modal('hide');

        var obj = $scope.SelectedPDC;

        Swal.fire({
            title: 'Do you want to bounce the selected PDC (' + obj.LedgerName + ') :- ' + obj.Amount + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                $scope.SelectedPDC.BounceDate = $filter('date')($scope.SelectedPDC.BounceDateDet.dateAD, 'yyyy-MM-dd');
                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/PDCChequeBounce",
                    dataType: "json",
                    data: JSON.stringify($scope.SelectedPDC)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.GetAllPostDatedCheque();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    };



    $scope.BlackListingModal = function (beData) {

        if (beData.IsCleared == true) {

            Swal.fire('This PDC was already cleared');
        }
        else if (beData.IsCancel == true) {
            Swal.fire('This PDC was already canceled');
        }
        else {

            $scope.SelectedPDC = beData;

            $('#modal-blacklisting').modal('show');
        }

    }
    $scope.BlackListingPDC = function () {
        $('#modal-blacklisting').modal('hide');

        var obj = $scope.SelectedPDC;

        Swal.fire({
            title: 'Do you want to black listing the selected PDC (' + obj.LedgerName + ') :- ' + obj.Amount + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var findStatus = mx($scope.BlackListStatusColl).firstOrDefault(p1 => p1.id == $scope.SelectedPDC.BlackListingStatusId);

                var newData = {
                    TranId: $scope.SelectedPDC.TranId,
                    BlackListingDate: $filter('date')($scope.SelectedPDC.BlackListingDateDet.dateAD, 'yyyy-MM-dd'),
                    BlackListingStatusId: $scope.SelectedPDC.BlackListingStatusId,
                    BlackListingStatus: findStatus.text,
                    Remarks: $scope.SelectedPDC.BlackListingRemarks,
                    NextFollowupDate: ($scope.SelectedPDC.BlackListingNextFollowupDateDet ? $filter('date')($scope.SelectedPDC.BlackListingNextFollowupDateDet.dateAD, 'yyyy-MM-dd') : null),
                    CustomerRemarks: $scope.SelectedPDC.BlackListingCustomerRemarks,
                };                
                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/PDCBlackListing",
                    dataType: "json",
                    data: JSON.stringify(newData)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.GetAllPostDatedCheque();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    };





    $scope.LegalActionModal = function (beData) {

        if (beData.IsCleared == true) {

            Swal.fire('This PDC was already cleared');
        }
        else if (beData.IsCancel == true) {
            Swal.fire('This PDC was already canceled');
        }
        else {

            $scope.SelectedPDC = beData;

            $('#modal-legalaction').modal('show');
        }

    }
    $scope.LegalActionPDC = function () {
        $('#modal-legalaction').modal('hide');

        var obj = $scope.SelectedPDC;

        Swal.fire({
            title: 'Do you want to legal action the selected PDC (' + obj.LedgerName + ') :- ' + obj.Amount + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var findStatus = mx($scope.LegalStatusColl).firstOrDefault(p1 => p1.id == $scope.SelectedPDC.LegalStatusId);

                var newData = {
                    TranId: $scope.SelectedPDC.TranId,
                    LegalDate: $filter('date')($scope.SelectedPDC.LegalDateDet.dateAD, 'yyyy-MM-dd'),
                    LegalStatusId: $scope.SelectedPDC.LegalStatusId,
                    LegalStatus: findStatus.text,
                    Remarks: $scope.SelectedPDC.LegalRemarks,
                    NextFollowupDate: ($scope.SelectedPDC.LegalNextFollowupDateDet ? $filter('date')($scope.SelectedPDC.LegalNextFollowupDateDet.dateAD, 'yyyy-MM-dd') : null),
                    CustomerRemarks: $scope.SelectedPDC.LegalCustomerRemarks,
                };
                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/PDCLegalAction",
                    dataType: "json",
                    data: JSON.stringify(newData)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.GetAllPostDatedCheque();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    };

    $scope.DownloadAsXls = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var dataColl = $scope.GetDataForPrint();

        var paraData = {
            Period: $scope.newPDC.DateFromDet.dateBS + " TO " + $scope.newPDC.DateToDet.dateBS,
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "PDC.xlsx");
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });
    }


    $scope.ChangeSelection = function (curRow) {
        
        $scope.SelectedPDC.TotalPaidAmt = $scope.SelectedPDC.Amount;
        $scope.ChangeSelectedBillWiseAmt('totalPaidAmt');
    }
    $scope.ChangeSelectedBillWiseAmt = function (colName) {
        var totalAmt = $scope.SelectedPDC.TotalPaidAmt;
        var countB = 0;
        $scope.SelectedPDC.BillRefColl.forEach(function (br) {
            if (br.IsSelected == true) {
                if (totalAmt >= br.Amount) {
                    br.PaidAmt = br.Amount;
                    totalAmt -= br.Amount;
                    countB++;
                } else if (totalAmt < br.Amount) {
                    br.PaidAmt = totalAmt;
                    totalAmt = 0;
                    countB++;
                }
            }
            else
            {
                br.PaidAmt = 0;
            }
        });
         
        $scope.SelectedPDC.CrAmount = $scope.SelectedPDC.TotalPaidAmt;

        if (countB == 0) {
            $scope.SelectedPDC.TotalPaidAmt = 0;
            $scope.SelectedPDC.CrAmount = 0;
        }
    }

    $scope.ChangeBillWiseAmt = function (colName) {
        if (colName == 'totalPaidAmt') {
            var totalAmt = $scope.SelectedPDC.TotalPaidAmt;
            $scope.SelectedPDC.BillRefColl.forEach(function (br) {

                if (totalAmt >= br.Amount) {
                    br.PaidAmt = br.Amount;
                    totalAmt -= br.Amount;
                } else if (totalAmt < br.Amount) {
                    br.PaidAmt = totalAmt;
                    totalAmt = 0;
                }

            });

            //if ($scope.CurLedgerAllocation.DrCr == 1)
            //    $scope.CurLedgerAllocation.DrAmount = $scope.CurLedgerAllocation.TotalPaidAmt;
            //else
            $scope.SelectedPDC.CrAmount = $scope.SelectedPDC.TotalPaidAmt;
        }
        else if (colName == 'paidAmt') {
            $scope.SelectedPDC.TotalPaidAmt = 0;
            var amt = 0;
            angular.forEach($scope.SelectedPDC.BillRefColl, function (br) {
                if (br.PaidAmt > 0) {
                    amt += br.PaidAmt;
                }
            });

            $scope.SelectedPDC.TotalPaidAmt = amt;             
            $scope.SelectedPDC.CrAmount = amt;

        }
         

    }
	
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
        contextMenu.style.display = 'none';
    });

    $(document).ready(function () {
        $(this).bind("contextmenu", function (e) {
            e.preventDefault();
        });
    });

    $scope.ChangeDate = function (field, dateStyle) {
        $timeout(function () {

            if (field == 'ClearedDate') {
                if (dateStyle == 1) //AD
                {
                    if ($scope.SelectedPDC.ClearedDateADDet) {
                        $scope.SelectedPDC.ClearedDate_TMP = new Date($scope.SelectedPDC.ClearedDateADDet.dateAD);
                    }
                }
                else if (dateStyle == 2) //BS
                {
                    if ($scope.SelectedPDC.ClearedDateDet) {
                        $scope.SelectedPDC.ClearedDateAD_TMP = new Date($scope.SelectedPDC.ClearedDateDet.dateAD);
                    }
                }
            }
            else if (field == 'BounceDate') {
                if (dateStyle == 1) //AD
                {
                    if ($scope.SelectedPDC.BounceDateADDet) {
                        $scope.SelectedPDC.BounceDate_TMP = new Date($scope.SelectedPDC.BounceDateADDet.dateAD);
                    }
                }
                else if (dateStyle == 2) //BS
                {
                    if ($scope.SelectedPDC.BounceDateDet) {
                        $scope.SelectedPDC.BounceDateAD_TMP = new Date($scope.SelectedPDC.BounceDateDet.dateAD);
                    }
                }
            }
            else if (field == 'BlackListingDate') {
                if (dateStyle == 1) //AD
                {
                    if ($scope.SelectedPDC.BlackListingDateADDet) {
                        $scope.SelectedPDC.BlackListingDate_TMP = new Date($scope.SelectedPDC.BlackListingDateADDet.dateAD);
                    }
                }
                else if (dateStyle == 2) //BS
                {
                    if ($scope.SelectedPDC.BlackListingDateDet) {
                        $scope.SelectedPDC.BlackListingDateAD_TMP = new Date($scope.SelectedPDC.BlackListingDateDet.dateAD);
                    }
                }
            }
            else if (field == 'BlackListingNextFollowupDate') {
                if (dateStyle == 1) //AD
                {
                    if ($scope.SelectedPDC.BlackListingNextFollowupDateADDet) {
                        $scope.SelectedPDC.BlackListingNextFollowupDate_TMP = new Date($scope.SelectedPDC.BlackListingNextFollowupDateADDet.dateAD);
                    }
                }
                else if (dateStyle == 2) //BS
                {
                    if ($scope.SelectedPDC.BlackListingNextFollowupDateDet) {
                        $scope.SelectedPDC.BlackListingNextFollowupDateAD_TMP = new Date($scope.SelectedPDC.BlackListingNextFollowupDateDet.dateAD);
                    }
                }
            }
            else if (field == 'LegalDate') {
                if (dateStyle == 1) //AD
                {
                    if ($scope.SelectedPDC.LegalDateADDet) {
                        $scope.SelectedPDC.LegalDate_TMP = new Date($scope.SelectedPDC.LegalDateADDet.dateAD);
                    }
                }
                else if (dateStyle == 2) //BS
                {
                    if ($scope.SelectedPDC.LegalDateDet) {
                        $scope.SelectedPDC.LegalDateAD_TMP = new Date($scope.SelectedPDC.LegalDateDet.dateAD);
                    }
                }
            }
            else if (field == 'LegalNextFollowupDate') {
                if (dateStyle == 1) //AD
                {
                    if ($scope.SelectedPDC.LegalNextFollowupDateADDet) {
                        $scope.SelectedPDC.LegalNextFollowupDate_TMP = new Date($scope.SelectedPDC.LegalNextFollowupDateADDet.dateAD);
                    }
                }
                else if (dateStyle == 2) //BS
                {
                    if ($scope.SelectedPDC.LegalNextFollowupDateDet) {
                        $scope.SelectedPDC.LegalNextFollowupDateAD_TMP = new Date($scope.SelectedPDC.LegalNextFollowupDateDet.dateAD);
                    }
                }
            }



        });
    }

});
