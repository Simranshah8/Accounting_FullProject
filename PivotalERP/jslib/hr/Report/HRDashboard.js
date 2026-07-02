app.controller('HRDashbardController', function ($scope, $http, $timeout, $filter, $rootScope, GlobalServices) {
    $scope.Title = 'MktDashboard ';


    OnClickDefault();

    // ====================================
    // 🔹 Call only one main function on load
    // ====================================
    var gSrv = GlobalServices;
    $rootScope.ConfigFunction = function () {
        $scope.LoadData();
    };
    // ====================================
    // 🔹 Function to load all dashboard data
    // ====================================
    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            //GenderRatio
            GenderRatio: 1,

            //MaritalStatus
            MaritalStatus: 1,

            //StatusDistribution
            StatusDistribution: 1,

            //LeaveDetails
            LeaveReqst: 1,
            RejectedLeave: 1,
            ApprovedLeave: 1,
            PendingLeave: 1,

            //Transfers
            Transfers: 1,

            //Transfers
            Retirement: 1,

            //EmployeesOnLeave
            EmployeesonLeave: 1,

            //LatestEvent
            LatestEvent: 1,
        };

        $scope.searchData = {
            //GenderRatio
            GenderRatio: '',

            //MaritalStatus
            MaritalStatus: '',

            //StatusDistribution
            StatusDistribution: '',

            //LeaveDetails
            LeaveReqst: '',
            RejectedLeave: '',
            ApprovedLeave: '',
            PendingLeave: '',

            //Transfers
            Transfers: '',

            //Retirement
            Retirement: '',

            //EmployeesOnLeave
            EmployeesonLeave: '',

            //LatestEvent
            LatestEvent: '',

        };

        $scope.perPage = {
            //GenderRatio
            GenderRatio: GlobalServices.getPerPageRow(),

            //MaritalStatus
            MaritalStatus: GlobalServices.getPerPageRow(),

            //StatusDistribution
            StatusDistribution: GlobalServices.getPerPageRow(),

            //LeaveDetails
            LeaveReqst: GlobalServices.getPerPageRow(),
            RejectedLeave: GlobalServices.getPerPageRow(),
            ApprovedLeave: GlobalServices.getPerPageRow(),
            PendingLeave: GlobalServices.getPerPageRow(),

            //Transfers
            Transfers: GlobalServices.getPerPageRow(),

            //Transfers
            Retirement: GlobalServices.getPerPageRow(),

            //EmployeesOnLeave
            EmployeesonLeave: GlobalServices.getPerPageRow(),

            //LatestEvent
            LatestEvent: GlobalServices.getPerPageRow(),
        };


        $scope.YearColl = gSrv.getYearList();
        $scope.AcademicCalendar = {
            YearId: 0,
            MonthColl: []
        };

        $scope.CurDate = {};
        $http({
            method: 'POST',
            url: base_url + "Global/GetDate",
            dataType: "json"
        }).then(function (res) {
            $scope.CurDate = res.data.Data;

            if ($rootScope.LANG == 'in') {
                $scope.AcademicCalendar.YearId = new Date($scope.CurDate.Date_AD).getFullYear();
            } else {
                $scope.AcademicCalendar.YearId = $scope.CurDate.NY;
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.getCurrentDate();
        $scope.renderCategoryStockChart("DepartmentWiseAtt");
        $scope.GetHRDashboard(null);
    };

    function OnClickDefault() {
        document.getElementById('genderratio-form').style.display = "none";
        document.getElementById('MaritalStatus-form').style.display = "none";
        document.getElementById('StatusDistribution-form').style.display = "none";
        document.getElementById('LeaveDetails-form').style.display = "none";
        document.getElementById('Transfer-form').style.display = "none";
        document.getElementById('Retirement-form').style.display = "none";
        document.getElementById('EmployeesLeave-form').style.display = "none";
        document.getElementById('LatestEvent-form').style.display = "none";

        //GenderRatio
        document.getElementById('back-to-genderRatio').onclick = function () {
            document.getElementById('HRDasboard-section').style.display = "block";
            document.getElementById('genderratio-form').style.display = "none";
        }

        //MaritalStatus

        document.getElementById('back-to-MaritalStatus').onclick = function () {
            document.getElementById('HRDasboard-section').style.display = "block";
            document.getElementById('MaritalStatus-form').style.display = "none";
        }

        //StatusDistribution

        document.getElementById('back-to-StatusDistribution').onclick = function () {
            document.getElementById('HRDasboard-section').style.display = "block";
            document.getElementById('StatusDistribution-form').style.display = "none";
        }

        //LeaveDetails
        document.getElementById('view-LeaveDetails').onclick = function () {
            document.getElementById('HRDasboard-section').style.display = "none";
            document.getElementById('LeaveDetails-form').style.display = "block";
        }

        document.getElementById('back-to-LeaveDetails').onclick = function () {
            document.getElementById('HRDasboard-section').style.display = "block";
            document.getElementById('LeaveDetails-form').style.display = "none";
        }

        //Transfer

        document.getElementById('back-to-Transfer').onclick = function () {
            document.getElementById('HRDasboard-section').style.display = "block";
            document.getElementById('Transfer-form').style.display = "none";
        }

        //Retirement

        document.getElementById('back-to-Retirement').onclick = function () {
            document.getElementById('HRDasboard-section').style.display = "block";
            document.getElementById('Retirement-form').style.display = "none";
        }

        //EmployeesLeave

        document.getElementById('back-to-EmployeesLeave').onclick = function () {
            document.getElementById('HRDasboard-section').style.display = "block";
            document.getElementById('EmployeesLeave-form').style.display = "none";
        }

        //EmployeesLeave
        document.getElementById('view-LatestEvent').onclick = function () {
            document.getElementById('HRDasboard-section').style.display = "none";
            document.getElementById('LatestEvent-form').style.display = "block";
        }

        document.getElementById('back-to-LatestEvent').onclick = function () {
            document.getElementById('HRDasboard-section').style.display = "block";
            document.getElementById('LatestEvent-form').style.display = "none";
        }
    }

    // ====================================
    // 🔹 Get All Data
    // ====================================
    $scope.GetHRDashboard = function (resdata) {
        $scope.loadingstatus = "running";
        showPleaseWait();

        $scope.TransferList = [];
        $scope.RetirementList = [];
        $scope.EmployeesonLeaveList = [];
        $scope.AttendanceReportList = [];
        $scope.EmployeesData = [];
        var para = {
            ViewDetailsId: resdata || null
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Report/GetHRDashboard",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

            if (res.data.IsSuccess && res.data.Data) {
                $scope.beData = res.data.Data;

                //Genedr Ratio
                $scope.GenderRatioColl = res.data.Data.GenderRatioColl;
                $scope.renderGenderRatioChart();

                //Marital Status
                $scope.MaritalStatusSumColl = res.data.Data.MaritalStatusSumColl;
                $scope.renderMaritalStatusChart();

                //Status Distribution
                $scope.StatusDistributionColl = res.data.Data.StatusDistributionColl;
                $scope.renderStatusDistributionChart();

                //Leave Details
                $scope.LeaveDetailsColl = res.data.Data.LeaveDetailsColl;
                $scope.renderLeaveDetailsChart();

                //Transfer
                $scope.TransferList = res.data.Data.TransfersColl;

                //Retirement
                $scope.RetirementList = res.data.Data.RetirementColl;

                //Employees on Leave
                $scope.EmployeesonLeaveList = res.data.Data.EmployeesonLeaveColl;

                //Employees Leave
                $scope.EmployeesLeaveColl = res.data.Data.EmployeesLeaveColl;
                $scope.renderEmployeeLeavesChart();

                //Attendance Report
                $scope.AttendanceReportList = res.data.Data.AttendanceReportColl;

                //Employees List
                $scope.EmployeesData = res.data.Data.EmployeesListColl;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + reason.statusText);
        });
    };

    $scope.GenderDetails = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        $scope.GenderatioList = [];
        $scope.GenderatioDisplayList = [];

        var para = {
            ViewDetailsId: 1
        };

        $http({
            method: 'POST',
            url: base_url + "HR/Report/GetHRDashboard",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

            if (res.data.IsSuccess && res.data.Data) {
                $scope.beData = res.data.Data;
                $scope.GenderatioList = res.data.Data.GenderRatioColl;

                // 🔹 Separate by MaritalStatusId
                let Male = $scope.GenderatioList.filter(x => x.Gender == 'Male');
                let Female = $scope.GenderatioList.filter(x => x.Gender == 'Female');
                let Others = $scope.GenderatioList.filter(x => x.Gender == 'Others');

                // 🔹 Get max length among all
                let maxLen = Math.max(Male.length, Female.length, Others.length);

                // 🔹 Create rows for table
                for (let i = 0; i < maxLen; i++) {
                    $scope.GenderatioDisplayList.push({
                        Male: Male[i] ? Male[i].EmployeeName + "     (" + Male[i].EmployeeCode + ")" : '',
                        Female: Female[i] ? Female[i].EmployeeName + "     (" + Female[i].EmployeeCode + ")" : '',
                        Others: Others[i] ? Others[i].EmployeeName + "     (" + Others[i].EmployeeCode + ")" : '',
                    });
                }

                document.getElementById('HRDasboard-section').style.display = "none";
                document.getElementById('genderratio-form').style.display = "block";

            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + reason.statusText);
        });
    }

    $scope.MaritalStatusDetails = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        $scope.MaritalList = [];
        $scope.MaritalDisplayList = [];

        var para = { ViewDetailsId: 2 };

        $http({
            method: 'POST',
            url: base_url + "HR/Report/GetHRDashboard",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

            if (res.data.IsSuccess && res.data.Data) {
                $scope.beData = res.data.Data;
                $scope.MaritalList = res.data.Data.MaritalStatusSumColl;

                // 🔹 Separate by MaritalStatusId
                let single = $scope.MaritalList.filter(x => x.MaritalStatusId == 1);
                let married = $scope.MaritalList.filter(x => x.MaritalStatusId == 2);
                let unmarried = $scope.MaritalList.filter(x => x.MaritalStatusId == 3);
                let widow = $scope.MaritalList.filter(x => x.MaritalStatusId == 4);

                // 🔹 Get max length among all
                let maxLen = Math.max(single.length, married.length, unmarried.length, widow.length);

                // 🔹 Create rows for table
                for (let i = 0; i < maxLen; i++) {
                    $scope.MaritalDisplayList.push({
                        Single: single[i] ? single[i].EmployeeName + "     (" + single[i].EmployeeCode + ")" : '',
                        Married: married[i] ? married[i].EmployeeName + "     (" + married[i].EmployeeCode + ")" : '',
                        Unmarried: unmarried[i] ? unmarried[i].EmployeeName + "     (" + unmarried[i].EmployeeCode + ")" : '',
                        Widow: widow[i] ? widow[i].EmployeeName + "     (" + widow[i].EmployeeCode + ")" : ''
                    });
                }

                // Show / hide sections
                document.getElementById('HRDasboard-section').style.display = "none";
                document.getElementById('MaritalStatus-form').style.display = "block";
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + reason.statusText);
        });
    };

    $scope.StatusDistributionDetails = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        $scope.DepartmentList = [];

        var para = {
            ViewDetailsId: 3
        }

        $http({
            method: 'POST',
            url: base_url + "HR/Report/GetHRDashboard",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

            if (res.data.IsSuccess && res.data.Data) {
                $scope.beData = res.data.Data;

                let allEmployees = res.data.Data.StatusDistributionColl;

                // Group employees by Department
                let deptMap = {};

                allEmployees.forEach(emp => {
                    if (!deptMap[emp.DepartmentId]) {
                        deptMap[emp.DepartmentId] = {
                            DepartmentId: emp.DepartmentId,
                            Department: emp.Department,
                            Employees: []
                        };
                    }
                    deptMap[emp.DepartmentId].Employees.push({
                        EmployeeName: emp.EmployeeName,
                        EmployeeCode: emp.EmployeeCode
                    });
                });

                // Convert to array
                $scope.DepartmentList = Object.values(deptMap);

                document.getElementById('HRDasboard-section').style.display = "none";
                document.getElementById('StatusDistribution-form').style.display = "block";

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + reason.statusText);
        });
    };

    $scope.TransferDetails = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        $scope.TransferList = [];
        $http({
            method: 'POST',
            url: base_url + "HR/Report/GetHRDashboard",
            dataType: "json",
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

            if (res.data.IsSuccess && res.data.Data) {
                $scope.beData = res.data.Data;
                $scope.TransferList = res.data.Data.TransfersColl;
                document.getElementById('HRDasboard-section').style.display = "none";
                document.getElementById('Transfer-form').style.display = "block";
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + reason.statusText);
        });
    }

    $scope.RetirementDetails = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        $scope.RetirementList = [];
        $http({
            method: 'POST',
            url: base_url + "HR/Report/GetHRDashboard",
            dataType: "json",
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

            if (res.data.IsSuccess && res.data.Data) {
                $scope.beData = res.data.Data;
                $scope.RetirementList = res.data.Data.RetirementColl;
                document.getElementById('HRDasboard-section').style.display = "none";
                document.getElementById('Retirement-form').style.display = "block";
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + reason.statusText);
        });
    }

    $scope.EmployeesLeaveDetails = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        $scope.EmployeesLeaveList = [];
        $http({
            method: 'POST',
            url: base_url + "HR/Report/GetHRDashboard",
            dataType: "json",
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

            if (res.data.IsSuccess && res.data.Data) {
                $scope.beData = res.data.Data;
                $scope.EmployeesLeaveList = res.data.Data.EmployeesonLeaveColl;
                document.getElementById('HRDasboard-section').style.display = "none";
                document.getElementById('EmployeesLeave-form').style.display = "block";
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + reason.statusText);
        });
    }

    $scope.getNepaliCalendar = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        var para = {
            YearId: $scope.AcademicCalendar.YearId
        };

        $scope.AllEventList = [];
        $http({
            method: 'POST',
            url: base_url + "AppCMS/Creation/GetNepaliCalendar",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {

                $timeout(function () {
                    $scope.AcademicCalendar.MonthColl = res.data.Data;

                    $scope.nextPreviusMonth(0);

                    angular.forEach($scope.AcademicCalendar.MonthColl, function (mn) {
                        angular.forEach(mn.EventColl, function (ec) {
                            $scope.AllEventList.push(ec);
                        });
                    });

                });



            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }
    // ====================================
    // 🔹 Get Current Date
    // ====================================
    $scope.getCurrentDate = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        var para = { forDate: null };

        $http({
            method: 'POST',
            url: base_url + "Global/GetDate",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

            if (res.data.Data) {
                $scope.CurrentDate = res.data.Data;
                if ($rootScope.LANG == 'in') {
                    var dt = new Date($scope.CurrentDate.Date_AD);
                    $scope.AcademicCalendar.YearId = dt.getFullYear();
                    $scope.AcademicCalendar.MonthId = dt.getMonth() + 1;
                    $scope.AcademicCalendar.DayId = dt.getDate();
                } else {
                    $scope.AcademicCalendar.YearId = $scope.CurrentDate.NY;
                    $scope.AcademicCalendar.MonthId = $scope.CurrentDate.NM;
                    $scope.AcademicCalendar.DayId = $scope.CurrentDate.ND;
                    $scope.AcademicCalendar.ThisYear = $scope.CurrentDate.NY;
                    $scope.AcademicCalendar.ThisMonth = $scope.CurrentDate.NM;
                }
                $timeout(function () {
                    $scope.getNepaliCalendar();
                });
            }
        }, function (reason) {
            hidePleaseWait();
            Swal.fire('Failed', reason, 'error');
        });
    };

    // ====================================
    // 🔹 Get Nepali Calendar by Year
    // ====================================
    $scope.getNepaliCalendar = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        var para = {
            YearId: $scope.AcademicCalendar.YearId
        };

        $scope.AllEventList = [];
        $http({
            method: 'POST',
            url: base_url + "AppCMS/Creation/GetNepaliCalendar",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {

                $timeout(function () {
                    $scope.AcademicCalendar.MonthColl = res.data.Data;
                    $scope.nextPreviusMonth(0);
                    angular.forEach($scope.AcademicCalendar.MonthColl, function (mn) {
                        angular.forEach(mn.EventColl, function (ec) {
                            $scope.AllEventList.push(ec);
                        });
                    });
                });
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }

    // ====================================
    // 🔹 Next / Previous Month Handler
    // ====================================
    $scope.nextPreviusMonth = function (val) {
        // Handle month navigation
        if (val === 1) {
            if ($scope.AcademicCalendar.MonthId < 12)
                $scope.AcademicCalendar.MonthId += 1;
            else return;
        } else if (val === -1) {
            if ($scope.AcademicCalendar.MonthId > 1)
                $scope.AcademicCalendar.MonthId -= 1;
            else return;
        }

        // Get current month object
        $scope.AcademicCalendar.CurMonth = mx($scope.AcademicCalendar.MonthColl).firstOrDefault(p => p.MonthId == $scope.AcademicCalendar.MonthId);

        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        // If month found, update day flags
        if ($scope.AcademicCalendar.CurMonth && $scope.AcademicCalendar.CurMonth.DataColl) {
            angular.forEach($scope.AcademicCalendar.CurMonth.DataColl, function (dc) {
                // Set DayName based on AD_Date
                if (dc.AD_Date) {
                    const dt = new Date(dc.AD_Date);
                    dc.DayName = weekdays[dt.getDay()];
                } else {
                    dc.DayName = ""; // fallback
                }
                // Highlight today
                dc.IsToday =
                    (dc.ND == $scope.AcademicCalendar.DayId &&
                        dc.NM == $scope.AcademicCalendar.ThisMonth &&
                        dc.NY == $scope.AcademicCalendar.ThisYear);
            });
        }
    };

    // ====================================
    // 🔹 Click on a Day (optional feature)
    // ====================================
    $scope.scrollDates = function (dir) {
        var el = document.getElementById("dateStrip");
        if (!el)
            return;
        const scrollAmount = 200; // pixels per click
        el.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
    };

    $scope.ClickOnDay = function (dd) {
        // Clear previous selection
        $scope.AcademicCalendar.CurMonth.DataColl.forEach(function (d) {
            d.IsSelected = false;
        });
        // Mark new selected
        dd.IsSelected = true;

        // Optionally update event list
        $scope.AcademicCalendar.CurMonth.EventColl = dd.EventColl;
    };

    // ====================================
    // 🔹 Gender Ratio Chart
    // ====================================

    $scope.renderGenderRatioChart = function () {
        $scope.genderData = {
            Gender: $scope.beData.GenderRatioColl.map(x => x.Gender),
            TotalEmployees: $scope.beData.GenderRatioColl.map(x => x.TotalEmployees)
        };

        const labels = $scope.genderData.Gender;
        const values = $scope.genderData.TotalEmployees;

        const colorMap = {
            Male: '#001F3F',
            Female: '#92C960',
            Other: '#782E6D'
        };
        const colors = labels.map(l => colorMap[l] || '#d2d6de');

        const ctx = document.getElementById("genderratio")?.getContext("2d");
        if (!ctx) return;

        if (window.myGenderRatioChart) window.myGenderRatioChart.destroy();

        window.myGenderRatioChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: "bottom", labels: { usePointStyle: true } },
                    tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed}` } }
                },
                cutout: '70%',
                layout: { padding: 10 }
            }
        });
    };

    // ====================================
    // 🔹 Marital Status Chart
    // ====================================
    $scope.renderMaritalStatusChart = function () {
        $scope.MaritalStatusData = {
            MaritalStatusName: $scope.beData.MaritalStatusSumColl.map(x => x.MaritalStatusName),
            TotalEmployees: $scope.beData.MaritalStatusSumColl.map(x => x.TotalEmployees)
        };
        const labels = $scope.MaritalStatusData.MaritalStatusName;
        const values = $scope.MaritalStatusData.TotalEmployees;

        const colorMap = {
            Single: '#FF7F32',
            Married: '#FFD54F',
            Widow: '#1E90FF',
            Unmarried: '#00BFA5'
        };
        const colors = labels.map(l => colorMap[l] || '#d2d6de');

        const ctx = document.getElementById("maritalStatusChart")?.getContext("2d");
        if (!ctx) return;
        if (window.myMaritalChart) window.myMaritalChart.destroy();

        window.myMaritalChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: "bottom", labels: { usePointStyle: true } },
                    tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed}` } }
                },
                cutout: '70%',
                layout: { padding: 10 }
            }
        });
    };

    // ====================================
    // 🔹 Status Distribution Chart
    // ====================================

    $scope.renderStatusDistributionChart = function () {
        const labels = $scope.beData.StatusDistributionColl.map(x => x.Department);
        const values = $scope.beData.StatusDistributionColl.map(x => x.TotalEmployees);

        // Generate distinct colors using HSL
        const colors = labels.map((_, index) => {
            const hue = Math.floor((index / labels.length) * 360); // distribute around color wheel
            return `hsl(${hue}, 70%, 50%)`; // 70% saturation, 50% lightness
        });

        const ctx = document.getElementById("statusDistribution")?.getContext("2d");
        if (!ctx) return;
        if (window.myStatusChart) window.myStatusChart.destroy();

        window.myStatusChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors // <- this will automatically reflect in legend
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: "bottom",
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            backgroundColor: colors
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: ctx => `${ctx.label}: ${ctx.parsed}`
                        }
                    }
                },
                layout: { padding: 10 }
            }
        });

    };

    // =====================================
    // 🔹 Leave Details Chart
    // =====================================

    $scope.renderLeaveDetailsChart = function () {
        // Assuming your data is in $scope.beData.LeaveDetailsColl, we need to map total values for each leave type
        $scope.LeaveDetailsData = {
            LeaveRequest: $scope.beData.LeaveDetailsColl.map(x => x.LeaveRequest),
            NotApproved: $scope.beData.LeaveDetailsColl.map(x => x.NotApproved),
            Approved: $scope.beData.LeaveDetailsColl.map(x => x.Approved),
            Cancelled: $scope.beData.LeaveDetailsColl.map(x => x.Cancelled),
            Rejected: $scope.beData.LeaveDetailsColl.map(x => x.Rejected)
        };

        // Define labels and values for the pie chart. This will be based on the total counts for each category.
        const labels = ['Leave Request', 'Not Approved', 'Approved', 'Cancelled', 'Rejected'];
        const values = [
            $scope.LeaveDetailsData.LeaveRequest,
            $scope.LeaveDetailsData.NotApproved,
            $scope.LeaveDetailsData.Approved,
            $scope.LeaveDetailsData.Cancelled,
            $scope.LeaveDetailsData.Rejected
        ];

        // Color mapping for each leave type
        const colorMap = {
            'Leave Request': '#735893',
            'Not Approved': '#f4740b',
            'Approved': '#8eb048',
            'Cancelled': '#b3423f',
            'Rejected': 'red'
        };

        // Map labels to their corresponding colors
        const colors = labels.map(l => colorMap[l] || '#d2d6de');

        // Get the context for the chart
        const ctx = document.getElementById("LeaveDetails")?.getContext("2d");
        if (!ctx) return;
        if (window.myLeaveDetailsChart) window.myLeaveDetailsChart.destroy();

        // Create a new chart
        window.myLeaveDetailsChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: "bottom", labels: { usePointStyle: true } },
                    tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed}` } }
                },
                layout: { padding: 10 }
            }
        });
    };

    // ====================================
    // 🔹 Employee Leave Line Chart
    // ====================================
    $scope.renderEmployeeLeavesChart = function () {
        const ctx7 = document.getElementById('EmployeeLeaves')?.getContext('2d');
        if (!ctx7) return;

        $scope.EmployeesLeaveData = {
            present: $scope.beData.EmployeesLeaveColl.map(x => x.present),
            Leave: $scope.beData.EmployeesLeaveColl.map(x => x.Leave),

        };

        // Define labels and values for the pie chart. This will be based on the total counts for each category.
        const labels = ['Leave', 'present'];
        const values = [
            $scope.EmployeesLeaveData.Leave,
            $scope.EmployeesLeaveData.present,
        ];

        const gradientLeave = ctx7.createLinearGradient(0, 0, 0, 400);
        gradientLeave.addColorStop(0, '#04213E');
        gradientLeave.addColorStop(1, 'rgba(4,33,62,0.01)');

        const gradientPresent = ctx7.createLinearGradient(0, 0, 400, 400);
        gradientPresent.addColorStop(0.42, '#37C82B');
        gradientPresent.addColorStop(0.92, 'rgba(138,198,133,0)');

        new Chart(ctx7, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Leave', data: $scope.EmployeesLeaveData.Leave, backgroundColor: gradientLeave, fill: true, tension: 0.4, pointRadius: 3 },
                    { label: 'present', data: $scope.EmployeesLeaveData.present, backgroundColor: gradientPresent, fill: true, tension: 0.4, pointRadius: 3 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { usePointStyle: true } },
                    tooltip: { callbacks: { label: c => `${c.dataset.label}: ${c.parsed.y}` } }
                },
                scales: {
                    x: { grid: { color: "#A09F9F1A" } },
                    y: { beginAtZero: true, max: 50, ticks: { stepSize: 10 }, grid: { color: "#A09F9F1A" } }
                }
            }
        });
    };

    // ====================================
    // 🔹 Category Stock Chart
    // ====================================
    $scope.renderCategoryStockChart = function (chartId) {
        const labels = ["Developer", "HR", "Support", "Finance", "Marketing"];
        const totalData = [25, 15, 10, 12, 20];
        const presentData = [20, 12, 8, 10, 18];
        const leaveData = [5, 3, 2, 2, 2];

        const ctx = document.getElementById(chartId)?.getContext("2d");
        if (!ctx) return;

        new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets: [
                    { label: "Total", data: totalData, backgroundColor: "#FF4C4C", borderRadius: 10, barThickness: 15 },
                    { label: "Present", data: presentData, backgroundColor: "#69A643", borderRadius: 10, barThickness: 15 },
                    { label: "Leave", data: leaveData, backgroundColor: "#4C8CFF", borderRadius: 10, barThickness: 15 }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true, position: "bottom", labels: { usePointStyle: true } }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: "#A09F9F1A" } },
                    x: { grid: { color: "#A09F9F1A" } }
                }
            }
        });
    };

    // ====================================
    // 🔹 Calendar Events Section
    // ====================================
    $scope.renderCalendar = function () {
        const dateStrip = document.getElementById("dateStrip");
        const eventList = document.getElementById("eventList");
        if (!dateStrip || !eventList) return;

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const selectedDate = 23;

        for (let i = 0; i < 12; i++) {
            const day = days[new Date(2023, 4, 23).getDay()];
            const div = document.createElement("div");
            div.className = "date-item" + (i === 1 ? " active" : "");
            div.innerHTML = `<div class="day">${day}</div><div class="date">${selectedDate}</div>`;
            dateStrip.appendChild(div);
        }

        const events = [
            { title: "Anniversary Celebration", desc: "A wedding anniversary is the anniversary of the date that a wedding took place." },
            { title: "Annual Meetup", desc: "Our yearly company-wide meetup event." }
        ];

        events.forEach(e => {
            const item = document.createElement("div");
            item.className = "event-item";
            item.innerHTML = `<div class="event-title">${e.title}</div><div class="event-desc">${e.desc}</div>`;
            eventList.appendChild(item);
        });
    };

});
