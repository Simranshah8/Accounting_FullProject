app.controller("ProductDocumentsController", function ($scope, $http, $timeout, $filter, $compile, GlobalServices, $document) {
    $scope.Title = 'Product Documents';

    $scope.LoadData = function () {
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            ProductDoc: 1

        };

        $scope.searchData = {
            ProductDoc: ''

        };

        $scope.perPage = {
            ProductDoc: GlobalServices.getPerPageRow(),

        };


        $scope.beData =
        {
            ProductId:null,
            EcommerceDescription:'',
            IngredientsDescription:'',
            UsageDescription:'',
            DocumentColl: [],
            AttechFiles: [],
            Mode: 'Save',
        };

        $scope.GetAllProductDoc();

    };


    $scope.ClearFields = function () {
        $scope.beData =
        {
            ProductId: null,
            EcommerceDescription: '',
            IngredientsDescription: '',
            UsageDescription: '',
            DocumentColl: [],
            AttechFiles: [],
            Mode: 'Save',
        };
    }

    //$scope.GetAllProductDoc = function () {
    //    $scope.loadingstatus = 'running';
    //    showPleaseWait();
    //    //$scope.paginationOptions.TotalRows = 0;
    //    //var sCol = $scope.paginationOptions.SearchColDet;
    //    //var para = {
    //    //    filter: {
    //    //        DateFrom: null,
    //    //        DateTo: null,
    //    //        PageNumber: $scope.paginationOptions.pageNumber,
    //    //        RowsOfPage: $scope.paginationOptions.pageSize,
    //    //        SearchCol: (sCol ? sCol.value : ''),
    //    //        SearchVal: $scope.paginationOptions.SearchVal,
    //    //        SearchType: (sCol ? sCol.searchType : 'text')
    //    //    }
    //    //};
    //    $scope.ProductDetList = [];
    //    $http({
    //        method: 'POST',
    //        url: base_url + "Inventory/Creation/GetProductLst",
    //        dataType: "json",
    //    //    data: JSON.stringify(para)
    //    }).then(function (res) {
    //        $scope.loadingstatus = 'stop';
    //        hidePleaseWait();
    //        if (res.data.IsSuccess && res.data.Data) {
    //            $scope.ProductDetList = res.data.Data;
    //            //$scope.SearchDataColl = res.data.Data;
    //            //$scope.paginationOptions.TotalRows = res.data.TotalCount;
    //            //$('#searVoucherRightBtn').modal('show');

    //        } else
    //            alert(res.data.ResponseMSG);

    //    }, function (reason) {
    //        alert('Failed' + reason);
    //    });
    //};


    $scope.AddMoreFiles = function (files, des) {
        if (files) {
            if (files != null) {
                angular.forEach(files, function (file) {
                    $scope.beData.DocumentColl.push({
                        File: file,
                        Name: file.name,
                        Type: file.type,
                        Size: file.size,
                        Description: des,
                        Path: null
                    });
                })
                $scope.attachFile = null;
                $scope.docDescription = '';
                $('#flMoreFiles').val('');
                $(".file-list").empty();
                $(".clear-files").hide();
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

    $scope.ShowPersonalImg = function (item) {
        $scope.viewImg1 = {
            ContentPath: '',
            FileType: null
        };
        if (item.DocPath && item.DocPath.length > 0) {
            $scope.viewImg1.ContentPath = item.DocPath;
            $scope.viewImg1.FileType = 'pdf';  // Assuming DocPath is for PDFs
            document.getElementById('pdfViewer1').src = item.DocPath;
            $('#PersonalImg').modal('show');
        } else if (item.PhotoPath && item.PhotoPath.length > 0) {
            $scope.viewImg1.ContentPath = item.PhotoPath;
            $scope.viewImg1.FileType = 'image';  // Assuming PhotoPath is for images
            $('#PersonalImg').modal('show');
        } else if (item.File) {
            var blob = new Blob([item.File], { type: item.File?.type });
            $scope.viewImg1.ContentPath = URL.createObjectURL(blob);
            $scope.viewImg1.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';

            if ($scope.viewImg1.FileType === 'pdf') {
                document.getElementById('pdfViewer1').src = $scope.viewImg1.ContentPath;
            }

            $('#PersonalImg').modal('show');
        } else {
            Swal.fire('No Image Found');
        }

    };

    $scope.IsValidProductDoc = function () {

        if (!$scope.beData.ProductId) {
            Swal.fire('Please! Select Product');
            return false;
        }

        return true;
    }

    $scope.SaveUpdateProductDoc = function () {
        if ($scope.IsValidProductDoc() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateProductDoc();
                    }
                });
            } else
                $scope.CallSaveUpdateProductDoc();

        }
    };

    $scope.CallSaveUpdateProductDoc = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var filesColl = $scope.beData.AttechFiles;
        $http({
            method: 'Post',
            url: base_url + "AppCMS/Creation/SaveProductDocuments",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                var find = 0;
                angular.forEach($scope.beData.DocumentColl, function (dc) {
                    if (dc.File) {
                        formData.append("file" + find, dc.File);
                    }
                    find++;
                });
                return formData;
            },
            data: { jsonData: $scope.beData, files: filesColl}
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllProductDoc();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    }

    $scope.GetAllProductDoc = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.ProductDetList = [];
        $http({
            method: 'POST',
            url: base_url + "AppCMS/Creation/GetAllProductDoc",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductDetList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.GetProductDocById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            ProductId: refData.ProductId
        };
        $http({
            method: 'POST',
            url: base_url + "AppCMS/Creation/GetProductDocById",
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


    //$scope.DeleteProductDoc = function (refData, ind) {
    //    Swal.fire({
    //        title: 'Are you sure you want to delete this data?'/* + refData.Name + '?'*/,
    //        showCancelButton: true,
    //        confirmButtonText: 'Delete',
    //    }).then((result) => {
    //        if (result.isConfirmed) {
    //            var para = { ProductId: refData.ProductId };
    //            $http({
    //                method: 'POST',
    //                url: base_url + "AppCMS/Creation/DeleteProductDoc",
    //                dataType: "json",
    //                data: JSON.stringify(para)
    //            }).then(function (res) {
    //                hidePleaseWait();
    //                $scope.loadingStatus = "stop";
    //                Swal.fire(res.data.ResponseMSG);
    //                if (res.data.IsSuccess == true) {
    //                    $scope.GetAllProductDoc();
    //                }
    //            }, function (reason) {
    //                Swal.fire('Failed' + reason);
    //            });
    //        }

    //    });
    //}
});