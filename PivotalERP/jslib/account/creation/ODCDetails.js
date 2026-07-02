app.controller("ODCDetails", function ($scope, $http, $timeout, GlobalServices, $filter) {
    $scope.Title = 'ODCDetails';

    LoadData(); 

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
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


        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.perPage = {
            ODCDetails: GlobalServices.getPerPageRow(),

        };
        $scope.searchData = {
            ODCDetails: ''
        };
        $scope.currentPages = {
            ODCDetails: 1

        };
        $scope.beData =
        {
            TranId: 0,
            AgentId: 0,
            LedgerId: 0,
            UserId: 0,
            AgentName: '',
            BankBranch: '',
            BankName: '',
            LedgerName: '',
            Notes: '',
            ChequeNo: '',
            Amount: 0,
            NY: 0,
            NM: 0,
            ND: 0,          
            DocumentColl:[],
            VoucherDate_TMP: new Date(),
        };
        $scope.loadingstatus = "stop";


        $scope.AgentList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllSalesMan",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AgentList = res.data.Data;
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

    };

    $scope.ClearFields = function () {

        $scope.newMaster = {
            TranId: 0
        };
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            TranId: 0,
            AgentId: 0,
            LedgerId: 0,
            UserId: 0,
            AgentName: '',
            BankBranch: '',
            BankName: '',
            LedgerName: '',
            Notes: '',
            ChequeNo: '',
            Amount: 0,
            NY: 0,
            NM: 0,
            ND: 0,     
            DocumentColl: [],
            VoucherDate_TMP: new Date(),
        };

    }
    

    $scope.GetAllODCDetails = function () {


        $scope.ODCColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

      
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetODC",
            dataType: "json",
          
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.ODCColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

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

    $scope.AddODC = function () {
        if ($scope.confirmMSG.Accept == true) {
            var saveModify = $scope.beData.Mode;
            Swal.fire({
                title: 'Do you want to' + saveModify + 'the current data?',
                showCancelButton: true,
                confirmButtonText: saveModify,
            }).then((result) => {
                if (result.isConfirmed) {
                    $scope.CallSaveUpdateODC();
                }

            });
        }
        else
            $scope.CallSaveUpdateODC();
    };

    $scope.CallSaveUpdateODC = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        var filesColl = $scope.beData.DocumentColl;

        if ($scope.beData.VoucherDateDet) {
            var dDet = $scope.beData.VoucherDateDet;
            $scope.beData.VoucherDate = $filter('date')(new Date(dDet.dateAD), 'yyyy-MM-dd');
            $scope.beData.NY = dDet.NY;
            $scope.beData.NM = dDet.NM;
            $scope.beData.ND = dDet.ND;
        } 

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveUpdateODC",
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
                $scope.GetAllODCDetails();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getODCById = function (beData) {

        $scope.loadingstatus = "running";

        var para = {
            TranId: beData.TranId
        };

        $scope.newMaster = {
            TranId: beData.TranId
        };

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetODCById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.beData = res.data.Data;
                    $scope.beData.Mode = 'Modify';

                    if ($scope.beData.VoucherDate) {
                        $scope.beData.VoucherDate_TMP = new Date($scope.beData.VoucherDate);
                        $scope.beData.VoucherDateAD_TMP = new Date($scope.beData.VoucherDate);
                    }
                        

                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);


        }, function (reason) {
            alert('Failed' + reason);
        });
    };

    $scope.deleteODC = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure you want to delete selected ODC ' + refData.BankName + '?',
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
                    url: base_url + "Account/Creation/deleteODC",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.ODCColl.splice(ind, 1);
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

    $scope.AuditLogColl = [];
    $scope.ShowAuditLog = function () {

        $scope.AuditLogColl = {};
        if ($scope.newMaster.TranId > 0) {

            $scope.loadingstatus = "running";
            showPleaseWait();

            GlobalServices.getAuditLog(EntityId, $scope.newMaster.TranId).then(function (res1) {
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

    $scope.ChangeDate = function (field, dateStyle) {
        $timeout(function () {

            if (field == 'VoucherDate') {
                if (dateStyle == 1) //AD
                {
                    if ($scope.beData.VoucherDateADDet) {
                        $scope.beData.VoucherDate_TMP = new Date($scope.beData.VoucherDateADDet.dateAD);
                    }
                }
                else if (dateStyle == 2) //BS
                {
                    if ($scope.beData.VoucherDateDet) {
                        $scope.beData.VoucherDateAD_TMP = new Date($scope.beData.VoucherDateDet.dateAD);
                    }
                }
            }

        });
    }
});