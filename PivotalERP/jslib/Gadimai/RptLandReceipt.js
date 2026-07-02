"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("LandReceiptController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    getterAndSetter();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'Receipt.csv',
            sheetName: 'Receipt'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
 
    function getterAndSetter() {

        $scope.columnDefs = [            
            {
                headerName: "Date", field: "AllotmentDateTime",   width: 150, dataType: 'Text', filter: "agTextColumnFilter", pinned: 'left',
            },
            {
                headerName: "Miti", field: "AllotmentMiti", width: 150, dataType: 'Text', filter: "agTextColumnFilter", pinned: 'left',
            },
            { headerName: "Receipt No.", field: "ReceiptNo", width: 130, dataType: 'Number', filter: "agNumberColumnFilter", cellStyle: { 'text-align': 'center' }, },
            { headerName: "Amount", field: "TotalAmount", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            {
                headerName: "Applicant Type", field: "ApplicantType", width: 160, dataType: 'Text', filter: "agTextColumnFilter",  
            },
            {
                headerName: "Land Type", field: "LandTypeName", width: 150, dataType: 'Text', filter: "agTextColumnFilter",
            },
            {
                headerName: "Land Name", field: "LandName", width: 150, dataType: 'Text', filter: "agTextColumnFilter",
            },
            {
                headerName: "Reg.No.", field: "RegdNo", width: 160, dataType: 'Text', filter: "agTextColumnFilter",
            },
            {
                headerName: "Name", field: "BillingName", width: 180, dataType: 'Text', filter: "agTextColumnFilter",
            },
            {
                headerName: "Address", field: "BillingAddress", width: 220, dataType: 'Text', filter: "agTextColumnFilter",
            },

            {
                headerName: "Land Rate", field: "Rate", width: 120, dataType: 'Text', filter: "agNumberColumnFilter",
            },
            {
                headerName: "Tent Rate", field: "TentRate", width: 120, dataType: 'Text', filter: "agNumberColumnFilter",
            },
            {
                headerName: "Water Rate", field: "WaterRate", width: 120, dataType: 'Text', filter: "agNumberColumnFilter",
            },
            {
                headerName: "Electricity Rate", field: "ElectricityRate", width: 120, dataType: 'Text', filter: "agNumberColumnFilter",
            },
            {
                headerName: "Others Rate", field: "OthersRate", width: 120, dataType: 'Text', filter: "agNumberColumnFilter",
            },
            {
                headerName: "Other Heading", field: "OtherHeading", width: 130, dataType: 'Text', filter: "agNumberColumnFilter",
            },
            {
                headerName: "Land Area", field: "LandArea", width: 130, dataType: 'Text', filter: "agNumberColumnFilter",
            },
            {
                headerName: "Mobile No", field: "MobileNo", width: 160, dataType: 'Text', filter: "agTextColumnFilter",
            },

            {
                headerName: "Land Name", field: "LandName", width: 150, filter: "agTextColumnFilter", hide: true, colId: 'colGroup',
            },
            {
                headerName: "User", field: "UserName", width: 150, filter: "agTextColumnFilter", hide: true, colId: 'colGroup',
            },
            //{
            //    headerName: "Action",
            //    width: 50,
            //    cellRenderer: function (params) {
            //        return '<div class="btn-group" style="position: fixed; ">' +
            //            '<button type="button" class="btn btn-default px-1 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
            //            '<span class="caret"></span>' +
            //            '</button>' +
            //            '<ul class="dropdown-menu dropdown-menu-right p-2" style="position: absolute; left: 0;">' +
            //            '<li><a data-toggle="tooltip" data-placement="top" title="Print" ng-click="PrintVoucher(this)"><i class="fas fa-print text-info"></i> Print</a></li>' +                        
            //            '</ul>' +
            //            '</div>';
            //    },
            //    pinned: 'right'
            //},

        ];

        // let the grid know which columns and what data to use
        $scope.gridOptions = {
            angularCompileRows: true,
            columnDefs: $scope.columnDefs,
            
            defaultColDef: {
                resizable: true,
                sortable: true,
                filter: true,
                resizable: true,
                cellStyle: { 'line-height': '31px' },
                rowSelection: 'multiple'
            },
            enableColResize: true,
            rowData: null,
            filter: true,
            enableFilter: true,
            rowSelection: 'multiple',
            enableCellTextSelection: true,
            suppressHorizontalScroll: true,
            alignedGrids: [],      
            onFilterChanged: function () {

                var Amount = 0, LandArea = 0, TotalAmount = 0, TentRate = 0, WaterRate = 0, ElectricityRate = 0,OthersRate=0,LandRate=0;
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {                    
                    Amount += node.data.Amount;
                    TotalAmount += node.data.TotalAmount;
                    LandArea += node.data.LandArea;
                    TentRate += isEmptyAmt(node.data.TentRate);
                    WaterRate += isEmptyAmt(node.data.WaterRate);
                    ElectricityRate += isEmptyAmt(node.data.ElectricityRate);
                    OthersRate += isEmptyAmt(node.data.OthersRate);
                    LandRate += isEmptyAmt(node.data.Rate);
                });
                 
                
                $scope.dataForBottomGrid[0].Amount = Amount;
                $scope.dataForBottomGrid[0].TotalAmount = TotalAmount;
                $scope.dataForBottomGrid[0].LandArea = LandArea;
                $scope.dataForBottomGrid[0].TentRate = TentRate;
                $scope.dataForBottomGrid[0].WaterRate = WaterRate;
                $scope.dataForBottomGrid[0].ElectricityRate = ElectricityRate;
                $scope.dataForBottomGrid[0].OthersRate = OthersRate;
                $scope.dataForBottomGrid[0].Rate = LandRate;
                

                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
            }
     
        };


        $scope.dataForBottomGrid = [
            {
                AllotmentMiti: 'Total =>',
                Amount: 0,
                LandArea: 0
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

    }
  
    function LoadData() {

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
      
        $scope.Groupwise = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            LedgerGroupId: 1,
            BranchId: 0,
            ShowZeroBalance: false,
            ShowDetails: false,
            ShowCostCenter:false,
            ReportType: 1,
            ShowAsList: false,
            BrandId:null,
        };

        $timeout(function () {
            $http({
                method: "GET",
                url: base_url + "Global/GetCompanyDetail",
                dataType: "json"
            }).then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.Groupwise.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });
       
       
        $scope.loadingstatus = "stop";
        
    }
   
    $scope.GetGroupwise = function () {
      
        $scope.gridOptions.data = [];
        
        var para = {
            dateFrom: $scope.Groupwise.DateFromDet ? $filter('date')($scope.Groupwise.DateFromDet.dateAD, 'yyyy-MM-dd')  : null,
            dateTo: $scope.Groupwise.DateToDet ? $filter('date')($scope.Groupwise.DateToDet.dateAD, 'yyyy-MM-dd') : null,         
        };
         

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "POST",
            url: base_url + "Gadhimai/Creation/GetLandReceipt",
            dataType: "json",
            data:JSON.stringify(para),
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                  
                var Amount = 0, LandArea = 0, TotalAmount = 0, TentRate = 0, WaterRate = 0, ElectricityRate = 0, OthersRate = 0,LandRate=0;
                angular.forEach(res.data.Data, function (dc) {
                    Amount += dc.Amount;
                    LandArea += dc.LandArea;

                    TotalAmount += dc.TotalAmount;
                    TentRate += dc.TentRate;
                    WaterRate += dc.WaterRate;
                    ElectricityRate += dc.ElectricityRate;
                    OthersRate += dc.OthersRate;
                    LandRate += dc.Rate;
                    
                });
                
                $scope.dataForBottomGrid[0].Amount = Amount;
                $scope.dataForBottomGrid[0].LandArea = LandArea;

                $scope.dataForBottomGrid[0].TotalAmount = TotalAmount;
                $scope.dataForBottomGrid[0].TentRate = TentRate;
                $scope.dataForBottomGrid[0].WaterRate = WaterRate;
                $scope.dataForBottomGrid[0].ElectricityRate = ElectricityRate;
                $scope.dataForBottomGrid[0].OthersRate = OthersRate;
                $scope.dataForBottomGrid[0].Rate = LandRate;


                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

                $scope.gridOptions.api.setRowData(res.data.Data);
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            alert('Unable to Get data. pls try again.' + errormessage.responseText);
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
                    var selectedRpt = null;
                    if (templatesColl.length == 1) {
                        selectedRpt = templatesColl[0];
                        rptTranId = templatesColl[0].RptTranId;
                    }                        
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
                                        selectedRpt = templatesColl[value];

                                        if (rptTranId > 0)
                                        {
                                            var dataColl = $scope.GetDataForPrint();
                                            print = true;

                                            if (selectedRpt.Rpt_Type == 3) {
                                                var paraData = {
                                                    Period: $scope.Groupwise.DateFromDet.dateBS + " TO " + $scope.Groupwise.DateToDet.dateBS,
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
                                                        formData.append("RptPath", selectedRpt.Path);
                                                        return formData;
                                                    },
                                                    data: { jsonData: dataColl }
                                                }).then(function (res) {

                                                    $scope.loadingstatus = "stop";
                                                    hidePleaseWait();
                                                    if (res.data.IsSuccess && res.data.Data) {
                                                        down_file(base_url + "//" + res.data.Data.ResponseId, "TrailBalance.xlsx");
                                                    }

                                                }, function (errormessage) {
                                                    hidePleaseWait();
                                                    $scope.loadingstatus = "stop";
                                                    Swal.fire(errormessage);
                                                });

                                            }
                                            else {
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

                                                        var rptPara = {
                                                            rpttranid: rptTranId,
                                                            istransaction: false,
                                                            entityid: EntityId,
                                                            voucherid: 0,
                                                            tranid: 0,
                                                            vouchertype: 0,
                                                            sessionid: res.data.Data.ResponseId,
                                                            Period: $scope.Groupwise.DateFromDet.dateBS + " TO " + $scope.Groupwise.DateToDet.dateBS,
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

                                var rptPara = {
                                    rpttranid: rptTranId,
                                    istransaction: false,
                                    entityid: EntityId,
                                    voucherid: 0,
                                    tranid: 0,
                                    vouchertype: 0,
                                    sessionid: res.data.Data.ResponseId,
                                    Period: $scope.Groupwise.DateFromDet.dateBS + " TO " + $scope.Groupwise.DateToDet.dateBS                                    
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

        var filterData = [];

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var dayBook = node.data;
            filterData.push(dayBook);
        });

        return filterData;
    }

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    $scope.DownloadAsXls = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var dataColl = $scope.GetDataForPrint();

        var paraData = {
            Period: $scope.Groupwise.DateFromDet.dateBS + " TO " + $scope.Groupwise.DateToDet.dateBS,            
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "Receipt.xlsx");
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });
    }

    $scope.PrintVoucher = function (rowData) {

        var tranId = rowData.TranId;

        if (tranId && tranId > 0) {

            $http({
                method: 'GET',
                url: base_url + "ReportEngine/GetReportTemplates?entityId=" + EntityId + "&voucherId=0&isTran=true",
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
                                                var newURL = base_url + "newpdfviewer.ashx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=0&tranid=" + tranId + "&vouchertype=0";
                                                window.open(newURL);
                                            }

                                        } else {
                                            resolve('You need to select:)')
                                        }
                                    })
                                }
                            })
                        }

                        if (rptTranId > 0 && printed == false) {
                            var newURL = base_url + "newpdfviewer.ashx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=0&tranid=" + tranId + "&vouchertype=0";
                            window.open(newURL);
                        }

                    } else
                        Swal.fire('No Templates found for print');
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }
    };

});
