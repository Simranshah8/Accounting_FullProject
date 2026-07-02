app.controller('SupervisorListController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Supervisor List';

    $scope.LoadData = function () {
        $('.select2').select2({});
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            Supervisor: 1,
        };

        $scope.searchData = {
            Supervisor: '',
        };

        $scope.perPage = {
            Supervisor: GlobalServices.getPerPageRow(),
        };

        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: $scope.perPage.Supervisor,
            sort: null,
            SearchType: 'text',
            SearchCol: '',
            SearchVal: '',
            SearchColDet: null,
            pagearray: [],
            pageOptions: $scope.perPageColl,
            TotalRows: 0,
        };

        $scope.ReSearchData = function (pageInd) {
            if (pageInd && pageInd >= 0)
                $scope.paginationOptions.pageNumber = pageInd;
            else if (pageInd == -1)
                $scope.paginationOptions.pageNumber = 1;
            $scope.GetSupervisorList();
        }

        $scope.DepartmentList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllDepartment",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DepartmentList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        //designation
        $scope.DesignationList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllDesignation",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DesignationList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.BranchList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.CompanyRelationshipList = [];
        $http({
            method: 'POST',
            url: base_url + "HR/Master/GetAllCompanyRelationship",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CompanyRelationshipList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.newDet = {
            EmployeeCode: '',
            DepartmentId: null,
            DesignationId: null,
            BranchId: null,
            FirstLevelSupervisorId: null,
            SecondLevelSupervisorId: null,
            ThirdLevelSupervisorId: null,
            CompanyRelationshipId: null,
        };
        $scope.GetSupervisorList();

    }
    $scope.GetSupervisorList = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.SupervisorList = [];
        var para = {
            BranchId: $scope.newDet.BranchId,
            DepartmentId: $scope.newDet.DepartmentId,
            DesignationId: $scope.newDet.DesignationId,
            CompanyRelationshipId: $scope.newDet.CompanyRelationshipId,
            PageNumber: $scope.paginationOptions.pageNumber,
            RowsOfPage: $scope.perPage.Supervisor,
        };

        $http({
            method: 'Post',
            url: base_url + "HR/Report/GetSupervisorList",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.SupervisorList = res.data.Data;
                $scope.paginationOptions.TotalRows = res.data.TotalCount;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

});