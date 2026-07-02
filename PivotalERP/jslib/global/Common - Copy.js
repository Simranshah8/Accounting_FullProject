
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

String.prototype.isEmpty = function () {
    return (this.length === 0 || !this.trim());
};

String.prototype.Trim = function () {
    return this.trim();
};


String.prototype.Length = function () {
    return this.length;
};

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isHTML(str) {
    const pattern = /<\/?[a-z][\s\S]*>/i;
    return pattern.test(str);
}

String.prototype.parseDBL = function () {
    if (!this)
        return 0;
    else
        return parseFloat(this.replace(/,/g, '').replace(/[A-Za-z]/g, ''));
}
function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
}

function isValidDateTime(dateStr) {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
}

Array.prototype.toQueryString = function () {
    var out = new Array();

    for (key in this) {
        out.push(key + '=' + encodeURIComponent(this[key]));
    }

    return out.join('&');
}

function splitMathExpression(expression) {
    // Regular expression to match variables, numbers, operators, and parentheses
    const regex = /([a-zA-Z_][a-zA-Z_0-9]*|\d+\.?\d*|\+|\-|\*|\/|\(|\))/g;
    // Use match to extract all components
    return expression.match(regex);
}

function extractStringVariables(expression) {
    // Regular expression to match variable names (letters and underscores, ignoring numbers and operators)
    const regex = /[a-zA-Z_][a-zA-Z_0-9]*/g;
    // Use match to extract string variables
    return expression.match(regex);
}

function extractVariables(str) {
    const regex = /@\w+/g; // Matches words starting with @
    return str.match(regex) || []; // Returns matches or an empty array
}

function ToQueryString(obj) {
    var out = new Array();

    for (key in obj) {
        out.push(key + '=' + encodeURIComponent(obj[key]));
    }

    return out.join('&');
}

Array.prototype.insert = function (index) {
    index = Math.min(index, this.length);
    arguments.length > 1
        && this.splice.apply(this, [index, 0].concat([].pop.call(arguments)))
        && this.insert.apply(this, arguments);
    return this;
};

window.closeModal = function () {
    $('#FrmPrintReport').modal('hide');
};


function down_file(url, name) {
    var a = $("<a>")
        .attr("href", url)
        .attr("download", name)
        .appendTo("body");
    a[0].click();
    a.remove();
}

function isEmptyObj(v) {
    let type = typeof v;
    if (type === 'undefined') {
        return true;
    }
    if (type === 'boolean') {
        return !v;
    }
    if (v === null) {
        return true;
    }
    if (v === undefined) {
        return true;
    }
    if (v instanceof Array) {
        if (v.length < 1) {
            return true;
        }
    } else if (type === 'string') {
        if (v.length < 1) {
            return true;
        }
        if (v === '0') {
            return true;
        }
    } else if (type === 'object') {
        if (Object.keys(v).length < 1) {
            return true;
        }
    } else if (type === 'number') {
        //if (v === 0) {
        //    return true;
        //}
    }
    return false;
}


function getDOBAge(dob) {
    if (dob == null || dob == undefined)
        return "";

    var mdate = dob;
    var dobYear = mdate.getFullYear();
    var dobMonth = mdate.getMonth() + 1;
    var dobDate = mdate.getDate();

    //get the current date from system  
    var today = new Date();
    //date string after broking  
    var birthday = new Date(dobYear, dobMonth - 1, dobDate);

    //calculate the difference of dates  
    var diffInMillisecond = today.valueOf() - birthday.valueOf();

    //convert the difference in milliseconds and store in day and year variable          
    var year_age = Math.floor(diffInMillisecond / 31536000000);
    var day_age = Math.floor((diffInMillisecond % 31536000000) / 86400000);

    ////when birth date and month is same as today's date        
    //if ((today.getMonth() == birthday.getMonth()) && (today.getDate() == birthday.getDate())) {
    //    alert("Happy Birthday!");
    //}

    var month_age = Math.floor(day_age / 30);
    day_ageday_age = day_age % 30;

    var tMnt = (month_age + (year_age * 12));
    var tDays = (tMnt * 30) + day_age;

    return (year_age > 0 ? (year_age + " years ") : '') + (month_age > 0 ? (month_age + " months ") : '') + (day_ageday_age > 0 ? (day_ageday_age + " days") : '');

}

function isEmptyNum(v) {
    let type = typeof v;

    if (type === 'undefined') {
        return 0;
    }
    else if (v === null) {
        return 0;
    }
    else if (v === Infinity) {
        return 0;
    }
    else if (v === undefined) {
        return 0;
    }
    else if (isNaN(v) == true) {
        return 0;
    }
    else if (isFinite(v) == false) {
        return 0;
    }
    if (type === 'string') {
        if (v === '0') {
            return 0;
        }

        if (v.length == 0)
            return 0;
    }
    return v;
}


function isEmptyAmt(v) {
    let type = typeof v;

    if (type === 'undefined') {
        return 0;
    }
    else if (v === null) {
        return 0;
    }
    else if (v === Infinity) {
        return 0;
    }
    else if (v === undefined) {
        return 0;
    }
    else if (isNaN(v) == true) {
        return 0;
    }
    else if (isFinite(v) == false) {
        return 0;
    }
    if (type === 'string') {
        if (v === '0') {
            return 0;
        }
    }

    return parseFloat(v);
}

function reload_message_frame(frame_id) {
    if (window.document.getElementById(frame_id).location) {
        window.document.getElementById(frame_id).location.reload(true);
    } else if (window.document.getElementById(frame_id).contentWindow.location) {
        window.document.getElementById(frame_id).contentWindow.location.reload(true);
    } else if (window.document.getElementById(frame_id).src) {
        window.document.getElementById(frame_id).src = window.document.getElementById(frame_id).src;
    }
}

function DateFormatAD(date) {

    if (date) {
        var mtDate = moment(date);
        if (mtDate) {
            if (mtDate.format('YYYY') == '0001')
                return ''
            else
                return mtDate.format('YYYY-MM-DD');
        } else
            return '';

    }
    return '';
};

function DateFormatBS(ny, nm, nd) {
    if (ny && nm && nd && ny > 0)
        return ny + '-' + padLeft(nm, 2) + '-' + padLeft(nd, 2);
    return '';
};

function padLeft(nr, n, str) {

    if (nr && n)
        return Array(n - String(nr).length + 1).join(str || '0') + nr;
    return '';
};

function YesNoformat(val) {

    if (val == true)
        return 'YES';
    else if (val == false)
        return 'NO';
    else
        return '';
}

function Numberformat(val, noOfDecPlace) {

    if (!val || val == 0)
        return '';

    if (!noOfDecPlace)
        return numeral(val).format('0,0.00');
    else if (noOfDecPlace == 0)
        return numeral(val).format('0,0');
    else if (noOfDecPlace == 1)
        return numeral(val).format('0,0.0');
    else if (noOfDecPlace == 2)
        return numeral(val).format('0,0.00');
    else if (noOfDecPlace == 3)
        return numeral(val).format('0,0.000');
    else if (noOfDecPlace == 4)
        return numeral(val).format('0,0.0000');
    else if (noOfDecPlace == 5)
        return numeral(val).format('0,0.00000');
}

function NumberformatAC(val) {
    if (val > 0)
        return numeral(val).format('0,0.00') + ' DR';
    else if (val < 0)
        return numeral(Math.abs(val)).format('0,0.00') + ' CR';
    else
        return '';
}

function GetDateStr(ny, nm, nd) {

    return ny.toString() + '-' + nm.toString().padStart(2, '0') + '-' + nd.toString().padStart(2, '0')
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const bsMonths = ["बैशाख", "जेठ", "असार", "सावन", "भदौ", "असोज", "कार्तिक", "मंसिर", "पौष", "माघ", "फागुन", "चैत"];
const bsDays = ["आईत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि"];


const Operators =
{
    EQUAL: '=',
    LIKE: 'like'
};

function param(object) {
    return Object.keys(object).map((key) => {
        return key + '=' + encodeURIComponent(object[key])
    }).join('&');
}

app.directive('foldTable', function () {
    return {
        restrict: 'A',
        link: function ($scope, selem, attrs) {
            selem.bind('click', function (e) {
                if ($(this).hasClass("open")) {
                    $(this).removeClass("open").next(".fold").removeClass("open");
                } else {
                    $(".fold-table tr.view").removeClass("open").next(".fold").removeClass("open");
                    $(this).addClass("open").next(".fold").addClass("open");
                }
            });
        }
    }
});

app.directive('nextOnEnter', function () {
    return {
        restrict: 'A',
        link: function ($scope, selem, attrs) {
            selem.bind('keydown', function (e) {
                var code = e.keyCode || e.which;
                if (code === 13) {
                    e.preventDefault();
                    var pageElems = document.querySelectorAll('input, select, textarea'),
                        elem = e.srcElement || e.target,
                        focusNext = false,
                        len = pageElems.length;
                    for (var i = 0; i < len; i++) {
                        var pe = pageElems[i];
                        if (focusNext) {
                            if (pe.style.display !== 'none') {
                                angular.element(pe).focus();
                                break;
                            }
                        } else if (pe === elem) {
                            focusNext = true;
                        }
                    }
                }
            });
        }
    }
});

app.directive('focustonext', function () {
    return {
        restrict: 'A',
        link: function ($scope, selem, attrs) {
            selem.bind('keydown', function (e) {
                var code = e.keyCode || e.which;
                if (code === 13) {
                    e.preventDefault();
                    var pageElems = document.querySelectorAll('input, select, textarea'),
                        elem = e.srcElement || e.target,
                        focusNext = false,
                        len = pageElems.length;
                    for (var i = 0; i < len; i++) {
                        var pe = pageElems[i];
                        if (focusNext) {
                            if (pe.style.display !== 'none') {
                                document.getElementById(pe.id).focus();
                                break;
                            }
                        } else if (pe === elem) {
                            focusNext = true;
                        }
                    }
                }
            });
        }
    }
});

app.filter('accountFormat', function ($filter) {
    return function (val) {
        if (val == undefined || val == null)
            return "";

        if (val > 0)
            return numeral(val).format('0,0.00') + ' DR';
        else if (val < 0)
            return numeral(Math.abs(val)).format('0,0.00') + ' CR';
        else
            return '';
    }
});

app.filter('timeFormat', function ($filter) {
    return function (bv) {
        if (bv)
            return $filter('date')(new Date(bv), 'h:mma')
        else
            return "";
    }
});

app.filter('padLeft', function ($filter) {
    return function (bv, n) {
        if (bv)
            return padLeft(bv, n);
        else
            return "";
    }
});

app.filter("commaBreak",

    function () {

        return function (value) {

            if (!value || !value.length) return;

            return value.split(',');

        }
    });

app.filter('yesNoFormat', function ($filter) {
    return function (bv) {
        if (bv == true)
            return 'YES'
        else
            return 'NO';
    }
});

app.filter('dateFormat', function ($filter) {
    return function (bv) {
        if (bv)
            return $filter('date')(new Date(bv), 'yyyy-MM-dd')
        else
            return "";
    }
});
app.filter('expFormat', function ($filter) {
    return function (bv) {
        if (bv)
            return $filter('date')(new Date(bv), 'yyyy-MM')
        else
            return "";
    }
});
app.filter('dayFormat', function ($filter) {
    return function (num) {
        switch (num) {
            case 1:
                return "Sunday";
            case 2:
                return "Monday";
            case 3:
                return "Tuesday";
            case 4:
                return "Wednesday";
            case 5:
                return "Thursday";
            case 6:
                return "Friday";
            case 7:
                return "Saturday";
            default:
                return "";
        }
    }
});
app.filter('sumOfValue', function () {
    return function (data, key) {
        if (angular.isUndefined(data) || angular.isUndefined(key))
            return 0;
        var sum = 0;
        angular.forEach(data, function (value) {
            var v = isEmptyNum(value[key]);
            sum = sum + parseFloat(v);
        });
        return sum;
    }
});
app.filter('avgOfValue', function () {
    return function (data, key) {
        if (angular.isUndefined(data) || angular.isUndefined(key))
            return 0;
        var sum = 0;
        var count = 0;
        angular.forEach(data, function (value) {
            sum = sum + parseFloat(value[key]);
            count++;
        });
        return (sum / count);
    }
});

app.filter('minOfValue', function () {
    return function (input, key) {
        if (!Array.isArray(input) || input.length === 0) {
            return null;
        }
        if (key) {
            return input.reduce((prev, curr) => prev[key] < curr[key] ? prev : curr)[key];
        }
        return Math.min(...input);
    };
});

// Filter to find the maximum value
app.filter('maxOfValue', function () {
    return function (input, key) {
        if (!Array.isArray(input) || input.length === 0) {
            return null;
        }
        if (key) {
            return input.reduce((prev, curr) => prev[key] > curr[key] ? prev : curr)[key];
        }
        return Math.max(...input);
    };
});


app.filter('countOfValue', function () {
    return function (data, key) {
        if (angular.isUndefined(data) || angular.isUndefined(key))
            return 0;
        var sum = 0;
        angular.forEach(data, function (value) {
            var v = value[key];
            if (v && v.length > 0) {
                sum = sum + 1;
            }
        });
        return sum;
    }
});

//app.directive('fileModel', ['$parse', '$timeout', function ($parse, $timeout) {
//    return {
//        require: 'ngModel',        
//        restrict: 'A',
//        link: function (scope, element, attrs, ngModel) {

//            element.bind('change', function () {
//                scope.$apply(function () {
//                    ngModel.$setViewValue(element[0].files);
//                }); 

//            });
//        }
//    };
//}]);

app.directive('productFileModel', ['$parse', '$timeout', '$http', function ($parse, $timeout, $http) {



    return {
        require: 'ngModel',
        scope: {
            itemfilepath: "=?",
            sheetcoll: "=?"
        },
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {


            element.bind('change', function () {
                scope.$apply(function () {
                    var flColl = Array.from(element[0].files)

                    if (flColl.length > 0) {
                        var SelectedFile = flColl[0];

                        scope.itemfilepath = null;
                        scope.sheetcoll = [];

                        $http({
                            method: 'POST',
                            url: base_url + "Setup/Security/SaveImportDataExcelFile",
                            headers: { 'Content-Type': undefined },

                            transformRequest: function (data) {

                                var formData = new FormData();
                                //formData.append("jsonData", angular.toJson(data.jsonData));

                                formData.append("file0", data.files);

                                return formData;
                            },
                            data: { files: SelectedFile }
                        }).then(function (res) {

                            hidePleaseWait();
                            scope.loadingstatus = "stop";
                            var data = res.data;
                            if (data.IsSuccess) {

                                $timeout(function () {
                                    scope.$apply(function () {
                                        scope.itemfilepath = data.FilePath;
                                        scope.sheetcoll = data.SheetColl;
                                    });
                                });

                                $('#AddNewExcel').modal('show');

                            } else {
                                Swal.fire(data.ResponseMSG);
                            }

                        }, function (errormessage) {
                            hidePleaseWait();
                            scope.loadingstatus = "stop";

                        });

                    }

                    //ngModel.$setViewValue(flColl);
                });


            });
        }
    };
}]);

app.directive('fileModelImport', ['$parse', '$timeout', function ($parse, $timeout) {
    return {
        require: 'ngModel',
        scope: {
            afterSelected: '&'
        },
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {

            element.bind('change', function () {
                scope.$apply(function () {
                    var flColl = Array.from(element[0].files)
                    ngModel.$setViewValue(flColl);
                });

                $timeout(function () {
                    scope.$apply(function () {
                        scope.afterSelected();
                    });
                });

            });
        }
    };
}]);

app.directive('fileModel', ['$parse', '$timeout', function ($parse, $timeout) {
    return {
        require: 'ngModel',
        scope: {
            afterSelected: '&?',
            fileread: "=?",
            beData: "=?"
        },
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {

            element.bind('change', function () {
                scope.$apply(function () {
                    var flColl = Array.from(element[0].files)
                    ngModel.$setViewValue(flColl);
                });

                if (element[0].files && element[0].files.length > 0) {
                    var file = element[0].files[0];
                    var reader = new FileReader();
                    reader.onload = function (evt) {
                        return scope.$apply(function () {
                            scope.fileread = evt.target.result;
                        });
                    };
                    reader.readAsDataURL(file);
                } else
                    scope.fileread = null;

                if (scope.afterSelected) {
                    $timeout(function () {
                        scope.$apply(function () {

                            if (scope.beData)
                                scope.afterSelected(scope.beData);
                            else
                                scope.afterSelected();
                        });

                    });
                }


            });
        }
    };
}]);

app.directive('imgVideoModel', ['$parse', '$timeout', function ($parse, $timeout) {
    return {
        require: 'ngModel',
        scope: {
            afterSelected: '&?',
            fileread: "=?",
            beData: "=?"
        },
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {
            var fieldname = '';
            if (attrs.fieldname)
                fieldname = attrs.fieldname;

            element.bind('change', function () {
                scope.$apply(function () {
                    var flColl = Array.from(element[0].files)
                    ngModel.$setViewValue(flColl);
                });

                if (element[0].files && element[0].files.length > 0) {
                    var file = element[0].files[0];

                    var file_ext, file_path, file_type, file_name;

                    file_ext; //# will extract file extension
                    file_type = file.type; file_name = file.name;
                    file_path = (window.URL || window.webkitURL).createObjectURL(file);

                    //# get file extension (eg: "jpg" or "jpeg" or "webp" etc)
                    file_ext = file_name.toLowerCase();
                    file_ext = file_ext.substr((file_ext.lastIndexOf(".") + 1), (file_ext.length - file_ext.lastIndexOf(".")));

                    //# get file type (eg: "image" or "video")
                    file_type = file_type.toLowerCase();
                    file_type = file_type.substr(0, file_type.indexOf("/"));


                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = function (evt) {
                        //# POP-UP ...if you want to show (Alert box with) file details...

                        if (evt.target.readyState == FileReader.DONE) {

                            scope.$apply(function () {
                                scope.fileread = evt.target.result;
                            });

                            var divName = 'img-vid-' + fieldname;
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


                } else
                    scope.fileread = null;

                if (scope.afterSelected) {
                    $timeout(function () {
                        scope.$apply(function () {

                            if (scope.beData)
                                scope.afterSelected(scope.beData);
                            else
                                scope.afterSelected();
                        });

                    });
                }


            });
        }
    };
}]);

app.directive('fileModelResize', ['$parse', '$timeout', function ($parse, $timeout) {
    return {
        require: 'ngModel',
        scope: {
            afterSelected: '&?',
            fileread: "="
        },
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {

            resizeImage = function (dtFile) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var img = new Image();
                    img.src = this.result;

                    setTimeout(function () {
                        var canvas = document.createElement("canvas");

                        var MAX_WIDTH = 850;
                        var MAX_HEIGHT = 600;
                        var width = 750;
                        var height = 600;

                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0, width, height);

                        var dataurl = canvas.toDataURL("image/png");

                        $timeout(function () {
                            scope.$apply(function () {
                                scope.fileread.push(dataurl);
                            });
                        });
                    }, 100);
                };
                reader.readAsDataURL(dtFile);
            }


            element.bind('change', function () {
                scope.$apply(function () {
                    ngModel.$setViewValue(element[0].files);
                });
                scope.fileread = [];
                if (element[0].files && element[0].files.length > 0) {
                    angular.forEach(element[0].files, function (fl) {
                        resizeImage(fl);
                    });
                }

                if (scope.afterSelected) {
                    setTimeout(function () {
                        $timeout(function () {
                            scope.$apply(function () {
                                scope.afterSelected();
                            });

                        });
                    }, 1000)
                }


            });
        }
    };
}]);

app.directive('compile', function ($compile, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            $timeout(function () {
                $compile(elem.contents())(scope);
            });
        }
    };
});
app.filter('unsafe', function ($sce) {

    return function (val) {

        return $sce.trustAsHtml(val);

    };

});

app.filter('formatNumber', function ($filter) {
    return function (num) {
        return $filter('number')(num, 2);
    }
});

app.filter('formatNumberEmpty', function ($filter) {
    return function (num) {
        if (num == 0)
            return '';
        return $filter('number')(num, 2);
    }
});

app.filter('formatNumberAC', function ($filter) {
    return function (num) {
        return $filter('number')(Math.abs(num), 2) + ' ' + (num > 0 ? 'DR' : 'CR');
    }
});


app.filter('formatDrCr', function ($filter) {
    return function (num) {
        if (num == 1)
            return "DR";
        else if (num == 2)
            return "CR";
        else "";
    }
});

app.filter('findById', function () {

    // pass fullname to function and return output
    return function (object, field, filter) {
        if (!object) return {};
        if (!filter) return object;

        var result = null;
        Object.keys(object).forEach(function (key) {
            if (object[key][field] === filter) {
                result = object[key];
                return result;
            }
        });

        return result;
    };
});


app.filter('trusted', ['$sce', function ($sce) {
    return $sce.trustAsResourceUrl;
}]);

app.factory('Excel', function ($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
        format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
    return {
        tableToExcel: function (tableId, worksheetName) {
            var table = $(tableId),
                ctx = { worksheet: worksheetName, table: table.html() },
                href = uri + base64(format(template, ctx));
            return href;
        }
    };
});

app.directive('printTbl', ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {
    return {
        scope: {
            tableId: "=?",
            ignoreColumn: "=?",
            reportName: "=?"
        },
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                if (scope.ignoreColumn == undefined || scope.ignoreColumn == null)
                    scope.ignoreColumn = '';

                if (scope.reportName == undefined || scope.reportName == null)
                    scope.reportName = '';

                $http({
                    method: 'GET',
                    url: base_url + "Global/GetCompanyDetail",
                    dataType: "json"
                }).then(function (res) {
                    if (res.data.IsSuccess && res.data.Data) {
                        var Abt = res.data.Data;
                        if (!Abt.CompanyLogoPath || Abt.CompanyLogoPath.length == 0)
                            Abt.LogoPath = "/wwwroot/dynamic/images/logo.png"

                        var totalColumnCount = 0;
                        $(scope.tableId).find('thead').find('tr').each(function () {
                            $(scope.tableId).filter(':visible').find('th').each(function (index, data) {
                                if ($(scope.tableId).css('display') != 'none') {
                                    if (scope.ignoreColumn.indexOf(index) == -1) {
                                        totalColumnCount++;
                                    }
                                }
                            });
                        });


                        var pageHeader = "<table class=\"main-table table table-bordered table-striped table-hover table-sm\"> <thead>";
                        pageHeader = pageHeader + "<tr><th style='text-align: center;'  align='center' colspan='" + totalColumnCount + "'>" + "<h3 style='margin: 15px;'>" + Abt.Name + "</h3>" + "</th></tr>";
                        pageHeader = pageHeader + "<tr><th style='text-align: center;' align='center' colspan='" + totalColumnCount + "'>" + Abt.Address + "</th></tr>";
                        pageHeader = pageHeader + "<tr><th style='text-align: center;' align='center' colspan='" + totalColumnCount + "'> <b><u>" + scope.reportName + "</u></b></th></tr>";
                        pageHeader = pageHeader + " </thead> </table>";

                        $(scope.tableId).printThis(
                            {
                                importCSS: true,
                                formValues: false,
                                pageTitle: 'Test Tile',
                                header: pageHeader,
                                copyTagClasses: true
                            }
                        );


                    } else
                        alert(res.data.ResponseMSG);

                }, function (reason) {
                    alert('Failed' + reason);
                });


            });
        }
    };
}]);
app.directive('printDiv', ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {
    return {
        scope: {
            divId: "=?",
            reportName: "=?"
        },
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('click', function () {

                if (scope.reportName == undefined || scope.reportName == null)
                    scope.reportName = '';

                $http({
                    method: 'GET',
                    url: base_url + "Global/GetCompanyDetail",
                    dataType: "json"
                }).then(function (res) {
                    if (res.data.IsSuccess && res.data.Data) {
                        var Abt = res.data.Data;
                        if (!Abt.CompanyLogoPath || Abt.CompanyLogoPath.length == 0)
                            Abt.LogoPath = "/wwwroot/dynamic/images/logo.png"

                        var totalColumnCount = 6;


                        var pageHeader = "<table class=\"main-table table table-bordered table-striped table-hover table-sm\"> <thead>";
                        pageHeader = pageHeader + "<tr><th style='text-align: center;'  align='center' colspan='" + totalColumnCount + "'>" + "<h3 style='margin: 15px;'>" + Abt.Name + "</h3>" + "</th></tr>";
                        pageHeader = pageHeader + "<tr><th style='text-align: center;' align='center' colspan='" + totalColumnCount + "'>" + Abt.Address + "</th></tr>";
                        pageHeader = pageHeader + "<tr><th style='text-align: center;' align='center' colspan='" + totalColumnCount + "'> <b><u>" + scope.reportName + "</u></b></th></tr>";
                        pageHeader = pageHeader + " </thead> </table>";

                        $(scope.divId).printThis(
                            {
                                importCSS: true,
                                formValues: false,
                                pageTitle: 'Test Tile',
                                header: pageHeader,
                                copyTagClasses: true
                            }
                        );


                    } else
                        alert(res.data.ResponseMSG);

                }, function (reason) {
                    alert('Failed' + reason);
                });


            });
        }
    };
}]);

app.directive('closeDailog', [function ($timeout) {
    return {
        scope: {
            modalid: "=?",
        },
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('keydown', function (event) {
                if (event.key === 'Escape') {
                    $(scope.modalid).modal('hide');
                }
            });
        }
    };
}]);

app.directive('exportExcel', ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {

    function linkFN(scope, element, attrs) {
        element.bind('click', function () {

            $http({
                method: 'GET',
                url: base_url + "Global/GetCompanyDetail",
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    var Abt = res.data.Data;
                    if (!Abt.CompanyLogoPath || Abt.CompanyLogoPath.length == 0)
                        Abt.LogoPath = "/wwwroot/dynamic/images/logo.png"


                    if (!scope.fileType)
                        scope.fileType = 'excel';

                    var arrBind = [];

                    if (scope.ignoreColumn && scope.ignoreColumn.length > 0) {
                        angular.forEach(scope.ignoreColumn.split(','), function (edet) {
                            arrBind.push(parseInt(edet));
                        });
                    }
                    var option = {
                        tableId: scope.tableId,
                        sheetName: scope.sheetName,
                        ignoreColumn: arrBind,
                        type: scope.fileType,
                        companyName: Abt.Name,
                        companyAddress: Abt.Address,
                        reportName: (scope.reportName ? scope.reportName : 'Test Report')
                    };
                    //var exportHref = Excel.tableToExcel(option);
                    $(scope.tableId).tableExport(option);

                } else
                    alert(res.data.ResponseMSG);

            }, function (reason) {
                alert('Failed' + reason);
            });

        });
    }

    return {
        scope: {
            tableId: "=?",
            sheetName: "=?",
            ignoreColumn: "=?",
            fileType: "=?",
            reportName: "=?"
        },
        restrict: 'A',
        link: linkFN
    };
}]);




app.directive("htmlEditor", ['$timeout', function ($timeout) {
    return {
        require: 'ngModel',
        link: function (scope, el, attr, ngModel) {

            var onFocus = false;

            el.summernote({
                height: 300,        // set editor height
                minHeight: null,    // set minimum height of editor
                maxHeight: null,    // set maximum height of editor
                focus: false        // set focus to editable area after initializing summernote
            });

            scope.$watch(function () {
                return ngModel.$modelValue;
            }, function (newValue) {
                if (onFocus == false) {
                    $timeout(function () {
                        $(el).summernote('code', ngModel.$modelValue)
                    });
                }
            });

            $(el).on('summernote.focus', function () {
                onFocus = true;
            });
            $(el).on('summernote.blur', function () {
                onFocus = false;
            });

            $(el).on('summernote.change', function (e) {
                var strVal = $(el).summernote('code');
                scope.$apply(function () {
                    ngModel.$setViewValue(strVal);
                });
            });
        }
    };
}]);


