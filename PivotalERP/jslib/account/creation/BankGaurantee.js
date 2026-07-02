app.controller("BankGaurantee", function ($scope, $http, GlobalServices, $timeout, $filter) {
    $scope.Title = 'BankGaurantee';

    $scope.loadingstatus = "stop";

    LoadData();

    $scope.IsValidBankGaurantee = function () {
        if ($scope.beData.LedgerId > 0) {
        } else {
            Swal.fire("Please ! Enter Party Name");
            return false;
        }

        if (!$scope.beData.IssuesDateDet) {
            Swal.fire("Please ! Enter Issue Date");
            return false;
        }

        if (!$scope.beData.ExpiredDateDet) {
            Swal.fire("Please ! Enter Expire Date");
            return false;
        }

        return true;
    }

   

    function LoadData() {
        $('.select2').select2();
        $scope.loadingstatus = "stop";

        $scope.FromToColl = [{ id: 1, text: 'From' }, { id: 2, text: 'To' }];

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.perPage = {
            BankGaurantee: GlobalServices.getPerPageRow(),

        };
        $scope.searchData = {
            BankGaurantee: ''
        };
        $scope.currentPages = {
            BankGaurantee: 1

        };

        $scope.BankColl = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllBank",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BankColl = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $timeout(function () {
            $scope.DocumentTypeList = [];
            $scope.DocumentTypeList_Qry = [];
            $http({
                method: 'GET',
                url: base_url + "Global/GetDocumentTypes",
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.DocumentTypeList = res.data.Data;
                    $scope.DocumentTypeList_Qry = mx(res.data.Data);
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        });

        $scope.beData =
        {
            LedgerId: 0,
            BankName: '',
            BranchName: '',
            BGNO: 0,
            Amount: 0,
            IssuesDate: '2078-12-12',
            ExpiredDate: '2078-12-13',
            Remarks: '',
            Status: true,             
            Mode: 'Save',
            TranId: 0,
            UserId: 0,
            FromTo: 1,
            MarginHoldAmt:0,
            DocumentColl: [],
        };
    };
    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            LedgerId: 0,
            BankName: '',
            BranchName: '',
            BGNO: 0,
            Amount: 0,
            IssuesDate: '2078-12-12',
            ExpiredDate: '2078-12-13',
            Remarks: '',
            Status: true,
            Mode: 'Save',
            TranId: 0,
            UserId: 0,
            FromTo: 1,
            MarginHoldAmt: 0,
            DocumentColl: [],

        };

    }
   
    $scope.CurDocument = {};
    $scope.AddMoreFiles = function () {

        if ($scope.CurDocument.DocumentTypeId > 0 && $scope.CurDocument.Document_TMP) {
            var findDocType = $scope.DocumentTypeList_Qry.firstOrDefault(p1 => p1.DocumentTypeId == $scope.CurDocument.DocumentTypeId);
            var file = $scope.CurDocument.Document_TMP[0];
            if (findDocType) {
                $scope.beData.DocumentColl.push({
                    DocumentTypeId: findDocType.DocumentTypeId,
                    DocumentTypeName: findDocType.Name,
                    File: file,
                    Name: file.name,
                    Type: file.type,
                    Size: file.size,
                    Description: '',
                    DocumentData: $scope.CurDocument.DocumentData,
                    DocPath: null
                });

                $scope.CurDocument = {};

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
   

    $scope.AddBankGaurantee = function () {
        if ($scope.IsValidBankGaurantee() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateBankGuarantee();
                    }

                });
            }
            else
                $scope.CallSaveUpdateBankGuarantee();
        }
    };

    $scope.CallSaveUpdateBankGuarantee = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        if ($scope.beData.IssuesDateDet) {
            var dDet = $scope.beData.IssuesDateDet;
            $scope.beData.IssuesDate = $filter('date')(new Date(dDet.dateAD), 'yyyy-MM-dd');
            $scope.beData.INY = dDet.NY;
            $scope.beData.INM = dDet.NM;
            $scope.beData.IND = dDet.ND;
        }
            

        if ($scope.beData.ExpiredDateDet) {
            var dDet = $scope.beData.ExpiredDateDet;
            $scope.beData.ExpiredDate = $filter('date')(new Date(dDet.dateAD), 'yyyy-MM-dd');
            $scope.beData.ENY = dDet.NY;
            $scope.beData.ENM = dDet.NM;
            $scope.beData.END = dDet.ND;
        }            

        var filesColl = $scope.beData.DocumentColl;

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveBankGuarantee",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.files) {
                    for (var i = 0; i < data.files.length; i++) {
                        formData.append("file" + i, data.files[i].File);
                    }
                }

                return formData;
            },
            data: { jsonData: $scope.beData, files: filesColl }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllBankGuarantee();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAllBankGuarantee = function () {

        $scope.BankGauranteeColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetBankGuarantee",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.BankGauranteeColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }
    $scope.getBankGuaranteeById = function (beData) {

        $scope.loadingstatus = "running";

        var para = {
            TranId: beData.TranId
        };

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetBankGuaranteeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.beData = res.data.Data;

                    if ($scope.beData.IssuesDate) {
                        $scope.beData.IssuesDate_TMP = new Date($scope.beData.IssuesDate);
                        $scope.beData.IssuesDateAD_TMP = new Date($scope.beData.IssuesDate);
                    }
                         
                    if ($scope.beData.ExpiredDate) {
                        $scope.beData.ExpiredDate_TMP = new Date($scope.beData.ExpiredDate);
                        $scope.beData.ExpiredDateAD_TMP = new Date($scope.beData.ExpiredDate);
                    }
                        

                    $scope.beData.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);


        }, function (reason) {
            alert('Failed' + reason);
        });
    };

    $scope.deleteBankGuarantee = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure you want to delete selected BankGuarantee ' + refData.BankName + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var para = { TranId: refData.TranId };
                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/DeleteBankGuarantee",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.BankGauranteeColl.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);

                });
            }

        });
    }

    $scope.ShowPersonalImg = function (docDet) {
        $scope.viewImg = {
            ContentPath: '',
            File: null,
            FileData: null
        };
        if (docDet.DocPath || docDet.File) {
            $scope.viewImg.ContentPath = docDet.DocPath;
            $scope.viewImg.File = docDet.File;
            $scope.viewImg.FileData = docDet.DocumentData;
            $('#PersonalImg').modal('show');
        } else
            Swal.fire('No Image Found');

    };

    $scope.ChangeDate = function (field,dateStyle) {
        $timeout(function () {

            if (field == 'IssuesDate') {
                if (dateStyle == 1) //AD
                {
                    if ($scope.beData.IssuesDateADDet) {
                        $scope.beData.IssuesDate_TMP = new Date($scope.beData.IssuesDateADDet.dateAD);
                    }
                }
                else if (dateStyle == 2) //BS
                {
                    if ($scope.beData.IssuesDateDet) {
                        $scope.beData.IssuesDateAD_TMP = new Date($scope.beData.IssuesDateDet.dateAD);
                    }
                }
            }
            else if (field == 'ExpiredDate') {
                if (dateStyle == 1) //AD
                {
                    if ($scope.beData.ExpiredDateADDet) {
                        $scope.beData.ExpiredDate_TMP = new Date($scope.beData.ExpiredDateADDet.dateAD);
                    }
                }
                else if (dateStyle == 2) //BS
                {
                    if ($scope.beData.ExpiredDateDet) {
                        $scope.beData.ExpiredDateAD_TMP = new Date($scope.beData.ExpiredDateDet.dateAD);
                    }
                }
            }
        });
    }


});