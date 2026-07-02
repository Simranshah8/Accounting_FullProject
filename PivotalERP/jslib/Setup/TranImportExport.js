

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);
 
app.controller("TranImportExportCtrl", function ($scope, $http, $filter) {
    $scope.Title = 'DataImportExport';

    LoadData();
     

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.importPara = {
            EntityId: 0,
            CreateNonExistsMaster: false,
            OverideExistData: false,
            ContinueOnError:false,
        };

        $scope.exportPara = {
            EntityId: 0
        };

        $scope.EntityColl = []; //declare an empty array
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetEntityListForIEJson",
            dataType: "json" 
        }).then(function (res) {      
            if (res.data.IsSuccess && res.data.Data) {
                $scope.EntityColl = res.data.Data;                 
            }  
        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed' + reason);
        });
         
    }


    $scope.GetAllDataForExport = function () {
      
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.exportPara.ExportData = null;

        var dateFrom =null;
        var dateTo = null;

        if ($scope.exportPara.DateFromDet)
            dateFrom = $filter('date')($scope.exportPara.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.exportPara.DateToDet)
            dateTo = $filter('date')($scope.exportPara.DateToDet.dateAD, 'yyyy-MM-dd');

        var para = {
            entity: $scope.exportPara.EntityId,
            fromDate: dateFrom,
            toDate: dateTo,
            fromNo: $scope.exportPara.FromNo,
            toNo: $scope.exportPara.ToNo
        };
         
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetJsonData",
            dataType: "json",
            data:JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.exportPara.ExportData = res.data.Data;
                Swal.fire('Please Click On Download Button for downloading');
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed' + reason);
        });

    }
     
    $scope.UploadJSONDataForImport = function () {
    
        $scope.loadingstatus = 'running';
        showPleaseWait();

        var filesColl = $scope.importPara.Document_TMP;

        var para = {
            EntityId: $scope.importPara.EntityId,
            CreateNonExistsMaster: $scope.importPara.CreateNonExistsMaster,
            OverideExistData: $scope.importPara.OverideExistData,
            ContinueOnError: $scope.importPara.ContinueOnError,
        };

        $http({
            method: 'POST',
            url: base_url + "Setup/Security/ImportJsonTran",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.files) {
                    for (var i = 0; i < data.files.length; i++) {
                        formData.append("file" + i, data.files[i]);
                    }
                }

                return formData;
            },
            data: { jsonData: para, files: filesColl }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
             
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });

    }

});