app.directive('nameInput', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                var transformedInput = text.replace(/[^A-Za-z ]/g, '');
                console.log(transformedInput);
                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                return transformedInput;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

app.directive('numberOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                var transformedInput = text.replace(/[^0-9 ]/g, '');
                console.log(transformedInput);
                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                return transformedInput;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
app.directive('numberInput', function ($filter) {
    return {
        require: 'ngModel',
        scope: {
            noofdecimal: '=?',
            formula: '=?',
            islast: '=?',
            formulatext: '=?',
        },
        link: function (scope, elem, attrs, ngModelCtrl) {

            ngModelCtrl.$formatters.push(function (modelValue) {
                return setDisplayNumber(modelValue, true);
            });

            // it's best to change the displayed text using elem.val() rather than
            // ngModelCtrl.$setViewValue because the latter will re-trigger the parser
            // and not necessarily in the correct order with the changed value last.
            // see http://radify.io/blog/understanding-ngmodelcontroller-by-example-part-1/
            // for an explanation of how ngModelCtrl works.
            ngModelCtrl.$parsers.push(function (viewValue) {

                if (viewValue == '=') {

                    scope.formulatext = viewValue;
                    scope.formula = true;
                    scope.islast = false;
                    return viewValue;
                }
                setDisplayNumber(viewValue);
                return setModelNumber(viewValue);

                //var val = setModelNumber(viewValue);
                //if (mx(viewValue).contains('=') == true) {
                //    return viewValue;
                //} else
                //    return val;
            });

            // occasionally the parser chain doesn't run (when the user repeatedly 
            // types the same non-numeric character)
            // for these cases, clean up again half a second later using "keyup"
            // (the parser runs much sooner than keyup, so it's better UX to also do it within parser
            // to give the feeling that the comma is added as they type)

            elem.bind('blur', function () {
                scope.islast = true;
            });
            elem.bind('keyup focus blur', function (e) {

                if (e.keyCode) {
                    if (e.which == 13) {
                        scope.islast = true;
                    }
                }
                setDisplayNumber(elem.val());
            });

            function setDisplayNumber(val, formatter) {
                //val = isEmptyAmt(val);
                if (val == null || val == undefined)
                    val = 0;

                var valStr, displayValue;

                if (mx(val).contains('=') == true) {
                    scope.formulatext = val;
                    if (scope.islast == true) {

                        scope.islast = false;
                        try {
                            val = math.evaluate(val.replace('=', ''));
                            var mval = setModelNumber(val);
                            ngModelCtrl.$setViewValue(mval);
                            ngModelCtrl.$modelValue = mval;
                            setDisplayNumber(mval);


                        } catch {
                            elem.val('0');
                            return 0;
                        }

                        if (!val || val === 'undefined') {
                            elem.val('0');
                            return 0;
                        }

                    }
                    else
                        return val;
                }


                if (typeof val === 'undefined') {
                    return 0;
                }

                valStr = val.toString();
                displayValue = valStr.replace(/,/g, '').replace(/[A-Za-z]/g, '');
                displayValue = parseFloat(displayValue);
                displayValue = (!isNaN(displayValue)) ? displayValue.toString() : '';

                // handle leading character -/0
                if (valStr.length === 1 && valStr[0] === '-') {
                    displayValue = valStr[0];
                } else if (valStr.length === 1 && valStr[0] === '0') {
                    displayValue = '';
                } else {
                    if (!attrs.formatnumber || attrs.formatnumber == true) {

                        var dvStr = displayValue.toString();
                        if (scope.noofdecimal && scope.noofdecimal == 0)
                            displayValue = $filter('number')(displayValue, scope.noofdecimal);
                        else if (scope.noofdecimal && dvStr.indexOf('.') > 0) {

                            try {
                                var noofdec = dvStr.substr(dvStr.indexOf('.') + 1).length;

                                if (noofdec <= scope.noofdecimal)
                                    displayValue = $filter('number')(displayValue, noofdec);
                                else
                                    displayValue = $filter('number')(displayValue, scope.noofdecimal);
                            } catch {
                                displayValue = $filter('number')(displayValue);
                            }

                        }
                        else
                            displayValue = $filter('number')(displayValue);
                    }

                }

                // handle decimal
                if (!attrs.integer) {
                    if (displayValue.indexOf('.') === -1) {
                        if (valStr.slice(-1) === '.') {
                            displayValue += '.';
                        } else if (valStr.slice(-2) === '.0') {
                            displayValue += '.0';
                        } else if (valStr.slice(-3) === '.00') {
                            displayValue += '.00';
                        }
                        else if (valStr.slice(-4) === '.000') {
                            displayValue += '.000';
                        }
                        else if (valStr.slice(-5) === '.0000') {
                            displayValue += '.0000';
                        }
                        else if (valStr.slice(-6) === '.00000') {
                            displayValue += '.00000';
                        }
                        else if (valStr.slice(-7) === '.000000') {
                            displayValue += '.000000';
                        }
                        else if (valStr.slice(-8) === '.0000000') {
                            displayValue += '.0000000';
                        }
                    } // handle last character 0 after decimal and another number
                    else {
                        //if (valStr.slice(-1) === '0' && !scope.noofdecimal) {
                        //    displayValue += '0';
                        //}
                        if (valStr.slice(-8) === '00000000') {
                            displayValue += '00000000';
                        }
                        else if (valStr.slice(-7) === '0000000') {
                            displayValue += '0000000';
                        }
                        else if (valStr.slice(-6) === '000000') {
                            displayValue += '000000';
                        }
                        else if (valStr.slice(-5) === '00000') {
                            displayValue += '00000';
                        }
                        else if (valStr.slice(-4) === '0000') {
                            displayValue += '0000';
                        }
                        else if (valStr.slice(-3) === '000') {
                            displayValue += '000';
                        }
                        else if (valStr.slice(-2) === '00') {
                            displayValue += '00';
                        }
                        else if (valStr.slice(-1) === '0') {
                            displayValue += '0';
                        }
                    }
                }

                if (attrs.positive && displayValue[0] === '-') {
                    displayValue = displayValue.substring(1);
                }

                if (typeof formatter !== 'undefined') {
                    return (displayValue === '') ? 0 : displayValue;
                } else {
                    elem.val((displayValue === '0') ? '' : displayValue);
                }
            }

            function setModelNumber(val) {

                if (mx(val).contains('=') == true) {
                    try {
                        scope.formulatext = val;
                        return val;
                        //val = math.evaluate(val.replace('=', ''));


                        //if (math.isNumber(val) == false)
                        //    return val;

                    } catch {
                        return val;
                    }
                }

                var modelNum = val.toString().replace(/,/g, '').replace(/[A-Za-z]/g, '');
                modelNum = parseFloat(modelNum);
                modelNum = (!isNaN(modelNum)) ? modelNum : 0;
                if (modelNum.toString().indexOf('.') !== -1) {
                    // modelNum = Math.round((modelNum + 0.00001) * 100) / 100;
                }
                if (attrs.positive) {
                    modelNum = Math.abs(modelNum);
                }
                return modelNum;
            }
        }
    };
});
app.directive("allLedger", ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {

    function link(scope, element, attrs, ngModel) {

        var placeholder = "** Select Ledger **";
        var showDetails = false;
        var showclosing = true;

        if (attrs.placeholder)
            placeholder = attrs.placeholder;

        if (attrs.showdetails == true || attrs.showdetails == "true")
            showDetails = true;

        if (attrs.showdetails == false || attrs.showdetails == "false")
            showclosing = false;

        if (attrs.showclosing == false || attrs.showclosing == "false")
            showclosing = false;

        var VoucherType = 0;
        if (attrs.vouchertype)
            VoucherType = attrs.vouchertype;

        var ledgerType = 0;
        if (attrs.ledgertype)
            ledgerType = attrs.ledgertype;

        var forTransaction = false;
        if (attrs.fortransaction)
            forTransaction = attrs.fortransaction;

        let headerAdded = false;
        function formatResult(item) {
            if (!item.id) return item.text; // Show placeholder text

            return $(
                `<div class="custom-result-product">
                                <table class="custom-table-product" style="font-size: 12px;">
                                    <tbody>
                                        <tr>
                                            <td style="width: 15%;">${item.data.Code}</td>
                                            <td style="width: 45%;" class="px-2">${item.text}</td>
                                            <td style="width: 15%;" class="px-2">${item.data.Closing}</td>
                                            <td style="width: 10%;">${item.data.PanVat}</td>
                                            <td style="width: 15%;">${item.data.GroupName}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>`
            );
        }
        // Function to format the selected item
        function formatSelection(item) {
            return item.text || item.id;
        }
        $(element).select2({
            placeholder: placeholder,
            allowClear: true,
            //openOnEnter: true,
            width: '100%',
            multiple: false,
            minimumInputLength: 1,
            minimumResultsForSearch: 10,
            templateResult: formatResult, // Custom template for results (table format)
            //triggerChange: true,
            ajax: {
                quietMillis: 300,
                url: base_url + "Global/GetAllLedger",
                dataType: "json",
                type: "GET",
                data: function (params) {

                    var vid = (scope.voucherId ? scope.voucherId : null);

                    var queryParameters =
                    {
                        Top: 10,
                        ColName: "Led.Name",
                        Operator: "like",
                        ForTransaction: forTransaction,
                        OrderByCol: "Led.Name",
                        ColValue: params.term,
                        LedgerType: ledgerType,
                        VoucherId: vid
                    }
                    return queryParameters;
                },
                processResults: function (res) {
                    if (res.IsSuccess == false) {
                        alert(res.ResponseMSG);
                        return;
                    }

                    if (res.Data.length > 0) {
                        scope.ledgerDetail = res.Data[0];
                        scope.ledgerDetail.Init = false;
                        ngModel.$setViewValue(scope.ledgerDetail.LedgerId);
                    } else {
                        scope.ledgerDetail = null;
                        ngModel.$setViewValue(null);
                    }


                    //return { results: data };
                    return {
                        results: $.map(res.Data, function (item) {
                            //scope.ledgerDetail = item;
                            //ngModel.$setViewValue(item.LedgerId);
                            return {
                                text: item.Name + ' - ' + item.Alias + ' - ' + item.Code + ' - ' + item.PanVat,
                                id: item.LedgerId,
                                data: item
                            }
                        })
                    };
                }
            },
            initSelection: function (element, callback) {
                scope.$watch("model", function (newValue, oldValue) {
                    $timeout(function () {
                        if (ngModel.$modelValue || ngModel.$modelValue > 0) {
                            var id = ngModel.$modelValue;

                            if (id != null && id !== "" && id > 0 && (!scope.ledgerDetail || scope.ledgerDetail.LedgerId != id)) {

                                showPleaseWait();

                                return $.ajax(
                                    base_url + "Global/GetLedgerDetail?LedgerId=" + id + "&VoucherType=" + VoucherType + "&ShowClosing=" + showclosing,
                                    {
                                        dataType: "json",
                                        type: "GET",
                                        // data: queryParameters
                                    }).done(function (res) {

                                        hidePleaseWait();

                                        if (res.IsSuccess == false) {
                                            alert(res.ResponseMSG);
                                        }
                                        else if (res.IsSuccess == true) {
                                            scope.ledgerDetail = res.Data;
                                            scope.$apply(function () {
                                                scope.ledgerDetail.Init = true;
                                                scope.ledgerDetail = res.Data;
                                            });

                                            var item = res.Data;
                                            var tData =
                                            {
                                                text: item.Name + ' - ' + item.Alias + ' - ' + item.Code + ' - ' + item.PanVat,
                                                id: item.LedgerId,
                                                data: item
                                            }


                                            callback(tData);
                                        } else
                                            alert("No Data Found on Load");

                                    });
                            } else {

                                if (scope.ledgerDetail) {
                                    var item = scope.ledgerDetail;
                                    var tData =
                                    {
                                        text: item.Name + ' - ' + item.Alias + ' - ' + item.Code + ' - ' + item.PanVat,
                                        id: item.LedgerId,
                                        data: item
                                    }
                                    callback(tData);
                                }

                            }
                        } else {
                            var tData = {
                                id: 0,
                                text: ''
                            };
                            callback(tData);
                        }

                    });
                });

            }
        });


        $(element).on("select2:unselecting", function (e) {
            scope.ledgerDetail = {};
            scope.sideBarData = [];
            ngModel.$setViewValue(null);
        });

        $(element).on("select2:open", function (e) {

            $('.select2-dropdown').css('min-width', '700px');

            if (!headerAdded) {
                $(".select2-results").prepend(
                    `<div class="custom-result-product">
                                    <table class="custom-table-product" style="font-size: 12px;">
                                        <thead>
                                            <tr>
                                                <th style="width: 15%;">Code</th>
                                                <th style="width: 45%;">Name</th>
                                                <th style="width: 15%;" >Balance</th>
                                                <th style="width: 10%;">PAN/Vat</th>
                                                <th style="width: 15%;">Group</th>                                                
                                            </tr>
                                        </thead>
                                    </table>
                                </div>`
                );
                headerAdded = true; // Set flag to prevent multiple header additions

            }

            //Added by suresh
            if (!$('.select2-add-new').length) {
                $('.select2-results').append(`
            <div class="select2-add-new" style="
                position: sticky;
                bottom: 0;
                z-index: 1;
                background: #f8f9fa;
                padding: 8px;
                text-align: right;
                border-top: 1px solid #ddd;">
                <button type="button" class="btn btn-sm btn-primary" style="min-width:80px;font-size:13px">Add New</button>
            </div>
        `);
            }
            //Ends
            $timeout(function () {
                scope.$apply(function () {

                    var selectedData = $(element).select2('data');
                    if (selectedData && selectedData.length > 0) {

                        if (!selectedData[0].data) {
                            //scope.ledgerDetail = {};
                            //scope.sideBarData = [];
                            //ngModel.$setViewValue(null);
                        }
                    }

                    if (scope.ledgerDetail)
                        scope.ledgerDetail.Init = false;

                    scope.confirmAction();
                    //if (scope.ledgerDetail && scope.ledgerDetail.LedgerId > 0) {
                    //    //$(element).select2("close");
                    //    scope.confirmAction();
                    //}

                });
            });

            setTimeout(function () {
                var searchInput = document.querySelector('.select2-search__field');

                if (searchInput) {
                    searchInput.addEventListener('keydown', function (event) {
                        // Check for Ctrl+C
                        if (event.ctrlKey && event.key === 'c') {
                            // Get the selected text from Select2

                            if (scope.ledgerDetail) {
                                // Copy the selected text to the clipboard
                                navigator.clipboard.writeText(scope.ledgerDetail.Name).then(function () {
                                    //    console.log('Text copied to clipboard: ' + scope.ledgerDetail.Name);
                                }).catch(function (err) {
                                    console.error('Failed to copy text: ', err);
                                });
                            }
                        }
                    });
                }
            }, 0);

            // alert("focus");
            //  $('#sidebarzz').toggleClass('active');
        });
        $(element).on("select2:close", function (e) {


            //$('#sidebarzz').toggleClass('active');
        });
        $(element).on("paste", function (e) {

            console.log(e);
            //$('#sidebarzz').toggleClass('active');
        });
        $(element).on("change", function (e) {
            scope.sideBarData = [];

            var selectedData = $(element).select2('data');

            if (selectedData && selectedData.length > 0) {
                var selectedLedger = selectedData[0].data;
                ngModel.$setViewValue(selectedLedger.LedgerId);
                scope.ledgerDetail = selectedLedger;
                scope.$apply(function () {
                    scope.ledgerDetail = selectedLedger;
                });

                //navigator.clipboard.writeText(selectedLedger.Name)
                //    .then(() => {
                //        console.log('Copied: ' + selectedLedger.Name);
                //    })
                //    .catch(err => {
                //        console.error('Failed to copy text: ', err);
                //    });

                if (showDetails) {

                    showPleaseWait();

                    var vtype = (VoucherType ? VoucherType : 0);
                    $http({
                        method: 'GET',
                        url: base_url + "Global/GetLedgerDetail?LedgerId=" + selectedLedger.LedgerId + "&VoucherType=" + vtype + "&ShowClosing=" + showclosing,
                        dataType: "json"
                    }).then(function (res) {

                        hidePleaseWait();

                        if (res.data.IsSuccess && res.data.Data) {
                            var led = res.data.Data;
                            scope.ledgerDetail = led;
                            $timeout(function () {
                                scope.$apply(function () {
                                    scope.ledgerDetail = led;
                                    scope.ledgerDetail.Init = false;
                                    scope.sideBarData = [];
                                    scope.sideBarData.push({ text: 'Group Name', value: led.GroupName }, { text: 'Ledger Code', value: led.Code }, { text: 'Pan Vat No', value: led.PanVat }, { text: 'Address', value: led.Address }, { text: 'Closing Balance', value: $filter('formatNumberAC')(led.Closing) }, { text: 'Credit Limit', value: $filter('formatNumber')(led.CreditLimitAmt) }, { text: 'PDC Cheque', value: $filter('formatNumber')(led.PDCAmt) }, { text: 'ODC Cheque', value: $filter('formatNumber')(led.ODCAmt) }, { text: 'Total Sales', value: $filter('formatNumber')(led.TranAmt) }, { text: 'Last Sales Date', value: led.LastTranDateBS }, { text: 'B.G. Amount', value: $filter('formatNumber')(led.BGAmt) }, { text: 'Opening', value: $filter('formatNumberAC')(led.Opening) }, { text: 'Total Dr', value: $filter('formatNumber')(led.DrAmt) }, { text: 'Total Cr', value: $filter('formatNumber')(led.CrAmt) }, { text: 'EmailId', value: led.EmailId }, { text: 'Mobile No.', value: led.MobileNo1 }, { text: 'Salesman', value: led.Agent }, { text: 'Budget', value: led.BudgetAmt },)

                                    //scope.confirmAction();
                                    //$(element).select2('close');
                                });
                            });

                            $timeout(function () {
                                scope.$apply(function () {
                                    scope.confirmAction();
                                    $(element).select2('close');
                                });
                            });

                            $timeout(function () {
                                scope.$apply(function () {
                                    ngModel.$setViewValue(selectedLedger.LedgerId);
                                });
                            });

                        } else
                            alert(res.data.ResponseMSG);

                    }, function (reason) {
                        alert('Failed' + reason);
                    });
                }

            } else {

                scope.ledgerDetail = {};
                scope.sideBarData = [];
                ngModel.$setViewValue(null);

                $timeout(function () {
                    scope.$apply(function () {
                        scope.confirmAction();
                    });
                });
            }


        });


        $(element).on("select2:focus", function (e) {

            // $('#sidebarzz').toggleClass('active');
            //$(element).select2('open');
            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right');
            // alert("focus");
        })

        $(element).on("select2:blur", function (e) {

            // $('#sidebarzz').removeClass();
            // $('#sidebarzz').addClass('order-last float-right active');

        })


    }

    return {
        require: 'ngModel',
        link: link,
        scope: {
            model: '=ngModel',
            ledgerDetail: '=',
            sideBarData: '=',
            confirmAction: '&',
            voucherId: "=?",
        }
    };
}]);
app.directive("allProduct", ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {



    var linkFun = function (scope, element, attrs, ngModel) {

        var placeholder = "** Select Product **";
        var showDetails = false;

        if (attrs.placeholder)
            placeholder = attrs.placeholder;

        if (attrs.showdetails == true || attrs.showdetails == "true")
            showDetails = true;

        var VoucherType = 0;
        if (attrs.vouchertype)
            VoucherType = attrs.vouchertype;

        let headerAdded = false;
        function formatResult(item) {
            if (!item.id) return item.text; // Show placeholder text

            return $(
                `<div class="custom-result-product">
                                <table class="custom-table-product" style="font-size: 12px;">
                                    <tbody>
                                        <tr>
                                            <td style="width: 15%;">${item.data.Code}</td>
                                            <td style="width: 45%;" class="px-2">${item.text}</td>
                                            <td style="width: 20%;" class="px-2">${item.data.BalQty} ${item.data.Unit}</td>
                                            <td style="width: 20%;">${item.data.GroupName}</td>                                            
                                        </tr>
                                    </tbody>
                                </table>
                            </div>`
            );
        }

        // Function to format the selected item
        function formatSelection(item) {
            return item.text || item.id;
        }

        $(element).select2({
            placeholder: placeholder,
            allowClear: true,
            openOnEnter: true,
            width: '100%',
            multiple: false,
            minimumInputLength: 1,
            minimumResultsForSearch: 10,
            templateResult: formatResult, // Custom template for results (table format)
            //templateSelection: formatSelection, // Custom template for selection
            //triggerChange: true,

            // formatResult: formatResultMulti,

            ajax: {
                quietMillis: 400,
                url: base_url + "Global/GetAllProduct",
                dataType: "json",
                type: "GET",
                data: function (params) {

                    var vid = (scope.voucherId ? scope.voucherId : null);
                    var cid = (scope.companyId ? scope.companyId : null);
                    var gid = (scope.godownId ? scope.godownId : null);

                    var queryParameters =
                    {
                        Top: 10,
                        ColName: "P.Name",
                        Operator: "like",
                        OrderByCol: "P.Name",
                        ColValue: params.term,
                        VoucherId: vid,
                        CompanyId: cid,
                        GodownId: gid
                    };
                    return queryParameters;
                },
                processResults: function (res) {
                    if (res.IsSuccess == false) {
                        alert(res.ResponseMSG);
                        return;
                    }

                    if (res.Data.length > 0) {

                        scope.productDetail = res.Data[0];
                        scope.productDetail.Init = false;
                        ngModel.$setViewValue(scope.productDetail.ProductId);
                    } else {
                        scope.productDetail = null;
                        ngModel.$setViewValue(null);
                    }

                    return {
                        results: $.map(res.Data, function (item) {
                            //scope.productDetail = item;
                            //   ngModel.$setViewValue(item.ProductId);
                            return {
                                text: item.Name + ' - ' + item.Alias + ' - ' + item.Code,
                                id: item.ProductId,
                                data: item
                            }
                        })
                    };
                }
            },
            initSelection: function (element, callback) {

                scope.$watch("model", function (newValue, oldValue) {
                    $timeout(function () {
                        if (ngModel.$modelValue || ngModel.$modelValue > 0) {
                            var id = ngModel.$modelValue;

                            if (id != null && id !== "" && id > 0 && (!scope.productDetail || scope.productDetail.ProductId != id)) {

                                showPleaseWait();

                                scope.productDetail = {
                                    ProductId: id
                                };

                                var gid = (scope.godownId ? scope.godownId : 0);
                                var vid = (scope.voucherId ? scope.voucherId : 0);
                                var rtId = scope.rateType > 0 ? scope.rateType : 0;
                                return $.ajax(
                                    base_url + "Global/GetProductDetail?ProductId=" + id + "&VoucherType=" + VoucherType + "&VoucherId=" + vid + "&GodownId=" + gid + "&RateTypeId=" + rtId,
                                    {
                                        dataType: "json",
                                        type: "GET",
                                        // data: queryParameters
                                    }).done(function (res) {

                                        hidePleaseWait();

                                        if (res.IsSuccess == false) {
                                            alert(res.ResponseMSG);
                                        }
                                        else if (res.IsSuccess == true) {
                                            scope.$apply(function () {
                                                scope.productDetail = res.Data;
                                            });

                                            var item = res.Data;
                                            var tData =
                                            {
                                                text: item.Name + ' - ' + item.Alias + ' - ' + item.Code,
                                                id: item.ProductId,
                                                data: item
                                            }

                                            callback(tData);

                                            $timeout(function () {
                                                scope.$apply(function () {
                                                    scope.productDetail.Init = true;
                                                    scope.confirmAction();
                                                });
                                            });

                                        } else
                                            alert("No Data Found on Load");

                                    });
                            } else {

                                if (scope.productDetail) {
                                    var item = scope.productDetail;
                                    var tData =
                                    {
                                        text: item.Name + ' - ' + item.Alias + ' - ' + item.Code,
                                        id: item.ProductId,
                                        data: item
                                    }

                                    callback(tData);
                                }
                            }
                        } else {
                            var tData = {
                                id: 0,
                                text: ''
                            };
                            callback(tData);
                        }
                    });
                });


            }
        });

        //$(element).on('paste', function () {

        //    setTimeout(function () {
        //        console.log(element.val());
        //        scope.pastedText = element.val();
        //        scope.$apply();
        //    }, 5);

        //});

        //$(element).on('onpaste', function () {

        //    setTimeout(function () {
        //        console.log(element.val());
        //        scope.pastedText = element.val();
        //        scope.$apply();
        //    }, 5);

        //});

        $(element).on('paste', '#s2id_list-unitids .select2-input', function () {
            var that = this;
            setTimeout(function () {
                var tokens = that.value.split(/[\,\s]+/);
                console.log($('#list-unitids').select2('val'));
            }, 1);
        });

        $(element).on("select2:unselecting", function (e) {
            scope.productDetail = {};
            scope.sideBarData = [];
            ngModel.$setViewValue(null);
        });

        $(element).on("select2:open", function (e) {

            //$timeout(function () {
            //    scope.$apply(function () {

            //        scope.confirmAction();
            //    });
            //});

            $('.select2-dropdown').css('min-width', '700px');

            if (!headerAdded) {
                $(".select2-results").prepend(
                    `<div class="custom-result-product">
                                    <table class="custom-table-product" style="font-size: 12px;">
                                        <thead>
                                            <tr>
                                                <th style="width: 15%;">Code</th>
                                                <th style="width: 45%;">Name</th>
                                                <th style="width: 20%;" >Balance</th>
                                                <th style="width: 20%;">Group</th>                                                
                                            </tr>
                                        </thead>
                                    </table>
                                </div>`
                );
                headerAdded = true; // Set flag to prevent multiple header additions

            }

            $timeout(function () {
                scope.$apply(function () {

                    var selectedData = $(element).select2('data');
                    if (selectedData && selectedData.length > 0) {

                        if (!selectedData[0].data) {
                            //scope.ledgerDetail = {};
                            //scope.sideBarData = [];
                            //ngModel.$setViewValue(null);
                        }
                    }

                    if (scope.productDetail)
                        scope.productDetail.Init = false;

                    scope.confirmAction();
                });
            });


            setTimeout(function () {
                var searchInput = document.querySelector('.select2-search__field');

                if (searchInput) {
                    searchInput.addEventListener('keydown', function (event) {
                        // Check for Ctrl+C
                        if (event.ctrlKey && event.key === 'c') {
                            // Get the selected text from Select2

                            if (scope.productDetail) {
                                // Copy the selected text to the clipboard
                                navigator.clipboard.writeText(scope.productDetail.Name).then(function () {
                                    // console.log('Text copied to clipboard: ' + scope.productDetail.Name);
                                }).catch(function (err) {
                                    console.error('Failed to copy text: ', err);
                                });
                            }
                        }
                    });
                }
            }, 0);
        });

        $(element).on("select2:closes", function (e) {
            //  headerAdded = false; //
            var selectedData = $(element).select2('data');
            if (selectedData && scope.productDetail) {
                if (!scope.productDetail.SalesRate) {
                    var selectedProduct = scope.productDetail;
                    ngModel.$setViewValue(selectedProduct.ProductId);
                    if (showDetails && selectedProduct.ProductId) {

                        var vid = (scope.voucherId ? scope.voucherId : 0);
                        var lid = (scope.ledgerId ? scope.ledgerId : 0);
                        var gid = (scope.godownId ? scope.godownId : 0);
                        var rtId = scope.rateType > 0 ? scope.rateType : 0;
                        showPleaseWait();
                        $http({
                            method: 'GET',
                            url: base_url + "Global/GetProductDetail?ProductId=" + selectedProduct.ProductId + "&LedgerId=" + lid + "&VoucherType=" + VoucherType + "&VoucherId=" + vid + "&GodownId=" + gid + "&RateTypeId=" + rtId,
                            dataType: "json"
                        }).then(function (res) {
                            hidePleaseWait();
                            if (res.data.IsSuccess && res.data.Data) {

                                var pro = res.data.Data;

                                $timeout(function () {
                                    scope.$apply(function () {

                                        scope.productDetail = pro;
                                        scope.productDetail.Init = false;
                                        scope.sideBarData = [];
                                        scope.sideBarData.push(
                                            { text: 'Name', value: pro.Name },
                                            { text: 'Alias', value: pro.Alias },
                                            { text: 'Group Name', value: pro.ProductGroup },
                                            { text: 'Rate', value: $filter('formatNumber')(pro.SalesRate) },
                                            { text: 'Balance', value: $filter('formatNumber')(pro.ClosingQty) + ' ' + pro.BaseUnit },
                                            { text: 'Sales Ledger', value: pro.SalesLedger },
                                            { text: 'Location', value: pro.Rack }
                                        );

                                    });
                                });

                                $timeout(function () {
                                    scope.$apply(function () {
                                        scope.confirmAction();
                                    });
                                });

                            } else
                                alert(res.data.ResponseMSG);

                        }, function (reason) {
                            alert('Failed' + reason);
                        });
                    } else {
                        $timeout(function () {
                            scope.$apply(function () {
                                scope.confirmAction();
                            });
                        });
                    }
                }
            }
            console.log(e);
        });
        $(element).on("change", function (e) {

            scope.sideBarData = [];

            var selectedData = $(element).select2('data');

            if (selectedData && selectedData.length > 0) {
                var selectedProduct = selectedData[0].data;
                ngModel.$setViewValue(selectedProduct.ProductId);
                scope.productDetail = selectedProduct;
                if (showDetails && selectedProduct.ProductId) {

                    var vid = (scope.voucherId ? scope.voucherId : 0);
                    var lid = (scope.ledgerId ? scope.ledgerId : 0);
                    var gid = (scope.godownId ? scope.godownId : 0);
                    var rtId = scope.rateType > 0 ? scope.rateType : 0;

                    showPleaseWait();
                    $http({
                        method: 'GET',
                        url: base_url + "Global/GetProductDetail?ProductId=" + selectedProduct.ProductId + "&LedgerId=" + lid + "&VoucherType=" + VoucherType + "&VoucherId=" + vid + "&GodownId=" + gid + "&RateTypeId=" + rtId,
                        dataType: "json"
                    }).then(function (res) {
                        hidePleaseWait();
                        if (res.data.IsSuccess && res.data.Data) {

                            var pro = res.data.Data;

                            $timeout(function () {
                                scope.$apply(function () {

                                    scope.productDetail = pro;
                                    scope.productDetail.Init = false;
                                    scope.sideBarData = [];
                                    scope.sideBarData.push(
                                        { text: 'Name', value: pro.Name },
                                        { text: 'Alias', value: pro.Alias },
                                        { text: 'Group Name', value: pro.ProductGroup },
                                        { text: 'Rate', value: $filter('formatNumber')(pro.SalesRate) },
                                        { text: 'Balance', value: $filter('formatNumber')(pro.ClosingQty) + ' ' + pro.BaseUnit },
                                        { text: 'Sales Ledger', value: pro.SalesLedger },
                                        { text: 'Location', value: pro.Rack }
                                    );

                                });
                            });

                            $timeout(function () {
                                scope.$apply(function () {
                                    scope.confirmAction();
                                });
                            });

                        } else
                            alert(res.data.ResponseMSG);

                    }, function (reason) {
                        alert('Failed' + reason);
                    });
                }

            } else {

                scope.productDetail = {};
                scope.sideBarData = [];
                ngModel.$setViewValue(null);
            }
        });

        $(element).on("select2:focus", function (e) {

            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right');
            // alert("focus");
        });

        scope.godownChange = function (gid) {

            $timeout(function () {
                if (scope.productDetail) {
                    var selectedProduct = scope.productDetail;
                    if (selectedProduct.ProductId > 0) {

                        var vid = (scope.voucherId ? scope.voucherId : 0);
                        var lid = (scope.ledgerId ? scope.ledgerId : 0);
                        // var gid = (scope.godownId ? scope.godownId : 0);

                        var rtId = scope.rateType > 0 ? scope.rateType : 0;

                        showPleaseWait();
                        $http({
                            method: 'GET',
                            url: base_url + "Global/GetProductDetail?ProductId=" + selectedProduct.ProductId + "&LedgerId=" + lid + "&VoucherType=" + VoucherType + "&VoucherId=" + vid + "&GodownId=" + gid + "&RateTypeId=" + rtId,
                            dataType: "json"
                        }).then(function (res) {
                            hidePleaseWait();
                            if (res.data.IsSuccess && res.data.Data) {

                                var pro = res.data.Data;
                                scope.productDetail = pro;
                                scope.productDetail.Init = false;
                                scope.sideBarData = [];
                                scope.sideBarData.push(
                                    { text: 'Name', value: pro.Name },
                                    { text: 'Alias', value: pro.Alias },
                                    { text: 'Group Name', value: pro.ProductGroup },
                                    { text: 'Rate', value: $filter('formatNumber')(pro.SalesRate) },
                                    { text: 'Balance', value: $filter('formatNumber')(pro.ClosingQty) + ' ' + pro.BaseUnit },
                                    { text: 'Sales Ledger', value: pro.SalesLedger },
                                    { text: 'Location', value: pro.Rack }
                                );

                                $timeout(function () {
                                    scope.$apply(function () {
                                        scope.confirmAction();
                                    });
                                });

                            } else
                                alert(res.data.ResponseMSG);

                        }, function (reason) {
                            alert('Failed' + reason);
                        });
                    }
                }
            });

        };


    }

    return {
        // restrict: "A",
        // replace: true,
        require: 'ngModel',
        link: linkFun,
        scope: {
            model: '=ngModel',
            productDetail: '=',
            sideBarData: '=',
            confirmAction: '&',
            voucherId: "=?",
            ledgerId: "=?",
            companyId: "=?",
            godownId: "=?",
            godownChange: "=?",
            rateType: "=?",
        }

    };
}]);

