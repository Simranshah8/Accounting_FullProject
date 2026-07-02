app.controller('ViewTaskController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'ViewGenerate';
    $scope.LoadData = function () {
        $scope.Title = 'ViewGenerate';
        $('.select2').select2({ AllowClear: true });
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.FilterDateAsColl = [
            { id: 0, text: '**Filter Date As**' },
            { id: 1, text: 'Create' },
            { id: 2, text: 'Change Status' },
            { id: 3, text: 'Hold' },
            { id: 4, text: 'In Progress' },
            { id: 5, text: 'Closed' },             
        ];

        //$scope.RequirementProblemColl = [
        //    { id: 1, text: 'General' },
        //    { id: 2, text: 'Requirement Of Client' },
        //    { id: 3, text: 'Bug  Of Client' },
        //    { id: 4, text: 'Repeated Bug  Of Client' },
        //    { id: 5, text: 'Report Template' },
        //    { id: 6, text: 'New Requirement' },
        //    { id: 7, text: 'YearClosing' },
        //    { id: 8, text: 'DataMigration' },
        //    { id: 9, text: 'DailyWork' },
        //    { id: 10, text: 'Collection' },
        //    { id: 11, text: 'Business Meetings' },
        //    { id: 12, text: 'Documentations' },
        //    { id: 13, text: 'Support(from Business team)' },
        //    { id: 14, text: 'Testing' },
        //];

        $scope.RequirementProblemColl = [];
        $http({
            method: 'GET',
            url: base_url + "Task/Creation/GetAllTaskType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.RequirementProblemColl = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.ApprovedColl = [
            { id: 1, text: 'All' },
            { id: 2, text: 'Approved' },
            { id: 3, text: 'UnApproved' },
        ];

        $scope.StatusColl = [
            { id: 1, text: 'Open' },
            { id: 2, text: 'On Hold' },
            { id: 3, text: 'In Progress' },
            { id: 4, text: 'Closed' },
        ];

        $scope.WorkStatusColl = [
            { id: 1, text: 'Done' },
            { id: 2, text: 'Pending' }
        ];

        $scope.PriorityCol = [
            { id: 1, text: 'Urgent' },
            { id: 2, text: 'High' },
            { id: 3, text: 'Medium' },
            { id: 4, text: 'Low' }
        ]

        $scope.currentPages = {
            ViewGenerate: 1
        };

        $scope.searchData = {
            ViewGenerate: ''
        };

        $scope.perPage = {
            ViewGenerate: GlobalServices.getPerPageRow()
        };

        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: $scope.perPage.ViewGenerate,
            sort: null,
            SearchType: 'text',
            SearchCol: '',
            SearchVal: '',
            SearchColDet: null,
            pagearray: [],
            pageOptions: $scope.perPageColl,
            TotalRows:0,
        };

        //$scope.ProductNameList = [];
        //$http({
        //    method: 'GET',
        //    url: base_url + "Master/Creation/GetAllProductName",
        //    dataType: "json"
        //}).then(function (res) {
        //    hidePleaseWait();
        //    $scope.loadingstatus = "stop";
        //    if (res.data.IsSuccess && res.data.Data) {
        //        $scope.ProductNameList = res.data.Data;
        //    }
        //}, function (reason) {
        //    Swal.fire('Failed' + reason);
        //});

        //$scope.CustomerList = [];
        //$http({
        //    method: 'GET',
        //    url: base_url + "Finance/Creation/GetAllCustomerShortDetails",
        //    dataType: "json"
        //}).then(function (res) {
        //    hidePleaseWait();
        //    $scope.loadingstatus = "stop";
        //    if (res.data.IsSuccess && res.data.Data) {
        //        $scope.CustomerList = res.data.Data;
        //    } else {
        //        Swal.fire(res.data.ResponseMSG);
        //    }
        //}, function (reason) {
        //    Swal.fire('Failed' + reason);
        //});


        //$scope.EmployeeProfileList = [];
        //$http({
        //    method: 'GET',
        //    url: base_url + "Master/Creation/GetAllEmpShortDet",
        //    dataType: "json"
        //}).then(function (res) {
        //    hidePleaseWait();
        //    $scope.loadingstatus = "stop";
        //    if (res.data.IsSuccess && res.data.Data) {
        //        $scope.EmployeeProfileList = res.data.Data;
        //    } else {
        //        Swal.fire(res.data.ResponseMSG);
        //    }
        //}, function (reason) {
        //    Swal.fire('Failed' + reason);
        //});

        $scope.EmployeeProfileList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllEmployee",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.EmployeeProfileList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.newDetFilter = {
            TicketStatus: 1,
            CustomerId: null,
            SupportExecutiveId: null,
            RequirementTypeId: null,
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            ApprovedId: 1,
            FilterDateAs:0,
        };

        $scope.newStatus = {
            StatusId: null,
            StatusRemarks: ''
        };

        $scope.newAssign = {
            AssignToId: null,
            Remarks: ''
        };

        $scope.newComment = {
            Comment: ''
        };

        $scope.newFeedback = {
            CallStatus: false,
            WorkStatusId: null,
            ReopenTicket: 0,
            Rating: 0,
            Comment: ''
        };

        $scope.GetAllGenerateTicketList();
    }

    $scope.Clear = function () {
        $scope.newDet = {
            TranId: null,
            CustomerId: null,
            ContactName: '',
            CompanyCode: '',
            ContactPersonId: null,
            ContactMobileNo: '',
            ContactDesignation: '',
            Source: '',
            RequirementProblem: '',
            ProblemTitle: '',
            Description: '',
            AssignToId: null,
            EmployeeId: null,
            Document_TMP: '',
            DocumentData: '',
            Mode: 'Accept'
        };
    }
    $scope.openStatusModal = function (C) {
        $scope.ClearStatus();
        $scope.newStatus = {};
        $scope.newStatus.TranId = C.TranId;
        $scope.newStatus.TicketId = C.TranId;
        $scope.newStatus.TaskType = C.TaskType;
        $scope.newStatus.Heading = C.Heading;
        $scope.newStatus.CustomerName = C.CustomerName;
        $('#AddStatus').modal('show');

    }

    $scope.openCommentModal = function (C) {
        $scope.ClearComment();
        $scope.newComment = {};
        $scope.newComment.CustomerName = C.CustomerName;
        $scope.newComment.TaskType = C.TaskType;
        $scope.newComment.Heading = C.Heading;
        $scope.newComment.TranId = C.TranId;
        $scope.newComment.TicketId = C.TranId;
        $('#AddComment').modal('show');
    }

    $scope.openAssignModal = function (C) {
        $scope.ClearAssign();
        $scope.newAssign = {};
        $scope.newAssign.CustomerName = C.CustomerName;
        $scope.newAssign.TranId = C.TranId;
        $scope.newAssign.TaskType = C.TaskType;
        $scope.newAssign.Heading = C.Heading;
        $scope.newAssign.TicketId = C.TranId;
        $('#Assign').modal('show');
    }

    $scope.openFeedbackModal = function (C) {
        $scope.newFeedback = {};
        $scope.newFeedback.CustomerName = C.CustomerName;
        $scope.newFeedback.TranId = C.TranId;
        $scope.newFeedback.TaskType = C.TaskType;
        $scope.newFeedback.Heading = C.Heading;
        $scope.newFeedback.TicketId = C.TranId;
        $('#AddTaskVerify').modal('show');
    }


    $scope.ClearFilter = function () {
        $scope.newDetFilter = {};
        $scope.GetAllGenerateTicketList();
    };
    $scope.ClearStatus = function () {
        $('input[type=file]').val('');
        $scope.newStatus = {};
        $scope.newStatus.StatusId = null;
        $scope.newStatus.StatusRemarks = '';
    }

    $scope.ClearComment = function () {
        $('input[type=file]').val('');
        $scope.newComment = {
            Comment: ''
        };
    }

    $scope.ClearAssign = function () {
        $scope.newAssign = {
            AssignToId: null,
            Remarks: ''
        };
    }

    $scope.ClearTicketCloseFeedback = function () {
        $scope.newFeedback = {
            CallStatus: false,
            WorkStatusId: null,
            ReopenTicket: 0,
            Rating: 0,
            Comment: ''
        };
    }

    $scope.ReSearchData = function (pageInd) {
        if (pageInd && pageInd >= 0)
            $scope.paginationOptions.pageNumber = pageInd;
        else if (pageInd == -1)
            $scope.paginationOptions.pageNumber = 1;

        $scope.GetAllGenerateTicketList();
        
    }

    $scope.GetAllGenerateTicketList = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.ViewGenrateList = [];

        var para = {
            FilterDate: ($scope.newDetFilter.FilterDateAs > 0 ? true : false),
            DateFrom: ($scope.newDetFilter.DateFromDet ? $filter('date')(new Date($scope.newDetFilter.DateFromDet.dateAD), 'yyyy-MM-dd') : null),
            DateTo: ($scope.newDetFilter.DateToDet ? $filter('date')(new Date($scope.newDetFilter.DateToDet.dateAD), 'yyyy-MM-dd') : null),
            StatusId: $scope.newDetFilter.TicketStatus,
            CustomerId: $scope.newDetFilter.CustomerId,
            AssignToId: $scope.newDetFilter.SupportExecutiveId,
            RequirementTypeId: $scope.newDetFilter.RequirementTypeId,
            PriorityId: $scope.newDetFilter.PriorityId,
            ApprovedId: $scope.newDetFilter.ApprovedId,
            ProductNameId: $scope.newDetFilter.ProductNameId,
            PageNumber: $scope.paginationOptions.pageNumber,
            RowsOfPage: $scope.paginationOptions.pageSize,
            FilterDateAs: $scope.newDetFilter.FilterDateAs
        };

        $http({
            method: 'POST',
            url: base_url + "Task/Creation/GetAllTask",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ViewGenrateList = res.data.Data;
                $scope.paginationOptions.TotalRows = res.data.TotalCount;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    //**********************Ticket Status************************
    $scope.SaveTicketStatus = function () {

        if ($scope.newStatus.StatusId == 4 && $scope.newStatus.RequirementType == 'YearClosing') {
            if ($scope.newStatus.PaymentVerifiedById > 0) {

            } else {
                Swal.fire('Please ! Select Payment Verified By Name');
                return;
            }
        }

        $scope.loadingstatus = "running";
        showPleaseWait();
        var files = $scope.newStatus.Photo_TMP;

        $http({
            method: 'POST',
            url: base_url + "Task/Creation/SaveStatus",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.files && data.files.length > 0)
                    formData.append("file0", data.files[0]);

                return formData;
            },
            data: { jsonData: $scope.newStatus, files: files }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearStatus();
                $scope.GetAllGenerateTicketList();
                $('#AddStatus').modal('hide');
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }


    //**********************Ticket Comment************************
    $scope.SaveTicketComment = function () {
        $scope.loadingstatus = "running";
        
        var files = $scope.newComment.Photo_TMP;
        showPleaseWait();
        $scope.newComment.Description = '';
        $http({
            method: 'POST',
            url: base_url + "Task/Creation/SaveComment",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.files && data.files.length > 0)
                    formData.append("file0", data.files[0]);


                return formData;
            },
            data: { jsonData: $scope.newComment, files: files }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearComment();
                $scope.GetAllGenerateTicketList();
                /* $scope.GetTicketCommentById(refData);*/
                $('#AddComment').modal('hide');
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetTicketCommentById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.ClearComment();
        $scope.newComment.CustomerName = refData.CustomerName;
        $scope.newComment.TranId = refData.TranId;
        $scope.newComment.TicketId = refData.TranId;
        $scope.newComment.TaskType = refData.TaskType;
        $scope.newComment.Heading = refData.Heading;
        $scope.newComment.Description = refData.Description;
        var para = {
            TranId: refData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "Task/Creation/GetCommentsbyId",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

            if (res.data.IsSuccess && res.data.Data) {
                $scope.CommentList = res.data.Data;

                $('#AddComment').modal('show');

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    //**********************Ticket Assign To************************
    $scope.SaveTicketAssign = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Task/Creation/SaveAssign",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                return formData;
            },
            data: { jsonData: $scope.newAssign }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearAssign();
                $scope.GetAllGenerateTicketList();
                $('#Assign').modal('hide');
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }


    $scope.GetTicketHisById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
     
        $scope.newHis = {
            DataColl: [],
            CustomerName: refData.CustomerName,
            TranId: refData.TranId,
            TaskType : refData.TaskType,
            Heading : refData.Heading
        }
        var para = {
            TranId: refData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "Task/Creation/GetHisbyId",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

            if (res.data.IsSuccess && res.data.Data) {
                $scope.newHis.DataColl = res.data.Data;

                $('#AddHistory').modal('show');

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    //**********************Ticket Close Feedback************************
    $scope.SaveTicketCloseFeedback = function () {
        if ($scope.newFeedback.Rating < 0 || $scope.newFeedback.Rating > 10) {
            Swal.fire('Rating must be between 0 and 10');
            return;
        }
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Task/Creation/SaveCloseFeedback",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newFeedback }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearTicketCloseFeedback();
                $('#TicketCloseFeedback').modal('hide');
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    //**********************View Attachment Strts************************* 
    $scope.OpenAttachmentbyId = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.viewImg = {};
        var para = {
            TranId: refData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "Task/Creation/getGenerateTicketById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.viewImg = res.data.Data;
                $('#viewattachment').modal('show');
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.CurTicket = {};
    $scope.GetAllTicketAttachment = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();

        $scope.CurTicket = refData;
        var para = {
            TicketId: refData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "Task/Creation/GetAllTaskAttachment",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.TicketImg = res.data.Data;
                $('#TicketAttachments').modal('show');
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };


    $scope.SaveTaskVerify = function () {
        $scope.loadingstatus = "running";
     
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Task/Creation/SaveCloseFeedback",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
  
                return formData;
            },
            data: { jsonData: $scope.newFeedback }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearTicketCloseFeedback();
                $scope.GetAllGenerateTicketList();
                /* $scope.GetTicketCommentById(refData);*/
                $('#AddTaskVerify').modal('hide');
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }
});