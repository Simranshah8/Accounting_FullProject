"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("jobCardListCntrl", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'jobcard.csv',
            sheetName: 'jobcard'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.RefTableColColl = GlobalServices.getRptTableColColl();

        GetCustomRptColumns();

        $scope.comDet = {};
        GlobalServices.getCompanyDet().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.comDet = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
         

        $scope.BranchList = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

      
        $scope.dayBook = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0,
            For: 1,
            IsCancel: false,
            ReportType:0,
        };

        $scope.searchData = {
            UserColl: '',
            DayBook: ''
        };

        $scope.loadingstatus = "stop";

        var columnDefs = [
            {
                headerName: "Date", width: 130, field: "EntryDate", cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                 pinned: 'left'
            },
            {
                headerName: "Miti", width: 120,
                cellRenderer:
                    function (params) {
                        return DateFormatBS(params.data.NY, params.data.NM, params.data.ND) + '</a ></center>';
                    }, pinned: 'left'

            },
            { headerName: "Job No.", width: 120, field: "AutoManualNo", filter: true, pinned: 'left' },
            { headerName: "S.No.", width: 100, field: "SNo", filter: true, pinned: 'left' },
            { headerName: "Status", width: 150, field: "JobStatus", filter: true },
            { headerName: "Vin No.", width: 120, field: "VinNo", filter: true },
            { headerName: "Engine No.", width: 140, field: "EngineNo", filter: true },
            { headerName: "ChSrl No.", width: 140, field: "ChSrlNo", filter: true },
            { headerName: "Regd No.", width: 150, field: "RegdNo", filter: true },
            
            { headerName: "Service Advisor", width: 150, field: "ServiceAdvisor", filter: true },
            { headerName: "Mechanic", width: 150, field: "Mechanic", filter: true },
            { headerName: "Running HR", width: 140, field: "RunningHR", filter: true },
            { headerName: "Vehicle Type", width: 120, field: "VehicleType", filter: true },
            { headerName: "Model", width: 120, field: "VehicleModel", filter: true },
            { headerName: "Color", width: 120, field: "VehicleColor", filter: true },
            { headerName: "Running KM", width: 140, field: "RunningKM", filter: true },
            { headerName: "Job To Be Attended", width: 180, field: "JobToBeAttended", filter: true },
            { headerName: "Complain", width: 180, field: "Complain", filter: true },
            { headerName: "Remarks", width: 120, field: "Remarks", filter: true },
            { headerName: "IsClosed", width: 120, field: "IsClosed", filter: true },
            { headerName: "Branch", width: 120, field: "BranchName", filter: true },
            { headerName: "Party Name", width: 120, field: "Party", filter: true },
            { headerName: "Address", width: 120, field: "PartyAddress", filter: true },
            { headerName: "Mobile No", width: 120, field: "MobileNO", filter: true },
            { headerName: "JobCard For", width: 120, field: "JobCardFor", filter: true },
            { headerName: "Service Type", width: 120, field: "ServiceType", filter: true },
            { headerName: "JobCardType", width: 120, field: "JobCardType", filter: true },
            { headerName: "ClosedDateTime", width: 150, field: "ClosedDateTime", filter: true },


            {
                headerName: "Parts Amt", width: 150, filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    return beData.PartsAmt;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>'
            },
            {
                headerName: "Lube Amt", width: 150, filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    return beData.LubeAmt;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>'
            },
            {
                headerName: "Ext. Amt", width: 150, filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    return beData.ExtAmt;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>'
            },
            {
                headerName: "OutSitePartsAmt", width: 150, filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    return beData.OutSitePartsAmt;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>'
            },
            {
                headerName: "LabourCharge", width: 150, filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    return beData.LabourCharge;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>'
            },
            {
                headerName: "TotalAmount", width: 150, filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    return beData.TotalAmount;
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>'
            },
          
            { headerName: "Closed Remarks", width: 180, field: "CloseRemarks", filter: true },
            { headerName: "Site Location", width: 120, field: "SiteLocation", filter: true },
            { headerName: "Date Of Sale", width: 140, field: "DateOfSale", filter: true },
            { headerName: "Estimated Time", width: 120, field: "EstimatedTime", filter: true },
            { headerName: "Estimated Cost", width: 120, field: "EstimatedCost", filter: true },
            { headerName: "Opening DateTime", width: 150, field: "OpenDateTime", filter: true },
            { headerName: "Asign DateTime", width: 150, field: "AsignDateTime", filter: true },
            { headerName: "Arrival DateTime", width: 150, field: "ArrivalDateTIme", filter: true },
            { headerName: "MTTC", width: 120, field: "MTTC", filter: true },

            { headerName: "Age", width: 120, field: "VehicleAge", filter: true },
            { headerName: "MTTR", width: 120, field: "MTTR", filter: true },
            { headerName: "ART", width: 120, field: "ART", filter: true },
            { headerName: "MU", width: 120, field: "MU", filter: true },
            { headerName: "Warranty", width: 120, field: "Warranty", filter: true },
            { headerName: "AMC", width: 120, field: "AMC", filter: true },
            { headerName: "CustomerType", width: 120, field: "CustomerType", filter: true },
            { headerName: "Age", width: 120, field: "Age", filter: true },
            { headerName: "Delivery No.", width: 150, field: "DeliveryNo", filter: true },
            { headerName: "Invoice No.", width: 150, field: "SalesInvoiceNo", filter: true },
            { headerName: "Api Response", width: 150, field: "Api_Response", filter: true },
            { headerName: "Api LogDateTime", width: 150, field: "Api_LogDateTime", filter: true },
            { headerName: "Last Comment", width: 150, field: "L_Comment", filter: true },

            { headerName: "Dealer Code", width: 120, field: "DealerCode", filter: true },
            { headerName: "Dealer Name", width: 120, field: "DealerName", filter: true },
            { headerName: "Dealer Address", width: 120, field: "DealerAddress", filter: true },

            {
                headerName: "Action",
                width: 50,
                cellRenderer: function (params) {
                    return '<div class="btn-group" style="position: fixed; ">' +
                        '<button type="button" class="btn btn-default px-1 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span class="caret"></span>' +
                        '</button>' +
                        '<ul class="dropdown-menu dropdown-menu-right p-2" style="position: absolute; left: 0;">' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Add Remarks" ng-click="ShowRemarks(this.data)"><i class="fas fa-comment text-info"></i> Add Remarks</a></li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Update Running K.M." ng-click="ShowUpdateKM(this.data.TranId,187,this.data.BranchId,this.data)"><i class="fas fa-info text-info"></i> Update K.M.</a></li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Update Running HR" ng-click="ShowUpdateHR(this.data.TranId,187,this.data.BranchId,this.data)"><i class="fas fa-info text-info"></i> Update HR</a></li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Work Order" ng-click="ShowWorkOrder(this.data.TranId,187,this.data.BranchId,this.data)"><i class="fas fa-save text-info"></i> Work Order</a></li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Print" ng-click="PrintVoucher(this.data.TranId,187,this.data.BranchId,this.data)"><i class="fas fa-print text-info"></i> Print JobCard</a></li>' +
                        '<li ng-show="this.data.IsClosed==true"><a data-toggle="tooltip" data-placement="top" title="Print" ng-click="PrintVoucher(this.data.TranId,218,this.data.BranchId,this.data)"><i class="fas fa-print text-info"></i> Print Close JobCard</a></li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Print" ng-click="PrintVoucher(this.data.TranId,189,this.data.BranchId,this.data)"><i class="fas fa-print text-info"></i> Print Parts Details</a></li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Print" ng-click="PrintVoucher(this.data.TranId,188,this.data.BranchId,this.data)"><i class="fas fa-print text-info"></i> Print Inspection Details</a></li>' +
                        '<li ng-show="this.data.DeliveryTranId>0"><a data-toggle="tooltip" data-placement="top" title="Print" ng-click="PrintInvVoucher(this.data.DeliveryTranId,54,this.data.BranchId,this.data.DeliveryVoucherId,12)"><i class="fas fa-print text-info"></i> Print DeliveryNote</a></li>' +
                        '<li ng-show="this.data.SalesTranId>0"><a data-toggle="tooltip" data-placement="top" title="Print" ng-click="PrintInvVoucher(this.data.SalesTranId,56,this.data.BranchId,this.data.SalesVoucherId,14)"><i class="fas fa-print text-info"></i> Print Invoice</a></li>' +
                        '<li ng-hide="this.data.Api_Response.length>0"><a data-toggle="tooltip" data-placement="top" title="Push To API" ng-click="PushToApi(this.data)"><i class="fas fa-save text-info"></i> Push To API</a></li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Generate DeliveryNote" ng-click="GenerateDN(this.data)"><i class="fas fa-save text-info"></i> Generate DeliveryNote</a></li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Re-Open" ng-click="ShowReOpen(this.data.TranId,this.data)"><i class="fas fa-info text-info"></i>Re-Open</a></li>' +
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
            columnDefs: columnDefs,
            enableColResize: true,
            rowData: null,
            filter: true,
            enableFilter: true,
            rowSelection: 'multiple',
            suppressHorizontalScroll: true,
            alignedGrids: [],

            onFilterChanged: function () {

                var dt = {
                    JobNo: "TOTAL =>",
                    PartsAmt: 0,
                    OutSitePartsAmt: 0,
                    LabourCharge: 0,
                    LubeAmt: 0,
                    ExtAmt: 0,
                    TotalAmount: 0,
                };
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var dc = node.data;

                    dt.PartsAmt = dt.PartsAmt + dc.PartsAmt;
                    dt.OutSitePartsAmt = dt.OutSitePartsAmt + dc.OutSitePartsAmt;
                    dt.LabourCharge = dt.LabourCharge + dc.LabourCharge;
                    dt.LubeAmt = dt.LubeAmt + dc.LubeAmt;
                    dt.ExtAmt = dt.ExtAmt + dc.ExtAmt;
                    dt.TotalAmount = dt.TotalAmount + dc.TotalAmount;
                });
                  
                $scope.gridOptionsBottom.api.setRowData(dt);
            }

        };


        $scope.dataForBottomGrid = [
            {
                JobNo: 'Total =>',
            }];

        $scope.gridOptionsBottom = {
            defaultColDef: {
                resizable: true,
                width: 90
            },
            columnDefs: columnDefs,
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

        $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });

    }


    $scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };

    $scope.SelectedVoucher = null;
    $scope.CancelModal = function (e) {

        if ($scope.dayBook.For != 1)
            return;

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
                tranColl1.push(obj);

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
    $scope.deleteVoucher = function (tranId, voucherType, voucherId, voucherName, voucherNo) {

        Swal.fire({
            title: 'Do you want to delete the selected voucher(' + voucherName + ') :- ' + voucherNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    voucherType: voucherType,
                    voucherId: voucherId,
                    tranId: tranId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Global/DelAccInvTransaction",
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

    }

    $scope.ForCustomColumn = {};
    $scope.UserWiseColl = [];
    $scope.GetDayBook = function () {


        $scope.dayBook.TotalOpen = 0;
        $scope.dayBook.TotalClose = 0;
        $scope.dayBook.TotalCancel = 0;
        $scope.UserWiseColl = [];

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.dayBook.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.dayBook.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.dayBook.DateToDet)
            dateTo = new Date(($filter('date')($scope.dayBook.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var beData = {
            dateFrom: dateFrom,
            dateTo: dateTo,
            ReportType: $scope.dayBook.ReportType 
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Service/Reporting/GetJobCardList",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            var dtData = res.data.Data;

            $scope.dayBook.TotalOpen = dtData.TotalOpen;
            $scope.dayBook.TotalClose = dtData.TotalClose;
            $scope.dayBook.TotalCancel = dtData.TotalCancel;

            var dt = {
                JobNo: "TOTAL =>",
                PartsAmt: 0,
                OutSitePartsAmt: 0,
                LabourCharge: 0,
                LubeAmt: 0,
                ExtAmt: 0,
                TotalAmount:0,
            };

            dtData.DataColl.forEach(function (dc) {
                dt.PartsAmt = dt.PartsAmt + dc.PartsAmt;
                dt.OutSitePartsAmt = dt.OutSitePartsAmt + dc.OutSitePartsAmt;
                dt.LabourCharge = dt.LabourCharge + dc.LabourCharge;
                dt.LubeAmt = dt.LubeAmt + dc.LubeAmt;
                dt.ExtAmt = dt.ExtAmt + dc.ExtAmt;
                dt.TotalAmount = dt.TotalAmount + dc.TotalAmount;
            });

            $scope.RptDataColl = dtData.DataColl;
            $scope.ForCustomColumn = $scope.RptDataColl[0];
            if ($scope.CustomRptColumn && $scope.CustomRptColumn.TranId > 0) {
                $scope.GetCustomColData();
            }
            else {
                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);

                $scope.gridOptions.api.setRowData(dtData.DataColl);
                 
            }
          
            $scope.loadingstatus = "stop";
            hidePleaseWait();

        }, function (errormessage) {

            $scope.loadingstatus = 'stop';

            alert('Unable to Store data. pls try again.' + errormessage.responseText);
        });

    };
     
    $scope.Print = function ()
    {
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

                                                    var findV = mx($scope.VoucherTypeList).firstOrDefault(p1 => p1.id == $scope.dayBook.VoucherId);

                                                    var rptPara = {
                                                        rpttranid: rptTranId,
                                                        istransaction: false,
                                                        entityid: EntityId,
                                                        voucherid: 0,
                                                        tranid: 0,
                                                        vouchertype: 0,
                                                        sessionid: res.data.Data.ResponseId,
                                                        Period: $scope.dayBook.DateFromDet.dateBS + " TO " + $scope.dayBook.DateToDet.dateBS,
                                                        Voucher: findV ? findV.text : ''
                                                    };
                                                    var paraQuery = param(rptPara);

                                                    document.body.style.cursor = 'wait';
                                                    document.getElementById("frmRpt").src = '';
                                                    document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + paraQuery;
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

                                var findV = mx($scope.VoucherTypeList).firstOrDefault(p1 => p1.id == $scope.dayBook.VoucherId);

                                var rptPara = {
                                    rpttranid: rptTranId,
                                    istransaction: false,
                                    entityid: EntityId,
                                    voucherid: 0,
                                    tranid: 0,
                                    vouchertype: 0,
                                    sessionid: res.data.Data.ResponseId,
                                    Period: $scope.dayBook.DateFromDet.dateBS + " TO " + $scope.dayBook.DateToDet.dateBS,
                                    Voucher: findV ? findV.text : ''
                                };
                                var paraQuery = param(rptPara);

                                document.body.style.cursor = 'wait';
                                document.getElementById("frmRpt").src = '';
                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + paraQuery;
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

        var RptParamentersColl = [];

        RptParamentersColl.push({
            Name: "Period",
            Value: $('#dtDateFrom').val() + ' To ' + $('#dtDateTo').val()
        });


        var filterData = [];

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var dayBook = node.data;
            filterData.push(dayBook);
        });

        return filterData;

    };

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }


    $scope.ShowUpdateKM = function (tranId, entityId, branchId, curRow) {
         
        $scope.SelectedVoucher = curRow;

        $('#modal-runningkm').modal('show');

    }

    $scope.UpdateRunningKM = function () {
        $('#modal-runningkm').modal('hide');

        var obj = $scope.SelectedVoucher;

        Swal.fire({
            title: 'Do you want to update the selected jobcard (' + obj.VoucherName + ') :- ' + obj.AutoManualNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                 

                var para = {
                    TranId: obj.TranId,
                    Remarks: obj.KMReason,
                    RunningKM:obj.RunningKM,
                }

                $http({
                    method: 'POST',
                    url: base_url + "Service/Transaction/UpdateKM",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    };

     
    $scope.ShowUpdateHR = function (tranId, entityId, branchId, curRow) {

        $scope.SelectedVoucher = curRow;

        $('#modal-runninghr').modal('show');

    }

    $scope.UpdateRunningHR = function () {
        $('#modal-runninghr').modal('hide');

        var obj = $scope.SelectedVoucher;

        Swal.fire({
            title: 'Do you want to update the selected jobcard (' + obj.VoucherName + ') :- ' + obj.AutoManualNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();


                var para = {
                    TranId: obj.TranId,
                    Remarks: obj.HRReason,
                    RunningHR: obj.RunningHR,
                }

                $http({
                    method: 'POST',
                    url: base_url + "Service/Transaction/UpdateHR",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    };


    $scope.ShowReOpen = function (tranId, curRow) {

        if (curRow.JobStatus == 'CLOSED') {
            $scope.SelectedVoucher = curRow;

            $('#modal-reopen').modal('show');
        }

    }
    $scope.UpdateReOpen = function () {
        $('#modal-reopen').modal('hide');

        var obj = $scope.SelectedVoucher;

        Swal.fire({
            title: 'Do you want to re-open the selected jobcard (' + obj.VoucherName + ') :- ' + obj.AutoManualNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                obj.CloseRemarks = obj.HRReason;

                var newData = {
                    ClosedDateTime:obj.ClosedDateTime,
                    ClosedBy: obj.ClosedBy,
                    CloseRemarks: obj.CloseRemarks,
                    TranId: obj.TranId,
                    Mechanic: obj.Mechanic,
                    CloseNotes: obj.CloseNotes,
                };
                $http({
                    method: 'POST',
                    url: base_url + "Service/Transaction/ReOpenJobCard",
                    headers: { 'Content-Type': undefined },
                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("jsonData", angular.toJson(data.jsonData));
                         

                        return formData;
                    },
                    data: { jsonData: newData }
                }).then(function (res) {
                    $scope.loadingstatus = "stop";
                    hidePleaseWait();
                     Swal.fire(res.data.ResponseMSG);

                }, function (errormessage) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                });
               
            }
        });

    };


    $scope.PrintVoucher = function (tranId, entityId,branchId,curRow)
    {
        if (tranId && tranId > 0) {

            $http({
                method: 'GET',
                url: base_url + "ReportEngine/GetReportTemplates?entityId=" + entityId + "&voucherId=0&isTran=true",
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
                                                var para = {
                                                    rpttranid: rptTranId,
                                                    istransaction: true,
                                                    entityid: entityId,
                                                    tranid: tranId,
                                                    BranchId: branchId,
                                                    JobNo: curRow.AutoManualNo,
                                                    VinNo:curRow.VinNo,
                                                    EngineNo:curRow.EngineNo,
                                                    ChSrlNo:curRow.ChSrlNo,
                                                    RegdNo:curRow.RegdNo,
                                                    Party:curRow.Party,
                                                    PartyAddress:curRow.PartyAddress,
                                                    MobileNO: curRow.MobileNO,
                                                    VehicleAge: curRow.VehicleAge,
                                                };
                                                document.body.style.cursor = 'wait';
                                                document.getElementById("frmRpt").src = '';
                                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + param(para);
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
                            var para = {
                                rpttranid: rptTranId,
                                istransaction: true,
                                entityid: entityId,
                                tranid: tranId,
                                BranchId: branchId,
                                JobNo: curRow.AutoManualNo,
                                VinNo: curRow.VinNo,
                                EngineNo: curRow.EngineNo,
                                ChSrlNo: curRow.ChSrlNo,
                                RegdNo: curRow.RegdNo,
                                Party: curRow.Party,
                                PartyAddress: curRow.PartyAddress,
                                MobileNO: curRow.MobileNO,
                                VehicleAge: curRow.VehicleAge,
                            };
                            document.body.style.cursor = 'wait';
                            document.getElementById("frmRpt").src = '';
                            document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?"+param(para);
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

    $scope.PrintInvVoucher = function (tranId, entityId, branchId,voucherId,voucherType) {

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
                                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + entityId + "&voucherid=" + voucherId + "&tranid=" + tranId + "&vouchertype=" + voucherType + "&BranchId=" + branchId;
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
                            document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + entityId + "&voucherid=" + voucherId + "&tranid=" + tranId + "&vouchertype=" + voucherType + "&BranchId=" + branchId;
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

    $scope.PushToApi = function (curRow) {
         

        Swal.fire({
            title: 'Do you want to push the selected jobcard (' + curRow.EngineNo + ') :- ' + curRow.AutoManualNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                 
                var para = {
                    tranId: curRow.TranId,
                }

                $http({
                    method: 'POST',
                    url: base_url + "v1/Sipradi/PushVH",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    };

    $scope.GenerateDN = function (curRow) {

        Swal.fire({
            title: 'Do you want to generate DN the selected jobcard (' + curRow.EngineNo + ') :- ' + curRow.AutoManualNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    TranId: curRow.TranId,
                }

                $http({
                    method: 'POST',
                    url: base_url + "Service/Transaction/GenerateDN",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }

    function GetCustomRptColumns() {
        $scope.CustomRptColumn = {
            Qry: '',
            ColumnList: '',
            MapColl: [],
        };

        GlobalServices.getCustomRptColumns(EntityId).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CustomRptColumn = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }
    $scope.RefTableRows = [];
    $scope.SourceColColl = [];
    $scope.ShowCustomColumns = function () {
        if (!$scope.RefTableRows || $scope.RefTableRows.length == 0) {
            $scope.RefTableRows = [];

            if ($scope.CustomRptColumn && $scope.CustomRptColumn.TranId > 0) {
                $scope.CustomRptColumn.MapColl.forEach(function (cc) {
                    $scope.RefTableRows.push(cc);
                });
            } else {
                $scope.RefTableRows.push({});
            }

        }

        if (!$scope.SourceColColl || $scope.SourceColColl.length == 0) {
            $scope.SourceColColl = [];
            for (var v in $scope.ForCustomColumn) {
                $scope.SourceColColl.push({
                    name: v,
                    text: v,
                });
            }
        }

        if ($scope.SourceColColl.length > 0) {
            $('#frmCustomColumns').modal('show');
        }
    }

    $scope.AddRowIntoRefTblRow = function (ind) {
        $scope.RefTableRows.splice(ind + 1, 0, {});
    };
    $scope.delRowIntoRefTblRow = function (ind) {
        $scope.RefTableRows.splice(ind, 1);
    };

    $scope.OkRefTableRows = function () {
        $scope.CustomRptColumn.EntityId = EntityId;
        $scope.CustomRptColumn.ColumnList = '';
        $scope.CustomRptColumn.MapColl = [];

        $scope.RefTableRows.forEach(function (r) {
            if (r.RefColName && r.SourceColName && r.RefColName.length > 0 && r.SourceColName.length > 0) {
                $scope.CustomRptColumn.MapColl.push({
                    SNo: 0,
                    ColName: r.ColName,
                    RefColName: r.RefColName,
                    SourceColName: r.SourceColName,
                    Formula: r.Formula,
                });
            }
            else if (r.ColName && r.Formula && r.ColName.length > 0 && r.Formula.length > 0) {
                $scope.CustomRptColumn.MapColl.push({
                    SNo: 0,
                    ColName: r.ColName,
                    RefColName: r.RefColName,
                    SourceColName: r.SourceColName,
                    Formula: r.Formula,
                });
            }
        });

        var tmpDataColl = [];
        $scope.RptDataColl.forEach(function (rptRow) {
            var newRow = {};
            var hasValue = false;
            $scope.RefTableRows.forEach(function (r) {
                if (r.RefColName && r.SourceColName) {
                    if (r.RefColName.length > 0 && r.SourceColName.length > 0) {
                        newRow[r.RefColName] = rptRow[r.SourceColName];
                        hasValue = true;
                    }
                }
            });

            if (hasValue == true) {
                tmpDataColl.push(newRow);
            }
        });


        $http({
            method: 'POST',
            url: base_url + "Global/GetCustomColForRpt",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("customData", angular.toJson(data.jsonData));
                formData.append("qry", $scope.CustomRptColumn.Qry);
                return formData;
            },
            data: { jsonData: tmpDataColl }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();
            if (res.data.IsSuccess == true) {

                if (res.data.Data && res.data.Data.length > 0) {
                    var fstRow = res.data.Data[0];
                    for (var fr in fstRow) {

                        if (fr != 'RptSNo') {
                            if ($scope.CustomRptColumn.ColumnList.length > 0)
                                $scope.CustomRptColumn.ColumnList = $scope.CustomRptColumn.ColumnList + ',';

                            $scope.CustomRptColumn.ColumnList = $scope.CustomRptColumn.ColumnList + fr;
                        }
                    }

                    $http({
                        method: 'POST',
                        url: base_url + "Global/SaveCustomColForRpt",
                        headers: { 'Content-Type': undefined },

                        transformRequest: function (data) {

                            var formData = new FormData();
                            formData.append("customData", angular.toJson(data.jsonData));

                            return formData;
                        },
                        data: { jsonData: $scope.CustomRptColumn }
                    }).then(function (res1) {

                        $scope.loadingstatus = "stop";
                        hidePleaseWait();
                        if (res1.data.IsSuccess == true) {
                            $('#frmCustomColumns').modal('hide');
                        }
                        else {
                            Swal.fire(res1.data.ResponseMSG);
                        }
                    }, function (errormessage) {
                        hidePleaseWait();
                        $scope.loadingstatus = "stop";

                    });
                }
            }
            else if (res.data.IsSuccess != undefined) {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    }

    $scope.GetCustomColData = function () {

        var tmpDataColl = [];
        if ($scope.CustomRptColumn.Qry && $scope.CustomRptColumn.Qry.length > 0) {
            var sno = 1;
            $scope.RptDataColl.forEach(function (rptRow) {
                var newRow = {};
                var hasValue = false;
                newRow.RptSNo = sno;
                $scope.CustomRptColumn.MapColl.forEach(function (r) {
                    if (r.RefColName && r.SourceColName) {
                        if (r.RefColName.length > 0 && r.SourceColName.length > 0) {
                            var rval = rptRow[r.SourceColName];
                            if (r.RefColName.startsWith('N_') == true || r.RefColName.startsWith('A_') == true) {
                                var isNum = isNumeric(rval);
                                if (rval == null || rval == undefined || isNum == false)
                                    newRow[r.RefColName] = null;
                                else if (rval.toString().length == 0)
                                    newRow[r.RefColName] = null;
                                else
                                    newRow[r.RefColName] = rval;
                            }
                            else
                                newRow[r.RefColName] = rval;

                            hasValue = true;
                        }
                    }
                });

                if (hasValue == true) {
                    tmpDataColl.push(newRow);
                }

                sno++;
            });
        }


        var tmpNewColl = [];
        if ($scope.CustomRptColumn.ColumnList) {
            $scope.CustomRptColumn.ColumnList.split(',').forEach(function (col) {
                tmpNewColl.push(col);
            });
        }

        var tmpCustColColl = [];
        if ($scope.CustomRptColumn.MapColl) {
            $scope.CustomRptColumn.MapColl.forEach(function (mc) {
                if (mc.Formula.length > 0) {
                    mc.FormulaColumnColl = extractStringVariables(mc.Formula);
                    tmpCustColColl.push(mc);
                }
            });
        }

        if ($scope.CustomRptColumn.Qry && $scope.CustomRptColumn.Qry.length > 0) {
            $http({
                method: 'POST',
                url: base_url + "Global/GetCustomColForRpt",
                headers: { 'Content-Type': undefined },

                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("customData", angular.toJson(data.jsonData));
                    formData.append("qry", $scope.CustomRptColumn.Qry);
                    return formData;
                },
                data: { jsonData: tmpDataColl }
            }).then(function (res) {

                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res.data.IsSuccess == true) {
                    if (res.data.Data && res.data.Data.length > 0) {
                        if (tmpNewColl.length > 0) {
                            res.data.Data.forEach(function (nRow) {
                                var findRow = $scope.RptDataColl[nRow.RptSNo - 1];
                                if (findRow) {
                                    tmpNewColl.forEach(function (r) {
                                        findRow[r] = nRow[r];
                                    });
                                }
                            });
                        }


                        if (tmpCustColColl.length > 0) {
                            $scope.RptDataColl.forEach(function (findRow) {
                                tmpCustColColl.forEach(function (cc) {
                                    var formula = cc.Formula;
                                    try {

                                        cc.FormulaColumnColl.forEach(function (fc) {
                                            var pval = isEmptyAmt(findRow[fc]);
                                            formula = formula.replaceAll(fc, pval);
                                        });

                                        var nVal = math.evaluate(formula);
                                        findRow[cc.ColName] = isEmptyAmt(nVal);
                                    } catch { }

                                });

                            });
                        }


                        /**** Start Data Load into List *****/

                        var qryColumnDefs = mx($scope.columnDefs);

                        tmpNewColl.forEach(function (col) {
                            var find = qryColumnDefs.firstOrDefault(p1 => p1.field == col);
                            if (find == null) {
                                var newCol = { headerName: col, width: 140, field: col, cellStyle: { 'text-align': 'left' } };
                                $scope.columnDefs.push(newCol);
                            }

                        });

                        tmpCustColColl.forEach(function (mc) {
                            if (mc.ColName && mc.ColName.length > 0) {

                                var find = qryColumnDefs.firstOrDefault(p1 => p1.field == mc.ColName);
                                if (find == null) {
                                    var newCol = { headerName: mc.ColName, width: 140, field: mc.ColName, cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } };
                                    $scope.columnDefs.push(newCol);
                                }
                            }
                        });

                        $scope.gridOptionsBottom.columnDefs = $scope.columnDefs;
                        $scope.gridOptionsBottom.api.setColumnDefs($scope.columnDefs);

                        $scope.gridOptions.columnDefs = $scope.columnDefs;
                        $scope.gridOptions.api.setColumnDefs($scope.columnDefs);
                          
                        $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
                        $scope.gridOptions.api.setRowData($scope.RptDataColl);

                    }
                }
                else if (res.data.IsSuccess != undefined) {
                    Swal.fire(res.data.ResponseMSG);
                }

            }, function (errormessage) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";

            });
        }
        else {

            if (tmpCustColColl.length > 0) {
                $scope.RptDataColl.forEach(function (findRow) {
                    tmpCustColColl.forEach(function (cc) {
                        var formula = cc.Formula;
                        try {

                            cc.FormulaColumnColl.forEach(function (fc) {
                                var pval = isEmptyAmt(findRow[fc]);
                                formula = formula.replaceAll(fc, pval);
                            });

                            var nVal = math.evaluate(formula);
                            findRow[cc.ColName] = isEmptyAmt(nVal);
                        } catch { }

                    });

                });
            }

            var qryColumnDefs = mx($scope.columnDefs);
            tmpCustColColl.forEach(function (mc) {
                if (mc.ColName && mc.ColName.length > 0) {

                    var find = qryColumnDefs.firstOrDefault(p1 => p1.field == mc.ColName);
                    if (find == null) {
                        var newCol = { headerName: mc.ColName, width: 140, field: mc.ColName, cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } };
                        $scope.columnDefs.push(newCol);
                    }
                }
            });

            $scope.gridOptionsBottom.columnDefs = $scope.columnDefs;
            $scope.gridOptionsBottom.api.setColumnDefs($scope.columnDefs);

            $scope.gridOptions.columnDefs = $scope.columnDefs;
            $scope.gridOptions.api.setColumnDefs($scope.columnDefs);
             
            $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
            $scope.gridOptions.api.setRowData($scope.RptDataColl);


        }

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


    $scope.ClearWorkOrder = function () {
        $scope.newWorkOrder = {
            TranId: null,
            Remarks: '',

        };
    }

    $scope.SelectedJobForWork = null;
    $scope.ShowWorkOrder = function (tranId, entityId, branchId, curRow)
    {
        $scope.ClearWorkOrder();
        $scope.SelectedJobForWork = curRow;
        $scope.newWorkOrder.JobCardId = curRow.TranId;
        $('#WorkOrder').modal('show');

    }

    $scope.UpdateWorkOrder = function () {
        if ($scope.newWorkOrder.FromDateDet) {
            $scope.newWorkOrder.FromDate = $filter('date')(new Date($scope.newWorkOrder.FromDateDet.dateAD), 'yyyy-MM-dd');
        }

        if ($scope.newWorkOrder.ToDateDet) {
            $scope.newWorkOrder.ToDate = $filter('date')(new Date($scope.newWorkOrder.ToDateDet.dateAD), 'yyyy-MM-dd');
        }
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Service/Transaction/SaveJobWorkOrder",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newWorkOrder }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $('#WorkOrder').modal('hide');
                $scope.PrintVoucherJW(res.data.Data.RId, EntityIdJW, $scope.SelectedJobForWork.BranchId, $scope.SelectedJobForWork);
                $scope.ClearWorkOrder();

            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.PrintVoucherJW = function (tranId, entityId, branchId, curRow) {
        if (tranId && tranId > 0) {

            $http({
                method: 'GET',
                url: base_url + "ReportEngine/GetReportTemplates?entityId=" + entityId + "&voucherId=0&isTran=true",
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
                                                var para = {
                                                    rpttranid: rptTranId,
                                                    istransaction: true,
                                                    entityid: entityId,
                                                    tranid: tranId,
                                                    BranchId: branchId,
                                                    JobNo: curRow.AutoManualNo,
                                                    VinNo: curRow.VinNo,
                                                    EngineNo: curRow.EngineNo,
                                                    ChSrlNo: curRow.ChSrlNo,
                                                    RegdNo: curRow.RegdNo,
                                                    Party: curRow.Party,
                                                    PartyAddress: curRow.PartyAddress,
                                                    MobileNO: curRow.MobileNO,
                                                    VehicleAge: curRow.VehicleAge,
                                                };
                                                document.body.style.cursor = 'wait';
                                                document.getElementById("frmRpt").src = '';
                                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + param(para);
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
                            var para = {
                                rpttranid: rptTranId,
                                istransaction: true,
                                entityid: entityId,
                                tranid: tranId,
                                BranchId: branchId,
                                JobNo: curRow.AutoManualNo,
                                VinNo: curRow.VinNo,
                                EngineNo: curRow.EngineNo,
                                ChSrlNo: curRow.ChSrlNo,
                                RegdNo: curRow.RegdNo,
                                Party: curRow.Party,
                                PartyAddress: curRow.PartyAddress,
                                MobileNO: curRow.MobileNO,
                                VehicleAge: curRow.VehicleAge,
                            };
                            document.body.style.cursor = 'wait';
                            document.getElementById("frmRpt").src = '';
                            document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + param(para);
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

    $scope.beData_R = null;
    $scope.newComment = {};
    $scope.CommentList = [];
    $scope.ShowRemarks = function (curRow) {
        $scope.beData_R = curRow;
        $scope.newComment = {};
        $scope.CommentList = [];
        $scope.newComment.TranId = curRow.TranId;
        $scope.newComment.VoucherId = curRow.VoucherId;
        $scope.newComment.EntityId = EntityIdJW;

        var para = {
            TranId: curRow.TranId,
            VoucherId: curRow.VoucherId,
        };
        $http({
            method: 'POST',
            url: base_url + "Account/Transaction/GetTranCommentsbyId",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CommentList = res.data.Data;
                $('#modal-AddComment').modal('show');
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }

    $scope.SaveTransationComment = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();        
        var files = $scope.newComment.Photo_TMP;
        $http({
            method: 'POST',
            url: base_url + "Account/Transaction/SaveTransationComment",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                if (data.files && data.files.length > 0)
                    formData.append("file0", data.files[0]);
                return formData;
            },
            data: { jsonData: $scope.newComment, files: files }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.beData_R = null;
                $scope.newComment = {};
                $scope.CommentList = [];
                $('#modal-AddComment').modal('hide');
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

});

app.controller("fourthCallLogCntrl", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: '4thcalllog.csv',
            sheetName: '4th Call Log'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
         

        $scope.comDet = {};
        GlobalServices.getCompanyDet().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.comDet = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

 
        $scope.dayBook = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0,
            For: 1,
            IsCancel: false
        };

        $scope.searchData = {
            UserColl: '',
            DayBook: ''
        };

        $scope.loadingstatus = "stop";

        var columnDefs = [
            { headerName: "S.No.", width: 120, field: "SNo", filter: true, pinned: 'left' },
            {
                headerName: "Date", width: 130, field: "CallDate", cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                pinned: 'left'
            },
            {
                headerName: "Job Date", width: 130, field: "JobCardDate", cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                pinned: 'left'
            },           
            { headerName: "Job No.", width: 120, field: "JobCardNo", filter: true, pinned: 'left' },
            { headerName: "Vin No.", width: 120, field: "VinNo", filter: true },
            { headerName: "Engine No.", width: 140, field: "EngineNo", filter: true },
            { headerName: "ChSrl No.", width: 140, field: "ChSrlNo", filter: true },
            { headerName: "Regd No.", width: 150, field: "RegdNo", filter: true },
            { headerName: "Service Advisor", width: 150, field: "ServiceAdvisor", filter: true },
            { headerName: "Mechanic", width: 150, field: "Mechanic", filter: true },
            { headerName: "Running HR", width: 140, field: "RunningHR", filter: true },
            { headerName: "Running KM", width: 120, field: "RunningKM", filter: true },
            { headerName: "Model", width: 120, field: "Model", filter: true },
            { headerName: "Branch", width: 120, field: "BranchName", filter: true },
            { headerName: "ClosedDateTime", width: 120, field: "ClosedDateTime", filter: true },
            { headerName: "Close Remarks", width: 140, field: "CloseRemarks", filter: true },
            { headerName: "Job To Be Attended", width: 180, field: "JobToBeAttended", filter: true },
            { headerName: "Job Complain", width: 180, field: "JobCardComplain", filter: true },
            { headerName: "Remarks", width: 120, field: "Remarks", filter: true }, 
            { headerName: "Party Name", width: 120, field: "PartyName", filter: true },
            { headerName: "Address", width: 120, field: "PartyAddress", filter: true },
            { headerName: "Mobile No", width: 120, field: "ContactNo", filter: true },
            { headerName: "JobCard For", width: 120, field: "JobCardFor", filter: true },
            { headerName: "Service Type", width: 120, field: "ServiceType", filter: true },
            { headerName: "JobCardType", width: 120, field: "JobCardType", filter: true },
             
            { headerName: "Date Of Sale", width: 140, field: "DateOfSale", filter: true },
            { headerName: "CallFailedReason", width: 120, field: "CallFailedReason", filter: true },
            { headerName: "CallFailedComment", width: 120, field: "CallFailedComment", filter: true },
            { headerName: "Is it your repeat Purchase?", width: 150, field: "IsRepeatPurchase", filter: true },
            { headerName: "Is Installation Done?", width: 150, field: "IsInstallationDone", filter: true },
            { headerName: "Which implement has been used for installation?", width: 150, field: "ImplementName", filter: true },
            { headerName: "Are you satisfied with delivery and Installation Process?", width: 120, field: "AreYouSatisfied", filter: true },

            { headerName: "Comment on Non Installation", width: 120, field: "SatisfiedYes", filter: true },
            { headerName: "Comment(Not Satisfied)", width: 120, field: "SatisfiedNo", filter: true },
            { headerName: "Do you have any open Complaints?", width: 120, field: "AnyComplain", filter: true },
            { headerName: "Complaint Type", width: 120, field: "Complain", filter: true },
            { headerName: "Complain Comment", width: 120, field: "ComplainComment", filter: true },
            { headerName: "CallBy", width: 120, field: "CallBy", filter: true }, 
             
        ];


        $scope.gridOptions = {
            // a default column definition with properties that get applied to every column
            angularCompileRows: true,
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,

                // set every column width
                width: 90
            },
            columnDefs: columnDefs,
            enableColResize: true,
            rowData: null,
            filter: true,
            enableFilter: true,
            rowSelection: 'multiple',
            suppressHorizontalScroll: true,
            alignedGrids: [],
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
            columnDefs: columnDefs,
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


    }
     
      
    $scope.GetDayBook = function () {

        $scope.UserWiseColl = [];
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.dayBook.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.dayBook.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.dayBook.DateToDet)
            dateTo = new Date(($filter('date')($scope.dayBook.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var beData = {
            dateFrom: dateFrom,
            dateTo: dateTo 
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Service/Reporting/GetFourthCallLog",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            var DataColl = res.data.Data;

            var dt = {
                DispalyValue: "TOTAL =>",
                DrAmount: 0,
                CrAmount: 0
            };
           
            var filterDataColl = [];
            filterDataColl.push(dt);

            $scope.gridOptionsBottom.api.setRowData(filterDataColl);

            $scope.gridOptions.api.setRowData(res.data.Data);


            $scope.loadingstatus = "stop";
            hidePleaseWait();

        }, function (errormessage) {

            $scope.loadingstatus = 'stop';

            alert('Unable to Store data. pls try again.' + errormessage.responseText);
        });

    };


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

                                                    var findV = mx($scope.VoucherTypeList).firstOrDefault(p1 => p1.id == $scope.dayBook.VoucherId);

                                                    var rptPara = {
                                                        rpttranid: rptTranId,
                                                        istransaction: false,
                                                        entityid: EntityId,
                                                        voucherid: 0,
                                                        tranid: 0,
                                                        vouchertype: 0,
                                                        sessionid: res.data.Data.ResponseId,
                                                        Period: $scope.dayBook.DateFromDet.dateBS + " TO " + $scope.dayBook.DateToDet.dateBS,
                                                        Voucher: findV ? findV.text : ''
                                                    };
                                                    var paraQuery = param(rptPara);

                                                    document.body.style.cursor = 'wait';
                                                    document.getElementById("frmRpt").src = '';
                                                    document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + paraQuery;
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

                                var findV = mx($scope.VoucherTypeList).firstOrDefault(p1 => p1.id == $scope.dayBook.VoucherId);

                                var rptPara = {
                                    rpttranid: rptTranId,
                                    istransaction: false,
                                    entityid: EntityId,
                                    voucherid: 0,
                                    tranid: 0,
                                    vouchertype: 0,
                                    sessionid: res.data.Data.ResponseId,
                                    Period: $scope.dayBook.DateFromDet.dateBS + " TO " + $scope.dayBook.DateToDet.dateBS,
                                    Voucher: findV ? findV.text : ''
                                };
                                var paraQuery = param(rptPara);

                                document.body.style.cursor = 'wait';
                                document.getElementById("frmRpt").src = '';
                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + paraQuery;
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

        var RptParamentersColl = [];

        RptParamentersColl.push({
            Name: "Period",
            Value: $('#dtDateFrom').val() + ' To ' + $('#dtDateTo').val()
        });


        var filterData = [];

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var dayBook = node.data;
            filterData.push(dayBook);
        });

        return filterData;

    };

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

  
});

app.controller("fifthCallLogCntrl", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: '5thcalllog.csv',
            sheetName: '5th Call Log'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {


        $scope.comDet = {};
        GlobalServices.getCompanyDet().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.comDet = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.dayBook = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0,
            For: 1,
            IsCancel: false
        };

        $scope.searchData = {
            UserColl: '',
            DayBook: ''
        };

        $scope.loadingstatus = "stop";

        var columnDefs = [
            { headerName: "S.No.", width: 120, field: "SNo", filter: true, pinned: 'left' },
            {
                headerName: "Date", width: 130, field: "CallDate", cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                pinned: 'left'
            },
            {
                headerName: "Job Date", width: 130, field: "JobCardDate", cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                pinned: 'left'
            },
            { headerName: "Job No.", width: 120, field: "JobCardNo", filter: true, pinned: 'left' },
            { headerName: "Vin No.", width: 120, field: "VinNo", filter: true },
            { headerName: "Engine No.", width: 140, field: "EngineNo", filter: true },
            { headerName: "ChSrl No.", width: 140, field: "ChSrlNo", filter: true },
            { headerName: "Regd No.", width: 150, field: "RegdNo", filter: true },
            { headerName: "Service Advisor", width: 150, field: "ServiceAdvisor", filter: true },
            { headerName: "Mechanic", width: 150, field: "Mechanic", filter: true },
            { headerName: "Running HR", width: 140, field: "RunningHR", filter: true },
            { headerName: "Running KM", width: 120, field: "RunningKM", filter: true },
            { headerName: "Model", width: 120, field: "Model", filter: true },
            { headerName: "Branch", width: 120, field: "BranchName", filter: true },
            { headerName: "ClosedDateTime", width: 120, field: "ClosedDateTime", filter: true },
            { headerName: "Close Remarks", width: 140, field: "CloseRemarks", filter: true },
            { headerName: "Job To Be Attended", width: 180, field: "JobToBeAttended", filter: true },
            { headerName: "Job Complain", width: 180, field: "JobCardComplain", filter: true },
            { headerName: "Remarks", width: 120, field: "Remarks", filter: true },
            { headerName: "Party Name", width: 120, field: "PartyName", filter: true },
            { headerName: "Address", width: 120, field: "PartyAddress", filter: true },
            { headerName: "Mobile No", width: 120, field: "ContactNo", filter: true },
            { headerName: "JobCard For", width: 120, field: "JobCardFor", filter: true },
            { headerName: "Service Type", width: 120, field: "ServiceType", filter: true },
            { headerName: "JobCardType", width: 120, field: "JobCardType", filter: true },

            { headerName: "Date Of Sale", width: 140, field: "DateOfSale", filter: true },
            { headerName: "CallFailedReason", width: 120, field: "CallFailedReason", filter: true },
            { headerName: "CallFailedComment", width: 120, field: "CallFailedComment", filter: true },
            { headerName: "How would you rate the quality of Dealer Service Experience?", width: 150, field: "ServiceQualityRate", filter: true },
            { headerName: "Comments", width: 150, field: "ServiceComment", filter: true },
            { headerName: "How likely are you to recommend this product?", width: 150, field: "RecommendRate", filter: true },
            { headerName: "Comments", width: 120, field: "RecommendComment", filter: true },
             
            { headerName: "Do you have any open Complaints?", width: 120, field: "AnyComplain", filter: true },
            { headerName: "1st Service Done ?", width: 120, field: "Service1", filter: true },
            { headerName: "Running HMR", width: 120, field: "RunningHMR", filter: true },
            { headerName: "Comments", width: 120, field: "RunningComment", filter: true },

            { headerName: "Complaint Type", width: 120, field: "Complain", filter: true },
            { headerName: "Complain Comment", width: 120, field: "ComplainComment", filter: true },
            { headerName: "CallBy", width: 120, field: "CallBy", filter: true },

        ];


        $scope.gridOptions = {
            // a default column definition with properties that get applied to every column
            angularCompileRows: true,
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,

                // set every column width
                width: 90
            },
            columnDefs: columnDefs,
            enableColResize: true,
            rowData: null,
            filter: true,
            enableFilter: true,
            rowSelection: 'multiple',
            suppressHorizontalScroll: true,
            alignedGrids: [],
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
            columnDefs: columnDefs,
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


    }


    $scope.GetDayBook = function () {

        $scope.UserWiseColl = [];
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.dayBook.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.dayBook.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.dayBook.DateToDet)
            dateTo = new Date(($filter('date')($scope.dayBook.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var beData = {
            dateFrom: dateFrom,
            dateTo: dateTo
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Service/Reporting/GetFifthCallLog",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            var DataColl = res.data.Data;

            var dt = {
                DispalyValue: "TOTAL =>",
                DrAmount: 0,
                CrAmount: 0
            };

            var filterDataColl = [];
            filterDataColl.push(dt);

            $scope.gridOptionsBottom.api.setRowData(filterDataColl);

            $scope.gridOptions.api.setRowData(res.data.Data);


            $scope.loadingstatus = "stop";
            hidePleaseWait();

        }, function (errormessage) {

            $scope.loadingstatus = 'stop';

            alert('Unable to Store data. pls try again.' + errormessage.responseText);
        });

    };


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

                                                    var findV = mx($scope.VoucherTypeList).firstOrDefault(p1 => p1.id == $scope.dayBook.VoucherId);

                                                    var rptPara = {
                                                        rpttranid: rptTranId,
                                                        istransaction: false,
                                                        entityid: EntityId,
                                                        voucherid: 0,
                                                        tranid: 0,
                                                        vouchertype: 0,
                                                        sessionid: res.data.Data.ResponseId,
                                                        Period: $scope.dayBook.DateFromDet.dateBS + " TO " + $scope.dayBook.DateToDet.dateBS,
                                                        Voucher: findV ? findV.text : ''
                                                    };
                                                    var paraQuery = param(rptPara);

                                                    document.body.style.cursor = 'wait';
                                                    document.getElementById("frmRpt").src = '';
                                                    document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + paraQuery;
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

                                var findV = mx($scope.VoucherTypeList).firstOrDefault(p1 => p1.id == $scope.dayBook.VoucherId);

                                var rptPara = {
                                    rpttranid: rptTranId,
                                    istransaction: false,
                                    entityid: EntityId,
                                    voucherid: 0,
                                    tranid: 0,
                                    vouchertype: 0,
                                    sessionid: res.data.Data.ResponseId,
                                    Period: $scope.dayBook.DateFromDet.dateBS + " TO " + $scope.dayBook.DateToDet.dateBS,
                                    Voucher: findV ? findV.text : ''
                                };
                                var paraQuery = param(rptPara);

                                document.body.style.cursor = 'wait';
                                document.getElementById("frmRpt").src = '';
                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + paraQuery;
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

        var RptParamentersColl = [];

        RptParamentersColl.push({
            Name: "Period",
            Value: $('#dtDateFrom').val() + ' To ' + $('#dtDateTo').val()
        });


        var filterData = [];

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var dayBook = node.data;
            filterData.push(dayBook);
        });

        return filterData;

    };

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }


});

app.controller("sixthCallLogCntrl", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: '6thcalllog.csv',
            sheetName: '6th Call Log'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {


        $scope.comDet = {};
        GlobalServices.getCompanyDet().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.comDet = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.dayBook = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0,
            For: 1,
            IsCancel: false
        };

        $scope.searchData = {
            UserColl: '',
            DayBook: ''
        };

        $scope.loadingstatus = "stop";

        var columnDefs = [
            { headerName: "S.No.", width: 120, field: "SNo", filter: true, pinned: 'left' },
            {
                headerName: "Date", width: 130, field: "CallDate", cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                pinned: 'left'
            },
            {
                headerName: "Job Date", width: 130, field: "JobCardDate", cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                pinned: 'left'
            },
            { headerName: "Job No.", width: 100, field: "JobCardNo", filter: true, pinned: 'left' },
            { headerName: "CallingType", width: 120, field: "CallingType", filter: true, pinned: 'left' },

            { headerName: "Vin No.", width: 120, field: "VinNo", filter: true },
            { headerName: "Engine No.", width: 140, field: "EngineNo", filter: true },
            { headerName: "ChSrl No.", width: 140, field: "ChSrlNo", filter: true },
            { headerName: "Regd No.", width: 150, field: "RegdNo", filter: true },
            { headerName: "Service Advisor", width: 150, field: "ServiceAdvisor", filter: true },
            { headerName: "Mechanic", width: 150, field: "Mechanic", filter: true },
            { headerName: "Running HR", width: 140, field: "RunningHR", filter: true },
            { headerName: "Running KM", width: 120, field: "RunningKM", filter: true },
            { headerName: "Model", width: 120, field: "Model", filter: true },
            { headerName: "Branch", width: 120, field: "BranchName", filter: true },
            { headerName: "ClosedDateTime", width: 120, field: "ClosedDateTime", filter: true },
            { headerName: "Close Remarks", width: 140, field: "CloseRemarks", filter: true },
            { headerName: "Job To Be Attended", width: 180, field: "JobToBeAttended", filter: true },
            { headerName: "Job Complain", width: 180, field: "JobCardComplain", filter: true },
            { headerName: "Remarks", width: 120, field: "Remarks", filter: true },
            { headerName: "Party Name", width: 120, field: "PartyName", filter: true },
            { headerName: "Address", width: 120, field: "PartyAddress", filter: true },
            { headerName: "Mobile No", width: 120, field: "ContactNo", filter: true },
            { headerName: "JobCard For", width: 120, field: "JobCardFor", filter: true },
            { headerName: "Service Type", width: 120, field: "ServiceType", filter: true },
            { headerName: "JobCardType", width: 120, field: "JobCardType", filter: true },

            { headerName: "Date Of Sale", width: 140, field: "DateOfSale", filter: true },
            { headerName: "CallFailedReason", width: 120, field: "CallFailedReason", filter: true },
            { headerName: "CallFailedComment", width: 120, field: "CallFailedComment", filter: true },

            { headerName: "How would you rate the quality of Dealer Service Experience?", width: 120, field: "ServiceQualityRate", filter: true },
            { headerName: "Comment", width: 120, field: "ServiceComment", filter: true },
            { headerName: "How likely are you to recommend this product?", width: 120, field: "RecommendRate", filter: true },
            { headerName: "Comment", width: 120, field: "RecommendComment", filter: true },

            { headerName: "Are you still using your John Deere tractor?", width: 120, field: "AreYouUsing", filter: true },
            { headerName: "Reason for Not Using", width: 120, field: "NotUsedReason", filter: true },
            { headerName: "Comment", width: 120, field: "NotUsedComment", filter: true },
            { headerName: "ServiceFrom", width: 120, field: "ServiceFrom", filter: true },
            { headerName: "SparePartFrom", width: 120, field: "SparePartFrom", filter: true },
            { headerName: "Why are you not preferring JD  dealerships/service center?", width: 120, field: "WhyNotJDService", filter: true },
            { headerName: "Do you have any open Complaints?", width: 120, field: "AnyComplain", filter: true },
            { headerName: "Complaint Type", width: 120, field: "Complain", filter: true },
            { headerName: "Complain Comment", width: 120, field: "ComplainComment", filter: true },
            { headerName: "CallBy", width: 120, field: "CallBy", filter: true },
            { headerName: "ServiceType", width: 120, field: "ServiceType", filter: true },
            { headerName: "JobCardFor", width: 120, field: "JobCardFor", filter: true },
            { headerName: "JobCardType", width: 120, field: "JobCardType", filter: true },
            { headerName: "Are you interested in buying new tractor ?", width: 120, field: "AreYouInterested", filter: true },
            { headerName: "Model", width: 120, field: "VehicleMode", filter: true },
            { headerName: "User Comment", width: 120, field: "UserComment", filter: true },
            { headerName: "Relative Name", width: 120, field: "RelativeName", filter: true },
            { headerName: "Contact No", width: 120, field: "EnqContactNo", filter: true },                          
            { headerName: "Village", width: 120, field: "Village", filter: true },
            { headerName: "Relation", width: 120, field: "Relation", filter: true },      


        ];


        $scope.gridOptions = {
            // a default column definition with properties that get applied to every column
            angularCompileRows: true,
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,

                // set every column width
                width: 90
            },
            columnDefs: columnDefs,
            enableColResize: true,
            rowData: null,
            filter: true,
            enableFilter: true,
            rowSelection: 'multiple',
            suppressHorizontalScroll: true,
            alignedGrids: [],
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
            columnDefs: columnDefs,
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


    }


    $scope.GetDayBook = function () {

        $scope.UserWiseColl = [];
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.dayBook.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.dayBook.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.dayBook.DateToDet)
            dateTo = new Date(($filter('date')($scope.dayBook.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var beData = {
            dateFrom: dateFrom,
            dateTo: dateTo
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Service/Reporting/GetSixthCallLog",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            var DataColl = res.data.Data;

            var dt = {
                DispalyValue: "TOTAL =>",
                DrAmount: 0,
                CrAmount: 0
            };

            var filterDataColl = [];
            filterDataColl.push(dt);

            $scope.gridOptionsBottom.api.setRowData(filterDataColl);

            $scope.gridOptions.api.setRowData(res.data.Data);


            $scope.loadingstatus = "stop";
            hidePleaseWait();

        }, function (errormessage) {

            $scope.loadingstatus = 'stop';

            alert('Unable to Store data. pls try again.' + errormessage.responseText);
        });

    };


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

                                                    var findV = mx($scope.VoucherTypeList).firstOrDefault(p1 => p1.id == $scope.dayBook.VoucherId);

                                                    var rptPara = {
                                                        rpttranid: rptTranId,
                                                        istransaction: false,
                                                        entityid: EntityId,
                                                        voucherid: 0,
                                                        tranid: 0,
                                                        vouchertype: 0,
                                                        sessionid: res.data.Data.ResponseId,
                                                        Period: $scope.dayBook.DateFromDet.dateBS + " TO " + $scope.dayBook.DateToDet.dateBS,
                                                        Voucher: findV ? findV.text : ''
                                                    };
                                                    var paraQuery = param(rptPara);

                                                    document.body.style.cursor = 'wait';
                                                    document.getElementById("frmRpt").src = '';
                                                    document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + paraQuery;
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

                                var findV = mx($scope.VoucherTypeList).firstOrDefault(p1 => p1.id == $scope.dayBook.VoucherId);

                                var rptPara = {
                                    rpttranid: rptTranId,
                                    istransaction: false,
                                    entityid: EntityId,
                                    voucherid: 0,
                                    tranid: 0,
                                    vouchertype: 0,
                                    sessionid: res.data.Data.ResponseId,
                                    Period: $scope.dayBook.DateFromDet.dateBS + " TO " + $scope.dayBook.DateToDet.dateBS,
                                    Voucher: findV ? findV.text : ''
                                };
                                var paraQuery = param(rptPara);

                                document.body.style.cursor = 'wait';
                                document.getElementById("frmRpt").src = '';
                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + paraQuery;
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

        var RptParamentersColl = [];

        RptParamentersColl.push({
            Name: "Period",
            Value: $('#dtDateFrom').val() + ' To ' + $('#dtDateTo').val()
        });


        var filterData = [];

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var dayBook = node.data;
            filterData.push(dayBook);
        });

        return filterData;

    };

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }


     

});