app.directive("allSalesMan", ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {

    function link(scope, element, attrs, ngModel) {

        var placeholder = "** Select Salesman **";
        var showDetails = false;

        if (attrs.placeholder)
            placeholder = attrs.placeholder;

        if (attrs.showdetails == true || attrs.showdetails == "true")
            showDetails = true;

        //scope.$watch("model", function (newValue, oldValue) {
        //    $timeout(function () {

        //         $(element).val(newValue).trigger('change');
        //         console.log(newValue);
        //     });
        // });


        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllSalesMan",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var agentList = res.data.Data;

                $(element).select2({
                    placeholder: placeholder,
                    allowClear: true,
                    openOnEnter: true,
                    width: '100%',
                    multiple: false,
                    data: agentList
                });

            } else
                alert(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });

        $(element).on("select2:unselecting", function (e) {
            scope.salesmanDetail = {};
            scope.sideBarData = [];
            ngModel.$setViewValue(null);
        });

        $(element).on("select2:open", function (e) {
            $timeout(function () {
                scope.$apply(function () {
                    scope.confirmAction();
                });
            });
        });

        $(element).on("change", function (e) {
            scope.sideBarData = [];

            var selectedData = $(element).select2('data');

            if (selectedData && selectedData.length > 0) {
                var selectedSalesMan = selectedData[0];
                ngModel.$setViewValue(selectedSalesMan.AgentId);
                scope.salesmanDetail = selectedSalesMan;
                if (showDetails) {

                    $timeout(function () {
                        scope.$apply(function () {
                            scope.sideBarData = [];
                            scope.sideBarData.push({ text: 'Name', value: selectedSalesMan.Name }, { text: 'Address', value: selectedSalesMan.Address }, { text: 'BranchName', value: selectedSalesMan.BranchName }, { text: 'Mobile', value: selectedSalesMan.Mobile }, { text: 'Email', value: selectedSalesMan.Email }, { text: 'Area', value: selectedSalesMan.AreaName }, { text: 'Parent', value: selectedSalesMan.ParentAgent });
                            scope.confirmAction();
                        });
                    });

                    $timeout(function () {
                        scope.$apply(function () {
                            scope.confirmAction();
                        });
                    });

                }

            } else {

                scope.salesmanDetail = {};
                scope.sideBarData = [];
                ngModel.$setViewValue(null);
            }


        });


        $(element).on("select2:focus", function (e) {
            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right');
        })


    }

    return {
        replace: true,
        require: 'ngModel',
        link: link,
        scope: {
            model: '=ngModel',
            salesmanDetail: '=',
            sideBarData: '=',
            confirmAction: '&'
        }
    };
}]);

app.directive("productCompany", ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {

    function link(scope, element, attrs, ngModel) {

        var placeholder = "** Select Company **";

        if (attrs.placeholder)
            placeholder = attrs.placeholder;

        //scope.$watch("model", function (newValue, oldValue) {
        //    $timeout(function () {
        //        $(element).select2().val(newValue); 
        //    });
        //});

        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductCompany",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var companyList = res.data.Data;

                $(element).select2({
                    placeholder: placeholder,
                    allowClear: true,
                    openOnEnter: true,
                    width: '100%',
                    multiple: false,
                    data: companyList
                });

            } else
                alert(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });

        $(element).on("select2:unselecting", function (e) {
            scope.companyDetail = {};
            scope.sideBarData = [];
            ngModel.$setViewValue(null);
        });

        $(element).on("select2:open", function (e) {
            $timeout(function () {
                scope.$apply(function () {
                    scope.confirmAction();
                });
            });
        });
        $(element).on("change", function (e) {
            scope.sideBarData = [];

            var selectedData = $(element).select2('data');

            if (selectedData && selectedData.length > 0) {
                var selectedComp = selectedData[0];
                ngModel.$setViewValue(selectedComp.ProductCompanyId);
                scope.companyDetail = selectedComp;

            } else {

                scope.companyDetail = {};
                scope.sideBarData = [];
                ngModel.$setViewValue(null);
            }

        });

        $(element).on("select2:focus", function (e) {
            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right');
        })
    }

    return {
        replace: true,
        require: 'ngModel',
        link: link,
        scope: {
            model: '=ngModel',
            companyDetail: '=',
            sideBarData: '=',
            confirmAction: '&'
        }
    };
}]);

app.directive("allVehicle", ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {

    var linkFun = function (scope, element, attrs, ngModel) {

        var placeholder = "** Select Vehicle **";
        var showDetails = false;

        if (attrs.placeholder)
            placeholder = attrs.placeholder;

        if (attrs.showdetails == true || attrs.showdetails == "true")
            showDetails = true;

        var VoucherType = 0;
        if (attrs.vouchertype)
            VoucherType = attrs.vouchertype;

        $(element).select2({
            placeholder: placeholder,
            allowClear: true,
            openOnEnter: true,
            width: '100%',
            multiple: false,
            minimumInputLength: 1,
            minimumResultsForSearch: 10,
            //triggerChange: true,
            ajax: {
                quietMillis: 400,
                url: base_url + "Service/Transaction/GetAllVehicle",
                dataType: "json",
                type: "GET",
                data: function (params) {

                    var vid = (scope.voucherId ? scope.voucherId : null);
                    var queryParameters =
                    {
                        Top: 10,
                        ColName: (scope.searchBy ? scope.searchBy : "V.EngineNo"),
                        Operator: "like",
                        OrderByCol: "V.EngineNo",
                        ColValue: params.term,
                        VoucherId: vid
                    };
                    return queryParameters;
                },
                processResults: function (res) {
                    if (res.IsSuccess == false) {
                        alert(res.ResponseMSG);
                        return;
                    }

                    if (res.Data && res.Data.length > 0) {
                        scope.vehicleDetail = res.Data[0];
                        ngModel.$setViewValue(res.Data[0].TranId);
                    }
                    return {
                        results: $.map(res.Data, function (item) {

                            return {
                                text: item.VinNo + ' - ' + item.EngineNo + ' - ' + item.RegdNo,
                                id: item.TranId,
                                data: item
                            }
                        })
                    };
                }
            },
            initSelection: function (element, callback) {

                scope.$watch("model", function (newValue, oldValue) {
                    $timeout(function () {
                        if (ngModel.$modelValue || ngModel.$modelValue > 0) {
                            var id = ngModel.$modelValue;

                            if (id != null && id !== "" && id > 0 && (!scope.vehicleDetail || scope.vehicleDetail.TranId != id)) {

                                showPleaseWait();

                                var vid = (scope.voucherId ? scope.voucherId : 0);

                                return $.ajax(
                                    base_url + "Service/Transaction/GetVehicleDet?TranId=" + id,
                                    {
                                        dataType: "json",
                                        type: "GET",
                                        // data: queryParameters
                                    }).done(function (res) {

                                        hidePleaseWait();

                                        if (res.IsSuccess == false) {
                                            alert(res.ResponseMSG);
                                        }
                                        else if (res.IsSuccess == true) {
                                            scope.$apply(function () {
                                                scope.vehicleDetail = res.Data;
                                            });

                                            var item = res.Data;
                                            var tData =
                                            {
                                                text: item.VinNo + ' - ' + item.EngineNo + ' - ' + item.RegdNo,
                                                id: item.TranId,
                                                data: item
                                            }

                                            callback(tData);

                                            $timeout(function () {
                                                scope.$apply(function () {
                                                    scope.confirmAction();
                                                });
                                            });

                                        } else
                                            alert("No Data Found on Load");

                                    });
                            } else {

                                if (scope.vehicleDetail) {
                                    var item = scope.vehicleDetail;
                                    var tData =
                                    {
                                        text: item.VinNo + ' - ' + item.EngineNo + ' - ' + item.RegdNo,
                                        id: item.TranId,
                                        data: item
                                    }

                                    callback(tData);
                                }
                            }
                        } else {
                            var tData = {
                                id: 0,
                                text: ''
                            };
                            callback(tData);
                        }
                    });
                });


            }
        });


        $(element).on("select2:unselecting", function (e) {
            scope.vehicleDetail = {};
            scope.sideBarData = [];
            ngModel.$setViewValue(null);
        });

        $(element).on("select2:open", function (e) {

            //$timeout(function () {
            //    scope.$apply(function () {

            //        scope.confirmAction();
            //    });
            //});

            $timeout(function () {
                scope.$apply(function () {

                    var selectedData = $(element).select2('data');
                    if (selectedData && selectedData.length > 0) {

                        if (!selectedData[0].data) {
                            //scope.ledgerDetail = {};
                            //scope.sideBarData = [];
                            //ngModel.$setViewValue(null);
                        }
                    }
                    scope.confirmAction();
                });
            });
        });

        $(element).on("select2:close", function (e) {
            //$('#sidebarzz').toggleClass('active');
        });
        $(element).on("change", function (e) {

            scope.sideBarData = [];

            var selectedData = $(element).select2('data');

            if (selectedData && selectedData.length > 0) {
                var selectedProduct = selectedData[0].data;
                ngModel.$setViewValue(selectedProduct.TranId);
                scope.vehicleDetail = selectedProduct;
                if (showDetails) {

                    var vid = (scope.voucherId ? scope.voucherId : 0);
                    showPleaseWait();
                    $http({
                        method: 'GET',
                        url: base_url + "Service/Transaction/GetVehicleDet?TranId=" + selectedProduct.TranId,
                        dataType: "json"
                    }).then(function (res) {
                        hidePleaseWait();
                        if (res.data.IsSuccess && res.data.Data) {

                            var pro = res.data.Data;

                            $timeout(function () {
                                scope.$apply(function () {

                                    scope.vehicleDetail = pro;
                                    scope.sideBarData = [];
                                    //scope.sideBarData.push(
                                    //    { text: 'Name', value: pro.Name },
                                    //    { text: 'Alias', value: pro.Alias },
                                    //    { text: 'Group Name', value: pro.ProductGroup },
                                    //    { text: 'Rate', value: $filter('formatNumber')(pro.SalesRate) },
                                    //    { text: 'Balance', value: $filter('formatNumber')(pro.ClosingQty) + ' ' + pro.BaseUnit },
                                    //    { text: 'Sales Ledger', value: pro.SalesLedger },
                                    //    { text: 'Location', value: pro.Rack }
                                    //);

                                });
                            });

                            $timeout(function () {
                                scope.$apply(function () {
                                    scope.confirmAction();
                                });
                            });

                        } else
                            alert(res.data.ResponseMSG);

                    }, function (reason) {
                        alert('Failed' + reason);
                    });
                }

            } else {

                scope.vehicleDetail = {};
                scope.sideBarData = [];
                ngModel.$setViewValue(null);
            }
        });

        $(element).on("select2:focus", function (e) {

            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right');
            // alert("focus");
        })

    }

    return {
        // restrict: "E",
        // replace: true,
        require: 'ngModel',
        link: linkFun,
        scope: {
            model: '=ngModel',
            vehicleDetail: '=',
            sideBarData: '=',
            confirmAction: '&',
            voucherId: "=?",
            searchBy: '=',
            ledgerId: "=?",
        }

    };
}]);

app.directive("vehicleInspection", ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {

    var linkFun = function (scope, element, attrs, ngModel) {

        var placeholder = "** Select Inspection **";

        $(element).select2({
            placeholder: placeholder,
            allowClear: true,
            openOnEnter: true,
            width: '100%',
            multiple: false,
            minimumInputLength: 1,
            minimumResultsForSearch: 10,
            //triggerChange: true,
            ajax: {
                quietMillis: 400,
                url: base_url + "Service/Transaction/GetAllInspectionType",
                dataType: "json",
                type: "GET",
                data: function (params) {
                    var queryParameters =
                    {
                        ColValue: params.term,
                        VehicleEntryId: scope.vehicleId,
                        InspectionGroupId: scope.groupId,
                        VehicleModelId: scope.modelId,
                        VehicleTypeId: scope.typeId
                    };
                    return queryParameters;
                },
                processResults: function (res) {
                    if (res.IsSuccess == false) {
                        alert(res.ResponseMSG);
                        return;
                    }

                    if (res.Data && res.Data.length > 0) {
                        scope.inspectionDetail = res.Data[0];
                        ngModel.$setViewValue(scope.inspectionDetail.InspectionTypeId);
                    }
                    return {

                        results: $.map(res.Data, function (item) {

                            return {
                                text: item.Remarks + ' - ' + item.Name,
                                id: item.InspectionTypeId,
                                data: item
                            }
                        })
                    };
                }
            },
            initSelection: function (element, callback) {

                scope.$watch("model", function (newValue, oldValue) {
                    $timeout(function () {
                        if (ngModel.$modelValue || ngModel.$modelValue > 0) {
                            var id = ngModel.$modelValue;

                            if (id != null && id !== "" && id > 0 && (!scope.inspectionDetail || scope.inspectionDetail.InspectionTypeId != id)) {

                                showPleaseWait();

                                return $.ajax(
                                    base_url + "Service/Transaction/GetInspectionTypeById?InspectionTypeId=" + id,
                                    {
                                        dataType: "json",
                                        type: "GET",
                                        // data: queryParameters
                                    }).done(function (res) {

                                        hidePleaseWait();

                                        if (res.IsSuccess == false) {
                                            alert(res.ResponseMSG);
                                        }
                                        else if (res.IsSuccess == true) {
                                            scope.$apply(function () {
                                                scope.inspectionDetail = res.Data;
                                            });

                                            var item = res.Data;
                                            var tData =
                                            {
                                                text: item.Remarks + ' - ' + item.Name,
                                                id: item.InspectionTypeId,
                                                data: item
                                            }

                                            callback(tData);

                                            $timeout(function () {
                                                scope.$apply(function () {
                                                    scope.confirmAction();
                                                });
                                            });

                                        } else
                                            alert("No Data Found on Load");

                                    });
                            } else {

                                if (scope.inspectionDetail) {
                                    var item = scope.inspectionDetail;
                                    var tData =
                                    {
                                        text: item.Remarks + ' - ' + item.Name,
                                        id: item.InspectionTypeId,
                                        data: item
                                    }

                                    callback(tData);
                                }
                            }
                        } else {
                            var tData = {
                                id: 0,
                                text: ''
                            };
                            callback(tData);
                        }
                    });
                });


            }
        });


        $(element).on("select2:unselecting", function (e) {
            scope.inspectionDetail = {};
            scope.sideBarData = [];
            ngModel.$setViewValue(null);
        });

        $(element).on("select2:open", function (e) {



            $timeout(function () {
                scope.$apply(function () {

                    var selectedData = $(element).select2('data');
                    if (selectedData && selectedData.length > 0) {

                        if (!selectedData[0].data) {
                            //scope.ledgerDetail = {};
                            //scope.sideBarData = [];
                            //ngModel.$setViewValue(null);
                        }
                    }
                    scope.confirmAction();
                });
            });
        });

        $(element).on("select2:close", function (e) {
            //$('#sidebarzz').toggleClass('active');
        });
        $(element).on("change", function (e) {

            scope.sideBarData = [];

            var selectedData = $(element).select2('data');

            if (selectedData && selectedData.length > 0) {
                var selectedProduct = selectedData[0].data;
                ngModel.$setViewValue(selectedProduct.InspectionTypeId);
                scope.inspectionDetail = selectedProduct;
                $timeout(function () {
                    scope.$apply(function () {
                        scope.confirmAction();
                    });
                });

            } else {

                scope.inspectionDetail = {};
                scope.sideBarData = [];
                ngModel.$setViewValue(null);
            }
        });

        $(element).on("select2:focus", function (e) {

            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right');
            // alert("focus");
        })

    }

    return {
        // restrict: "E",
        // replace: true,
        require: 'ngModel',
        link: linkFun,
        scope: {
            model: '=ngModel',
            inspectionDetail: '=',
            sideBarData: '=',
            confirmAction: '&',
            vehicleId: "=?",
            groupId: "=?",
            modelId: "=?",
            typeId: "=?",
            searchBy: '=',
        }

    };
}]);

app.directive("activeSelect2", ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {

    function link(scope, element, attrs, ngModel) {

        var plHolder = '*select data*';

        if (attrs.placeholder)
            plHolder = attrs.placeholder;

        $(element).select2({
            allowClear: true,
            openOnEnter: true,
            placeholder: plHolder,
            width: '100%',
        });

        $(element).on("change", function (e) {
            var selectedData = $(element).select2('data');
            $timeout(function () {
                scope.$apply(function () {
                    scope.confirmAction();
                });
            });
        });
    }

    return {
        replace: true,
        require: 'ngModel',
        link: link,
        scope: {
            confirmAction: '&',
        }
    };
}]);

app.directive('wbSelect2', function () {
    return {
        restrict: 'A',
        scope: {
            'selectWidth': '@',
            'ngModel': '='
        },
        link: function (scope, element, attrs) {
            //Setting default values for attribute params
            scope.selectWidth = scope.selectWidth || 200;
            element.select2({
                width: scope.selectWidth,
            });

            scope.$watch('ngModel', function (newValue, oldValue) {
                element.select2().val(newValue);
            });
        }
    };
});


app.directive("salesAccount", ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {

    function link(scope, element, attrs, ngModel) {

        var placeholder = "** Select Sales Ledger **";
        var showDetails = false;

        if (attrs.placeholder)
            placeholder = attrs.placeholder;

        if (attrs.showdetails == true || attrs.showdetails == "true")
            showDetails = true;

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetSalesLedger",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var salesLedgerList = res.data.Data;

                $(element).select2({
                    placeholder: placeholder,
                    allowClear: true,
                    openOnEnter: true,
                    width: '100%',
                    multiple: false,
                    data: salesLedgerList
                });

            } else
                alert(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });

        $(element).on("select2:unselecting", function (e) {
            scope.salesledgerDetail = {};
            scope.sideBarData = [];
            ngModel.$setViewValue(null);
        });

        $(element).on("select2:open", function (e) {
            $timeout(function () {
                scope.$apply(function () {
                    scope.confirmAction();
                });
            });
        });
        $(element).on("change", function (e) {
            scope.sideBarData = [];

            var selectedData = $(element).select2('data');

            if (selectedData && selectedData.length > 0) {
                var led = selectedData[0];
                ngModel.$setViewValue(led.LedgerId);
                scope.salesledgerDetail = led;
                if (showDetails) {

                    $timeout(function () {
                        scope.$apply(function () {
                            scope.sideBarData = [];
                            scope.sideBarData.push({ text: 'Group Name', value: led.GroupName }, { text: 'Alias', value: led.Alias }, { text: 'Code', value: led.Code });
                            scope.confirmAction();
                        });
                    });

                    $timeout(function () {
                        scope.$apply(function () {
                            scope.confirmAction();
                        });
                    });

                }

            } else {

                scope.salesledgerDetail = {};
                scope.sideBarData = [];
                ngModel.$setViewValue(null);
            }

        });


        $(element).on("select2:focus", function (e) {
            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right');
        })


    }

    return {
        replace: true,
        require: 'ngModel',
        link: link,
        scope: {
            salesledgerDetail: '=',
            sideBarData: '=',
            confirmAction: '&'
        }
    };
}]);

app.directive("purchaseAccount", ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {

    function link(scope, element, attrs, ngModel) {

        var placeholder = "** Select Purchase Ledger **";
        var showDetails = false;

        if (attrs.placeholder)
            placeholder = attrs.placeholder;

        if (attrs.showdetails == true || attrs.showdetails == "true")
            showDetails = true;

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetPurchaseLedger",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var purchaseLedgerList = res.data.Data;

                $(element).select2({
                    placeholder: placeholder,
                    allowClear: true,
                    openOnEnter: true,
                    width: '100%',
                    multiple: false,
                    data: purchaseLedgerList
                });

            } else
                alert(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });

        $(element).on("select2:unselecting", function (e) {
            scope.purchaseledgerDetail = {};
            scope.sideBarData = [];
            ngModel.$setViewValue(null);
        });

        $(element).on("select2:open", function (e) {
            $timeout(function () {
                scope.$apply(function () {
                    scope.confirmAction();
                });
            });
        });
        $(element).on("change", function (e) {
            scope.sideBarData = [];

            var selectedData = $(element).select2('data');

            if (selectedData && selectedData.length > 0) {
                var led = selectedData[0];
                ngModel.$setViewValue(led.LedgerId);
                scope.purchaseledgerDetail = led;
                if (showDetails) {

                    $timeout(function () {
                        scope.$apply(function () {
                            scope.sideBarData = [];
                            scope.sideBarData.push({ text: 'Group Name', value: led.GroupName }, { text: 'Alias', value: led.Alias }, { text: 'Code', value: led.Code });
                            scope.confirmAction();
                        });
                    });

                    $timeout(function () {
                        scope.$apply(function () {
                            scope.confirmAction();
                        });
                    });

                }

            } else {

                scope.purchaseledgerDetail = {};
                scope.sideBarData = [];
                ngModel.$setViewValue(null);
            }

        });


        $(element).on("select2:focus", function (e) {
            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right');
        })


    }

    return {
        replace: true,
        require: 'ngModel',
        link: link,
        scope: {
            purchaseledgerDetail: '=',
            sideBarData: '=',
            confirmAction: '&'
        }
    };
}]);

app.directive("purchaseCostCenter", ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {

    function link(scope, element, attrs, ngModel) {

        var placeholder = "** Select Purchase CostCenter**";
        var showDetails = false;

        if (attrs.placeholder)
            placeholder = attrs.placeholder;

        if (attrs.showdetails == true || attrs.showdetails == "true")
            showDetails = true;

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetPurchaseCostCenter",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var purchaseCostCenterList = res.data.Data;

                $(element).select2({
                    placeholder: placeholder,
                    allowClear: true,
                    openOnEnter: true,
                    width: '100%',
                    multiple: false,
                    data: purchaseCostCenterList
                });

            } else
                alert(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });

        $(element).on("select2:unselecting", function (e) {
            scope.purchasecostcenterDetail = {};
            scope.sideBarData = [];
            ngModel.$setViewValue(null);
        });

        $(element).on("select2:open", function (e) {
            $timeout(function () {
                scope.$apply(function () {
                    scope.confirmAction();
                });
            });
        });
        $(element).on("change", function (e) {
            scope.sideBarData = [];

            var selectedData = $(element).select2('data');

            if (selectedData && selectedData.length > 0) {
                var led = selectedData[0];
                ngModel.$setViewValue(led.CostCenterId);
                scope.purchasecostcenterDetail = led;
                if (showDetails) {

                    $timeout(function () {
                        scope.$apply(function () {
                            scope.sideBarData = [];
                            scope.sideBarData.push({ text: 'Category', value: led.Category }, { text: 'Alias', value: led.Alias }, { text: 'Code', value: led.Code });
                            scope.confirmAction();
                        });
                    });

                    $timeout(function () {
                        scope.$apply(function () {
                            scope.confirmAction();
                        });
                    });

                }

            } else {

                scope.purchasecostcenterDetail = {};
                scope.sideBarData = [];
                ngModel.$setViewValue(null);
            }

        });


        $(element).on("select2:focus", function (e) {
            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right');
        })


    }

    return {
        replace: true,
        require: 'ngModel',
        link: link,
        scope: {
            purchasecostcenterDetail: '=',
            sideBarData: '=',
            confirmAction: '&'
        }
    };
}]);

app.directive("salesCostCenter", ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {

    function link(scope, element, attrs, ngModel) {

        var placeholder = "** Select sales CostCenter**";
        var showDetails = false;

        if (attrs.placeholder)
            placeholder = attrs.placeholder;

        if (attrs.showdetails == true || attrs.showdetails == "true")
            showDetails = true;

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetsalesCostCenter",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var salesCostCenterList = res.data.Data;

                $(element).select2({
                    placeholder: placeholder,
                    allowClear: true,
                    openOnEnter: true,
                    width: '100%',
                    multiple: false,
                    data: salesCostCenterList
                });

            } else
                alert(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });

        $(element).on("select2:unselecting", function (e) {
            scope.salescostcenterDetail = {};
            scope.sideBarData = [];
            ngModel.$setViewValue(null);
        });

        $(element).on("select2:open", function (e) {
            $timeout(function () {
                scope.$apply(function () {
                    scope.confirmAction();
                });
            });
        });
        $(element).on("change", function (e) {
            scope.sideBarData = [];

            var selectedData = $(element).select2('data');

            if (selectedData && selectedData.length > 0) {
                var led = selectedData[0];
                ngModel.$setViewValue(led.CostCenterId);
                scope.salescostcenterDetail = led;
                if (showDetails) {

                    $timeout(function () {
                        scope.$apply(function () {
                            scope.sideBarData = [];
                            scope.sideBarData.push({ text: 'Category', value: led.Category }, { text: 'Alias', value: led.Alias }, { text: 'Code', value: led.Code });
                            scope.confirmAction();
                        });
                    });

                    $timeout(function () {
                        scope.$apply(function () {
                            scope.confirmAction();
                        });
                    });

                }

            } else {

                scope.salescostcenterDetail = {};
                scope.sideBarData = [];
                ngModel.$setViewValue(null);
            }

        });


        $(element).on("select2:focus", function (e) {
            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right');
        })


    }

    return {
        replace: true,
        require: 'ngModel',
        link: link,
        scope: {
            salescostcenterDetail: '=',
            sideBarData: '=',
            confirmAction: '&'
        }
    };
}]);

app.directive("allCurrency", ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {

    function link(scope, element, attrs, ngModel) {

        var placeholder = "** Currency **";
        var showDetails = false;

        if (attrs.placeholder)
            placeholder = attrs.placeholder;

        if (attrs.showdetails == true || attrs.showdetails == "true")
            showDetails = true;

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllCurrency",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var currencyList = res.data.Data;

                $(element).select2({
                    placeholder: placeholder,
                    allowClear: true,
                    openOnEnter: true,
                    width: '100%',
                    multiple: false,
                    data: currencyList
                });

            } else
                alert(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });

        $(element).on("select2:unselecting", function (e) {
            scope.currencyDetail = {};
            scope.sideBarData = [];
            ngModel.$setViewValue(null);
        });

        $(element).on("select2:open", function (e) {
            $timeout(function () {
                scope.$apply(function () {
                    scope.confirmAction();
                });
            });
        });
        $(element).on("change", function (e) {
            scope.sideBarData = [];

            var selectedData = $(element).select2('data');

            if (selectedData && selectedData.length > 0) {
                var cur = selectedData[0];
                ngModel.$setViewValue(cur.CurrencyId);
                scope.currencyDetail = cur;
                if (showDetails) {

                    $http({
                        method: 'GET',
                        url: base_url + "Account/Creation/GetCurrencyRate?CurrencyId=" + cur.CurrencyId,
                        dataType: "json"
                    }).then(function (res) {
                        if (res.data.IsSuccess && res.data.Data) {
                            var curRate = res.data.Data;


                            $timeout(function () {
                                scope.currencyDetail = {
                                    CurrencyId: cur.CurrencyId,
                                    Name: cur.Name,
                                    Code: cur.Code,
                                    Unit: cur.Unit,
                                    NoOfDecimal: cur.NoOfDecimal,
                                    IsDefault: cur.IsDefault,
                                    CanEditRate: cur.CanEditRate,
                                    LocalRate: curRate.LocalRate,
                                    SellingRate: curRate.SellingRate,
                                    BuyingRate: curRate.BuyingRate
                                };
                                scope.sideBarData = [];
                                scope.sideBarData.push({ text: 'Currency', value: cur.Name }, { text: 'Unit', value: cur.Unit }, { text: 'Rate', value: curRate.SellingRate })

                            });

                            $timeout(function () {
                                scope.confirmAction();
                            });


                        } else
                            alert(res.data.ResponseMSG);

                    }, function (reason) {
                        alert('Failed' + reason);
                    });




                }

            } else {

                scope.currencyDetail = {};
                scope.sideBarData = [];
                ngModel.$setViewValue(null);
            }

        });


        $(element).on("select2:focus", function (e) {
            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right');
        })


    }

    return {
        replace: true,
        require: 'ngModel',
        link: link,
        scope: {
            currencyDetail: '=',
            sideBarData: '=',
            confirmAction: '&'
        }
    };
}]);

