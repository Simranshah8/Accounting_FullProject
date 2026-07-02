app.controller('PrintLetterTemplateController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'PrintLetterTemplate';

    LoadData();

    function LoadData() {
        $('.select2').select2();
          
        $scope.variableList = [
            "Name",
            "EmployeeAddress",
            "DOB",
            "DESIGNATION",
            "Department",
            "ServiceType",
            "Category",
            "Company",
            "CompanyAddress",
            "JoiningDate",
            "TotalWorkingYear",
            "Branch",
            "GrossSalary",
            //New add
            "BloodGroup",
            "SubBranch",
            //----- Transfer Last Log--------
            "TransferFromDepartment",
            "TransferToDepartment",
            "TransferFromBranch",
            "TransferToBranch",
            "TransferFromCompany",
            "TransferToCompany",
            "TransferFromDesignation",
            "TransferToDesination",
            //--------Promotion Last Log--------
            "PromotionFromBranch",
            "PromotionToBranch",
            "PromotionFromDesignation",
            "PromotionToDesination",
            "PromotionFromDepartment",
            "PromotionToDepartment",
            //----- EmployeeJd-------
            "KeyResponsibilities",
            //----- EmployeePerformance
            "Feedback",
            "FeedBackRemarks",
            "FinalRating"
        ].map(x => {
            return {
                datatype: x
            };
        });

        $scope.beData = {
            PrintLetterTemplateId: null,
            UserId: null,
            TemplateTypeId: null,
            Description: '',
            Mode: 'Print'
        };

        $scope.TemplateTypeList = [];
        $http({
            method: 'Post',
            url: base_url + "HR/Master/GetAllTemplateType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.TemplateTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.CompanyDetail = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetCompanyDetail",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CompanyDetail = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    };

    $scope.ClearPrintLetterTemplate = function () {
        $scope.beData = {
            PrintLetterTemplateId: null,
            UserId: null,
            TemplateTypeId: null,
            Deccription: '',
            Mode: 'Print'
        };
    }

    $scope.beData.Variable = "";

    $scope.addVariable = function (val) {
        if (!$scope.beData.Description) {
            $scope.beData.Description = '';
        }
        var formatted = '{{' + val + '}}';
        $scope.beData.Deccription += ' ' + formatted;
        if (!$scope.beData.Variable) {
            $scope.beData.Variable = formatted;
        } else if ($scope.beData.Variable.indexOf(formatted) === -1) {
            $scope.beData.Variable += ',' + formatted;
        }
        $scope.generatePreview();
    };

    $scope.generatePreview = function (emp) {
        if (!$scope.beData.Description) return;
        var text = $scope.beData.Description;
        // Replace variables with employee data
        text = text.replace(/##name##/g, emp.Name || '');
        text = text.replace(/##employeeaddress##/g, emp.Address || '');
        text = text.replace(/##dob##/g, emp.DOB || '');
        text = text.replace(/##designation##/g, emp.Designation || '');
        text = text.replace(/##department##/g, emp.Department || '');
        text = text.replace(/##servicetype##/g, emp.ServiceType || '');
        text = text.replace(/##category##/g, emp.Category || '');
        text = text.replace(/##company##/g, emp.Company || '');
        text = text.replace(/##companyaddress##/g, emp.CompanyAddress || '');
        text = text.replace(/##joiningdate##/g, emp.JoiningDate || '');
        text = text.replace(/##totalworkingyear##/g, emp.TotalWorkingYear || '');
        text = text.replace(/##branch##/g, emp.Branch || '');
        text = text.replace(/##grosssalary##/g, emp.GrossSalary || '');
        text = text.replace(/##bloodgroup##/g, emp.BloodGroup || '');
        text = text.replace(/##subbranch##/g, emp.SubBranch || '');
        text = text.replace(/##transferfromdepartment##/g, emp.TransferFromDepartment || '');
        text = text.replace(/##transfertodepartment##/g, emp.TransferToDepartment || '');
        text = text.replace(/##transferfrombranch##/g, emp.TransferFromBranch || '');
        text = text.replace(/##transfertobranch##/g, emp.TransferToBranch || '');
        text = text.replace(/##transferfromcompany##/g, emp.TransferFromCompany || '');
        text = text.replace(/##transfertocompany##/g, emp.TransferToCompany || '');
        text = text.replace(/##transferfromdesignation##/g, emp.TransferFromDesignation || '');
        text = text.replace(/##transfertodesination##/g, emp.TransferToDesination || '');
        text = text.replace(/##promotionfrombranch##/g, emp.PromotionFromBranch || '');
        text = text.replace(/##promotiontobranch##/g, emp.PromotionToBranch || '');
        text = text.replace(/##promotionfromdesignation##/g, emp.PromotionFromDesignation || '');
        text = text.replace(/##promotiontodesination##/g, emp.PromotionToDesination || '');
        text = text.replace(/##promotionfromdepartment##/g, emp.PromotionFromDepartment || '');
        text = text.replace(/##promotiontodepartment##/g, emp.PromotionToDepartment || '');
        text = text.replace(/##feedback##/g, emp.Feedback || '');
        text = text.replace(/##feedbackremarks##/g, emp.FeedBackRemarks || '');
        text = text.replace(/##finalrating##/g, emp.FinalRating || '');
        var responsibilities = '';
        if (emp.KeyResponsibilitiesColl && emp.KeyResponsibilitiesColl.length > 0) {
            responsibilities = '<ul>';
            emp.KeyResponsibilitiesColl.forEach(function (x) {
                responsibilities += '<li>' + (x.Responsibility || '') + '</li>';
            });
            responsibilities += '</ul>';
        }
        text = text.replace(/##keyresponsibilities##/g, responsibilities);
        $scope.beData.PreviewDescription = text;
    };

    //************************* Print Letter Template *********************************
    $scope.GetLetterTemplateById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.beData = {}
        var para = {
            TemplateTypeId: refData.TemplateTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Master/getLetterTemplateById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.beData = res.data.Data;
                $scope.beData.PreviewDescription = res.data.Data.Description;
                $scope.beData.Mode = 'Print';
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.GetUserDetailsById = function (refData) {
        if (refData.UserId) {
            $scope.loadingstatus = "running";
            showPleaseWait();
            $scope.emp = {}
            var UserId = refData.EmployeeDetails.UserId;
            var para = {
                UsersId: UserId
            };
            $http({
                method: 'POST',
                url: base_url + "HR/Master/GetUserDetailsById",
                dataType: "json",
                data: JSON.stringify(para)
            }).then(function (res) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.emp = res.data.Data;
                    $scope.generatePreview($scope.emp);
                } else {
                    Swal.fire(res.data.ResponseMSG);
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }
    };

    //$scope.PrintTemplateDescription = function () {
    //    if (!$scope.beData.PreviewDescription) return;
    //    var company = $scope.CompanyDetail || {};
    //    var printContent = $scope.beData.PreviewDescription;
    //    var printWindow = window.open('', '_blank');
    //    printWindow.document.write(`
    //    <html>
    //    <head>
    //        <title>Print</title>
    //        <style>
    //            body { font-family: Arial; padding: 20px; }
    //            .header { display: flex; align-items: center; justify-content: space-between; }
    //            .center { text-align: center; width: 100%; }
    //            img { height: 60px; }
    //        </style>
    //    </head>
    //    <body>
    //        <div class="header">
    //            <div>
    //                <img src="${company.CompanyLogoPath || ''}" />
    //            </div>
    //            <div class="center">
    //                <h3 style="margin:0;">${company.Name || ''}</h3>
    //                <div>${company.Address || ''}, ${company.Country || ''}</div>
    //                <div>
    //                    ${company.PhoneNo || ''}
    //                    ${company.PhoneNo && company.EmailId ? ',' : ''}
    //                    ${company.EmailId || ''}
    //                </div>
    //            </div>
    //            <div></div>
    //        </div>
    //        <hr/>
    //        ${printContent}

    //    </body>
    //    </html>
    //`);
    //    printWindow.document.close();
    //    printWindow.focus();
    //    printWindow.print();
    //    printWindow.close();
    //};
    $scope.PrintTemplateDescription = function () {
        if (!$scope.beData.PreviewDescription) return;
        var printContent = $scope.beData.PreviewDescription;
        var printWindow = window.open('', '_blank');
        printWindow.document.write(`
        <html>
        <head>
            <title>Print</title>
        </head>
        <body>
            ${printContent}
        </body>
        </html>
    `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };


});