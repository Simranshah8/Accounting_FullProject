app.controller("DebtorsCreditorsRoute", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'DebtorRoute';

    LoadData();

    function LoadData() {
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $('.select2').select2();
         
        $scope.perPage = {
            DebtorsCreditorsRoute: GlobalServices.getPerPageRow(),

        };
        $scope.currentPages = {
            DebtorsCreditorsRoute: 1

        };
        $scope.searchData = {
            DebtorsCreditorsRoute: ''
        };

        $scope.newFilter = {
            Status: null
        };

        $scope.beData =
        {
            DebtorsCreditorsRouteId: 0,
            Name: '',
            Alias: '',
            Code: '',
            IsActive: true,
            Mode: 'Save',
            AgentId: null,
        };
      
        $scope.SalesManList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllSalesMan",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var dtColl = res.data.Data;
                angular.forEach(dtColl, function (dc) {
                  //  if (dc.LevelId == 1) {
                        $scope.SalesManList.push(dc);
                   // }
                });
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };
     
    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";

        $timeout(function () {
            $("#cboAgent").val([]).change();
        });

        $scope.beData =
        {
            DebtorsCreditorsRouteId: 0,
            Name: '',
            Alias: '',
            Code: '',
            Mode: 'Save',
            AgentId: null, 
        };
        $('#txtName').focus();
    }
    $scope.GetAllDebtorsCreditorsRoutes = function () {

        $scope.DebtorsCreditorsRouteColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllDebtorsCreditorsRoute?Status="+$scope.newFilter.Status,
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.DebtorsCreditorsRouteColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }
    $scope.IsValidDebtorCreditorRoute = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter Valid Debtor Creditor Name");
            return false;
        }
        else
            return true;
    }

    $scope.AddNewDebtorsCreditorsRoute = function () {
        if ($scope.IsValidDebtorCreditorRoute() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateDebtorCreditorsRoute();
                    }

                });
            }
            else
                $scope.CallSaveUpdateDebtorCreditorsRoute();
        }
    };

    $scope.CallSaveUpdateDebtorCreditorsRoute = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $scope.beData.AgentIdColl = [];
        $scope.beData.AgentId = null;

        if ($scope.beData.TmpAgentIdColl) {
            if ($scope.beData.TmpAgentIdColl.length > 0) {
                $scope.beData.AgentIdColl = $scope.beData.TmpAgentIdColl;
            }
        }

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveUpdateDebtorsCreditorsRoute",
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
                $scope.GetAllDebtorsCreditorsRoutes();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getDebtorsCreditorsRouteById = function (beData) {

        $scope.loadingstatus = "running";

        var para = {
            DebtorRouteId: beData.DebtorRouteId
        };

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/getDebtorsCreditorsRouteById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.beData = res.data.Data;
                    $scope.beData.Mode = 'Modify';


                    $timeout(function () {
                        if ($scope.beData.AgentIdColl && $scope.beData.AgentIdColl.length > 0) {
                            $scope.beData.TmpAgentIdColl = $scope.beData.AgentIdColl;
                            $("#cboAgent").val($scope.beData.AgentIdColl).change();
                        }
                    });

                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else 
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    };

    $scope.deleteDebtorsCreditorsRoute = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure you want to delete selected DebtorCreditor Route ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var para = { DebtorRouteId: refData.DebtorRouteId };
                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/DeleteDebtorsRouteType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.DebtorsCreditorsRouteColl.splice(ind, 1);
                    }
            }, function(reason) {
                Swal.fire('Failed' + reason);
        });
        }
        });
    }

    $scope.MulData = null;
    $scope.MulObj = {};
    $scope.ShowMultipleModal = function () {

        if ($scope.MulData == null) {
            
            $http({
                method: 'GET',
                url: base_url + "Setup/Security/GetEntityProp?EntityId=" + EntityId,
                dataType: "json"
            }).then(function (res1) {
                $scope.loadingstatus = "stop";
                hidePleaseWait();                
                if (res1.data.IsSuccess && res1.data.PropertiesColl) {
                    $scope.MulData = {};
                    $scope.MulData.ColColl = [];
                    $scope.MulData.DataColl = [];
                    $scope.MulObj = res1.data.Obj;
                    angular.forEach(res1.data.PropertiesColl, function (pc) {
                        $scope.MulData.ColColl.push({
                            id: pc.Id,
                            label: pc.Name,
                            name: pc.PropertyName,
                            dataType: pc.DataType,
                        }); 
                    });
                    var newObj = angular.copy($scope.MulObj);
                    $scope.MulData.DataColl.push(newObj);                    
                    $('#frmImportMultipleCopy').modal('show');
                }
                else {
                    Swal.fire(res1.data.ResponseMSG);
                }

            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }
        else
        {
            $scope.MulData.DataColl = [];
            $scope.MulData.Title = 'Create Multiple Route';
            //$scope.MulData.ColColl = [{ id: 1, label: 'Name', name: 'Name' }, { id: 2, label: 'Alias', name: 'Alias' }, { id: 3, label: 'Code', name: 'Code' }, { id: 4, label: 'Salesman Code', name: 'AgentCode' }];
            $scope.MulData.DataColl.push({});
            $('#frmImportMultipleCopy').modal('show');
        }
        
    }

    $(document).ready(function () {
        $('input.disablecopypaste').bind('paste', function (e) {
            e.preventDefault();
        });
    });
    
    $scope.PasteData = function (colName, ind) {
        var clipText = event.clipboardData.getData('text/plain');

        if (clipText)
        {
            var startInd = ind;
            clipText.split("\n").forEach(function (line) {
                if (line && line.length > 0) {

                    if ($scope.MulData.DataColl.length < (startInd + 1)) {
                        var newObj = angular.copy($scope.MulObj);
                        $scope.MulData.DataColl.push(newObj);
                    }

                    $scope.MulData.DataColl[startInd][colName] = line.trim();
                    startInd++;
                }
            });
        }

    }
 
    $scope.addRowInMD = function (ind) {
        var newObj = angular.copy($scope.MulObj);        
        $scope.MulData.DataColl.splice(ind + 1, 0, newObj);
    };
    $scope.delRowInMD = function (ind) {
        $scope.MulData.DataColl.splice(ind, 1);
    };
    $scope.SaveMultipleData = function () {
        if ($scope.MulData) {
            if ($scope.MulData.DataColl) {

                $scope.loadingstatus = "running";
                showPleaseWait();

                $http({
                    method: 'POST',
                    url: base_url + "Setup/Security/SaveCopyPaste",
                    headers: { 'content-Type': undefined },

                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("entityId", EntityId);
                        formData.append("jsonData", angular.toJson(data.jsonData));
                        return formData;
                    },
                    data: { jsonData: $scope.MulData.DataColl }
                }).then(function (res1) {

                    $scope.loadingstatus = "stop";
                    hidePleaseWait();

                    if (res1.data.IsSuccess == true && res1.data.Data) {
                        $('#frmImportMultipleCopy').modal('hide');
                    }
                    else {
                        Swal.fire(res1.data.ResponseMSG);
                    }

                }, function (errormessage) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                });


            }
        }
    }

});