app.directive("commonNarration", ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {

    function link(scope, element, attrs, ngModel) {

        var placeholder = "** Enter Narration **";
        var showDetails = false;

        if (attrs.placeholder)
            placeholder = attrs.placeholder;

        var voucherType = 0;
        if (attrs.vouchertype)
            voucherType = attrs.vouchertype;

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetVoucherWiseNarration?voucherType=" + voucherType,
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var narrationList = res.data.Data;

                $(element).select2({
                    placeholder: placeholder,
                    allowClear: true,
                    openOnEnter: true,
                    width: '100%',
                    multiple: false,
                    data: narrationList
                });

            } else
                alert(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    return {
        replace: true,
        require: 'ngModel',
        link: link,
        scope: {
            currencyDetail: '=',
            sideBarData: '=',
            confirmAction: '&'
        }
    };
}]);

app.directive("multiSelectOption", ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {

    var onSelectEvent = false;
    function link(scope, element, attrs, ngModel) {
        scope.MSData = {
            SelectedCount: 0,
            DataColl: [],
            searchData: '',
            SelectAll: false,
            Label: scope.label,
            Value: scope.value,
        };
        scope.MSData.DataColl = scope.dataColl;

        scope.$watch('data', function (newVal) {
            scope.MSData.DataColl = newVal;
        });

        scope.$watch("model", function (newValue) {
            if (ngModel.$modelValue == '')
                ngModel.$modelValue = null;

            if (ngModel.$modelValue) {

                if (onSelectEvent == false) {
                    if (ngModel.$modelValue == null) {
                        if (scope.MSData && scope.MSData.DataColl) {
                            scope.MSData.SelectedCount = 0;
                            if (scope.MSData.DataColl) {
                                scope.MSData.DataColl.forEach(function (dc) {
                                    dc.IsSelected = false;
                                });
                            }
                        }
                    }
                    else {
                        if (ngModel.$modelValue && ngModel.$modelValue.length > 0) {
                            var mxQry = mx(ngModel.$modelValue.split(','));

                            var c = 0;
                            var selectedVal = [];
                            if (scope.MSData.DataColl) {
                                scope.MSData.DataColl.forEach(function (dc) {
                                    var val = dc[scope.MSData.Value];
                                    if (mxQry.contains(val) == true || mxQry.contains(val.toString()) == true) {
                                        c++;
                                        dc.IsSelected = true;
                                        selectedVal.push(dc[scope.MSData.Value]);
                                    }
                                });
                            }
                            scope.MSData.SelectedCount = c;

                        }
                    }
                }

            }
            else {
                if (onSelectEvent == false) {
                    if (scope.MSData && scope.MSData.DataColl) {
                        scope.MSData.SelectedCount = 0;
                        if (scope.MSData.DataColl) {
                            scope.MSData.DataColl.forEach(function (dc) {
                                dc.IsSelected = false;
                            });
                        }
                    }
                }
            }
        });

        scope.ChangeSelectAll_MS = function () {
            onSelectEvent = true;
            var val = scope.MSData.SelectAll;
            if (scope.MSData.DataColl) {
                scope.MSData.DataColl.forEach(function (dc) {
                    dc.IsSelected = val;
                });
            }

            scope.ChangeSelect_MS();
        }

        scope.ChangeSelect_MS = function () {
            var c = 0;
            var selectedVal = [];
            if (scope.MSData.DataColl) {
                scope.MSData.DataColl.forEach(function (dc) {
                    if (dc.IsSelected == true) {
                        c++;
                        selectedVal.push(dc[scope.MSData.Value]);
                    }
                });
            }
            ngModel.$setViewValue(selectedVal);
            scope.MSData.SelectedCount = c;

            onSelectEvent = false;
        }
    }

    return {
        restrict: "E",
        templateUrl: base_url + '/Global/MultipleSelect',
        require: 'ngModel',
        scope: {
            model: '=ngModel',
            data: '=',
            label: '@',
            value: '@'
        },
        link: link

    };
}]);



app.directive("voucherDate", function () {

    function link(scope, element, attrs, ngModel) {

        var newDate = null;

        attrs.$observe('ngModel', function (value) { // Got ng-model bind path here
            scope.$watch(value, function (newValue) { // Watch given path for changes

                if (ngModel.$modelValue) {
                    if (!ngModel.$modelValue.dateAD) {
                        if (ngModel.$modelValue)
                            newDate = new Date(ngModel.$modelValue);
                        else
                            newDate = new Date();

                        if (dtPicker) {
                            dtPicker.setDate(newDate);
                            var dateDetails = {
                                dateAD: newDate,
                                NY: dtPicker.dateSelectedBS.bsYear,
                                NM: dtPicker.dateSelectedBS.bsMonth + 1,
                                ND: dtPicker.dateSelectedBS.bsDate
                            };
                            ngModel.$setViewValue(dateDetails);
                        }
                    }

                }

            });
        });


        if (ngModel.$modelValue)
            newDate = new Date(ngModel.$modelValue);
        else
            newDate = new Date();

        var dateFormat = "%y-%m-%d";
        var dateFormatMask = "9999-99-99";
        var dateFormatMaskPlaceholder = "yyyy-mm-dd";
        var dtPicker = datepicker(element[0], {
            dateStyle: 2, startDate: newDate, dateSelected: newDate, dateFormat: dateFormat,
            onDateChange: function (el, date, dateBS) {
                if (date && dateBS) {
                    var dateDetails = {
                        dateAD: date,
                        NY: dateBS.bsYear,
                        NM: dateBS.bsMonth + 1,
                        ND: dateBS.bsDate
                    };
                    ngModel.$setViewValue(dateDetails);   // Update the `$viewValue`        
                } else
                    ngModel.$setViewValue(null);

            }
        });

        $(element).on("change", function (e) {
            if (e.currentTarget.value) {
                if (e.currentTarget.value.length == 0) {
                    ngModel.$setViewValue(null);
                }
            } else
                ngModel.$setViewValue(null);

            console.log(ngModel.$modelValue);
        });
        $(element).inputmask(dateFormatMask, {
            "placeholder": dateFormatMaskPlaceholder, "oncomplete": function (e) {
                var event = document.createEvent('HTMLEvents');
                event.initEvent('input', true, true);
                e.currentTarget.dispatchEvent(event);
                $(this).trigger('change');
            }
        });

    }

    return {
        require: 'ngModel',
        link: link
    };
});

app.directive("voucherDateAd", function () {

    function link(scope, element, attrs, ngModel) {

        var newDate = null;

        attrs.$observe('ngModel', function (value) { // Got ng-model bind path here
            scope.$watch(value, function (newValue) {
                // Watch given path for changes
                if (ngModel.$modelValue) {
                    newDate = new Date(ngModel.$modelValue);
                    if (dtPicker && dtPicker.dateSelected != newValue) {
                        dtPicker.setDate(newDate);
                    }
                }
            });
        });

        if (ngModel.$modelValue)
            newDate = new Date(ngModel.$modelValue);
        else
            newDate = null;

        var dateFormat = "%y-%m-%d";
        var dateFormatMask = "9999-99-99";
        var dateFormatMaskPlaceholder = "yyyy-mm-dd";
        var dtPicker = datepicker(element[0],
            {
                dateStyle: 1, startDate: newDate, dateSelected: newDate, dateFormat: dateFormat,
                //parent: element[0].parentElement.parentElement,
                onDateChange: function (el, date, dateBS) {
                    if (date && dateBS) {
                        ngModel.$setViewValue(date);   // Update the `$viewValue`        
                    } else
                        ngModel.$setViewValue(null);
                }
            });

        $(element).on("change", function (e) {
            if (e.currentTarget.value) {
                if (e.currentTarget.value.length == 0) {
                    ngModel.$setViewValue(null);
                }
            } else
                ngModel.$setViewValue(null);

            console.log(ngModel.$modelValue);
        });
        $(element).inputmask(dateFormatMask, {
            "placeholder": dateFormatMaskPlaceholder, "oncomplete": function (e) {
                var event = document.createEvent('HTMLEvents');
                event.initEvent('input', true, true);
                e.currentTarget.dispatchEvent(event);
                $(this).trigger('onDateChange');
            }
        });



    }

    return {
        require: 'ngModel',
        link: link
    };
});

app.directive("dateControl", function ($timeout) {

    function link(scope, element, attrs, ngModel) {

        var newDate = null;

        attrs.$observe('ngModel', function (value) { // Got ng-model bind path here
            scope.$watch(value, function (newValue) { // Watch given path for changes
                if (value != newValue) {
                    if (ngModel.$modelValue && dtPicker) {
                        newDate = new Date(dtPicker.dateSelected);
                    } else
                        newDate = new Date();

                    if (dtPicker && newDate) {
                        // dtPicker.setDate(newDate);
                        ngModel.$setViewValue(newDate);
                    }
                }
            });
        });

        if (ngModel.$modelValue)
            newDate = new Date(ngModel.$modelValue);
        else
            newDate = new Date();

        var dateFormat = "%y-%m-%d";
        var dateFormatMask = "9999-99-99";
        var dateFormatMaskPlaceholder = "yyyy-mm-dd";
        var dtPicker = datepicker(element[0], {
            dateStyle: 2, startDate: newDate, dateSelected: newDate, dateFormat: dateFormat,
            onDateChange: function (el, date, dateBS) {

                $timeout(function () {
                    if (date && dateBS) {
                        ngModel.$setViewValue(date);   // Update the `$viewValue`        
                    } else
                        ngModel.$setViewValue(null);
                });


            }
        });

        $(element).on("change", function (e) {
            if (e.currentTarget.value) {
                if (e.currentTarget.value.length == 0) {
                    ngModel.$setViewValue(null);
                }
            } else
                ngModel.$setViewValue(null);

            console.log(ngModel.$modelValue);
        });
        $(element).inputmask(dateFormatMask, {
            "placeholder": dateFormatMaskPlaceholder, "oncomplete": function (e) {
                var event = document.createEvent('HTMLEvents');
                event.initEvent('input', true, true);
                e.currentTarget.dispatchEvent(event);
                $(this).trigger('change');
            }
        });

    }

    return {
        require: 'ngModel',
        link: link
        //scope: {
        //    AD_Date: '=',
        //    BS_Date: '=',
        //    Date_Det: '='
        //}
    };
});


app.directive("expDate", ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {

    function link(scope, element, attrs, ngModel) {

        scope.$watch(function () {
            return ngModel.$modelValue;
        }, function (newValue) {
            if (ngModel.$modelValue) {
                var dt = ngModel.$modelValue;

                if (moment.isDate(dt) == false) {

                    if (ngModel.$modelValue.length == 7) {
                        if (Number.isNaN(Date.parse(ngModel.$modelValue + "-01")) == false) {
                            ele.value = ngModel.$modelValue;
                            $timeout(function () {
                                scope.$apply(function () {
                                    var ym = ele.value.toString().split('-');
                                    if (ym && ym.length == 2) {
                                        var y = parseInt(ym[0]);
                                        var m = parseInt(ym[1]);
                                        var newDate = new Date(y, m, 0);
                                        scope.dateDetail = newDate;
                                        //ngModel.$setViewValue(newDate);
                                    }

                                });
                            });
                        } else
                            scope.dateDetail = null;
                    } else if (ngModel.$modelValue.length > 9) {
                        dt = new Date(dt);
                        if (Number.isNaN(dt) == false) {
                            var nval = moment(dt).format("YYYY-MM").toString();
                            ele.value = nval;
                            $timeout(function () {
                                scope.$apply(function () {
                                    var ym = nval.toString().split('-');
                                    if (ym && ym.length == 2) {
                                        var y = parseInt(ym[0]);
                                        var m = parseInt(ym[1]);
                                        var newDate = new Date(y, m, 0);
                                        scope.dateDetail = newDate;
                                        //ngModel.$setViewValue(newDate);
                                    }

                                });
                            });
                        }
                    }

                } else {
                    var nval = moment(dt).format("YYYY-MM").toString();
                    ele.value = nval;
                    $timeout(function () {
                        scope.$apply(function () {
                            var ym = nval.toString().split('-');
                            if (ym && ym.length == 2) {
                                var y = parseInt(ym[0]);
                                var m = parseInt(ym[1]);
                                var newDate = new Date(y, m, 0);
                                scope.dateDetail = newDate;
                                //ngModel.$setViewValue(newDate);
                            }

                        });
                    });

                }
            }
        });

        var dateFormatMask = "9999-99";
        var dateFormatMaskPlaceholder = "yyyy-mm";
        var ele = element[0];
        $(element).on("change", function (e) {
            if (e.currentTarget.value) {
                if (e.currentTarget.value.length == 0) {
                    ngModel.$setViewValue(null);
                }
                else if (e.currentTarget.value.length == 7) {
                    if (Number.isNaN(Date.parse(e.currentTarget.value + "-01")) == true) {
                        e.currentTarget.value = '';
                        $(element).focus();
                        Swal.fire('Invalid Date');
                    }
                }
            } else
                ngModel.$setViewValue(null);

            console.log(ngModel.$modelValue);
        });
        $(element).inputmask(dateFormatMask, {
            "placeholder": dateFormatMaskPlaceholder, "oncomplete": function (e) {
                var event = document.createEvent('HTMLEvents');
                event.initEvent('input', true, true);
                e.currentTarget.dispatchEvent(event);
                $(this).trigger('change');
            }
        });

    }

    return {
        require: 'ngModel',
        link: link,
        scope: {
            dateDetail: '='
        }

    };
}]);

app.directive("allCostCenter", ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {

    function link(scope, element, attrs, ngModel) {

        var placeholder = "** Select CostCenter **";
        var showDetails = false;

        if (attrs.placeholder)
            placeholder = attrs.placeholder;

        if (attrs.showdetails == true || attrs.showdetails == "true")
            showDetails = true;

        var VoucherType = 0;
        if (attrs.vouchertype)
            VoucherType = attrs.vouchertype;

        var forTransaction = false;
        if (attrs.fortransaction)
            forTransaction = attrs.fortransaction;

        $(element).select2({
            //  dropdownParent: $(scope.parentId),
            placeholder: placeholder,
            allowClear: true,
            openOnEnter: true,
            width: '100%',
            multiple: false,
            minimumInputLength: 1,
            minimumResultsForSearch: 10,
            //triggerChange: true,
            ajax: {
                quietMillis: 300,
                url: base_url + "Global/GetAllCostCenter",
                dataType: "json",
                type: "GET",
                data: function (params) {
                    var queryParameters =
                    {
                        Top: 10,
                        ColName: "C.Name",
                        Operator: "like",
                        ForTransaction: forTransaction,
                        OrderByCol: "C.Name",
                        ColValue: params.term,
                        VoucherId: scope.voucherId,
                        LedgerId: scope.ledgerId,
                        CostCenterType: scope.costCenterType,
                        DimensionId: scope.dimensionId
                    }
                    return queryParameters;
                },
                processResults: function (res) {
                    if (res.IsSuccess == false) {
                        alert(res.ResponseMSG);
                        return;
                    }

                    //return { results: data };
                    return {
                        results: $.map(res.Data, function (item) {
                            scope.costcenterDetail = item;
                            ngModel.$setViewValue(item.CostCenterId);
                            return {
                                text: item.Name + ' - ' + item.Alias + ' - ' + item.Code,
                                id: item.CostCenterId,
                                data: item
                            }
                        })
                    };
                }
            },
            initSelection: function (element, callback) {

                scope.$watch("model", function (newValue, oldValue) {
                    $timeout(function () {
                        if (ngModel.$modelValue || ngModel.$modelValue > 0) {
                            var id = ngModel.$modelValue;

                            if (id != null && id !== "" && id > 0 && (!scope.costcenterDetail || scope.costcenterDetail.CostCenterId != id)) {

                                return $.ajax(
                                    base_url + "Global/GetCostCenterDetail?CostCenterId=" + id + "&VoucherType=" + VoucherType + "&LedgerId=" + scope.ledgerId,
                                    {
                                        dataType: "json",
                                        type: "GET",
                                        // data: queryParameters
                                    }).done(function (res) {
                                        if (res.IsSuccess == false) {
                                            alert(res.ResponseMSG);
                                        }
                                        else if (res.IsSuccess == true) {
                                            var item = res.Data;
                                            scope.costcenterDetail = res.Data;
                                            var tData =
                                            {
                                                text: item.Name + ' - ' + item.Alias + ' - ' + item.Code,
                                                id: item.CostCenterId,
                                                data: item
                                            }


                                            callback(tData);
                                        } else
                                            alert("No Data Found on Load");

                                    });
                            } else {

                                if (scope.costcenterDetail) {
                                    var item = scope.costcenterDetail;
                                    var tData =
                                    {
                                        text: item.Name + ' - ' + item.Alias + ' - ' + item.Code,
                                        id: item.CostCenterId,
                                        data: item
                                    }
                                    callback(tData);
                                }

                            }
                        } else {
                            var tData = {
                                id: 0,
                                text: ''
                            };
                            callback(tData);
                        }

                    });
                });
            }
        });


        $(element).on("select2:unselecting", function (e) {
            scope.costcenterDetail = {};
            scope.sideBarData = [];
            ngModel.$setViewValue(null);
        });

        $(element).on("select2:open", function (e) {

            $timeout(function () {
                scope.$apply(function () {

                    scope.confirmAction();
                });
            });
        });

        $(element).on("change", function (e) {
            scope.sideBarData = [];

            var selectedData = $(element).select2('data');

            if (selectedData && selectedData.length > 0) {
                var selectedCC = selectedData[0].data;
                ngModel.$setViewValue(selectedCC.CostCenterId);
                scope.costcenterDetail = selectedCC;
                if (showDetails) {
                    var cc = selectedCC;
                    $http({
                        method: 'GET',
                        url: base_url + "Global/GetCostCenterDetail?CostCenterId=" + selectedCC.CostCenterId + "&VoucherType=" + VoucherType + "&LedgerId=" + scope.ledgerId,
                        dataType: "json"
                    }).then(function (res) {
                        if (res.data.IsSuccess && res.data.Data) {
                            var led = res.data.Data;
                            scope.costcenterDetail = led;
                            scope.sideBarData = [];
                            scope.sideBarData.push({ text: 'Group Name', value: led.CategoryName }, { text: 'Code', value: led.Code }, { text: 'Pan Vat No', value: led.PanVatNo }, { text: 'PhoneNo', value: led.PhoneNo }, { text: 'Closing Balance', value: $filter('formatNumberAC')(led.Closing) }, { text: 'Opening', value: $filter('formatNumberAC')(led.Opening) }, { text: 'Total Dr', value: $filter('formatNumber')(led.DrAmt) }, { text: 'Total Cr', value: $filter('formatNumber')(led.CrAmt) })

                            $timeout(function () {
                                scope.$apply(function () {
                                    scope.confirmAction();
                                });
                            });


                        } else
                            alert(res.data.ResponseMSG);

                    }, function (reason) {
                        alert('Failed' + reason);
                    });

                }

            } else {

                scope.costcenterDetail = {};
                scope.sideBarData = [];
                ngModel.$setViewValue(null);
            }


        });


        $(element).on("select2:focus", function (e) {

            // $('#sidebarzz').toggleClass('active');

            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right');
            // alert("focus");
        })


    }

    return {
        require: 'ngModel',
        link: link,
        scope: {
            model: '=ngModel',
            parentId: "=?",
            costcenterDetail: '=',
            sideBarData: '=',
            confirmAction: '&',
            voucherId: "=?",
            ledgerId: "=?",
            costCenterType: "=?",
            dimensionId: "=?"
        }
    };
}]);


app.directive("costCenter", ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {

    function link(scope, element, attrs, ngModel) {

        var placeholder = "** Select CostCenter **";
        var showDetails = false;

        if (attrs.placeholder)
            placeholder = attrs.placeholder;

        if (attrs.showdetails == true || attrs.showdetails == "true")
            showDetails = true;

        var VoucherType = 0;
        if (attrs.vouchertype)
            VoucherType = attrs.vouchertype;

        $(element).select2({
            //  dropdownParent: $(scope.parentId),
            placeholder: placeholder,
            allowClear: true,
            openOnEnter: true,
            width: '100%',
            multiple: false,
            minimumInputLength: 1,
            minimumResultsForSearch: 10,
            //triggerChange: true,
            ajax: {
                quietMillis: 300,
                url: base_url + "Global/GetAllCostCenter",
                dataType: "json",
                type: "GET",
                data: function (params) {
                    var queryParameters =
                    {
                        Top: 10,
                        ColName: "C.Name",
                        Operator: "like",
                        ForTransaction: true,
                        OrderByCol: "C.Name",
                        ColValue: params.term
                    }
                    return queryParameters;
                },
                processResults: function (res) {
                    if (res.IsSuccess == false) {
                        alert(res.ResponseMSG);
                        return;
                    }

                    //return { results: data };
                    return {
                        results: $.map(res.Data, function (item) {
                            scope.costcenterDetail = item;
                            ngModel.$setViewValue(item.CostCenterId);
                            return {
                                text: item.Name + ' - ' + item.Alias + ' - ' + item.Code,
                                id: item.CostCenterId,
                                data: item
                            }
                        })
                    };
                }
            },
            initSelection: function (element, callback) {

                scope.$watch("model", function (newValue, oldValue) {
                    $timeout(function () {
                        if (ngModel.$modelValue || ngModel.$modelValue > 0) {
                            var id = ngModel.$modelValue;

                            if (id != null && id !== "" && id > 0 && (!scope.costcenterDetail || scope.costcenterDetail.CostCenterId != id)) {

                                return $.ajax(
                                    base_url + "Global/GetCostCenterDetail?CostCenterId=" + id + "&VoucherType=" + VoucherType,
                                    {
                                        dataType: "json",
                                        type: "GET",
                                        // data: queryParameters
                                    }).done(function (res) {
                                        if (res.IsSuccess == false) {
                                            alert(res.ResponseMSG);
                                        }
                                        else if (res.IsSuccess == true) {
                                            var item = res.Data;
                                            scope.costcenterDetail = res.Data;
                                            var tData =
                                            {
                                                text: item.Name + ' - ' + item.Alias + ' - ' + item.Code,
                                                id: item.CostCenterId,
                                                data: item
                                            }


                                            callback(tData);
                                        } else
                                            alert("No Data Found on Load");

                                    });
                            } else {

                                if (scope.costcenterDetail) {
                                    var item = scope.costcenterDetail;
                                    var tData =
                                    {
                                        text: item.Name + ' - ' + item.Alias + ' - ' + item.Code,
                                        id: item.CostCenterId,
                                        data: item
                                    }
                                    callback(tData);
                                }

                            }
                        } else {
                            var tData = {
                                id: 0,
                                text: ''
                            };
                            callback(tData);
                        }

                    });
                });
            }
        });


        $(element).on("select2:unselecting", function (e) {
            scope.costcenterDetail = {};
            scope.sideBarData = [];
            ngModel.$setViewValue(null);
        });

        $(element).on("select2:open", function (e) {

            $timeout(function () {
                scope.$apply(function () {

                    var selectedData = $(element).select2('data');
                    if (selectedData && selectedData.length > 0) {

                        if (!selectedData[0].data) {
                            //scope.ledgerDetail = {};
                            //scope.sideBarData = [];
                            //ngModel.$setViewValue(null);
                        }
                    }

                    scope.confirmAction();
                    //if (scope.ledgerDetail && scope.ledgerDetail.LedgerId > 0) {
                    //    //$(element).select2("close");
                    //    scope.confirmAction();
                    //}

                });
            });
        });

        $(element).on("change", function (e) {
            scope.sideBarData = [];

            var selectedData = $(element).select2('data');

            if (selectedData && selectedData.length > 0) {
                var selectedCC = selectedData[0].data;
                ngModel.$setViewValue(selectedCC.CostCenterId);
                scope.costcenterDetail = selectedCC;
                if (showDetails) {
                    var cc = selectedCC;
                    $http({
                        method: 'GET',
                        url: base_url + "Global/GetCostCenterDetail?CostCenterId=" + selectedCC.CostCenterId + "&VoucherType=" + VoucherType,
                        dataType: "json"
                    }).then(function (res) {
                        if (res.data.IsSuccess && res.data.Data) {
                            var led = res.data.Data;

                            $timeout(function () {
                                scope.$apply(function () {
                                    scope.costcenterDetail = led;
                                    scope.sideBarData = [];
                                    scope.sideBarData.push({ text: 'Group Name', value: led.CategoryName }, { text: 'Code', value: led.Code }, { text: 'Pan Vat No', value: led.PanVatNo }, { text: 'PhoneNo', value: led.PhoneNo }, { text: 'Closing Balance', value: $filter('formatNumberAC')(led.Closing) }, { text: 'Opening', value: $filter('formatNumberAC')(led.Opening) }, { text: 'Total Dr', value: $filter('formatNumber')(led.DrAmt) }, { text: 'Total Cr', value: $filter('formatNumber')(led.CrAmt) })

                                });
                            });

                            $timeout(function () {
                                scope.$apply(function () {

                                    scope.confirmAction();
                                });
                            });


                        } else
                            alert(res.data.ResponseMSG);

                    }, function (reason) {
                        alert('Failed' + reason);
                    });

                }

            } else {

                scope.costcenterDetail = {};
                scope.sideBarData = [];
                ngModel.$setViewValue(null);
            }


        });


        $(element).on("select2:focus", function (e) {

            // $('#sidebarzz').toggleClass('active');

            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right');
            // alert("focus");
        })


    }

    return {
        require: 'ngModel',
        link: link,
        scope: {
            model: '=ngModel',
            parentId: "=?",
            costcenterDetail: '=',
            sideBarData: '=',
            confirmAction: '&'
        }
    };
}]);

app.directive('datePickerAd', function () {
    return {
        restrict: 'A',
        require: '?ngModel',
        scope: {
            afterDays: '=?',
            beforeDays: '=?',
            dateDetail: '=?',
            confirmAction: '&'
        },
        link: function (scope, element, attrs, ngModelController) {

            // Private variables
            var datepickerFormat = 'dd-mm-yyyy',
                momentFormat = 'DD-MM-YYYY',
                datepicker,
                elPicker;

            // Init date picker and get objects http://bootstrap-datepicker.readthedocs.org/en/release/index.html
            datepicker = element.datepicker({
                autoclose: true,
                keyboardNavigation: false,
                todayHighlight: true,
                format: datepickerFormat
            });
            elPicker = datepicker.data('datepicker').picker;

            var dateFormatMask = "99-99-9999";
            var dateFormatMaskPlaceholder = "dd-mm-yyyy";
            $(element).inputmask(dateFormatMask, {
                "placeholder": dateFormatMaskPlaceholder, "oncomplete": function (e) {
                    var event = document.createEvent('HTMLEvents');
                    event.initEvent('input', true, true);
                    e.currentTarget.dispatchEvent(event);
                    $(this).trigger('change');
                }
            });

            // Adjust offset on show
            datepicker.on('show', function (evt) {
                elPicker.css('left', parseInt(elPicker.css('left')) + +attrs.offsetX);
                elPicker.css('top', parseInt(elPicker.css('top')) + +attrs.offsetY);
            });

            // Only watch and format if ng-model is present https://docs.angularjs.org/api/ng/type/ngModel.NgModelController
            if (ngModelController) {
                // So we can maintain time
                var lastModelValueMoment;

                ngModelController.$formatters.push(function (modelValue) {
                    //
                    // Date -> String
                    //

                    // Get view value (String) from model value (Date)
                    var viewValue,
                        m = moment(modelValue);
                    if (modelValue && m.isValid()) {
                        // Valid date obj in model
                        lastModelValueMoment = m.clone(); // Save date (so we can restore time later)
                        viewValue = m.format(momentFormat);
                    } else {
                        // Invalid date obj in model
                        lastModelValueMoment = undefined;
                        viewValue = undefined;
                    }

                    // Update picker
                    element.datepicker('update', viewValue);

                    if (!scope.dateDetail) {
                        var dt = modelValue;
                        // var bsDateDet = NepaliFunctions.AD2BS({ year: dt.getFullYear(), month: dt.getMonth() + 1, day: dt.getDate() });
                        //var bsDate = bsDateDet.year + '-' + bsDateDet.month + '-' + bsDateDet.day;
                        var bsDate = DateFormatAD(dt);
                        scope.dateDetail = {
                            dateAD: dt,
                            dateBS: bsDate,
                            NY: dt.getFullYear(),
                            NM: dt.getMonth() + 1,
                            ND: dt.getDate(),
                            age: getDOBAge(dt)
                        };
                    }


                    // Update view
                    return viewValue;
                });

                ngModelController.$parsers.push(function (viewValue) {
                    //
                    // String -> Date
                    //
                    scope.dateDetail = {};

                    // Get model value (Date) from view value (String)
                    var modelValue,
                        m = moment(viewValue, momentFormat, true);
                    if (viewValue && m.isValid()) {
                        // Valid date string in view
                        if (lastModelValueMoment) { // Restore time
                            m.hour(lastModelValueMoment.hour());
                            m.minute(lastModelValueMoment.minute());
                            m.second(lastModelValueMoment.second());
                            m.millisecond(lastModelValueMoment.millisecond());
                        }
                        modelValue = m.toDate();

                        var dt = modelValue;
                        // var bsDateDet = NepaliFunctions.AD2BS({ year: dt.getFullYear(), month: dt.getMonth() + 1, day: dt.getDate() });
                        //var bsDate = bsDateDet.year + '-' + bsDateDet.month + '-' + bsDateDet.day;
                        var bsDate = DateFormatAD(dt);
                        scope.dateDetail = {
                            dateAD: dt,
                            dateBS: bsDate,
                            NY: dt.getFullYear(),
                            NM: dt.getMonth() + 1,
                            ND: dt.getDate(),
                            age: getDOBAge(dt)
                        };

                        scope.confirmAction();

                    } else {
                        // Invalid date string in view
                        modelValue = undefined;
                    }

                    // Update model
                    return modelValue;
                });

                datepicker.on('changeDate', function (evt) {
                    // Only update if it's NOT an <input> (if it's an <input> the datepicker plugin trys to cast the val to a Date)
                    if (evt.target.tagName !== 'INPUT') {
                        ngModelController.$setViewValue(moment(evt.date).format(momentFormat)); // $seViewValue basically calls the $parser above so we need to pass a string date value in
                        ngModelController.$render();
                    }

                    var dt = evt.date;
                    //var bsDateDet = NepaliFunctions.AD2BS({ year: dt.getFullYear(), month: dt.getMonth() + 1, day: dt.getDate() });
                    // var bsDate = bsDateDet.year + '-' + bsDateDet.month + '-' + bsDateDet.day;
                    var bsDate = DateFormatAD(dt);
                    scope.dateDetail = {
                        dateAD: dt,
                        dateBS: bsDate,
                        NY: dt.getFullYear(),
                        NM: dt.getMonth() + 1,
                        ND: dt.getDate(),
                        age: getDOBAge(dt)
                    };

                    scope.confirmAction();

                });
            }

        }
    };
});

