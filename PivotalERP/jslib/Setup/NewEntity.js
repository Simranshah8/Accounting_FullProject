
app.controller("newEntityCntrl", function ($scope, $http, $filter,  $timeout) {

    $scope.Title = 'New Entity';

    
    $scope.LoadData=function() {
        $scope.loadingstatus = 'running';
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $('#fileTreeDemo_2').fileTree({ root: '~/Report/', script: '../../web/jqueryFileTree.aspx', folderEvent: 'click', expandSpeed: 750, collapseSpeed: 750, multiFolder: false }, function (file) {
            var selectedFilePath= file;

            var index = selectedFilePath.indexOf("Report/");
            if (index < 0)
                index = selectedFilePath.indexOf("Report\\");

            var path = '';

            if (index > 0)
                path = selectedFilePath.substring(index - 1);

            $scope.CurRT.FullPath = selectedFilePath;
            $scope.CurRT.Path = path.split('/').join('\\');

            Swal.fire($scope.CurRT.Path);

        }, function (dir) {
            var selectedFolderPath = dir;
        });

        $('.select2').select2({ allowClear: true, width: '100%' });

        $scope.beData = {
            TranId: 0,
            Name: '',
            ModuleId: 0,
            Mode: 'New Entity',
            FieldColl: [],            
            TemplateColl: [],
            EntityType:1,
            TSql: '',
            ChieldEntities:[],
        };
         
        $scope.beData.ChieldEntities.push({
            FieldColl: [{ SNo: 0 }],
        });

        $scope.beData.TemplateColl.push({});

        $scope.ReportTypeColl = [];
        $scope.ReportTypeColl.push({ id: 1, text: 'Form Entry' });
        $scope.ReportTypeColl.push({ id: 2, text: 'Sql Query' });
        
        $scope.PkTablesColl = [];
        $scope.PkTablesColl_Qry = [];
        $http.get(base_url + "Setup/ReportWriter/GetPKTables").then(function (res) {
            $scope.PkTablesColl = res.data.Data;
            $scope.PkTablesColl_Qry = mx(res.data.Data);
        }, function (reason) { alert('Failed: ' + reason); });


        $scope.ModuleColl = [];
        $http.get(base_url + "Setup/ReportWriter/GetModuleList").then(function (res)
        {
            $scope.ModuleColl = res.data.Data;
        }, function (reason) { alert('Failed: ' + reason); });
        
        $scope.DataTypeColl = [];
        $http.get(base_url + "Setup/ReportWriter/GetDataTypeList").then(function (res)
        {
            $scope.DataTypeColl = res.data.Data;
        }, function (reason) { alert('Failed: ' + reason); });

        $scope.loadingstatus = 'stop';

        $scope.UserColl = []; //declare an empty array
        $http.post(base_url + "Setup/Security/GetAllUserList").then(
       function (res) {
                $scope.UserColl = res.data.Data;
           $scope.loadingstatus = "stop";
       }
       , function (reason) {
           alert('Failed: ' + reason);
       }
        );

        $scope.UserGroupList = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllUserGroupList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UserGroupList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.AddBlankRow();

        $scope.GetAllQueryBuilder();
    }

    $scope.Validate = function () {
        var isValid = true;
        //if ($('#txtReportName').val().trim() == "") {
        //    $('#txtReportName').css('border-color', 'Red');
        //    isValid = false;
        //}
        //else {
        //    $('#txtReportName').css('border-color', 'lightgrey');
        //}

        return isValid;
    }


    $scope.AddBlankRow = function () {

        if (!$scope.beData.FieldColl || $scope.beData.FieldColl.length == 0) {
            $scope.beData.FieldColl = [];
            $scope.beData.FieldColl.push({SNo:0});
        }

        if (!$scope.beData.ChieldEntities || $scope.beData.ChieldEntities.length == 0) {
            $scope.beData.ChieldEntities = [];
            $scope.beData.ChieldEntities.push({
                FieldColl: [{ SNo: 0 }],
            });
        }

        if (!$scope.beData.TemplateColl || $scope.beData.TemplateColl.length == 0) {
            $scope.beData.TemplateColl = [];
            $scope.beData.TemplateColl.push({});
        }
    }


    $scope.AddItemUdf = function (ind) {
        if ($scope.beData.FieldColl[ind].Name && $scope.beData.FieldColl[ind].Name.length > 0) {
            if ($scope.beData.FieldColl.length > ind + 1) {
                $scope.beData.FieldColl.splice(ind + 1, 0, {
                   SNo:0,
                })
            } else {
                $scope.beData.FieldColl.push({
                    SNo: 0,
                });
            }
        }

    };
    $scope.delItemUdf = function (ind) {
        if ($scope.beData.FieldColl) {
            if ($scope.beData.FieldColl.length > 1) {
                $scope.beData.FieldColl.splice(ind, 1);
            }
        }
    };


    $scope.AddChieldEntity = function (ind) {
        if ($scope.beData.ChieldEntities[ind].Name && $scope.beData.ChieldEntities[ind].Name.length > 0) {
            if ($scope.beData.ChieldEntities.length > ind + 1) {
                $scope.beData.ChieldEntities.splice(ind + 1, 0, {
                    FieldColl: [{ SNo:0 }],
                })
            } else {
                $scope.beData.ChieldEntities.push({
                    FieldColl: [{ SNo: 0 }],
                });
            }
        }

    };
    $scope.delChieldEntity = function (ind) {
        if ($scope.beData.ChieldEntities) {
            if ($scope.beData.ChieldEntities.length > 1) {
                $scope.beData.ChieldEntities.splice(ind, 1);
            }
        }
    };

    $scope.addrow = function (ind) {

        if (ind + 1 == $scope.beData.ParaColl.length) {
            if ($scope.beData.ParaColl[ind].VariableName)
            {
                $scope.beData.ParaColl.push({
                    SNo: 0,
                    SubjectId: 0,
                    PaperType: 1,
                    IsOptional: false
                });
            }

        }

    };
    $scope.delete = function (val) {

        if ($scope.beData.ParaColl.length > 1)
            $scope.beData.ParaColl.splice(val, 1);
    };


    $scope.addrowRT = function (ind) {
        if (ind + 1 == $scope.beData.TemplateColl.length) {
            if ($scope.beData.TemplateColl[ind].ReportName) {
                $scope.beData.TemplateColl.push({
                     Name:''
                });
            }
        }
    };
    $scope.deleteRT = function (val) {

        if ($scope.beData.TemplateColl.length > 1)
            $scope.beData.TemplateColl.splice(val, 1);
    };

    $scope.CurRT = {};
    $scope.ShowFileChoose = function (tc) {
        $scope.CurRT = tc;
        $('#addReportFilePath').modal('show');
    }

    $scope.GetAllQueryBuilder = function () {

        showPleaseWait();

        $scope.loadingstatus = 'running';

        $scope.noofrows = 10;

        $scope.DataColl = []; //declare an empty array

        $http.get(base_url + "Setup/ReportWriter/GetAllNewEntity").then(
       function (res) {
           $scope.DataColl = res.data.Data;
           $scope.loadingstatus = 'stop';

           hidePleaseWait();
       }
       , function (reason) {
           $scope.loadingstatus = 'stop';
           alert('Failed: ' + reason);
       }
       );

    }
    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $scope.AddNewQueryBuilder = function ()
    {

        var isValid = $scope.Validate();

        if (!isValid)
            return;

        if ($('#cboUser').val() != null) {
            var arr = ($('#cboUser').val().toString()).split(',');
            $scope.beData.UserIdColl = arr.map(Number);
        }

        if ($('#cboGroup').val() != null) {
            var arr = ($('#cboGroup').val().toString()).split(',');
            $scope.beData.GroupIdColl = arr.map(Number);
        }

        $scope.beData.FieldColl.forEach(function (f) {
            if (f.SelectedRefTable) {
                f.RefTable = f.SelectedRefTable.Table;
                f.RefColumn = f.SelectedRefTable.ColumnName;
            } else {
                f.RefColumn = '';
                f.RefTable = '';
            }

            if (f.ChieldEntities) {
                f.ChieldEntities.forEach(function (ce) {
                    if (ce.FieldColl) {
                        ce.FieldColl.forEach(function (f1) {
                            if (f1.SelectedRefTable) {
                                f1.RefTable = f1.SelectedRefTable.Table;
                                f1.RefColumn = f1.SelectedRefTable.ColumnName;
                            }
                            else {
                                f.RefTable = '';
                                f.RefColumn = '';
                            }
                        });
                    }
                });
            }
        });

        if ($scope.beData.ChieldEntities && $scope.beData.ChieldEntities.length > 0) {
            $scope.beData.ChieldEntities.forEach(function (ce)
            {
                ce.FieldColl.forEach(function (f) {
                    if (f.SelectedRefTable) {
                        f.RefTable = f.SelectedRefTable.Table;
                        f.RefColumn = f.SelectedRefTable.ColumnName;
                    }
                    else {
                        f.RefTable = '';
                        f.RefColumn = '';
                    }
                });
            });
        }

        $scope.loadingstatus = 'running';

        $http({
            method: 'POST',
            url: base_url + "Setup/ReportWriter/SaveUpdateNewEntity",
            data: JSON.stringify($scope.beData)
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            alert(res.data.ResponseMSG);
            

            if (res.data.IsSuccess)
            {
                $scope.ClearFields();
                
                $scope.GetAllQueryBuilder();
            }

        }, function (errormessage) {

            $scope.loadingstatus = "stop";
             alert('Unable to store(save) data. pls try again.' + errormessage.responseText);
            
        });


    }

    $scope.getQueryBuilderById = function (beData) {

        $http.post(base_url + "Setup/ReportWriter/GetNewEntityById?TranId=" + beData.TranId).then(function (res) {

            document.getElementById('custom-tabs-four-home-tab').setAttribute('aria-selected', 'false');
            document.getElementById('custom-tabs-four-profile-tab').setAttribute('aria-selected', 'true');

            $scope.beData = res.data.Data;

            $scope.beData.FieldColl.forEach(function (fl)
            {
                if (fl.RefTable && fl.RefTable.length > 0) {
                    var findTbl = $scope.PkTablesColl_Qry.firstOrDefault(p1 => p1.Table == fl.RefTable);
                    if (findTbl)
                        fl.SelectedRefTable = findTbl;
                }                
            });

                         
            $scope.AddBlankRow();

            if ($scope.beData.ChieldEntities && $scope.beData.ChieldEntities.length > 0) {

                $scope.beData.ChieldEntities.forEach(function (ce) {
                    ce.FieldColl.forEach(function (fl)
                    {
                        if (fl.RefTable && fl.RefTable.length > 0) {
                            var findTbl = $scope.PkTablesColl_Qry.firstOrDefault(p1 => p1.Table == fl.RefTable);
                            if (findTbl)
                                fl.SelectedRefTable = findTbl;
                        }
                    });
                });

            }

            $scope.beData.Mode = 'Edit Query';
            
            if ($scope.beData.UserIdColl)
            {
                $timeout(function () {
                    var ethin = [];
                    angular.forEach($scope.beData.UserIdColl, function (edet) {
                        ethin.push(edet);
                    })
                    $('#cboUser').val(ethin).trigger('change');
                });
                
            }
           

            if ($scope.beData.GroupIdColl) {
                $timeout(function () {
                    var ethin = [];
                    angular.forEach($scope.beData.GroupIdColl, function (edet) {
                        ethin.push(edet);
                    })
                    $('#cboGroup').val(ethin).trigger('change');
                });

            } 

            $('#custom-tabs-four-profile-tab').tab('show');

        }, function (errormessage) {
            alert('Unable to get data for update.' + errormessage.responseText);
        });
    }

    $scope.deleteQueryBuilder = function (beData) {

        var ans = confirm("Are you sure you want to delete this Record?");

        if (ans) {
            var getData = $http({
                method: "post",
                url: base_url + "Setup/ReportWriter/DeleteNewEntityById",
                data: JSON.stringify(beData),
                dataType: "json"
            });

            getData.then(function (res) {
                alert(res.data.Data.ResponseMSG);
                if (res.data.Data.IsSuccess) {
                    $scope.GetAllQueryBuilder();
                }

            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        }

    }

    $scope.ClearFields = function () {
        $scope.beData = {
            TranId: 0,
            Name: '',
            ModuleId: 0,
            Mode: 'New Entity',
            FieldColl: [],
            TemplateColl: [],
            EntityType: 1,
            TSql: '',
            ChieldEntities:[],
        };

        $scope.beData.ChieldEntities.push({
            FieldColl: [{ SNo: 0 }],
        });
        if ($scope.beData.TemplateColl == null || $scope.beData.TemplateColl.length == 0) {
            $scope.beData.TemplateColl = [];
            $scope.beData.TemplateColl.push({});
        }
        $scope.AddBlankRow();
        $scope.loadingstatus = 'stop';
        $('#txtName').focus();
    }

    $scope.AddCurItemUdf = function (ind) {
        if ($scope.CurEntity.FieldColl[ind].Name && $scope.CurEntity.FieldColl[ind].Name.length > 0) {
            if ($scope.CurEntity.FieldColl.length > ind + 1) {
                $scope.CurEntity.FieldColl.splice(ind + 1, 0, {
                    SNo: 0,
                })
            } else {
                $scope.CurEntity.FieldColl.push({
                    SNo: 0,
                });
            }
        }

    };
    $scope.delCurItemUdf = function (ind) {
        if ($scope.CurEntity.FieldColl) {
            if ($scope.CurEntity.FieldColl.length > 1) {
                $scope.CurEntity.FieldColl.splice(ind, 1);
            }
        }
    };

    $scope.CurEntity = {};
    $scope.showChieldFields = function (chEntity) {
        $scope.CurEntity = chEntity;

        if (!$scope.CurEntity.FieldColl || $scope.CurEntity.FieldColl.length == 0) {
            $scope.CurEntity.FieldColl = [];
            $scope.CurEntity.FieldColl.push({
                SNo: 0,
                Name:''
            });
        }
            

        $('#mdlChieldEntity').modal('show');
    }
   
});

