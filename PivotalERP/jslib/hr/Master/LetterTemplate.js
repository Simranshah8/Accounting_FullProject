app.controller('LetterTemplateController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'LetterTemplate';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            LetterTemplate: 1,
        };

        $scope.searchData = {
            LetterTemplate: '',

        };

        $scope.perPage = {
            LetterTemplate: GlobalServices.getPerPageRow()
        };

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
            LetterTemplateId: null,
            TemplateTypeId: null,
            Description: '',
            Variables: '',
            Mode: 'Save'
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

    };
    $scope.ClearLetterTemplate = function () {
        $scope.beData = {
            LetterTemplateId: null,
            Name: '',
            Description: '',
            Variables: '',
            Mode: 'Save'
        };
    }

    // store selected variables
    $scope.beData.Variable = "";

    // insert variable
    $scope.addVariable = function (val) {
        if (!$scope.beData.Description) {
            $scope.beData.Description = '';
        }
        var formatted = '{{' + val + '}}';
        $scope.beData.Description += ' ' + formatted;
        if (!$scope.beData.Variable) {
            $scope.beData.Variable = formatted;
        } else if ($scope.beData.Variable.indexOf(formatted) === -1) {
            $scope.beData.Variable += ',' + formatted;
        }
        $scope.generatePreview();
    };
    var emp = null;
    $scope.getEmployeeUserId = function (beData) {
        emp = beData.EmployeeDetails;
        $scope.generatePreview(emp);
    };
    $scope.generatePreview = function () {
        if (!$scope.beData.Deccription) return;
        var text = $scope.beData.Deccription;
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

        $scope.beData.Deccription = text;
    };



    //************************* LetterTemplate *********************************
    $scope.IsValidLetterTemplate = function () {
        return true;
    }

    $scope.SaveLetterTemplate = function () {
        if ($scope.IsValidLetterTemplate() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateLetterTemplate();
                    }
                });
            } else
                $scope.CallSaveUpdateLetterTemplate();
        }
    };

    $scope.CallSaveUpdateLetterTemplate = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "HR/Master/SaveLetterTemplate",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.beData }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearLetterTemplate();
                $scope.GetAllLetterTemplate();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllLetterTemplate = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.LetterTemplateList = [];
        $http({
            method: 'Post',
            url: base_url + "HR/Master/GetAllLetterTemplate",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LetterTemplateList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getLetterTemplateById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
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
                $scope.beData.Mode = 'Modify';
                $('#custom-tabs-four-profile-tab').tab('show');


            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.DelLetterTemplateById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    LetterTemplateId: refData.LetterTemplateId
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Master/DelLetterTemplate",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllLetterTemplate();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }


});