app.controller("UDFController", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'Ledger Group';
   

    LoadData();

    function LoadData() {

        $('.select2').select2();
         

        $scope.FiledAfterColl = [
            { entityid: 19, id: 1, text: 'Basic Info' }, { entityid: 19, id: 2, text: 'Other Details' },
            { entityid: 44, id: 1, text: 'Basic Info' }, { entityid: 44, id: 2, text: 'Other Details' },
            { entityid: 526, id: 1, text: 'General' }, { entityid: 526, id: 2, text: 'Investigation' }, { entityid: 526, id: 3, text: 'Medication' }, { entityid: 526, id: 4, text: 'NextFollowup' }, { entityid: 526, id: 5, text: 'PageEnd' },
            { entityid: 547, id: 1, text: 'Employee Detail' },{ entityid: 547, id: 2, text: 'Official Detail'  },
            { entityid: 547, id: 3, text: 'Permanent Address'},{entityid: 547, id: 4, text: 'Temporary Address' },{ entityid: 547, id: 5, text: 'Emergency Contact'},{ entityid: 547, id: 6, text: 'Provident Fund'
            },{ entityid: 547, id: 7, text: 'SSF' },{ entityid: 547, id: 8, text: 'CIT' },{ entityid: 547, id: 9, text: 'Gratuity' },{ entityid: 547, id: 10, text: 'Bank Account' },{ entityid: 547, id: 11, text: 'Life Insurance'
            },{ entityid: 547, id: 12, text: 'Health Insurance' },{ entityid: 547, id: 13, text: 'Account Detail' },{ entityid: 547, id: 14, text: 'Academic Qualification' },{ entityid: 547, id: 15, text: 'Work Experience'
            },{ entityid: 547, id: 16, text: 'Supervisor'  },{ entityid: 547, id: 17, text: 'Others' }, 
        ];

        $scope.PkTablesColl = [];
        $scope.PkTablesColl_Qry = [];
        $http.get(base_url + "Setup/ReportWriter/GetPKTables").then(function (res) {
            $scope.PkTablesColl = res.data.Data;
            $scope.PkTablesColl_Qry = mx(res.data.Data);
        }, function (reason) { alert('Failed: ' + reason); });

        $scope.DataTypeColl = [];
        $http({
            method: 'GET',
            url: base_url + "Global/GetDataType",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataTypeColl = res.data.Data;
            }
            else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.EntityColl = [];
        $http({
            method: 'GET',
            url: base_url + "/V1/StaticValues/GetFormEntity",
            dataType: "json",
        }).then(function (res) {
            $scope.EntityColl = res.data;
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList(); 
      
        $scope.currentPages = {
            LedgerGroup: 1
        };

        $scope.searchData = {
            LedgerGroup: ''
        };

        $scope.perPage = {
            LedgerGroup: GlobalServices.getPerPageRow(),
        };

        $scope.beData =
        {
            Id: 0,
            FieldNo: 0,
            Name: '',
            DisplayName: '',
            AllowNull: true,
            Length: 100,
            AllowDuplicate: true,
            IsMandatory: false,
            DefaultValue: '',
            IsCurrency: false,
            Rows: 0,
        };
         

    };
    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $timeout(function () {
            $scope.beData =
            {
                Id: 0,
                FieldNo: 0,
                Name: '',
                DisplayName: '',
                AllowNull: true,
                Length: 100,
                AllowDuplicate: true,
                IsMandatory: false,
                DefaultValue: '',
                IsCurrency: false,
                Rows: 0,
            };  
        });
       
    }

    $scope.ChangeRefTable = function (curRow) {
        if (curRow.SelectedRefTable) {
            curRow.RefTable = curRow.SelectedRefTable.Table;
            curRow.RefColumn = curRow.SelectedRefTable.ColumnName;
        } else {
            curRow.RefColumn = '';
            curRow.RefTable = '';
        }
    }

    $scope.GetAllLedgerGroup= function () {
         
        $scope.LedgerGroupColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllUDF",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.LedgerGroupColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.IsValidLedgerGroup = function () {
         if ($scope.beData.Name.isEmpty()) {
         Swal.fire("Please ! Enter Valid  Name");
         return false;
         }

      

        return true;
    }

    $scope.AddNewLedgerGroup = function () {
        if ($scope.IsValidLedgerGroup() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateLedgerGroup();
                    }

                });
            }
            else
                $scope.CallSaveUpdateLedgerGroup();
        }
    };

    $scope.CallSaveUpdateLedgerGroup = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
 
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/SaveUDF",
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

            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllLedgerGroup();
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetLedgerGroupById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            Id: beData.Id
        };
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/getUDFById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.beData = res.data.Data;
                    $scope.beData.Mode = 'Modify';

                    if ($scope.beData.RefTable && $scope.beData.RefTable.length > 0) {
                        var findTbl = $scope.PkTablesColl_Qry.firstOrDefault(p1 => p1.Table == $scope.beData.RefTable);
                        if (findTbl)
                            $scope.beData.SelectedRefTable = findTbl;
                    }

                    $('#custom-tabs-four-profile-tab').tab('show'); 
                });

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }


    $scope.DeleteLedgerGroup = function (beData, ind) {


        Swal.fire({
            //scope: $scope,
            title: 'Are you sure you want to delete ' + beData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = { Id: beData.Id };

                $http({
                    method: 'POST',
                    url: base_url + "Setup/Security/DeleteUDF",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                            $scope.LedgerGroupColl.splice(ind, 1);
                        }

                    }, function (reason) {
                        Swal.fire('Failed' + reason);
                });
            }

        });
    }


});