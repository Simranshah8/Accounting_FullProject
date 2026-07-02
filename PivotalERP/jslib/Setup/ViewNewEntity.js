app.controller("viewNewEntityCtrl", function ($scope, $http, $filter,GlobalServices, $timeout) {
    $scope.Title = 'New Entity';
    var myDropzone = null;

    $scope.videoExtensions = ['mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'mp4', '3gp', 'flv']; //you can add more extensions
    
    LoadData();
     
    function getExtension(path) {
        let baseName = path.split(/[\\/]/).pop(), // extracts file name from full path
            // (supports separators `\\` and `/`)
            pos = baseName.lastIndexOf("."); // gets the last position of `.`
        if (baseName === "" || pos < 1) // if the file name is empty or ...
            return ""; // the dot not found (-1) or comes first (0)
        return baseName.slice(pos + 1); // extracts extension ignoring "."
    }

    function LoadData() {

        $scope.videoExtensions = mx($scope.videoExtensions);


        $scope.ColNames = "";
        $scope.ViewColNames = "";
        $scope.NewEntity = {};
        var para = {
            TranId:TranId
        };
        $http({
            method: 'POST',
            url: base_url + "Setup/ReportWriter/GetNewEntityById",
            dataType: "json",
            data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data) {
                $scope.NewEntity = res.data.Data;
                $scope.ReportTile = 'List Of ' + $scope.NewEntity.Name;

                $scope.NewEntity.DropZoneColl = [];
                $scope.SearchOptions = [];
                $scope.NewEntity.FilterFieldColl = [];
                $scope.SortingCol = '';

                $scope.ImageFieldsColl = [];

                angular.forEach($scope.NewEntity.FieldColl, function (fc) {
                    if ($scope.ColNames.length > 0)
                        $scope.ColNames = $scope.ColNames + ",";

                    $scope.ColNames = $scope.ColNames + fc.Name;
                     
                    if (fc.ShowInSearch==true) {
                        $scope.NewEntity.FilterFieldColl.push(fc);

                        $scope.SearchOptions.push({
                            text: fc.Label,
                            value: 'UT.' + fc.Name,
                            Name: fc.Name,                            
                        });

                        if ($scope.ViewColNames.length > 0)
                            $scope.ViewColNames = $scope.ViewColNames + ",";

                        $scope.ViewColNames = $scope.ViewColNames + fc.Name;
                         
                        if (fc.RefTable && fc.RefColumn && fc.RefTable.length > 0 && fc.RefColumn.length > 0) {

                            if ($scope.ViewColNames.length > 0)
                                $scope.ViewColNames = $scope.ViewColNames + ",";

                            $scope.ViewColNames = $scope.ViewColNames + fc.Name + '_Name';
                        }  
                    }

                    if (fc.FieldType == 14) {
                        $scope.NewEntity.DropZoneColl.push(fc);
                    }

                    if (fc.FieldType == 1 && $scope.SortingCol.length==0) {
                        $scope.SortingCol = fc.Name;
                    }

                    if (fc.FieldType == 13 || fc.FieldType == 17) {
                        $scope.ImageFieldsColl.push(fc);
                    }
                    else if (fc.FieldType == 15 || fc.FieldType == 16) {
                        $scope.ImageFieldsColl.push(fc);
                    }
                });

                if ($scope.NewEntity.ChieldEntities) {
                    $scope.NewEntity.ChieldEntities.forEach(function (ce) {
                        ce.RowsDataColl = [];
                        ce.RowsDataColl.push({
                            FieldColl: ce.FieldColl,
                        });
                    });
                }

                if ($scope.NewEntity.FilterFieldColl) {
                    $scope.NewEntity.FilterFieldColl.forEach(function (fl) {
                        if (fl.RefTable && fl.RefColumn && fl.RefTable.length > 0 && fl.RefColumn.length > 0) {
                            fl.F_Name = fl.Name + '_Name';
                        } else {
                            fl.F_Name = fl.Name;
                        }                        
                    });
                }

                $scope.paginationOptions = {
                    pageNumber: 1,
                    pageSize: GlobalServices.getPerPageRow(),
                    sort: null,
                    SearchType: 'text',
                    SearchCol: '',
                    SearchVal: '',
                    SearchColDet: $scope.SearchOptions[0],
                    //SortingCol: $scope.NewEntity.FieldColl[0].Name,
                    SortingCol: $scope.SortingCol,
                    SortType: ( $scope.SortingCol.length>0 ? ' asc ' : ''),
                    pagearray: [],
                    pageOptions: [5, 10, 20, 30, 40, 50] 
                };
                 

                $scope.SearchData();
                 
                $timeout(function () {
                    $scope.$apply(function () {

                        if ($scope.NewEntity.DropZoneColl && $scope.NewEntity.DropZoneColl.length > 0) {
                            // DropzoneJS Demo Code Start
                            Dropzone.autoDiscover = false
                            // Get the template HTML and remove it from the doumenthe template HTML and remove it from the doument
                            var previewNode = document.querySelector("#template")
                            previewNode.id = ""
                            var previewTemplate = previewNode.parentNode.innerHTML
                            previewNode.parentNode.removeChild(previewNode)

                            myDropzone = new Dropzone(document.body, { // Make the whole body a dropzone
                                url: "/target-url", // Set the url
                                thumbnailWidth: 130,
                                thumbnailHeight: 130,
                                parallelUploads: 20,
                                previewTemplate: previewTemplate,
                                autoQueue: false, // Make sure the files aren't queued until manually added
                                previewsContainer: "#previews", // Define the container to display the previews
                                clickable: ".fileinput-button" // Define the element that should be used as click trigger to select files.
                            })
                            document.querySelector("#actions .cancel").onclick = function () {
                                myDropzone.removeAllFiles(true)
                            }
                        // DropzoneJS Demo Code End
                        }
                        
                    });

                });
            }
        }, function (reason) {
            alert('Failed' + reason);
        });

      
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList(); 
       
        $scope.beData =
        {
            UTranId: 0,            
            Mode: 'Save',            
        };

    
      
    };

    $scope.ClickEvent = function (colName) {
        var fc = mx($scope.NewEntity.FieldColl).firstOrDefault(p1 => p1.Name == colName);
        if (fc) {
            if (fc.FieldType == 13)
            {
                var imgName = 'img' + fc.Name;
                var imgData = fc.Name + 'Data';
                let get = document.getElementById(imgName);
                get.removeAttribute('src', '');
                $scope.beData[fc.Name] = null;
                $scope.beData[imgData] = null;
            }
            else if (fc.FieldType == 17) {

                var divName = 'img-vid-' + fc.Name;                
                let container = document.getElementById(divName);
                while (container.firstChild) { container.removeChild(container.firstChild); }                 
                $scope.beData[fc.Name] = null;
                $scope.beData[imgData] = null;
            }
        }
        
    };
    $scope.ChangeProperties = function (colName) {

        $scope.beData.ChieldEntities = $scope.NewEntity.ChieldEntities;
        GlobalServices.getNewEntityFormula($scope.NewEntity.FieldColl, $scope.beData, colName);
    }

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
      
        angular.forEach($scope.NewEntity.FieldColl, function (fc) {

            $timeout(function () {
                try {

                    if (fc.FieldType == 12) {
                        var htmName = 'htm' + fc.Name;
                        $scope.beData[fc.Name] = '';
                        let get = document.getElementById(htmName);
                        //  get.summernote('code', '');
                        $('.summernote').summernote('code', '');
                    }
                    else if (fc.FieldType == 13) {
                        var imgName = 'img' + fc.Name;
                        let get = document.getElementById(imgName);
                        get.removeAttribute('src', '');
                    }
                    else if (fc.FieldType == 17) {

                        var divName = 'img-vid-' + fc.Name;
                        let container = document.getElementById(divName);
                        while (container.firstChild) { container.removeChild(container.firstChild); }
                   
                    }

                } catch { }
            });        

             
            
        });

        if ($scope.NewEntity.ChieldEntities) {
            $scope.NewEntity.ChieldEntities.forEach(function (ce) {
                ce.RowsDataColl = [];
                ce.RowsDataColl.push({
                    FieldColl: ce.FieldColl,
                });
            });
        }

        $('input[type=file]').val('');

        $scope.beData =
        {
            UTranId: 0,
            Mode: 'Save',
        };

        $timeout(function () {
            if (myDropzone) {
                myDropzone.removeAllFiles();
            }
        });
        

        $scope.SearchData();
    }
     
     
    $scope.IsValidData = function ()
    {
         
        var newData = {};
        var isValid = true;
        var msg = "";
        $scope.NewEntity.FieldColl.forEach(function (udf) {

            if (isValid == true) {


                if (udf.FieldType == 2) {
                    var varName = udf.Name + 'Det';
                    newData[udf.Name] = $scope.beData[varName] ? $filter('date')($scope.beData[varName].dateAD, 'yyyy-MM-dd') : null;

                }
                else if (udf.FieldType == 3 && udf.Source && udf.Source.length > 0) {
                    newData[udf.Name] = $scope.beData[udf.Name];
                }
                else if (udf.FieldType == 19 && udf.Source && udf.Source.length > 0) {
                    newData[udf.Name] = $scope.beData[udf.Name];
                }
                else if (udf.FieldType == 13 || udf.FieldType == 17) {
                    var name = udf.Name + '_TMP';
                    newData[udf.Name] = $scope.beData[name];
                }
                else if (udf.FieldType == 15 || udf.FieldType == 16) {
                    var name = udf.Name + 'Files';
                    newData[udf.Name] = $scope.beData[name];
                }

                else {
                    newData[udf.Name] = $scope.beData[udf.Name];
                }

                if (udf.FieldType != 14) {
                    if ((newData[udf.Name] == undefined || newData[udf.Name] == null || isEmptyObj(newData[udf.Name])) && udf.IsMandatory == true) {
                        msg = 'Please ! Enter ' + udf.Label;
                        isValid = false;
                    }
                }
               
            }
          

        });

        if (isValid == false) { 
            Swal.fire(msg);
            return false;
        }

        return true;
    }

    $scope.AddNewData = function () {
        if ($scope.IsValidData() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateData();
                    }
                });
            }
            else
                $scope.CallSaveUpdateData();
        }
    };

    $scope.CallSaveUpdateData = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        
        var newData = {};
        angular.forEach($scope.NewEntity.FieldColl, function (udf)
        {
            if (udf.FieldType == 2) {
                var varName = udf.Name + 'Det';
                newData[udf.Name] = $scope.beData[varName] ? $filter('date')($scope.beData[varName].dateAD, 'yyyy-MM-dd') : null;
                 
            } else if (udf.FieldType == 3 && udf.Source && udf.Source.length > 0) {
                newData[udf.Name] = $scope.beData[udf.Name];
            }
            else if (udf.FieldType == 19 && udf.Source && udf.Source.length > 0) {
                newData[udf.Name] = $scope.beData[udf.Name];
            }
            else {
                newData[udf.Name] = $scope.beData[udf.Name];
            }

            if (newData[udf.Name] == undefined)
                newData[udf.Name] = null;
        });

        if ($scope.beData.UTranId > 0)
            newData.UTranId = $scope.beData.UTranId;

        newData.EntityId = $scope.NewEntity.TranId;

        if ($scope.NewEntity.ChieldEntities && $scope.NewEntity.ChieldEntities.length > 0) {            
            angular.forEach($scope.NewEntity.ChieldEntities, function (ce) {
                var cName = ce.Name + '_Coll';
                newData[cName] = [];

                angular.forEach(ce.RowsDataColl, function (rowData) {

                    var newDet = {};
                    angular.forEach(ce.FieldColl, function (udf) {
                        if (udf.FieldType == 2) {
                            var varName = udf.Name + 'Det';
                            newDet[udf.Name] = rowData[varName] ? $filter('date')(rowData[varName].dateAD, 'yyyy-MM-dd') : null;

                        } else if (udf.FieldType == 3 && udf.Source && udf.Source.length > 0) {
                            newDet[udf.Name] = rowData[udf.Name];
                        }
                        else if (udf.FieldType == 19 && udf.Source && udf.Source.length > 0) {
                            newDet[udf.Name] = rowData[udf.Name];
                        }
                        else {
                            newDet[udf.Name] = rowData[udf.Name];
                        }

                        if (newDet[udf.Name] == undefined)
                            newDet[udf.Name] = null;
                    });
                    newData[cName].push(newDet);
                });
            });
        }

        
        $http({
            method: 'POST',
            url: base_url + "Setup/ReportWriter/SaveViewNewEntity",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                //formData.append("udfColl", angular.toJson($scope.NewEntity.FieldColl));
                formData.append("jsonData", angular.toJson(data.jsonData));
                formData.append("Name", $scope.NewEntity.Name);
                formData.append("EntityTranId", TranId);

                angular.forEach($scope.NewEntity.FieldColl, function (udf)
                {
                    if (udf.FieldType == 13 || udf.FieldType == 17) {
                        var varName = udf.Name + '_TMP';
                        var imgAtt = $scope.beData[varName];
                        if (imgAtt && imgAtt.length > 0)
                            formData.append(udf.Name, imgAtt[0]);
                    }
                    else if (udf.FieldType == 14) {

                        if (myDropzone) {
                            var filesColl = myDropzone.files;                            
                            var dInd = 0;
                            if (filesColl && filesColl.length > 0) {
                                angular.forEach(filesColl, function (dc) {
                                    var flName = udf.Name + dInd;
                                    formData.append(flName, dc);
                                    dInd++;
                                });
                            }
                        }
                        
                    }
                    else if (udf.FieldType == 15) {
                        var varName = udf.Name + 'Files';
                        var dInd = 0;
                        var docColl = $scope.beData[varName];
                        if (docColl && docColl.length > 0) {
                            formData.append(udf.Name, docColl[0]);
                        }
                    }
                    else if (udf.FieldType == 16) {
                        var varName = udf.Name + 'Files';
                        var dInd = 0;
                        var docColl = $scope.beData[varName];
                        if (docColl && docColl.length > 0) {
                            angular.forEach(docColl, function (dc) {
                                var flName = udf.Name + dInd;
                                formData.append(flName, dc);
                                dInd++;
                            });
                        }
                    } 
                  }
                );
                 
                if ($scope.NewEntity.ChieldEntities) {

                    $scope.NewEntity.ChieldEntities.forEach(function (udfC) {
                        if (udfC.RowsDataColl) {
                            var r = 1;
                            udfC.RowsDataColl.forEach(function (rData)
                            {
                                var rowName =  '_Row' + r;
                                rData.FieldColl.forEach(function (rf)
                                {
                                    if (rf.FieldType == 13 || rf.FieldType == 17) {
                                        var varName = rf.Name + '_TMP';
                                        var imgAtt = rData[varName];
                                        if (imgAtt && imgAtt.length > 0)
                                            formData.append(rf.Name +rowName, imgAtt[0]);
                                    }
                                    else if (rf.FieldType == 15) {
                                        var varName = rf.Name + 'Files';
                                        var dInd = 0;
                                        var docColl = rData[varName];
                                        if (docColl && docColl.length > 0) {
                                            formData.append(rf.Name +rowName, docColl[0]);
                                        }
                                    }
                                    else if (rf.FieldType == 16) {
                                        var varName = rf.Name + 'Files';
                                        var dInd = 0;
                                        var docColl = rData[varName];
                                        if (docColl && docColl.length > 0) {
                                            angular.forEach(docColl, function (dc) {
                                                var flName = rf.Name+dInd+rowName;
                                                formData.append(flName, dc);
                                                dInd++;
                                            });
                                        }
                                    }
                                });
                                r++;
                            });
                        }


                    })
                }


                return formData;
            },
            data: { jsonData: newData }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {

                $scope.lastTranId = res.data.Data.RId;
                $scope.Print();

                $scope.ClearFields();
                
            } 

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetRecordById = function (beData) {


        $('input[type=file]').val('');

        var chieldTableColl = [];
        if ($scope.NewEntity.ChieldEntities) {
            $scope.NewEntity.ChieldEntities.forEach(function (ce) {
                chieldTableColl.push(ce.Name);
            });
        }

        $scope.loadingstatus = "running";
        var para = {
            TranId: beData.UTranId,
            Name: $scope.NewEntity.Name,
            ColName: $scope.ColNames,
            ChieldTables: chieldTableColl,
        };
        $http({
            method: 'POST',
            url: base_url + "Setup/ReportWriter/GetViewNewEntityById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    var rData = res.data.Data[$scope.NewEntity.Name][0];

                    $scope.beData.UTranId = rData.UTranId;

                    $timeout(function () {
                        angular.forEach($scope.NewEntity.FieldColl, function (udf) {
                            if (udf.FieldType == 2) {
                                var varCol = udf.Name + "_TMP";
                                if (rData[udf.Name]) {
                                    $scope.beData[varCol] = new Date(rData[udf.Name]);
                                }

                            }
                            else if (udf.FieldType == 3 && udf.Source && udf.Source.length > 0) {
                                $scope.beData[udf.Name] = rData[udf.Name];
                            }
                            else if (udf.FieldType == 19 && udf.Source && udf.Source.length > 0) {
                                $scope.beData[udf.Name] = rData[udf.Name];
                            }
                            else if (udf.FieldType == 13 || udf.FieldType == 17) {
                                var name = udf.Name + '_TMP';
                                $scope.beData[name] = rData[udf.Name];
                                $scope.beData[udf.Name] = rData[udf.Name];
                            }
                            else if (udf.FieldType == 15 || udf.FieldType == 16) {
                                var name = udf.Name + 'Files';
                                $scope.beData[name] = rData[udf.Name];
                                $scope.beData[udf.Name] = rData[udf.Name];
                            }
                            else if (udf.FieldType == 17) {
                                if (rData[udf.Name])
                                {
                                    var file_path = base_url + rData[udf.Name];
                                    var ext = getExtension(file_path);

                                    var file_type = $scope.videoExtensions.contains(ext) == true ? 'video' : 'image';// (isVideo(file_path) == true ? "video" : 'image');
                                    var divName = 'img-vid-' + udf.Name;
                                    //# get container...
                                    let container = document.getElementById(divName);

                                    //# remove any already existing child element(s)
                                    while (container.firstChild) { container.removeChild(container.firstChild); }

                                    //# if IMAGE...
                                    if (file_type == "image") {
                                        tmpElement = document.createElement("img");
                                        tmpElement.setAttribute("id", "preview-img");
                                    }

                                    //# if VIDEO...
                                    if (file_type == "video") {
                                        tmpElement = document.createElement("video");
                                        tmpElement.setAttribute("id", "preview-vid");
                                        tmpElement.setAttribute("controls", "true");

                                        tmpElement.addEventListener("loadeddata", () => {
                                            //# what to do when some video data is loaded

                                            if (tmpElement.readyState >= 3) {
                                                //# what to do when video's first frame is ready
                                                tmpElement.muted = true; //# if you want silent preview
                                                tmpElement.play();
                                            }

                                        });
                                    }
                                    //tmpElement.addClass('')
                                    ////# finalise display size
                                    //tmpElement.width = 250;
                                    tmpElement.height = 190;

                                    tmpElement.setAttribute("src", file_path);
                                    container.appendChild(tmpElement);


                                } 
                            }

                            else if (udf.FieldType == 14)
                            {
                                $scope.beData[udf.Name] = rData[udf.Name];

                                if ($scope.beData[udf.Name]) {
                                    var gallaryImg = $scope.beData[udf.Name];
                                    var ImageColl = gallaryImg.split("##");
                                    if (ImageColl && ImageColl.length > 0) {
                                        var docInd = 0;
                                        angular.forEach(ImageColl, function (doc) {
                                            var docName = udf.Name + docInd;
                                            var img = new Image();
                                            img.src = doc;
                                            img.height = 300;
                                            img.width = 300;

                                            var mockFile = {
                                                name: docName,
                                                size: 12345,
                                                width: 130,
                                                height: 130,
                                                thumbnailWidth: 130,
                                                thumbnailHeight: 130
                                            };

                                            // Call the default addedfile event handler
                                            myDropzone.emit("addedfile", mockFile);

                                            // And optionally show the thumbnail of the file:
                                            myDropzone.emit("thumbnail", mockFile, doc);

                                            myDropzone.emit("complete", mockFile);

                                            docInd++;
                                        });
                                    }
                                }


                            }
                            else {
                                $scope.beData[udf.Name] = rData[udf.Name];
                            }

                        });


                        if ($scope.NewEntity.ChieldEntities && $scope.NewEntity.ChieldEntities.length > 0) {

                            $scope.NewEntity.ChieldEntities.forEach(function (ce) {

                                var fColl = angular.copy(ce.FieldColl);
                                ce.RowsDataColl = [];
                                var cName = ce.Name + "_Coll";
                                var cDataColl = res.data.Data[cName];
                                if (cDataColl && cDataColl.length > 0) {

                                    cDataColl.forEach(function (cData) {

                                        var newRowData = {
                                            FieldColl: fColl,
                                        };
                                        angular.forEach(newRowData.FieldColl, function (udf) {
                                            if (udf.FieldType == 2) {
                                                var varCol = udf.Name + "_TMP";
                                                if (cData[udf.Name]) {
                                                    newRowData[varCol] = new Date(cData[udf.Name]);
                                                }

                                            }
                                            else if (udf.FieldType == 3 && udf.Source && udf.Source.length > 0) {
                                                newRowData[udf.Name] = cData[udf.Name];
                                            }
                                            else if (udf.FieldType == 19 && udf.Source && udf.Source.length > 0) {
                                                newRowData[udf.Name] = cData[udf.Name];
                                            }
                                            else if (udf.FieldType == 13 || udf.FieldType == 17) {
                                                var name = udf.Name + '_TMP';
                                                newRowData[name] = cData[udf.Name];
                                                newRowData[udf.Name] = cData[udf.Name];
                                            }
                                            else if (udf.FieldType == 15 || udf.FieldType == 16) {
                                                var name = udf.Name + 'Files';
                                                newRowData[name] = cData[udf.Name];
                                                newRowData[udf.Name] = cData[udf.Name];
                                            }                                         
                                            else {
                                                newRowData[udf.Name] = cData[udf.Name];
                                            }

                                        });

                                        ce.RowsDataColl.push(newRowData);
                                    });
                                }
                                else
                                {
                                    ce.RowsDataColl.push({
                                        FieldColl:fColl,
                                    });
                                }
                                 
                            })
                        }

                        $scope.beData.Mode = 'Modify';
                        $('#custom-tabs-four-profile-tab').tab('show');
                    });

                });

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }


    $scope.DeleteRecordById = function (beData, ind) {

        var colName = $scope.NewEntity.FieldColl[0].Name;

        Swal.fire({
            //scope: $scope,
            title: 'Are you sure you want to delete ' + beData[colName] + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = { TranId: beData.UTranId,Name:$scope.NewEntity.Name };

                $http({
                    method: 'POST',
                    url: base_url + "Setup/ReportWriter/DeleteViewNewEntityById",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.SearchData();
                       }

                    }, function (reason) {
                        Swal.fire('Failed' + reason);
                });
            }

        });
    }


    $scope.SearchDataColl = [];
    $scope.SearchData = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.paginationOptions.TotalRows = 0;

        var sCol = $scope.paginationOptions.SearchColDet;

        var para = {
            Name: $scope.NewEntity.Name,
            ColName: $scope.ViewColNames,
            filter: {
                DateFrom: null,
                DateTo: null,
                PageNumber: $scope.paginationOptions.pageNumber,
                RowsOfPage: $scope.paginationOptions.pageSize,
                SearchCol: (sCol ? sCol.value : ''),
                SearchVal: $scope.paginationOptions.SearchVal,
                SortingCol: $scope.SortingCol,
                SortType: ($scope.SortingCol.length > 0 ? ' asc ' : ''),
                SearchType: (sCol ? sCol.searchType : 'text')
            }
        };

        $http({
            method: 'POST',
            url: base_url + "Setup/ReportWriter/GetViewNewEntityLst",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.SearchDataColl = res.data.Data.DataColl;
                $scope.paginationOptions.TotalRows = res.data.TotalCount;
                $('#searVoucherRightBtn').modal('show');

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });


    };

    $scope.ReSearchData = function (pageInd) {

        if ($scope.NewEntity && $scope.NewEntity.FieldColl) {
            $timeout(function () {
                if (pageInd && pageInd >= 0)
                    $scope.paginationOptions.pageNumber = pageInd;
                else if (pageInd == -1)
                    $scope.paginationOptions.pageNumber = 1;

                $scope.loadingstatus = 'running';
                showPleaseWait();
                $scope.paginationOptions.TotalRows = 0;
                var sCol = $scope.paginationOptions.SearchColDet;

                var para = {
                    Name: $scope.NewEntity.Name,
                    ColName: $scope.ViewColNames,
                    filter: {
                        DateFrom: null,
                        DateTo: null,
                        PageNumber: $scope.paginationOptions.pageNumber,
                        RowsOfPage: $scope.paginationOptions.pageSize,
                        SearchCol: (sCol ? sCol.value : ''),
                        SearchVal: $scope.paginationOptions.SearchVal,
                        SortingCol: $scope.SortingCol,
                        SortType: ($scope.SortingCol.length > 0 ? ' asc ' : ''),
                        SearchType: (sCol ? sCol.searchType : 'text')
                    }
                };

                $http({
                    method: 'POST',
                    url: base_url + "Setup/ReportWriter/GetViewNewEntityLst",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    $scope.loadingstatus = 'stop';
                    hidePleaseWait();

                    if (res.data.IsSuccess && res.data.Data) {
                        $scope.SearchDataColl = res.data.Data.DataColl;
                        $scope.paginationOptions.TotalRows = res.data.TotalCount;

                    } else
                        alert(res.data.ResponseMSG);

                }, function (reason) {
                    alert('Failed' + reason);
                });
            });
        }    

    }

    $scope.AddChieldRow = function (refDataColl, ind) {

        var fileds =angular.copy(refDataColl[ind].FieldColl);
        refDataColl.splice(ind + 1, 0, { FieldColl:fileds });
    }
    $scope.delAddChieldRow = function (refDataColl, ind) {
        refDataColl.splice(ind, 1);
    }

    $scope.SelectedTran = {};
    $scope.ShowDocument = function (beData) {
        $scope.SelectedTran.DocumentColl = [];
        var documentColl = [];

        angular.forEach($scope.NewEntity.FieldColl, function (fc) {
             
            if (fc.FieldType == 13)
            {
                var doc = beData[fc.Name];
                if (doc && doc.length > 0) {
                    doc = base_url + doc;
                    documentColl.push({
                        Name: fc.Name,
                        DocPath:doc
                    });
                }
            }
            else if (fc.FieldType == 14) {
                var doc = beData[fc.Name];
                if (doc && doc.length > 0) {
                    doc = base_url + doc;
                    documentColl.push({
                        Name: fc.Name,
                        DocPath: doc
                    });
                }
            }
            else if (fc.FieldType == 15) {
                var doc = beData[fc.Name];
                if (doc && doc.length > 0) {
                    doc = base_url + doc;
                    documentColl.push({
                        Name: fc.Name,
                        DocPath: doc
                    });
                }
            }
            else if (fc.FieldType == 16) {
                var doc = beData[fc.Name];
                if (doc && doc.length > 0) {
                    doc = base_url + doc;
                    documentColl.push({
                        Name: fc.Name,
                        DocPath: doc
                    });
                }
            }
            else if (fc.FieldType == 17) {
                var doc = beData[fc.Name];
                if (doc && doc.length > 0) {
                    doc = base_url + doc;
                    documentColl.push({
                        Name: fc.Name,
                        DocPath: doc
                    });
                }
            }
             
        });

        if (documentColl && documentColl.length > 0) {
            $scope.SelectedTran.DocumentColl =documentColl;
            $('#modal-showDocument').modal('show');
        } else {
            Swal.fire('No Attachment found');
        }

        //if ($scope.NewEntity.ChieldEntities) {
        //    $scope.NewEntity.ChieldEntities.forEach(function (ce) {
        //        ce.RowsDataColl = [];
        //        ce.RowsDataColl.push({
        //            FieldColl: ce.FieldColl,
        //        });
        //    });
        //}
          
    }

    $scope.ShowPersonalImg = function (item) {
        $scope.viewImg = {
            ContentPath: '',
            FileType: null
        };

        if (item.DocPath && item.DocPath.length > 0) {
            $scope.viewImg.ContentPath = item.DocPath;
            $scope.viewImg.FileType = 'pdf';  // Assuming DocPath is for PDFs
            document.getElementById('pdfViewer').src = item.DocPath;
            $('#PersonalImg').modal('show');
        } else if (item.PhotoPath && item.PhotoPath.length > 0) {
            $scope.viewImg.ContentPath = item.PhotoPath;
            $scope.viewImg.FileType = 'image';  // Assuming PhotoPath is for images
            $('#PersonalImg').modal('show');
        } else if (item.File) {
            var blob = new Blob([item.File], { type: item.File?.type });
            $scope.viewImg.ContentPath = URL.createObjectURL(blob);
            $scope.viewImg.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';

            if ($scope.viewImg.FileType === 'pdf') {
                document.getElementById('pdfViewer').src = $scope.viewImg.ContentPath;
            }

            $('#PersonalImg').modal('show');
        } else {
            Swal.fire('No Image Found');
        }
    };



    $scope.PrintVoucher = function (rowData,ind) {
        $scope.lastTranId = rowData.UTranId;
        $scope.Print();
    }
    $scope.Print = function () {
        if ($scope.lastTranId) {
            var TranId = $scope.lastTranId;

            var templatesColl = $scope.NewEntity.TemplateColl;
            if (templatesColl && templatesColl.length > 0)
            {
                var templatesName = [];
                var sno = 1;
                angular.forEach(templatesColl, function (tc) {
                    templatesName.push(sno + '-' + tc.ReportName);
                    sno++;
                });
                var printDone = false;
                var rptPath = '';
                if (templatesColl.length == 1)
                    rptPath = templatesColl[0].Path;
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
                                    rptTranId = templatesColl[value].Path;
                                    printDone = true;

                                    var rptPara = {
                                        rpttranid: 0,
                                        istransaction: true,
                                        entityid: EntityId,
                                        voucherid: 0,
                                        tranid: TranId,
                                        vouchertype: 0,
                                        ReportName: $scope.NewEntity.Name,
                                        RptPath:rptPath
                                    };
                                    var paraQuery = param(rptPara);

                                    if (rptTranId > 0) {
                                        var newURL = base_url + "newpdfviewer.ashx?"+paraQuery;
                                        window.open(newURL);
                                    }
                                } else {
                                    resolve('You need to select:)')
                                }
                            })
                        }
                    })
                }

                if (rptPath && rptPath.length > 0) {

                    var rptPara = {
                        rpttranid: 0,
                        istransaction: true,
                        entityid: EntityId,
                        voucherid: 0,
                        tranid: TranId,
                        vouchertype: 0,
                        ReportName: $scope.NewEntity.Name,
                        RptPath: rptPath
                    };
                    var paraQuery = param(rptPara);

                    var newURL = base_url + "newpdfviewer.ashx?" + paraQuery;
                    window.open(newURL);
                }

            }
        }

    };
     

    $scope.UploadFiles = function (fc) {
        if (fc.Files_TMP && fc.Files_TMP.length > 0) {
             

            $http({
                method: 'POST',
                url: base_url + "Setup/ReportWriter/UploadFiles",
                headers: { 'Content-Type': undefined },

                transformRequest: function (data) {

                    var formData = new FormData();
                    formData.append("ColumnName", $scope.paginationOptions.SearchColDet.Name);
                    formData.append("EntityName", $scope.NewEntity.Name);
                    formData.append("FileColName", fc.Name);
                    var f = 0;
                    angular.forEach(data.files, function (fl) {
                        formData.append("file" + f, fl);
                        f = f + 1;
                    });

                    return formData;
                },
                data: { files: fc.Files_TMP }
            }).then(function (res) {

                $scope.loadingstatus = "stop";
                var data = res.data;
                Swal.fire(data.ResponseMSG);

                fc.Files_TMP = null;

            }, function (errormessage) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";

            });


        }
    };

});