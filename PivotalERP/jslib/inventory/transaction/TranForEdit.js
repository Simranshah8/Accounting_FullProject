

app.controller("tranForEditCntrl", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    LoadData();
     
    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            PendingOrder: 1,
        };

        $scope.searchData = {
            PendingOrder: '',
        };

        $scope.perPage = {
            PendingOrder: 20,
        };


        $scope.comDet = {};
        GlobalServices.getCompanyDet().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.comDet = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.VoucherTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetVoucherTypes",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VoucherTypeList = res.data.Data;
            }
            else {
                Swal.fire(res.data.ResponseMSG);
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

                if ($scope.BranchList.length == 1) {
                    $scope.dayBook.BranchId = $scope.BranchList[0].BranchId;
                }
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        $scope.beData = {};
     
        $scope.dayBook = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0,
            IsSummary: true,
            For: 1
        };
         
     
    }

   

    $scope.GetTran = function () {

        $scope.beData = {};
        $scope.TranColl = [];
          
        $scope.loadingstatus = 'running';
        showPleaseWait();

        var proc = "";
        if ($scope.dayBook.VoucherType == 12)
            proc = "usp_H_GetDeliveryNoteById";
        else if ($scope.dayBook.VoucherType == 14)
            proc = "usp_H_GetSalesInvoiceById";
        else if ($scope.dayBook.VoucherType == 16)
            proc = "usp_H_GetSalesReturnById";

        var beData = {
            TranId:0,
            VoucherNo: $scope.dayBook.VoucherNo,
        };
        //public JsonNetResult GetMRSCustomData(string procName, string qry,  string tblNames, System.Collections.Generic.Dictionary<string, string> paraColl = null)
        var para = {
            procName:proc,
            qry: '',           
            tblNames: 'Tran,ItemDetailsColl:Array',            
            paraColl: beData,
        }

        $http({
            method: "post",
            url: base_url + "Global/GetMRSCustomData",
            data: JSON.stringify(para),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'done';
            hidePleaseWait();
            if (res.data.IsSuccess == true) {
                $scope.beData = res.data.Data.Tran;
                $scope.beData.ItemDetailsColl = res.data.Data.ItemDetailsColl
                $scope.TranColl.push($scope.beData);
            } else if (res.data.IsSuccess != undefined)
            {
                Swal.fire(res.data.ResponseMSG);
            }
            
        }, function (errormessage) {

            $scope.loadingstatus = 'stop';

            alert('Unable to Store data. pls try again.' + errormessage.responseText);
        });

    };

    $scope.UpdateCustomer = function (curData, ind) {
        Swal.fire({
            title: 'Are You Sure To Update  Selected Voucher Party  ?',
            showCancelButton: true,
            confirmButtonText: "Update Voucher",
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var proc = "usp_H_UpdateCustomer";
 
                var para = {
                    procName: proc,                    
                    paraColl: {
                        TranId: curData.TranId,
                        VoucherType: $scope.dayBook.VoucherType,
                        CardCode:curData.CardCode
                    }
                };


                $http({
                    method: "post",
                    url: base_url + "Global/RunCustomProc",
                    data: JSON.stringify(para),
                    dataType: "json"
                }).then(function (res) {

                    $scope.loadingstatus = 'done';
                    hidePleaseWait();
                    Swal.fire(res.data.ResponseMSG);

                }, function (errormessage) {

                    $scope.loadingstatus = 'stop';

                    alert('Unable to Store data. pls try again.' + errormessage.responseText);
                });

            }
        });
    }

    $scope.UpdateSalesRef = function (curData, ind) {
        Swal.fire({
            title: 'Are You Sure To Update Ref. Sales Selected Voucher  ?',
            showCancelButton: true,
            confirmButtonText: "Update Voucher",
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var proc = "usp_H_UpdateRefForSalesInvoice";

                var para = {
                    procName: proc,
                    paraColl: {
                        TranId: curData.TranId,
                        InvoiceNo: curData.InvoiceNo
                    }
                };

                $http({
                    method: "post",
                    url: base_url + "Global/RunCustomProc",
                    data: JSON.stringify(para),
                    dataType: "json"
                }).then(function (res) {

                    $scope.loadingstatus = 'done';
                    hidePleaseWait();
                    Swal.fire(res.data.ResponseMSG);

                }, function (errormessage) {

                    $scope.loadingstatus = 'stop';

                    alert('Unable to Store data. pls try again.' + errormessage.responseText);
                });

            }
        });
    }

    $scope.UpdateDocEntry = function (curData, ind) {
        Swal.fire({
            title: 'Are You Sure To Update DocEntry Of Selected Voucher  ?',
            showCancelButton: true,
            confirmButtonText: "Update Voucher",
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var proc = "usp_H_UpdateManualDocEntry";

                var para = {
                    procName: proc,
                    paraColl: {
                        VoucherType: $scope.dayBook.VoucherType,
                        TranId: curData.TranId,                        
                        DocEntryId: curData.Api_Id
                    }
                };


                $http({
                    method: "post",
                    url: base_url + "Global/RunCustomProc",
                    data: JSON.stringify(para),
                    dataType: "json"
                }).then(function (res) {

                    $scope.loadingstatus = 'done';
                    hidePleaseWait();
                    Swal.fire(res.data.ResponseMSG);

                }, function (errormessage) {

                    $scope.loadingstatus = 'stop';

                    alert('Unable to Store data. pls try again.' + errormessage.responseText);
                });

            }
        });
    }

    $scope.MakeSalesInvoice = function (curData,ind) {

       
        Swal.fire({
            title: 'Are You Sure To Update Selected Voucher  ?',
            showCancelButton: true,
            confirmButtonText: "Update Voucher",
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var proc = "";

                angular.forEach(curData.ItemDetailsColl, function (itemDet) {

                    if ($scope.dayBook.VoucherType == 12)
                        proc = proc + " update top(1) tbl_ItemDetailsDeliveryNote set Batch='" + itemDet.U_TRPLEN + "',EngineNo='" + itemDet.Batch + "' where ItemAllocationId=" + itemDet.ItemAllocationId + " ; ";
                    if ($scope.dayBook.VoucherType == 14)
                        proc = proc + " update top(1) tbl_ItemDetailsSalesInvoice set Batch='" + itemDet.U_TRPLEN + "',EngineNo='" + itemDet.Batch + "' where ItemAllocationId=" + itemDet.ItemAllocationId + " ; ";
                    if ($scope.dayBook.VoucherType == 16)
                        proc = proc + " update top(1) tbl_ItemDetailsSalesReturn set Batch='" + itemDet.U_TRPLEN + "',EngineNo='" + itemDet.Batch + "' where ItemAllocationId=" + itemDet.ItemAllocationId + " ; ";

                });

                var para = {
                    procName: proc,
                    paraColl: {}
                };


                $http({
                    method: "post",
                    url: base_url + "Global/RunCustomProc",
                    data: JSON.stringify(para),
                    dataType: "json"
                }).then(function (res) {

                    $scope.loadingstatus = 'done';
                    hidePleaseWait();
                    Swal.fire(res.data.ResponseMSG);

                }, function (errormessage) {

                    $scope.loadingstatus = 'stop';

                    alert('Unable to Store data. pls try again.' + errormessage.responseText);
                });

            }
        });

    }

    $scope.GetDataForInvoice = function (curData) {

        var vRate = $scope.SelectedVoucher.VatRate;

        var vDate = $filter('date')(new Date(), 'yyyy-MM-dd');        
        var eDate = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.VoucherTypeColl.length > 1) {
            var findV = mx($scope.VoucherTypeColl).firstOrDefault(p1 => p1.BDId == curData.BranchId);
            if (findV) {
                $scope.SelectedVoucher.VoucherId = findV.VoucherId;
                
            } else {
                Swal.fire('SalesInvoice Voucher Not Found');
                return;
            }
            
        }

        var tmpSales = {
            TranId: 0,
            VoucherId: $scope.SelectedVoucher.VoucherId,
            CostClassId: $scope.SelectedVoucher.CostClassId,
            AutoVoucherNo: 0,            
            Narration: curData.Narration,
            VoucherDate: vDate,
            RefNo: curData.OrderNo,
            AutoManualNo: $scope.beData.AutoManualNo,
            PartyLedgerId: curData.PartyLedgerId,
            SalesLedgerId: 0,
            TotalAmount: 0,
            AgentId: (curData.AgentId ? curData.AgentId : 0),
            PartyCostCenter:   0,
            TranCostCenter:   0,
            EntryDate: eDate,
            BranchId: 0,
            IsAbbInvoice: false,
            ItemAllocationColl: [], 
            AditionalCostColl: [],
            SalesInvoiceDetail: {
                Buyes : curData.PartyName,
                Address: curData.Address,
                SalesTaxNo :'',
                PhoneNo :''
            },
            GodownId: 0,
            Attributes: '',
            PaymentTermColl: [],            
        };

          
        angular.forEach(curData.ItemDetailsColl, function (itemDet)
        {
            if (itemDet.ProductId && itemDet.ProductId > 0 && itemDet.PendingOrderQty > 0)
            {
                var itemAllocation = {
                    UDFKeyVal: '',
                    Attributes: '',
                    ProductId: itemDet.ProductId,
                    ActualQty: itemDet.PendingOrderQty,
                    BilledQty: itemDet.PendingOrderQty,
                    UnitId:  itemDet.UnitId,
                    Rate: itemDet.Rate,
                    Amount: itemDet.Amount,                   
                    DiscountAmt: 0,
                    DiscountPer: 0,
                    SchameAmt: 0,
                    SchamePer: 0,
                    ALUnitId1:  0,
                    ALUnitId2:  0,
                    ALUnitId3:  0,
                    ALValue1:  0,
                    ALValue2:  0,
                    ALValue3:  0,
                    Narration: '',
                    DeliveryNoteItemAllocationId: 0,
                    OrderItemAllocationId: itemDet.ItemAllocationId,
                    DispatchSectionItemAllocationId: 0,
                    ReceivedNoteItemAllocationId:  0,
                    QuotationItemAllocationId:  0,
                    BundleId: 0,
                    BundleQty: 0,
                    Description: '',
                    LedgerId:  0,
                    ItemDetailsColl: [],
                    GodownId: 0,
                    VatRate: 0,
                    VatAmount: 0,
                    VatAbleAmt: 0,
                    ExDutyRate: 0,
                    ExDutyAmount: 0,
                    Description: '',                     
                    RefQty: (itemDet.PendingOrderQty > 0 ? itemDet.PendingOrderQty : 0),
                };            
                tmpSales.ItemAllocationColl.push(itemAllocation);
            }
         
        });

        curData.AditionalChargeColl.forEach(function (adc) {
            tmpSales.AditionalCostColl.push({
                LedgerId: adc.LedgerId,
                AccessableValue: (adc.AccessableValue ? adc.AccessableValue : 0),
                Rate: (adc.Rate ? adc.Rate : 0),
                Amount: (adc.Amount ? adc.Amount : 0),
            });
        })
       
         

        return tmpSales;


    };



    $scope.SelectedVoucher = null;
    $scope.CancelModal = function (obj,ind) {

        $scope.SelectedVoucher.Ind = ind;
        $scope.SelectedVoucher = obj;

        $('#modal-cancel').modal('show');

    }
    $scope.CancelVoucher = function () {
        $('#modal-cancel').modal('hide');

        var obj = $scope.SelectedVoucher;

        Swal.fire({
            title: 'Do you want to cancel the selected Party(' + obj.PartyName + ') :- ' + obj.OrderNo + ' ? ',
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
                    VoucherType: 13,
                    CostClassId: obj.CostClassId,
                    IsCancel: true,                    
                    CancelRemarks: obj.CancelRemarks,
                    AutoManualNo:obj.OrderNo
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
                        $scope.PendingVoucherColl.splice($scope.SelectedVoucher.Ind, 1);
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    };
	
	
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
});
