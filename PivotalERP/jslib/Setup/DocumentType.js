app.controller("DocumentTypeCtrl", function ($scope, $http,$timeout,GlobalServices) {
    $scope.Title = 'Narration Master';

    LoadData();

    function LoadData() {
        $scope.loadingstatus = "stop";


        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.perPage = {
            DocumentType: GlobalServices.getPerPageRow(),

        };
        $scope.currentPages = {
            DocumentType: 1

        };
        $scope.searchData = {
            DocumentType: ''

        };

        $scope.beData =
        {
            DocumentTypeId: 0,
            Name: '',
            Alias: '',
            Description: '',
            VoucherTypes: [],
            Mode: 'Save'
        };

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetVoucherTypes",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VoucherTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.CheckedAll = false;


    };
    $scope.CheckAllVoucher = function () {
        angular.forEach($scope.VoucherTypeList, function (vt) {
            vt.IsChecked = $scope.CheckedAll;
        });
    }

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            DocumentTypeId: 0,
            Name: '',
            Alias: '',
            Description: '',
            VoucherTypes: [],
            Mode: 'Save'
        };

        $scope.CheckedAll = false;
        angular.forEach($scope.VoucherTypeList, function (vt) {
            vt.IsChecked = false;
        });

    }


    $scope.GetAllDocumentTypeList = function () {
        $scope.noofrows = 10;

        $scope.DocumentTypeColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllDocumentType",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.DocumentTypeColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.Validate = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter Valid Document Type Name");
            return false;
        }
        else
            return true;
    }


    $scope.AddDocumentType = function () {
        if ($scope.Validate() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateDocumentType();
                    }

                });
            }
            else
                $scope.CallSaveUpdateDocumentType();
        }
    };

    $scope.CallSaveUpdateDocumentType = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $scope.beData.VoucherTypes = [];
        angular.forEach($scope.VoucherTypeList, function (vt) {
            if (vt.IsChecked && vt.IsChecked == true)
                $scope.beData.VoucherTypes.push(vt.id);
        });

        $http({
            method: 'POST',
            url: base_url + "Setup/Security/SaveDocumentType",
            headers: { 'content-Type': undefined },

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
                $scope.ClearFields();
                $scope.GetAllDocumentTypeList();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }
    

    $scope.getDocumentTypeById = function (beData) {

        $scope.loadingstatus = "running";
        showPleaseWait();

        var para = {
            DocumentTypeId: beData.DocumentTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetDocumentTypeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {

                hidePleaseWait();
                $scope.loadingstatus = "stop";

                $timeout(function () {
                    $scope.beData = res.data.Data;

                    var mxVT = mx(res.data.Data.VoucherTypes);
                    angular.forEach($scope.VoucherTypeList, function (vt)
                    {
                        if (mxVT.contains(vt.id)) {
                            vt.IsChecked = true;
                        } else
                            vt.IsChecked = false;
                    });

                    $scope.beData.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    }
    $scope.deleteDocumentType = function (refData, ind) {

        Swal.fire({
            //scope: $scope,
            title: 'Are you sure you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            icon: "info",
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var para = { DocumentTypeId: refData.DocumentTypeId };
                $http({
                    method: 'POST',
                    url: base_url + "Setup/Security/DeleteDocumentType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.DocumentTypeColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }
    $scope.pageChangeHandler = function (num) {
        console.log('page changed to ' + num);
    };


});