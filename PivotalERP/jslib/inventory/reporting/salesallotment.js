"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller('rptSalesAllotmentCtrl', function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
   
   
     var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();

    $scope.DataColl = [];
    $scope.DateFrom = new Date();
    $scope.DateTo = new Date();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'allotment.csv',
            sheetName: 'allotment'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    $scope.paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null,
        SearchCol: '',
        SearchVal:''
    };
    LoadData();

    function LoadData()
    {
        $('.select2').select2()
       getterAndSetter();
        getterAndSetterLedgerVoucher();

        $scope.AllotmentSearchOptions = [{ text: 'CustomerName', value: 'SA.CustomerName' }, { text: 'Branch', value: 'SA.LedgerGroup' }, { text: 'MobileNo', value: 'SA.MobileNo1' }, { text: 'PanVat', value: 'SA.PanVatNo' }, { text: 'Model', value: 'SA.Model' }, { text: 'EngineNo', value: 'SA.EngineNo' }, { text: 'ChassisNo', value: 'SA.ChassisNo' }, { text: 'RegdNo', value: 'SA.RegdNo' }, { text: 'F-Year', value: 'SA.CostClass' }, { text: 'Salesman', value: 'SA.SalesMan' }, { text: 'Financemode', value: 'SA.FinanceMode' }];
        $scope.paginationOptions.SearchCol = 'SA.CustomerName';


        $scope.AllotmentStatusList = ['BLACK LISTING DONE', 'BLACK LISTING IN PROCESS', 'BLPC', 'BLPC-AR', 'CHEQUE CASE CLOSED',
            'CHEQUE CASE PROCESS', 'CQ-BLACK LISTED & CASE PROCESS', 'CQ-BLACK LISTING & CASE REGISTERERED', 'CQ-CASE REGISTERED', 'CQ-CASE REGISTERED-CLOSED',
            'CQ-NOT AVAILABLE', 'LEGAL-CASE PROCESS'];

    }

    function getterAndSetter() {

        var columnDefs = [

            { field: "CostClass", displayName: "F-Year", width: 100, headerCellClass: 'headerAligment', enableHiding: false, pinned: 'left' },
            {
                field: "CustomerName", displayName: "Customer", width: 320, headerCellClass: 'headerAligment', enableHiding: false, pinned: 'left',
                cellRenderer:
                    function (params) {
                        return '<div> <a href="" class="p-1" title="Show Interest Details" ng-click="ShowPartyCommentDetails(this.data)">' +
                            ' <i class="fas fa-info-circle" aria-hidden="true"></i></a>'+params.data.CustomerName+'</div>';
                    }
                    
            },
            {
                name: "AllotmentStatus", displayName: "Legal Status", width: 320, headerCellClass: 'headerAligment', enableHiding: false, pinned: 'left',
                cellRenderer:
                    function (params) {
                        return '<div> <a href="" class="p-1" title="Show Interest Details" ng-click="ShowLegalStatus(this.data)">' +
                            ' <i class="fas fa-info-circle" aria-hidden="true"></i></a>' + (params.data.AllotmentStatus ? params.data.AllotmentStatus : '') + '</div>';
                    },             
            },
            { field: "PartyAlias", displayName: "Alias", width: 140, headerCellClass: 'headerAligment', enableHiding: false },
            { field: "PanVatNo", displayName: "Pan/Vat", width: 140, headerCellClass: 'headerAligment' },
            { field: "MobileNo", displayName: "Contact No.", width: 140, headerCellClass: 'headerAligment', enableHiding: false },
            { field: "Address", displayName: "Address", width: 140, headerCellClass: 'headerAligment' },

            { field: "Model", displayName: "Model", width: 170, headerCellClass: 'headerAligment' },
            {
                field: "Rate", displayName: "M.R.P.", width: 120, cellFilter: 'number', cellClass: 'numericAlignment', headerCellClass: 'headerAligment', valueFormatter: function (params) { return Numberformat(params.value); },
                filter: "agNumberColumnFilter",
            },
            {
                field: "DiscountAmt", displayName: "Discount", width: 120, cellFilter: 'number', cellClass: 'numericAlignment', headerCellClass: 'headerAligment', valueFormatter: function (params) { return Numberformat(params.value); },
                filter: "agNumberColumnFilter",
            },
            {
                field: "Amount", displayName: "Net Price", width: 120, cellFilter: 'number', cellClass: 'numericAlignment', headerCellClass: 'headerAligment', valueFormatter: function (params) { return Numberformat(params.value); },
                filter: "agNumberColumnFilter",
            },
            {
                field: "DPAmt", displayName: "D.P.Amt.", width: 120, cellFilter: 'number', cellClass: 'dateAlignment', headerCellClass: 'headerAligment', valueFormatter: function (params) { return Numberformat(params.value); },
            },
            {
                field: "DP", displayName: "DP %", width: 120, cellFilter: 'number', cellClass: 'dateAlignment', headerCellClass: 'headerAligment', valueFormatter: function (params) { return Numberformat(params.value); },
            },
            {
                field: "BD_TotalAmount", displayName: "Bank DO Amt.", width: 120, cellFilter: 'number', cellClass: 'numericAlignment', headerCellClass: 'headerAligment', valueFormatter: function (params) { return Numberformat(params.value); },
                filter: "agNumberColumnFilter",
            },
            {
                field: "DOPer", displayName: "D.O. %", width: 90, cellFilter: 'number', cellClass: 'dateAlignment', headerCellClass: 'headerAligment', valueFormatter: function (params) { return Numberformat(params.value); },
            },
            {
                field: "DODate", displayName: "DO Date", width: 140, headerCellClass: 'headerAligment',
                cellTemplate: '<div>{{row.entity.DODate |dateFormat}}</div>',
            },
            {
                field: "DORefNo", displayName: "DO Ref. No.", width: 140, headerCellClass: 'headerAligment',
                cellRenderer:
                    function (params) {

                        
                        return '<div> <a href="" class="p-1" title="Print Bank DO" ng-click="PrintVoucher(this.data.BankDOTranId,this.data.BankDOVoucherId,3)">' +
                            '<i class="fas fa-print text-info" aria-hidden="true"></i>' + (params.data.DORefNo ? params.data.DORefNo : '')+'</a>' +
                            '<a href="" class="p-1" title="Document" ng-click="ShowDODocument(this.data)">' +
                            '<i class="fas fa-file text-info" aria-hidden="true"></i></a></div> ';

                        //return '<div> <a href="" class="p-1" title="Show Interest Details" ng-click="ShowPartyCommentDetails(this.data)">' +
                        //    ' <i class="fas fa-info-circle" aria-hidden="true"></i></a>' + params.data.CustomerName + '</div>';
                    },
                

            },
            {
                field: "InterestRate", displayName: "Int.Rate", width: 120, cellFilter: 'number', cellClass: 'dateAlignment', headerCellClass: 'headerAligment'
            },
            {
                field: "InterestAmt", displayName: "Accrued Int.", width: 140, cellFilter: 'number', cellClass: 'numericAlignment', headerCellClass: 'headerAligment', valueFormatter: function (params) { return Numberformat(params.value); },
                 
                filter: "agNumberColumnFilter",

                cellRenderer:
                    function (params) {

                        
                        return '<div> <a href="" class="p-1" title="Show Interest Details" ng-click="ShowPartyTranDetails(this.data)">' +
                            ' <i class="fas fa-info-circle" aria-hidden="true"></i></a>' + Numberformat(params.data.InterestAmt) + '</div>';

                        //return '<div> <a href="" class="p-1" title="Show Interest Details" ng-click="ShowPartyCommentDetails(this.data)">' +
                        //    ' <i class="fas fa-info-circle" aria-hidden="true"></i></a>' + params.data.CustomerName + '</div>';
                    },

                 
            },
            {
                field: "DrInterest", displayName: "Dr.Interest", width: 120, cellFilter: 'number', enableHiding: false, cellClass: 'numericAlignment', headerCellClass: 'headerAligment', valueFormatter: function (params) { return Numberformat(params.value); },
                filter: "agNumberColumnFilter",
            },
            { field: "IntCutOffDate", displayName: "Int.CutOff Date", width: 140, headerCellClass: 'headerAligment' },
            {
                field: "NetClosing", displayName: "Net Closing", width: 160, cellFilter: 'number', enableHiding: false, cellClass: 'numericAlignment', headerCellClass: 'headerAligment', valueFormatter: function (params) { return Numberformat(params.value); },
                filter: "agNumberColumnFilter",
            },
            {
                field: "NetDuesPer", displayName: "Net Dues %", width: 120, cellFilter: 'number', enableHiding: false, cellClass: 'numericAlignment', headerCellClass: 'headerAligment', valueFormatter: function (params) { return Numberformat(params.value); },
            },
            {
                field: "DrAmount", displayName: "Ledger Dr.", width: 120, cellFilter: 'number', enableHiding: false, cellClass: 'numericAlignment', headerCellClass: 'headerAligment', valueFormatter: function (params) { return Numberformat(params.value); },
                filter: "agNumberColumnFilter",
            },
            {
                field: "CrAmount", displayName: "Ledger Cr.", width: 120, cellFilter: 'number', enableHiding: false, cellClass: 'numericAlignment', headerCellClass: 'headerAligment', valueFormatter: function (params) { return Numberformat(params.value); },
                filter: "agNumberColumnFilter",
            },
            {
                field: "CreditDays", displayName: "Credit Days", width: 120, cellFilter: 'number', cellClass: 'dateAlignment', headerCellClass: 'headerAligment'
            },
            { field: "LedgerGroup", displayName: "Branch", width: 140, headerCellClass: 'headerAligment', cellClass: 'textAlignment' },
            {
                field: "VoucherDate", displayName: "Sales Date", width: 140, headerCellClass: 'headerAligment',
                cellTemplate: '<div>{{row.entity.VoucherDate |dateFormat}}</div>',
            },
            { field: "AllotmentDateBS", displayName: "Sales Miti", width: 140, headerCellClass: 'headerAligment' },
            {
                field: "MaturityDate", displayName: "Maturity Date", width: 140, headerCellClass: 'headerAligment',
                cellTemplate: '<div>{{row.entity.MaturityDate |dateFormat}}</div>',
            },
            {
                field: "BalanceCrDays", displayName: "Over Due Days", width: 140, headerCellClass: 'headerAligment'
            },
            { field: "EngineNo", displayName: "Engine No.", width: 140, headerCellClass: 'headerAligment' },
            { field: "ChassisNo", displayName: "Chassis No.", width: 140, headerCellClass: 'headerAligment' },
            { field: "RegdNo", displayName: "Regd. No.", width: 140, headerCellClass: 'headerAligment' },
            { field: "FinanceMode", displayName: "Finance Mode", width: 140, headerCellClass: 'headerAligment' },
            {
                field: "DOBankName", displayName: "D.O Issued By", width: 140, headerCellClass: 'headerAligment'
            },
            {
                field: "DOBankBranch", displayName: "D.O Bank Branch", width: 140, headerCellClass: 'headerAligment'
            },
            { field: "FileStatus", displayName: "File Status", width: 120, headerCellClass: 'headerAligment' },
            { field: "FileDate", displayName: "File Date", width: 120, headerCellClass: 'headerAligment' },
            { field: "Salesman", displayName: "Salesman", width: 140, headerCellClass: 'headerAligment' },
            { field: "Scheme", displayName: "Scheme", width: 140, headerCellClass: 'headerAligment' },
            {
                field: "PDrAmount", displayName: "Pnd. Debit", width: 120, cellFilter: 'number', enableHiding: false, cellClass: 'numericAlignment', headerCellClass: 'headerAligment', valueFormatter: function (params) { return Numberformat(params.value); },
                filter: "agNumberColumnFilter",
            },
            {
                field: "PCrAmount", displayName: "Pnd. Credit", width: 120, cellFilter: 'number', enableHiding: false, cellClass: 'numericAlignment', headerCellClass: 'headerAligment', valueFormatter: function (params) { return Numberformat(params.value); },
                filter: "agNumberColumnFilter",
            },

            //{
            //    name: "AllotmentInvoiceAmt", displayName: "Allotment Amt.", width: 120, cellFilter: 'number', cellClass: 'numericAlignment', headerCellClass: 'headerAligment',
            //    cellTemplate: '<div>{{row.entity.AllotmentInvoiceAmt |number:2}}</div>',
            //},                 

            {
                field: "PDCAmount", displayName: "P.D.C. Amt.", width: 120, cellFilter: 'number', cellClass: 'numericAlignment', headerCellClass: 'headerAligment', valueFormatter: function (params) { return Numberformat(params.value); },
                filter: "agNumberColumnFilter",
            },
            {
                field: "PDCStatus", displayName: "P.D.C-Status", width: 140, headerCellClass: 'headerAligment'
            },
            {
                field: "Closing", displayName: "L.Closing", width: 120, cellFilter: 'number', cellClass: 'numericAlignment', headerCellClass: 'headerAligment', valueFormatter: function (params) { return Numberformat(params.value); },

                cellRenderer:
                    function (params) {
                        return '<div> <a href="" class="p-1" title="Show Interest Details" ng-click="GetLedgerVoucher(this.data)">' +
                            ' <i class="fas fa-info-circle" aria-hidden="true"></i></a>' + Numberformat(params.data.Closing) + '</div>';
                    },

            },



            /*{ name: "Branch", displayName: "Branch", width: 140, headerCellClass: 'headerAligment' },*/
            {
                field: "AllotmentNo", displayName: "Allotment No.", width: 180, headerCellClass: 'headerAligment',
                cellRenderer:
                    function (params) {
                        return '<div> <a href="" class="p-1" title="Print Sales Allotment" ng-click="PrintVoucher(this.data.AllotmentTranId,this.data.AllotmentVoucherId,1)">' +
                            '<i class="fas fa-print text-info" aria-hidden="true"></i>' +
                            '</a>'+params.data.AllotmentNo+'</div>';
                    },

            },

            { field: "ProductName", displayName: "Product Name", width: 140, headerCellClass: 'headerAligment' },

            {
                field: "InsuranceDate", displayName: "Insurance Date", width: 140, headerCellClass: 'headerAligment',
                cellTemplate: '<div>{{row.entity.InsuranceDate |dateFormat}}</div>',

            },
            { field: "InsuranceName", displayName: "Insurance Name", width: 140, headerCellClass: 'headerAligment' },
            {
                field: "InsuranceExpiredDate", displayName: "Insurance Expired Date", width: 170, headerCellClass: 'headerAligment',
                cellTemplate: '<div>{{row.entity.InsuranceExpiredDate |dateFormat}}</div>',
            },
            { field: "InsuranceBy", displayName: "Insurance By", width: 140, headerCellClass: 'headerAligment' },
            {
                field: "BankName", field: 'BankName', displayName: "Qtn. Issue Bank Name", width: 340, headerCellClass: 'headerAligment',
                cellRenderer:
                    function (params) {
                        return '<div> <a href="" class="p-1" title="Print Bank Quotation" ng-click="PrintVoucher(this.data.BankQuotationTranId,this.data.BankQuotationVoucherId,2)">' +
                            '<i class="fas fa-print text-info" aria-hidden="true"></i>' +
                            '</a>' + (params.data.BankName ? params.data.BankName : '') + '</div>';
                    },                 
            },
            {
                field: "QuotationDate", displayName: "Qtn. Date", width: 140, headerCellClass: 'headerAligment'
            },
            {
                field: "BankAllotmentDate", displayName: "Bank Allotment Date", width: 140, headerCellClass: 'headerAligment',
                cellRenderer:
                    function (params) {
                        return '<div> <a href="" class="p-1" title="Print Bank Allotment" ng-click="PrintVoucher(this.data.BankAllotmentTranId,this.data.BankAllotmentVoucherId,4)">' +
                            '<i class="fas fa-print text-info" aria-hidden="true"></i>' +
                            '</a>' + (params.data.BankAllotmentDate ? params.data.BankAllotmentDate : '') + '</div>';
                    },
                 
            },
            {
                field: "NamsariDate_AD", displayName: "Namsari Date", width: 140, headerCellClass: 'headerAligment',
                cellTemplate: '<div>{{row.entity.NamsariDate_AD |dateFormat}}</div>',
            },
            { field: "NamsariDate_BS", displayName: "Namsari Miti", width: 140, headerCellClass: 'headerAligment' },
            {
                field: "NamsariVoucherNo", displayName: "Namsari Voucher No.", width: 140, headerCellClass: 'headerAligment',
                cellRenderer:
                    function (params) {
                        return '<div> <a href="" class="p-1" title="Print Namsari" ng-click="PrintVoucher(this.data.NamsariTranId,this.data.NamsariVoucherId,5)">' +
                            '<i class="fas fa-print text-info" aria-hidden="true"></i>' +
                            '</a>' + (params.data.NamsariVoucherNo ? params.data.NamsariVoucherNo :'') + '</div>';
                    },
 
            },
            {
                field: "SalesDate", displayName: "Invoice Date", width: 140, headerCellClass: 'headerAligment',
                cellTemplate: '<div>{{row.entity.SalesDate |dateFormat}}</div>',
            },
            { field: "InvoiceNo", displayName: "Invoice No.", width: 140, headerCellClass: 'headerAligment' },
            {
                field: "InvoiceAmount", displayName: "Invoice Amount", width: 120, cellFilter: 'number', cellClass: 'numericAlignment', headerCellClass: 'headerAligment', valueFormatter: function (params) { return Numberformat(params.value); },
                filter: "agNumberColumnFilter",
            },
            {
                field: "PaymentDate", displayName: "Payment Req. Date", width: 140, headerCellClass: 'headerAligment',
                cellTemplate: '<div>{{row.entity.PaymentDate |dateFormat}}</div>',
            },
            {
                field: "PaymentAmount", displayName: "Payment Req. Amount", width: 120, cellFilter: 'number', cellClass: 'numericAlignment', headerCellClass: 'headerAligment', valueFormatter: function (params) { return Numberformat(params.value); },
                filter: "agNumberColumnFilter",
            },
            {
                field: "PaymentVoucherNo", displayName: "Payment V.No.", width: 160, headerCellClass: 'headerAligment',
                cellRenderer:
                    function (params) {
                        return '<div> <a href="" class="p-1" title="Print Bank Payment Letter" ng-click="PrintVoucher(this.data.BankPaymentTranId,this.data.BankPaymentVoucherId,6)">' +
                            '<i class="fas fa-print text-info" aria-hidden="true"></i>' +
                            '</a>' + (params.data.PaymentVoucherNo ? params.data.PaymentVoucherNo : '') + '</div>';
                    },                 
            },
            {
                field: "HasDocument", displayName: "DOC", width: 90, headerCellClass: 'headerAligment', enableHiding: false,
                cellRenderer:
                    function (params) {
                        return '<div> <a href="" class="p-1" title="Show Interest Details" ng-click="ShowPartyDocDetails(this.data)">' +
                            '<i class="fas fa-file text-info" aria-hidden="true"></i>' +
                            '</a>' + params.data.NoOfFiles + '</div>';
                    },
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
         //   pagination: true,
            enableSorting: true,
            multiSortKey: 'ctrl',
            enableColResize: true,
            overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
            overlayNoRowsTemplate: "No Records found",
            rowSelection: 'multiple',
            columnDefs: columnDefs,
            rowData: null,
            filter: true,         
            enableFilter: true,
           // paginationPageSize: $scope.paginationOptions.pageSize,
          //  cacheBlockSize: $scope.paginationOptions.pageSize
 
        }; 

 $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
        

    };

    $scope.GetData = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var para = {
            DateFrom: null,
            DateTo: null,
            PageNumber: $scope.paginationOptions.pageNumber,
            //RowsOfPage: $scope.paginationOptions.pageSize,
            RowsOfPage:0,
            SearchCol: $scope.paginationOptions.SearchCol,
            SearchVal: $scope.paginationOptions.SearchVal
        };

        $http({
            method: 'POST',
            url: base_url + "Inventory/Reporting/GetSalesAllotmentDetails",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                //$scope.DataColl = mx(res.data.Data);
                $scope.gridOptions.api.setRowData(res.data.Data);              

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        }); 
    }
    $scope.CurParty = {}
    $scope.InterestColl = [];
    $scope.ShowPartyTranDetails = function (allot) {
        $scope.CurParty = allot;
        $scope.InterestColl = [];
        $scope.loadingstatus = 'running';
        showPleaseWait();

        var para = {
            ledgerId: allot.LedgerId,
            interestRate: allot.InterestRate,
            creditDays: allot.CreditDays,
            IntCutOffDate: ($scope.CurParty.IntCutOffDate ? $filter('date')(new Date($scope.CurParty.IntCutOffDate), 'yyyy-MM-dd') : null)
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Reporting/GetAllotmentInterestDetails",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.InterestColl = res.data.Data;

                var query = mx($scope.InterestColl);
                $scope.CurParty.Interest = query.sum(p1 => p1.Interest);
                $scope.CurParty.DrAmount = query.sum(p1 => p1.DrAmount);
                $scope.CurParty.CrAmount = query.sum(p1 => p1.CrAmount);
                $scope.CurParty.ExtraDays = query.sum(p1 => p1.ExtraDays);
                $scope.CurParty.PrintOn= new Date();
                $('#partyAccRightBtn').modal('show');

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });


    }
    $scope.CalPartyTranDetails = function () {
        
        $scope.InterestColl = [];
       

        var para = {
            ledgerId: $scope.CurParty.LedgerId,
            interestRate: $scope.CurParty.InterestRate,
            creditDays: $scope.CurParty.CreditDays
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Reporting/GetAllotmentInterestDetails",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            
            if (res.data.IsSuccess && res.data.Data) {
                $scope.InterestColl = res.data.Data;
                var query = mx($scope.InterestColl);
                $scope.CurParty.Interest = query.sum(p1 => p1.Interest);
                $scope.CurParty.DrAmount = query.sum(p1 => p1.DrAmount);
                $scope.CurParty.CrAmount = query.sum(p1 => p1.CrAmount);
                $scope.CurParty.ExtraDays = query.sum(p1 => p1.ExtraDays);
                
             
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });


    }

    $scope.CalculateAllotment = function () {
        
        $scope.loadingstatus = 'running';
        showPleaseWait();         
        $http({
            method: 'POST',
            url: base_url + "Inventory/Reporting/CalculateAllotment",
            dataType: "json",
            //data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        }); 
    }

    $scope.UpdateIntCutOffDate = function () {
          
        var para = {
            ledgerId: $scope.CurParty.LedgerId,
            intCutOffDate: $filter('date')(new Date($scope.CurParty.IntCutOffDate), 'yyyy-MM-dd')
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Reporting/UpdateIntCutOffDate",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });
         
    }

    $scope.AddLedgerFeedback = function () {

        var para = {
            ledgerId: $scope.CurParty.LedgerId,
            remarks:$scope.CurParty.NewRemarks
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Reporting/UpdateLedgerFeedback",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res)
        {
            if (res.data.IsSuccess == false)
                Swal.fire(res.data.ResponseMSG);
            else {

                $scope.CurParty.NewRemarks = '';
                $timeout(function () {

                    var para1 = {
                        ledgerId: $scope.CurParty.LedgerId
                    };

                    $http({
                        method: 'POST',
                        url: base_url + "Inventory/Reporting/GetLedgerFeedback",
                        dataType: "json",
                        data: JSON.stringify(para1)
                    }).then(function (res1) {                        
                        if (res1.data.IsSuccess && res1.data.Data) {
                            $scope.FeedbackColl = res1.data.Data; 
                        } 
                    }, function (reason) {
                        alert('Failed' + reason);
                    });
                });
            }

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.FeedbackColl = [];
    $scope.ShowPartyCommentDetails = function (allot) {
        $scope.CurParty = allot;
        $scope.FeedbackColl = [];
        $scope.loadingstatus = 'running';
        showPleaseWait();

        var para = {
            ledgerId: allot.LedgerId,             
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Reporting/GetLedgerFeedback",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data)
            {
                $scope.FeedbackColl = res.data.Data;
                $('#partyCommentDialog').modal('show');

            } else
                Swal.fire(res.data.ResponseMSG);
            
        }, function (reason) {
            alert('Failed' + reason);
        });


    }

    $scope.DocumentColl = [];
    $scope.DocumentTypeColl = [];
    $scope.ShowPartyDocDetails = function (allot) {
        $scope.CurParty = allot;
        $scope.DocumentColl = [];
        $scope.DocumentTypeColl = [];
        $scope.loadingstatus = 'running';
        showPleaseWait();

        var para = {
            ledgerId: allot.LedgerId,
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Reporting/GetLedgerDocumentAttachment",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DocumentColl = res.data.Data;
                $scope.DocumentTypeColl = res.data.Data;
                $('#partyDocAttachmentDialog').modal('show');

            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });


    }
    $scope.AddPartyDoc = function () {

        $scope.loadingstatus = "running";
        showPleaseWait();

        var filesColl = $scope.CurParty.AttachFiles;
        var beData = {
            Name: '',
            Extension: '',
            Description: '',
            TranId: 0,
            DocumentTypeId: $scope.CurParty.DocumentTypeId,
            LedgerId:$scope.CurParty.LedgerId
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Reporting/UpdateLedgerDocAttachment",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.files && data.files.length>0) {
                    formData.append("file0", data.files[0]);
                }

                return formData;
            },
            data: { jsonData: beData, files: filesColl }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);

            if (res.data.IsSuccess == true) {

                $('input[type=file]').val('');
                $scope.CurParty.AttachFiles = [];

                var para1 = {
                    ledgerId: $scope.CurParty.LedgerId,
                };
                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Reporting/GetLedgerDocumentAttachment",
                    dataType: "json",
                    data: JSON.stringify(para1)
                }).then(function (res1) {
                    if (res1.data.IsSuccess && res1.data.Data) {
                        $scope.DocumentColl = res1.data.Data;
                    }
                }, function (reason) {
                    alert('Failed' + reason);
                });
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });


    }
    $scope.DelPartyDoc = function (docDet) {

        Swal.fire({
            title: 'Do you want to delete the selected data?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              
                $scope.loadingstatus = 'running';
                showPleaseWait();

                var para = {
                    tranId: docDet.TranId,
                };
                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Reporting/DelLedgerDocAttachment",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    $scope.loadingstatus = 'stop';
                    hidePleaseWait();
                    if (res.data.IsSuccess && res.data.Data) {

                        var para1 = {
                            ledgerId: $scope.CurParty.LedgerId,
                        };
                        $http({
                            method: 'POST',
                            url: base_url + "Inventory/Reporting/GetLedgerDocumentAttachment",
                            dataType: "json",
                            data: JSON.stringify(para1)
                        }).then(function (res1) {
                            if (res1.data.IsSuccess && res1.data.Data) {
                                $scope.DocumentColl = res1.data.Data;
                            }
                        }, function (reason) {
                            alert('Failed' + reason);
                        });

                    } else
                        Swal.fire(res.data.ResponseMSG);

                }, function (reason) {
                    alert('Failed' + reason);
                });

            }
        });
         

    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    function getterAndSetterLedgerVoucher() {
        $scope.columnDefsLV = [
            {
                headerName: "Date", width: 145, cellRenderer: 'agGroupCellRenderer',
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.IsParent) {
                        return beData.VoucherDate;
                    }
                    return null;
                },
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                filter: 'agDateColumnFilter', pinned: 'left'
            },
            {
                headerName: "Miti", width: 110, valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.IsParent) {
                        return beData.NVoucherDate;
                    } else {
                        return "";
                    }
                    //return DateFormatBS(params.data.NY, params.data.NM, params.data.ND);
                },
                filter: 'agTextColumnFilter', pinned: 'left'
            },
            {
                headerName: "Particular's", width: 180,
                valueGetter: function (params) {
                    var beData = params.data;

                    if (beData.IsParent) {
                        return beData.Particulars;
                    }
                    else {
                        if (beData.RowType) {

                            if (beData.RowType == 'LedgerAllocation') {
                                return "  " + beData.LedgerName;
                            } else if (beData.RowType == 'ItemAllocation') {
                                return "  => " + beData.ProductName;
                            } else if (beData.RowType == 'BillDetails') {
                                return "  " + "(" + beData.VoucherDetails + " :- Rs." + beData.Amount + " / " + beData.Remarks + " ) ";;
                            }
                            else
                                return params.data;

                        } else
                            return params.data;
                    }

                },
                filter: 'agTextColumnFilter', pinned: 'left'
            },
            { headerName: "VoucherType", width: 130, field: "VoucherName", filter: 'agTextColumnFilter', },
            { headerName: "Voucher No.", width: 130, field: "AutoManualNo", filter: 'agTextColumnFilter', },
            { headerName: "Ref.No.", width: 120, field: "RefNo", filter: 'agTextColumnFilter', },



            {
                headerName: "Debit", width: 150, filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;

                    if (beData.IsParent) {
                        return beData.DebitAmt;
                    }
                    else
                        return 0;

                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Credit", width: 150, filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.IsParent) {
                        return beData.CreditAmt;
                    }
                    else
                        return 0;

                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Current Closing", width: 150, filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.IsParent) {
                        return beData.CurrentClosing;
                    }
                    return 0;
                },
                valueFormatter: function (params) { return NumberformatAC(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Qty", width: 110, filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.RowType == 'ItemAllocation') {
                        return beData.AQty + ' ' + beData.UnitName;
                    }
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Rate", width: 130, filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.RowType == 'ItemAllocation') {
                        return beData.Rate;
                    } else
                        return '';

                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Amount", width: 140, filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.RowType == 'ItemAllocation') {
                        return beData.Amount;
                    } else
                        return '';
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            { headerName: "CostClass", width: 120, field: "CostClassName" },
            { headerName: "User", width: 120, field: "UserName" },
            { headerName: "Narration", width: 150, field: "Narration" },
            {
                headerName: "Age", width: 110, filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.IsParent == true && beData.VoucherAge) {
                        return beData.VoucherAge;
                    } else
                        return '';
                },
                cellStyle: { 'text-align': 'center' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Dues Amt.", width: 120, filter: "agNumberColumnFilter",
                valueGetter: function (params) {
                    var beData = params.data;
                    if (beData.IsParent == true) {
                        return beData.DuesAmt;
                    } else
                        return '';
                },
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Action", width: 150, cellRenderer:
                    function (params) {

                        var voucherName = params.data.VoucherName;

                        if (voucherName) {

                            if (params.data.VoucherType < 5) {
                                return '<a class="btn btn-default btn-xs" ng-click="PrintVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ')"><i class="fas fa-print text-info"></i></a>';
                            } else {
                                return '<a class="btn btn-default btn-xs" ng-click="PrintVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ')"><i class="fas fa-print text-info"></i></a>';
                            }

                          
                        } else {
                            return '';
                        }
                    }
            }
        ];


        $scope.gridOptionsLV = {
            angularCompileRows: true,
            // a default column definition with properties that get applied to every column
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,

                // set every column width
                width: 90
            },
            columnDefs: $scope.columnDefsLV,
            enableColResize: true,
            rowData: null,
            filter: true,
            enableFilter: true,
            rowSelection: 'multiple',
            suppressHorizontalScroll: true,
            alignedGrids: [],
            getNodeChildDetails: function (beData) {
                var dataColl = [];
                if (beData.IsParent == true) {

                    if (beData.LedgerNarration && beData.LedgerNarration.length > 0)
                        dataColl.push("(" + beData.LedgerNarration + ")");

                    if (beData.CostCenterColl && beData.CostCenterColl.length > 0) {
                        angular.forEach(beData.CostCenterColl, function (data) {
                            data.RowType = 'LedgerAllocation';
                            dataColl.push(data);
                        });
                    }

                    if (beData.ChieldColl && beData.ChieldColl.length > 0) {
                        angular.forEach(beData.ChieldColl, function (data) {
                            data.RowType = 'LedgerAllocation';
                            dataColl.push(data);
                        });
                    }

                    if (beData.InventoryDetailsColl && beData.InventoryDetailsColl.length > 0) {
                        angular.forEach(beData.InventoryDetailsColl, function (data) {
                            data.RowType = 'ItemAllocation';
                            dataColl.push(data);
                        });
                    }

                    if (beData.AccountBillDetailsColl && beData.AccountBillDetailsColl.length > 0) {
                        angular.forEach(beData.AccountBillDetailsColl, function (data) {
                            data.RowType = 'BillDetails';
                            dataColl.push(data);
                        });
                    }

                    if (beData.Narration && beData.Narration.length > 0)
                        dataColl.push("(" + beData.Narration + ")");
                }

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
                IsParent: true,
                DateAD: '',
                DateBS: '',
                Particulars: 'Opening Balance =>',
                VoucherType: '',
                VoucherNo: '',
                RefNo: '',
                DebitAmt: 0,
                CreditAmt: 0,
                CurrentClosing: 0,
                CostClass: '',
                UserName: ''
            },
            {
                IsParent: true,
                DateAD: '',
                DateBS: '',
                Particulars: 'Current Total =>',
                VoucherType: '',
                VoucherNo: '',
                RefNo: '',
                DebitAmt: 0,
                CreditAmt: 0,
                CurrentClosing: 0,
                CostClass: '',
                UserName: ''
            },
            {
                IsParent: true,
                DateAD: '',
                DateBS: '',
                Particulars: 'Closing Balance =>',
                VoucherType: '',
                VoucherNo: '',
                RefNo: '',
                DebitAmt: 0,
                CreditAmt: 0,
                CurrentClosing: 0,
                CostClass: '',
                UserName: ''
            }
        ];
        $scope.gridOptionsBottom = {
            defaultColDef: {
                resizable: true,
                width: 90
            },
            columnDefs: $scope.columnDefsLV,
            // we are hard coding the data here, it's just for demo purposes
            rowData: $scope.dataForBottomGrid,
            debug: true,
            rowClass: 'bold-row',
            // hide the header on the bottom grid
            headerHeight: 0,
            alignedGrids: []
        };

        $scope.gridOptionsLV.alignedGrids.push($scope.gridOptionsBottom);
        $scope.gridOptionsBottom.alignedGrids.push($scope.gridOptionsLV);

        $scope.gridDivBottom = document.querySelector('#myGridBottom');
        new agGrid.Grid($scope.gridDivBottom, $scope.gridOptionsBottom);

    };
    $scope.GetLedgerVoucher = function (allot) {
        $scope.CurParty = allot;
        if (!$scope.CurParty || !$scope.CurParty.LedgerId)
            return;

        var dateFrom = new Date(($filter('date')(new Date().addDays(-965), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            branchId: null,
            ledgerId: $scope.CurParty.LedgerId
        };

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "post",
            url: base_url + "Account/Reporting/GetLedgerVoucher",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            var openingAmt = 0, drAmt = 0, crAmt = 0, closingAmt = 0;
            openingAmt = res.data.Data.OpeningAmt;
            drAmt = res.data.Data.DrAmt;
            crAmt = res.data.Data.CrAmt;
            closingAmt = res.data.Data.ClosingAmt;

            $scope.CurParty.ODr = (openingAmt > 0 ? openingAmt : 0);
            $scope.CurParty.OCr = (openingAmt < 0 ? Math.abs(openingAmt) : 0);
            $scope.CurParty.TDr = drAmt;
            $scope.CurParty.TCr = crAmt;
            $scope.CurParty.CDr = (closingAmt > 0 ? closingAmt : 0);
            $scope.CurParty.CCr = (closingAmt < 0 ? Math.abs(closingAmt) : 0);

            if (openingAmt > 0)
                $scope.dataForBottomGrid[0].DebitAmt = openingAmt;
            else
                $scope.dataForBottomGrid[0].CreditAmt = Math.abs(openingAmt);

            $scope.dataForBottomGrid[1].DebitAmt = drAmt;
            $scope.dataForBottomGrid[1].CreditAmt = crAmt;

            if (closingAmt > 0)
                $scope.dataForBottomGrid[2].DebitAmt = closingAmt;
            else
                $scope.dataForBottomGrid[2].CreditAmt = Math.abs(closingAmt);

            $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
             
            $scope.gridOptionsLV.api.setRowData(res.data.Data.DataColl);

            $scope.loadingstatus = 'done';
            hidePleaseWait();

            $('#partyLedgerDialog').modal('show');

        }, function (errormessage) {

            $scope.loadingstatus = 'stop';

            alert('Unable to Store data. pls try again.' + errormessage.responseText);
        });

    };

    $scope.onBtExport = function () {
        var params = {
            fileName: 'log.csv',
            sheetName: 'data'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    $scope.PrintVoucher = function (tranId, voucherId,forVoucher)
    {
        var voucherType = 0, entityId = 0;

        if (forVoucher == 1) {
            entityId = entitySalesAllotment;
            voucherType = voucherSalesAllotment;
        }
        else if (forVoucher == 2) {
            entityId = entityBankQuotation;
            voucherType = voucherBankQuotation;
        }
        else if (forVoucher == 3) {
            entityId = entityBankDO;
            voucherType = voucherBankDO;
        }
        else if (forVoucher == 4) {
            entityId = entityBankAllotment;
            voucherType = voucherBankAllotment;
        }
        else if (forVoucher == 5) {
            entityId = entityNamsari;
            voucherType = voucherNamsari;
        }
        else if (forVoucher == 6) {
            entityId = entityBankPayment;
            voucherType = voucherBankPayment;
        }


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

    };

    $scope.ShowDODocument = function (allot) {

        $scope.CurParty = allot;
        $scope.CurDODocumentColl = [];

        if (allot.DODocumentColl && allot.DODocumentColl.length > 0) {
            $scope.CurDODocumentColl = JSON.parse(allot.DODocumentColl);
            $('#doDocAttachmentDialog').modal('show');
        }
       
    };

    $scope.ShowLegalStatus = function (allot) {
        $scope.CurParty = allot;
        $scope.CurParty.AllotmentStatusColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Transaction/getSalesAllotmentStatus?ledgerId=" + $scope.CurParty.LedgerId,
            dataType: "json",
            // data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CurParty.AllotmentStatusColl = res.data.Data;

                $('#partyStatusDialog').modal('show');
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

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
                down_file(base_url + "//" + res.data.Data.ResponseId, "SalesAllotment.xlsx");
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