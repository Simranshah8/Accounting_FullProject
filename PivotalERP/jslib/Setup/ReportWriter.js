

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("queryBuilderCntrl", function ($scope, $http, $filter,  $timeout) {

    $scope.Title = 'Query Builder';

    LoadData();

    function LoadData() {
        $scope.loadingstatus = 'running';

        //$('#fileTreeDemo_2').fileTree({ root: '~/Report/', script: '../../web/jqueryFileTree.aspx', folderEvent: 'click', expandSpeed: 750, collapseSpeed: 750, multiFolder: false }, function (file) {
        //    var selectedFilePath= file;

        //    var index = selectedFilePath.indexOf("Report/");
        //    if (index < 0)
        //        index = selectedFilePath.indexOf("Report\\");

        //    var path = '';

        //    if (index > 0)
        //        path = selectedFilePath.substring(index - 1);

        //    $scope.CurRT.FullPath = selectedFilePath;
        //    $scope.CurRT.Path = path.split('/').join('\\');

        //    Swal.fire($scope.CurRT.Path);

        //}, function (dir) {
        //    var selectedFolderPath = dir;
        //});

        $('.select2').select2({ allowClear: true, width: '100%' });

        $scope.beData = {
            TranId: 0,
            ReportName: '',
            ModuleId: 0,
            Mode: 'New Query Builder',
            ParaColl: [],            
            TemplateColl: [],
            TSql:'',
        };
        $scope.beData.ParaColl.push(
            {
                VariableName: '',
                Label: '',
                DataType: 1,
                Source: '',
                AllowNull: false,
                DefaultValue: '',
                ColWidth:3,
            }
        );

        $scope.beData.TemplateColl.push({});

        $scope.ReportTypeColl = [];
        $scope.ReportTypeColl.push({ id: 1, text: 'Table' });
        $scope.ReportTypeColl.push({ id: 2, text: 'Pivot' });
        $scope.ReportTypeColl.push({ id: 3, text: 'PivotOnly' });
        $scope.ReportTypeColl.push({ id: 4, text: 'Template' });
        $scope.ReportTypeColl.push({ id: 5, text: 'Group Table' });

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

    $scope.addrow = function (ind) {

        if (ind + 1 == $scope.beData.ParaColl.length) {
            if ($scope.beData.ParaColl[ind].VariableName)
            {
                $scope.beData.ParaColl.push({
                    SNo: 0,
                    SubjectId: 0,
                    PaperType: 1,
                    IsOptional: false,
                    ColWidth: 3,
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

        $http.get(base_url + "Setup/ReportWriter/GetAllQueryBuilder").then(
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

        $scope.loadingstatus = 'running';

        $http({
            method: 'POST',
            url: base_url + "Setup/ReportWriter/SaveUpdateQueryBuilder",
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

        $http.post(base_url + "Setup/ReportWriter/GetQueryBuilderById?TranId=" + beData.TranId).then(function (res) {

            document.getElementById('custom-tabs-four-home-tab').setAttribute('aria-selected', 'false');
            document.getElementById('custom-tabs-four-profile-tab').setAttribute('aria-selected', 'true');

            $scope.beData = res.data.Data;

            if (!$scope.beData.ParaColl || $scope.beData.ParaColl.length == 0)
            {
                $scope.beData.ParaColl = [];
                $scope.beData.ParaColl.push(
                {
                          VariableName: '',
                          Label: '',
                          DataType: 1,
                          Source: '',
                          AllowNull: false,
                        DefaultValue: '',
                        ColWidth: 3,
                 } );
            }

            if ($scope.beData.TemplateColl == null || $scope.beData.TemplateColl.length == 0) {
                $scope.beData.TemplateColl = [];
                $scope.beData.TemplateColl.push({});
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
                url: base_url + "Setup/ReportWriter/DeleteQueryBuilderById",
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
            ReportName: '',
            ModuleId: 0,
            Mode: 'New Query Builder',
            ParaColl: [],
            TemplateColl: [],
            TSql:'',
        };
        $scope.beData.ParaColl.push(
            {
                VariableName: '',
                Label: '',
                DataType: 1,
                Source: '',
                AllowNull: false,
                DefaultValue: '',
                ColWidth: 3,
            }
            );

        if ($scope.beData.TemplateColl == null || $scope.beData.TemplateColl.length == 0) {
            $scope.beData.TemplateColl = [];
            $scope.beData.TemplateColl.push({});
        }

        $scope.loadingstatus = 'stop';
        $('#txtName').focus();
    }

   
});

app.controller("reportViewerCntrl", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    $scope.Title = 'Report Viewer';

    iframe = document.getElementById("frmRpt");

    LoadData();

    function LoadData()
    {
        $scope.loadingstatus = 'running';

        $scope.comDet = {};
        GlobalServices.getCompanyDet().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.comDet = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        google.load("visualization", "1", { packages: ["corechart", "charteditor"] });

        $scope.ColumnColl = [];
        $scope.beData = {
            TranId: 0,
            ReportName: '',
            ParaColl: [],
            ReportType:1,
        };

        $scope.columnDefs = [];
        $scope.gridOptions = {
            angularCompileRows: true,
            // a default column definition with properties that get applied to every column
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                // set every column width
                width: 100,

            },
            enableSorting: true,
            multiSortKey: 'ctrl',
            enableColResize: true,
            overlayLoadingTemplate: "Loading..",
            overlayNoRowsTemplate: "No Records found",
          //  rowSelection: 'multiple',
            columnDefs: [],
            rowData: null,
            filter: true,            
            alignedGrids: [],
            enableFilter: true,            
            rowSelection: {
                mode: 'multiRow',
                //checkboxes: false,
                //headerCheckbox: false,
                //enableClickSelection: true,
            },

        };

        $scope.ParaHtml = '';

        //$scope.$watch('beData', function (n, o) {
        //    console.log(n);
        //});

        //$scope.$watch('ParaHtml', function (n, o) {
        //    console.log(n);
        //});

        showPleaseWait();

        var para = {
            TranId: TranId
        };
        $scope.ReportTemplate_Qry = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/ReportWriter/GetColumnsList",
            data: JSON.stringify(para)
        }).then(function (res) {

            $timeout(function () {
                $scope.ParaHtml = res.data.Data.ParaHtml;

                $scope.beData = res.data.Data.BeData;
                $scope.ColumnColl = res.data.Data.ColumnColl;
                $scope.ReportTemplate_Qry = mx($scope.beData.TemplateColl);

                var MultiSelectColl = res.data.Data.MultiSelectColl;
                if (MultiSelectColl) {
                    try {
                        angular.forEach($scope.beData.ParaColl, function (pc) {
                            if (pc.DataType == 21) {
                                var pname = 'dataColl_' + pc.VariableName;
                                $scope.beData[pname] = JSON.parse(MultiSelectColl[pc.VariableName]);
                            }
                        });
                    } catch { }

                }

                var element = document.getElementById("divHtml");
                $compile(element)($scope);
            });

            $timeout(function () {
                if ($scope.beData.ReportType == 1) {

                    var columnDefs = [];

                    angular.forEach($scope.ColumnColl, function (cln) {

                        var href = false;
                        if (cln.text.includes("_htm"))
                            href = true;

                        if (cln.datatype == "string") {

                            if (href) {
                                var clName = cln.text.replaceAll("_htm", "");
                                columnDefs.push({
                                    headerName: clName, field: cln.text, filter: "agTextColumnFilter",
                                    cellRenderer: function (params) {                                        
                                        return '<a href="' + params.value + '" target="_blank">Click</a>'
                                    }
                                });
                            } else {
                                columnDefs.push({ headerName: cln.text, field: cln.text, filter: "agTextColumnFilter" });
                            }
                            
                        }                            
                        else if (cln.datatype == "int32" || cln.datatype == "int64")
                            columnDefs.push({ headerName: cln.text, field: cln.text, filter: "agNumberColumnFilter" });
                        else if (cln.datatype == "double" || cln.datatype == "float" || cln.datatype=="decimal")
                            columnDefs.push({ headerName: cln.text, field: cln.text, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } });
                        else if (cln.datatype == "datetime" || cln.datatype == "date")
                            columnDefs.push({ headerName: cln.text, field: cln.text, valueFormatter: function (params) { return DateFormatAD(params.value); }, cellStyle: { 'text-align': 'center' }, });
                        else
                            columnDefs.push({ headerName: cln.text, field: cln.text });

                    });
                     
                    $scope.gridOptions.columnDefs = columnDefs;
                    $scope.gridOptions.api.setColumnDefs(columnDefs);
                    //$scope.gridOptions = {
                    //    angularCompileRows: true,
                    //    // a default column definition with properties that get applied to every column
                    //    defaultColDef: {
                    //        filter: true,
                    //        resizable: true,
                    //        sortable: true,
                    //        // set every column width
                    //        width: 100,

                    //    },
                    //    enableSorting: true,
                    //    multiSortKey: 'ctrl',
                    //    enableColResize: true,
                    //    overlayLoadingTemplate: "Loading..",
                    //    overlayNoRowsTemplate: "No Records found",
                    //    rowSelection: 'multiple',
                    //    columnDefs: $scope.columnDefs,
                    //    rowData: null,
                    //    filter: true,
                    //    //suppressHorizontalScroll: true,
                    //    alignedGrids: [],
                    //    enableFilter: true

                    //};

                    // lookup the container we want the Grid to use
                    //$scope.eGridDiv = document.querySelector('#datatable');

                    // create the grid passing in the div to use together with the columns & data we want to use
                  // new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

                }
                else if ($scope.beData.ReportType == 2) {


                }
                else if ($scope.beData.ReportType == 3) {

                    $scope.columnDefs = [];
                    var sno = 1;
                    angular.forEach($scope.ColumnColl, function (cln) {
                        if (cln.datatype == "string")
                            $scope.columnDefs.push({ name: cln.text, caption: cln.text });
                        else if (cln.datatype == "int32" || cln.datatype == "int64")
                            $scope.columnDefs.push({ name: cln.text, caption: cln.text, aggregateFunc: 'sum', formatFunc: function (val) { return $filter('formatNumber')(val); } });
                        else if (cln.datatype == "double" || cln.datatype == "float" || cln.datatype=="decimal")
                            $scope.columnDefs.push({
                                name: cln.text, caption: cln.text,
                                dataSettings: {
                                    aggregateFunc: 'sum',
                                    formatFunc: function (value) {
                                        //return $filter('formatNumber')(value);
                                        return Number(value).toFixed(0);
                                    }
                                }
                            });
                        else if (cln.datatype == "datetime" || cln.datatype == "date")
                            $scope.columnDefs.push({ name: cln.text, caption: cln.text });
                        else
                            $scope.columnDefs.push({ name: cln.text, caption: cln.text });
                    });
                }
                else if ($scope.beData.ReportType == 4) {
                }
                else if ($scope.beData.ReportType == 5) {

                    $scope.columnDefs = [];
                    var sno = 1;

                    var tmpColumns = [];
                    $scope.ColumnColl.forEach(function (col) {
                        var colSplits = col.text.split('_');
                        if (colSplits.length == 2) {

                            var find = mx(tmpColumns).firstOrDefault(p1 => p1.title == colSplits[0] + '_');
                            if (find) {
                                find.columns.push(col);
                            } else {
                                var grpCol = {
                                    title: colSplits[0] + '_',
                                    columns: [],
                                    column: null
                                };
                                grpCol.columns.push(col);
                                tmpColumns.push(grpCol);
                            }
                        } else {
                            tmpColumns.push({
                                title: col.text,
                                columns: null,
                                column: col
                            });
                        }
                    });

                  
                    angular.forEach(tmpColumns, function (col) {

                        if (col.columns && col.columns.length > 0) {

                            var newCol = {
                                title: col.title.replace("_", ""),
                                headerHozAlign: "center",
                                headerMenu: headerMenu,
                                columns: [],
                            };

                            col.columns.forEach(function (cln) {
                                var newCH = {
                                    field: cln.text, name: cln.text, caption: cln.text, title: cln.text.replace(col.title, ''),
                                };
                                if (cln.datatype == "int32" || cln.datatype == "int64") {
                                    newCH.hozAlign = "center";
                                    newCH.bottomCalc = "sum";
                                    newCH.sorter = "number";
                                    newCH.bottomCalcParams = { precision: 0 };

                                }
                                else if (cln.datatype == "double" || cln.datatype == "float" || cln.datatype == "decimal") {
                                    newCH.hozAlign = "right";
                                    newCH.formatter = function (cell, formatterParams, onRendered) {

                                        var val = cell.getValue();
                                        if (val == 0)
                                            return "";

                                        return Numberformat(val);
                                    };
                                    newCH.bottomCalc = "sum";
                                    newCH.bottomCalcParams = { precision: 3 };
                                    newCH.sorter = "number";
                                }

                                newCol.columns.push(newCH);

                            });

                            $scope.columnDefs.push(newCol);

                        }
                        else {
                            var cln = col.column;
                            if (cln) {
                                var newCol = {
                                    field: cln.text, name: cln.text, caption: cln.text, title: cln.text,
                                    headerMenu: headerMenu
                                };

                                if (cln.datatype == "int32" || cln.datatype == "int64") {
                                    newCol.hozAlign = "center";
                                    newCol.bottomCalc = "sum";
                                    newCol.bottomCalcParams = { precision: 0 };
                                    newCol.sorter = "number";

                                }
                                else if (cln.datatype == "double" || cln.datatype == "float" || cln.datatype == "decimal") {
                                    newCol.hozAlign = "right";
                                    newCol.formatter = function (cell, formatterParams, onRendered) {

                                        var val = cell.getValue();
                                        if (val == 0)
                                            return "";

                                        return Numberformat(val);
                                    };
                                    newCol.bottomCalc = "sum";
                                    newCol.bottomCalcParams = { precision: 3 };
                                    newCol.sorter = "number";
                                }

                                $scope.columnDefs.push(newCol);
                            }

                        }


                    });

                    $scope.rptTable = new Tabulator("#grouptableId", {
                        //  height: "311px",
                        //printAsHtml: true,
                       // printRowRange: "active",
                        // printHeader: $scope.GetPageHeader(),
                        //layout: "fitColumns",
                        movableColumns: true,
                        persistence: {
                            sort: true,
                            filter: true,
                            columns: ["visible"] // Persist column visibility
                        },
                        persistenceMode: "local", // Initially use local persistence
                       
                        layout: "fitDataTable",
                        clipboard: true,
                        selectableRows: true, //make rows selectable
                        columns: $scope.columnDefs,
                        rowHeader: {
                            headerSort: false, resizable: false, frozen: true, headerHozAlign: "center", hozAlign: "center", formatter: "rowSelection", titleFormatter: "rowSelection", cellClick: function (e, cell) {
                                cell.getRow().toggleSelect();
                            }
                        },
                    });
 
                }
            });
                     
            $timeout(function () {
                $('.select2').select2({ allowClear: true, width: '100%' });
            });
            


            $scope.loadingstatus = "stop";     
            hidePleaseWait();

        }, function (errormessage) {

            $scope.loadingstatus = "stop";
                alert('Unable to store(save) data. pls try again.' + errormessage.responseText);
        });
    
        $scope.loadingstatus = 'stop';
        
    }



    //define column header menu as column visibility toggle
    var headerMenu = function () {
        var menu = [];
        var columns = this.getColumns();

        for (let column of columns) {

            //create checkbox element using font awesome icons
            let icon = document.createElement("i");
            icon.classList.add("fas");
            icon.classList.add(column.isVisible() ? "fa-check-square" : "fa-square");

            //build label
            let label = document.createElement("span");
            let title = document.createElement("span");

            title.textContent = " " + column.getDefinition().title;

            label.appendChild(icon);
            label.appendChild(title);

            //create menu item
            menu.push({
                label: label,
                action: function (e) {
                    //prevent menu closing
                    e.stopPropagation();

                    //toggle current column visibility
                    column.toggle();

                    //change menu item icon
                    if (column.isVisible()) {
                        icon.classList.remove("fa-square");
                        icon.classList.add("fa-check-square");
                    } else {
                        icon.classList.remove("fa-check-square");
                        icon.classList.add("fa-square");
                    }
                }
            });
        }

        return menu;
    };

    $scope.GenerateColumns = function () {
        if ($scope.beData.ReportType == 1) {

            var columnDefs = [];

            angular.forEach($scope.ColumnColl, function (cln) {

                var href = false;
                if (cln.text.includes("_htm"))
                    href = true;

                if (cln.datatype == "string") {
                    if (href) {
                        var clName = cln.text.replaceAll("_htm", "");
                        columnDefs.push({
                            headerName: clName, field: cln.text, filter: "agTextColumnFilter",
                            cellRenderer: function (params) {
                                return '<a href="' + params.value + '" target="_blank">Click</a>'
                            }
                        });
                    } else {
                        columnDefs.push({ headerName: cln.text, field: cln.text, filter: "agTextColumnFilter" });
                    }

                }
                else if (cln.datatype == "int32" || cln.datatype == "int64")
                    columnDefs.push({ headerName: cln.text, field: cln.text, filter: "agNumberColumnFilter" });
                else if (cln.datatype == "double" || cln.datatype == "float" || cln.datatype == "decimal")
                    columnDefs.push({ headerName: cln.text, field: cln.text, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } });
                else if (cln.datatype == "datetime" || cln.datatype == "date")
                    columnDefs.push({ headerName: cln.text, field: cln.text, valueFormatter: function (params) { return DateFormatAD(params.value); }, cellStyle: { 'text-align': 'center' }, });
                else
                    columnDefs.push({ headerName: cln.text, field: cln.text });

            });

            $scope.gridOptions.columnDefs = columnDefs;
            $scope.gridOptions.api.setColumnDefs(columnDefs);
            
        }
        else if ($scope.beData.ReportType == 2) {


        }
        else if ($scope.beData.ReportType == 3) {

            $scope.columnDefs = [];
            var sno = 1;
            angular.forEach($scope.ColumnColl, function (cln) {
                if (cln.datatype == "string")
                    $scope.columnDefs.push({ name: cln.text, caption: cln.text });
                else if (cln.datatype == "int32" || cln.datatype == "int64")
                    $scope.columnDefs.push({ name: cln.text, caption: cln.text, aggregateFunc: 'sum', formatFunc: function (val) { return $filter('formatNumber')(val); } });
                else if (cln.datatype == "double" || cln.datatype == "float" || cln.datatype == "decimal")
                    $scope.columnDefs.push({
                        name: cln.text, caption: cln.text, hozAlign: "right", formatter: function (cell, formatterParams, onRendered) {

                            var val = cell.getValue();
                            if (val == 0)
                                return "";

                            return Numberformat(val);
                        },
                        dataSettings: {
                            aggregateFunc: 'sum',
                            formatFunc: function (value) {
                                //return $filter('formatNumber')(value);
                                return Number(value).toFixed(0);
                            }
                        }
                    });
                else if (cln.datatype == "datetime" || cln.datatype == "date")
                    $scope.columnDefs.push({ name: cln.text, caption: cln.text });
                else
                    $scope.columnDefs.push({ name: cln.text, caption: cln.text });
            });
        }
        else if ($scope.beData.ReportType == 5) {


            $scope.columnDefs = [];
            var sno = 1;

            var tmpColumns = [];
            $scope.ColumnColl.forEach(function (col) {
                var colSplits = col.text.split('_');
                if (colSplits.length == 2) {

                    var find = mx(tmpColumns).firstOrDefault(p1 => p1.title == colSplits[0] + '_');
                    if (find) {
                        find.columns.push(col);
                    } else {
                        var grpCol = {
                            title: colSplits[0] + '_',
                            columns: [],
                            column: null
                        };
                        grpCol.columns.push(col);                        
                        tmpColumns.push(grpCol);
                    }
                } else {
                    tmpColumns.push({
                        title: col.text,
                        columns: null,
                        column: col
                    });
                }
            });

            angular.forEach(tmpColumns, function (col) {

                if (col.columns && col.columns.length > 0) {

                    var newCol = {
                        title: col.title.replace("_", ""),
                        headerHozAlign: "center",
                        columns: [],
                    };

                    col.columns.forEach(function (cln) {
                        var newCH = {
                            field: cln.text, name: cln.text, caption: cln.text, title: cln.text.replace(col.title,''),
                        };
                        if (cln.datatype == "int32" || cln.datatype == "int64") {
                            newCH.hozAlign = "center";
                            newCH.bottomCalc = "sum";
                            newCH.sorter = "number";
                            newCH.bottomCalcParams = { precision: 0 };

                        }
                        else if (cln.datatype == "double" || cln.datatype == "float" || cln.datatype == "decimal") {
                            newCH.hozAlign = "right";
                            newCH.formatter = function (cell, formatterParams, onRendered) {

                                var val = cell.getValue();
                                if (val == 0)
                                    return "";

                                return Numberformat(val);
                            };
                            newCH.bottomCalc = "sum";
                            newCH.bottomCalcParams = { precision: 3 };
                            newCH.sorter = "number";
                        }

                        newCol.columns.push(newCH);

                    });

                    $scope.columnDefs.push(newCol);

                }
                else {
                    var cln = col.column;
                    if (cln) {
                        var newCol = {
                            field: cln.text, name: cln.text, caption: cln.text, title: cln.text,
                        };

                        if (cln.datatype == "int32" || cln.datatype == "int64") {
                            newCol.hozAlign = "center";
                            newCol.bottomCalc = "sum";
                            newCol.bottomCalcParams = { precision: 0 };
                            newCol.sorter = "number";

                        }
                        else if (cln.datatype == "double" || cln.datatype == "float" || cln.datatype == "decimal") {
                            newCol.hozAlign = "right";
                            newCol.formatter = function (cell, formatterParams, onRendered) {

                                var val = cell.getValue();
                                if (val == 0)
                                    return "";

                                return Numberformat(val);
                            };
                            newCol.bottomCalc = "sum";
                            newCol.bottomCalcParams = { precision: 3 };
                            newCol.sorter = "number";
                        }

                        $scope.columnDefs.push(newCol);
                    }
                    
                }


            });

            $scope.rptTable = new Tabulator("#grouptableId", {
                //  height: "311px",
              //  printAsHtml: true,
               // printRowRange: "active",
                // printHeader: $scope.GetPageHeader(),
                //layout: "fitColumns",
               // layout: "fitDataTable",
                selectableRows: true, //make rows selectable
                columns: $scope.columnDefs,
                rowHeader: {
                    headerSort: false, resizable: false, frozen: true, headerHozAlign: "center", hozAlign: "center", formatter: "rowSelection", titleFormatter: "rowSelection", cellClick: function (e, cell) {
                        cell.getRow().toggleSelect();
                    }
                },
            });
           
        }
    }
    $scope.ShowRdlReport = function () {
        if ($scope.beData.SelectedTemplated) {

            $scope.loadingstatus = 'running';
            showPleaseWait();

            var findRpt = $scope.beData.SelectedTemplated;
            if (findRpt && findRpt.ReportName) {
                var rptPara = {
                    ReportName: findRpt.ReportName,
                    RptPath: findRpt.Path,
                    entityid: 338,
                    URptTranId:$scope.beData.TranId,
                };
                // TEXT = 1,DATE = 2,DROPDOWN = 3,NUMBER = 4, AMOUNT = 5, DATETIME = 6, MEMO = 7, WHOLENUMBERONLY = 8,   YESNO = 9
                if ($scope.beData.ParaColl && $scope.beData.ParaColl.length > 0) {
                    angular.forEach($scope.beData.ParaColl, function (pc) {
                        if (pc.DataType == 1)
                        {
                            if (pc.DefaultValue)
                                rptPara[pc.VariableName] = pc.DefaultValue;
                        }
                        else if (pc.DataType == 2 || pc.DataType == 6)
                        {
                            if (pc.DateDet) {
                                var bs = pc.VariableName + "BS";
                                rptPara[pc.VariableName] = $filter('date')(new Date(pc.DateDet.dateAD), 'yyyy-MM-dd');
                                rptPara[bs] = pc.DateDet.dateBS;
                            }
                                
                        }
                        else if (pc.DataType == 3) {
                            if (pc.DefaultValue != undefined && pc.DefaultValue != null)
                                rptPara[pc.VariableName] = pc.DefaultValue;
                        }
                        else if (pc.DataType == 21) {
                            if (pc.DefaultValue != undefined && pc.DefaultValue != null)
                                rptPara[pc.VariableName] = pc.DefaultValue.toString();
                        }
                        else if (pc.DataType == 4 || pc.DataType==5) {
                                rptPara[pc.VariableName] = isEmptyNum(pc.DefaultValue);
                        }
                        else
                        {
                            if (pc.DefaultValue != undefined && pc.DefaultValue != null) {
                                rptPara[pc.VariableName] = pc.DefaultValue.toString();
                            }                                
                        }
                        
                    });
                }
                var paraQuery = param(rptPara);
                 

                document.body.style.cursor = 'wait';
                document.getElementById("frmRpt").src = '';
                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + paraQuery;
                document.body.style.cursor = 'default';
                //WaitForIFrame();


                $scope.loadingstatus = "stop";
                hidePleaseWait();

            }
        } else {
           // Swal.fire('Please ! Select Report Template');
        }
    }


    function WaitForIFrame() {
        do {
            $scope.loadingstatus = 'running';
            showPleaseWait();
        } while (iframe.readyState != "complete");

        $scope.loadingstatus = "stop";
        hidePleaseWait();
    }

    $scope.GetData = function ()
    {
        //var para =angular.copy($scope.beData);

        var tmpParaColl = angular.copy($scope.beData.ParaColl);
        if (tmpParaColl && tmpParaColl.length > 0) {
            tmpParaColl.forEach(function (pc) {
                if (pc.DataType == 21) {

                    if (pc.DefaultValue)
                        pc.DefaultValue = pc.DefaultValue.toString();
                }
            });
        }
        var para =
        {
            TranId: $scope.beData.TranId,
            ReportName: $scope.beData.ReportName,
            ModuleId: $scope.beData.ModuleId,
            TSql: $scope.beData.TSql,
            ParaColl: tmpParaColl,
            UserIdColl: $scope.beData.UserIdColl,
            ReportType: $scope.beData.ReportType,
            ReportState: $scope.beData.ReportState,
            GroupIdColl: $scope.beData.GroupIdColl,
            TemplateColl: $scope.beData.TemplateColl,
            ModuleName: $scope.beData.ModuleName,
            ColWidth: $scope.beData.ColWidth,
            Source: $scope.beData.Source,
            Formula: $scope.beData.Formula,
            FieldAfter: $scope.beData.FieldAfter,
            DropDownList: $scope.beData.DropDownList,
            EntityId: $scope.beData.EntityId,
            ResponseId: $scope.beData.ResponseId,
        };

        angular.forEach(para.ParaColl, function (pc) {
            if (pc.DataType == 21) {
                if (pc.DefaultVal && pc.DefaultVal.length > 0) {
                    pc.DefaultValue = pc.DefaultVal.toString();
                }
            }
        });

        showPleaseWait();
        $scope.loadingstatus = "running";
        $http({
            method: 'POST',
            url: base_url + "Setup/ReportWriter/GetReportData",
            data: JSON.stringify(para)
        }).then(function (res)
        {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            if (res.data.Data.IsSuccess)
            {
                $scope.DataColl = res.data.Data.DataColl;
                var tmpColumnColl = res.data.Data.ColumnColl;
                if ($scope.ColumnColl.length != tmpColumnColl.length) {
                    $scope.ColumnColl = tmpColumnColl;
                    $scope.GenerateColumns();
                }
                $timeout(function () {

                    if ($scope.beData.ReportType == 1) {

                        $scope.gridOptions.api.setRowData($scope.DataColl);

                        var allColumnIds = [];
                        $scope.gridOptions.columnApi.getAllColumns().forEach(function (column) {
                            allColumnIds.push(column.colId);
                        });

                        $scope.gridOptions.columnApi.autoSizeColumns(allColumnIds, false);

                    } else if ($scope.beData.ReportType == 2) {

                        var derivers = $.pivotUtilities.derivers;
                        var renderers = $.extend($.pivotUtilities.renderers,
                            $.pivotUtilities.plotly_renderers,
                            $.pivotUtilities.gchart_renderers,
                            $.pivotUtilities.export_renderers);

                        if ($scope.beData.ReportState && $scope.beData.ReportState.length > 0) {
                            $("#datatable").pivotUI($scope.DataColl, JSON.parse($scope.beData.ReportState), true);
                        } else {
                            $("#datatable").pivotUI($scope.DataColl, { renderers: renderers });
                        }

                    }
                    else if ($scope.beData.ReportType == 3) {


                        var oldState = null;
                        if ($scope.pgridwidget) {
                            $scope.pgridwidget.refreshData($scope.DataColl);
                            return;

                            //oldState = {
                            //    rowFields: $scope.pgridwidget.pgrid.config.rowFields,
                            //    columnFields: $scope.pgridwidget.pgrid.config.columnFields,
                            //    rowSettings: $scope.pgridwidget.pgrid.config.rowSettings,
                            //    columnSettings: $scope.pgridwidget.pgrid.config.columnSettings,
                            //    dataFields: $scope.pgridwidget.pgrid.config.dataFields
                            //};
                        }

                        if ($scope.beData.ReportState && $scope.beData.ReportState.length > 0) {
                            oldState = JSON.parse($scope.beData.ReportState);
                        }
                        else if (oldState != null) {

                        }
                        else {
                            oldState = {
                                rowFields: [],
                                columnFields: [],
                                rowSettings: {
                                    subTotal: {
                                        visible: true,
                                        collapsed: true,
                                        collapsible: true
                                    }
                                },
                                columnSettings: {
                                    subTotal: {
                                        visible: true,
                                        collapsed: true,
                                        collapsible: true
                                    }
                                }
                            }
                        }

                        var config = {
                            dataSource: $scope.DataColl,
                            canMoveFields: true,
                            dataHeadersLocation: 'columns',
                            width: 1099,
                            height: 611,
                            theme: 'green',
                            toolbar: {
                                visible: true
                            },
                            grandTotal: {
                                rowsvisible: true,
                                columnsvisible: true
                            },
                            subTotal: {
                                visible: true,
                                collapsed: true,
                                collapsible: true
                            },
                            rowFields: oldState.rowFields,
                            columnFields: oldState.columnFields,
                            rowSettings: oldState.rowSettings,
                            columnSettings: oldState.columnSettings,
                            fields: $scope.columnDefs,
                            rows: oldState.rowFields,
                            columns: oldState.columnFields,
                            data: oldState.dataFields
                            //rows: ['Manufacturer'],//, 'Category' ],
                            //columns: ['Class', 'Category'],
                            //data: ['Quantity', 'Amount']                       
                        };

                        var elem = document.getElementById('datatable')

                        $scope.pgridwidget = new orb.pgridwidget(config);
                        $scope.pgridwidget.render(elem);

                    }
                    else if ($scope.beData.ReportType == 4) {
                    }
                    else if ($scope.beData.ReportType == 5) {
 

                        $scope.rptTable.clearData();
                        //$scope.rptTable.data = DataColl;
                        $scope.rptTable.setData($scope.DataColl).then(function () {
                            $scope.loadingstatus = "stop";
                            hidePleaseWait();
                            //run code after table has been successfully updated
                        }).catch(function (error) {

                            $scope.loadingstatus = "stop";
                            hidePleaseWait();
                            Swal.fire(error);
                            //handle error loading data
                        });

                    }

                });
                
               

            } else
                alert(res.data.ResponseMSG);


        }, function (errormessage) {

            $scope.loadingstatus = "stop";
                alert('Unable to store(save) data. pls try again.' + errormessage.responseText);
        });
    };
    // Custom filter function to search all columns
    var customFilter = function (data, filterParams) {
        var searchVal = filterParams.value.toLowerCase();
        // Check all fields in the row
        return Object.values(data).some(function (value) {
            return value && value.toString().toLowerCase().includes(searchVal);
        });
    };

  
    $scope.onFilterTextBoxChanged = function ()
    {
        if ($scope.beData.ReportType == 1) {

            $scope.gridOptions.api.setQuickFilter($scope.search);

        } else if ($scope.beData.ReportType == 2) {

        } else if ($scope.beData.ReportType == 3) {

        }
        else if ($scope.beData.ReportType == 5) {
            if ($scope.search && $scope.search.length > 0)
            {
                $scope.rptTable.setFilter(customFilter, { value: $scope.search });
            } else {
                $scope.rptTable.clearFilter();
            }
        }


    }

    $scope.onBtExport = function () {
        var fn = ($scope.beData.ReportName ? $scope.beData.ReportName : 'data') + '.csv';
        var sn = ($scope.beData.ReportName ? $scope.beData.ReportName : 'data') ;
        var params = {
            fileName: fn,
            sheetName: sn
        };

        if ($scope.beData.ReportType == 1) {

            $scope.gridOptions.api.exportDataAsCsv(params);

        } else if ($scope.beData.ReportType == 2) {

        }
        else if ($scope.beData.ReportType == 5) {            
            $scope.rptTable.download("csv", fn);
            //table.download("xlsx", "data.xlsx", {sheetName:"My Data"});
            //table.download("pdf", "data.pdf", {
            //    orientation: "portrait", //set page orientation to portrait
            //    title: "Example Report", //add title to report
            //});
            // table.download("html", "data.html", {style:true});
        }

        
    }

    $scope.saveState = function () {

        var beData = {};
        if ($scope.beData.ReportType == 2) {

            var config = $("#datatable").data("pivotUIOptions");
            if (config) {
                var config_copy = JSON.parse(JSON.stringify(config));
                //delete some values which will not serialize to JSON
                delete config_copy["aggregators"];
                delete config_copy["renderers"];

                beData =
                {
                    TranId: TranId,
                    UserId: 0,
                    ReportType: $scope.beData.ReportType,
                    State: JSON.stringify(config_copy).toString()
                }
            }

          

        } else if ($scope.beData.ReportType == 3)
        {
            var states = {
                rowFields:$scope.pgridwidget.pgrid.config.rowFields,
                columnFields:$scope.pgridwidget.pgrid.config.columnFields,
                rowSettings:$scope.pgridwidget.pgrid.config.rowSettings,
                columnSettings: $scope.pgridwidget.pgrid.config.columnSettings,
                dataFields:$scope.pgridwidget.pgrid.config.dataFields
            };

            beData =
            {
                TranId: TranId,
                UserId: 0,
                ReportType: $scope.beData.ReportType,
                State: JSON.stringify(states).toString()
            }
        }
       
        showPleaseWait();

      
        $http({
            method: 'POST',
            url: base_url + "Setup/ReportWriter/SaveRptState",
            data: JSON.stringify(beData)
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();
            alert(res.data.Data.ResponseMSG);

        }, function (errormessage) {

            $scope.loadingstatus = "stop";
                alert('Unable to store(save) data. pls try again.' + errormessage.responseText);
        });

    };
     
    $scope.Print = function () {

        var templatesColl = $scope.beData.TemplateColl;
        if (templatesColl && templatesColl.length > 0) {
            var templatesName = [];
            var sno = 1;
            angular.forEach(templatesColl, function (tc) {
                templatesName.push(sno + '-' + tc.ReportName);
                sno++;
            });

            var print = false;

            var selectedRpt = null;
            if (templatesColl.length == 1) {
                selectedRpt = templatesColl[0];                
            }
            else {
                Swal.fire({
                    title: 'Report Templates For Print',
                    input: 'select',
                    inputOptions: templatesName,
                    inputPlaceholder: 'Select a template',
                    showCancelButton: true,
                    inputValidator: (value) => {
                        return new Promise((resolve) => {
                            if (value >= 0) {
                                resolve()                                
                                selectedRpt = templatesColl[value];

                                if (selectedRpt.Path && selectedRpt.Path.length>0) {
                                    var dataColl = $scope.GetDataForPrint();
                                    print = true;
                                    $http({
                                        method: 'POST',
                                        url: base_url + "Global/PrintReportData",
                                        headers: { 'Content-Type': undefined },

                                        transformRequest: function (data) {

                                            var formData = new FormData();
                                            formData.append("entityId", EntityId);                                           
                                            //formData.append("columnColl", JSON.stringify($scope.ColumnColl));                                            
                                            formData.append("jsonData", angular.toJson(data.jsonData));

                                            return formData;
                                        },
                                        data: { jsonData: dataColl }
                                    }).then(function (res) {

                                        $scope.loadingstatus = "stop";
                                        hidePleaseWait();
                                        if (res.data.IsSuccess && res.data.Data) {

                                            var name = ($scope.beData.Name ? $scope.beData.Name : $scope.beData.ReportName);
                                            var paraData = {};
                                            paraData.sessionid = res.data.Data.ResponseId;
                                            paraData.entityid = EntityId;
                                            paraData.RptPath = selectedRpt.Path;
                                            paraData.ReportName = name;
                                            paraData.DS_Name = 'DS_' + name.replaceAll(' ', '');
                                            paraData.istransaction = false;

                                            if ($scope.beData.ParaColl) {
                                                $scope.beData.ParaColl.forEach(function (pr) {

                                                    if (pr.DataType == 2) {

                                                        if (pr.DateDet && pr.DateDet.dateAD) {
                                                            paraData[pr.VariableName] = pr.DateDet.dateAD;

                                                            var bs = pr.VariableName + "_BS";
                                                            paraData[bs] = pr.DateDet.dateBS;
                                                        }

                                                    } else {
                                                        if (pr.DefaultValue != null)
                                                            paraData[pr.VariableName] = pr.DefaultValue;
                                                    }

                                                });
                                            }

                                            var paraQuery = param(paraData);

                                            document.body.style.cursor = 'wait';

                                            if(selectedRpt.Path.includes('.rdlc')==true)
                                                document.getElementById("frmRptPrint").src = base_url + "Home/RdlcViewer?" + paraQuery;
                                            else
                                                document.getElementById("frmRptPrint").src = base_url + "web/ReportViewer.aspx?" + paraQuery;

                                            document.body.style.cursor = 'default';
                                            $('#FrmPrintReport').modal('show');

                                        } else
                                            Swal.fire('No Templates found for print');

                                    }, function (errormessage) {
                                        hidePleaseWait();
                                        $scope.loadingstatus = "stop";
                                        Swal.fire(errormessage);
                                    });

                                }

                            } else {
                                resolve('You need to select:)')
                            }
                        })
                    }
                })
            }

            if (selectedRpt.Path && selectedRpt.Path.length > 0 && print == false) {
                var dataColl = $scope.GetDataForPrint();
                print = true;

                $http({
                    method: 'POST',
                    url: base_url + "Global/PrintReportData",
                    headers: { 'Content-Type': undefined },

                    transformRequest: function (data) {

                        var formData = new FormData();
                        formData.append("entityId", EntityId);
                        formData.append("jsonData", angular.toJson(data.jsonData));                        
                        //formData.append("columnColl", JSON.stringify($scope.ColumnColl));
                        return formData;
                    },
                    data: { jsonData: dataColl }
                }).then(function (res) {

                    $scope.loadingstatus = "stop";
                    hidePleaseWait();
                    if (res.data.IsSuccess && res.data.Data) {
                         
                        var name = ($scope.beData.Name ? $scope.beData.Name : $scope.beData.ReportName);
                        var paraData = {};
                        paraData.sessionid = res.data.Data.ResponseId;
                        paraData.entityid = EntityId;
                        paraData.RptPath = selectedRpt.Path;
                        paraData.ReportName = name;
                        paraData.DS_Name = 'DS_' + name.replaceAll(' ', '');
                        paraData.istransaction = false;

                        if ($scope.beData.ParaColl) {
                            $scope.beData.ParaColl.forEach(function (pr) {

                                if (pr.DataType == 2) {

                                    if (pr.DateDet && pr.DateDet.dateAD) {
                                        paraData[pr.VariableName] = pr.DateDet.dateAD;

                                        var bs = pr.VariableName + "_BS";
                                        paraData[bs] = pr.DateDet.dateBS;
                                    }

                                } else
                                {
                                    if (pr.DefaultValue!=null)
                                        paraData[pr.VariableName] = pr.DefaultValue;
                                }
                                
                            });
                        }

                        var paraQuery = param(paraData);

                        document.body.style.cursor = 'wait';
                        if (selectedRpt.Path.includes('.rdlc') == true)
                            document.getElementById("frmRptPrint").src = base_url + "Home/RdlcViewer?" + paraQuery;
                        else
                            document.getElementById("frmRptPrint").src = base_url + "web/ReportViewer.aspx?" + paraQuery;

                        document.body.style.cursor = 'default';
                        $('#FrmPrintReport').modal('show');

                    } else
                        Swal.fire('No Templates found for print');

                }, function (errormessage) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(errormessage);
                });

            }

        }
        else
            Swal.fire('No Templates found for print');
    };

    $scope.GetDataForPrint = function () {
         
        var filterData = [];

        if ($scope.beData.ReportType == 1) {

            $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                var dayBook = node.data;
                filterData.push(dayBook);
            });
        }
        else if ($scope.beData.ReportType == 5) {
            filterData = $scope.rptTable.getSelectedData();
        }
        

        return filterData;
    };

    $scope.onBTExportExcel = function () {
        var fn = ($scope.beData.ReportName ? $scope.beData.ReportName : 'data') + '.xlsx';
        var sn = ($scope.beData.ReportName ? $scope.beData.ReportName : 'data');
        var params = {
            fileName: fn,
            sheetName: sn
        };

        if ($scope.beData.ReportType == 1) {

            var jsonData = [];

            $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                var dayBook = node.data;
                jsonData.push(dayBook);
            });

            const headerTitles = [
                $scope.comDet.Name,
                $scope.comDet.Address,
                sn
            ];
           

            // Get number of columns in JSON
            const columns = Object.keys(jsonData[0]);
            const colCount = columns.length;

            // Convert header rows to AOA format
            const headerRows = headerTitles.map(title => [title]);
            headerRows.push([]); // blank row

            // Create worksheet from AOA
            const worksheet = XLSX.utils.aoa_to_sheet(headerRows);

            // Create merge ranges for each header row
            worksheet["!merges"] = headerTitles.map((_, index) => ({
                s: { r: index, c: 0 },         // start row, col
                e: { r: index, c: colCount - 1 } // end row, col
            }));


            // Add JSON data below header
            XLSX.utils.sheet_add_json(worksheet, jsonData, {
                origin: -1,
                skipHeader: false
            });

            // Style: center-align and bold for header cells
            headerTitles.forEach((title, rowIndex) => {
                const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: 0 });
                if (worksheet[cellAddress]) {
                    worksheet[cellAddress].s = {
                        alignment: { horizontal: "center", vertical: "center" },
                        font: { bold: true, sz: 14 }
                    };
                }
            });

          
            // Create workbook and add worksheet
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, sn);

            // Export to Excel file
            XLSX.writeFile(workbook, fn);

            //$scope.gridOptions.api.exportDataAsCsv(params);

        } else if ($scope.beData.ReportType == 2) {

        }
        else if ($scope.beData.ReportType == 5) {
            $scope.rptTable.download("xlsx", fn);            
        }


    }
});
