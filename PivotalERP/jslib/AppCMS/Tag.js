app.controller("TagController", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'Tag';

    $scope.LoadData = function () {
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            TagSection: 1

        };

        $scope.searchData = {
            TagSection: ''

        };

        $scope.perPage = {
            TagSection: GlobalServices.getPerPageRow(),

        };

        $scope.ProductList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllProduct",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.beData =
        {
            TagId: 0,
            Badge: '',
            Title: '',
            ProductId: null,
            Photo: '',
            Mode: 'Save',
        };
        $scope.GetAllTagSection();

    };

    $scope.ClearPhoto = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.beData.PhotoData = null;
                $scope.beData.Photo_TMP = [];
            });

        });
        $('#imgPhoto1').attr('src', '');
    };

    $scope.ClearFields = function () {
        $scope.ClearPhoto();
        $scope.beData =
        {
            TagId: 0,
            Badge: '',
            Title: '',
            ProductId: null,
            Photo: '',
            Mode: 'Save',
        };
    }

    $scope.IsValidTag = function () {
        if ($scope.beData.Badge.isEmpty()) {
            Swal.fire('Please ! Enter Badge Text');
        	return false;
        }
        if ($scope.beData.Title.isEmpty()) {
            Swal.fire('Please ! Enter Title');
        	return false;
        }
        if (!$scope.beData.ProductId) {
            Swal.fire('Please ! Select Product');
        	return false;
        }
        if (!$scope.beData.PhotoData && !$scope.beData.Photo) {
            Swal.fire('Please! Choose a Photo');
            return false;
        }
        return true;
    }

    $scope.SaveUpdateTag = function () {
        if ($scope.IsValidTag() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateTag();
                    }
                });
            } else
                $scope.CallSaveUpdateTag();

        }
    };

    $scope.CallSaveUpdateTag = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        var photo = $scope.beData.Photo_TMP;

        $http({
            method: 'Post',
            url: base_url + "AppCMS/Creation/SaveTagSection",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.TagPhoto && data.TagPhoto.length > 0)
                    formData.append("photo", data.TagPhoto[0]);

                return formData;
            },
            data: { jsonData: $scope.beData, TagPhoto: photo }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllTagSection();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    }

    $scope.GetAllTagSection = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.TagSectionList = [];
        $http({
            method: 'POST',
            url: base_url + "AppCMS/Creation/GetAllTagSection",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.TagSectionList = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.GetTagSectionById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TagId: refData.TagId
        };
        $http({
            method: 'POST',
            url: base_url + "AppCMS/Creation/GetTagSectionById",
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


    $scope.DeleteTagSection = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Badge + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { TagId: refData.TagId };
                $http({
                    method: 'POST',
                    url: base_url + "AppCMS/Creation/DelTagSection",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllTagSection();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });



    }
});