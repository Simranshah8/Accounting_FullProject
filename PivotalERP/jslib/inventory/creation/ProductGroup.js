app.controller('ProductGroup', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'ProductGroup';

    LoadData();

    function LoadData() {

        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.NumberingMethodList = GlobalServices.getNumberingMethod();
        $scope.perPage = {
            ProductGroup: GlobalServices.getPerPageRow(),

        };

        $scope.currentPages = {
            ProductGroup: 1

        };
        $scope.searchData = {
            ProductGroup: ''
        };

        $scope.newProductGroup =
        {
            
           
            Name: '',
            Alias: '',
            Code: '',
            ParentGroupId: 0,
            ProductGroupId: 0,
            ParentGroupName: '',
            ShowInProductMaster:true,
        }
    };

    $scope.ClearProductGroup = function () {
        $scope.loadingstatus = "stop";

        $scope.newMaster = {
            TranId: 0
        };
            $scope.newProductGroup = {
               
                Name: '',
                Alias: '',
                Code: '',
                ProductGroupId: 0,
                ParentGroupId: 0,
                ParentGroupName: '',
                Mode: 'Save',
                ShowInProductMaster:true,

        };
    }

     
    $scope.IsValidProductGroup = function () {
        if ($scope.newProductGroup.Name.isEmpty()) {
            Swal.fire("Please ! Enter Name");
            return false;
        }
       
        else
            return true;
    }

    $scope.SaveUpdateProductGroup = function () {
        if ($scope.IsValidProductGroup() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newProductGroup.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateProductGroup();
                    }

                });
            }
            else
                $scope.CallSaveUpdateProductGroup();
        }
    };
   
    $scope.CallSaveUpdateProductGroup = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/SaveProductGroup",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newProductGroup }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearProductGroup();
                $scope.GetAllProductGroup();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAllProductGroup = function () {
        $scope.ProductGroupColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductGroup",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.ProductGroupColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }
    $scope.getProductGroupByIdd = function (newProductGroup) {

        $scope.loadingstatus = "running";

        var para = {
            ProductGroupId: newProductGroup.ProductGroupId
        };

        $scope.newMaster = {
            TranId: newProductGroup.ProductGroupId
        };

        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/getProductGroupById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newProductGroup = res.data.Data;

                    $scope.newProductGroup.ProductGroupId = parseInt($scope.newProductGroup.ProductGroupId);

                    $scope.newProductGroup.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });


            } else
                Swal.fire(res.data.ResponseMSG);


        }, function (reason) {
            alert('Failed' + reason);
        });
    };
    $scope.deleteProductGroup = function (newProductGroup, ind) {

        Swal.fire({
            title: 'Are you sure you want to delete ' + newProductGroup.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { ProductGroupId: newProductGroup.ProductGroupId };
                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Creation/DeleteProductGroup",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.ProductGroupColl.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }

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
  
});