app.directive("datePicker", ['$http', '$timeout', '$filter', 'GlobalServices', function ($http, $timeout, $filter, GlobalServices) {

    function link(scope, ele, attrs, ngModel) {

        if (!scope.dateStyle || scope.dateStyle == undefined || scope.dateStyle == null) {
            GlobalServices.getDateStyleConfig().then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {

                    scope.dateStyle = res.data.Data;
                    var momentFormat = "DD-MM-YYYY";
                    if (scope.dateStyle == 1) {
                        try {
                            if (ngModel.$viewValue) {
                                ngModel.$setViewValue(moment(ngModel.$viewValue).format(momentFormat)); // $seViewValue basically calls the $parser above so we need to pass a string date value in
                                ngModel.$render();
                            }
                        } catch { }

                        adlink(scope, ele, attrs, ngModel);

                    }
                    else
                        bslink(scope, ele, attrs, ngModel);
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });

        } else {

            if (scope.dateStyle == 1) {
                try {
                    if (ngModel.$viewValue) {
                        ngModel.$setViewValue(moment(ngModel.$viewValue).format(momentFormat)); // $seViewValue basically calls the $parser above so we need to pass a string date value in
                        ngModel.$render();

                    }
                } catch { }
                adlink(scope, ele, attrs, ngModel);
            }
            else
                bslink(scope, ele, attrs, ngModel);
        }



    }

    function adlink(scope, element, attrs, ngModelController) {

        // Private variables
        var datepickerFormat = 'dd-mm-yyyy',
            momentFormat = 'DD-MM-YYYY',
            datepicker,
            elPicker;

        var dateFormatMask = "99-99-9999";
        var dateFormatMaskPlaceholder = "dd-mm-yyyy";
        $(element).inputmask(dateFormatMask, {
            "placeholder": dateFormatMaskPlaceholder, "oncomplete": function (e) {
                var event = document.createEvent('HTMLEvents');
                event.initEvent('input', true, true);
                e.currentTarget.dispatchEvent(event);
                $(this).trigger('change');
            }
        });

        // Init date picker and get objects http://bootstrap-datepicker.readthedocs.org/en/release/index.html
        datepicker = $(element).datepicker({
            autoclose: true,
            keyboardNavigation: false,
            todayHighlight: true,
            format: datepickerFormat,
            onSelect: function (dateText) {
                scope.$apply(function () {
                    ngModelController.$setViewValue(dateText);
                });
            }
        });
        elPicker = datepicker.data('datepicker').picker;


        // Adjust offset on show
        datepicker.on('show', function (evt) {
            elPicker.css('left', parseInt(elPicker.css('left')) + +attrs.offsetX);
            elPicker.css('top', parseInt(elPicker.css('top')) + +attrs.offsetY);
        });

        // Only watch and format if ng-model is present https://docs.angularjs.org/api/ng/type/ngModel.NgModelController
        if (ngModelController) {
            // So we can maintain time
            var lastModelValueMoment;

            var m = moment(ngModelController.$viewValue, momentFormat, true);
            if (m.isValid()) {
                var dt = m.toDate();
                var bsDate = DateFormatAD(dt);
                scope.dateDetail = {
                    dateAD: dt,
                    dateBS: bsDate,
                    NY: dt.getFullYear(),
                    NM: dt.getMonth() + 1,
                    ND: dt.getDate(),
                    age: getDOBAge(dt)
                }
            };

            ngModelController.$formatters.push(function (modelValue) {
                //
                // Date -> String
                //

                // Get view value (String) from model value (Date)
                var viewValue,
                    m = moment(modelValue);
                if (modelValue && m.isValid()) {
                    // Valid date obj in model
                    lastModelValueMoment = m.clone(); // Save date (so we can restore time later)
                    viewValue = m.format(momentFormat);
                } else {
                    // Invalid date obj in model
                    lastModelValueMoment = undefined;
                    viewValue = undefined;
                }

                // Update picker
                element.datepicker('update', viewValue);

                if (!scope.dateDetail || !scope.dateDetail.dateAD) {
                    var dt = modelValue;
                    // var bsDateDet = NepaliFunctions.AD2BS({ year: dt.getFullYear(), month: dt.getMonth() + 1, day: dt.getDate() });
                    //var bsDate = bsDateDet.year + '-' + bsDateDet.month + '-' + bsDateDet.day;
                    if (dt && dt != undefined) {
                        var bsDate = DateFormatAD(dt);
                        scope.dateDetail = {
                            dateAD: dt,
                            dateBS: bsDate,
                            NY: dt.getFullYear(),
                            NM: dt.getMonth() + 1,
                            ND: dt.getDate(),
                            age: getDOBAge(dt)
                        };
                    }

                }


                // Update view
                return viewValue;
            });

            ngModelController.$parsers.push(function (viewValue) {
                //
                // String -> Date
                //

                //const regex = /^\d{2}-\d{2}-\d{4}$/;
                //if (regex.test(viewValue)) {
                //    ngModelCtrl.$setValidity('date', true);
                //    return viewValue;
                //} else {
                //    ngModelCtrl.$setValidity('date', false);
                //    return undefined;
                //}

                scope.dateDetail = {};

                // Get model value (Date) from view value (String)
                var modelValue,
                    m = moment(viewValue, momentFormat, true);
                if (viewValue && m.isValid()) {
                    // Valid date string in view
                    if (lastModelValueMoment) { // Restore time
                        m.hour(lastModelValueMoment.hour());
                        m.minute(lastModelValueMoment.minute());
                        m.second(lastModelValueMoment.second());
                        m.millisecond(lastModelValueMoment.millisecond());
                    }
                    modelValue = m.toDate();

                    var dt = modelValue;
                    // var bsDateDet = NepaliFunctions.AD2BS({ year: dt.getFullYear(), month: dt.getMonth() + 1, day: dt.getDate() });
                    //var bsDate = bsDateDet.year + '-' + bsDateDet.month + '-' + bsDateDet.day;

                    if (dt && dt != undefined) {
                        var bsDate = DateFormatAD(dt);
                        scope.dateDetail = {
                            dateAD: dt,
                            dateBS: bsDate,
                            NY: dt.getFullYear(),
                            NM: dt.getMonth() + 1,
                            ND: dt.getDate(),
                            age: getDOBAge(dt)
                        };

                        scope.confirmAction();
                    }


                } else {
                    // Invalid date string in view
                    modelValue = undefined;
                }

                // Update model
                return modelValue;
            });

            datepicker.on('changeDate', function (evt) {
                // Only update if it's NOT an <input> (if it's an <input> the datepicker plugin trys to cast the val to a Date)
                if (evt.target.tagName !== 'INPUT') {
                    ngModelController.$setViewValue(moment(evt.date).format(momentFormat)); // $seViewValue basically calls the $parser above so we need to pass a string date value in
                    ngModelController.$render();
                }

                var dt = evt.date;
                //var bsDateDet = NepaliFunctions.AD2BS({ year: dt.getFullYear(), month: dt.getMonth() + 1, day: dt.getDate() });
                // var bsDate = bsDateDet.year + '-' + bsDateDet.month + '-' + bsDateDet.day;

                if (dt && dt != undefined) {
                    var bsDate = DateFormatAD(dt);
                    scope.dateDetail = {
                        dateAD: dt,
                        dateBS: bsDate,
                        NY: dt.getFullYear(),
                        NM: dt.getMonth() + 1,
                        ND: dt.getDate(),
                        age: getDOBAge(dt)
                    };

                    scope.confirmAction();
                }


            });
        }

    }

    function bslink(scope, ele, attrs, ngModel) {
        scope.watcher = scope.$watch(function () {
            return ngModel.$modelValue;
        }, function (newValue) {

            if (ngModel.$modelValue) {
                var dt = ngModel.$modelValue;

                if (moment.isDate(dt) == false) {
                    if (!scope.dateDetail) {
                        var ndt = new Date(dt);
                        if (ndt) {
                            var curYear = new Date().getFullYear();
                            if (ndt.getFullYear() <= curYear) {
                                dt = ndt;
                            }
                        }
                    }
                }

                if (moment.isDate(dt) == true) {
                    var bsDateDet = NepaliFunctions.AD2BS({ year: dt.getFullYear(), month: dt.getMonth() + 1, day: dt.getDate() });

                    var bsDate = bsDateDet.year + '-' + bsDateDet.month.toString().padStart(2, '0') + '-' + bsDateDet.day.toString().padStart(2, '0');
                    element.value = bsDate;


                    $timeout(function () {
                        scope.$apply(function () {

                            var fInit = false;

                            if (!scope.dateDetail) {
                                fInit = true;
                                scope.dateDetail = {};
                            }


                            scope.dateDetail = {
                                dateAD: dt,
                                dateBS: bsDate,
                                NY: bsDateDet.year,
                                NM: bsDateDet.month,
                                ND: bsDateDet.day
                            };

                            if (fInit == true)
                                scope.confirmAction();
                        });
                    });
                }
            }
        });

        var element = ele[0];
        element.nepaliDatePicker({
            disableDaysAfter: (scope.afterDays ? scope.afterDays : null),
            disableDaysBefore: (scope.beforeDays ? scope.beforeDays : null),
            ndpYear: true,
            ndpMonth: true,
            ndpYearCount: 10,
            onChange: function () {
                $timeout(function () {
                    scope.$apply(function () {
                        if (!scope.dateDetail)
                            scope.dateDetail = {};

                        var dates = element.value.split('-');
                        var adDateDet = NepaliFunctions.BS2AD({
                            year: parseInt(dates[0]), month: parseInt(dates[1]), day: parseInt(dates[2])
                        });

                        var adDate = new Date(adDateDet.year, adDateDet.month - 1, adDateDet.day);

                        scope.dateDetail = {
                            dateAD: adDate,
                            dateBS: element.value,
                            NY: parseInt(dates[0]),
                            NM: parseInt(dates[1]),
                            ND: parseInt(dates[2])
                        };

                        //ngModel.$setViewValue(adDate);
                        ngModel.$setViewValue(element.value);

                        $timeout(function () {
                            scope.confirmAction();
                        });

                    });
                });

            }
        });

        var dateFormatMask = "9999-99-99";
        var dateFormatMaskPlaceholder = "yyyy-mm-dd";
        $(element).inputmask(dateFormatMask, {
            "placeholder": dateFormatMaskPlaceholder, "oncomplete": function (e) {
                var event = document.createEvent('HTMLEvents');
                event.initEvent('input', true, true);
                e.currentTarget.dispatchEvent(event);
                $(this).trigger('change');
            }
        });

        element.addEventListener("blur",
            function () {
                if (!scope.dateDetail)
                    scope.dateDetail = {};

                var dates = element.value.split('-');
                var adDateDet = NepaliFunctions.BS2AD({
                    year: parseInt(dates[0]), month: parseInt(dates[1]), day: parseInt(dates[2])
                });

                var adDate = new Date(adDateDet.year, adDateDet.month - 1, adDateDet.day);

                scope.dateDetail = {
                    dateAD: adDate,
                    dateBS: element.value,
                    NY: parseInt(dates[0]),
                    NM: parseInt(dates[1]),
                    ND: parseInt(dates[2])
                };

            }, true);
    }

    return {
        require: 'ngModel',
        link: link,
        scope: {
            afterDays: '=?',
            beforeDays: '=?',
            dateDetail: '=?',
            confirmAction: '&',
            dateStyle: '=?',
            voucherid: '=?'
        }
    };
}]);

// app.js
app.directive('qrReader', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var inputField = element[0];
            var buffer = '';
            var DELIMITER = '\r'; // Common delimiter (Enter key), adjust as needed

            // Listen for input events
            element.on('input', function () {
                // Append the input value to the buffer
                buffer += inputField.value;

                // Check if the buffer ends with the delimiter
                if (buffer.endsWith(DELIMITER)) {
                    // Remove the delimiter from the buffer
                    buffer = buffer.slice(0, -1);

                    // Call the processQRCode function from the controller
                    scope.$apply(function () {
                        scope.$parent.processQRCode(buffer);
                    });

                    // Clear the buffer and the input field for the next scan
                    inputField.value = '';
                    buffer = '';
                }
            });
        }
    };
});

//app.directive('barcodeScanner', function () {
//    return {
//        restrict: 'A',
//        scope: {
//            callback: '=barcodeScanner',
//        },
//        link: function postLink(scope, iElement, iAttrs) {
//            // Settings
//            //var zeroCode = 48;
//            var zeroCode = 45;
//           // var nineCode = 57;
//            var nineCode = 122;
//            var enterCode = 13;
//            var minLength = 3;
//            var delay = 400; // ms

//            // Variables
//            var pressed = false;
//            var chars = [];
//            var enterPressedLast = false;

//            // Timing
//            var startTime = undefined;
//            var endTime = undefined;

//            jQuery(document).keypress(function (e) {
//                if (chars.length === 0) {
//                    startTime = new Date().getTime();
//                } else {
//                    endTime = new Date().getTime();
//                }

//                // Register characters and enter key
//                if (e.which >= zeroCode && e.which <= nineCode) {
//                    chars.push(String.fromCharCode(e.which));
//                }

//                enterPressedLast = (e.which === enterCode);

//                if (pressed == false) {
//                    setTimeout(function () {
//                        if (chars.length >= minLength && enterPressedLast) {
//                            var barcode = chars.join('');
//                            //console.log('barcode : ' + barcode + ', scan time (ms): ' + (endTime - startTime));

//                            if (angular.isFunction(scope.callback)) {
//                                scope.$apply(function () {
//                                    scope.callback(barcode);
//                                });
//                            }
//                        }
//                        chars = [];
//                        pressed = false;
//                    }, delay);
//                }
//                pressed = true;
//            });
//        }
//    };
//});

app.directive('barcodeScanner', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            callback: '&onBarcodeScan' // Accept a callback function
        },
        link: function (scope, element, attrs, ngModel) {
            element.on('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    var barcodeValue = element.val().trim();

                    if (barcodeValue) {
                        scope.$apply(function () {
                            ngModel.$setViewValue(barcodeValue);
                        });

                        // Call the callback function with scanned barcode data
                        if (scope.callback) {
                            scope.$apply(function () {
                                scope.callback({ barcode: barcodeValue });
                            });
                        }

                        // Move focus to the next input field if specified
                        //var nextField = attrs.nextField;
                        //if (nextField) {
                        //    document.getElementById(nextField)?.focus();
                        //}
                    }
                    else if (ngModel.$viewValue) {
                        if (scope.callback) {
                            scope.$apply(function () {
                                scope.callback({ barcode: barcodeValue });
                            });
                        }
                    }

                    // Clear input if needed
                    element.val('');
                }
            });
        }
    };
});


app.directive("udfSelect2", ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {

    var linkFun = function (scope, element, attrs, ngModel) {

        var placeholder = "** Select " + scope.label + " **";
        if (attrs.placeholder)
            placeholder = attrs.placeholder;

        $(element).select2({
            placeholder: placeholder,
            allowClear: true,
            openOnEnter: true,
            width: '100%',
            multiple: false,
            minimumInputLength: 1,
            minimumResultsForSearch: 10,
            //triggerChange: true,
            ajax: {
                quietMillis: 400,
                url: base_url + "Global/GetCustomData",
                dataType: "json",
                type: "GET",
                data: function (params) {

                    var colName = scope.udfDet && scope.udfDet.TextColumn && scope.udfDet.TextColumn.length > 0 ? scope.udfDet.TextColumn : '[text]';

                    var qry = '';
                    if (params.term && params.term.length > 0)
                        qry = scope.qry + (scope.qry.includes('where ') == true ? ' and ' : ' where ') + ' ' + colName + " like N'" + params.term + "%'";
                    else
                        qry = scope.qry;

                    var queryParameters =
                    {
                        procName: '',
                        //qry: scope.qry,
                        qry: qry,
                        asParentChild: false,
                        tblNames: '',
                        colRelations: ''
                    };
                    return queryParameters;
                },
                processResults: function (res) {
                    if (res.IsSuccess == false) {
                        alert(res.ResponseMSG);
                        return;
                    }


                    if (res.Data && res.Data.length > 0) {
                        scope.valDetail = res.Data[0];
                        ngModel.$setViewValue(res.Data[0].id);
                    }
                    return {
                        results: $.map(res.Data, function (item) {

                            return {
                                text: item.text,
                                id: item.id,
                                data: item
                            }
                        })
                    };
                }
            },
            initSelection: function (element, callback) {

                scope.$watch("model", function (newValue, oldValue) {
                    $timeout(function () {
                        if (ngModel.$modelValue) {
                            var id = ngModel.$modelValue;

                            if (id != null && id !== "") {

                                showPleaseWait();

                                var colName = scope.udfDet && scope.udfDet.RefColumn && scope.udfDet.RefColumn.length > 0 ? scope.udfDet.RefColumn : scope.colname;
                                var colName1 = colName.replaceAll('[', '').replaceAll(']', '');

                                var queryParameters =
                                {
                                    procName: '',
                                    qry: scope.qry + (scope.qry.includes('where ') == true ? ' and ' : ' where ') + colName + '=' + (isNumber(id) == true ? id : "'" + id + "'"),
                                    asParentChild: false,
                                    tblNames: '',
                                    colRelations: ''
                                };

                                return $.ajax(
                                    base_url + "Global/GetCustomData?" + param(queryParameters),
                                    {
                                        dataType: "json",
                                        type: "GET",
                                        // data: queryParameters
                                    }).done(function (res) {

                                        hidePleaseWait();

                                        if (res.IsSuccess == false) {
                                            alert(res.ResponseMSG);
                                        }
                                        else if (res.IsSuccess == true && res.Data && res.Data.length > 0) {

                                            var item = res.Data[0];
                                            scope.valDetail = item;
                                            var tData =
                                            {
                                                text: item.text,
                                                id: item.id,
                                                data: item
                                            }

                                            callback(tData);

                                        } else
                                            alert("No Data Found on Load");

                                    });
                            } else {
                                var tData = {
                                    id: 0,
                                    text: ''
                                };
                                callback(tData);
                            }
                        }
                        else {
                            var tData = {
                                id: 0,
                                text: ''
                            };
                            callback(tData);
                        }
                    });
                });


            }
        });


        $(element).on("select2:unselecting", function (e) {
            ngModel.$setViewValue(null);
        });

        $(element).on("change", function (e) {
            var selectedData = $(element).select2('data');
            if (selectedData && selectedData.length > 0) {
                var selectedProduct = selectedData[0].data;
                scope.valDetail = selectedProduct;
                ngModel.$setViewValue(selectedProduct.id);

            } else {
                ngModel.$setViewValue(null);
            }
        });

        $(element).on("select2:focus", function (e) {

            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right');
            // alert("focus");
        })

    }

    return {
        require: 'ngModel',
        link: linkFun,
        scope: {
            model: '=ngModel',
            label: '=?',
            qry: "=?",
            colname: '=?',
            valDetail: '=',
            udfDet: '='
        }

    };
}]);

app.directive("dynamicSelect2", ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {

    var linkFun = function (scope, element, attrs, ngModel) {

        var placeholder = "** Select " + scope.label + " **";
        if (attrs.placeholder)
            placeholder = attrs.placeholder;

        $(element).select2({
            placeholder: placeholder,
            allowClear: true,
            openOnEnter: true,
            width: '100%',
            multiple: false,
            minimumInputLength: 1,
            minimumResultsForSearch: 10,
            //triggerChange: true,
            ajax: {
                quietMillis: 400,
                url: base_url + "Global/GetCustomData",
                dataType: "json",
                type: "GET",
                data: function (params) {

                    var qry = '';

                    if (scope.udfentity) {
                        if (scope.udfentity.Source_Qry && scope.udfentity.Source_Qry.length > 0) {
                            qry = scope.udfentity.Source_Qry;
                        }
                        else
                            qry = scope.qry;
                    }
                    else
                        qry = scope.qry;

                    var searchCol = (scope.udfentity ? (scope.udfentity.TextColumn ? scope.udfentity.TextColumn : '[text]') : '[text]');
                    if (params.term && params.term.length > 0)
                        qry = qry + (scope.qry.includes('where ') == true ? ' and ' : ' where ') + searchCol + "  like '" + params.term + "%'";


                    var queryParameters =
                    {
                        procName: '',
                        //qry: scope.qry,
                        qry: qry,
                        asParentChild: false,
                        tblNames: '',
                        colRelations: ''
                    };
                    return queryParameters;
                },
                processResults: function (res) {
                    if (res.IsSuccess == false) {
                        alert(res.ResponseMSG);
                        return;
                    }

                    if (res.Data && res.Data.length > 0) {
                        scope.valDetail = res.Data[0];
                        ngModel.$setViewValue(res.Data[0].id);
                    }
                    return {
                        results: $.map(res.Data, function (item) {

                            return {
                                text: item.text,
                                id: item.id,
                                data: item
                            }
                        })
                    };
                }
            },
            initSelection: function (element, callback) {

                scope.$watch("model", function (newValue, oldValue) {
                    $timeout(function () {
                        if (ngModel.$modelValue) {
                            var id = ngModel.$modelValue;

                            if ((id != null && id !== "" && oldValue != newValue) || scope.valDetail == undefined) {

                                showPleaseWait();

                                var searchCol = (scope.udfentity ? (scope.udfentity.RefColumn ? scope.udfentity.RefColumn : '[UTranId]') : '[UTranId]');

                                var qry = '';

                                if (scope.udfentity) {
                                    if (scope.udfentity.Source_Qry && scope.udfentity.Source_Qry.length > 0) {
                                        qry = scope.udfentity.Source_Qry;
                                    }
                                    else
                                        qry = scope.qry;
                                }
                                else
                                    qry = scope.qry;

                                var queryParameters =
                                {
                                    procName: '',
                                    //qry: qry + (qry.includes('where ') == true ? ' and ' : ' where ' + searchCol+'=') + (isNumber(id) == true ? id : "'" + id + "'"),
                                    qry: qry + (qry.includes('where ') == true ? ' and ' : ' where ') + searchCol + '=' + (isNumber(id) == true ? id : "'" + id + "'"),
                                    asParentChild: false,
                                    tblNames: '',
                                    colRelations: ''
                                };

                                return $.ajax(
                                    base_url + "Global/GetCustomData?" + param(queryParameters),
                                    {
                                        dataType: "json",
                                        type: "GET",
                                        // data: queryParameters
                                    }).done(function (res) {

                                        hidePleaseWait();

                                        if (res.IsSuccess == false) {
                                            alert(res.ResponseMSG);
                                        }
                                        else if (res.IsSuccess == true && res.Data && res.Data.length > 0) {

                                            var item = res.Data[0];
                                            scope.valDetail = item;
                                            var tData =
                                            {
                                                text: item.text,
                                                id: item.id,
                                                data: item
                                            }

                                            callback(tData);

                                        } else
                                            alert("No Data Found on Load");

                                    });
                            } else {
                                var tData = {
                                    id: 0,
                                    text: ''
                                };
                                callback(tData);
                            }
                        }
                        else {
                            var tData = {
                                id: 0,
                                text: ''
                            };
                            callback(tData);
                        }
                    });
                });


            }
        });


        $(element).on("select2:unselecting", function (e) {
            ngModel.$setViewValue(null);
        });

        $(element).on("change", function (e) {
            var selectedData = $(element).select2('data');
            if (selectedData && selectedData.length > 0) {
                var selectedProduct = selectedData[0].data;
                scope.valDetail = selectedProduct;
                ngModel.$setViewValue(selectedProduct.id);

                $timeout(function () {
                    if (scope.confirmAction)
                        scope.confirmAction();
                });


            } else {
                ngModel.$setViewValue(null);
            }
        });

        $(element).on("select2:focus", function (e) {

            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right');
            // alert("focus");
        })

    }

    return {
        require: 'ngModel',
        link: linkFun,
        scope: {
            model: '=ngModel',
            label: '=?',
            qry: "=?",
            colname: '=?',
            valDetail: '=',
            udfentity: '=?',
            confirmAction: '&?',
            newEntity: '=?'
        }

    };
}]);

app.directive('dynamicField', ['$http', '$timeout', '$filter', '$compile', function ($http, $timeout, $filter, $compile) {

    var getTemplate = function (uf) {
        var ftype = uf.dataType;
        var template = '';
        switch (ftype) {
            case 'String':
                template = ' <input type="text" class="form-control form-control-sm" ng-model="df.UDFValue" onfocus="this.select()" onpaste="return false">';
                break;
            case 'Date':
            case 'DateTime':
                template = '<input type="text" class="form-control form-control-sm" date-picker ng-model="df.UDFValue_TMP" onfocus="this.select()" date-detail="udf.UDFValueDet" confirm-action="changeEvent()" onpaste="return false">';
                break;
            case 'Int32':
                template = '<input type="number" class="form-control form-control-sm" ng-model="df.UDFValue" onfocus="this.select()" ng-change="changeEvent()" onpaste="return false">';
                break;
            case 'Double':
                template = '<input type="text" number-input class="form-control form-control-sm" ng-model="df.UDFValue" onfocus="this.select()" style="text-align:right" ng-change="changeEvent()" noofdecimal="voucher.NoOfDecimalPlaces" onpaste="return false">';
                break;
            case 'Boolean':
            case 'Bool':
            case 'bool':
                template = '<input type="checkbox" id="id' + uf.Name + '" class="form-control form-control-sm" ng-model="df.UDFValue"  ng-change="changeEvent()" onpaste="return false">';
                break;
        }

        return template;
    };

    var linker = function (scope, element, attrs) {
        element.html(getTemplate(scope.df)).show();
        $compile(element.contents())(scope);

    };

    return {
        restrict: "E",
        replace: true,
        link: linker,
        scope: {
            df: '=',
            changeEvent: '&'
        }
    };
}]);

app.directive('udfField', ['$http', '$timeout', '$filter', '$compile', function ($http, $timeout, $filter, $compile) {

    var getTemplate = function (uf) {
        var ftype = uf.FieldType;
        var template = '';
        switch (ftype) {
            case 1:
                template = ' <input type="text" class="form-control form-control-sm serial" ng-model="udf.UDFValue" onfocus="this.select()">';
                break;
            case 2:
                template = '<input type="text" class="form-control form-control-sm serial" date-picker ng-model="udf.UDFValue_TMP" onfocus="this.select()" date-detail="udf.UDFValueDet">';
                break;
            case 3: {

                if (uf.Source && uf.Source.length > 0) {
                    template = '<select class="form-control form-control-sm serial" udf-select2 udf-det="udf" label="udf.DisplayName" colname="udf.NameId" qry="udf.Source" ng-model="udf.UDFValue" val-detail="udf.UDFValueDet"> </select >';

                } else {
                    template = '<select class="form-control form-control-sm serial" active-select2 ng-model="udf.UDFValue" > <option ng-repeat="ss in udf.SelectOptions | commaBreak" ng-value="ss" ng-selected="ss==udf.UDFValue" > {{ ss }}</option> </select >';
                }

            }

                break;
            case 4:
                template = '<input type="number" class="form-control form-control-sm serial" ng-model="udf.UDFValue" onfocus="this.select()" ng-change="changeEvent()">';
                break;
            case 5:
                template = '<input type="text" number-input class="form-control form-control-sm serial" ng-model="udf.UDFValue" onfocus="this.select()" style="text-align:right" ng-change="changeEvent()" noofdecimal="voucher.NoOfDecimalPlaces">';
                break;
            case 9:
                template = '<input type="checkbox" id="id' + uf.Name + '" class="form-control form-control-sm serial" ng-model="udf.UDFValue"  ng-change="changeEvent()">';
                break;
        }

        return template;
    };

    var linker = function (scope, element, attrs) {
        element.html(getTemplate(scope.udf)).show();
        $compile(element.contents())(scope);

    };

    return {
        restrict: "E",
        replace: true,
        link: linker,
        scope: {
            udf: '=',
            voucher: '=',
            changeEvent: '&'
        }
    };
}]);

