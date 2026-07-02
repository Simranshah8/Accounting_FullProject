app.controller('InsuranceController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Insurance';
    var glSrv = GlobalServices;
    LoadData();

    $scope.sideBarData = [];
    $scope.SelectedVoucher = null;
    $scope.SelectedCostClass = null;
    function LoadData()
    {

	$scope.VoucherSearchOptions = [{ text: 'PartyName', value: 'ADS.Buyes', searchType: 'text' }, { text: 'PanVat', value: 'ADS.SalesTaxNo', searchType: 'text' }, { text: 'PartyLedger', value: 'Led.Name', searchType: 'text' }, { text: 'RefNo', value: 'TS.[No]', searchType: 'text' }, { text: 'Invoice No.', value: 'TS.AutoManualNo', searchType: 'text' }, { text: 'Voucher', value: 'V.VoucherName', searchType: 'text' }, { text: 'CostClass', value: 'CC.Name', searchType: 'text' }, { text: 'VoucherDate', value: 'TS.VoucherDate', searchType: 'date' }, { text: 'Amount', value: 'TS.TotalAmount', searchType: 'number' }];
        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: glSrv.getPerPageRow(),
            sort: null,
            SearchType: 'text',
            SearchCol: '',
            SearchVal: '',
            SearchColDet: $scope.VoucherSearchOptions[4],
            pagearray: [],
            pageOptions: [5, 10, 20, 30, 40, 50]
        };
        


        $scope.beData = {
            TranId: 0,
            InsuranceName: '',
            BranchName: '',
            ContactNo1: '',
            ContactNo2: '',
            EngineNo: '',
            ChassisNo: '',
            Segment: '',
            RegdNo: '',
            Model: '',
            MFGYear: 0,
            CC: '',
            NamsariName:'',
            CustomerName: '',
            CustomerAddress: '',
            CustomerMobile1: '',
            CustomerMobile2: '',
            PartyGroup: '',
            SalesRate: 0,
            PolicyNo: '',
            IssueDateDet:null,
            IssueDate: null,
            ExpiredAfterDays: 365,
            NamsariDateDet: null,
            PolicyNamsariDate: null,
            AttchemtAmount: 0,
            InsuranceBy:1,
            PartyLedgerId: 1,
            SalesAllotmentTranId: null,
            AttechFiles:[],
        };
    }
    $scope.ShowSideBar = function () {
        $('#sidebarzz').toggleClass('active');
    };

    $scope.OnPartyLoad = function () {
        // $scope.loadingstatus = 'running';
    };

    $scope.OnProductLoad = function () {

        // $scope.loadingstatus = 'running';
    };


    $scope.SaveSalesInvoice = function () {

        // $scope.loadingstatus = 'running';
        alert('SAVE');

    }

    $scope.AddInsurance = function () {

     
        //var isValid = $scope.Validate();

        //if (!isValid)
         //   return;

        $scope.loadingstatus = "running";
        showPleaseWait();

        var filesColl = $scope.beData.AttechFiles;
        $scope.beData.AttechFiles = [];

        if ($scope.beData.IssueDateDet) {
             
            if (moment($scope.beData.IssueDateDet).isValid())
                $scope.beData.IssueDate = $filter('date')(new Date($scope.beData.IssueDateDet), 'yyyy-MM-dd');
            else
                $scope.beData.IssueDate = $filter('date')(new Date($scope.beData.IssueDateDet.dateAD), 'yyyy-MM-dd');
        }

        if ($scope.beData.NamsariDateDet) {

            if (moment($scope.beData.NamsariDateDet).isValid())
                $scope.beData.PolicyNamsariDate = $scope.beData.NamsariDateDet;
            else
                $scope.beData.PolicyNamsariDate = $scope.beData.NamsariDateDet.dateAD;
        }

        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/SaveUpdateInsurance",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.files) {
                    for (var i = 0; i < data.files.length; i++) {
                        formData.append("file" + i, data.files[i]);
                    }
                }
                return formData;
            },
            //data: JSON.stringify($scope.Product)
            data: { jsonData: $scope.beData,files:filesColl }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            alert(res.data.ResponseMSG);

            if (res.data.IsSuccess == true)
            {                
                $scope.Clear();
                $('#txtInsuranceName').focus();
            }                

        }, function (errormessage) {
                hidePleaseWait();
            $scope.loadingstatus = "stop";
            
        });

    }
    $scope.getVehilceDetails = function () {

        if ($scope.beData.EngineNo) {
            if ($scope.beData.EngineNo.length == 0)
                return;
        } else
            return;

        $http({
            method: 'GET',
            url: base_url + "Inventory/Transaction/getVehicleDetailsByEngNo?engineNo="+$scope.beData.EngineNo,            
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var vDet = res.data.Data;
                $scope.beData.CustomerName = vDet.PartyName;
                $scope.beData.NamsariName = vDet.PartyName;
                $scope.beData.CustomerAddress = vDet.Address;
                $scope.beData.CustomerMobile1 = vDet.MobileNo1;
                $scope.beData.CustomerMobile2 = vDet.MobileNo2;
                $scope.beData.ChassisNo = vDet.ChessisNo;
                $scope.beData.RegdNo = vDet.RegdNo;
                $scope.beData.Model = vDet.Model;
                $scope.beData.Color = vDet.Color;
                $scope.beData.MFGYear = vDet.MFGYear;
                $scope.beData.PartyGroup = vDet.PartyGroup;
                $scope.beData.SalesAllotmentTranId = vDet.TranId;
                $scope.beData.PartyLedgerId = vDet.PartyLedgerId;
            } else {
                $scope.ClearVehicleDet();
                alert(res.data.ResponseMSG + ' ' + $scope.beData.EngineNo);
                $scope.beData.EngineNo = '';
                $('#txtEngineNo').focus();
            }
                

        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.ClearVehicleDet = function () {
        $scope.beData.CustomerName = '';
        $scope.beData.CustomerAddress = '';
        $scope.beData.CustomerMobile1 = '';
        $scope.beData.CustomerMobile2 = '';
        $scope.beData.ChassisNo = '';
        $scope.beData.RegdNo = '';
        $scope.beData.Model = '';
        $scope.beData.Color = '';
        $scope.beData.MFGYear = 0;
        $scope.beData.PartyGroup = '';
    }
    $scope.Clear = function ()
    {
        $('input[type=file]').val(null);
        $scope.beData = {
            TranId: 0,
            InsuranceName: '',
            BranchName: '',
            ContactNo1: '',
            ContactNo2: '',
            EngineNo: '',
            ChassisNo: '',
            Segment: '',
            RegdNo: '',
            Model: '',
            MFGYear: 0,
            CC: '',
            CustomerName: '',
            CustomerAddress: '',
            CustomerMobile1: '',
            CustomerMobile2: '',
            PartyGroup: '',
            SalesRate: 0,
            PolicyNo: '',
            IssueDate: null,
            ExpiredAfterDays: 365,
            PolicyNamsariDate: null,
            AttchemtAmount: 0,
            InsuranceBy: 1,
            PartyLedgerId: 1,
            SalesAllotmentTranId: null,
            AttechFiles: []
        };
    }

    $scope.SearchDataColl = [];
    $scope.SearchData = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.paginationOptions.TotalRows = 0;

        var sCol = $scope.paginationOptions.SearchColDet;

        var para = {
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
            data: JSON.stringify(para)
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

        var para = {
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
            data: JSON.stringify(para)
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

    $scope.ValidLedAllocationColl = [];
    $scope.IsValidTran = function () {
        $scope.ValidLedAllocationColl = [];
        if ($scope.IsValidData() == true) {

            $scope.loadingstatus = "running";
            showPleaseWait();

            $http({
                method: 'POST',
                url: base_url + "Global/IsValidVoucher",
                headers: { 'Content-Type': undefined },

                transformRequest: function (data) {

                    var formData = new FormData();
                    formData.append("EntityId", EntityId);
                    formData.append("jsonData", angular.toJson(data.jsonData));
                    return formData;
                },
                data: { jsonData: $scope.GetData() }
            }).then(function (res) {

                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res.data.IsSuccess == true) {
                    if (res.data.Data && res.data.Data.length > 0) {
                        $scope.ValidLedAllocationColl = JSON.parse(res.data.Data);
                        $('#frmMDLLedAllocation').modal('show');
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }
                } else {
                    Swal.fire(res.data.ResponseMSG);
                }
            }, function (errormessage) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";
            });

        }
    }


    $scope.TranRelation = {};
    $scope.ShowTransactionRelation = function () {

        $scope.TranRelation = {};
        if ($scope.beData.TranId > 0) {

            $scope.loadingstatus = "running";
            showPleaseWait();

            var para = {
                TranId: $scope.beData.TranId,
                VoucherType: VoucherType,
            };

            $http({
                method: 'POST',
                url: base_url + "Global/GetTranRelation",
                dataType: "json",
                data: JSON.stringify(para)
            }).then(function (res1) {
                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res1.data.IsSuccess && res1.data.Data) {
                    var tranData = res1.data.Data;
                    if (tranData.length > 0) {
                        $scope.TranRelation.Parent = res1.data.Data[0];
                        $scope.TranRelation.ChieldColl = [];
                        angular.forEach(tranData, function (td) {
                            if (td.LevelId > 1)
                                $scope.TranRelation.ChieldColl.push(td);
                        });

                        $('#frmMDLTranRelation').modal('show');
                    }

                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });


        }
    }

    $scope.AuditLogColl = [];
    $scope.ShowAuditLog = function () {

        $scope.AuditLogColl = {};
        if ($scope.beData.TranId > 0) {

            $scope.loadingstatus = "running";
            showPleaseWait();

            GlobalServices.getAuditLog(EntityId, $scope.beData.TranId).then(function (res1) {
                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res1.data.IsSuccess && res1.data.Data) {
                    $scope.AuditLogColl = res1.data.Data;
                    $('#frmAuditHis').modal('show');
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });

        }
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

    $scope.AddMoreFiles = function (files, des) {
        if (files) {
            if (files != null) {
                angular.forEach(files, function (file) {
                    $scope.beData.DocumentColl.push({
                        File: file,
                        Name: file.name,
                        Type: file.type,
                        Size: file.size,
                        Description: des,
                        Path: null
                    });
                })
                $scope.attachFile = null;
                $scope.docDescription = '';
                $('#flMoreFiles').val('');
            }
        }
    };

    $scope.delAttachmentFiles = function (ind) {
        if ($scope.beData.DocumentColl) {
            if ($scope.beData.DocumentColl.length > 0) {
                $scope.beData.DocumentColl.splice(ind, 1);
            }
        }
    }
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
});