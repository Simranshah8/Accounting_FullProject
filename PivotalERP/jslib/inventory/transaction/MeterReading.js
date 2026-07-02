
"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("NatureController", function ($scope, $http, $filter, GlobalServices, $document, $timeout) {
    $scope.Title = 'Nature';
    OnClickDefault();


    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.perPage = {
            Nozzle: GlobalServices.getPerPageRow(),
            Pump: GlobalServices.getPerPageRow(),
            MeterReading: GlobalServices.getPerPageRow(),
        };

        $scope.currentPages = {
            Nozzle: 1,
            Pump: 1,
            MeterReading: 1

        };

        $scope.searchData = {
            Nozzle: '',
            Pump: '',
            MeterReading: ''
        };

        $scope.newNozzle =
        {
            NozzleId: null,
            Name: '',
            Description: '',
            Mode: 'Save'
        };

        $scope.newPump =
        {
            PumpId: null,
            Name: '',
            Description: '',
            PumpNozzleDetColl: [],
            Mode: 'Save'
        };
        $scope.newPump.PumpNozzleDetColl.push({});

        $scope.newMeterReading =
        {
            TranId: null,
            ForDate: null,
            ForDate_TMP:new Date(),
            PumpId: null,
            NozzleId: null,
            LastReading: 0,
            CurrentReading: 0,
            Sales: 0,
            Mode: 'Save'
        };

        $scope.ProductColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetProductListForPetrolPump",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductColl = res.data.Data;
            }
        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.GetAllNozzle();
        $scope.GetAllPump();
         
        $scope.columnDefs = [
            { headerName: "S.No.", field: "SNo", dataType: 'Number', filter: 'agNumberColumnFilter', width: 100, pinned: 'left', cellStyle: { 'text-align': 'center' } },
            { headerName: "Pump", field: "Pump", dataType: 'Text', filter: "agTextColumnFilter", width: 150, cellStyle: { 'text-align': 'left' } },
            { headerName: "Nozzle", field: "Nozzle", dataType: 'Text', filter: "agTextColumnFilter", width: 120, cellStyle: { 'text-align': 'left' } },
            { headerName: "Product", field: "Product", dataType: 'Text', filter: "agTextColumnFilter", width: 150, cellStyle: { 'text-align': 'left' } },

            { headerName: "Date", field: "ForDate", dataType: 'Text', filter: "agTextColumnFilter", width: 130, cellStyle: { 'text-align': 'left' } },
            { headerName: "Miti", field: "ForMiti", dataType: 'Text', filter: "agTextColumnFilter", width: 130, cellStyle: { 'text-align': 'left' } },
            

            { headerName: "Opening", field: "Opening", width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "Current", field: "Current", width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "Sales", field: "Sales", width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "Tran Sales", field: "TranSales", width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "Closing", field: "Closing", width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "TranType", field: "TranType", dataType: 'Text', filter: "agTextColumnFilter", width: 120, cellStyle: { 'text-align': 'left' } },
            { headerName: "User", field: "User", dataType: 'Text', filter: "agTextColumnFilter", width: 120, cellStyle: { 'text-align': 'left' } },
            { headerName: "LogDateTime", field: "LogDateTime", dataType: 'Text', filter: "agTextColumnFilter", width: 130, cellStyle: { 'text-align': 'left' } },
            
        ];
         

        $scope.newRpt = {
            DateFrom_TMP: new Date(),
            DateTo_TMP:new Date(),
        };

        $scope.gridOptions = {

            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                width: 100,

            },
            enableSorting: true,
            multiSortKey: 'ctrl',
            enableColResize: true,
            overlayLoadingTemplate: "Loading..",
            overlayNoRowsTemplate: "No Records found",
            rowSelection: 'multiple',
            columnDefs: $scope.columnDefs,
            rowData: null,
            filter: true,
            enableFilter: true

        };

        // lookup the container we want the Grid to use
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);
        $scope.loadingstatus = "stop";
    };


    $scope.ClearNozzle = function () {
        $scope.newNozzle =
        {
            NozzleId: null,
            Name: '',
            Description: '',
            Mode: 'Save'
        };
    }

    $scope.ClearPump = function () {
        $scope.newPump =
        {
            PumpId: null,
            Name: '',
            Description: '',
            PumpNozzleDetColl: [],
            Mode: 'Save'
        };
        $scope.newPump.PumpNozzleDetColl.push({});
    }

    $scope.ClearMeterReading = function () {
        $scope.newMeterReading =
        {
            TranId: null,
            ForDate: null,
            ForDate_TMP: new Date(),
            PumpId: null,
            NozzleId: null,
            LastReading: 0,
            CurrentReading: 0,
            Sales: 0,
            Mode: 'Save'
        };
    }

    $scope.AddPumpNozzleDetWise = function (ind) {
        if ($scope.newPump.PumpNozzleDetColl) {
            if ($scope.newPump.PumpNozzleDetColl.length > ind + 1) {
                $scope.newPump.PumpNozzleDetColl.splice(ind + 1, 0, {
                    NozzleId: null
                })
            } else {
                $scope.newPump.PumpNozzleDetColl.push({
                    NozzleId: null
                })
            }
        }
    };
    $scope.DelPumpNozzleDetWise = function (ind) {
        if ($scope.newPump.PumpNozzleDetColl) {
            if ($scope.newPump.PumpNozzleDetColl.length > 1) {
                $scope.newPump.PumpNozzleDetColl.splice(ind, 1);
            }
        }
    };



    function OnClickDefault() {
        document.getElementById('NozzleForm').style.display = "none";
        document.getElementById('PumpForm').style.display = "none";

        document.getElementById('addnozzle').onclick = function () {
            document.getElementById('NozzleTable').style.display = "none";
            document.getElementById('NozzleForm').style.display = "block";
        }

        document.getElementById('backtonozzle').onclick = function () {
            document.getElementById('NozzleForm').style.display = "none";
            document.getElementById('NozzleTable').style.display = "block";
        }

        document.getElementById('addPump').onclick = function () {
            document.getElementById('PumpTable').style.display = "none";
            document.getElementById('PumpForm').style.display = "block";
        }

        document.getElementById('backtopump').onclick = function () {
            document.getElementById('PumpForm').style.display = "none";
            document.getElementById('PumpTable').style.display = "block";
        }

    }


    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.newNozzle =
        {
            NatureId: 0,
            Name: '',
            Code: '',
            SNo: 0,
            StatusId: null
        };
    }


    $scope.calculateSales = function () {
        if (!isNaN($scope.newMeterReading.LastReading) && !isNaN($scope.newMeterReading.CurrentReading)) {
            $scope.newMeterReading.Sales = $scope.newMeterReading.CurrentReading - $scope.newMeterReading.LastReading;
        } else {
            $scope.newMeterReading.Sales = 0;
        }
    };


    //for Nozzle tab
    $scope.IsValidNozzle = function () {
        if ($scope.newNozzle.Name.isEmpty()) {
            Swal.fire("Please ! Enter  Name");
            return false;
        }
        else
            return true;
    }

    $scope.SaveUpdateNozzle = function () {
        if ($scope.IsValidNozzle() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newNozzle.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateNozzle();
                    }
                });
            }
            else
                $scope.CallSaveUpdateNozzle();
        }
    };

    $scope.CallSaveUpdateNozzle = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/SaveNozzle",
            headers: { 'content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newNozzle }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearNozzle();
                $scope.GetAllNozzle();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }


    $scope.GetAllNozzle = function () {
        $scope.NozzleList = []; //declare an empty array
        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'GET',
            url: base_url + "Inventory/Transaction/GetAllNozzle",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.NozzleList = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.GetNozzleById = function (beData) {
        $scope.loadingstatus = "running";
        var para = {
            NozzleId: beData.NozzleId
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/getNozzleById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newNozzle = res.data.Data;
                    $scope.newNozzle.Mode = 'Modify';

                    //change heree show hide
                    document.getElementById('NozzleForm').style.display = "block";
                    document.getElementById('NozzleTable').style.display = "none";
                });
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });
    };



    $scope.DelNozzle = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { NozzleId: refData.NozzleId };
                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Transaction/DeleteNozzle",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.NozzleList.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }



    //for Pump tab
    $scope.IsValidPump = function () {
        if ($scope.newPump.Name.isEmpty()) {
            Swal.fire("Please ! Enter  Name");
            return false;
        }
        else
            return true;
    }

    $scope.SaveUpdatePump = function () {
        if ($scope.IsValidPump() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newPump.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdatePump();
                    }
                });
            }
            else
                $scope.CallSaveUpdatePump();
        }
    };

    $scope.CallSaveUpdatePump = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/SavePump",
            headers: { 'content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newPump }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearPump();
                $scope.GetAllPump();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }


    $scope.GetAllPump = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.PumpList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Transaction/GetAllPump",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.PumpList = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }



    $scope.GetPumpById = function (beData) {
        $scope.loadingstatus = "running";
        var para = {
            PumpId: beData.PumpId
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/getPumpById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newPump = res.data.Data;
                    $scope.newPump.Mode = 'Modify';

                    if (!$scope.newPump.PumpNozzleDetColl || $scope.newPump.PumpNozzleDetColl.length == 0) {
                        $scope.newPump.PumpNozzleDetColl = [];
                        $scope.newPump.PumpNozzleDetColl.push({});
                    }

                    //change heree show hide
                    document.getElementById('PumpTable').style.display = "none";
                    document.getElementById('PumpForm').style.display = "block";
                });
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });
    };



    $scope.DeletePump = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { PumpId: refData.PumpId };
                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Transaction/DeletePump",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.PumpList.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }



    $scope.IsValidMeterReading = function () {
        // if ($scope.newMeterReading.EquipmentName.isEmpty()) {
        //     Swal.fire('Please ! Enter Equipment Name');
        //     return false;
        // }
        return true;
    }

    $scope.SaveUpdateMeterReading = function () {
        if ($scope.IsValidMeterReading() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newMeterReading.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    / Read more about isConfirmed, isDenied below /
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateMeterReading();
                    }
                });
            } else
                $scope.CallSaveUpdateMeterReading();
        }
    };

    $scope.CallSaveUpdateMeterReading = function () {
        if (!$scope.newMeterReading.SelectedPump || !$scope.newMeterReading.SelectedNozzle)
            return;

        $scope.loadingstatus = "running";
        showPleaseWait();

        if ($scope.newMeterReading.ForDateDet) {
            $scope.newMeterReading.ForDate = $filter('date')(new Date($scope.newMeterReading.ForDateDet.dateAD), 'yyyy-MM-dd');
        }

        $scope.newMeterReading.PumpId = $scope.newMeterReading.SelectedPump.PumpId;
        $scope.newMeterReading.NozzleId = $scope.newMeterReading.SelectedNozzle.NozzleId;

        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/SaveMeterReading",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newMeterReading }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                  $scope.ClearMeterReading();                
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }


    //Reporting
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
                            title: 'Report  For Print',
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

    $scope.ChangePump = function () {
        $scope.newMeterReading.LastReading = 0;

        if ($scope.newMeterReading.SelectedPump && $scope.newMeterReading.SelectedNozzle) {
            $scope.newMeterReading.LastReading = $scope.newMeterReading.SelectedNozzle.LastReading;
        }

        $scope.newMeterReading.Sales = $scope.newMeterReading.CurrentReading - $scope.newMeterReading.LastReading;
    }


    $scope.GetMeterSummary = function (beData) {
        $scope.loadingstatus = "running";
        var para = {
            dateFrom: $filter('date')(new Date($scope.newRpt.DateFromDet.dateAD), 'yyyy-MM-dd'),
            dateTo: $filter('date')(new Date($scope.newRpt.DateToDet.dateAD), 'yyyy-MM-dd'),
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/GetMeterSummary",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;
                $scope.gridOptions.api.setRowData($scope.DataColl);

            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });
    };

    //Code added by suresh starts from here


    $scope.GetTransactionById = function (beData) {
        $scope.loadingstatus = "running";
        var para = {
            TranId: beData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/getMeterReadingById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newMeterReading = res.data.Data;
                    $scope.newMeterReading.Mode = 'Modify';
                    $('#SearchModal').modal('hide');

                });
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });
    };

    // Code Added for delete
    $scope.DelTransactionById = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete reading for ' + refData.ForMiti + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { TranId: refData.TranId };
                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Transaction/DeleteMeterReading",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.DataColl.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }


    $scope.GetAllMeterReading = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.AllTranColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Transaction/GetAllMeterReading",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AllTranColl = res.data.Data;
                $('#SearchModal').modal('show');
            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }
	
	
    $scope.CopyData = null;
    $scope.CopyTran = function () {
        $scope.CopyData = null;
        if ($scope.beData) {
            if ($scope.beData.TranId > 0)
            {
                $scope.CopyData = $scope.GetData();
                $scope.CopyData.TranId = 0;
            }
        }
    }
    $scope.PasteTran = function () {
        if ($scope.CopyData) {
            $scope.ClearData();
            $timeout(function () {
                $scope.SetData($scope.CopyData);
                $scope.CopyData = null;
                //$scope.getVoucherNo();
            });            
        }        
    }

    $(document).on("keydown", ".serial", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent default action

            var inputs = $(".serial:visible:not(:disabled):not([readonly])"); // Get all visible focusable elements
            var index = inputs.index(this);

            if (index < inputs.length - 1) {
                inputs.eq(index + 1).focus(); // Move to next input
            } else {
                // If last input, go to the first input of the next row
                var nextRow = $(this).closest("tr").next();
                if (nextRow.length) {
                    nextRow.find(".serial:visible:not(:disabled):not([readonly])").first().focus();
                }
            }
        }
        else if (event.key === "Tab" && event.shiftKey) {
            event.preventDefault(); // Prevent default action

            var inputs = $(".serial:visible:not(:disabled):not([readonly])");
            var index = inputs.index(this);

            if (index > 0) {
                inputs.eq(index - 1).focus(); // Move backward
            } else {
                // If first input, move to the last input of the previous row
                var prevRow = $(this).closest("tr").prev();
                if (prevRow.length) {
                    prevRow.find(".serial:visible:not(:disabled):not([readonly])").last().focus();
                }
            }
        }
    });
    $document.bind('keydown', function (event) {
        if (event.ctrlKey && event.key === 's') { // Ctrl + S
            event.preventDefault(); // Prevent browser save action
            $scope.$apply($scope.SaveUpdateMeterReading);
        }
        if (event.key === 'F3') { // F3
            event.preventDefault(); // Prevent browser save action
            $scope.$apply($scope.SearchData);

        }
        if (event.key === 'F5') { // F5
            event.preventDefault(); // Prevent browser save action
            $scope.$apply($scope.ClearData);
        }


    });
});