app.directive('udfEntity', ['$http', '$timeout', '$filter', '$compile', function ($http, $timeout, $filter, $compile) {

    var getTemplate = function (uf, beData) {
        var ftype = uf.FieldType;
        var template = '';
        var uid = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        var hasFormula = uf.Formula && uf.Formula.length > 0 ? 'disabled' : '';

        switch (ftype) {
            case 1:
                template = ' <input type="text" class="form-control form-control-sm" ng-model="beData.' + uf.Name + '" onfocus="this.select()">';
                break;
            case 2:
                template = '<input type="text" class="form-control form-control-sm" date-picker ng-model="beData.' + uf.Name + '_TMP" onfocus="this.select()" date-detail="beData.' + uf.Name + 'Det" >';
                break;
            case 3: {

                if (uf.Source && uf.Source.length > 0) {
                    template = '<select new-entity="newEntity" class="form-control form-control-sm" dynamic-select2 label="udf.Label" udfentity="udf"  colname="udf.Name"  qry="udf.Source" ng-model="beData.' + uf.Name + '" val-detail="udf.UDFValueDet" confirm-action="changeEvent()">   </select >';

                } else {
                    template = '<select class="form-control form-control-sm" active-select2 ng-model="beData.' + uf.Name + '" > <option ng-repeat="ss in udf.DropDownList | commaBreak" ng-value="ss" ng-selected="ss==beData.' + uf.Name + '" > {{ ss }}</option> </select >';
                }

            }

                break;
            case 19: {

                if (uf.Source && uf.Source.length > 0) {
                    template = '<select class="form-control form-control-sm" udf-select2 udf-det="udf" label="udf.Label"  colname="udf.Name"  qry="udf.Source" ng-model="beData.' + uf.Name + '" val-detail="udf.UDFValueDet">   </select >';

                } else {
                    template = '<select class="form-control form-control-sm" active-select2 ng-model="beData.' + uf.Name + '" > <option ng-repeat="ss in udf.DropDownList | commaBreak" ng-value="ss" ng-selected="ss==beData.' + uf.Name + '" > {{ ss }}</option> </select >';
                }

            }

                break;
            case 4:
            case 8:
            case 18:
                template = '<input type="number" class="form-control form-control-sm" ng-model="beData.' + uf.Name + '" onfocus="this.select()" ng-change="changeEvent()" ' + hasFormula + '>';
                break;
            case 9:
                template = '<input type="checkbox" id="id' + uf.Name + '" class="form-control form-control-sm" ng-model="beData.' + uf.Name + '"  ng-change="changeEvent()">';
                break;
            case 20:
                template = '<input type="time" class="form-control form-control-sm" ng-model="beData.' + uf.Name + '" onfocus="this.select()" style="text-align:right" ng-change="changeEvent()">';
                break;
            case 5:
                template = '<input type="text" number-input class="form-control form-control-sm" ng-model="beData.' + uf.Name + '" onfocus="this.select()" style="text-align:right" ng-change="changeEvent()" noofdecimal="3" ' + hasFormula + '>';
                break;
            //case 6:
            //    template = '<input type="text" number-input class="form-control form-control-sm" ng-model="beData.' + uf.Name + '" onfocus="this.select()" style="text-align:right" ng-change="changeEvent()" noofdecimal="3">';
            //    break;
            case 7:
                template = '<textarea rows="5"  class="form-control form-control-sm" ng-model="beData.' + uf.Name + '" onfocus="this.select()"   ng-change="changeEvent()">';
                break;
            case 12:
                //template = '<input type="text" id="htm' + uf.Name + '" html-editor class="form-control form-control-sm" ng-model="beData.' + uf.Name + '" onfocus="this.select()"  ng-change="changeEvent()">';
                template = '<div  id="htm' + uf.Name + '" html-editor class="summernote" ng-model="beData.' + uf.Name + '" onfocus="this.select()"  ng-change="changeEvent()">';
                break;
            case 13:
                template = '<div class="person-photo-attachment-wrap text-center"> <div class="img-wrap mx-auto" style = "width:100%;"> <img ng-src="{{beData.' + uf.Name + 'Data || beData.' + uf.Name + '}}" class="img-fluid" alt="" id="img' + uf.Name + '"></div>';
                template = template + '<label for="choose-file' + uf.Name + uid + '" type="button" class="btn btn-outline-secondary btn-sm" style="font-size:14px;">Upload ' + uf.Label + '</label>';
                template = template + '<input id="choose-file' + uf.Name + uid + '" class="btn btn-outline-secondary btn-sm" style="display: none;" type="file" accept=".jpg,.jpeg,.png" file-model ng-model="beData.' + uf.Name + '_TMP" fileread="beData.' + uf.Name + 'Data"/>';
                template = template + '<a ng-click="clickEvent()" href="#" class="text-danger d-block mt-3">remove current image</a></div >';
                break;
            case 14:
                {

                    template = '<div class="card-body mt-0" id="add-file-' + uf.Name + '" style="background-color: #eff0ef;">';
                    template = template + '<label> <b>Upload ' + uf.Name + '</b></label >';
                    template = template + '<div id="actions' + uf.Name + '" class="row">';
                    template = template + '<div class="col-md-1 mt-4">';
                    template = template + '<div class="btn-group">';
                    template = template + '<span class="btn-add-file col fileinput-button">';
                    template = template + '<span><i class="fas fa-plus-circle"></i></span>';
                    template = template + '</span>';
                    template = template + '</div>';
                    template = template + '</div>';
                    template = template + '<div class="col-md-11">';
                    template = template + '<div class="d-flex p-2" id="previews' + uf.Name + '" style="overflow-x: auto;">';
                    template = template + '<div id="template' + uf.Name + '">';
                    template = template + '<a data-dz-remove class="cancel float-right">';
                    template = template + '<i class="fas fa-times-circle" style="  color:#28a745;font-size: 14px;"></i>';
                    template = template + '</a>';
                    template = template + '<span class="preview p-2 ml-2"><img style="height:150px;width:auto" src="data:," alt="" data-dz-thumbnail /></span>';
                    template = template + '<div class="align-items-center" style="width: 100%;">';
                    template = template + '</div>';
                    template = template + '</div>';
                    template = template + '</div>';
                    template = template + '</div>';
                    template = template + '</div>';
                    template = template + '</div >';

                }
                break;
            case 15:
                template = '<div class="custom-file">';
                template = template + ' <input type="file" class="custom-file-input" id="docSF' + uf.Name + uid + '"  file-model="beData.' + uf.Name + 'Files" ng-model="beData.' + uf.Name + 'Files">';
                template = template + ' <label class="custom-file-label" for="docSF' + uf.Name + uid + '">Choose file ({{ beData.' + uf.Name + 'Files.length }} )</label>';
                template = template + '</div >';;
                break;
            case 16:
                template = '<div class="custom-file">';
                template = template + ' <input type="file" class="custom-file-input" id="docMF' + uf.Name + uid + '" multiple  file-model="beData.' + uf.Name + 'Files" ng-model="beData.' + uf.Name + 'Files">';
                template = template + ' <label class="custom-file-label" for="docMF' + uf.Name + uid + '">Choose file ({{ beData.' + uf.Name + 'Files.length }} )</label>';
                template = template + '</div >';;
                break;
            case 17:
                template = '<div class="person-photo-attachment-wrap text-center"> <div class="img-wrap mx-auto" style = "width:100%;"> <div class="img-fluid" id="img-vid-' + uf.Name + '"  > </div> </div>';
                template = template + '<label for="choose-file' + uf.Name + uid + '" type="button" class="btn btn-outline-secondary btn-sm mt-2" style="font-size:14px;">Upload ' + uf.Label + '</label>';
                template = template + '<input id="choose-file' + uf.Name + uid + '" class="btn btn-outline-secondary btn-sm" style="display: none;" type="file" accept="image/*, video/*" img-video-model ng-model="beData.' + uf.Name + '_TMP" fileread="beData.' + uf.Name + 'Data" fieldname="' + uf.Name + '" />';
                template = template + '<a ng-click="clickEvent()" href="#" class="text-danger d-block mt-3">remove current image</a></div >';

                //template = template + ' <label for="inp-img-vid"> <span> Photos/Videos</span> <input type="file" accept="image/*, video/*" name="img-vid" id="inp-img-vid"> </label>';                
                //template = template + ' <div class="display-img-vid-con" id="img-vid-con"  style="top: 30px; left: 250px;  position: absolute; z-index: 1" >';
                //template = template + ' </div>';;
                break;
        }

        return template;
    };

    var linker = function (scope, element, attrs) {
        element.html(getTemplate(scope.udf, scope.beData)).show();
        $compile(element.contents())(scope);

    };

    return {
        restrict: "E",
        replace: true,
        link: linker,
        scope: {
            beData: '=',
            udf: '=',
            changeEvent: '&',
            clickEvent: '&',
            newEntity: '=?'
        }
    };
}]);

function showPleaseWait() {
    $("#pleaseWaitDialog").modal("show");
}

function hidePleaseWait() {
    $("#pleaseWaitDialog").modal("hide");
}

function GetStateList() {
    var dataColl = [
        { id: 1, text: 'KOSHI' },
        { id: 2, text: 'MADHESH' },
        { id: 3, text: 'BAGMATI' },
        { id: 4, text: 'GANDAKI' },
        { id: 5, text: 'LUMBINI' },
        { id: 6, text: 'KARNALI' },
        { id: 7, text: 'SUDURPASCHIM' }
    ];
    return dataColl;
};

function GetZoneList() {
    var dataColl = [
        { id: 1, text: 'Mechi', textNP: 'मेची' },

        { id: 2, text: 'Koshi', textNP: 'कोशी' },

        { id: 3, text: 'Sagarmatha', textNP: 'सगरमाथा' },

        { id: 4, text: 'Janakpur', textNP: 'जनकपुर' },

        { id: 5, text: 'Bagmati', textNP: ' बागमति' },

        { id: 6, text: 'Narayani', textNP: 'नारायणी' },

        { id: 7, text: 'Gandaki', textNP: 'गण्डकी' },

        { id: 8, text: 'Dhawalagiri', textNP: 'धवलागिरी' },

        { id: 9, text: 'Lumbini', textNP: 'लुम्विनी' },

        { id: 10, text: 'Rapti', textNP: 'राप्ती' },

        { id: 11, text: 'Bheri', textNP: 'भेरी' },

        { id: 12, text: 'Karnali', textNP: 'कर्णाली' },

        { id: 13, text: 'Seti', textNP: 'सेती' },

        { id: 14, text: 'Mahakali', textNP: 'महाकाली' }
    ];
    return dataColl;
};

function GetDistrictList() {
    var dataColl = [
        { id: 1, zoneId: 1, stateId: 1, text: 'Taplejung', textNP: 'ताप्लेजुंग ' },
        { id: 2, zoneId: 1, stateId: 1, text: 'Panchthar', textNP: 'पांचथर ' },
        { id: 3, zoneId: 1, stateId: 1, text: 'Ilam', textNP: 'इलाम ' },
        { id: 4, zoneId: 1, stateId: 1, text: 'Jhapa', textNP: 'झापा ' },
        { id: 5, zoneId: 2, stateId: 1, text: 'Morang', textNP: 'मोरंग ' },
        { id: 6, zoneId: 2, stateId: 1, text: 'Sunsari', textNP: 'सुनसरी' },
        { id: 7, zoneId: 2, stateId: 1, text: 'Dhankutta', textNP: 'धनकुटा ' },
        { id: 8, zoneId: 2, stateId: 1, text: 'Sankhuwasabha', textNP: 'संखुवासभा ' },
        { id: 9, zoneId: 2, stateId: 1, text: 'Bhojpur', textNP: 'भोजपुर ' },
        { id: 10, zoneId: 2, stateId: 1, text: 'Terhathum', textNP: 'तेह्रथुम ' },
        { id: 11, zoneId: 3, stateId: 1, text: 'Okhaldunga', textNP: 'ओखलढुंगा ' },
        { id: 12, zoneId: 3, stateId: 1, text: 'Khotang', textNP: 'खोटाँग ' },
        { id: 13, zoneId: 3, stateId: 1, text: 'Solukhumbu', textNP: 'सोलुखुम्बू ' },
        { id: 14, zoneId: 3, stateId: 1, text: 'Udaypur', textNP: 'उदयपुर ' },
        { id: 15, zoneId: 3, stateId: 2, text: 'Saptari', textNP: 'सप्तरी ' },
        { id: 16, zoneId: 3, stateId: 2, text: 'Siraha', textNP: 'सिराहा ' },
        { id: 17, zoneId: 4, stateId: 2, text: 'Dhanusa', textNP: 'धनुषा ' },
        { id: 18, zoneId: 4, stateId: 2, text: 'Mahottari', textNP: 'महोत्तरी ' },
        { id: 19, zoneId: 4, stateId: 2, text: 'Sarlahi', textNP: 'सर्लाही ' },
        { id: 20, zoneId: 4, stateId: 3, text: 'Sindhuli', textNP: 'सिन्धुली ' },
        { id: 21, zoneId: 4, stateId: 3, text: 'Ramechhap', textNP: 'रामेछाप ' },
        { id: 22, zoneId: 4, stateId: 3, text: 'Dolkha', textNP: 'दोलखा' },
        { id: 23, zoneId: 5, stateId: 3, text: 'Sindhupalchauk', textNP: 'सिन्धुपाल्चोक ' },
        { id: 24, zoneId: 5, stateId: 3, text: 'Kavre', textNP: 'काभ्रे ' },
        { id: 25, zoneId: 5, stateId: 3, text: 'Lalitpur', textNP: 'ललितपुर ' },
        { id: 26, zoneId: 5, stateId: 3, text: 'Bhaktapur', textNP: 'भक्तपुर ' },
        { id: 27, zoneId: 5, stateId: 3, text: 'Kathmandu', textNP: 'काठमाडौँ ' },
        { id: 28, zoneId: 5, stateId: 3, text: 'Nuwakot', textNP: 'नुवाकोट ' },
        { id: 29, zoneId: 5, stateId: 3, text: 'Rasuwa', textNP: 'रसुवा ' },
        { id: 30, zoneId: 5, stateId: 3, text: 'Dhading', textNP: 'धादिङ' },
        { id: 31, zoneId: 6, stateId: 3, text: 'Makwanpur', textNP: 'मकवानपुर ' },
        { id: 32, zoneId: 6, stateId: 2, text: 'Rauthat', textNP: 'रौतहट ' },
        { id: 33, zoneId: 6, stateId: 2, text: 'Bara', textNP: 'बारा ' },
        { id: 34, zoneId: 6, stateId: 2, text: 'Parsa', textNP: 'पर्सा ' },
        { id: 35, zoneId: 6, stateId: 3, text: 'Chitwan', textNP: 'चितवन' },
        { id: 36, zoneId: 7, stateId: 4, text: 'Gorkha', textNP: 'गोरखा ' },
        { id: 37, zoneId: 7, stateId: 4, text: 'Lamjung', textNP: 'लमजुङ ' },
        { id: 38, zoneId: 7, stateId: 4, text: 'Tanahun', textNP: 'तनहुँ ' },
        { id: 39, zoneId: 7, stateId: 4, text: 'Syangja', textNP: 'स्याङग्जा' },
        { id: 40, zoneId: 7, stateId: 4, text: 'Kaski', textNP: 'कास्की ' },
        { id: 41, zoneId: 7, stateId: 4, text: 'Manag', textNP: 'मनाङ ' },
        { id: 42, zoneId: 8, stateId: 4, text: 'Mustang', textNP: 'मुस्ताङ ' },
        { id: 43, zoneId: 8, stateId: 4, text: 'Parbat', textNP: 'पर्वत ' },
        { id: 44, zoneId: 8, stateId: 4, text: 'Myagdi', textNP: 'म्याग्दी ' },
        { id: 45, zoneId: 8, stateId: 4, text: 'Baglung', textNP: 'बागलुङ' },
        { id: 46, zoneId: 9, stateId: 5, text: 'Gulmi', textNP: 'गुल्मी ' },
        { id: 47, zoneId: 9, stateId: 5, text: 'Palpa', textNP: 'पाल्पा ' },
        { id: 48, zoneId: 9, stateId: 4, text: 'Nawalparasi (East of Bardaghat Susta)', textNP: 'नवलपरासी (बर्दघाट सुस्ता पूर्व' },
        { id: 49, zoneId: 9, stateId: 5, text: 'Nawalparasi (West of Bardaghat Susta)', textNP: 'नवलपरासी (बर्दघाट सुस्ता पश्चिम' },
        { id: 50, zoneId: 9, stateId: 5, text: 'Rupandehi', textNP: 'रुपन्देही ' },
        { id: 51, zoneId: 9, stateId: 5, text: 'Arghakhanchi', textNP: 'अर्घाखाँची ' },
        { id: 52, zoneId: 9, stateId: 5, text: 'Kapilvastu', textNP: 'कपिलवस्तु ' },
        { id: 53, zoneId: 10, stateId: 5, text: 'Pyuthan', textNP: 'प्युठान ' },
        { id: 54, zoneId: 10, stateId: 5, text: 'Rolpa', textNP: 'रोल्पा ' },
        { id: 55, zoneId: 10, stateId: 5, text: 'Rukum Purba', textNP: 'पूर्वी रूकुम ' },
        { id: 56, zoneId: 10, stateId: 6, text: 'Rukum Paschim', textNP: 'पश्चिमी रूकुम ' },
        { id: 57, zoneId: 10, stateId: 6, text: 'Salyan', textNP: 'सल्यान ' },
        { id: 58, zoneId: 10, stateId: 5, text: 'Dang', textNP: 'दाङ ' },
        { id: 59, zoneId: 11, stateId: 5, text: 'Bardiya', textNP: 'बर्दिया ' },
        { id: 60, zoneId: 11, stateId: 6, text: 'Surkhet', textNP: 'सुर्खेत ' },
        { id: 61, zoneId: 11, stateId: 6, text: 'Dailekh', textNP: 'दैलेख ' },
        { id: 62, zoneId: 11, stateId: 5, text: 'Banke', textNP: 'बाँके ' },
        { id: 63, zoneId: 11, stateId: 6, text: 'Jajarkot', textNP: 'जाजरकोट ' },
        { id: 64, zoneId: 12, stateId: 6, text: 'Dolpa', textNP: 'डोल्पा ' },
        { id: 65, zoneId: 12, stateId: 6, text: 'Humla', textNP: 'हुम्ला ' },
        { id: 66, zoneId: 12, stateId: 6, text: 'Kalikot', textNP: 'कालिकोट ' },
        { id: 67, zoneId: 12, stateId: 6, text: 'Mugu', textNP: 'मुगु ' },
        { id: 68, zoneId: 12, stateId: 6, text: 'Jumla', textNP: 'जुम्ला' },
        { id: 69, zoneId: 13, stateId: 7, text: 'Bajura', textNP: 'बाजुरा' },
        { id: 70, zoneId: 13, stateId: 7, text: 'Bajhang', textNP: 'बझाङ ' },
        { id: 71, zoneId: 13, stateId: 7, text: 'Achham', textNP: 'अछाम ' },
        { id: 72, zoneId: 13, stateId: 7, text: 'Doti', textNP: 'डोटी ' },
        { id: 73, zoneId: 1, stateId: 7, text: 'Kailali', textNP: 'कैलाली ' },
        { id: 74, zoneId: 14, stateId: 7, text: 'Kanchanpur', textNP: 'कंचनपुर ' },
        { id: 75, zoneId: 14, stateId: 7, text: 'Dadeldhura', textNP: 'डडेलधुरा ' },
        { id: 76, zoneId: 14, stateId: 7, text: 'Baitadi', textNP: 'बैतडी ' },
        { id: 77, zoneId: 14, stateId: 7, text: 'Darchula', textNP: 'दार्चुला ' }
    ];
    return dataColl;
};

