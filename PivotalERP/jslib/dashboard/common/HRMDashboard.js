app.controller("HRMDashBoardController", function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'HRMDashBoardController';
    /* OnClickDefault();*/

    $scope.selectedList = null;      // Which list to show
    $scope.selectedListTitle = '';   // Title of the list


    $scope.BranchColl = [];
    $scope.SalaryData = [];
    $scope.DepartmentColl = [];

    $scope.beData = {};

    $scope.LoadData = function () {
       
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            WorkForceList: 1,
            AttendanceDet: 1,
            NewEmployees: 1,
            AttendanceAppeal: 1,
            LeaveStatus: 1,
            Holiday: 1,
            AdvanceReceive: 1,
            SalaryDistribution: 1,
            BranchWiseEmp: 1,
            DepartmentWiseEmp: 1,
            Birthday: 1,
        };

        $scope.searchData = {
            WorkForceList: '',
            AttendanceDet: '',
            NewEmployees: '',
            AttendanceAppeal: '',
            LeaveStatus: '',
            Holiday: '',
            AdvanceReceive: '',
            SalaryDistribution: '',
            BranchWiseEmp: '',
            DepartmentWiseEmp: '',
            Birthday: '',
        };

        $scope.perPage = {
            WorkForceList: GlobalServices.getPerPageRow(),
            AttendanceDet: GlobalServices.getPerPageRow(),
            NewEmployees: GlobalServices.getPerPageRow(),
            AttendanceAppeal: GlobalServices.getPerPageRow(),
            LeaveStatus: GlobalServices.getPerPageRow(),
            Holiday: GlobalServices.getPerPageRow(),
            AdvanceReceive: GlobalServices.getPerPageRow(),
            SalaryDistribution: GlobalServices.getPerPageRow(),
            BranchWiseEmp: GlobalServices.getPerPageRow(),
            DepartmentWiseEmp: GlobalServices.getPerPageRow(),
            Birthday: GlobalServices.getPerPageRow(),
        };

        $scope.filterData = {
            ForDate:1
        }
         

        //$scope.selectedTab = 'Today';

        var listTypes = ['WorkForceList', 'AttendanceList', 'NewEmployeesList', 'AttAppealList',
            'LeaveStatusList', 'HolidayList', 'TotalAdvRecList', 'SalaryDistributionList',
            'BranchWiseList', 'DepartmentWiseList', 'BirthdayList'];

        listTypes.forEach(function (type) {
            $scope.currentPages[type] = 1;
            $scope.searchData[type] = '';
            $scope.perPage[type] = GlobalServices.getPerPageRow();
        });

        $scope.GetHRMDashBoard();
    }

    $scope.selectedList = [
        { id: 1, text:'WorkForceList'},
        { id: 2, text:'AttendanceList'},
        { id: 3, text:'NewEmployeesList'},
        { id: 4, text:'AttAppealList'},
        { id: 5, text:'LeaveStatusList'},
        { id: 6, text:'HolidayList'},
        { id: 7, text:'TotalAdvRecList'},
        { id: 8, text:'SalaryDistributionList'},
    ]


    $scope.GetHRMDashBoard = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            ForDate: $scope.filterData.ForDate
        };
        $http({
            method: 'POST',
            url: base_url + "DashBoard/Common/GetHRMDashBoard",
            dataType: "json",
            data: JSON.stringify(para)

        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

            if (res.data.IsSuccess && res.data.Data) {
                $scope.beData = res.data.Data;
                $scope.leavePyramidData = [
                    { value: res.data.Data.LeaveRejected, color: 'red' },
                    { value: res.data.Data.LeavePending, color: 'yellow' },
                    { value: res.data.Data.LeaveApproved, color: 'green' }
                ];

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + reason.statusText);
        });
   };

    // Function to show list at bottom
    $scope.showList = function (listName, listTitle) {
        $scope.selectedList = listName;
        $scope.selectedListTitle = listTitle;
    };

    // Function to close list
    $scope.closeList = function () {
        $scope.selectedList = null;
        $scope.selectedListTitle = '';
    };

    
})