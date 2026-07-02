"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("ssfClaimLstController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'ssfClaimList.csv',
            sheetName: 'SSFClaim List'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.DocumentTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Global/GetDocumentTypes",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DocumentTypeList = res.data.Data
            } else {
                alert(res.data.ResponseMSG);
            }
        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.ProductGroupSummary = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            LedgerGroupId: 0,
            IsClearOnly: true,
            BranchId: 0
        };


        $timeout(function () {
            GlobalServices.getCompanyDet().then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.ProductGroupSummary.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });

        $scope.OpeningAmt = 0;
        $scope.CurrentAmt = 0;
        $scope.TotalAmt = 0;
        $scope.ReportName = '';
        $scope.noofdecimal = 2;

        $scope.loadingstatus = "stop";

        //{
        //    headerName: ' Opening ',
        //        children: [
        //            { headerName: "Qty.", width: 180, field: "O_Qty", cellStyle: { 'text-align': 'right' } },
        //            { headerName: "Rate", width: 180, field: "O_Rate", cellStyle: { 'text-align': 'right' } },
        //            { headerName: "Amt.", width: 180, field: "O_Amt", cellStyle: { 'text-align': 'right' } },
        //        ]
        //}

        var columnDefs = [

            {
                headerName: "SSF Claim Id", width: 220, field: "ClaimId",
                cellRenderer:
                    function (params) {
                        return '<center><a   href="' + base_url + '/apilog/' + params.data.ClientClaimId + '.json" download target="_blank" rel="noopener"">' + params.data.ClaimId  + '</a ></center>';
                    }
            },
            
            { headerName: "Claim UId", width: 210, field: "ClaimUId", cellStyle: { 'text-align': 'left' } },
            { headerName: "ClaimId", width: 150, field: "ClientClaimId", cellStyle: { 'text-align': 'left' } },
            {
                headerName: "Re-Attachment", width: 180, cellRenderer:
                    function (params) {
                        return params.data.ClientClaimId +'<a class="btn btn-default btn-xs" ng-click="ReAttachmentDocument(this.data)"><i class="fas fa-file"></i></a>';
                    }
            },
            {
                headerName: "Re-AttachmentLog", width: 120, field: "ClientClaimId",  cellRenderer:
                function(params) {
                    return '<center><a   href="' + base_url + '/apilog/' + params.data.ClientClaimId + '_Success_ReAttachment.json" download target="_blank" rel="noopener"">Success</a >' + '  <a href="' + base_url + '/apilog/' + params.data.ClientClaimId + '_Error_ReAttachment.json" download target="_blank" rel="noopener"">Failed</a ></center>';
                }
            },             
            { headerName: "SSF Code",   colId: 'det1', width: 120, field: "SSFCode", cellStyle: { 'text-align': 'left' } },
            { headerName: "Patient Id",  colId: 'det2', width: 140, field: "PatientNo", cellStyle: { 'text-align': 'left' } },
            { headerName: "Name", width: 180, field: "Name", cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", colId: 'det3', width: 210, field: "Address", cellStyle: { 'text-align': 'left' } },
            { headerName: "Age",  colId: 'det4', width: 140, field: "Age", cellStyle: { 'text-align': 'left' } },
            { headerName: "District", width: 140, colId: 'det5', field: "District", cellStyle: { 'text-align': 'left' } },
            { headerName: "Booking Amount", width: 160, field: "BookingAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Claim Amount", width: 160, field: "ClaimAmount", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "MobileNo", width: 160, field: "MobileNo", cellStyle: { 'text-align': 'left' }, filter: "agTextColumnFilter",  },
            { headerName: "Guardian Name", width: 160, field: "GuardianName", cellStyle: { 'text-align': 'left' }, filter: "agTextColumnFilter",  },
            { headerName: "Relation", width: 120, field: "Relation", cellStyle: { 'text-align': 'left' }, filter: "agTextColumnFilter",  },
            { headerName: "OPD", width: 120, field: "OPDMiti", cellStyle: { 'text-align': 'center' }, filter: "agTextColumnFilter", },
            { headerName: "IPD", width: 120, field: "IPDMiti", cellStyle: { 'text-align': 'center' }, filter: "agTextColumnFilter",},
            { headerName: "Discharge", width: 120, field: "DischargeMiti", cellStyle: { 'text-align': 'center' }, filter: "agTextColumnFilter", },
            { headerName: "Doctor", width: 220, field: "Doctor", cellStyle: { 'text-align': 'left' }, filter: "agTextColumnFilter", },
            { headerName: "Claim Miti", width: 120, field: "ClaimMiti", cellStyle: { 'text-align': 'center' }, },
            { headerName: "LogDateTime", width: 140,   colId: 'det6', field: "LogDateTime", cellStyle: { 'text-align': 'center' }, filter: "agDateColumnFilter",  },

            {
                headerName: "Error JSON", width: 120, field: "ClientClaimId",cellRenderer:
                    function (params) {
                        return '<center><a   href="' + base_url + '/apilog/' + params.data.ClientClaimId + '_Error.json" download target="_blank" rel="noopener"">' + params.data.ClientClaimId + '</a ></center>';
                    }
            },
            {
                headerName: "Action",
                width: 50,
                cellRenderer: function (params) {
                    return '<div class="btn-group" style="position: fixed; ">' +
                        '<button type="button" class="btn btn-default px-1 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span class="caret"></span>' +
                        '</button>' +
                        '<ul class="dropdown-menu dropdown-menu-right p-2" style="position: absolute; left: 0;">' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Print" ng-click="PrintClaim(this.data)"><i class="fas fa-print text-info"></i> Print</a></li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Re-Attachment Status" ng-click="ReAttachmentStatus(this.data)"><i class="fas fa-download text-info"></i> Re-Attachment Status</a></li>' +
                        '</ul>' +
                        '</div>';
                },
                pinned: 'right'
            },
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
            columnDefs: columnDefs,
            rowData: null,
            filter: true,
            suppressHorizontalScroll: true,
            alignedGrids: [],
            enableFilter: true,

            onFilterChanged: function () {
                var dt = {
                    ClaimAmount: 0 
                };

                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.ClaimAmount += fData.ClaimAmount; 
                });

                var filerDataColl = [];
                filerDataColl.push(dt);
                $scope.gridOptionsBottom.api.setRowData(filerDataColl);
            }

        };
       

        $scope.dataForBottomGrid = [
            {
                SNo: '',
                Name: 'Total =>',
                BalanceAmt: 0,
                Rate: '',
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

    $scope.ReAttachmentUpload = function () {
        if ($scope.SelectedTran && $scope.SelectedTran.ClaimId) {
            $scope.loadingstatus = "running";
            showPleaseWait();

            $http({
                method: 'POST',
                url: base_url + "Inventory/Transaction/SaveReAttachmentDoc",
                headers: { 'Content-Type': undefined },

                transformRequest: function (data) {

                    var formData = new FormData();
                    formData.append("jsonData", angular.toJson(data.jsonData));
                     
                    angular.forEach($scope.SelectedTran.AttachmentList, function (Doc) {
                        if (Doc.File_TMP && Doc.File_TMP.length > 0) {
                            formData.append("file" + Doc.DocumentTypeId, Doc.File_TMP[0]);
                        }

                    });


                    return formData;
                },
                data: { jsonData: $scope.SelectedTran }
            }).then(function (res) {

                $scope.loadingstatus = "stop";
                hidePleaseWait();
                Swal.fire(res.data.ResponseMSG);

                if (res.data.IsSuccess == true) {
                    $scope.ClearFields();
                    $scope.SearchPatientId = '';
                }


            }, function (errormessage) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";

            });
        }
    }
    $scope.SelectedTran = {};
    $scope.ReAttachmentDocument = function (beData) {

        $scope.SelectedTran = beData;
        $scope.SelectedTran.AttachmentList = angular.copy($scope.DocumentTypeList);

        $('#modal-reattachment').modal('show');

    }
    $scope.ReClaim = function (tranId,claimId) {

        Swal.fire({
            title: 'Do you want to re-claim ssf of  the selected Patient(' + claimId + ')  ? ',
            showCancelButton: true,
            confirmButtonText: 'Re-Claim',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {                    
                    tranId: tranId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Transaction/SaveSSFReClaim",
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
    $scope.ShowDetails = function (val) {
        for (var i = 1; i < 36; i++) {
            var colName = 'det' + i.toString();
            $scope.gridOptions.columnApi.setColumnVisible(colName, val);
        }
    }
    $scope.ClearData = function () {

        $scope.dataForBottomGrid[0].ClaimAmount = 0; 

        $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

        $scope.DataColl = [];
        $scope.gridOptions.api.setRowData($scope.DataColl);
    };

    $scope.GetProductGroupSummary = function () {

        $scope.ClearData();
         
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.ProductGroupSummary.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.ProductGroupSummary.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.ProductGroupSummary.DateToDet)
            dateTo = new Date(($filter('date')($scope.ProductGroupSummary.DateToDet.dateAD, 'yyyy-MM-dd')));

        var beData = {
            dateFrom: dateFrom,
            dateTo: dateTo          
        };

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetSSFClaimLst",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = mx(res.data.Data);

                $scope.dataForBottomGrid[0].ClaimAmount = DataColl.sum(p1 => p1.ClaimAmount);

                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
                $scope.gridOptions.api.setRowData(res.data.Data);
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed' + reason);
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

                                                    var rptPara = {
                                                        rpttranid: rptTranId,
                                                        istransaction: false,
                                                        entityid: EntityId,
                                                        voucherid: 0,
                                                        tranid: 0,
                                                        vouchertype: 0,
                                                        sessionid: res.data.Data.ResponseId,
                                                        Period: $scope.ProductGroupSummary.DateFromDet.dateBS + " TO " + $scope.ProductGroupSummary.DateToDet.dateBS,
                                                        ProductGroup: '',
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

                                var rptPara = {
                                    rpttranid: rptTranId,
                                    istransaction: false,
                                    entityid: EntityId,
                                    voucherid: 0,
                                    tranid: 0,
                                    vouchertype: 0,
                                    sessionid: res.data.Data.ResponseId,
                                    Period: $scope.ProductGroupSummary.DateFromDet.dateBS + " TO " + $scope.ProductGroupSummary.DateToDet.dateBS,
                                    ProductGroup: '',
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

    };

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
                down_file(base_url + "//" + res.data.Data.ResponseId, "ssfClaimList.xlsx");
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });
    }

    $scope.PrintClaim = function (curRow) {
         
        $timeout(function () {
            var para = {
                PatientId: curRow.PatientId,
                PatientNo: curRow.PatientNo,
                ClaimId: curRow.ClientClaimId,
            };
            $scope.loadingstatus = "running";
            showPleaseWait();

            $http({
                method: 'POST',
                url: base_url + "Inventory/Transaction/PrintSSFClaim",
                dataType: "json",
                data: JSON.stringify(para)
            }).then(function (res) {
                $scope.loadingstatus = "stop";
                hidePleaseWait();

                if (res.data.IsSuccess && res.data.Data) {
                    var printData = res.data.Data;
                    var newURL = base_url + printData.ResponseMSG;
                    window.open(newURL);
                } else {
                    alert(res.data.ResponseMSG);
                }
            }, function (reason) {
                alert('Failed' + reason);
            });
        });

    }

    $scope.ReAttachRB = function () {

        Swal.fire({
            title: 'Do you want to re-attach running bill the current data?',
            showCancelButton: true,
            confirmButtonText: "Yes",
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var filterData = [];

                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var dayBook = node.data;
                    filterData.push(dayBook);
                });
                 
                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Transaction/SaveReAttachmentRB",
                    headers: { 'Content-Type': undefined },

                    transformRequest: function (data) {

                        var formData = new FormData();
                        formData.append("jsonData", angular.toJson(data.jsonData));

                        return formData;
                    },
                    data: { jsonData: filterData }
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

    $scope.CurStatusDataColl = [];
    $scope.ReAttachmentStatus = function (curRow) {
        $scope.SelectedTran = curRow;
        $scope.CurStatusDataColl = [];
        Swal.fire({
            title: 'Do you want to check  re-attach status ?',
            showCancelButton: true,
            confirmButtonText: "Yes",
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Transaction/GetAttachmentStatus",
                    headers: { 'Content-Type': undefined },

                    transformRequest: function (data) {

                        var formData = new FormData();
                        formData.append("jsonData", angular.toJson(data.jsonData));

                        return formData;
                    },
                    data: { jsonData: curRow }
                }).then(function (res) {

                    $scope.loadingstatus = "stop";
                    hidePleaseWait();
                    if (res.data.IsSuccess == true) {
                        var jsonData = JSON.parse(res.data.ResponseMSG);
                        if (jsonData.response) {
                            $scope.CurStatusDataColl = jsonData.response.data;
                            $('#status-reattachment').modal('show');
                        }

                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }
                    

                }, function (errormessage) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";

                });
            }
        });

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