function GetVDCList() {
    var dataColl = [
        { id: 1, districtId: 1, text: 'Aathrai Tribeni Ga. Pa.' },
        { id: 2, districtId: 1, text: 'Maiwakhola Ga. Pa.' },
        { id: 3, districtId: 1, text: 'Meringden Ga. Pa.' },
        { id: 4, districtId: 1, text: 'Mikwakhola Ga. Pa.' },
        { id: 5, districtId: 1, text: 'Phaktanglung Ga. Pa.' },
        { id: 6, districtId: 1, text: 'Phungling Na. Pa.' },
        { id: 7, districtId: 1, text: 'Sidingba Ga. Pa.' },
        { id: 8, districtId: 1, text: 'Sirijangha Ga. Pa.' },
        { id: 9, districtId: 1, text: 'Pathibhara Yangwarak Ga. Pa.' },
        { id: 10, districtId: 2, text: 'Falelung Ga. Pa.' },
        { id: 11, districtId: 2, text: 'Falgunanda Ga. Pa.' },
        { id: 12, districtId: 2, text: 'Hilihang Ga. Pa.' },
        { id: 13, districtId: 2, text: 'Kummayak Ga. Pa.' },
        { id: 14, districtId: 2, text: 'Miklajung Ga. Pa.' },
        { id: 15, districtId: 2, text: 'Phidim Na. Pa.' },
        { id: 16, districtId: 2, text: 'Tumbewa Ga. Pa.' },
        { id: 17, districtId: 2, text: 'Yangwarak Ga. Pa.' },
        { id: 18, districtId: 3, text: 'Chulachuli Ga. Pa.' },
        { id: 19, districtId: 3, text: 'Deumai Na. Pa.' },
        { id: 20, districtId: 3, text: 'Fakphokthum Ga. Pa.' },
        { id: 21, districtId: 3, text: 'Illam Na. Pa.' },
        { id: 22, districtId: 3, text: 'Mai Na. Pa.' },
        { id: 23, districtId: 3, text: 'Maijogmai Ga. Pa.' },
        { id: 24, districtId: 3, text: 'Mangsebung Ga. Pa.' },
        { id: 25, districtId: 3, text: 'Rong Ga. Pa.' },
        { id: 26, districtId: 3, text: 'Sandakpur Ga. Pa.' },
        { id: 27, districtId: 3, text: 'Suryodaya Na. Pa.' },
        { id: 28, districtId: 4, text: 'Arjundhara Na. Pa.' },
        { id: 29, districtId: 4, text: 'Barhadashi Ga. Pa.' },
        { id: 30, districtId: 4, text: 'Bhadrapur Na. Pa.' },
        { id: 31, districtId: 4, text: 'Birtamod Na. Pa.' },
        { id: 32, districtId: 4, text: 'Buddhashanti Ga. Pa.' },
        { id: 33, districtId: 4, text: 'Damak Na. Pa.' },
        { id: 34, districtId: 4, text: 'Gauradhaha Na. Pa.' },
        { id: 35, districtId: 4, text: 'Gauriganj Ga. Pa.' },
        { id: 36, districtId: 4, text: 'Haldibari Ga. Pa.' },
        { id: 37, districtId: 4, text: 'Jhapa Ga. Pa.' },
        { id: 38, districtId: 4, text: 'Kachankawal Ga. Pa.' },
        { id: 39, districtId: 4, text: 'Kamal Ga. Pa.' },
        { id: 40, districtId: 4, text: 'Kankai Na. Pa.' },
        { id: 41, districtId: 4, text: 'Mechinagar Na. Pa.' },
        { id: 42, districtId: 4, text: 'Shivasataxi Na. Pa.' },
        { id: 43, districtId: 5, text: 'Belbari Na. Pa.' },
        { id: 44, districtId: 5, text: 'Biratnagar Ma. Na. Pa.' },
        { id: 45, districtId: 5, text: 'Budhiganga Ga. Pa.' },
        { id: 46, districtId: 5, text: 'Dhanpalthan Ga. Pa.' },
        { id: 47, districtId: 5, text: 'Gramthan Ga. Pa.' },
        { id: 48, districtId: 5, text: 'Jahada Ga. Pa.' },
        { id: 49, districtId: 5, text: 'Kanepokhari Ga. Pa.' },
        { id: 50, districtId: 5, text: 'Katahari Ga. Pa.' },
        { id: 51, districtId: 5, text: 'Kerabari Ga. Pa.' },
        { id: 52, districtId: 5, text: 'Letang Na. Pa.' },
        { id: 53, districtId: 5, text: 'Miklajung Ga. Pa.' },
        { id: 54, districtId: 5, text: 'Patahrishanishchare Na. Pa.' },
        { id: 55, districtId: 5, text: 'Rangeli Na. Pa.' },
        { id: 56, districtId: 5, text: 'Ratuwamai Na. Pa.' },
        { id: 57, districtId: 5, text: 'Sundarharaicha Na. Pa.' },
        { id: 58, districtId: 5, text: 'Sunwarshi Na. Pa.' },
        { id: 59, districtId: 5, text: 'Uralabari Na. Pa.' },
        { id: 60, districtId: 6, text: 'Barah Na. Pa.' },
        { id: 61, districtId: 6, text: 'Barju Ga. Pa.' },
        { id: 62, districtId: 6, text: 'Bhokraha Narsingh Ga. Pa.' },
        { id: 63, districtId: 6, text: 'Dewanganj Ga. Pa.' },
        { id: 64, districtId: 6, text: 'Dharan Up. Ma. Na. Pa.' },
        { id: 65, districtId: 6, text: 'Duhabi Na. Pa.' },
        { id: 66, districtId: 6, text: 'Gadhi Ga. Pa.' },
        { id: 67, districtId: 6, text: 'Harinagar Ga. Pa.' },
        { id: 68, districtId: 6, text: 'Inaruwa Na. Pa.' },
        { id: 69, districtId: 6, text: 'Itahari Up. Ma. Na. Pa.' },
        { id: 70, districtId: 6, text: 'Koshi Ga. Pa.' },
        { id: 71, districtId: 6, text: 'Ramdhuni Na. Pa.' },
        { id: 72, districtId: 7, text: 'Chaubise Ga. Pa.' },
        { id: 73, districtId: 7, text: 'Chhathar Jorpati Ga. Pa.' },
        { id: 74, districtId: 7, text: 'Dhankuta Na. Pa.' },
        { id: 75, districtId: 7, text: 'Shahidbhumi Ga. Pa.' },
        { id: 76, districtId: 7, text: 'Sangurigadhi Ga. Pa.' },
        { id: 77, districtId: 7, text: 'Mahalaxmi Na. Pa.' },
        { id: 78, districtId: 7, text: 'Pakhribas Na. Pa.' },
        { id: 79, districtId: 8, text: 'Bhotkhola Ga. Pa.' },
        { id: 80, districtId: 8, text: 'Chainpur Na. Pa.' },
        { id: 81, districtId: 8, text: 'Chichila Ga. Pa.' },
        { id: 82, districtId: 8, text: 'Dharmadevi Na. Pa.' },
        { id: 83, districtId: 8, text: 'Khandbari Na. Pa.' },
        { id: 84, districtId: 8, text: 'Madi Na. Pa.' },
        { id: 85, districtId: 8, text: 'Makalu Ga. Pa.' },
        { id: 86, districtId: 8, text: 'Panchakhapan Na. Pa.' },
        { id: 87, districtId: 8, text: 'Sabhapokhari Ga. Pa.' },
        { id: 88, districtId: 8, text: 'Silichong Ga. Pa.' },
        { id: 89, districtId: 9, text: 'Aamchowk Ga. Pa.' },
        { id: 90, districtId: 9, text: 'Arun Ga. Pa.' },
        { id: 91, districtId: 9, text: 'Bhojpur Na. Pa.' },
        { id: 92, districtId: 9, text: 'Hatuwagadhi Ga. Pa.' },
        { id: 93, districtId: 9, text: 'Pauwadungma Ga. Pa.' },
        { id: 94, districtId: 9, text: 'Ramprasad Rai Ga. Pa.' },
        { id: 95, districtId: 9, text: 'Salpasilichho Ga. Pa.' },
        { id: 96, districtId: 9, text: 'Shadananda Na. Pa.' },
        { id: 97, districtId: 9, text: 'Tyamkemaiyung Ga. Pa.' },
        { id: 98, districtId: 10, text: 'Aathrai Ga. Pa.' },
        { id: 99, districtId: 10, text: 'Chhathar Ga. Pa.' },
        { id: 100, districtId: 10, text: 'Laligurans Na. Pa.' },
        { id: 101, districtId: 10, text: 'Menchayam Ga. Pa.' },
        { id: 102, districtId: 10, text: 'Myanglung Na. Pa.' },
        { id: 103, districtId: 10, text: 'Phedap Ga. Pa.' },
        { id: 104, districtId: 11, text: 'Champadevi Ga. Pa.' },
        { id: 105, districtId: 11, text: 'Chisankhugadhi Ga. Pa.' },
        { id: 106, districtId: 11, text: 'Khijidemba Ga. Pa.' },
        { id: 107, districtId: 11, text: 'Likhu Ga. Pa.' },
        { id: 108, districtId: 11, text: 'Manebhanjyang Ga. Pa.' },
        { id: 109, districtId: 11, text: 'Molung Ga. Pa.' },
        { id: 110, districtId: 11, text: 'Siddhicharan Na. Pa.' },
        { id: 111, districtId: 11, text: 'Sunkoshi Ga. Pa.' },
        { id: 112, districtId: 12, text: 'Ainselukhark Ga. Pa.' },
        { id: 113, districtId: 12, text: 'Barahapokhari Ga. Pa.' },
        { id: 114, districtId: 12, text: 'Diprung Ga. Pa.' },
        { id: 115, districtId: 12, text: 'Halesi Tuwachung Na. Pa.' },
        { id: 116, districtId: 12, text: 'Jantedhunga Ga. Pa.' },
        { id: 117, districtId: 12, text: 'Kepilasagadhi Ga. Pa.' },
        { id: 118, districtId: 12, text: 'Khotehang Ga. Pa.' },
        { id: 119, districtId: 12, text: 'Rawa Besi Ga. Pa.' },
        { id: 120, districtId: 12, text: 'Rupakot Majhuwagadhi Na. Pa.' },
        { id: 121, districtId: 12, text: 'Sakela Ga. Pa.' },
        { id: 122, districtId: 13, text: 'Thulung Dudhkoshi Ga. Pa.' },
        { id: 123, districtId: 13, text: 'Dudhkoshi Ga. Pa.' },
        { id: 124, districtId: 13, text: 'Khumbupasanglahmu Ga. Pa.' },
        { id: 125, districtId: 13, text: 'Likhupike Ga. Pa.' },
        { id: 126, districtId: 13, text: 'Mahakulung Ga. Pa.' },
        { id: 127, districtId: 13, text: 'Nechasalyan Ga. Pa.' },
        { id: 128, districtId: 13, text: 'Solududhakunda Na. Pa.' },
        { id: 129, districtId: 13, text: 'Sotang Ga. Pa.' },
        { id: 130, districtId: 14, text: 'Belaka Na. Pa.' },
        { id: 131, districtId: 14, text: 'Chaudandigadhi Na. Pa.' },
        { id: 132, districtId: 14, text: 'Katari Na. Pa.' },
        { id: 133, districtId: 14, text: 'Rautamai Ga. Pa.' },
        { id: 134, districtId: 14, text: 'Limchungbung Ga. Pa.' },
        { id: 135, districtId: 14, text: 'Tapli Ga. Pa.' },
        { id: 136, districtId: 14, text: 'Triyuga Na. Pa.' },
        { id: 137, districtId: 14, text: 'Udayapurgadhi Ga. Pa.' },
        { id: 138, districtId: 15, text: 'Agnisair Krishna Savaran Ga. Pa.' },
        { id: 139, districtId: 15, text: 'Balan Bihul Ga. Pa.' },
        { id: 140, districtId: 15, text: 'Belhi Chapena Ga. Pa.' },
        { id: 141, districtId: 15, text: 'Bishnupur Ga. Pa.' },
        { id: 142, districtId: 15, text: 'Bode Barsain Na. Pa.' },
        { id: 143, districtId: 15, text: 'Chhinnamasta Ga. Pa.' },
        { id: 144, districtId: 15, text: 'Dakneshwori Na. Pa.' },
        { id: 145, districtId: 15, text: 'Hanumannagar Kankalini Na. Pa.' },
        { id: 146, districtId: 15, text: 'Kanchanrup Na. Pa.' },
        { id: 147, districtId: 15, text: 'Khadak Na. Pa.' },
        { id: 148, districtId: 15, text: 'Mahadeva Ga. Pa.' },
        { id: 149, districtId: 15, text: 'Rajbiraj Na. Pa.' },
        { id: 150, districtId: 15, text: 'Rupani Ga. Pa.' },
        { id: 151, districtId: 15, text: 'Saptakoshi Na. Pa.' },
        { id: 152, districtId: 15, text: 'Shambhunath Na. Pa.' },
        { id: 153, districtId: 15, text: 'Surunga Na. Pa.' },
        { id: 154, districtId: 15, text: 'Tilathi Koiladi Ga. Pa.' },
        { id: 155, districtId: 15, text: 'Tirahut Ga. Pa.' },
        { id: 156, districtId: 16, text: 'Arnama Ga. Pa.' },
        { id: 157, districtId: 16, text: 'Aurahi Ga. Pa.' },
        { id: 158, districtId: 16, text: 'Bariyarpatti Ga. Pa.' },
        { id: 159, districtId: 16, text: 'Bhagawanpur Ga. Pa.' },
        { id: 160, districtId: 16, text: 'Bishnupur Ga. Pa.' },
        { id: 161, districtId: 16, text: 'Dhangadhimai Na. Pa.' },
        { id: 162, districtId: 16, text: 'Golbazar Na. Pa.' },
        { id: 163, districtId: 16, text: 'Kalyanpur Na. Pa.' },
        { id: 164, districtId: 16, text: 'Karjanha Na. Pa.' },
        { id: 165, districtId: 16, text: 'Lahan Na. Pa.' },
        { id: 166, districtId: 16, text: 'Laxmipur Patari Ga. Pa.' },
        { id: 167, districtId: 16, text: 'Mirchaiya Na. Pa.' },
        { id: 168, districtId: 16, text: 'Naraha Ga. Pa.' },
        { id: 169, districtId: 16, text: 'Nawarajpur Ga. Pa.' },
        { id: 170, districtId: 16, text: 'Sakhuwanankarkatti Ga. Pa.' },
        { id: 171, districtId: 16, text: 'Siraha Na. Pa.' },
        { id: 172, districtId: 16, text: 'Sukhipur Na. Pa.' },
        { id: 173, districtId: 17, text: 'Aaurahi Ga. Pa.' },
        { id: 174, districtId: 17, text: 'Bateshwor Ga. Pa.' },
        { id: 175, districtId: 17, text: 'Bideha Na. Pa.' },
        { id: 176, districtId: 17, text: 'Chhireshwornath Na. Pa.' },
        { id: 177, districtId: 17, text: 'Dhanauji Ga. Pa.' },
        { id: 178, districtId: 17, text: 'Dhanusadham Na. Pa.' },
        { id: 179, districtId: 17, text: 'Ganeshman Charnath Na. Pa.' },
        { id: 180, districtId: 17, text: 'Hansapur Na. Pa.' },
        { id: 181, districtId: 17, text: 'Janaknandani Ga. Pa.' },
        { id: 182, districtId: 17, text: 'Janakpur Up. Ma. Na. Pa.' },
        { id: 183, districtId: 17, text: 'Kamala Na. Pa.' },
        { id: 184, districtId: 17, text: 'Lakshminiya Ga. Pa.' },
        { id: 185, districtId: 17, text: 'Mithila Na. Pa.' },
        { id: 186, districtId: 17, text: 'Mithila Bihari Na. Pa.' },
        { id: 187, districtId: 17, text: 'Mukhiyapatti Musarmiya Ga. Pa.' },
        { id: 188, districtId: 17, text: 'Nagarain Na. Pa.' },
        { id: 189, districtId: 17, text: 'Sabaila Na. Pa.' },
        { id: 190, districtId: 17, text: 'Sahidnagar Na. Pa.' },
        { id: 191, districtId: 18, text: 'Aurahi Na. Pa.' },
        { id: 192, districtId: 18, text: 'Balwa Na. Pa.' },
        { id: 193, districtId: 18, text: 'Bardibas Na. Pa.' },
        { id: 194, districtId: 18, text: 'Bhangaha Na. Pa.' },
        { id: 195, districtId: 18, text: 'Ekdanra Ga. Pa.' },
        { id: 196, districtId: 18, text: 'Gaushala Na. Pa.' },
        { id: 197, districtId: 18, text: 'Jaleswor Na. Pa.' },
        { id: 198, districtId: 18, text: 'Loharpatti Na. Pa.' },
        { id: 199, districtId: 18, text: 'Mahottari Ga. Pa.' },
        { id: 200, districtId: 18, text: 'Manra Siswa Na. Pa.' },
        { id: 201, districtId: 18, text: 'Matihani Na. Pa.' },
        { id: 202, districtId: 18, text: 'Pipra Ga. Pa.' },
        { id: 203, districtId: 18, text: 'Ramgopalpur Na. Pa.' },
        { id: 204, districtId: 18, text: 'Samsi Ga. Pa.' },
        { id: 205, districtId: 18, text: 'Sonama Ga. Pa.' },
        { id: 206, districtId: 19, text: 'Bagmati Na. Pa.' },
        { id: 207, districtId: 19, text: 'Balara Na. Pa.' },
        { id: 208, districtId: 19, text: 'Barahathawa Na. Pa.' },
        { id: 209, districtId: 19, text: 'Basbariya Ga. Pa.' },
        { id: 210, districtId: 19, text: 'Bishnu Ga. Pa.' },
        { id: 211, districtId: 19, text: 'Bramhapuri Ga. Pa.' },
        { id: 212, districtId: 19, text: 'Chakraghatta Ga. Pa.' },
        { id: 213, districtId: 19, text: 'Chandranagar Ga. Pa.' },
        { id: 214, districtId: 19, text: 'Dhankaul Ga. Pa.' },
        { id: 215, districtId: 19, text: 'Godaita Na. Pa.' },
        { id: 216, districtId: 19, text: 'Haripur Na. Pa.' },
        { id: 217, districtId: 19, text: 'Haripurwa Na. Pa.' },
        { id: 218, districtId: 19, text: 'Hariwan Na. Pa.' },
        { id: 219, districtId: 19, text: 'Ishworpur Na. Pa.' },
        { id: 220, districtId: 19, text: 'Kabilasi Na. Pa.' },
        { id: 221, districtId: 19, text: 'Kaudena Ga. Pa.' },
        { id: 222, districtId: 19, text: 'Lalbandi Na. Pa.' },
        { id: 223, districtId: 19, text: 'Malangawa Na. Pa.' },
        { id: 224, districtId: 19, text: 'Parsa Ga. Pa.' },
        { id: 225, districtId: 19, text: 'Ramnagar Ga. Pa.' },
        { id: 226, districtId: 20, text: 'Dudhouli Na. Pa.' },
        { id: 227, districtId: 20, text: 'Ghanglekh Ga. Pa.' },
        { id: 228, districtId: 20, text: 'Golanjor Ga. Pa.' },
        { id: 229, districtId: 20, text: 'Hariharpurgadhi Ga. Pa.' },
        { id: 230, districtId: 20, text: 'Kamalamai Na. Pa.' },
        { id: 231, districtId: 20, text: 'Marin Ga. Pa.' },
        { id: 232, districtId: 20, text: 'Phikkal Ga. Pa.' },
        { id: 233, districtId: 20, text: 'Sunkoshi Ga. Pa.' },
        { id: 234, districtId: 20, text: 'Tinpatan Ga. Pa.' },
        { id: 235, districtId: 21, text: 'Doramba Ga. Pa.' },
        { id: 236, districtId: 21, text: 'Gokulganga Ga. Pa.' },
        { id: 237, districtId: 21, text: 'Khadadevi Ga. Pa.' },
        { id: 238, districtId: 21, text: 'Likhu Tamakoshi Ga. Pa.' },
        { id: 239, districtId: 21, text: 'Manthali Na. Pa.' },
        { id: 240, districtId: 21, text: 'Ramechhap Na. Pa.' },
        { id: 241, districtId: 21, text: 'Sunapati Ga. Pa.' },
        { id: 242, districtId: 21, text: 'Umakunda Ga. Pa.' },
        { id: 243, districtId: 22, text: 'Baiteshwor Ga. Pa.' },
        { id: 244, districtId: 22, text: 'Bhimeshwor Na. Pa.' },
        { id: 245, districtId: 22, text: 'Bigu Ga. Pa.' },
        { id: 246, districtId: 22, text: 'Gaurishankar Ga. Pa.' },
        { id: 247, districtId: 22, text: 'Jiri Na. Pa.' },
        { id: 248, districtId: 22, text: 'Kalinchok Ga. Pa.' },
        { id: 249, districtId: 22, text: 'Melung Ga. Pa.' },
        { id: 250, districtId: 22, text: 'Sailung Ga. Pa.' },
        { id: 251, districtId: 22, text: 'Tamakoshi Ga. Pa.' },
        { id: 252, districtId: 23, text: 'Balefi Ga. Pa.' },
        { id: 253, districtId: 23, text: 'Barhabise Na. Pa.' },
        { id: 254, districtId: 23, text: 'Bhotekoshi Ga. Pa.' },
        { id: 255, districtId: 23, text: 'Chautara SangachokGadhi Na. Pa.' },
        { id: 256, districtId: 23, text: 'Helambu Ga. Pa.' },
        { id: 257, districtId: 23, text: 'Indrawati Ga. Pa.' },
        { id: 258, districtId: 23, text: 'Jugal Ga. Pa.' },
        { id: 259, districtId: 23, text: 'Lisangkhu Pakhar Ga. Pa.' },
        { id: 260, districtId: 23, text: 'Melamchi Na. Pa.' },
        { id: 261, districtId: 23, text: 'Panchpokhari Thangpal Ga. Pa.' },
        { id: 262, districtId: 23, text: 'Sunkoshi Ga. Pa.' },
        { id: 263, districtId: 23, text: 'Tripurasundari Ga. Pa.' },
        { id: 264, districtId: 24, text: 'Banepa Na. Pa.' },
        { id: 265, districtId: 24, text: 'Bethanchowk Ga. Pa.' },
        { id: 266, districtId: 24, text: 'Bhumlu Ga. Pa.' },
        { id: 267, districtId: 24, text: 'Chaurideurali Ga. Pa.' },
        { id: 268, districtId: 24, text: 'Dhulikhel Na. Pa.' },
        { id: 269, districtId: 24, text: 'Khanikhola Ga. Pa.' },
        { id: 270, districtId: 24, text: 'Mahabharat Ga. Pa.' },
        { id: 271, districtId: 24, text: 'Mandandeupur Na. Pa.' },
        { id: 272, districtId: 24, text: 'Namobuddha Na. Pa.' },
        { id: 273, districtId: 24, text: 'Panauti Na. Pa.' },
        { id: 274, districtId: 24, text: 'Panchkhal Na. Pa.' },
        { id: 275, districtId: 24, text: 'Roshi Ga. Pa.' },
        { id: 276, districtId: 24, text: 'Temal Ga. Pa.' },
        { id: 277, districtId: 25, text: 'Bagmati Ga. Pa.' },
        { id: 278, districtId: 25, text: 'Godawari Na. Pa.' },
        { id: 279, districtId: 25, text: 'Konjyosom Ga. Pa.' },
        { id: 280, districtId: 25, text: 'Lalitpur Ma. Na. Pa.' },
        { id: 281, districtId: 25, text: 'Mahalaxmi Na. Pa.' },
        { id: 282, districtId: 25, text: 'Mahankal Ga. Pa.' },
        { id: 283, districtId: 26, text: 'Bhaktapur Na. Pa.' },
        { id: 284, districtId: 26, text: 'Changunarayan Na. Pa.' },
        { id: 285, districtId: 26, text: 'Madhyapur Thimi Na. Pa.' },
        { id: 286, districtId: 26, text: 'Suryabinayak Na. Pa.' },
        { id: 287, districtId: 27, text: 'Budhanilakantha Na. Pa.' },
        { id: 288, districtId: 27, text: 'Chandragiri Na. Pa.' },
        { id: 289, districtId: 27, text: 'Dakshinkali Na. Pa.' },
        { id: 290, districtId: 27, text: 'Gokarneshwor Na. Pa.' },
        { id: 291, districtId: 27, text: 'Kageshwori Manahora Na. Pa.' },
        { id: 292, districtId: 27, text: 'Kathmandu Ma. Na. Pa.' },
        { id: 293, districtId: 27, text: 'Kirtipur Na. Pa.' },
        { id: 294, districtId: 27, text: 'Nagarjun Na. Pa.' },
        { id: 295, districtId: 27, text: 'Shankharapur Na. Pa.' },
        { id: 296, districtId: 27, text: 'Tarakeshwor Na. Pa.' },
        { id: 297, districtId: 27, text: 'Tokha Na. Pa.' },
        { id: 298, districtId: 28, text: 'Belkotgadhi Na. Pa.' },
        { id: 299, districtId: 28, text: 'Bidur Na. Pa.' },
        { id: 300, districtId: 28, text: 'Dupcheshwar Ga. Pa.' },
        { id: 301, districtId: 28, text: 'Kakani Ga. Pa.' },
        { id: 302, districtId: 28, text: 'Kispang Ga. Pa.' },
        { id: 303, districtId: 28, text: 'Likhu Ga. Pa.' },
        { id: 304, districtId: 28, text: 'Meghang Ga. Pa.' },
        { id: 305, districtId: 28, text: 'Panchakanya Ga. Pa.' },
        { id: 306, districtId: 28, text: 'Shivapuri Ga. Pa.' },
        { id: 307, districtId: 28, text: 'Suryagadhi Ga. Pa.' },
        { id: 308, districtId: 28, text: 'Tadi Ga. Pa.' },
        { id: 309, districtId: 28, text: 'Tarkeshwar Ga. Pa.' },
        { id: 310, districtId: 29, text: 'Gosaikunda Ga. Pa.' },
        { id: 311, districtId: 29, text: 'Kalika Ga. Pa.' },
        { id: 312, districtId: 29, text: 'Naukunda Ga. Pa.' },
        { id: 313, districtId: 29, text: 'Parbati Kunda Ga. Pa.' },
        { id: 314, districtId: 29, text: 'Uttargaya Ga. Pa.' },
        { id: 315, districtId: 30, text: 'Benighat Rorang Ga. Pa.' },
        { id: 316, districtId: 30, text: 'Dhunibesi Na. Pa.' },
        { id: 317, districtId: 30, text: 'Gajuri Ga. Pa.' },
        { id: 318, districtId: 30, text: 'Galchi Ga. Pa.' },
        { id: 319, districtId: 30, text: 'Gangajamuna Ga. Pa.' },
        { id: 320, districtId: 30, text: 'Jwalamukhi Ga. Pa.' },
        { id: 321, districtId: 30, text: 'Khaniyabash Ga. Pa.' },
        { id: 322, districtId: 30, text: 'Netrawati Dabjong Ga. Pa.' },
        { id: 323, districtId: 30, text: 'Nilakantha Na. Pa.' },
        { id: 324, districtId: 30, text: 'Rubi Valley Ga. Pa.' },
        { id: 325, districtId: 30, text: 'Siddhalek Ga. Pa.' },
        { id: 326, districtId: 30, text: 'Thakre Ga. Pa.' },
        { id: 327, districtId: 30, text: 'Tripura Sundari Ga. Pa.' },
        { id: 328, districtId: 31, text: 'Bagmati Ga. Pa.' },
        { id: 329, districtId: 31, text: 'Bakaiya Ga. Pa.' },
        { id: 330, districtId: 31, text: 'Bhimphedi Ga. Pa.' },
        { id: 331, districtId: 31, text: 'Hetauda Up. Ma. Na. Pa.' },
        { id: 332, districtId: 31, text: 'Indrasarowar Ga. Pa.' },
        { id: 333, districtId: 31, text: 'Kailash Ga. Pa.' },
        { id: 334, districtId: 31, text: 'Makawanpurgadhi Ga. Pa.' },
        { id: 335, districtId: 31, text: 'Manahari Ga. Pa.' },
        { id: 336, districtId: 31, text: 'Raksirang Ga. Pa.' },
        { id: 337, districtId: 31, text: 'Thaha Na. Pa.' },
        { id: 338, districtId: 32, text: 'Baudhimai Na. Pa.' },
        { id: 339, districtId: 32, text: 'Brindaban Na. Pa.' },
        { id: 340, districtId: 32, text: 'Chandrapur Na. Pa.' },
        { id: 341, districtId: 32, text: 'Dewahhi Gonahi Na. Pa.' },
        { id: 342, districtId: 32, text: 'Durga Bhagwati Ga. Pa.' },
        { id: 343, districtId: 32, text: 'Gadhimai Na. Pa.' },
        { id: 344, districtId: 32, text: 'Garuda Na. Pa.' },
        { id: 345, districtId: 32, text: 'Gaur Na. Pa.' },
        { id: 346, districtId: 32, text: 'Gujara Na. Pa.' },
        { id: 347, districtId: 32, text: 'Ishanath Na. Pa.' },
        { id: 348, districtId: 32, text: 'Katahariya Na. Pa.' },
        { id: 349, districtId: 32, text: 'Madhav Narayan Na. Pa.' },
        { id: 350, districtId: 32, text: 'Maulapur Na. Pa.' },
        { id: 351, districtId: 32, text: 'Paroha Na. Pa.' },
        { id: 352, districtId: 32, text: 'Phatuwa Bijayapur Na. Pa.' },
        { id: 353, districtId: 32, text: 'Rajdevi Na. Pa.' },
        { id: 354, districtId: 32, text: 'Rajpur Na. Pa.' },
        { id: 355, districtId: 32, text: 'Yemunamai Ga. Pa.' },
        { id: 356, districtId: 33, text: 'Adarshkotwal Ga. Pa.' },
        { id: 357, districtId: 33, text: 'Baragadhi Ga. Pa.' },
        { id: 358, districtId: 33, text: 'Bishrampur Ga. Pa.' },
        { id: 359, districtId: 33, text: 'Devtal Ga. Pa.' },
        { id: 360, districtId: 33, text: 'Jitpur Simara Up. Ma. Na. Pa.' },
        { id: 361, districtId: 33, text: 'Kalaiya Up. Ma. Na. Pa.' },
        { id: 362, districtId: 33, text: 'Karaiyamai Ga. Pa.' },
        { id: 363, districtId: 33, text: 'Kolhabi Na. Pa.' },
        { id: 364, districtId: 33, text: 'Mahagadhimai Na. Pa.' },
        { id: 365, districtId: 33, text: 'Nijgadh Na. Pa.' },
        { id: 366, districtId: 33, text: 'Pacharauta Na. Pa.' },
        { id: 367, districtId: 33, text: 'Parwanipur Ga. Pa.' },
        { id: 368, districtId: 33, text: 'Pheta Ga. Pa.' },
        { id: 369, districtId: 33, text: 'Prasauni Ga. Pa.' },
        { id: 370, districtId: 33, text: 'Simraungadh Na. Pa.' },
        { id: 371, districtId: 33, text: 'Suwarna Ga. Pa.' },
        { id: 372, districtId: 34, text: 'Bahudaramai Na. Pa.' },
        { id: 373, districtId: 34, text: 'Bindabasini Ga. Pa.' },
        { id: 374, districtId: 34, text: 'Birgunj Ma. Na. Pa.' },
        { id: 375, districtId: 34, text: 'Chhipaharmai Ga. Pa.' },
        { id: 376, districtId: 34, text: 'Dhobini Ga. Pa.' },
        { id: 377, districtId: 34, text: 'Jagarnathpur Ga. Pa.' },
        { id: 378, districtId: 34, text: 'Jirabhawani Ga. Pa.' },
        { id: 379, districtId: 34, text: 'Kalikamai Ga. Pa.' },
        { id: 380, districtId: 34, text: 'Pakahamainpur Ga. Pa.' },
        { id: 381, districtId: 34, text: 'Parsagadhi Na. Pa.' },
        { id: 382, districtId: 34, text: 'Paterwasugauli Ga. Pa.' },
        { id: 383, districtId: 34, text: 'Pokhariya Na. Pa.' },
        { id: 384, districtId: 34, text: 'SakhuwaPrasauni Ga. Pa.' },
        { id: 385, districtId: 34, text: 'Thori Ga. Pa.' },
        { id: 386, districtId: 35, text: 'Bharatpur Ma. Na. Pa.' },
        { id: 387, districtId: 35, text: 'Ichchhyakamana Ga. Pa.' },
        { id: 388, districtId: 35, text: 'Kalika Na. Pa.' },
        { id: 389, districtId: 35, text: 'Khairahani Na. Pa.' },
        { id: 390, districtId: 35, text: 'Madi Na. Pa.' },
        { id: 391, districtId: 35, text: 'Rapti Na. Pa.' },
        { id: 392, districtId: 35, text: 'Ratnanagar Na. Pa.' },
        { id: 393, districtId: 36, text: 'Aarughat Ga. Pa.' },
        { id: 394, districtId: 36, text: 'Ajirkot Ga. Pa.' },
        { id: 395, districtId: 36, text: 'Bhimsen Ga. Pa.' },
        { id: 396, districtId: 36, text: 'Chum Nubri Ga. Pa.' },
        { id: 397, districtId: 36, text: 'Dharche Ga. Pa.' },
        { id: 398, districtId: 36, text: 'Gandaki Ga. Pa.' },
        { id: 399, districtId: 36, text: 'Gorkha Na. Pa.' },
        { id: 400, districtId: 36, text: 'Palungtar Na. Pa.' },
        { id: 401, districtId: 36, text: 'Sahid Lakhan Ga. Pa.' },
        { id: 402, districtId: 36, text: 'Siranchok Ga. Pa.' },
        { id: 403, districtId: 36, text: 'Sulikot Ga. Pa.' },
        { id: 404, districtId: 37, text: 'Besishahar Na. Pa.' },
        { id: 405, districtId: 37, text: 'Dordi Ga. Pa.' },
        { id: 406, districtId: 37, text: 'Dudhpokhari Ga. Pa.' },
        { id: 407, districtId: 37, text: 'Kwholasothar Ga. Pa.' },
        { id: 408, districtId: 37, text: 'MadhyaNepal Na. Pa.' },
        { id: 409, districtId: 37, text: 'Marsyangdi Ga. Pa.' },
        { id: 410, districtId: 37, text: 'Rainas Na. Pa.' },
        { id: 411, districtId: 37, text: 'Sundarbazar Na. Pa.' },
        { id: 412, districtId: 38, text: 'Anbukhaireni Ga. Pa.' },
        { id: 413, districtId: 38, text: 'Bandipur Ga. Pa.' },
        { id: 414, districtId: 38, text: 'Bhanu Na. Pa.' },
        { id: 415, districtId: 38, text: 'Bhimad Na. Pa.' },
        { id: 416, districtId: 38, text: 'Byas Na. Pa.' },
        { id: 417, districtId: 38, text: 'Devghat Ga. Pa.' },
        { id: 418, districtId: 38, text: 'Ghiring Ga. Pa.' },
        { id: 419, districtId: 38, text: 'Myagde Ga. Pa.' },
        { id: 420, districtId: 38, text: 'Rhishing Ga. Pa.' },
        { id: 421, districtId: 38, text: 'Shuklagandaki Na. Pa.' },
        { id: 422, districtId: 39, text: 'Aandhikhola Ga. Pa.' },
        { id: 423, districtId: 39, text: 'Arjunchaupari Ga. Pa.' },
        { id: 424, districtId: 39, text: 'Bhirkot Na. Pa.' },
        { id: 425, districtId: 39, text: 'Biruwa Ga. Pa.' },
        { id: 426, districtId: 39, text: 'Chapakot Na. Pa.' },
        { id: 427, districtId: 39, text: 'Galyang Na. Pa.' },
        { id: 428, districtId: 39, text: 'Harinas Ga. Pa.' },
        { id: 429, districtId: 39, text: 'Kaligandagi Ga. Pa.' },
        { id: 430, districtId: 39, text: 'Phedikhola Ga. Pa.' },
        { id: 431, districtId: 39, text: 'Putalibazar Na. Pa.' },
        { id: 432, districtId: 39, text: 'Waling Na. Pa.' },
        { id: 433, districtId: 40, text: 'Annapurna Ga. Pa.' },
        { id: 434, districtId: 40, text: 'Machhapuchchhre Ga. Pa.' },
        { id: 435, districtId: 40, text: 'Madi Ga. Pa.' },
        { id: 436, districtId: 40, text: 'Pokhara Lekhnath Ma. Na. Pa.' },
        { id: 437, districtId: 40, text: 'Rupa Ga. Pa.' },
        { id: 438, districtId: 41, text: 'Chame Ga. Pa.' },
        { id: 439, districtId: 41, text: 'Narphu Ga. Pa.' },
        { id: 440, districtId: 41, text: 'Nashong Ga. Pa.' },
        { id: 441, districtId: 41, text: 'Neshyang Ga. Pa.' },
        { id: 442, districtId: 42, text: 'Barhagaun Muktikhsetra Ga. Pa.' },
        { id: 443, districtId: 42, text: 'Dalome Ga. Pa.' },
        { id: 444, districtId: 42, text: 'Gharapjhong Ga. Pa.' },
        { id: 445, districtId: 42, text: 'Lomanthang Ga. Pa.' },
        { id: 446, districtId: 42, text: 'Thasang Ga. Pa.' },
        { id: 447, districtId: 43, text: 'Bihadi Ga. Pa.' },
        { id: 448, districtId: 43, text: 'Jaljala Ga. Pa.' },
        { id: 449, districtId: 43, text: 'Kushma Na. Pa.' },
        { id: 450, districtId: 43, text: 'Mahashila Ga. Pa.' },
        { id: 451, districtId: 43, text: 'Modi Ga. Pa.' },
        { id: 452, districtId: 43, text: 'Painyu Ga. Pa.' },
        { id: 453, districtId: 43, text: 'Phalebas Na. Pa.' },
        { id: 454, districtId: 44, text: 'Annapurna Ga. Pa.' },
        { id: 455, districtId: 44, text: 'Beni Na. Pa.' },
        { id: 456, districtId: 44, text: 'Dhaulagiri Ga. Pa.' },
        { id: 457, districtId: 44, text: 'Malika Ga. Pa.' },
        { id: 458, districtId: 44, text: 'Mangala Ga. Pa.' },
        { id: 459, districtId: 44, text: 'Raghuganga Ga. Pa.' },
        { id: 460, districtId: 45, text: 'Badigad Ga. Pa.' },
        { id: 461, districtId: 45, text: 'Baglung Na. Pa.' },
        { id: 462, districtId: 45, text: 'Bareng Ga. Pa.' },
        { id: 463, districtId: 45, text: 'Dhorpatan Na. Pa.' },
        { id: 464, districtId: 45, text: 'Galkot Na. Pa.' },
        { id: 465, districtId: 45, text: 'Jaimuni Na. Pa.' },
        { id: 466, districtId: 45, text: 'Kanthekhola Ga. Pa.' },
        { id: 467, districtId: 45, text: 'Nisikhola Ga. Pa.' },
        { id: 468, districtId: 45, text: 'Taman Khola Ga. Pa.' },
        { id: 469, districtId: 45, text: 'Tara Khola Ga. Pa.' },
        { id: 470, districtId: 46, text: 'Chandrakot Ga. Pa.' },
        { id: 471, districtId: 46, text: 'Chatrakot Ga. Pa.' },
        { id: 472, districtId: 46, text: 'Dhurkot Ga. Pa.' },
        { id: 473, districtId: 46, text: 'Gulmidarbar Ga. Pa.' },
        { id: 474, districtId: 46, text: 'Isma Ga. Pa.' },
        { id: 475, districtId: 46, text: 'Kaligandaki Ga. Pa.' },
        { id: 476, districtId: 46, text: 'Madane Ga. Pa.' },
        { id: 477, districtId: 46, text: 'Malika Ga. Pa.' },
        { id: 478, districtId: 46, text: 'Musikot Na. Pa.' },
        { id: 479, districtId: 46, text: 'Resunga Na. Pa.' },
        { id: 480, districtId: 46, text: 'Ruru Ga. Pa.' },
        { id: 481, districtId: 46, text: 'Satyawati Ga. Pa.' },
        { id: 482, districtId: 47, text: 'Bagnaskali Ga. Pa.' },
        { id: 483, districtId: 47, text: 'Mathagadhi Ga. Pa.' },
        { id: 484, districtId: 47, text: 'Nisdi Ga. Pa.' },
        { id: 485, districtId: 47, text: 'Purbakhola Ga. Pa.' },
        { id: 486, districtId: 47, text: 'Rainadevi Chhahara Ga. Pa.' },
        { id: 487, districtId: 47, text: 'Rambha Ga. Pa.' },
        { id: 488, districtId: 47, text: 'Rampur Na. Pa.' },
        { id: 489, districtId: 47, text: 'Ribdikot Ga. Pa.' },
        { id: 490, districtId: 47, text: 'Tansen Na. Pa.' },
        { id: 491, districtId: 47, text: 'Tinau Ga. Pa.' },

        { id: 492, districtId: 49, text: 'Bardaghat Na. Pa.' },
        { id: 493, districtId: 49, text: 'Palhi Nandan Ga. Pa.' },
        { id: 494, districtId: 49, text: 'Pratappur Ga. Pa.' },
        { id: 495, districtId: 49, text: 'Ramgram Na. Pa.' },
        { id: 496, districtId: 49, text: 'Sarawal Ga. Pa.' },
        { id: 497, districtId: 49, text: 'Sunwal Na. Pa.' },
        { id: 498, districtId: 49, text: 'Susta Ga. Pa.' },

        { id: 499, districtId: 48, text: 'Binayee Tribeni Ga. Pa.' },
        { id: 500, districtId: 48, text: 'Bulingtar Ga. Pa.' },
        { id: 501, districtId: 48, text: 'Bungdikali Ga. Pa.' },
        { id: 502, districtId: 48, text: 'Devchuli Na. Pa.' },
        { id: 503, districtId: 48, text: 'Gaidakot Na. Pa.' },
        { id: 504, districtId: 48, text: 'Hupsekot Ga. Pa.' },
        { id: 505, districtId: 48, text: 'Kawasoti Na. Pa.' },
        { id: 506, districtId: 48, text: 'Madhyabindu Na. Pa.' },


        { id: 507, districtId: 50, text: 'Butwal Up. Ma. Na. Pa.' },
        { id: 508, districtId: 50, text: 'Devdaha Na. Pa.' },
        { id: 509, districtId: 50, text: 'Gaidahawa Ga. Pa.' },
        { id: 510, districtId: 50, text: 'Kanchan Ga. Pa.' },
        { id: 511, districtId: 50, text: 'Kotahimai Ga. Pa.' },
        { id: 512, districtId: 50, text: 'Lumbini Sanskritik Na. Pa.' },
        { id: 513, districtId: 50, text: 'Marchawari Ga. Pa.' },
        { id: 514, districtId: 50, text: 'Mayadevi Ga. Pa.' },
        { id: 515, districtId: 50, text: 'Omsatiya Ga. Pa.' },
        { id: 516, districtId: 50, text: 'Rohini Ga. Pa.' },
        { id: 517, districtId: 50, text: 'Sainamaina Na. Pa.' },
        { id: 518, districtId: 50, text: 'Sammarimai Ga. Pa.' },
        { id: 519, districtId: 50, text: 'Siddharthanagar Na. Pa.' },
        { id: 520, districtId: 50, text: 'Siyari Ga. Pa.' },
        { id: 521, districtId: 50, text: 'Sudhdhodhan Ga. Pa.' },
        { id: 522, districtId: 50, text: 'Tillotama Na. Pa.' },
        { id: 523, districtId: 51, text: 'Bhumekasthan Na. Pa.' },
        { id: 524, districtId: 51, text: 'Chhatradev Ga. Pa.' },
        { id: 525, districtId: 51, text: 'Malarani Ga. Pa.' },
        { id: 526, districtId: 51, text: 'Panini Ga. Pa.' },
        { id: 527, districtId: 51, text: 'Sandhikharka Na. Pa.' },
        { id: 528, districtId: 51, text: 'Sitganga Na. Pa.' },
        { id: 529, districtId: 52, text: 'Banganga Na. Pa.' },
        { id: 530, districtId: 52, text: 'Bijayanagar Ga. Pa.' },
        { id: 531, districtId: 52, text: 'Buddhabhumi Na. Pa.' },
        { id: 532, districtId: 52, text: 'Kapilbastu Na. Pa.' },
        { id: 533, districtId: 52, text: 'Krishnanagar Na. Pa.' },
        { id: 534, districtId: 52, text: 'Maharajgunj Na. Pa.' },
        { id: 535, districtId: 52, text: 'Mayadevi Ga. Pa.' },
        { id: 536, districtId: 52, text: 'Shivaraj Na. Pa.' },
        { id: 537, districtId: 52, text: 'Suddhodhan Ga. Pa.' },
        { id: 538, districtId: 52, text: 'Yashodhara Ga. Pa.' },
        { id: 539, districtId: 53, text: 'Ayirabati Ga. Pa.' },
        { id: 540, districtId: 53, text: 'Gaumukhi Ga. Pa.' },
        { id: 541, districtId: 53, text: 'Jhimruk Ga. Pa.' },
        { id: 542, districtId: 53, text: 'Mallarani Ga. Pa.' },
        { id: 543, districtId: 53, text: 'Mandavi Ga. Pa.' },
        { id: 544, districtId: 53, text: 'Naubahini Ga. Pa.' },
        { id: 545, districtId: 53, text: 'Pyuthan Na. Pa.' },
        { id: 546, districtId: 53, text: 'Sarumarani Ga. Pa.' },
        { id: 547, districtId: 53, text: 'Sworgadwary Na. Pa.' },
        { id: 548, districtId: 54, text: 'Duikholi Ga. Pa.' },
        { id: 549, districtId: 54, text: 'Lungri Ga. Pa.' },
        { id: 550, districtId: 54, text: 'Madi Ga. Pa.' },
        { id: 551, districtId: 54, text: 'Rolpa Na. Pa.' },
        { id: 552, districtId: 54, text: 'Runtigadi Ga. Pa.' },
        { id: 553, districtId: 54, text: 'Sukidaha Ga. Pa.' },
        { id: 554, districtId: 54, text: 'Sunchhahari Ga. Pa.' },
        { id: 555, districtId: 54, text: 'Suwarnabati Ga. Pa.' },
        { id: 556, districtId: 54, text: 'Thawang Ga. Pa.' },
        { id: 557, districtId: 54, text: 'Tribeni Ga. Pa.' },

        { id: 558, districtId: 56, text: 'Aathbiskot Na. Pa.' },
        { id: 559, districtId: 56, text: 'Banfikot Ga. Pa.' },
        { id: 560, districtId: 56, text: 'Chaurjahari Na. Pa.' },
        { id: 561, districtId: 56, text: 'Musikot Na. Pa.' },
        { id: 562, districtId: 56, text: 'Sani Bheri Ga. Pa.' },
        { id: 563, districtId: 56, text: 'Tribeni Ga. Pa.' },

        { id: 564, districtId: 55, text: 'Bhume Ga. Pa.' },
        { id: 565, districtId: 55, text: 'Putha Uttarganga Ga. Pa.' },
        { id: 566, districtId: 55, text: 'Sisne Ga. Pa.' },

        { id: 567, districtId: 57, text: 'Bagchaur Na. Pa.' },
        { id: 568, districtId: 57, text: 'Bangad Kupinde Na. Pa.' },
        { id: 569, districtId: 57, text: 'Chhatreshwori Ga. Pa.' },
        { id: 570, districtId: 57, text: 'Darma Ga. Pa.' },
        { id: 571, districtId: 57, text: 'Dhorchaur Ga. Pa.' },
        { id: 572, districtId: 57, text: 'Kalimati Ga. Pa.' },
        { id: 573, districtId: 57, text: 'Kapurkot Ga. Pa.' },
        { id: 574, districtId: 57, text: 'Kumakhmalika Ga. Pa.' },
        { id: 575, districtId: 57, text: 'Sharada Na. Pa.' },
        { id: 576, districtId: 57, text: 'Tribeni Ga. Pa.' },
        { id: 577, districtId: 58, text: 'Babai Ga. Pa.' },
        { id: 578, districtId: 58, text: 'Banglachuli Ga. Pa.' },
        { id: 579, districtId: 58, text: 'Dangisharan Ga. Pa.' },
        { id: 580, districtId: 58, text: 'Gadhawa Ga. Pa.' },
        { id: 581, districtId: 58, text: 'Ghorahi Up. Ma. Na. Pa.' },
        { id: 582, districtId: 58, text: 'Lamahi Na. Pa.' },
        { id: 583, districtId: 58, text: 'Rajpur Ga. Pa.' },
        { id: 584, districtId: 58, text: 'Rapti Ga. Pa.' },
        { id: 585, districtId: 58, text: 'Shantinagar Ga. Pa.' },
        { id: 586, districtId: 58, text: 'Tulsipur Up. Ma. Na. Pa.' },
        { id: 587, districtId: 59, text: 'Badhaiyatal Ga. Pa.' },
        { id: 588, districtId: 59, text: 'Bansagadhi Na. Pa.' },
        { id: 589, districtId: 59, text: 'Barbardiya Na. Pa.' },
        { id: 590, districtId: 59, text: 'Geruwa Ga. Pa.' },
        { id: 591, districtId: 59, text: 'Gulariya Na. Pa.' },
        { id: 592, districtId: 59, text: 'Madhuwan Na. Pa.' },
        { id: 593, districtId: 59, text: 'Rajapur Na. Pa.' },
        { id: 594, districtId: 59, text: 'Thakurbaba Na. Pa.' },
        { id: 595, districtId: 60, text: 'Barahtal Ga. Pa.' },
        { id: 596, districtId: 60, text: 'Bheriganga Na. Pa.' },
        { id: 597, districtId: 60, text: 'Birendranagar Na. Pa.' },
        { id: 598, districtId: 60, text: 'Chaukune Ga. Pa.' },
        { id: 599, districtId: 60, text: 'Chingad Ga. Pa.' },
        { id: 600, districtId: 60, text: 'Gurbhakot Na. Pa.' },
        { id: 601, districtId: 60, text: 'Lekbeshi Na. Pa.' },
        { id: 602, districtId: 60, text: 'Panchpuri Na. Pa.' },
        { id: 603, districtId: 60, text: 'Simta Ga. Pa.' },
        { id: 604, districtId: 61, text: 'Aathabis Na. Pa.' },
        { id: 605, districtId: 61, text: 'Bhagawatimai Ga. Pa.' },
        { id: 606, districtId: 61, text: 'Bhairabi Ga. Pa.' },
        { id: 607, districtId: 61, text: 'Chamunda Bindrasaini Na. Pa.' },
        { id: 608, districtId: 61, text: 'Dullu Na. Pa.' },
        { id: 609, districtId: 61, text: 'Dungeshwor Ga. Pa.' },
        { id: 610, districtId: 61, text: 'Gurans Ga. Pa.' },
        { id: 611, districtId: 61, text: 'Mahabu Ga. Pa.' },
        { id: 612, districtId: 61, text: 'Narayan Na. Pa.' },
        { id: 613, districtId: 61, text: 'Naumule Ga. Pa.' },
        { id: 614, districtId: 61, text: 'Thantikandh Ga. Pa.' },
        { id: 615, districtId: 62, text: 'Baijanath Ga. Pa.' },
        { id: 616, districtId: 62, text: 'Duduwa Ga. Pa.' },
        { id: 617, districtId: 62, text: 'Janki Ga. Pa.' },
        { id: 618, districtId: 62, text: 'Khajura Ga. Pa.' },
        { id: 619, districtId: 62, text: 'Kohalpur Na. Pa.' },
        { id: 620, districtId: 62, text: 'Narainapur Ga. Pa.' },
        { id: 621, districtId: 62, text: 'Nepalgunj Up. Ma. Na. Pa.' },
        { id: 622, districtId: 62, text: 'Rapti Sonari Ga. Pa.' },
        { id: 623, districtId: 63, text: 'Barekot Ga. Pa.' },
        { id: 624, districtId: 63, text: 'Bheri Na. Pa.' },
        { id: 625, districtId: 63, text: 'Chhedagad Na. Pa.' },
        { id: 626, districtId: 63, text: 'Junichande Ga. Pa.' },
        { id: 627, districtId: 63, text: 'Kuse Ga. Pa.' },
        { id: 628, districtId: 63, text: 'Shiwalaya Ga. Pa.' },
        { id: 629, districtId: 63, text: 'Tribeni Nalagad Na. Pa.' },
        { id: 630, districtId: 64, text: 'Chharka Tangsong Ga. Pa.' },
        { id: 631, districtId: 64, text: 'Dolpo Buddha Ga. Pa.' },
        { id: 632, districtId: 64, text: 'Jagadulla Ga. Pa.' },
        { id: 633, districtId: 64, text: 'Kaike Ga. Pa.' },
        { id: 634, districtId: 64, text: 'Mudkechula Ga. Pa.' },
        { id: 635, districtId: 64, text: 'Shey Phoksundo Ga. Pa.' },
        { id: 636, districtId: 64, text: 'Thuli Bheri Na. Pa.' },
        { id: 637, districtId: 64, text: 'Tripurasundari Na. Pa.' },
        { id: 638, districtId: 65, text: 'Adanchuli Ga. Pa.' },
        { id: 639, districtId: 65, text: 'Chankheli Ga. Pa.' },
        { id: 640, districtId: 65, text: 'Kharpunath Ga. Pa.' },
        { id: 641, districtId: 65, text: 'Namkha Ga. Pa.' },
        { id: 642, districtId: 65, text: 'Sarkegad Ga. Pa.' },
        { id: 643, districtId: 65, text: 'Simkot Ga. Pa.' },
        { id: 644, districtId: 65, text: 'Tanjakot Ga. Pa.' },
        { id: 645, districtId: 66, text: 'Subh Kalika Ga. Pa.' },
        { id: 646, districtId: 66, text: 'Khandachakra Na. Pa.' },
        { id: 647, districtId: 66, text: 'Mahawai Ga. Pa.' },
        { id: 648, districtId: 66, text: 'Naraharinath Ga. Pa.' },
        { id: 649, districtId: 66, text: 'Pachaljharana Ga. Pa.' },
        { id: 650, districtId: 66, text: 'Palata Ga. Pa.' },
        { id: 651, districtId: 66, text: 'Raskot Na. Pa.' },
        { id: 652, districtId: 66, text: 'Sanni Tribeni Ga. Pa.' },
        { id: 653, districtId: 66, text: 'Tilagufa Na. Pa.' },
        { id: 654, districtId: 67, text: 'Chhayanath Rara Na. Pa.' },
        { id: 655, districtId: 67, text: 'Khatyad Ga. Pa.' },
        { id: 656, districtId: 67, text: 'Mugum Karmarong Ga. Pa.' },
        { id: 657, districtId: 67, text: 'Soru Ga. Pa.' },
        { id: 658, districtId: 68, text: 'Chandannath Na. Pa.' },
        { id: 659, districtId: 68, text: 'Guthichaur Ga. Pa.' },
        { id: 660, districtId: 68, text: 'Hima Ga. Pa.' },
        { id: 661, districtId: 68, text: 'Kanakasundari Ga. Pa.' },
        { id: 662, districtId: 68, text: 'Patrasi Ga. Pa.' },
        { id: 663, districtId: 68, text: 'Sinja Ga. Pa.' },
        { id: 664, districtId: 68, text: 'Tatopani Ga. Pa.' },
        { id: 665, districtId: 68, text: 'Tila Ga. Pa.' },
        { id: 666, districtId: 69, text: 'Badimalika Na. Pa.' },
        { id: 667, districtId: 69, text: 'Budhiganga Na. Pa.' },
        { id: 668, districtId: 69, text: 'Budhinanda Na. Pa.' },
        { id: 669, districtId: 69, text: 'Chhededaha Ga. Pa.' },
        { id: 670, districtId: 69, text: 'Gaumul Ga. Pa.' },
        { id: 671, districtId: 69, text: 'Himali Ga. Pa.' },
        { id: 672, districtId: 69, text: 'Pandav Gupha Ga. Pa.' },
        { id: 673, districtId: 69, text: 'Swami Kartik Ga. Pa.' },
        { id: 674, districtId: 69, text: 'Tribeni Na. Pa.' },
        { id: 675, districtId: 70, text: 'Bithadchir Ga. Pa.' },
        { id: 676, districtId: 70, text: 'Bungal Na. Pa.' },
        { id: 677, districtId: 70, text: 'Chabispathivera Ga. Pa.' },
        { id: 678, districtId: 70, text: 'Durgathali Ga. Pa.' },
        { id: 679, districtId: 70, text: 'JayaPrithivi Na. Pa.' },
        { id: 680, districtId: 70, text: 'Kanda Ga. Pa.' },
        { id: 681, districtId: 70, text: 'Kedarseu Ga. Pa.' },
        { id: 682, districtId: 70, text: 'Khaptadchhanna Ga. Pa.' },
        { id: 683, districtId: 70, text: 'Masta Ga. Pa.' },
        { id: 684, districtId: 70, text: 'Surma Ga. Pa.' },
        { id: 685, districtId: 70, text: 'Talkot Ga. Pa.' },
        { id: 686, districtId: 70, text: 'Thalara Ga. Pa.' },
        { id: 687, districtId: 71, text: 'Bannigadhi Jayagadh Ga. Pa.' },
        { id: 688, districtId: 71, text: 'Chaurpati Ga. Pa.' },
        { id: 689, districtId: 71, text: 'Dhakari Ga. Pa.' },
        { id: 690, districtId: 71, text: 'Kamalbazar Na. Pa.' },
        { id: 691, districtId: 71, text: 'Mangalsen Na. Pa.' },
        { id: 692, districtId: 71, text: 'Mellekh Ga. Pa.' },
        { id: 693, districtId: 71, text: 'Panchadewal Binayak Na. Pa.' },
        { id: 694, districtId: 71, text: 'Ramaroshan Ga. Pa.' },
        { id: 695, districtId: 71, text: 'Sanphebagar Na. Pa.' },
        { id: 696, districtId: 71, text: 'Turmakhad Ga. Pa.' },
        { id: 697, districtId: 72, text: 'Adharsha Ga. Pa.' },
        { id: 698, districtId: 72, text: 'Badikedar Ga. Pa.' },
        { id: 699, districtId: 72, text: 'Bogtan Ga. Pa.' },
        { id: 700, districtId: 72, text: 'Dipayal Silgadi Na. Pa.' },
        { id: 701, districtId: 72, text: 'Jorayal Ga. Pa.' },
        { id: 702, districtId: 72, text: 'K I Singh Ga. Pa.' },
        { id: 703, districtId: 72, text: 'Purbichauki Ga. Pa.' },
        { id: 704, districtId: 72, text: 'Sayal Ga. Pa.' },
        { id: 705, districtId: 72, text: 'Shikhar Na. Pa.' },
        { id: 706, districtId: 73, text: 'Bardagoriya Ga. Pa.' },
        { id: 707, districtId: 73, text: 'Bhajani Na. Pa.' },
        { id: 708, districtId: 73, text: 'Chure Ga. Pa.' },
        { id: 709, districtId: 73, text: 'Dhangadhi Up. Ma. Na. Pa.' },
        { id: 710, districtId: 73, text: 'Gauriganga Na. Pa.' },
        { id: 711, districtId: 73, text: 'Ghodaghodi Na. Pa.' },
        { id: 712, districtId: 73, text: 'Godawari Na. Pa.' },
        { id: 713, districtId: 73, text: 'Janaki Ga. Pa.' },
        { id: 714, districtId: 73, text: 'Joshipur Ga. Pa.' },
        { id: 715, districtId: 73, text: 'Kailari Ga. Pa.' },
        { id: 716, districtId: 73, text: 'Lamkichuha Na. Pa.' },
        { id: 717, districtId: 73, text: 'Mohanyal Ga. Pa.' },
        { id: 718, districtId: 73, text: 'Tikapur Na. Pa.' },
        { id: 719, districtId: 74, text: 'Bedkot Na. Pa.' },
        { id: 720, districtId: 74, text: 'Belauri Na. Pa.' },
        { id: 721, districtId: 74, text: 'Beldandi Ga. Pa.' },
        { id: 722, districtId: 74, text: 'Bhimdatta Na. Pa.' },
        { id: 723, districtId: 74, text: 'Krishnapur Na. Pa.' },
        { id: 724, districtId: 74, text: 'Laljhadi Ga. Pa.' },
        { id: 725, districtId: 74, text: 'Mahakali Na. Pa.' },
        { id: 726, districtId: 74, text: 'Punarbas Na. Pa.' },
        { id: 727, districtId: 74, text: 'Shuklaphanta Na. Pa.' },
        { id: 728, districtId: 75, text: 'Ajaymeru Ga. Pa.' },
        { id: 729, districtId: 75, text: 'Alital Ga. Pa.' },
        { id: 730, districtId: 75, text: 'Amargadhi Na. Pa.' },
        { id: 731, districtId: 75, text: 'Bhageshwar Ga. Pa.' },
        { id: 732, districtId: 75, text: 'Ganayapdhura Ga. Pa.' },
        { id: 733, districtId: 75, text: 'Nawadurga Ga. Pa.' },
        { id: 734, districtId: 75, text: 'Parashuram Na. Pa.' },
        { id: 735, districtId: 76, text: 'Dasharathchanda Na. Pa.' },
        { id: 736, districtId: 76, text: 'Dilasaini Ga. Pa.' },
        { id: 737, districtId: 76, text: 'Dogadakedar Ga. Pa.' },
        { id: 738, districtId: 76, text: 'Melauli Na. Pa.' },
        { id: 739, districtId: 76, text: 'Pancheshwar Ga. Pa.' },
        { id: 740, districtId: 76, text: 'Patan Na. Pa.' },
        { id: 741, districtId: 76, text: 'Purchaudi Na. Pa.' },
        { id: 742, districtId: 76, text: 'Shivanath Ga. Pa.' },
        { id: 743, districtId: 76, text: 'Sigas Ga. Pa.' },
        { id: 744, districtId: 76, text: 'Surnaya Ga. Pa.' },
        { id: 745, districtId: 77, text: 'Apihimal Ga. Pa.' },
        { id: 746, districtId: 77, text: 'Byas Ga. Pa.' },
        { id: 747, districtId: 77, text: 'Dunhu Ga. Pa.' },
        { id: 748, districtId: 77, text: 'Lekam Ga. Pa.' },
        { id: 749, districtId: 77, text: 'Mahakali Na. Pa.' },
        { id: 750, districtId: 77, text: 'Malikaarjun Ga. Pa.' },
        { id: 751, districtId: 77, text: 'Marma Ga. Pa.' },
        { id: 752, districtId: 77, text: 'Naugad Ga. Pa.' },
        { id: 753, districtId: 77, text: 'Shailyashikhar Na. Pa.' }
    ];
    return dataColl;
};


