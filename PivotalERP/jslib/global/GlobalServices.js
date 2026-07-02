app.service('GlobalServices', function ($http, $filter, $timeout) {
    this.getConfirmMSG = function () {
        var confirmMSG = {
            Accept: false,
            Decline: false,
            Delete: false,
            Modify: false,
            Print: false,
            Reset: false
        };


        return confirmMSG;
    }

    this.getFixedProductColumns = function () {
        var dataColl = [
            { id: 1, colName: 'colRegdNo', text: 'RegdNo', show: 'ShowRegdNo' },
            { id: 2, colName: 'colChassisNo', text: 'ChassisNo', show: 'ShowChassisNo' },
            { id: 3, colName: 'colEngineNo', text: 'EngineNo', show: 'ShowEngineNo' },
            { id: 4, colName: 'colModel', text: 'Model', show: 'ShowModel' },
            { id: 5, colName: 'colType', text: 'Type', show: 'ShowType' },
            { id: 6, colName: 'colColor', text: 'Color', show: 'ShowColor' },
            { id: 7, colName: 'colKeyNo', text: 'KeyNo', show: 'ShowKeyNo' },
            { id: 8, colName: 'colCodeNo', text: 'CodeNo', show: 'ShowCodeNo' },
            { id: 8, colName: 'colMFGYear', text: 'MFGYear', show: 'ShowMFGYear' },
        ];
        return dataColl;
    }
    this.getVoucherStatus = function () {
        var dataColl = [
            { id: 1, text: 'Draft' },
            { id: 2, text: 'Approved' },
            { id: 3, text: 'Rejected' },
            { id: 4, text: 'Canceled' },
            { id: 5, text: 'Closed' },
            { id: 6, text: 'Terminated' }
        ];
        return dataColl;
    }
    this.getRateAsPer = function () {
        var dataColl = [
            { id: 1, text: 'Base Unit' },
            { id: 2, text: 'Alt. Unit' }
        ];
        return dataColl;
    }
    this.getPeriodOptions = function () {
        var dataColl = [
            { id: 1, text: 'Period' },
            { id: 2, text: 'MonthWise' }
        ];
        return dataColl;
    }
    this.getDateStyle = function () {

        var dataColl = [
            { id: 1, text: 'A.D.' },
            { id: 2, text: 'B.S.' },
            { id: 3, text: 'B.S. & A.D.' },
            { id: 4, text: 'A.D. & B.S.' },
        ];
        return dataColl;
    };
    this.getUniqueId = function () {
        var uid = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}` + String(Date.now().toString(32) + Math.random().toString(16)).replace(/\./g, '');
        if (uid.length > 50)
            uid = uid.substring(0, 49);

        return uid;
    }
    this.getEmployeeSearchOptions = function () {
        var dataColl = [{ text: 'Name', value: 'E.Name' }, { text: 'Code', value: 'E.EmployeeCode' }];
        return dataColl;
    };
    this.copyTableData = function (id) {
        var tid = '#' + id;
        var excelData = $(tid).tableExport({ type: 'excelcopy' });
        navigator.clipboard.writeText(excelData).then(() => {

        }).catch(err => {
            console.error("Error copying table: ", err);
        });
    }

    this.createElementForMenu = function () {
        const contextMenu = document.createElement('div');
        contextMenu.style.position = 'absolute';
        contextMenu.style.backgroundColor = 'white';
        contextMenu.style.border = '1px solid black';
        contextMenu.style.padding = '5px';
        contextMenu.style.display = 'none';
        contextMenu.style.maxHeight = '200px';
        contextMenu.style.overflowY = 'scroll';
        document.body.appendChild(contextMenu);
        return contextMenu;
    };
    this.onCellContextMenu = function (event, grid, menu) {
        // Prevent the default context menu
        event.event.preventDefault();

        // Get the column definitions
        const columns = grid.columnApi.getAllColumns();

        // Create context menu items for each column
        menu.innerHTML = columns.map(col => `
            <div>
                <label>
                    <input type="checkbox" ${col.isVisible() ? 'checked' : ''} 
                           data-col-id="${col.getColId()}">
                    ${col.colDef.headerName}
                </label>
            </div>
        `).join('');

        // Position the context menu at the mouse pointer
        menu.style.left = `${event.event.clientX}px`;
        menu.style.top = `${event.event.clientY}px`;
        menu.style.display = 'block';

        // Add event listeners to checkboxes
        menu.querySelectorAll('input').forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                const colId = this.getAttribute('data-col-id');
                const visible = this.checked;

                // Show or hide the column
                grid.columnApi.setColumnVisible(colId, visible);
            });
        });
    }
    this.saveRptListState = function (EntityId, grid) {
        const columnState = grid.columnApi.getColumnState();
        var state = JSON.stringify(columnState);

        $http({
            method: 'POST',
            url: base_url + "Global/SaveListState",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("jsonData", data.jsonData);
                formData.append("entityId", EntityId);
                formData.append("isReport", true);

                return formData;
            },
            data: { jsonData: state }
        }).then(function (res) {
            Swal.fire(res.data.ResponseMSG);
        }, function (errormessage) {
            hidePleaseWait();
        });
    }
    this.getListState = function (EntityId, grid, gridButton) {
        $http({
            method: 'GET',
            url: base_url + "Global/GetListState?entityId=" + EntityId + "&isReport=true",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var state = JSON.parse(res.data.Data);
                if (state && state.length > 0) {
                    $timeout(function () {
                        grid.columnApi.setColumnState(state);

                        if (gridButton) {
                            gridButton.columnApi.setColumnState(state);
                        }
                    });
                }
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }

    this.delListStateRpt = function (EntityId) {
        var para = {
            entityId: EntityId,
            isReport: true
        }
        $http({
            method: 'POST',
            url: base_url + "Global/DelListState",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }

    this.getAditionalCostTypes = function () {
        return $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetAditionalCostTypes",
            dataType: "json"
        });
    }

    this.getCountry = function () {
        return $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetAllCountry",
            dataType: "json"
        });
    }

    this.IsValidCredit = function (VoucherId, CostClassId, PartyLedgerId, VoucherDate, TranId, TranAmt) {

        var para = {
            VoucherId: VoucherId,
            CostClassId: CostClassId,
            PartyLedgerId: PartyLedgerId,
            VoucherDate: VoucherDate,
            TranId: TranId,
            TranAmt: TranAmt,
        };
        return $http({
            method: 'POST',
            url: base_url + "Global/IsValidCredit",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                return formData;
            },
            data: { jsonData: para }
        });

    }

    this.getRptTableColColl = function () {
        var dataColl = [
            { name: 'N_C1', text: 'Number Column 1' },
            { name: 'N_C2', text: 'Number Column 2' },
            { name: 'N_C3', text: 'Number Column 3' },
            { name: 'N_C4', text: 'Number Column 4' },

            { name: 'T_C1', text: 'Text Column 1' },
            { name: 'T_C2', text: 'Text Column 2' },
            { name: 'T_C3', text: 'Text Column 3' },
            { name: 'T_C4', text: 'Text Column 4' },

            { name: 'D_C1', text: 'Date Column 1' },
            { name: 'D_C2', text: 'Date Column 2' },
            { name: 'D_C3', text: 'Date Column 3' },
            { name: 'D_C4', text: 'Date Column 4' },

            { name: 'DT_C1', text: 'DateTime Column 1' },
            { name: 'DT_C2', text: 'DateTime Column 2' },
            { name: 'DT_C3', text: 'DateTime Column 3' },
            { name: 'DT_C4', text: 'DateTime Column 4' },

            { name: 'A_C1', text: 'Amount Column 1' },
            { name: 'A_C2', text: 'Amount Column 2' },
            { name: 'A_C3', text: 'Amount Column 3' },
            { name: 'A_C4', text: 'Amount Column 4' },
        ];
        return dataColl;
    };
    this.getRefFieldAs = function () {
        var dataColl = [{ id: 1, value: 'TS.AutoVoucherNO', text: 'Auto Number' },
        { id: 2, value: 'TS.AutoManualNo', text: 'Voucher No.' },
        { id: 3, value: 'TS.[No]', text: 'Ref. No.' },
        { id: 4, value: 'ADS.SalesTaxNo', text: 'Pan/Vat No.' },
        { id: 5, value: 'ADS.PhoneNo', text: 'Phone No.' },
        { id: 6, value: 'ADS.OwnerContactNo', text: 'Owner Contact No' },
        { id: 7, value: 'ADS.DriverContactNo', text: 'Driver Contact No' },
        { id: 8, value: 'ADS.Goods', text: 'Vehicle No.' },
        { id: 9, value: 'ADS.PPNo', text: 'P.P. No.' },
        { id: 10, value: 'ADS.JobCardNo', text: 'JobCard No.' }];
        return dataColl;
    };
    this.getVoucherDataAs = function () {

        var dataColl = [
            { id: 1, text: 'Current Date' },
            { id: 2, text: 'Last Entry Date' }
        ];
        return dataColl;
    };
    this.getUserTypes = function () {

        var dataColl = [
            { id: 1, text: 'SYSTEMUSER' },
            { id: 2, text: 'DEALER' },
            { id: 3, text: 'SALESMAN' },
            { id: 4, text: 'EMPLOYEE' },
            { id: 5, text: 'DOCTOR' },
        ];
        return dataColl;
    };
    this.ShowPrintPreview = function (PrintPreviewAs, newURL) {

        if (PrintPreviewAs == 1) {
            document.body.style.cursor = 'wait';
            document.getElementById("frmRpt").src = '';
            document.getElementById("frmRpt").src = newURL;
            document.body.style.cursor = 'default';
            $('#FrmPrintReport').modal('show');
        }
        else if (PrintPreviewAs == 2) {
            window.open(newURL);
        } else {
            window.open(newURL);
        }
    }
    this.getVoucherTypeId = function (voucherName) {
        switch (voucherName) {
            case "Receipt": return 1;
            case "Payment": return 2;
            case "Journal": return 3;
            case "Contra": return 4;
            case "PurchaseQuotation": return 5;
            case "ReceiptNote": return 6;
            case "PurchaseOrder": return 7;
            case "PurchaseInvoice": return 8;
            case "PurchaseAdditionalInvoice": return 9;
            case "PurchaseReturn": return 10;
            case "PurchaseDebitNote": return 56;
            case "PurchaseCreditNote": return 57;
            case "SalesQuotation": return 11;
            case "DeliveryNote": return 12;
            case "SalesOrder": return 13;
            case "SalesInvoice": return 14;
            case "SalesAdditionalInvoice": return 15;
            case "SalesReturn": return 16;
            case "SalesDebitNote": return 58;
            case "SalesCreditNote": return 59;
            case "StockJournal": return 17;
            case "PhysicalStock": return 18;
            case "StockTransfor": return 19;
            case "PartsDemand": return 20;
            case "IndentForm": return 21;
            case "IG": return 22;
            case "DispatchOrder": return 23;
            case "DispatchSection": return 24;
            case "PaymentAdvice": return 25;
            case "Consumptio": return 26;
            case "StockVerification": return 27;
            case "ReceivedChallan": return 28;
            case "PurchaseQuotationCancel": return 29;
            case "ReceiptNoteReturn": return 30;
            case "PurchaseOrderCancel": return 31;
            case "SalesQuotationCancel": return 32;
            case "SalesOrderCancel": return 33;
            case "FreightChallan": return 34;
            case "ManufacturingStockJournal": return 35;
            case "GatePass": return 36;
            case "CannibalizeIn": return 37;
            case "CannibalizeOut": return 38;
            case "StockHold": return 39;
            case "SalesProjection": return 40;
            case "SalesAllotment": return 41;
            case "BankQuotation": return 42;
            case "BankDO": return 43;
            case "BankAllotment": return 44;
            case "Namsari": return 45;
            case "BankPayLetter": return 46;
            case "PartsDemandCancel": return 47;
            case "SalesAllotmentCancel": return 48;
            case "AutoMobile_NewVehicleEntry": return 49;
            case "AutoMobile_NewJobCard": return 50;
            case "AutoMobile_TransirClaim": return 51;
            case "AutoMobile_PartsIssue": return 52;
            case "AutoMobile_PartsReturn": return 53;
            case "AutoMobile_JobCardComplainInspection": return 54;
            case "AutoMobile_ClosedJobCard": return 55;
            case "StockInWard": return 60;
            case "StockOutWard": return 61;
            case "SalesAllotmentReturn": return 62;
            case "ProductionAditionalCost": return 63;
            default:
                return 0;
        }

    };
    this.getDateFormat = function () {

        var dataColl = [
            { id: 1, text: 'DD-MM-YYYY' },
            { id: 2, text: 'MM-DD-YYYY' },
            { id: 3, text: 'YYYY-MM-DD' },
            { id: 4, text: 'YYYY-MM' },
            { id: 5, text: 'MM-YYYY' }
        ];
        return dataColl;
    };

    this.getDateDet = function (dt) {

        dt = new Date(dt);
        var bsDateDet1 = NepaliFunctions.AD2BS({ year: dt.getFullYear(), month: dt.getMonth() + 1, day: dt.getDate() });

        var bsDate1 = bsDateDet1.year + '-' + bsDateDet1.month.toString().padStart(2, '0') + '-' + bsDateDet1.day.toString().padStart(2, '0');

        var dateDetail = {
            dateAD: dt,
            dateBS: bsDate1,
            NY: bsDateDet1.year,
            NM: bsDateDet1.month,
            ND: bsDateDet1.day
        };

        return dateDetail;
    };

    this.getFormActions = function () {

        var dataColl = [
            { id: 1, text: 'Save' },
            { id: 2, text: 'Modify' },
            { id: 3, text: 'Delete' },
            { id: 4, text: 'Print' },
            { id: 5, text: 'View' }
        ];
        return dataColl;
    };
    this.getRefQtyAs = function () {

        var dataColl = [
            { id: 0, text: 'LESS_THEN_EQUAL' },
            { id: 1, text: 'GREATER_THEN_EQUAL' },
            { id: 2, text: 'NOT_EDIT_ABLE' },
            { id: 3, text: 'NOT_VALIDATE' }
        ];
        return dataColl;
    };

    this.getPaymentTypeColl = function () {

        var dataColl = [
            { id: 1, text: 'CASH' }, { id: 2, text: 'CREDIT' }, { id: 3, text: 'LETTER OF CREDIT' }, { id: 4, text: 'BANK GUARANTEE' }, { id: 5, text: 'CASH ON DELIVERY' }, { id: 6, text: 'PDC' }
        ];
        return dataColl;
    };

    this.getAdditionDeducationSign = function () {
        var dataColl = [{ id: true, text: '+' }, { id: false, text: '-' }];
        return dataColl;
    };
    this.getUDFTypes = function () {
        var dataColl = [{ id: 1, text: 'String' }, { id: 2, text: 'WholeNumberOnly' }, { id: 3, text: 'DecimalNumber' }, { id: 4, text: 'Date' }, { id: 5, text: 'DateTime' }, { id: 6, text: 'YesNo' },
        { id: 7, text: 'Memo' }, { id: 8, text: 'List' }];
        return dataColl;
    };
    this.getWeekDayNameList = function () {
        var dataColl = [{ id: 1, text: 'Sunday' }, { id: 2, text: 'Monday' }, { id: 3, text: 'Tuesday' }, { id: 4, text: 'Wednesday' }, { id: 5, text: 'Thursday' }, { id: 6, text: 'Friday' }, { id: 7, text: 'Saturday' }];
        return dataColl;
    };

    this.getPerPageList = function () {
        var dataColl = [{ value: 0, text: 'All' }, { value: 5, text: 5 }, { value: 10, text: 10 }, { value: 25, text: 25 }, { value: 50, text: 50 }, { value: 100, text: 100 }, { value: 500, text: 500 }, { value: 1000, text: 1000 }, { value: 1500, text: 1500 }];
        return dataColl;
    };

    this.getPerPageRow = function () {
        return 10;
    }
    this.getPageOptions = function () {
        return [5, 10, 20, 30, 40, 50];
    }
    this.getDrCr = function () {

        var dataColl = [
            { id: 1, text: 'DR' },
            { id: 2, text: 'CR' }
        ];
        return dataColl;
    };
    this.getExpression = function () {

        var dataColl = [
            { text: "equal to", value: "==" },
            { text: "not equal to", value: "!=" },
            { text: "less than", value: "<" },
            { text: "less than equal", value: "<=" },
            { text: "greater than", value: ">" },
            { text: "greater than equal", value: ">=" },
            { text: "between", value: "between" },
            { text: "contain", value: ".Contains(" },
            { text: "StartWith", value: ".StartsWith(" },
            { text: "EndWith", value: ".EndsWith(" },
        ];

        return dataColl;
    };

    this.getLogicCondition = function () {

        var dataColl = [
            { text: "And", value: "&&" },
            { text: "Or", value: "||" }
        ];

        return dataColl;
    };

    this.getNumberingMethod = function () {
        var dataColl = [{ text: 'Auto', value: 1, id: 1 }, { text: 'Manual', value: 2, id: 2 }, { text: 'None', value: 3, id: 3 }];
        return dataColl;
    };

    this.ShowTransactionRelation = function (voucherType, tranId) {

        if (tranId > 0) {
            var para = {
                TranId: tranId,
                VoucherType: voucherType,
            };

            return $http({
                method: 'POST',
                url: base_url + "Global/GetTranRelation",
                dataType: "json",
                data: JSON.stringify(para)
            });
        }
    }

    this.ShowVoucher = function (voucherType, tranId) {

        $(document).ready(function () {
            $('body').css('cursor', 'wait');
        });

        var para = {
            voucherType: voucherType,
            tranId: tranId,
        };
        var frame = document.getElementById("frmChieldForm");
        var frameDoc = frame.contentDocument || frame.contentWindow.document;
        if (frameDoc)
            frameDoc.removeChild(frameDoc.documentElement);

        frame.src = '';
        frame.src = base_url + "Global/ShowAccInvTransaction?" + param(para);
        document.body.style.cursor = 'default';

        $('#frmChieldForm').on('load', function () {
            $('body').css('cursor', 'default');
        });

        $('#frmChield').modal('show');
    }

    this.ShowProductCurrentStatus = function (productId, godownId) {

        if (productId > 0 && godownId > 0) {
            $(document).ready(function () {
                $('body').css('cursor', 'wait');
            });

            var para = {
                productId: productId,
                godownId: godownId,
            };
            var frame = document.getElementById("frmChieldForm");
            var frameDoc = frame.contentDocument || frame.contentWindow.document;
            if (frameDoc)
                frameDoc.removeChild(frameDoc.documentElement);

            frame.src = '';
            frame.src = base_url + "Inventory/Reporting/ProductCurrentStatus?" + param(para);
            document.body.style.cursor = 'default';

            $('#frmChieldForm').on('load', function () {
                $('body').css('cursor', 'default');
            });

            $('#frmChield').modal('show');
        }

    }

    this.getCustomRptColumns = function (EntityId) {

        if (EntityId == null || EntityId == undefined)
            EntityId = -1;

        var para = {
            EntityId: EntityId
        }

        return $http({
            method: 'POST',
            url: base_url + "Global/GetCustomColForRptSetup",
            dataType: "json",
            data: JSON.stringify(para)
        });
    };

    this.getDefaultBranch = function () {

        return $http({
            method: 'GET',
            url: base_url + "Home/GetDefaultBranch",
            dataType: "json"
        })
    };

    this.getProject = function () {

        return $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllProject",
            dataType: "json"
        })
    };
    this.getAuditLog = function (entityId, tranId) {

        return $http({
            method: 'GET',
            url: base_url + "Global/GetAuditLog?EntityId=" + entityId + "&TranId=" + tranId,
            dataType: "json"
        });
    };
    this.getExpensesLedger = function (voucherId) {

        return $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetExpensesLedger",
            dataType: "json"
        })
    };
    this.getCostClassForRpt = function (voucherId) {

        return $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetCostClasssRpt",
            dataType: "json"
        })
    };
    this.getSalesLedger = function () {

        return $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetSalesLedger",
            dataType: "json"
        })
    };

    this.getPurchaseLedger = function () {

        return $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetPurchaseLedger",
            dataType: "json"
        })
    };
    this.getSalesLedger = function (voucherId) {

        return $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetSalesLedger?voucherId=" + voucherId,
            dataType: "json"
        })
    };

    this.getPurchaseLedger = function (voucherId) {

        return $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetPurchaseLedger?voucherId=" + voucherId,
            dataType: "json"
        })
    };
    this.getDocumentTypeList = function () {
        return $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetAllDocumentTypeList",
            dataType: "json"
        })
    };
    this.getGenConfig = function () {
        return $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetGeneralConfiguration",
            dataType: "json"
        })
    };
    this.getInvConfig = function () {
        return $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetInvConfig",
            dataType: "json"
        })
    };
    this.getDateStyleConfig = function () {
        return $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetDateStyle",
            dataType: "json"
        })
    };
    this.getButtonDisabled = function (entityId) {

        var para = {
            EntityId: entityId
        };
        return $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetEntityButtonDisable",
            dataType: "json",
            data: JSON.stringify(para)
        });
    };
    this.getCompanyDet = function () {

        return $http({
            method: 'GET',
            url: base_url + "Global/GetCompanyDetail",
            dataType: "json"
        })
    };
    this.getCurrentDateTime = function () {

        return $http({
            method: 'GET',
            url: base_url + "Global/GetCurrentDate",
            dataType: "json"
        })
    };
    this.getLastEntryDate = function (voucherid) {

        return $http({
            method: 'GET',
            url: base_url + "Global/GetLastEntryDate?voucherid=" + voucherid,
            dataType: "json"
        })
    };
    this.getRackList = function (godownId) {
        return $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetRackForEntry?GodownId=" + godownId,
            dataType: "json"
        })
    };
    this.getRackList = function (godownId, godownIdColl) {
        return $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetRackForEntry?GodownId=" + godownId + "&GodownIdColl=" + godownIdColl,
            dataType: "json"
        })
    };
    this.getPaymentTerms = function () {
        return $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllPaymentTerms",
            dataType: "json"
        })
    };
    this.getPaymentMode = function () {
        return $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllPaymentMode",
            dataType: "json"
        })
    };
    this.getFreightTypes = function () {
        return $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllFreightType",
            dataType: "json"
        })
    };
    this.getTransactionEntity = function () {

        return $http({
            method: 'GET',
            url: base_url + "Global/GetTransactionEntityLst",
            dataType: "json"
        })
    };
    this.getReportEntity = function () {

        return $http({
            method: 'GET',
            url: base_url + "Global/GetReportEntityLst",
            dataType: "json"
        })
    };
    this.getEntityProperties = function (eid) {

        var para = {
            EntityId: eid
        };
        return $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetEPByEntityId",
            dataType: "json",
            data: JSON.stringify(para)
        });
    };
    this.getRptEntityProperties = function (eid) {

        var para = {
            EntityId: eid,
            EntityType: 3,
        };
        return $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetEPByEntityId",
            dataType: "json",
            data: JSON.stringify(para)
        });
    };
    this.getCompanyPeriodMonth = function (costClassId) {

        if (costClassId > 0) {

            return $http({
                method: 'GET',
                url: base_url + "Global/GetCostClassPeriod?CostClassId=" + costClassId,
                dataType: "json"
            })

        } else {
            return $http({
                method: 'GET',
                url: base_url + "Global/GetCompanyPeriodMonth",
                dataType: "json"
            })
        }

    };
    this.getYearList = function () {
        var dataColl = [];
        dataColl = [
            { id: 2079, text: '2079' },
            { id: 2080, text: '2080' },
            { id: 2081, text: '2081' },
            { id: 2082, text: '2082' },
            { id: 2083, text: '2083' },
        ];


        return dataColl;
    };

    this.PrintReportData = function (EntityId, DataColl) {

        return $http({
            method: 'POST',
            url: base_url + "Global/PrintReportData",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("entityId", EntityId);
                formData.append("jsonData", angular.toJson(data.jsonData));

                return formData;
            },
            data: { jsonData: DataColl }
        });
    };

    function isDateVal(findVal) {
        if (moment.isDate(findVal) == true)
            return new moment(findVal).format("YYYYMMDD");
        else
            return findVal;
    }
    this.getAutoBatchNo = function (curRow, tran, formula) {
        var batchNo = '';
        try {
            var enPrColl = extractStringVariables(formula);
            if (enPrColl && enPrColl.length > 0) {
                enPrColl.forEach(function (pr) {
                    if (pr == 'Time') {
                        const now = new Date();
                        const hh = String(now.getHours()).padStart(2, '0');
                        const mm = String(now.getMinutes()).padStart(2, '0');
                        var time = hh + mm;
                        formula = formula.replaceAll(pr, time);
                    } else {
                        var findVal = null;
                        var variablesColl = pr.split('__');
                        if (variablesColl.length == 1) {
                            findVal = curRow[pr];
                            if (findVal == null || findVal == undefined) {
                                findVal = tran[pr];
                                if (findVal) {
                                    formula = formula.replaceAll(pr, isDateVal(findVal));
                                }
                                else {
                                    formula = formula.replaceAll(pr, '');
                                }
                            }
                            else {
                                formula = formula.replaceAll(pr, isDateVal(findVal));
                            }
                        }
                        else if (variablesColl.length == 2) {
                            var v1 = variablesColl[0];
                            var v2 = variablesColl[1];
                            findVal = curRow[v1];
                            if (findVal == null || findVal == undefined) {
                                findVal = tran[v1];
                                if (findVal) {
                                    findVal = findVal[v2];
                                }
                            }
                            else {
                                if (findVal) {
                                    findVal = findVal[v2];
                                }
                            }

                            if (findVal)
                                formula = formula.replaceAll(pr, isDateVal(findVal));
                            else {
                                formula = formula.replaceAll(pr, '');
                            }
                        }
                    }

                });

                formula = formula.replaceAll('+', '');
                batchNo = formula;
            }
        } catch {

        }
        return batchNo;

    };

    //ClosingQty,ActualQty,BilledQty,FreeQty,Rate,DiscountPer,DiscountAmt,Amount,NetWeight,LossRate,LossWeight,FineRate,FineWeight, ProcessingRate,ProcessingWeight,ALValue1
    //ALValue2,ALValue3,Makeing,Stone,TotalAmount,ExDutyAmount,TaxableAmt,VatAmount,MRP, PurchaseRate,TradeRate

    //cq,aq,bq,fq,rate,dp,da,amt,nw,lr,lw,fr,fw,pr,pw,av1,av2,av2,make,stone,tamt,eamt,taxamt,vamt,mrp,pr,tr

    this.getItemUDFFormulaQry = function (curRow, dataColl, tran, colName, targetName) {

        if (curRow.UDFFeildsColl && curRow.UDFFeildsColl.length > 0) {
            angular.forEach(curRow.UDFFeildsColl, function (udf) {
                if (udf.Source && udf.Source.length > 0 && colName != udf.NameId) {
                    var curRowObjColl = mx(Object.keys(curRow));
                    var tranObjColl = mx(Object.keys(tran));
                    //var paraColl = udf.Source.split(',');
                    var paraColl = extractVariables(udf.Source);

                    var tmpQry = udf.Source;
                    angular.forEach(paraColl, function (pr) {
                        if (pr.startsWith("@") == true) {
                            var pName = pr.replaceAll("@", "");
                            if (tranObjColl.contains(pName) == true) {
                                var findPVal = tran[pName];
                                if (findPVal) {
                                    if (moment.isDate(findPVal) == true) {
                                        var dt = new moment(findPVal).format("YYYY-MM-DD hh:mm");
                                        if (dt) {
                                            dt = "'" + dt + "'";
                                            tmpQry = tmpQry.replaceAll(pr, dt);
                                        }
                                    }
                                    else {

                                        tmpQry = tmpQry.replaceAll(pr, findPVal);
                                    }

                                } else
                                    tmpQry = tmpQry.replaceAll(pr, 'null');
                            }
                            else if (curRowObjColl.contains(pName) == true) {
                                var findPVal = curRow[pName];
                                if (findPVal) {
                                    if (moment.isDate(findPVal) == true) {
                                        var dt = new moment(findPVal).format("YYYY-MM-DD hh:mm");
                                        if (dt) {
                                            dt = "'" + dt + "'";
                                            tmpQry = tmpQry.replaceAll(pr, dt);
                                        }
                                    }
                                    else {
                                        tmpQry = tmpQry.replaceAll(pr, findPVal);
                                    }
                                } else
                                    tmpQry = tmpQry.replaceAll(pr, 'null');
                            }
                            else {
                                var udfVal = getFormulaVal(pName, curRow, tran);
                                if (tmpQry) {
                                    tmpQry = tmpQry.replaceAll(pr, udfVal);
                                }
                            }

                        }
                    });

                    if (udf.FieldType != 3) {
                        var queryParameters =
                        {
                            procName: '',
                            qry: tmpQry,
                            asParentChild: false,
                            tblNames: '',
                            colRelations: ''
                        };

                        $http({
                            method: 'POST',
                            url: base_url + "Global/GetCustomData",
                            dataType: "json",
                            data: JSON.stringify(queryParameters)
                        }).then(function (resLD) {

                            hidePleaseWait();
                            if (resLD.data.IsSuccess && resLD.data.Data) {
                                if (resLD.data.Data.length > 0) {
                                    try {
                                        if (resLD.data.Data.length == 1) {
                                            var retObj = resLD.data.Data[0];
                                            var objKeyColl = Object.keys(retObj);
                                            var qryVal = null;
                                            if (objKeyColl.length == 1) {
                                                qryVal = retObj[objKeyColl[0]];

                                            } else {
                                                qryVal = retObj.Val;
                                            }


                                            if ((udf.FieldType == 2 || udf.FieldType == 22 || udf.FieldType == 23) && qryVal) {
                                                udf.UDFValue_TMP = new Date(qryVal);
                                                udf.UDFValue = new Date(qryVal);
                                                udf.Value = new Date(qryVal);
                                            }
                                            else if (udf.FieldType == 2 || udf.FieldType == 22 || udf.FieldType == 23) {
                                                udf.UDFValue_TMP = null;
                                            }
                                            else {
                                                udf.UDFValue = qryVal;
                                                udf.Value = qryVal;
                                            }
                                        }

                                    } catch { }


                                }

                            }
                        }, function (reason) {
                            alert('Failed' + reason);
                        });
                    }
                }
            });
        }

    };

    this.getItemUDFFormula = function (curRow, dataColl, tran, colName, targetName) {

        if (curRow) {
            if (curRow.UDFFeildsColl && curRow.UDFFeildsColl.length > 0) {
                angular.forEach(curRow.UDFFeildsColl, function (udf) {
                    if (udf.Formula && udf.Formula.length > 0 && colName != udf.NameId) {
                        var formula = udf.Formula;

                        var enPrColl = extractStringVariables(formula);
                        if (enPrColl && enPrColl.length > 0) {
                            enPrColl.forEach(function (pr) {
                                if (pr.startsWith("sum_")) {
                                    var enName = pr.replace('sum_', '');
                                    var sumVal = $filter('sumOfValue')(dataColl, enName);
                                    formula = formula.replaceAll(pr, isEmptyNum(sumVal));
                                }
                                else if (pr.startsWith("min_")) {
                                    var enName = pr.replace('min_', '');
                                    var minVal = $filter('minOfValue')(dataColl, enName);
                                    formula = formula.replaceAll(pr, isEmptyNum(minVal));
                                }
                                else if (pr.startsWith("max_")) {
                                    var enName = pr.replace('max_', '');
                                    var maxVal = $filter('maxOfValue')(dataColl, enName);
                                    formula = formula.replaceAll(pr, isEmptyNum(maxVal));
                                }
                                else if (pr.startsWith("avg_")) {
                                    var enName = pr.replace('avg_', '');
                                    var avgVal = $filter('avgOfValue')(dataColl, enName);
                                    formula = formula.replaceAll(pr, isEmptyNum(avgVal));
                                }
                                else {
                                    var findVal = curRow[pr];
                                    if (findVal) {
                                        formula = formula.replaceAll(pr, findVal);
                                    } else if (findVal == undefined || findVal == null) {
                                        formula = formula.replaceAll(pr, '');
                                    }
                                }

                            });
                        }

                        try {
                            if (udf.FieldType == 1) {

                                if (curRow.RefQty > 0 && udf.UDFValue != null && udf.UDFValue.length > 0) {

                                } else {
                                    try {

                                        var nVal = math.evaluate(formula);
                                        var UDFValue = isEmptyAmt(getFormulaVal(formula, curRow, tran));
                                        if (UDFValue != 0) {
                                            udf.UDFValue = UDFValue;
                                        }
                                        else {
                                            udf.UDFValue = formula;
                                        }

                                    } catch {
                                        udf.UDFValue = formula;
                                    }
                                }


                            }
                            else {
                                if (udf.IsManual == true) {

                                } else {
                                    var nVal = math.evaluate(formula);
                                    udf.UDFValue = isEmptyAmt(getFormulaVal(formula, curRow, tran));
                                }
                            }

                        } catch
                        { }

                    } else if (udf.NameId == colName) {
                        udf.IsManual = true;
                    }
                });
            }

            if (curRow.productDetail) {
                if (curRow.productDetail.SalesRateFormula && curRow.productDetail.SalesRateFormula.length > 0) {
                    var formula = curRow.productDetail.SalesRateFormula;
                    try {
                        curRow.Rate = isEmptyNum(getFormulaVal(formula, curRow, tran));
                    } catch { }
                }

                if (curRow.productDetail.PurchaseRateFormula && curRow.productDetail.PurchaseRateFormula.length > 0) {
                    var formula = curRow.productDetail.PurchaseRateFormula;
                    try {
                        curRow.Rate = isEmptyNum(getFormulaVal(formula, curRow, tran));
                    } catch { }
                }
            }
        }


        var t_aq = 0, t_bq = 0, t_fq = 0, t_da = 0, t_amt = 0, t_tamt = 0, t_eamt = 0, t_taxamt = 0, t_vamt = 0;
        angular.forEach(dataColl, function (dc) {
            if (dc.RowType == 'P' && dc.ProductId > 0) {
                t_aq += isEmptyNum(dc.ActualQty);
                t_bq += isEmptyNum(dc.BilledQty);
                t_fq += isEmptyNum(dc.FreeQty);
                t_da += isEmptyNum(dc.DiscountAmt);
                t_amt += isEmptyNum(dc.Amount);
                t_tamt += isEmptyNum(dc.TotalAmount);
                t_eamt += isEmptyNum(dc.ExDutyAmount);
                t_taxamt += isEmptyNum(dc.TaxableAmt);
                t_vamt += isEmptyNum(dc.VatAmount);
            }
        });

        var t_udf = {};
        var tmpUDFColl = [];
        angular.forEach(dataColl, function (dc) {
            if (dc.RowType == 'P' && dc.ProductId > 0) {
                if (dc.UDFFeildsColl && dc.UDFFeildsColl.length > 0) {
                    angular.forEach(dc.UDFFeildsColl, function (udf) {
                        var uname = 't_u' + udf.SNo;
                        t_udf[uname] = isEmptyNum(t_udf[uname]) + isEmptyNum(udf.UDFValue);
                        tmpUDFColl.push(udf);
                    });
                }
            }
        });

        angular.forEach(dataColl, function (dc) {
            if (dc.RowType == 'L' && dc.LedgerId > 0) {
                if (dc.Formula && dc.Formula.length > 0) {
                    var formula = dc.Formula;
                    formula = formula.replaceAll('t_aq', isEmptyNum(t_aq));
                    formula = formula.replaceAll('t_bq', isEmptyNum(t_bq));
                    formula = formula.replaceAll('t_fq', isEmptyNum(t_fq));
                    formula = formula.replaceAll('t_da', isEmptyNum(t_da));
                    formula = formula.replaceAll('t_amt', isEmptyNum(t_amt));
                    formula = formula.replaceAll('t_tamt', isEmptyNum(t_tamt));
                    formula = formula.replaceAll('t_eamt', isEmptyNum(t_eamt));
                    formula = formula.replaceAll('t_taxamt', isEmptyNum(t_taxamt));
                    formula = formula.replaceAll('t_vamt', isEmptyNum(t_taxamt));

                    var UDFFeildsColl = curRow ? curRow.UDFFeildsColl : dataColl[0].UDFFeildsColl;
                    angular.forEach(UDFFeildsColl, function (udf) {
                        var uname = 't_u' + udf.SNo;
                        formula = formula.replaceAll(uname, isEmptyNum(isEmptyNum(t_udf[uname])));


                        if (tmpUDFColl && tmpUDFColl.length > 0) {
                            var filteredResults = $filter('filter')(tmpUDFColl, function (item) {
                                return item.SNo == udf.SNo;
                            });
                            var sum_name = 'sum_u' + udf.SNo;
                            var min_name = 'min_u' + udf.SNo;
                            var max_name = 'max_u' + udf.SNo;
                            var avg_name = 'avg_u' + udf.SNo;

                            if (formula.includes(sum_name)) {
                                var sumVal = $filter('sumOfValue')(filteredResults, 'UDFValue');
                                formula = formula.replaceAll(sum_name, isEmptyNum(sumVal));
                            }

                            if (formula.includes(min_name)) {
                                var sumVal = $filter('minOfValue')(filteredResults, 'UDFValue');
                                formula = formula.replaceAll(min_name, isEmptyNum(sumVal));
                            }

                            if (formula.includes(max_name)) {
                                var sumVal = $filter('maxOfValue')(filteredResults, 'UDFValue');
                                formula = formula.replaceAll(max_name, isEmptyNum(sumVal));
                            }

                            if (formula.includes(avg_name)) {
                                var sumVal = $filter('avgOfValue')(filteredResults, 'UDFValue');
                                formula = formula.replaceAll(avg_name, isEmptyNum(sumVal));
                            }
                        }

                    });


                    var enPrColl = extractStringVariables(formula);
                    if (enPrColl && enPrColl.length > 0) {
                        enPrColl.forEach(function (pr) {
                            if (pr.startsWith("sum_")) {
                                var enName = pr.replace('sum_', '');
                                var sumVal = $filter('sumOfValue')(dataColl, enName);
                                formula = formula.replaceAll(pr, isEmptyNum(sumVal));
                            }
                            else if (pr.startsWith("min_")) {
                                var enName = pr.replace('min_', '');
                                var minVal = $filter('minOfValue')(dataColl, enName);
                                formula = formula.replaceAll(pr, isEmptyNum(minVal));
                            }
                            else if (pr.startsWith("max_")) {
                                var enName = pr.replace('max_', '');
                                var maxVal = $filter('maxOfValue')(dataColl, enName);
                                formula = formula.replaceAll(pr, isEmptyNum(maxVal));
                            }
                            else if (pr.startsWith("avg_")) {
                                var enName = pr.replace('avg_', '');
                                var avgVal = $filter('avgOfValue')(dataColl, enName);
                                formula = formula.replaceAll(pr, isEmptyNum(avgVal));
                            }

                        });
                    }



                    try {
                        if (dc.IsManual == true) {

                        } else {
                            var nVal = math.evaluate(formula);
                            dc.Amount = isEmptyNum(nVal);
                        }

                    } catch { }
                }
            }
        });

        if (tran.UDFFeildsColl && tran.UDFFeildsColl.length > 0) {
            angular.forEach(tran.UDFFeildsColl, function (udf) {
                if (udf.Formula && udf.Formula.length > 0 && udf.NameId != colName) {
                    var formula = udf.Formula;
                    formula = formula.replaceAll('t_aq', isEmptyNum(t_aq));
                    formula = formula.replaceAll('t_bq', isEmptyNum(t_bq));
                    formula = formula.replaceAll('t_fq', isEmptyNum(t_fq));
                    formula = formula.replaceAll('t_da', isEmptyNum(t_da));
                    formula = formula.replaceAll('t_amt', isEmptyNum(t_amt));
                    formula = formula.replaceAll('t_tamt', isEmptyNum(t_tamt));
                    formula = formula.replaceAll('t_eamt', isEmptyNum(t_eamt));
                    formula = formula.replaceAll('t_taxamt', isEmptyNum(t_taxamt));
                    formula = formula.replaceAll('t_vamt', isEmptyNum(t_taxamt));

                    angular.forEach(tran.UDFFeildsColl, function (udf1) {
                        var uname = 'vu' + udf1.SNo;
                        formula = formula.replaceAll(uname, isEmptyNum(udf1.UDFValue));
                    });

                    angular.forEach(tran.UDFFeildsColl, function (udf) {
                        var uname = 't_u' + udf.SNo;
                        formula = formula.replaceAll(uname, isEmptyNum(isEmptyNum(t_udf[uname])));
                    });


                    try {
                        if (udf.IsManual == true) {

                        } else {
                            var nVal = math.evaluate(formula);
                            udf.UDFValue = isEmptyNum(nVal);
                        }

                    } catch { }
                } else if (udf.NameId == colName) {
                    udf.IsManual = true;
                }
            });
        }

        if (curRow.Formula) {
            for (var key in curRow.Formula) {
                if (key != targetName && targetName != undefined) {
                    var fVal = getFormulaVal(curRow.Formula[key], curRow, tran);
                    if (fVal != 0) {
                        curRow[key] = fVal;
                    }
                    else if ((!curRow.ManualInput || !curRow.ManualInput[key] || curRow.ManualInput[key] == false)) {
                        curRow[key] = fVal;
                    }
                }
            }
        }
    };

    this.getItemLandedCostFormula = function (curRow, dataColl, tran, colName) {

        if (curRow) {

            var t_aq = 0, t_bq = 0, t_fq = 0, t_da = 0, t_amt = 0, t_tamt = 0, t_eamt = 0, t_taxamt = 0, t_vamt = 0;
            angular.forEach(tran.ItemDetailsColl, function (dc) {
                if (dc.RowType == 'P') {
                    t_aq += isEmptyNum(dc.ActualQty);
                    t_bq += isEmptyNum(dc.BilledQty);
                    t_fq += isEmptyNum(dc.FreeQty);
                    t_da += isEmptyNum(dc.DiscountAmt);
                    t_amt += isEmptyNum(dc.Amount);
                    t_tamt += isEmptyNum(dc.TotalAmount);
                    t_eamt += isEmptyNum(dc.ExDutyAmount);
                    t_taxamt += isEmptyNum(dc.TaxableAmt);
                    t_vamt += isEmptyNum(dc.VatAmount);
                }
            });

            if (curRow.ProductLanedCostColl && curRow.ProductLanedCostColl.length > 0) {
                angular.forEach(curRow.ProductLanedCostColl, function (udf) {
                    if (udf.Formula && udf.Formula.length > 0 && colName != udf.OrderNo) {
                        var formula = udf.Formula;

                        formula = formula.replaceAll('t_aq', isEmptyNum(t_aq));
                        formula = formula.replaceAll('t_bq', isEmptyNum(t_bq));
                        formula = formula.replaceAll('t_fq', isEmptyNum(t_fq));
                        formula = formula.replaceAll('t_da', isEmptyNum(t_da));
                        formula = formula.replaceAll('t_amt', isEmptyNum(t_amt));
                        formula = formula.replaceAll('t_tamt', isEmptyNum(t_tamt));
                        formula = formula.replaceAll('t_eamt', isEmptyNum(t_eamt));
                        formula = formula.replaceAll('t_taxamt', isEmptyNum(t_taxamt));
                        formula = formula.replaceAll('t_vamt', isEmptyNum(t_taxamt));

                        formula = formula.replaceAll('cq', isEmptyNum(curRow.BalanceQty));
                        formula = formula.replaceAll('aq', isEmptyNum(curRow.ActualQty));
                        formula = formula.replaceAll('bq', isEmptyNum(curRow.BilledQty));
                        formula = formula.replaceAll('fq', isEmptyNum(curRow.FreeQty));
                        formula = formula.replaceAll('rate', isEmptyNum(curRow.Rate));
                        formula = formula.replaceAll('dp', isEmptyNum(curRow.DiscountPer));
                        formula = formula.replaceAll('da', isEmptyNum(curRow.DiscountAmt));
                        formula = formula.replaceAll('amt', isEmptyNum(curRow.Amount));
                        formula = formula.replaceAll('nw', isEmptyNum(curRow.NetWeight));
                        formula = formula.replaceAll('lr', isEmptyNum(curRow.LossRate));
                        formula = formula.replaceAll('lw', isEmptyNum(curRow.LossWeight));
                        formula = formula.replaceAll('fr', isEmptyNum(curRow.FineRate));
                        formula = formula.replaceAll('fw', isEmptyNum(curRow.FineWeight));
                        formula = formula.replaceAll('pr', isEmptyNum(curRow.ProcessingRate));
                        formula = formula.replaceAll('pw', isEmptyNum(curRow.ProcessingWeight));
                        formula = formula.replaceAll('av1', isEmptyNum(curRow.ALValue1));
                        formula = formula.replaceAll('av2', isEmptyNum(curRow.ALValue2));
                        formula = formula.replaceAll('av2', isEmptyNum(curRow.ALValue3));
                        formula = formula.replaceAll('make', isEmptyNum(curRow.Makeing));
                        formula = formula.replaceAll('stone', isEmptyNum(curRow.Stone));
                        formula = formula.replaceAll('amt', isEmptyNum(curRow.TotalAmount));
                        formula = formula.replaceAll('eamt', isEmptyNum(curRow.ExDutyAmount));
                        formula = formula.replaceAll('tamt', isEmptyNum(curRow.TaxableAmt));
                        formula = formula.replaceAll('vamt', isEmptyNum(curRow.VatAmount));
                        formula = formula.replaceAll('mrp', isEmptyNum(curRow.MRP));
                        formula = formula.replaceAll('pr', isEmptyNum(curRow.PurchaseRate));
                        formula = formula.replaceAll('tr', isEmptyNum(curRow.TradeRate));
                        formula = formula.replaceAll('sr', isEmptyNum(curRow.SalesRate));



                        angular.forEach(curRow.ProductLanedCostColl, function (udf1) {
                            var uname = 'lc' + udf1.OrderNo + '#';
                            formula = formula.replaceAll(uname, isEmptyNum(udf1.Amount));
                        });

                        try {
                            if (udf.IsManual == true) {

                            } else {
                                var nVal = math.evaluate(formula);
                                udf.Amount = isEmptyNum(nVal);
                            }
                        } catch { }

                    } else if (udf.OrderNo == colName) {
                        udf.IsManual = true;
                    }
                });
            }
        }
    };

    //CurrentBal,DrAmount,CrAmount
    //cb,dr,cr
    this.getLAUDFFormula = function (curRow, dataColl) {

        if (curRow) {



            if (curRow.UDFFeildsColl && curRow.UDFFeildsColl.length > 0) {
                angular.forEach(curRow.UDFFeildsColl, function (udf) {
                    if (udf.Formula && udf.Formula.length > 0) {
                        var formula = udf.Formula;
                        formula = formula.replaceAll('cb', isEmptyNum(curRow.CurrentBal));
                        formula = formula.replaceAll('dr', isEmptyNum(curRow.DrAmount));
                        formula = formula.replaceAll('cr', isEmptyNum(curRow.CrAmount));

                        angular.forEach(curRow.UDFFeildsColl, function (udf1) {
                            var uname = 'u' + udf1.SNo;
                            formula = formula.replaceAll(uname, isEmptyNum(udf1.UDFValue));
                        });

                        try {
                            var nVal = math.evaluate(formula);
                            udf.UDFValue = isEmptyNum(nVal);

                        } catch { }
                    }
                });
            }
        }

    };

    function getFormulaVal(formula, curRow, tran) {

        var t_aq = 0, t_bq = 0, t_fq = 0, t_da = 0, t_amt = 0, t_tamt = 0, t_eamt = 0, t_taxamt = 0, t_vamt = 0;
        angular.forEach(tran.ItemDetailsColl, function (dc) {
            if (dc.RowType == 'P' && dc.ProductId > 0) {
                t_aq += isEmptyNum(dc.ActualQty);
                t_bq += isEmptyNum(dc.BilledQty);
                t_fq += isEmptyNum(dc.FreeQty);
                t_da += isEmptyNum(dc.DiscountAmt);
                t_amt += isEmptyNum(dc.Amount);
                t_tamt += isEmptyNum(dc.TotalAmount);
                t_eamt += isEmptyNum(dc.ExDutyAmount);
                t_taxamt += isEmptyNum(dc.TaxableAmt);
                t_vamt += isEmptyNum(dc.VatAmount);
            }
        });

        var t_udf = {};
        angular.forEach(tran.ItemDetailsColl, function (dc) {
            if (dc.RowType == 'P' && dc.ProductId > 0) {
                if (dc.UDFFeildsColl && dc.UDFFeildsColl.length > 0) {
                    angular.forEach(dc.UDFFeildsColl, function (udf) {
                        var uname = 't_u' + udf.SNo;
                        t_udf[uname] = isEmptyNum(t_udf[uname]) + isEmptyNum(udf.UDFValue);
                    });
                }
            }
        });

        var fstRow = tran.ItemDetailsColl[0];
        angular.forEach(fstRow.UDFFeildsColl, function (udf) {
            var uname = 't_u' + udf.SNo;
            formula = formula.replaceAll(uname, isEmptyNum(isEmptyNum(t_udf[uname])));
        });

        formula = formula.replaceAll('t_aq', isEmptyNum(t_aq));
        formula = formula.replaceAll('t_bq', isEmptyNum(t_bq));
        formula = formula.replaceAll('t_fq', isEmptyNum(t_fq));
        formula = formula.replaceAll('t_da', isEmptyNum(t_da));
        formula = formula.replaceAll('t_amt', isEmptyNum(t_amt));
        formula = formula.replaceAll('t_tamt', isEmptyNum(t_tamt));
        formula = formula.replaceAll('t_eamt', isEmptyNum(t_eamt));
        formula = formula.replaceAll('t_taxamt', isEmptyNum(t_taxamt));
        formula = formula.replaceAll('t_vamt', isEmptyNum(t_taxamt));

        angular.forEach(tran.UDFFeildsColl, function (udf1) {
            var uname = 'vu' + udf1.SNo;
            formula = formula.replaceAll(uname, isEmptyNum(udf1.UDFValue));
        });

        angular.forEach(tran.ItemDetailsColl, function (dc) {
            if (dc.RowType == 'L' && dc.LedgerId > 0) {
                if (dc.costLedgerDetail) {
                    if (dc.costLedgerDetail.Code && dc.costLedgerDetail.Code.length > 0)
                        formula = formula.replaceAll(dc.costLedgerDetail.Code, isEmptyNum(dc.Amount));
                }
            }
        });

        if (curRow) {

            var enPrColl = extractStringVariables(formula);
            if (enPrColl && enPrColl.length > 0) {
                enPrColl.forEach(function (pr) {
                    var hasProperties = Object.hasOwn(curRow, pr);         // true
                    if (hasProperties == true) {
                        formula = formula.replaceAll(pr, isEmptyNum(curRow[pr]));
                    }
                    else {
                        hasProperties = Object.hasOwn(tran, pr);
                        if (hasProperties == true) {
                            formula = formula.replaceAll(pr, isEmptyNum(tran[pr]));
                        }
                    }
                });
            }


            formula = formula.replaceAll('tscrate', isEmptyNum(curRow.TSCRate));
            formula = formula.replaceAll('tscamt', isEmptyNum(curRow.TSCAmt));
            formula = formula.replaceAll('tamt', isEmptyNum(curRow.TotalAmount));
            formula = formula.replaceAll('eamt', isEmptyNum(curRow.ExDutyAmount));
            formula = formula.replaceAll('taxableamt', isEmptyNum(curRow.TaxableAmt));
            formula = formula.replaceAll('vamt', isEmptyNum(curRow.VatAmount));
            formula = formula.replaceAll('vrate', isEmptyNum(curRow.VatRate));
            formula = formula.replaceAll('erate', isEmptyNum(curRow.ExDutyAmount));
            formula = formula.replaceAll('ccrate', isEmptyNum(curRow.CCRate));
            formula = formula.replaceAll('ccamt', isEmptyNum(curRow.CCAmount));
            formula = formula.replaceAll('excableamt', isEmptyNum(curRow.ExciseAbleAmt));
            formula = formula.replaceAll('abbrate', isEmptyNum(curRow.AbbRate));
            formula = formula.replaceAll('abbamt', isEmptyNum(curRow.AbbAmount));
            formula = formula.replaceAll('excrate', isEmptyNum(curRow.ExciseRate));

            formula = formula.replaceAll('cq', isEmptyNum(curRow.BalanceQty));
            formula = formula.replaceAll('aq', isEmptyNum(curRow.ActualQty));
            formula = formula.replaceAll('bq', isEmptyNum(curRow.BilledQty));
            formula = formula.replaceAll('fq', isEmptyNum(curRow.FreeQty));
            formula = formula.replaceAll('rate', isEmptyNum(curRow.Rate));
            formula = formula.replaceAll('dp', isEmptyNum(curRow.DiscountPer));
            formula = formula.replaceAll('da', isEmptyNum(curRow.DiscountAmt));
            formula = formula.replaceAll('amt', isEmptyNum(curRow.Amount));
            formula = formula.replaceAll('nw', isEmptyNum(curRow.NetWeight));
            formula = formula.replaceAll('lr', isEmptyNum(curRow.LossRate));
            formula = formula.replaceAll('lw', isEmptyNum(curRow.LossWeight));
            formula = formula.replaceAll('fr', isEmptyNum(curRow.FineRate));
            formula = formula.replaceAll('fw', isEmptyNum(curRow.FineWeight));
            formula = formula.replaceAll('prr', isEmptyNum(curRow.ProcessingRate));
            formula = formula.replaceAll('pw', isEmptyNum(curRow.ProcessingWeight));
            formula = formula.replaceAll('av1', isEmptyNum(curRow.ALValue1));
            formula = formula.replaceAll('av2', isEmptyNum(curRow.ALValue2));
            formula = formula.replaceAll('av2', isEmptyNum(curRow.ALValue3));
            formula = formula.replaceAll('make', isEmptyNum(curRow.Makeing));
            formula = formula.replaceAll('stone', isEmptyNum(curRow.Stone));
            formula = formula.replaceAll('mrp', isEmptyNum(curRow.MRP));
            formula = formula.replaceAll('pr', isEmptyNum(curRow.PurchaseRate));
            formula = formula.replaceAll('tr', isEmptyNum(curRow.TradeRate));
            formula = formula.replaceAll('sr', isEmptyNum(curRow.SalesRate));
            formula = formula.replaceAll('sper', isEmptyNum(curRow.SchamePer));
            formula = formula.replaceAll('samt', isEmptyNum(curRow.SchameAmt));

            formula = formula.replaceAll('fat', isEmptyNum(curRow.Fat));
            formula = formula.replaceAll('snf', isEmptyNum(curRow.SNF));
            formula = formula.replaceAll('wmix', isEmptyNum(curRow.WaterMix));
            formula = formula.replaceAll('tsamt', isEmptyNum(curRow.TSAmt));
            formula = formula.replaceAll('topping', isEmptyNum(curRow.Topping));
            formula = formula.replaceAll('estrate', isEmptyNum(curRow.EstRate));
            formula = formula.replaceAll('estamt', isEmptyNum(curRow.EstAmount));

            formula = formula.replaceAll('tolarate', isEmptyNum(curRow.TolaRate));
            formula = formula.replaceAll('pgrate', isEmptyNum(curRow.PerGramRate));
            formula = formula.replaceAll('quality', isEmptyNum(curRow.Quality));
            formula = formula.replaceAll('qrate', isEmptyNum(curRow.QualityRate));
            formula = formula.replaceAll('given', isEmptyNum(curRow.Given));
            formula = formula.replaceAll('aded', isEmptyNum(curRow.Added));

            formula = formula.replaceAll('wm', isEmptyNum(curRow.WarrantyMonth));
            formula = formula.replaceAll('pm', isEmptyNum(curRow.ProfitMargin));


            formula = formula.replaceAll('weight', isEmptyNum(curRow.Weight));
            formula = formula.replaceAll('volum', isEmptyNum(curRow.Volum));

            angular.forEach(curRow.UDFFeildsColl, function (udf1) {
                var uname = 'u' + udf1.SNo;
                if (udf1.FieldType == 2) {
                    if (udf1.UDFValue) {
                        var strDT = '""' + $filter('date')(new Date(udf1.UDFValue), 'yyyy-MM-dd') + '""';
                        formula = formula.replaceAll(uname, strDT);
                    }
                    else if (udf1.UDFValue_TMP) {
                        var strDT = '""' + $filter('date')(new Date(udf1.UDFValue_TMP), 'yyyy-MM-dd') + '""';
                        formula = formula.replaceAll(uname, strDT);
                    }

                }
                else {
                    formula = formula.replaceAll(uname, isEmptyNum(udf1.UDFValue));
                }

            });

        }


        try {
            var nVal = math.evaluate(formula);
            return nVal;
        } catch
        {
            return formula;
        }

    };

    this.getCustomLedAllocation = function (tran, scopeTran) {

        var allocationColl = [];

        if (!tran.VoucherLedAllocationColl || tran.VoucherLedAllocationColl.length == 0)
            return allocationColl;

        var ledgerIdColl = [];

        var drAmt_P = 0, crAmt_P = 0;

        var findPartyLA = mx(tran.VoucherLedAllocationColl).firstOrDefault(p1 => p1.Particular == 'Party_Led');
        if (findPartyLA) {
            if (findPartyLA.DrAmount && findPartyLA.DrAmount.length > 0)
                drAmt_P = isEmptyNum(getFormulaVal(findPartyLA.DrAmount, null, scopeTran));

            if (findPartyLA.CrAmount && findPartyLA.CrAmount.length > 0)
                crAmt_P = isEmptyNum(getFormulaVal(findPartyLA.CrAmount, null, scopeTran));
        }
        ledgerIdColl.push({ id: tran.PartyLedgerId, text: 'Party_Led', amount: 0, DrAmount: drAmt_P, CrAmount: crAmt_P });
        //ledgerIdColl.push({ id: tran.TranLedgerId, text: 'Tran_Led', amount: 0, DrAmount: 0, CrAmount: 0 });

        var allocationQry = mx(tran.VoucherLedAllocationColl);

        angular.forEach(scopeTran.ItemDetailsColl, function (itemDet) {
            if (itemDet.RowType == 'P') {
                if (itemDet.productDetail) {
                    var find = mx(ledgerIdColl).firstOrDefault(p1 => p1.id == itemDet.LedgerId);
                    if (find) {
                        var drAmt = 0, crAmt = 0;
                        var findFormula = allocationQry.firstOrDefault(p1 => p1.Particular == 'Item_Led');
                        if (findFormula) {
                            if (findFormula.DrAmount && findFormula.DrAmount.length > 0)
                                drAmt = isEmptyNum(getFormulaVal(findFormula.DrAmount, itemDet, scopeTran));

                            if (findFormula.CrAmount && findFormula.CrAmount.length > 0)
                                crAmt = isEmptyNum(getFormulaVal(findFormula.CrAmount, itemDet, scopeTran));
                        }

                        find.amount = find.amount + itemDet.Amount;
                        find.DrAmount = find.DrAmount + drAmt;
                        find.CrAmount = find.CrAmount + crAmt;
                    } else {
                        var drAmt = 0, crAmt = 0;
                        var findFormula = allocationQry.firstOrDefault(p1 => p1.Particular == 'Item_Led');
                        if (findFormula) {
                            if (findFormula.DrAmount && findFormula.DrAmount.length > 0)
                                drAmt = isEmptyNum(getFormulaVal(findFormula.DrAmount, itemDet, scopeTran));

                            if (findFormula.CrAmount && findFormula.CrAmount.length > 0)
                                crAmt = isEmptyNum(getFormulaVal(findFormula.CrAmount, itemDet, scopeTran));
                        }
                        ledgerIdColl.push({ id: itemDet.LedgerId, text: 'Item_Led', amount: itemDet.Amount, DrAmount: drAmt, CrAmount: crAmt });
                    }

                    if (itemDet.UDFFeildsColl && itemDet.UDFFeildsColl.length > 0) {
                        angular.forEach(itemDet.UDFFeildsColl, function (udf) {
                            if (udf.LedgerId > 0) {
                                var uname = 'U_Led' + udf1.SNo;
                                var findU = mx(ledgerIdColl).firstOrDefault(p1 => p1.id == udf.LedgerId);
                                if (findU) {
                                    var drAmt = 0, crAmt = 0;
                                    var findFormula = allocationQry.firstOrDefault(p1 => p1.Particular == 'Item_Led');
                                    if (findFormula) {
                                        if (findFormula.DrAmount && findFormula.DrAmount.length > 0)
                                            drAmt = isEmptyNum(getFormulaVal(findFormula.DrAmount, itemDet, scopeTran));

                                        if (findFormula.CrAmount && findFormula.CrAmount.length > 0)
                                            crAmt = isEmptyNum(getFormulaVal(findFormula.CrAmount, itemDet, scopeTran));
                                    }

                                    findU.amount = findU.amount + isEmptyNum(udf.UDFValue);
                                    find.DrAmount = find.DrAmount + drAmt;
                                    find.CrAmount = find.CrAmount + crAmt;
                                } else {

                                    var drAmt = 0, crAmt = 0;
                                    var findFormula = allocationQry.firstOrDefault(p1 => p1.Particular == uname);
                                    if (findFormula) {
                                        if (findFormula.DrAmount && findFormula.DrAmount.length > 0)
                                            drAmt = isEmptyNum(getFormulaVal(findFormula.DrAmount, itemDet, scopeTran));

                                        if (findFormula.CrAmount && findFormula.CrAmount.length > 0)
                                            crAmt = isEmptyNum(getFormulaVal(findFormula.CrAmount, itemDet, scopeTran));
                                    }

                                    ledgerIdColl.push({ id: itemDet.LedgerId, text: uname, amount: isEmptyNum(udf.UDFValue), DrAmount: drAmt, CrAmount: crAmt });
                                }
                            }
                        });
                    }
                }
            } else if (itemDet.RowType == 'L') {
                if (itemDet.costLedgerDetail) {

                    var find = mx(ledgerIdColl).firstOrDefault(p1 => p1.id == itemDet.LedgerId);
                    if (find) {
                        var drAmt = 0, crAmt = 0;
                        var findFormula = allocationQry.firstOrDefault(p1 => p1.Particular == itemDet.costLedgerDetail.Code);
                        if (findFormula) {
                            if (findFormula.DrAmount && findFormula.DrAmount.length > 0)
                                drAmt = isEmptyNum(getFormulaVal(findFormula.DrAmount, itemDet, scopeTran));

                            if (findFormula.CrAmount && findFormula.CrAmount.length > 0)
                                crAmt = isEmptyNum(getFormulaVal(findFormula.CrAmount, itemDet, scopeTran));
                        }

                        find.amount = find.amount + itemDet.Amount;
                        find.DrAmount = find.DrAmount + drAmt;
                        find.CrAmount = find.CrAmount + crAmt;
                    } else {

                        var drAmt = 0, crAmt = 0;
                        var findFormula = allocationQry.firstOrDefault(p1 => p1.Particular == itemDet.costLedgerDetail.Code);
                        if (findFormula) {
                            if (findFormula.DrAmount && findFormula.DrAmount.length > 0)
                                drAmt = isEmptyNum(getFormulaVal(findFormula.DrAmount, itemDet, scopeTran));

                            if (findFormula.CrAmount && findFormula.CrAmount.length > 0)
                                crAmt = isEmptyNum(getFormulaVal(findFormula.CrAmount, itemDet, scopeTran));
                        }

                        ledgerIdColl.push({ id: itemDet.LedgerId, text: itemDet.costLedgerDetail.Code, amount: itemDet.Amount, DrAmount: drAmt, CrAmount: crAmt });
                    }
                }
            }
        });


        angular.forEach(tran.VoucherLedAllocationColl, function (vled) {

            if (vled.Particular.substring(0, 2) == 'vu') {
                var ledId = 0;
                ledId = isEmptyNum(getFormulaVal(vled.Particular, null, scopeTran));

                if (ledId > 0)
                    vled.LedgerId = ledId;
            }

        });

        var ledIdQry = mx(ledgerIdColl);
        angular.forEach(tran.VoucherLedAllocationColl, function (vled) {
            var findRow = ledIdQry.where(p1 => p1.text == vled.Particular);
            if (findRow && findRow.count() > 0) {
                var groupBy = findRow.groupBy(p1 => p1.id);
                angular.forEach(groupBy, function (gp) {
                    var elQry = mx(gp.elements);
                    var newAllocation = {
                        DrAmount: elQry.sum(p1 => p1.DrAmount),
                        CrAmount: elQry.sum(p1 => p1.CrAmount),
                        LedgerId: gp.key,
                        Narration: vled.Remarks,
                    };
                    allocationColl.push(newAllocation);
                });
            } else {

                var drAmt = 0, crAmt = 0;
                if (vled.DrAmount && vled.DrAmount.length > 0)
                    drAmt = isEmptyNum(getFormulaVal(vled.DrAmount, null, scopeTran));

                if (vled.CrAmount && vled.CrAmount.length > 0)
                    crAmt = isEmptyNum(getFormulaVal(vled.CrAmount, null, scopeTran));

                var newAllocation = {
                    DrAmount: drAmt,
                    CrAmount: crAmt,
                    LedgerId: vled.LedgerId > 0 ? vled.LedgerId : 0,
                    LedgerCode: vled.Particular,
                    Narration: vled.Remarks,
                };
                allocationColl.push(newAllocation);

            }
        });

        return allocationColl;
    };

    this.getNewEntityFormula = function (fieldColl, tran, colName) {

        if (fieldColl && fieldColl.length > 0) {
            angular.forEach(fieldColl, function (udf) {
                if (udf.Formula && udf.Formula.length > 0 && colName != udf.Name) {
                    var formula = udf.Formula;
                    var uname = 'u' + udf.SNo;
                    formula = formula.replaceAll(uname, isEmptyNum(tran[udf.Name]));

                    angular.forEach(fieldColl, function (udf1) {
                        var uname1 = 'u' + udf1.SNo;
                        formula = formula.replaceAll(uname1, isEmptyNum(tran[udf1.Name]));
                    });

                    var enPrColl = extractStringVariables(formula);
                    if (enPrColl && enPrColl.length > 0) {
                        enPrColl.forEach(function (pr) {
                            formula = formula.replaceAll(pr, isEmptyNum(tran[pr]));
                        });
                    }

                    try {
                        if (udf.IsManual == true) {

                        } else {
                            var nVal = math.evaluate(formula);
                            tran[udf.Name] = isEmptyNum(nVal);
                        }
                    } catch { }

                } else if (udf.Name == colName) {
                    //udf.IsManual = true;
                }
            });
        }

        var tmpDataColl = [];
        if (tran.ChieldEntities && tran.ChieldEntities.length > 0) {
            tran.ChieldEntities.forEach(function (ce) {
                if (ce.RowsDataColl && ce.RowsDataColl.length > 0 && ce.FieldColl && ce.FieldColl.length > 0) {
                    ce.RowsDataColl.forEach(function (rowData) {
                        tmpDataColl.push(rowData);
                        ce.FieldColl.forEach(function (fc) {
                            if (fc.Formula && fc.Formula.length > 0) {
                                var formula = fc.Formula;
                                var enPrColl = extractStringVariables(formula);
                                if (enPrColl && enPrColl.length > 0) {
                                    enPrColl.forEach(function (pr) {
                                        formula = formula.replaceAll(pr, isEmptyNum(rowData[pr]));
                                    });
                                }

                                try {
                                    var nVal = math.evaluate(formula);
                                    rowData[fc.Name] = isEmptyNum(nVal);
                                } catch { }
                            }
                        });
                    });

                }
            });
        }


        if (fieldColl && fieldColl.length > 0) {
            angular.forEach(fieldColl, function (udf) {
                if (udf.Formula && udf.Formula.length > 0 && colName != udf.Name) {
                    var formula = udf.Formula;
                    var enPrColl = extractStringVariables(formula);
                    if (enPrColl && enPrColl.length > 0) {
                        enPrColl.forEach(function (pr) {
                            if (pr.startsWith("sum_")) {
                                var enName = pr.replace('sum_', '');
                                var sumVal = $filter('sumOfValue')(tmpDataColl, enName);
                                formula = formula.replaceAll(pr, isEmptyNum(sumVal));
                            }
                            else if (pr.startsWith("min_")) {
                                var enName = pr.replace('min_', '');
                                var minVal = $filter('minOfValue')(tmpDataColl, enName);
                                formula = formula.replaceAll(pr, isEmptyNum(minVal));
                            }
                            else if (pr.startsWith("max_")) {
                                var enName = pr.replace('max_', '');
                                var maxVal = $filter('maxOfValue')(tmpDataColl, enName);
                                formula = formula.replaceAll(pr, isEmptyNum(maxVal));
                            }
                            else if (pr.startsWith("avg_")) {
                                var enName = pr.replace('avg_', '');
                                var avgVal = $filter('avgOfValue')(tmpDataColl, enName);
                                formula = formula.replaceAll(pr, isEmptyNum(avgVal));
                            }

                            formula = formula.replaceAll(pr, isEmptyNum(tran[pr]));
                        });

                    }

                    try {
                        var nVal = math.evaluate(formula);
                        tran[udf.Name] = isEmptyNum(nVal);
                    } catch { }

                }
            });
        }


        //Source Variable Replace
        if (fieldColl && fieldColl.length > 0) {
            angular.forEach(fieldColl, function (udf) {
                if (udf.Source && udf.Source.length > 0 && colName != udf.Name) {
                    var formula = udf.Source;
                    var enPrColl = extractVariables(formula);
                    if (enPrColl && enPrColl.length > 0) {
                        enPrColl.forEach(function (pr) {
                            var pr1 = pr.replaceAll('@', '');
                            var fv = tran[pr1];
                            if (fv != null && fv != undefined) {
                                formula = formula.replaceAll(pr, tran[pr1]);
                            }


                        });
                    }

                    udf.Source_Qry = formula;
                }
            });
        }

        if (tran.ChieldEntities && tran.ChieldEntities.length > 0) {
            tran.ChieldEntities.forEach(function (ce) {
                if (ce.RowsDataColl && ce.RowsDataColl.length > 0 && ce.FieldColl && ce.FieldColl.length > 0) {
                    ce.RowsDataColl.forEach(function (rowData) {
                        ce.FieldColl.forEach(function (fc) {
                            if (fc.Source && fc.Source.length > 0) {
                                var formula = fc.Source;
                                var enPrColl = extractVariables(formula);
                                if (enPrColl && enPrColl.length > 0) {
                                    enPrColl.forEach(function (pr) {

                                        var pr1 = pr.replaceAll('@', '');
                                        var fv = tran[pr1];
                                        if (fv != null && fv != undefined) {
                                            formula = formula.replaceAll(pr, fv);
                                        }

                                        fv = rowData[pr1];
                                        if (fv != null && fv != undefined) {
                                            formula = formula.replaceAll(pr, fv);
                                        }
                                    });
                                }
                                fc.Source_Qry = formula;
                            }
                        });
                    });

                }
            });
        }


    };

    //Added By Suresh on 24 Shrawan
    this.getGenderList = function () {

        var dataColl = [
            { id: 1, text: 'Male' },
            { id: 2, text: 'Female' },
            { id: 3, text: 'Other' }
        ];

        return dataColl;
    };


    this.getMonthList = function () {
        var dataColl = [
            { id: 1, text: 'Baishakh' },
            { id: 2, text: 'Jestha' },
            { id: 3, text: 'Asar' },
            { id: 4, text: 'Shrawan' },
            { id: 5, text: 'Bhadau' },
            { id: 6, text: 'Aswin' },
            { id: 7, text: 'Kartik' },
            { id: 8, text: 'Mansir' },
            { id: 9, text: 'Poush' },
            { id: 10, text: 'Magh' },
            { id: 11, text: 'Falgun' },
            { id: 12, text: 'Chaitra' }
        ];

        return dataColl;
    };

    this.GetOtCalculation = function () {

        var dataColl = [
            { id: 1, text: 'OT = OutTime-ShiftEndtime' },
            { id: 2, text: 'OT = Workinghrs-Shifthrs' },
            { id: 3, text: 'OT =EarlyComing+LateDeparture' },
            { id: 4, text: 'OT =NOT ALLOW' }

        ];

        return dataColl;
    };

    this.GetWeeklyoff = function () {

        var dataColl = [
            { id: 1, text: 'Sunday' },
            { id: 2, text: 'Munday' },
            { id: 3, text: 'Tuesday' },
            { id: 4, text: 'Wednesday' },
            { id: 5, text: 'Thursday' },
            { id: 6, text: 'Friday' },
            { id: 7, text: 'Saturday' },


        ];

        return dataColl;
    };
    this.GetWeeklyoffType = function () {

        var dataColl = [
            { id: 1, text: 'None' },
            { id: 2, text: 'HalfDay' },
            { id: 3, text: 'FullDay' },

        ];

        return dataColl;
    };

    this.GetSinglePunchPolicy = function () {

        var dataColl = [
            { id: 1, text: 'None' },
            { id: 2, text: 'Absent On Single Punch' },
            { id: 3, text: 'Half Day On Single Punch' },

        ];

        return dataColl;
    };

    this.getPeriodDateAsStr = function (fromDateDet, toDateDet, dateStyle) {
        var period = '';
        if (fromDateDet && toDateDet) {
            if (dateStyle == 1) {
                period = $filter('date')(fromDateDet.dateAD, 'yyyy-MM-dd') + ' TO ' + $filter('date')(toDateDet.dateAD, 'yyyy-MM-dd');
            }
            else if (dateStyle == 2) {
                period = fromDateDet.dateBS + ' TO ' + toDateDet.dateBS;
            }
            else if (dateStyle == 3) {
                period = fromDateDet.dateBS + '(' + $filter('date')(fromDateDet.dateAD, 'yyyy-MM-dd') + ')' + ' TO ' + toDateDet.dateBS + '(' + $filter('date')(toDateDet.dateAD, 'yyyy-MM-dd') + ')';
            }
            else if (dateStyle == 4) {
                period = $filter('date')(fromDateDet.dateAD, 'yyyy-MM-dd') + '(' + fromDateDet.dateBS + ')' + ' TO ' + $filter('date')(toDateDet.dateAD, 'yyyy-MM-dd') + '(' + toDateDet.dateBS + ')';
            }
            else {
                period = fromDateDet.dateBS + ' TO ' + toDateDet.dateBS;
            }
        }

        return period;
    }

    this.getDateAsStr = function (adDate, bsDate, dateStyle) {
        var period = '';
        if (adDate && bsDate) {
            if (dateStyle == 1) {
                period = $filter('date')(new Date(adDate), 'yyyy-MM-dd');
            }
            else if (dateStyle == 2) {
                period = bsDate;
            }
            else if (dateStyle == 3) {
                period = bsDate + '-' + $filter('date')(new Date(adDate), 'yyyy-MM-dd');
            }
            else if (dateStyle == 4) {
                period = $filter('date')(new Date(adDate), 'yyyy-MM-dd') + bsDate;
            }
            else {
                period = bsDate
            }
        }

        return period;
    }
    this.validateAndFocus = function (fieldId, message, isSelect2 = false) {
        var el = document.getElementById(fieldId);
        if (!el) { console.log('Element not found: ' + fieldId); return false; }
        var isSelect = el.tagName === 'SELECT';  // auto detect dropdown
        var isEmpty = isSelect2 ? $(el).val().length === 0
            : isSelect ? !el.value || el.value === ""
                : !el.value.trim();
        if (isEmpty) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.focus();
            if (isSelect2) {
                var s2 = $('#' + fieldId).next('.select2-container').find('.select2-selection');
                s2.css('border', '1px solid red');
                $('#' + fieldId).one('change', function () { s2.css('border', ''); });
            } else {
                el.style.border = '1px solid red';
                el.addEventListener(isSelect ? 'change' : 'input', function () {
                    el.style.border = '';
                }, { once: true });
            }
            Swal.fire({ text: message, icon: 'warning', confirmButtonText: 'OK' });
            return false;
        }
        return true;
    }

});