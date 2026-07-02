app.controller("reportTemplatesCntrl", function ($scope, $http, $filter, GlobalServices) {

    LoadData();

    /* OnClickDefault();*/
    //function OnClickDefault() {
    //    document.getElementById('report-form').style.display = "none";


    //    document.getElementById('add-report').onclick = function () {
    //        document.getElementById('report-listing').style.display = "none";
    //        document.getElementById('report-form').style.display = "block";

    //    }

    //    document.getElementById('back-btn-list').onclick = function () {
    //        document.getElementById('report-listing').style.display = "block";
    //        document.getElementById('report-form').style.display = "none";

    //    }
    //};
    function LoadData() {
        $scope.loadingstatus = 'running';

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.currentPages = {
            RptTemplate: 1,

        };

        $scope.searchData = {
            RptTemplate: '',

        };

        $scope.perPage = {
            RptTemplate: GlobalServices.getPerPageRow(),

        };


        $scope.TemplatesTypes = [
            { id: 1, text: 'Transaction' },
            { id: 2, text: 'Reporting' }
        ];


        $scope.beData = {
            RptTranId: 0,
            EntityId: 0,
            ReportName: '',
            Description: '',
            IsDefault: false,
            Path: '',
            RptType: 2,
            Mode: 'New Report Templates'
        };

        $scope.ReportTemplates = {};

        $('#cboTranEntity').select2();
        $('#cboRptEntity').select2();

        $scope.loadingstatus = 'stop';

    }

    $scope.Validate = function () {
        var isValid = true;
        if ($('#txtReportName').val().trim() == "") {
            $('#txtReportName').css('border-color', 'Red');
            isValid = false;
        }
        else {
            $('#txtReportName').css('border-color', 'lightgrey');
        }

        return isValid;
    }

    $scope.GetAllReportTemplates = function () {

        if (!$scope.ReportTemplates.RptType)
            return;

        $scope.loadingstatus = 'running';

        $scope.noofrows = 10;

        $scope.DataColl = []; //declare an empty array

        var istransaction = $scope.ReportTemplates.RptType == 1 ? true : false;

        $http.get(base_url + "Setup/Security/GetAllReportTemplates?IsTransaction=" + istransaction).then(
            function (res) {
                $scope.DataColl = res.data.Data;
                $scope.loadingstatus = 'stop';

            }
            , function (reason) {
                alert('Failed: ' + reason);
            }
        );

        $scope.sort = function (keyname) {
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        }

    }

    $scope.AllowFolderAccess = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: "post",
            url: base_url + "Setup/Security/AllowFolderAccess",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(res.data.ResponseMSG);
        }, function (errormessage) {
            alert('Unable to Delete data. pls try again.' + errormessage.responseText);
        });
    };

    $scope.uploadFiles = function (input) {

        //$scope.files = [];
        //if (input.files) {
        //    $scope.$apply(function () {
        //        $scope.files = input.files;
        //    });


        //    $('#uploadRptFiles').modal('show');

        //}
         
        if ($scope.files) {
             
            $('#uploadRptFiles').modal('show');

        }
    };
    $scope.deleteUploadFiles = function (val) {
        if ($scope.files && $scope.files.length > 0)
            $scope.files = mx($scope.files).toList().splice(val, 1)
        //  $scope.files.splice(val, 1);
    };

    $scope.GetFolderAndFiles = function (path) {

        if (!$scope.currentPath)
            $scope.currentPath = path;
        else
            $scope.currentPath = path;

        $scope.FileFoldersList = [];

        $http({
            method: "post",
            url: base_url + "Setup/Security/GetFolderAndFiles?path=" + $scope.currentPath,
            data: JSON.stringify($scope.currentPath),
            dataType: "json"
        }).then(function (res) {
            $scope.FileFoldersList = res.data;
            //    alert(res.data.ResponseMSG);

        }, function (errormessage) {
            alert('Unable to Delete data. pls try again.' + errormessage.responseText);
        });



    };

    $scope.AddNewReportTemplate = function () {

        var isValid = $scope.Validate();

        if (!isValid)
            return;

        if ($scope.beData.RptType == 1) {
            $scope.beData.EntityId = parseInt($('#cboTranEntity').val().toString());
            $scope.beData.IsTransaction = true;
        }
        else {
            $scope.beData.EntityId = parseInt($('#cboRptEntity').val().toString());
            $scope.beData.IsTransaction = false;
        }


        $scope.loadingstatus = 'running';

        $http({
            method: 'POST',
            url: base_url + "Setup/Security/SaveUpdateReportTemplates",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                //for (var i = 0; i < data.files.length; i++) {
                //    formData.append("file" + i, data.files[i]);
                //}
                return formData;
            },
            data: { jsonData: $scope.beData, files: $scope.files }
        }).then(function (res) {

            $scope.loadingstatus = "stop";

            Swal.fire(res.data.ResponseMSG);

            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });


        //    .success(function (data, status, headers, config) {

        //    $scope.loadingstatus = 'stop';
        //    alert(data.ResponseMSG);
        //    if (data.IsSuccess) {
        //        $scope.ClearFields();
        //    }
        //}).
        //    error(function (data, status, headers, config) {
        //        alert("failed!" + config);
        //    });

    }

    $scope.updateReportTemplates = function (beData) {

        
        $scope.loadingstatus = 'running';

        $http({
            method: 'POST',
            url: base_url + "Setup/Security/SaveUpdateReportTemplates",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                return formData;
            },
            data: { jsonData: beData}
        }).then(function (res) {

            $scope.loadingstatus = "stop";

            Swal.fire(res.data.ResponseMSG);

            
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        }); 
    }

    $scope.getReportTemplateById = function (beData) {

        $http.get(base_url + "Setup/Security/GetReportTemplatesById?isTransaction=" + beData.IsTransaction + "&TranId=" + beData.RptTranId).then(function (res) {

            $scope.beData = res.data;
            $scope.beData.Mode = 'Edit Report Templates';
            if (beData.IsTransaction) {
                $scope.beData.RptType = 1;
                $('#cboTranEntity').val($scope.beData.EntityId).trigger('change');
            }
            else {
                $scope.beData.RptType = 2;
                $('#cboRptEntity').val($scope.beData.EntityId).trigger('change');
            }

            $('#AddNewReportTemplate').modal('show');

        }, function (errormessage) {
            alert('Unable to get data for update.' + errormessage.responseText);
        });
    }

    $scope.deleteReportTemplate = function (beData) {

        var ans = confirm("Are you sure you want to delete this Record?");

        if (ans) {
            var getData = $http({
                method: "post",
                url: base_url + "Setup/Security/DeleteReportTemplates",
                data: JSON.stringify(beData),
                dataType: "json"
            });

            getData.then(function (res) {
                alert(res.data.ResponseMSG);
                if (res.data.IsSuccess) {
                    $scope.GetAllReportTemplates();
                }

            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        }

    }

    $scope.MakeNewFolder = function () {
        if (!$scope.currentPath)
            $scope.currentPath = 'Report';

        var newFolder =
        {
            path: $scope.currentPath,
            folderName: $scope.beData.FolderName
        };
        $http({
            method: "post",
            url: base_url + "Setup/Security/MakeNewFolder",
            data: JSON.stringify(newFolder),
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess) {
                $scope.currentPath = $scope.currentPath + '\\' + $scope.beData.FolderName;
            }
            alert(res.data.ResponseMSG);

        }, function (errormessage) {
            alert('Unable to Delete data. pls try again.' + errormessage.responseText);
        });

    }
    $scope.ClearFields = function () {
        $scope.beData = {
            RptTranId: 0,
            EntityId: 0,
            ReportName: '',
            Description: '',
            IsDefault: false,
            Path: '',
            RptType: 2,
            Mode: 'New Report Templates'
        };

        $('#txtName').focus();
    }

    $scope.SelectedFileClick = function () {

        var index = selectedFilePath.indexOf("Report/");
        if (index < 0)
            index = selectedFilePath.indexOf("Report\\");

        var path = '';

        if (index > 0)
            path = selectedFilePath.substring(index - 1);

        $scope.beData.FullPath = selectedFilePath;
        $scope.beData.Path = path.split('/').join('\\');
    };

    $scope.uploadFilesToServer = function () {

        if (!$scope.files) {
            alert('Please ! Select Valid Files');
            return;
        }

        if (!$scope.currentPath) {
            alert('Please ! Select Valid Path For Upload Files');
            return;
        }

        $scope.loadingstatus = 'running';


        $http({
            method: 'POST',
            url: base_url + "Setup/Security/uploadFilesToServer?path=" + $scope.currentPath,
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                //  formData.append("jsonData", angular.toJson(data.jsonData));

                for (var i = 0; i < data.files.length; i++) {
                    formData.append("file" + i, data.files[i]);
                }
                return formData;
            },
            data: { jsonData: $scope.beData, files: $scope.files }
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            alert(res.data.ResponseMSG);
            if (res.data.IsSuccess && res.data.Data) {
                $scope.files = [];
                $scope.currentPath = 'Report';
                $('#uploadRptFiles').modal('hide');                
            }
            $('input[type=file]').val('');
        }, function (reason) {
            $('input[type=file]').val('');
            alert('Failed' + reason);
        });

    }



});