//Added by Suresh on 25 Shrawan
app.directive("allEmployee", ['$http', '$timeout', '$filter', function ($http, $timeout, $filter) {

    function link(scope, element, attrs, ngModel) {

        var placeholder = "** Select Employee **";
        var showDetails = false;

        if (attrs.placeholder)
            placeholder = attrs.placeholder;

        if (attrs.showdetails == true || attrs.showdetails == "true")
            showDetails = true;

        var onSelectChange = false;


        $(element).select2({
            placeholder: placeholder,
            allowClear: true,
            openOnEnter: true,
            width: '100%',
            multiple: false,
            minimumInputLength: 1,
            minimumResultsForSearch: 10,
            //triggerChange: true,
            ajax: {
                quietMillis: 300,
                url: base_url + "Global/GetAllEmployee",
                dataType: "json",
                type: "GET",
                data: function (params) {
                    var queryParameters =
                    {
                        Top: 10,
                        ColName: (scope.searchBy ? scope.searchBy : 'E.Name'),
                        Operator: "like",
                        ForTransaction: true,
                        OrderByCol: "E.Name",
                        ColValue: params.term
                    }
                    return queryParameters;
                },
                processResults: function (res) {
                    if (res.IsSuccess == false) {
                        alert(res.ResponseMSG);
                        return;
                    }

                    //return { results: data };
                    return {
                        results: $.map(res.Data, function (item) {
                            scope.employeeDetail = item;
                            ngModel.$setViewValue(item.EmployeeId);
                            return {
                                text: item.Name + ' - ' + item.Code + ' - ' + item.MobileNo,
                                id: item.EmployeeId,
                                data: item
                            }
                        })
                    };
                }
            },
            initSelection: function (element, callback) {
                onSelectChange = false;
                scope.$watch("model", function (newValue, oldValue) {
                    if (ngModel.$modelValue && onSelectChange == false && !scope.employeeDetail) {
                        var id = ngModel.$modelValue;

                        if (id != null && id !== "" && id > 0) {
                            var queryParameters = {
                                Top: 1,
                                ColName: "E.EmployeeId",
                                Operator: "=",
                                ForTransaction: true,
                                OrderByCol: "E.EmployeeId",
                                ColValue: id
                            };

                            return $.ajax(
                                base_url + "Global/GetAllEmployee",
                                {
                                    dataType: "json",
                                    type: "GET",
                                    data: queryParameters
                                }).done(function (res) {
                                    if (res.IsSuccess == false) {
                                        alert(res.ResponseMSG);
                                    }
                                    else if (res.Data.length > 0) {
                                        var item = res.Data[0];
                                        var tData =
                                        {
                                            text: item.Name + ' - ' + item.Code + ' - ' + item.MobileNo,
                                            id: item.EmployeeId,
                                            data: item
                                        }
                                        // viewWatch();

                                        callback(tData);
                                    } else
                                        alert("No Data Found on Load");

                                });
                        }
                    } else if (scope.employeeDetail) {

                        var item = scope.employeeDetail;
                        var tData =
                        {
                            text: item.Name + ' - ' + item.Code + ' - ' + item.MobileNo,
                            id: item.EmployeeId,
                            data: item
                        }
                        // viewWatch();

                        callback(tData);
                    }
                });


            }
        });


        $(element).on("select2:unselecting", function (e) {
            scope.employeeDetail = null;
            scope.sideBarData = [];
            ngModel.$setViewValue(null);
        });

        $(element).on("select2:open", function (e) {
            onSelectChange = true;
            $timeout(function () {
                scope.$apply(function () {

                    var selectedData = $(element).select2('data');
                    if (selectedData && selectedData.length > 0) {

                        if (!selectedData[0].data) {
                            scope.employeeDetail = null;
                            scope.sideBarData = [];
                            ngModel.$setViewValue(null);
                        }
                    }

                    scope.confirmAction();
                });
            });
            // alert("focus");
            //  $('#sidebarzz').toggleClass('active');
        });
        $(element).on("select2:close", function (e) {
            onSelectChange = false;

            //$('#sidebarzz').toggleClass('active');
        });
        $(element).on("change", function (e) {
            scope.sideBarData = [];
            onSelectChange = true;
            var selectedData = $(element).select2('data');

            if (selectedData && selectedData.length > 0) {
                var selectedEmployee = selectedData[0].data;
                ngModel.$setViewValue(selectedEmployee.EmployeeId);
                scope.employeeDetail = selectedEmployee;

                $timeout(function () {
                    scope.$apply(function () {
                        scope.confirmAction();
                    });
                });




            } else {

                scope.employeeDetail = null;
                scope.sideBarData = [];
                ngModel.$setViewValue(null);
            }

        });
    }
    return {
        require: 'ngModel',
        link: link,
        scope: {
            employeeDetail: '=?',
            sideBarData: '=',
            searchBy: '=',
            model: '=ngModel',
            confirmAction: '&'
        }
    };
}]);


app.filter('YesOrNo', function ($filter) {
    return function (num) {
        if (num == true)
            return "Yes";
        else
            return "No";
    }
});

app.directive('autoFocus', function ($timeout) {
    return {
        link: function (scope, element) {
            $timeout(function () {
                element[0].focus();
            }, 0);
        }
    };
});