"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller('serviceDashboardCtrl', function ($scope, $http, $filter, $timeout) {
     
    $scope.LoadData = function () {
        $scope.DB = {};

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true,
            placeholder:'**select**'
        });

        $scope.CallingType = 0;
        $scope.para = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date()
        };

        $scope.VehicleModelList = [];
        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetVehicleModelList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VehicleModelList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.BranchList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.FailedReasonList = [];
        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetCallFailedReasonList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.FailedReasonList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.VehicleImplementsList = [];
        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetVehicleImplementsList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VehicleImplementsList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.ComplainTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetCallComplainTypeList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ComplainTypeList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.JDReasonList = [];
        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetReasonForNotUsingJDService",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.JDReasonList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.JDVehicleReasonList = [];
        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetReasonForNotUsingJDVehicle",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.JDVehicleReasonList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.GetData();
    }

    $scope.GetData = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var dateFrom =$filter('date')(new Date(), 'yyyy-MM-dd');
        var dateTo = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.para.DateFromDet)
            dateFrom = $filter('date')($scope.para.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.para.DateToDet)
            dateTo = $filter('date')($scope.para.DateToDet.dateAD, 'yyyy-MM-dd');

        var para = {
            dateFrom: dateFrom,
            dateTo: dateTo
        };

        $http({
            method: 'POST',
            url: base_url + "Service/Reporting/GetDashboard",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.DB = res.data.Data;

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

        var columnDefs = [
            { headerName: "S.No.", field: "SNo", filter: "agNumberColumnFilter", width: 100, pinned: 'left' },
            {
                headerName: "Date", field: "EntryDateTime", filter: "agTextColumnFilter", width: 120, pinned: 'left',
                valueFormatter: function (params) { return DateFormatAD(params.value); },
            },
            {
                headerName: "JobNo", field: "JobNo", filter: 'agNumberColumnFilter', width: 140, pinned: 'left',
                cellRenderer:
                    function (params) {
                        return '<a class="btn btn-default btn-xs" ng-click="ShowJobCardDetails(' + params.data.TranId + ')">' + params.data.JobNo + '</a>';
                    }
            },
 
            { headerName: "Status", field: "CallStatus", filter: 'agTextColumnFilter', width: 140 },
         //   { headerName: "EngineNo", field: "EngineNo", filter: 'agTextColumnFilter', width: 120 },

            {
                headerName: "EngineNo", width: 150, field: "EngineNo", cellRenderer:
                    function (params) {
                        return '<a class="btn btn-default btn-xs" ng-click="ShowCallingDialog(' + params.data.TranId + ')">' + params.data.EngineNo + '</a>';
                    }
            },

            { headerName: "ChSrlNo", field: "ChassisNo", filter: 'agTextColumnFilter', width: 140 },
            { headerName: "Model", field: "Model", filter: 'agTextColumnFilter', width: 120 },
            { headerName: "Godown", field: "Godown", filter: 'agTextColumnFilter', width: 150, },
            { headerName: "MobileNo", field: "MobileNo", filter: 'agTextColumnFilter', width: 140 },
            { headerName: "InvoiceDate", field: "InvoiceDate", filter: 'agDateColumnFilter', width: 110, cellStyle: { 'text-align': 'center' } },
            { headerName: "InvoiceMiti", field: "InvoiceMiti", filter: 'agTextColumnFilter', width: 110, cellStyle: { 'text-align': 'center' } },
            { headerName: "Age", field: "DaysDiff", filter: 'agNumberColumnFilter', width: 130, cellStyle: { 'text-align': 'center' } },

            { headerName: "ServiceAdvisor", field: "ServiceAdvisor", filter: 'agTextColumnFilter', width: 110, },
            { headerName: "Mechanic", field: "Mechanic", filter: 'agTextColumnFilter', width: 110, },
            { headerName: "Running HR", field: "RunningHR", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'center' } },
            { headerName: "Running KM", field: "RunningKM", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'center' } },
            { headerName: "JobTobeAttended", field: "JobTobeAttended", filter: 'agTextColumnFilter', width: 210, },
            { headerName: "Complain", field: "Complain", filter: 'agTextColumnFilter', width: 210, },
            { headerName: "ClosedDateTime", field: "ClosedDateTime", filter: 'agDateColumnFilter', width: 110, },
            { headerName: "CloseNotes", field: "CloseNotes", filter: 'agTextColumnFilter', width: 110, },
            { headerName: "PartyName", field: "PartyName", filter: 'agTextColumnFilter', width: 110, },
            { headerName: "Address", field: "Address", filter: 'agTextColumnFilter', width: 110, },
            { headerName: "InvoiceNo", field: "InvoiceNo", filter: 'agTextColumnFilter', width: 110, cellStyle: { 'text-align': 'center' } },
            { headerName: "Regd.No", field: "RegdNo", filter: 'agTextColumnFilter', width: 140 },
            { headerName: "Product", field: "ProductName", filter: 'agTextColumnFilter', width: 140 },

            { headerName: "FailedReason", field: "FailedReason", filter: 'agTextColumnFilter', width: 240 },
            { headerName: "FailedComment", field: "FailedComment", filter: 'agTextColumnFilter', width: 240 },
            { headerName: "FailedCount", field: "FailedCount", filter: 'agNumberColumnFilter', width: 140 },
            { headerName: "TicketStatus", field: "TicketStatus", filter: 'agTextColumnFilter', width: 140 },
        ];

        $scope.gridOptions =
        {
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                width: 100,

            },
            angularCompileRows: true,
            enableSorting: true,
            multiSortKey: 'ctrl',
            enableColResize: true,
            overlayLoadingTemplate: "Loading..",
            overlayNoRowsTemplate: "No Records found",
            rowSelection: 'multiple',
            columnDefs: columnDefs,
            rowData: null,
            filter: true,
            enableFilter: true,
            getRowStyle: params => {

                var rdata = params.node.data;
                if (rdata.FailedCount == 1) {

                    if (rdata.TicketStatus && rdata.TicketStatus.length>0)
                        return { background: '#AED6F1' };
                    else
                        return { background: 'Yellow' };
                }
                else if (rdata.FailedCount == 2) {

                    if (rdata.TicketStatus && rdata.TicketStatus.length > 0)
                        return { background: '#AED6F1' };
                    else
                        return { background: 'Orange' };
                    
                }
                else if (rdata.FailedCount > 2) {

                    if (rdata.TicketStatus && rdata.TicketStatus.length > 0)
                        return { background: '#AED6F1' };
                    else
                        return { background: 'Red' };
                    
                }
                    

            },
        };

        // lookup the container we want the Grid to use
       // $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
       // new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

    }
     
    $scope.getJobCardCallingRpt = function (callType) {

        $scope.DataColl = [];
        $scope.CallingType = callType;
        $scope.loadingstatus = 'running';
        var DataColl = [];
        $scope.gridOptions.api.setRowData(DataColl);
        showPleaseWait();

        var para = {
            CallingType: callType,
            dateFrom: $scope.para.DateFromDet.dateAD,
            dateTo: $scope.para.DateToDet.dateAD
        };

        $http({
            method: 'POST',
            url: base_url + "Service/Reporting/GetJobCardCallingRpt",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = mx(res.data.Data);

                $scope.gridOptions.api.setRowData(res.data.Data);
            } else
                alert(res.data.ResponseMSG);

            $scope.loadingstatus = 'stop';
            hidePleaseWait();
        }, function (reason) {
            alert('Failed' + reason);
            $scope.loadingstatus = 'stop';

        });
    }

    $scope.CurJob = {};
    $scope.ShowJobCardDetails = function (tranId) {

        showPleaseWait();       
        $http({
            method: 'GET',
            url: base_url + "Service/Reporting/getJobCardByTranId?tranId="+tranId,
            dataType: "json",            
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.CurJob = res.data.Data;                 
                $('#jobclosed').modal('show');
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
            $scope.loadingstatus = 'stop';

        });
         
    }
     
    $scope.CurCall = {};
    $scope.ShowCallingDialog = function (tranId) {

        var CurVehicle = $scope.DataColl.firstOrDefault(p1 => p1.TranId == tranId);
        $scope.CurCall = {};

        if ($scope.CallingType == 1) {

            $scope.CurCall = {
                JobCardId: tranId,
                VehicleEntryId: CurVehicle.VehicleEntryId,
                CallFailedReasonId: null,
                CallFailedComment: '',
                AnyComplaints: false,
                Complaint: '',
                ComplainIdColl: '',
                Comments: '',
                IsRepeatPurchase: false,
                IsInstallationDone: false,
                VehicleImplementId: null,
                AreYouSatisfied: true,
                SatisfiedYes: '',
                SatisfiedNo: '',
                PartyName: CurVehicle.PartyName,
                Address: CurVehicle.Address,
                MobileNo: CurVehicle.MobileNo,
                Model: CurVehicle.Model,
                InvoiceDate: CurVehicle.InvoiceDate,
                InvoiceMiti: CurVehicle.InvoiceMiti,
                Branch: CurVehicle.Branch,
                Godown: CurVehicle.Godown,
                EntryDateTime: CurVehicle.EntryDateTime,
                IsFailed: false,
            };

            $('#fourthcall').modal('show');
        }
        else if ($scope.CallingType == 2) {

            angular.forEach($scope.ComplainTypeList, function (ct) {
                ct.IsSelected = false;
            });

            $scope.CurCall = {
                JobCardId: tranId,
                VehicleEntryId: CurVehicle.VehicleEntryId,
                CallFailedReasonId: null,
                CallFailedComment: '',
                ServiceQualityRate:1, 
                ServiceComment:'', 
                RecommendRate:1,
                RecommendComment:'', 
                AnyComplaints :false,
                Complaint:'', 
                ComplainIdColl:'', 
                Comments: '',
                PartyName: CurVehicle.PartyName,
                Address: CurVehicle.Address,
                MobileNo: CurVehicle.MobileNo,
                Model: CurVehicle.Model,
                InvoiceDate: CurVehicle.InvoiceDate,
                InvoiceMiti: CurVehicle.InvoiceMiti,
                Branch: CurVehicle.Branch,
                Godown: CurVehicle.Godown,
                EntryDateTime: CurVehicle.EntryDateTime,
                Service1: true,
                RunningHMR: 0,
                RunningComment:'',
                IsFailed: false,
            };

            $('#fifthcall').modal('show');
        }
        else if ($scope.CallingType == 3) {

            showPleaseWait();
            var para1 = {
                tranId: CurVehicle.TranId,
                vehicleEntryId:CurVehicle.VehicleEntryId
            };
            $http({
                method: 'POST',
                url: base_url + "Service/Reporting/GetJobCardDetails",
                dataType: "json",
                data: JSON.stringify(para1)
            }).then(function (res)
            {
                $scope.loadingstatus = 'stop';
                hidePleaseWait();

                if (res.data.IsSuccess && res.data.Data) {
                    var jobH = res.data.Data;

                    $scope.CurCall = {
                        JobCardId: tranId,
                        VehicleEntryId: CurVehicle.VehicleEntryId,
                        CallFailedReasonId: null,
                        CallFailedComment: '',
                        NotUsedReasonId: null,
                        NotUsedComment: '',                        
                        PartyName: CurVehicle.PartyName,
                        Address: CurVehicle.Address,
                        MobileNo: CurVehicle.MobileNo,
                        Model: CurVehicle.Model,
                        InvoiceDate: CurVehicle.InvoiceDate,
                        InvoiceMiti: CurVehicle.InvoiceMiti,
                        Branch: CurVehicle.Branch,
                        Godown: CurVehicle.Godown,
                        ChSrlNo: CurVehicle.ChSrlNo,
                        EntryDateTime: CurVehicle.EntryDateTime,
                        EngineNo: CurVehicle.EngineNo,
                        JobCard:jobH,
                        IsFailed: false,
                        AreYouUsing:true,
                        ServiceFrom:null,
                        SparePartFrom:null,
                        WhyNotJDService: null,
                        AnyComplaints: false,
                        Complaint: '',
                        ComplainIdColl: '',
                        Comments: '',
                        AreYouInterested: false,
                        Plantobuydate: null,
                        VehicleModelId: null,
                        UserComment: '',
                        RelativeName: '',
                        ContactNo: '',
                        Village: '',
                        Relation: '',
                        ServiceFromComment: '',
                        SparePartFromComment:''
                    };

                    $('#nonretained').modal('show');

                } else
                     Swal.fire(res.data.ResponseMSG);

            }, function (reason) {
                alert('Failed' + reason);
                $scope.loadingstatus = 'stop';

            });

          
        }
        else if ($scope.CallingType ==4) {

            $scope.CurCall = {
                JobCardId: tranId,
                VehicleEntryId: CurVehicle.VehicleEntryId,
                CallFailedReasonId: null,
                CallFailedComment: '',
                ServiceQualityRate: 1,
                ServiceComment: '',
                RecommendRate: 1,
                RecommendComment: '',
                AnyComplaints: false,
                Complaint: '',
                ComplainIdColl: '',
                Comments: '',
                PartyName: CurVehicle.PartyName,
                Address: CurVehicle.Address,
                MobileNo: CurVehicle.MobileNo,
                Model: CurVehicle.Model,
                InvoiceDate: CurVehicle.InvoiceDate,
                InvoiceMiti: CurVehicle.InvoiceMiti,
                Branch: CurVehicle.Branch,
                Godown: CurVehicle.Godown,
                EntryDateTime: CurVehicle.EntryDateTime,
                IsFailed: false,
                AreYouInterested: false,
                Plantobuydate: null,
                VehicleModelId: null,
                UserComment: '',
                RelativeName: '',
                ContactNo: '',
                Village: '',
                Relation: '',
            };

            $('#potential').modal('show');
        }
        else if ($scope.CallingType == 6) {

            $scope.CurCall = {
                JobCardId: tranId,
                VehicleEntryId: CurVehicle.VehicleEntryId,
                CallFailedReasonId: null,
                CallFailedComment: '',
                ServiceQualityRate: 1,
                ServiceComment: '',
                RecommendRate: 1,
                RecommendComment: '',
                AnyComplaints: false,
                Complaint: '',
                ComplainIdColl: '',
                Comments: '',
                PartyName: CurVehicle.PartyName,
                Address: CurVehicle.Address,
                MobileNo: CurVehicle.MobileNo,
                Model: CurVehicle.Model,
                InvoiceDate: CurVehicle.InvoiceDate,
                InvoiceMiti: CurVehicle.InvoiceMiti,
                Branch: CurVehicle.Branch,
                Godown: CurVehicle.Godown,
                EntryDateTime: CurVehicle.EntryDateTime,
                IsFailed: false,
                AreYouInterested:false,
                Plantobuydate:null,
                VehicleModelId:null,
                UserComment:'',
                RelativeName: '',
                ContactNo: '',
                Village: '',
                Relation: '',
            };

            $('#retained').modal('show');
        }

        else if ($scope.CallingType == 8) {


            showPleaseWait();
            var para1 = {
                tranId: CurVehicle.TranId,
                vehicleEntryId: CurVehicle.VehicleEntryId
            };
            $http({
                method: 'POST',
                url: base_url + "Service/Reporting/GetJobCardDetails",
                dataType: "json",
                data: JSON.stringify(para1)
            }).then(function (res) {
                $scope.loadingstatus = 'stop';
                hidePleaseWait();

                if (res.data.IsSuccess && res.data.Data) {
                    var jobH = res.data.Data;

                    $scope.CurCall = {
                        JobCardId: tranId,
                        VehicleEntryId: CurVehicle.VehicleEntryId,
                        CallFailedReasonId: null,
                        CallFailedComment: '',
                        PartyName: CurVehicle.PartyName,
                        Address: CurVehicle.Address,
                        MobileNo: CurVehicle.MobileNo,
                        Model: CurVehicle.Model,
                        InvoiceDate: CurVehicle.InvoiceDate,
                        InvoiceMiti: CurVehicle.InvoiceMiti,
                        Branch: CurVehicle.Branch,
                        Godown: CurVehicle.Godown,
                        ChSrlNo: CurVehicle.ChSrlNo,
                        EntryDateTime: CurVehicle.EntryDateTime,
                        EngineNo: CurVehicle.EngineNo,
                        JobCard: jobH,
                        AreYouUsing: true,
                        Reason: '',
                        Comments: '',
                        BookServiceRepair: true,
                        ServiceRepaitComment: '',
                        ServiceRepairDate: null,
                        CallLater: false,
                        CallComment: '',
                        CallDate: null,
                        IsFailed:false
                    };

                    $('#remainder').modal('show');

                } else
                    Swal.fire(res.data.ResponseMSG);

            }, function (reason) {
                alert('Failed' + reason);
                $scope.loadingstatus = 'stop';

            });

            
        }
    }

    $scope.ClickOnFailedCall = function () {
        if ($scope.CurCall.IsFailed == true) {
            $scope.CurCall.IsFailed = false;
            $scope.CurCall.CallFailedReasonId = null;
            $scope.CurCall.CallFailedComment = '';
        }            
        else
            $scope.CurCall.IsFailed = true;
    }
    
    $scope.CallSaveUpdateFourthCall = function () {

        Swal.fire({
            title: 'Do you want to save the current data?',
            showCancelButton: true,
            confirmButtonText: 'Save',
        }).then((result) => {
            if (result.isConfirmed)
            {

                $scope.loadingstatus = 'running';
                showPleaseWait();

                $scope.CurCall.Complaint = '';
                $scope.CurCall.ComplainIdColl = '';

                if ($scope.CurCall.AnyComplaints == true) {
                    angular.forEach($scope.ComplainTypeList, function (ct) {

                        if (ct.IsSelected == true) {

                            if ($scope.CurCall.Complaint.length > 0) {
                                $scope.CurCall.Complaint = $scope.CurCall.Complaint + ',';
                                $scope.CurCall.ComplainIdColl = $scope.CurCall.ComplainIdColl + ',';
                            }

                            $scope.CurCall.Complaint = $scope.CurCall.Complaint + ct.text;
                            $scope.CurCall.ComplainIdColl = $scope.CurCall.ComplainIdColl + ct.id;
                        }
                    });
                }
              

                $http({
                    method: 'POST',
                    url: base_url + "Service/Reporting/SaveFourthCall",
                    headers: { 'content-Type': undefined },
                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("jsonData", angular.toJson(data.jsonData));
                        return formData;
                    },
                    data: { jsonData: $scope.CurCall }
                }).then(function (res) {

                    $scope.loadingstatus = "stop";
                    hidePleaseWait();

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.CurCall = {};
                        $('#fourthcall').modal('hide');
                    }
                }, function (errormessage) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                });
            }
        });

    }

    $scope.CallSaveUpdateFifthCall = function () {
        Swal.fire({
            title: 'Do you want to save the current data?',
            showCancelButton: true,
            confirmButtonText: 'Save',
        }).then((result) => {
            if (result.isConfirmed) {

                $scope.loadingstatus = 'running';
                showPleaseWait();

                $scope.CurCall.Complaint = '';
                $scope.CurCall.ComplainIdColl = '';

                if ($scope.CurCall.AnyComplaints == true) {
                    angular.forEach($scope.ComplainTypeList, function (ct) {

                        if (ct.IsSelected == true) {

                            if ($scope.CurCall.Complaint.length > 0) {
                                $scope.CurCall.Complaint = $scope.CurCall.Complaint + ',';
                                $scope.CurCall.ComplainIdColl = $scope.CurCall.ComplainIdColl + ',';
                            }

                            $scope.CurCall.Complaint = $scope.CurCall.Complaint + ct.text;
                            $scope.CurCall.ComplainIdColl = $scope.CurCall.ComplainIdColl + ct.id;
                        }
                    });
                }

                $http({
                    method: 'POST',
                    url: base_url + "Service/Reporting/SaveFifthCall",
                    headers: { 'content-Type': undefined },
                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("jsonData", angular.toJson(data.jsonData));
                        return formData;
                    },
                    data: { jsonData: $scope.CurCall }
                }).then(function (res) {

                    $scope.loadingstatus = "stop";
                    hidePleaseWait();

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.CurCall = {};
                        $('#fifthcall').modal('hide');
                    }
                }, function (errormessage) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                });
            }
        });
    }

    $scope.CallSaveUpdateSixthCall = function () {

        var vDate = null;
        if ($scope.CurCall.PlantobuydateDet) {
            vDate = $filter('date')(new Date($scope.CurCall.PlantobuydateDet.dateAD), 'yyyy-MM-dd');
        }
        $scope.CurCall.Plantobuydate = vDate;

        Swal.fire({
            title: 'Do you want to save the current data?',
            showCancelButton: true,
            confirmButtonText: 'Save',
        }).then((result) => {
            if (result.isConfirmed) {

                $scope.loadingstatus = 'running';
                showPleaseWait();

                $scope.CurCall.Complaint = '';
                $scope.CurCall.ComplainIdColl = '';

                if ($scope.CurCall.AnyComplaints == true) {
                    angular.forEach($scope.ComplainTypeList, function (ct) {

                        if (ct.IsSelected == true) {

                            if ($scope.CurCall.Complaint.length > 0) {
                                $scope.CurCall.Complaint = $scope.CurCall.Complaint + ',';
                                $scope.CurCall.ComplainIdColl = $scope.CurCall.ComplainIdColl + ',';
                            }

                            $scope.CurCall.Complaint = $scope.CurCall.Complaint + ct.text;
                            $scope.CurCall.ComplainIdColl = $scope.CurCall.ComplainIdColl + ct.id;
                        }
                    });
                }

                $http({
                    method: 'POST',
                    url: base_url + "Service/Reporting/SaveSixthCall",
                    headers: { 'content-Type': undefined },
                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("jsonData", angular.toJson(data.jsonData));
                        return formData;
                    },
                    data: { jsonData: $scope.CurCall }
                }).then(function (res) {

                    $scope.loadingstatus = "stop";
                    hidePleaseWait();

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.CurCall = {};
                        $('#nonretained').modal('hide');
                    }
                }, function (errormessage) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                });
            }
        });
    }

    $scope.CallSaveUpdateRetainedCall = function () {

        var vDate = null;
        if ($scope.CurCall.PlantobuydateDet) {
            vDate = $filter('date')(new Date($scope.CurCall.PlantobuydateDet.dateAD), 'yyyy-MM-dd');
        }
        $scope.CurCall.Plantobuydate = vDate;

        Swal.fire({
            title: 'Do you want to save the current data?',
            showCancelButton: true,
            confirmButtonText: 'Save',
        }).then((result) => {
            if (result.isConfirmed) {

                $scope.loadingstatus = 'running';
                showPleaseWait();

                $scope.CurCall.Complaint = '';
                $scope.CurCall.ComplainIdColl = '';

                if ($scope.CurCall.AnyComplaints == true) {
                    angular.forEach($scope.ComplainTypeList, function (ct) {

                        if (ct.IsSelected == true) {

                            if ($scope.CurCall.Complaint.length > 0) {
                                $scope.CurCall.Complaint = $scope.CurCall.Complaint + ',';
                                $scope.CurCall.ComplainIdColl = $scope.CurCall.ComplainIdColl + ',';
                            }

                            $scope.CurCall.Complaint = $scope.CurCall.Complaint + ct.text;
                            $scope.CurCall.ComplainIdColl = $scope.CurCall.ComplainIdColl + ct.id;
                        }
                    });
                }

                $http({
                    method: 'POST',
                    url: base_url + "Service/Reporting/SaveRetainedCall",
                    headers: { 'content-Type': undefined },
                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("jsonData", angular.toJson(data.jsonData));
                        return formData;
                    },
                    data: { jsonData: $scope.CurCall }
                }).then(function (res) {

                    $scope.loadingstatus = "stop";
                    hidePleaseWait();

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.CurCall = {};
                        $('#retained').modal('hide');
                    }
                }, function (errormessage) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                });
            }
        });
    }

    $scope.CallSaveUpdatePotentialCall = function () {

        var vDate = null;
        if ($scope.CurCall.PlantobuydateDet) {
            vDate = $filter('date')(new Date($scope.CurCall.PlantobuydateDet.dateAD), 'yyyy-MM-dd');
        }
        $scope.CurCall.Plantobuydate = vDate;

        Swal.fire({
            title: 'Do you want to save the current data?',
            showCancelButton: true,
            confirmButtonText: 'Save',
        }).then((result) => {
            if (result.isConfirmed) {

                $scope.loadingstatus = 'running';
                showPleaseWait();

                $scope.CurCall.Complaint = '';
                $scope.CurCall.ComplainIdColl = '';

                if ($scope.CurCall.AnyComplaints == true) {
                    angular.forEach($scope.ComplainTypeList, function (ct) {

                        if (ct.IsSelected == true) {

                            if ($scope.CurCall.Complaint.length > 0) {
                                $scope.CurCall.Complaint = $scope.CurCall.Complaint + ',';
                                $scope.CurCall.ComplainIdColl = $scope.CurCall.ComplainIdColl + ',';
                            }

                            $scope.CurCall.Complaint = $scope.CurCall.Complaint + ct.text;
                            $scope.CurCall.ComplainIdColl = $scope.CurCall.ComplainIdColl + ct.id;
                        }
                    });
                }

                $http({
                    method: 'POST',
                    url: base_url + "Service/Reporting/SavePotentialCall",
                    headers: { 'content-Type': undefined },
                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("jsonData", angular.toJson(data.jsonData));
                        return formData;
                    },
                    data: { jsonData: $scope.CurCall }
                }).then(function (res) {

                    $scope.loadingstatus = "stop";
                    hidePleaseWait();

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.CurCall = {};
                        $('#potential').modal('hide');
                    }
                }, function (errormessage) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                });
            }
        });
    }

    $scope.CallSaveUpdateServiceReminderCall = function () {

        Swal.fire({
            title: 'Do you want to save the current data?',
            showCancelButton: true,
            confirmButtonText: 'Save',
        }).then((result) => {
            if (result.isConfirmed) {

                $scope.loadingstatus = 'running';
                showPleaseWait(); 

                if ($scope.CurCall.ServiceRepairDateDet) {
                    $scope.CurCall.ServiceRepairDate = $filter('date')(new Date($scope.CurCall.ServiceRepairDateDet.dateAD), 'yyyy-MM-dd');
                }

                if ($scope.CurCall.CallDateDet) {
                    $scope.CurCall.CallDate = $filter('date')(new Date($scope.CurCall.CallDateDet.dateAD), 'yyyy-MM-dd');
                }

                $http({
                    method: 'POST',
                    url: base_url + "Service/Reporting/SaveServiceReminder",
                    headers: { 'content-Type': undefined },
                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("jsonData", angular.toJson(data.jsonData));
                        return formData;
                    },
                    data: { jsonData: $scope.CurCall }
                }).then(function (res) {

                    $scope.loadingstatus = "stop";
                    hidePleaseWait();

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.CurCall = {};
                        $('#remainder').modal('hide');
                    }
                }, function (errormessage) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                });
            }
        });

    }

    $scope.onBtExportCSV = function () {

        var params = {
            fileName: '',
            sheetName: ''
        };

        if ($scope.CallingType == 0) {
            params.fileName = 'TotalPopulation.csv';
            params.sheetName = 'Total Population';
        }
        else if ($scope.CallingType == 1) {
            params.fileName = '4thCall.csv';
            params.sheetName = '4th Call';
        }
        else if ($scope.CallingType == 2) {
            params.fileName = '5th Call.csv';
            params.sheetName = '5th Call';
        }
        else if ($scope.CallingType == 3) {
            params.fileName = '6thCallNonRetained.csv';
            params.sheetName = '6th Call Non Retained';
        }
        else if ($scope.CallingType == 4) {
            params.fileName = 'PotentialCustomer.csv';
            params.sheetName = 'Potential Customer';
        }
        else if ($scope.CallingType == 5) {
            params.fileName = 'PendingInstallation.csv';
            params.sheetName = 'Pending Installation';
        }
        else if ($scope.CallingType == 6) {
            params.fileName = '6thCallRetained.csv';
            params.sheetName = '6th Call Retained';
        }
        else if ($scope.CallingType == 7) {
            params.fileName = 'Open JobCard.csv';
            params.sheetName = 'OpenJobCard';
        }
        else {
            params.fileName = 'data.csv';
            params.sheetName = 'Data';
        }

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
});