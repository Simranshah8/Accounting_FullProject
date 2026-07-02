app.controller('CompanyRelationshipController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'CompanyRelationship';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            CompanyRelationship: 1,
        };

        $scope.searchData = {
            CompanyRelationship: '',

        };

        $scope.perPage = {
            CompanyRelationship: GlobalServices.getPerPageRow()
        };

        $scope.RelationshipTypeColl = [{ id: 1, text: 'Sister Company' }, { id: 2, text: 'Sub Sidiary' }]

        $scope.newCompanyDetail = {
            TranId: null,
            Name: '',
            DisplayName: '',
            FullAddress: '',
            State: '',
            Country: '',
            ZipCode: '',
            RegNo: '',
            PanVatNo: '',
            Phone: '',
            Fax: '',
            Email: '',
            Website: '',
            RelationshipType: null,
            LogoData: null,
            Mode: 'Save'
        };

    };

    $scope.ClearEmpPhoto = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.newCompanyDetail.LogoData = null;
                $scope.newCompanyDetail.Logo_TMP = [];
                $scope.newCompanyDetail.LogoPath = null;
            });

        });
        $('#imgEmp').attr('src', '');
        $('#imgPhoto1').attr('src', '');
    };

    $scope.ClearDetails = function () {
        $scope.ClearEmpPhoto();
        $scope.newCompanyDetail = {
            Name: '',
            DisplayName: '',
            FullAddress: '',
            State: '',
            Country: '',
            ZipCode: '',
            RegNo: '',
            PanVatNo: '',
            Phone: '',
            Fax: '',
            Email: '',
            Website: '',
            RelationshipType: null,
            LogoData: null,
            Mode: 'Save'

        };

    };




    //************************* CompanyRelationship *********************************
    $scope.IsValidCompanyRelationship = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveCompanyRelationship = function () {
        if ($scope.IsValidCompanyRelationship() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newCompanyDetail.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateCompanyRelationship();
                    }
                });
            } else
                $scope.CallSaveUpdateCompanyRelationship();
        }
    };

    $scope.CallSaveUpdateCompanyRelationship = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        var photo = $scope.newCompanyDetail.Logo_TMP;
        $http({
            method: 'POST',
            url: base_url + "HR/Master/SaveCompanyRelationship",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.logoPhoto && data.logoPhoto.length > 0)
                    formData.append("LogoPhoto", data.logoPhoto[0]);

                return formData;
            },
            data: { jsonData: $scope.newCompanyDetail, logoPhoto: photo }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearDetails();
                $scope.GetAllCompanyRelationship();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllCompanyRelationship = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.CompanyRelationshipList = [];
        $http({
            method: 'POST',
            url: base_url + "HR/Master/GetAllCompanyRelationship",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CompanyRelationshipList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getCompanyRelationshipById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TranId: refData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Master/GetCompanyRelationshipById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newCompanyDetail = res.data.Data;
                $scope.newCompanyDetail.Mode = 'Modify';
                $('#custom-tabs-four-profile-tab').tab('show');


            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.DelCompanyRelationshipById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    TranId: refData.TranId
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Master/DelCompanyRelationship",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllCompanyRelationship();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});