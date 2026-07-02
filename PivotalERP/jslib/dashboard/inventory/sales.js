"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller('salesDashboardController', function ($scope, $http,$filter, companyDet) {
    LoadData();

    $scope.unitColl = [];
    $scope.ProductBrandColl = [];
    var brandChart = null;
    $scope.selectedBrand = {};
    $scope.BrandUnitId = 0;

    $scope.ProjectionUnitId = 0;
    $scope.ProjectionFromDate = null;
    $scope.ProjectionToDate = null;
    $scope.ProjectionAgentId = 0;

    $scope.AgentColl = [];
    $scope.MonthDetailsColl = [];

    $scope.dsaOrderBy = 1;
    $scope.lastPurchaseOrderBy = 1;
    function LoadData()
    {
        $scope.loadingstatus = 'running';

        showPleaseWait();

        $scope.SelectMonthDet = {
            DateFrom: null,
            DateTo:null
        };

        // Load All Product Brand List
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductBrand",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data)
            {
                $scope.ProductBrandColl = res.data.Data;
                
                if ($scope.ProductBrandColl.length > 0) {
                    $scope.GetProductBrandWise($scope.ProductBrandColl[0]);
                }                    

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
            });


        //Load All Month Details List
        $http({
            method: 'GET',
            url: base_url + "Global/GetMonthDetails",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.MonthDetailsColl = res.data.Data;
                angular.forEach($scope.MonthDetailsColl, function (det) {
                    det.Name = bsMonths[det.MonthId - 1];
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

        // Load All Product Brand List
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllSalesMan",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AgentColl = res.data.Data;
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

        $http({
            method: 'POST',
            url: base_url + "DashBoard/Inventory/GetSalesData",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data)
            {
                var sales = res.data.Data;
                $scope.unitColl = sales.FixedUnitColl;
                LastMonthAnalysis(sales.Last3MonthIdColl, sales.Last3MonthSalesAnalysisColl)
                LastMonthCurTopAnalysis(sales.Last3MonthIdColl, sales.Last3MonthCurTopSalesAnalysisColl)
                SalesProjectionVSSales(sales.ProjectionVSSalesColl);
            } else
                alert(res.data.ResponseMSG);

            $scope.loadingstatus = 'stop';
        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    var salesAnalysisChart = null;

    function LastMonthAnalysis(monthIdColl,dataCOll)
    {
        var amtCol1 = [];
        var amtCol2 = [];
        var amtCol3 = [];
        var amtCol4 = [];
        var partyName = [];
        angular.forEach(dataCOll, function (beData) {

            if ($scope.dsaOrderBy == 1) {
                amtCol1.push(beData.Amount1.toFixed(3));
                amtCol2.push(beData.Amount2.toFixed(3));
                amtCol3.push(beData.Amount3.toFixed(3));
                amtCol4.push(beData.Amount4.toFixed(3));
            } else {
                amtCol1.push(beData.Qty1.toFixed(3));
                amtCol2.push(beData.Qty2.toFixed(3));
                amtCol3.push(beData.Qty3.toFixed(3));
                amtCol4.push(beData.Qty4.toFixed(3));
            }
            
            partyName.push(beData.Name);
        });

        var options = {
         
            series: [{
                name: bsMonths[monthIdColl[0]-1],
                type: 'column',
                data: amtCol1
            }, {
                    name: bsMonths[monthIdColl[1] - 1],
                type: 'column',
                data: amtCol2
            }, {
                    name: bsMonths[monthIdColl[2] - 1],
                type: 'column',
                data: amtCol3
            }, {
                    name: bsMonths[monthIdColl[3] - 1],
                type: 'line',
                data: amtCol4
            },],
            chart: {
                height: 450,
                type: 'line',
                stacked: false,
            },
            stroke: {
                width: [0, 0, 0, 4],
                curve: 'smooth'
            },

            colors: ['#5e9ad3', '#ec7c34', '#a5a5a5', '#fcba3b'],
            title: {
                text: '',
                align: 'left',
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%'
                }
            },

            fill: {
                opacity: [1, 1, 1, 1],
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    type: "vertical",
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                    stops: [0, 100, 100, 100]
                }
            },
            labels: partyName,
            markers: {
                size: 0
            },
            xaxis: {
                type: 'category'
            },
            yaxis: {
                title: {
                    text: '',
                },
                axisBorder: {
                    show: false,
                    color: '#008FFB'
                },
                min: 0
            },
            dataLabels: {
                enabled: true,
                enabledOnSeries: [3],
                offsetX: 0,
                style: {
                    fontSize: '12px',
                    colors: undefined
                },
                background: {
                    enabled: true,
                    foreColor: '#fff',
                    padding: 4,
                    borderRadius: 2,
                    borderWidth: undefined,
                    borderColor: undefined,
                    opacity: 1,
                    dropShadow: {
                        enabled: false,
                        top: 1,
                        left: 1,
                        blur: 1,
                        color: '#000',
                        opacity: 0.45
                    }
                },
            },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: function (y) {
                        if (typeof y !== "undefined") {
                            return y.toFixed(3);
                        }
                        return y;

                    }
                }
            }
        };

        if (salesAnalysisChart) {
            salesAnalysisChart.updateOptions(options);

        } else {
            salesAnalysisChart = new ApexCharts(document.querySelector("#chart3"), options);
            salesAnalysisChart.render();
        }


        //var chart = new ApexCharts(document.querySelector("#chart3"), options);
        //chart.render();
    }

    var lastMonthTopChart = null;

    function LastMonthCurTopAnalysis(monthIdColl, dataCOll) {
        var amtCol1 = [];
        var amtCol2 = [];
        var amtCol3 = [];
        var amtCol4 = [];
        var partyName = [];
        angular.forEach(dataCOll, function (beData) {

            if ($scope.lastPurchaseOrderBy == 2) {
                amtCol1.push(beData.Amount1.toFixed(2));
                amtCol2.push(beData.Amount2.toFixed(2));
                amtCol3.push(beData.Amount3.toFixed(2));
                amtCol4.push(beData.Amount4.toFixed(2));

            } else {
                amtCol1.push(beData.Qty1.toFixed(2));
                amtCol2.push(beData.Qty2.toFixed(2));
                amtCol3.push(beData.Qty3.toFixed(2));
                amtCol4.push(beData.Qty4.toFixed(2));
            }
            
            partyName.push(beData.Name);
        });

        var options = {
            series: [{
                name: bsMonths[monthIdColl[0] - 1],
                type: 'column',
                data: amtCol1
            }, {
                name: bsMonths[monthIdColl[1] - 1],
                type: 'column',
                data: amtCol2
            }, {
                name: bsMonths[monthIdColl[2] - 1],
                type: 'column',
                data: amtCol3
            }, {
                name: bsMonths[monthIdColl[3] - 1],
                type: 'line',
                data: amtCol4
            },],
            chart: {
                height: 450,
                type: 'line',
                stacked: false,
            },
            stroke: {
                width: [0, 0, 0, 4],
                curve: 'smooth'
            },

            colors: ['#5e9ad3', '#ec7c34', '#a5a5a5', '#fcba3b'],
            title: {
                text: "",
                align: 'left',
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%'
                }
            },

            fill: {
                opacity: [1, 1, 1, 1],
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    type: "vertical",
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                    stops: [0, 100, 100, 100]
                }
            },
            labels: partyName,
            markers: {
                size: 0
            },
            xaxis: {
                type: 'category'
            },
            yaxis: {
                title: {
                    text: '',
                },
                axisBorder: {
                    show: false,
                    color: '#008FFB'
                },
                min: 0
            },
            dataLabels: {
                enabled: true,
                enabledOnSeries: [3],
                offsetX: 0,
                style: {
                    fontSize: '12px',
                    colors: undefined
                },
                background: {
                    enabled: true,
                    foreColor: '#fff',
                    padding: 4,
                    borderRadius: 2,
                    borderWidth: undefined,
                    borderColor: undefined,
                    opacity: 1,
                    dropShadow: {
                        enabled: false,
                        top: 1,
                        left: 1,
                        blur: 1,
                        color: '#000',
                        opacity: 0.45
                    }
                },
            },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: function (y) {
                        if (typeof y !== "undefined") {
                            return y.toFixed(2);
                        }
                        return y;

                    }
                }
            }
        };

        if (lastMonthTopChart) {
            lastMonthTopChart.updateOptions(options);

        } else {
            lastMonthTopChart = new ApexCharts(document.querySelector("#chart4"), options);
            lastMonthTopChart.render();
        }

        
    }

    function SalesProjectionVSSales(dataCOll) {

        var projectData = [];
        var salesData = [];
        var productList = [];
        var diffData = [];
        angular.forEach(dataCOll, function (beData) {
            projectData.push(beData.PQty.toFixed(2));
            salesData.push(beData.SQty.toFixed(2));
            diffData.push((beData.PQty - beData.SQty).toFixed(2));
            productList.push(beData.Name);
        });
        var options = {

            series: [{
                name: 'Projection',
                type: 'column',
                data: projectData
            }, {
                name: 'Sales',
                type: 'column',
                    data: salesData
            }],
            chart: {
                height: 450,
                type: 'line',
                stacked: false,
            },
            stroke: {
                width: [0, 0, 0, 4],
                curve: 'smooth'
            },

            colors: ['#5e9ad3', '#ec7c34', '#a5a5a5', '#fcba3b'],
            title: {
                text: '',
                align: 'left',
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%'
                }
            },

            fill: {
                opacity: [1, 1, 1, 1],
                gradient: {
                    inverseColors: false,
                    shade: 'light',
                    type: "vertical",
                    opacityFrom: 0.85,
                    opacityTo: 0.55,
                    stops: [0, 100, 100, 100]
                }
            },
            labels: productList,
            markers: {
                size: 0
            },
            xaxis: {
                type: 'category'
            },
            yaxis: {
                title: {
                    text: '',
                },
                axisBorder: {
                    show: false,
                    color: '#008FFB'
                },
                min: 0
            },
            dataLabels: {
                enabled: true,
               // enabledOnSeries: [3],
                offsetX: 0,
                style: {
                    fontSize: '12px',
                    colors: undefined
                },
                background: {
                    enabled: true,
                    foreColor: '#fff',
                    padding: 4,
                    borderRadius: 2,
                    borderWidth: undefined,
                    borderColor: undefined,
                    opacity: 1,
                    dropShadow: {
                        enabled: false,
                        top: 1,
                        left: 1,
                        blur: 1,
                        color: '#000',
                        opacity: 0.45
                    }
                },
            },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: function (y) {
                        if (typeof y !== "undefined") {
                            return y.toFixed(3);
                        }
                        return y;

                    }
                }
            }
        };

        salesProjectionChart = new ApexCharts(document.querySelector("#salesPVs"), options);
        salesProjectionChart.render();
    }

    $scope.GetLastMonthAnalysis = function (OrderBy) {

        if (!OrderBy || OrderBy == null)
            OrderBy = 1;
      
        $http({
            method: 'POST',
            url: base_url + "DashBoard/Inventory/GetSalesDashBoardDetails19?OrderBy=" + OrderBy,
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data)
            {
                var sales = res.data.Data;
                LastMonthAnalysis(sales.Last3MonthIdColl, sales.Last3MonthSalesAnalysisColl);

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });


    }
    $scope.GetLastMonthCurTopAnalysis = function (OrderBy) {
        if (!OrderBy || OrderBy == null)
            OrderBy = 1;

        $http({
            method: 'POST',
            url: base_url + "DashBoard/Inventory/GetSalesDashBoardDetails20?OrderBy=" + OrderBy,
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var sales = res.data.Data;
                LastMonthCurTopAnalysis(sales.Last3MonthCurIdColl, sales.Last3MonthCurTopSalesAnalysisColl);

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.GetProductBrandWise = function (ProductBrand) {

        if (!ProductBrand || ProductBrand == null)
            ProductBrand = $scope.selectedBrand;
        else
            $scope.selectedBrand = ProductBrand;

        $http({
            method: 'POST',
            url: base_url + "DashBoard/Inventory/GetProductBrandWise?ProductBrandId=" + ProductBrand.ProductBrandId+"&Top=10&UnitId="+$scope.BrandUnitId,
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var dataCOll = res.data.Data;

                var amtCol1 = [];
                var amtCol2 = [];
                var amtCol3 = [];                
                var productName = [];
                angular.forEach(dataCOll, function (beData) {

                    if ($scope.BrandUnitId == 0) {

                        amtCol1.push(beData.LastMonthQty.toFixed(2));
                        amtCol2.push(beData.TillDateQty.toFixed(2));
                        amtCol3.push(beData.CurMonthQty.toFixed(2));
                    } else {

                        amtCol1.push(beData.LastMonthQty1.toFixed(2));
                        amtCol2.push(beData.TillDateQty1.toFixed(2));
                        amtCol3.push(beData.CurMonthQty1.toFixed(2));                    
                    }
                    productName.push(beData.Name);
                });

                var options = {
                    series: [{
                        name: "Sum of Till Date",
                        data: amtCol2
                    }, {
                            name: "Sum of Last Month Till Date",
                            data: amtCol1
                    }, {
                        name: "Sum of Curent Month",
                        data: amtCol3
                    }],
                    chart: {
                        height: 400,
                        type: 'line',
                        zoom: {
                            enabled: false
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'straight'
                    },
                    colors: ['#5e9ad3', '#ec7c34', '#a5a5a5'],
                    dataLabels: {
                        enabled: true,
                    },
                    title: {
                        text:'',
                        //text: 'Top 10 Product Sales Qty Of Brand '+ProductBrand.Name,
                        align: 'left'
                    },
                    grid: {
                        row: {
                            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                            opacity: 0.5
                        },
                    },
                    xaxis: {
                        categories: productName,
                    }
                };

                if (brandChart) {
                    brandChart.updateOptions(options);
                    
                } else {
                    brandChart = new ApexCharts(document.querySelector("#chart"), options);
                    brandChart.render();
                }
                




            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
            });

      

    }

    var salesProjectionChart = null;
    $scope.GetSalesProjectionVSSales = function (unitid) {     

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "DashBoard/Inventory/GetSalesProjectVSSales?UnitId=" + unitid + "&AgentId=" + $scope.ProjectionAgentId + "&DateFrom=" + ($filter('date')($scope.SelectMonthDet.DateFrom, 'yyyy-MM-dd')) + "&DateTo=" + ($filter('date')($scope.SelectMonthDet.DateTo, 'yyyy-MM-dd')) ,
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data)
            {
                var dataCOll = res.data.Data;

                var projectData = [];
                var salesData = [];
                var productList = [];
                var diffData = [];
                angular.forEach(dataCOll, function (beData) {

                    if (unitid != 0 && unitid!=-1) {
                        projectData.push(beData.FXStd_PQty.toFixed(2));
                        salesData.push(beData.FXStd_SQty.toFixed(2));
                        diffData.push((beData.FXStd_PQty - beData.FXStd_SQty).toFixed(2));
                    } else if (unitid == -1) {
                        projectData.push(beData.PAmount.toFixed(3));
                        salesData.push(beData.SAmount.toFixed(3));
                        diffData.push((beData.PAmount - beData.SAmount).toFixed(3));
                    }
                    else {
                        projectData.push(beData.PQty.toFixed(2));
                        salesData.push(beData.SQty.toFixed(2));
                        diffData.push((beData.PQty - beData.SQty).toFixed(2));
                    }

                    
                    productList.push(beData.Name);
                });
                var options = {

                    series: [{
                        name: 'Projection',
                        type: 'column',
                        data: projectData
                    }, {
                        name: 'Sales',
                        type: 'column',
                        data: salesData
                    }],
                    chart: {
                        height: 450,
                        type: 'line',
                        stacked: false,
                    },
                    stroke: {
                        width: [0, 0, 0, 4],
                        curve: 'smooth'
                    },

                    colors: ['#5e9ad3', '#ec7c34', '#a5a5a5', '#fcba3b'],
                    title: {
                        text: '',
                        align: 'left',
                    },
                    plotOptions: {
                        bar: {
                            columnWidth: '50%'
                        }
                    },

                    fill: {
                        opacity: [1, 1, 1, 1],
                        gradient: {
                            inverseColors: false,
                            shade: 'light',
                            type: "vertical",
                            opacityFrom: 0.85,
                            opacityTo: 0.55,
                            stops: [0, 100, 100, 100]
                        }
                    },
                    labels: productList,
                    markers: {
                        size: 0
                    },
                    xaxis: {
                        type: 'category'
                    },
                    yaxis: {
                        title: {
                            text: '',
                        },
                        axisBorder: {
                            show: false,
                            color: '#008FFB'
                        },
                        min: 0
                    },
                    dataLabels: {
                        enabled: true,
                        // enabledOnSeries: [3],
                        offsetX: 0,
                        style: {
                            fontSize: '12px',
                            colors: undefined
                        },
                        background: {
                            enabled: true,
                            foreColor: '#fff',
                            padding: 4,
                            borderRadius: 2,
                            borderWidth: undefined,
                            borderColor: undefined,
                            opacity: 1,
                            dropShadow: {
                                enabled: false,
                                top: 1,
                                left: 1,
                                blur: 1,
                                color: '#000',
                                opacity: 0.45
                            }
                        },
                    },
                    tooltip: {
                        shared: true,
                        intersect: false,
                        y: {
                            formatter: function (y) {
                                if (typeof y !== "undefined") {
                                    return y.toFixed(3);
                                }
                                return y;

                            }
                        }
                    }
                };

                if (salesProjectionChart) {
                    salesProjectionChart.updateOptions(options);

                } else {
                    salesProjectionChart = new ApexCharts(document.querySelector("#salesPVs"), options);
                    salesProjectionChart.render();
                }

            } else
                alert(res.data.ResponseMSG);

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

});

app.controller('salesAnalysisDetDashboardController', function ($scope, $http,$filter, companyDet) {
    LoadData();

    function Numberformat(val)
    {
        return $filter('number')(val, 2);
    }

    $scope.DataColl = [];
    
    function LoadData() {

        var columnDefs = [
            { headerName: "S.No.", field: "SNo", filter: 'agNumberColumnFilter', width: 70, pinned: 'left', cellStyle: { 'text-align': 'center' } },
            { headerName: "Name", field: "Name", filter: "agTextColumnFilter", width: 170, pinned: 'left', enableRowGroup: true, pivot: true },
            { headerName: "Group", field: "GroupName", filter: 'agTextColumnFilter', width: 140, enableRowGroup: true, pivot: true },
            { headerName: "SalesMan", field: "SalesMan", filter: 'agTextColumnFilter', width: 170, enableRowGroup: true, pivot: true },
            { headerName: "Amt1", field: "Amount1", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Amt2", field: "Amount2", filter: 'agNumberColumnFilter', width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Amt3", field: "Amount3", filter: 'agNumberColumnFilter', width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Amt4", field: "Amount4", filter: 'agNumberColumnFilter', width: 130, cellStyle: { 'text-align': 'right', valueFormatter: function (params) { return Numberformat(params.value); } }},
            { headerName: "Avg Amount", field: "Avg_Amount", filter: 'agNumberColumnFilter', width: 130, cellStyle: { 'text-align': 'right', valueFormatter: function (params) { return Numberformat(params.value); } } }        
        ];


        $scope.gridOptions = {
            //angularCompileRows: true,
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
            rowSelection: 'multiple',
            columnDefs: columnDefs,
            rowData: null,
            filter: true,
            //suppressHorizontalScroll: true,
            alignedGrids: [],
            enableFilter: true

        };

        // lookup the container we want the Grid to use
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);
    }


    $scope.GetLastMonthSalesAnalysis = function ()
    {

        $scope.loadingstatus = 'running';
        $scope.DataColl = []; //declare an empty array
      
        $http({
            method: 'POST',
            url: base_url + "DashBoard/Inventory/GetSalesDashBoardDetails1",
            dataType: "json"            
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data)
            {
                var sales = res.data.Data.Last3MonthSalesAnalysisColl;
                var monthIdColl = res.data.Data.Last3MonthIdColl;

                $scope.DataColl = sales;

                $scope.gridOptions.api.getColumnDef("Amount1").headerName = bsMonths[monthIdColl[0] - 1];
                $scope.gridOptions.api.getColumnDef("Amount2").headerName = bsMonths[monthIdColl[1] - 1];
                $scope.gridOptions.api.getColumnDef("Amount3").headerName = bsMonths[monthIdColl[2] - 1];
                $scope.gridOptions.api.getColumnDef("Amount4").headerName = bsMonths[monthIdColl[3] - 1];
                $scope.gridOptions.api.refreshHeader();
                $scope.gridOptions.api.setRowData(sales);

                $scope.loadingstatus = 'stop';

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    $scope.onBtExport = function () {
        var params = {
            fileName: 'data.csv',
            sheetName: 'data'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
});

app.controller('salesAnalysisDetDashboardController1', function ($scope, $http, $filter, companyDet) {
    LoadData();

    function Numberformat(val) {
        return $filter('number')(val, 2);
    }

    $scope.DataColl = [];

    function LoadData() {

        var columnDefs = [
            { headerName: "S.No.", field: "SNo", filter: 'agNumberColumnFilter', width: 70, pinned: 'left', cellStyle: { 'text-align': 'center' } },
            { headerName: "Name", field: "Name", filter: "agTextColumnFilter", width: 170, pinned: 'left' },
            { headerName: "Group", field: "GroupName", filter: 'agTextColumnFilter', width: 140 },
            { headerName: "SalesMan", field: "SalesMan", filter: 'agTextColumnFilter', width: 170 },
            { headerName: "Qty1", field: "Qty1", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Qty2", field: "Qty2", filter: 'agNumberColumnFilter', width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Qty3", field: "Qty3", filter: 'agNumberColumnFilter', width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Qty4", field: "Qty4", filter: 'agNumberColumnFilter', width: 130, cellStyle: { 'text-align': 'right', valueFormatter: function (params) { return Numberformat(params.value); } } },
            { headerName: "Avg Qty", field: "Avg_Qty", filter: 'agNumberColumnFilter', width: 130, cellStyle: { 'text-align': 'right', valueFormatter: function (params) { return Numberformat(params.value); } } }
        ];


        $scope.gridOptions = {
            //angularCompileRows: true,
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
            rowSelection: 'multiple',
            columnDefs: columnDefs,
            rowData: null,
            filter: true,
            //suppressHorizontalScroll: true,
            alignedGrids: [],
            enableFilter: true

        };

        // lookup the container we want the Grid to use
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);
    }


    $scope.GetLastMonthSalesAnalysis = function () {

        $scope.loadingstatus = 'running';
        $scope.DataColl = []; //declare an empty array

        $http({
            method: 'POST',
            url: base_url + "DashBoard/Inventory/GetSalesDashBoardDetails2",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var sales = res.data.Data.Last3MonthSalesAnalysisColl;
                var monthIdColl = res.data.Data.Last3MonthIdColl;

                $scope.DataColl = sales;

                $scope.gridOptions.api.getColumnDef("Qty1").headerName = bsMonths[monthIdColl[0] - 1];
                $scope.gridOptions.api.getColumnDef("Qty2").headerName = bsMonths[monthIdColl[1] - 1];
                $scope.gridOptions.api.getColumnDef("Qty3").headerName = bsMonths[monthIdColl[2] - 1];
                $scope.gridOptions.api.getColumnDef("Qty4").headerName = bsMonths[monthIdColl[3] - 1];
                $scope.gridOptions.api.refreshHeader();
                $scope.gridOptions.api.setRowData(sales);

                $scope.loadingstatus = 'stop';

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    $scope.onBtExport = function () {
        var params = {
            fileName: 'data.csv',
            sheetName: 'data'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
});

app.controller('salesAnalysisProductBrandWiseController', function ($scope, $http, $filter, companyDet) {
    LoadData();

   
    function Numberformat(val) {
        return $filter('number')(val, 2);
    }

    $scope.DataColl = [];
    $scope.ProductBrandColl = [];

    function LoadData()
    {

        // Load All Product Brand List
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductBrand",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductBrandColl = res.data.Data;

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

        var columnDefs = [
            { headerName: "S.No.", field: "SNo", filter: 'agNumberColumnFilter', width: 70, pinned: 'left', cellStyle: { 'text-align': 'center' } },
            { headerName: "Name", field: "Name", filter: "agTextColumnFilter", width: 170, pinned: 'left' },
            { headerName: "Group", field: "GroupName", filter: 'agTextColumnFilter', width: 140 },
            { headerName: "Brand", field: "ProductBrand", filter: 'agTextColumnFilter', width: 170 },           
            { headerName: "LastMonthAmt", field: "LasMonthAmt", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "LastMonthQty", field: "LastMonthQty", filter: 'agNumberColumnFilter', width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Unit", field: "BaseUnit", filter: 'agTextColumnFilter', width: 170 },
            { headerName: "LastMonthQty1", field: "LastMonthQty1", filter: 'agNumberColumnFilter', width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Unit", field: "AlternetUnit", filter: 'agTextColumnFilter', width: 170 },
            { headerName: "TillDateAmt", field: "TillDateAmt", filter: 'agNumberColumnFilter', width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "TillDateQty", field: "TillDateQty", filter: 'agNumberColumnFilter', width: 130, cellStyle: { 'text-align': 'right', valueFormatter: function (params) { return Numberformat(params.value); } } },
            { headerName: "Unit", field: "BaseUnit", filter: 'agTextColumnFilter', width: 170 },
            { headerName: "TillDateQty1", field: "TillDateQty1", filter: 'agNumberColumnFilter', width: 130, cellStyle: { 'text-align': 'right', valueFormatter: function (params) { return Numberformat(params.value); } } },
            { headerName: "Unit", field: "AlternetUnit", filter: 'agTextColumnFilter', width: 170 },
        ];

        $scope.gridOptions = {
            //angularCompileRows: true,
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
            rowSelection: 'multiple',
            columnDefs: columnDefs,
            rowData: null,
            filter: true,
            //suppressHorizontalScroll: true,
            alignedGrids: [],
            enableFilter: true

        };

        // lookup the container we want the Grid to use
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        GetProductBrandWise();
    }

    function GetProductBrandWise()
    {

        $http({
            method: 'POST',
            url: base_url + "DashBoard/Inventory/GetProductBrandWise?ProductBrandId=" +  ProductBrandId + "&Top=9999&UnitId="+UnitId,
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;

                $scope.gridOptions.api.setRowData($scope.DataColl);


            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });



    }

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    $scope.onBtExport = function () {
        var params = {
            fileName: 'data.csv',
            sheetName: 'data'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
});

app.controller('salesAnalysisDetDashboardController26', function ($scope, $http, $filter, companyDet) {
    LoadData();


    function Numberformat(val) {
        return $filter('number')(val, 2);
    }

    $scope.DataColl = [];
    
    function LoadData() {


        var columnDefs = [
            { headerName: "S.No.", field: "SNo", filter: 'agNumberColumnFilter', width: 70, pinned: 'left', cellStyle: { 'text-align': 'center' } },
            { headerName: "Name", field: "Name", filter: "agTextColumnFilter", width: 170, pinned: 'left' },
            { headerName: "Group", field: "GroupName", filter: 'agTextColumnFilter', width: 140 },
            { headerName: "Brand", field: "BrandName", filter: 'agTextColumnFilter', width: 170 },
            { headerName: "P.Amount", field: "PAmount", filter: 'agNumberColumnFilter', width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "P.Qty", field: "PQty", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },            
            { headerName: "Unit", field: "BaseUnit", filter: 'agTextColumnFilter', width: 170 },
            { headerName: "S.Amount", field: "SAmount", filter: 'agNumberColumnFilter', width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "S.Qty", field: "SQty", filter: 'agNumberColumnFilter', width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Unit", field: "AlternetUnit", filter: 'agTextColumnFilter', width: 170 },
            { headerName: "P.Qty1", field: "FXStd_PQty", filter: 'agNumberColumnFilter', width: 130, cellStyle: { 'text-align': 'right', valueFormatter: function (params) { return Numberformat(params.value); } } },
            { headerName: "Unit", field: "AlternetUnit", filter: 'agTextColumnFilter', width: 170 },
            {
                headerName: "S.Qty1", field: "FXStd_SQty", filter: 'agNumberColumnFilter', width: 130, cellStyle: {
                    'text-align': 'right', valueFormatter: function (params)
                    {
                        return Numberformat(params.value);
                    }
                }
            },
            { headerName: "Unit", field: "AlternetUnit", filter: 'agTextColumnFilter', width: 170 },
        ];

        $scope.gridOptions = {
            //angularCompileRows: true,
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
            rowSelection: 'multiple',
            columnDefs: columnDefs,
            rowData: null,
            filter: true,
            //suppressHorizontalScroll: true,
            alignedGrids: [],
            enableFilter: true

        };

        // lookup the container we want the Grid to use
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        GetData();
    }

    function GetData() {

        $http({
            method: 'POST',
            url: base_url + "DashBoard/Inventory/GetSalesProjection?unitId=" + UnitId + "&agentId=" + AgentId+"&dateFrom="+DateFrom+"&DateTo="+DateTo,
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;

                $scope.gridOptions.api.setRowData($scope.DataColl);


            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });



    }

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    $scope.onBtExport = function () {
        var params = {
            fileName: 'data.csv',
            sheetName: 'data'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
});

