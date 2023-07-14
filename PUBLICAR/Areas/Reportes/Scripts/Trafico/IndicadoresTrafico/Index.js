$(document).ready(function () {
    var chart = null;
    //Fechas inicial y final
    $("#FechaInicial").datepicker();
    $("#FechaFinal").datepicker();

    //Estilo Totales

    var today = moment().format('DD/MM/YYYY');
    var mes = moment().subtract(30, 'days').format('DD/MM/YYYY');

    $("#FechaInicial").val(mes);
    $("#FechaFinal").val(today);

    //Check todas las empresas 
    $("#checkall").change(function () {
        $("input:checkbox").prop('checked', $(this).prop("checked"));
    });

    //Trae información de todas las empresas
    //#checkall activo
    $("#checkall").change(function () {
        if (this.checked) {
            BuscaEmpresa("0");
        }
        else {
            $("#PieChart").html("");
            $("#table_div").html("");
        }
    });


});

function BuscaEmpresa(empresaId)
{
    if (empresaId === "" || empresaId === null) {
        return;
    }
    //Google Chart
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(function () {
        PintaEmpresa(empresaId);
    });
}

function SeleccionaEmpresaUnica(valor) {
    var empresaId = []
    $("input:checkbox").each(function () {
        if ($(this).is(":checked"))
            empresaId.push($(this).val());
    });

    if (empresaId.length == 0) {
        $("#PieChart").html("");
        $("#table_div").html("");
        return;
    }
    else
        BuscaEmpresa(empresaId);
}

function PintaEmpresa(empresaId) {
    if (empresaId === "" || empresaId === null)
    {
        return;
    }
    $("#breadcrumb").html("<li>OTS EMPRESA</li>");
    var x = "";
    for (i in empresaId)
        x += empresaId[i] + ",";
    x = x.substring(0, x.length - 1); 
    var URL_LISTAR_OT_POR_EMPRESA = '/Reportes/IndicadoresTrafico/PintaEmpresa';

    var parameters = {
        empresaId: x,
        FechaInicial: $("#FechaInicial").val(),
        FechaFinal: $("#FechaFinal").val()
    };
    RequestHttp._Post(URL_LISTAR_OT_POR_EMPRESA, parameters, null, function (responseData) {
        if (responseData !== null) {
            //Piechart
            x = [];
            x.push(["Empresa", "Cantidad", "Id"]);
            for (i in responseData.data) {
                x.push([responseData.data[i].indexLabel, responseData.data[i].y, responseData.data[i].id]);
            }
            var data = google.visualization.arrayToDataTable(x);
            
            var options = {
                title: 'OTS EMPRESA'
            };
            var chart = new google.visualization.PieChart(document.getElementById('PieChart'));
            chart.draw(data, options);

            //Selecciona empresa para mostrar
            //Estados de OT
            function clickHander() {

                var selectedItem = chart.getSelection()[0];
                if (selectedItem) {
                    var empresaId = data.getValue(selectedItem.row, 2);
                    listaEstadosOt(empresaId);
                }
            }
            google.visualization.events.addListener(chart, 'select', clickHander);

            //Tabla
            google.charts.load('current', { 'packages': ['table'] });
            google.charts.setOnLoadCallback(drawTable);

            function drawTable() {
                x = [];
                x.push(["Empresa", "Cantidad","Porcentaje"]);
                SumaY = 0;
                for (i in responseData.data) {
                    SumaY += responseData.data[i].y;
                }
                for (i in responseData.data) {
                    var porcentaje;
                    porcentaje = ((responseData.data[i].y * 100) / SumaY);
                    porcentaje = parseFloat(porcentaje).toFixed(2) + " %";
                    x.push([responseData.data[i].indexLabel, responseData.data[i].y, porcentaje]);
                }
                x.push([{
                    v: 'TOTAL',
                    p: {
                        className: 'Totales'
                    }
                }, SumaY, "100 %"]);
                var data = google.visualization.arrayToDataTable(x);

                var table = new google.visualization.Table(document.getElementById('table_div'));

                table.draw(data, { showRowNumber: true, width: '100%', height: '100%' });
                $(".Totales").parent().css({ "color": "red", "font-weight": "bolder" });
            }
        }

    })
}

function listaEstadosOt(empresaId)
{
    $("#breadcrumb").html("<li><a href = 'javascript:void(0)' onclick = 'SeleccionaEmpresaUnica(" + empresaId + ")'>OTS EMPRESA</a></li >");
    $("#breadcrumb").append("<li>ESTADOS OT POR EMPRESA</li>");
    var URL_LISTAR_ESTADOS_OT = '/Reportes/IndicadoresTrafico/ListarEstadosOt';
    var parameters = {
        empresaId: empresaId,
        FechaInicial: $("#FechaInicial").val(),
        FechaFinal: $("#FechaFinal").val()
    };
    RequestHttp._Post(URL_LISTAR_ESTADOS_OT, parameters, null, function (responseData) {
        if (responseData !== null) {
            //Tabla
            x = [];
            x.push(["Estado", "Cantidad", "IdEmpresa", "IdEstado"]);
            for (i in responseData.data) {
                x.push([responseData.data[i].indexLabel, responseData.data[i].y, responseData.data[i].val1, responseData.data[i].val2]);
            }

            var data = google.visualization.arrayToDataTable(x);

            var options = {
                title: 'ESTADOS OT POR EMPRESA'
            };
            var chart = new google.visualization.PieChart(document.getElementById('PieChart'));
            chart.draw(data, options);

            function clickHander() {

                var selectedItem = chart.getSelection()[0];
                if (selectedItem) {
                    var empresaId = data.getValue(selectedItem.row, 2);
                    var estadoOt = data.getValue(selectedItem.row, 3);
                    listaClientesPorEstado(empresaId, estadoOt);
                }
            }

            google.visualization.events.addListener(chart, 'select', clickHander);

            //Tabla
            google.charts.load('current', { 'packages': ['table'] });
            google.charts.setOnLoadCallback(drawTable);

            function drawTable() {
                x = [];
                x.push(["Estado", "Cantidad","Porcentaje"]);
                SumaY = 0;
                for (i in responseData.data) {
                    SumaY += responseData.data[i].y;
                }
                for (i in responseData.data) {
                    var porcentaje;
                    porcentaje = ((responseData.data[i].y * 100) / SumaY);
                    porcentaje = parseFloat(porcentaje).toFixed(2) + " %";
                    x.push([responseData.data[i].indexLabel, responseData.data[i].y, porcentaje]);
                }
                x.push([{
                    v: 'TOTAL',
                    p: {
                        className: 'Totales'
                    }
                }, SumaY, "100 %"]);
                var data = google.visualization.arrayToDataTable(x);

                var table = new google.visualization.Table(document.getElementById('table_div'));

                table.draw(data, { showRowNumber: true, width: '100%', height: '100%' });
                $(".Totales").parent().css({ "color": "red", "font-weight": "bolder" });
            }
            
        }
    });
}

function listaClientesPorEstado(empresaId, estadoOt)
{
    $("#breadcrumb").html("<li><a href = 'javascript:void(0)' onclick = 'SeleccionaEmpresaUnica(" + empresaId + ")'>OTS EMPRESA</a></li >");
    $("#breadcrumb").append("<li><a href = 'javascript:void(0)' onclick = 'listaEstadosOt(" + empresaId + ")'>ESTADOS OT POR EMPRESA</a></li>");
    $("#breadcrumb").append("<li>CLIENTES OTS</li>");
    var URL_LISTAR_CLIENTES_POR_ESTADO = '/Reportes/IndicadoresTrafico/ListarClientesEstadosOt';
    var parameters = {
        empresaId: empresaId,
        estadoOt: estadoOt,
        FechaInicial: $("#FechaInicial").val(),
        FechaFinal: $("#FechaFinal").val()
    };
    RequestHttp._Post(URL_LISTAR_CLIENTES_POR_ESTADO, parameters, null, function (responseData) {
        if (responseData !== null) {
            x = [];
            x.push(["Cliente", "Cantidad", "IdEmpresa", "IdCliente", "Estado"]);
            for (i in responseData.data) {
                x.push([responseData.data[i].indexLabel, responseData.data[i].y, responseData.data[i].val1, responseData.data[i].val2, estadoOt]);
            }

            var data = google.visualization.arrayToDataTable(x);

            var options = {
                title: 'CLIENTES OTS'
            };
            var chart = new google.visualization.PieChart(document.getElementById('PieChart'));
            chart.draw(data, options);

            function clickHander() {

                var selectedItem = chart.getSelection()[0];
                if (selectedItem) {
                    var empresaId = data.getValue(selectedItem.row, 2);
                    var IdCliente = data.getValue(selectedItem.row, 3);
                    var estadoOt = data.getValue(selectedItem.row, 4);
                    listaAsesoresPorCliente(empresaId, IdCliente, estadoOt);
                }
            }

            google.visualization.events.addListener(chart, 'select', clickHander);
            //Tabla
            google.charts.load('current', { 'packages': ['table'] });
            google.charts.setOnLoadCallback(drawTable);

            function drawTable() {
                x = [];
                x.push(["Cliente", "Cantidad","Porcentaje"]);
                SumaY = 0;
                for (i in responseData.data) {
                    SumaY += responseData.data[i].y;
                }
                for (i in responseData.data) {
                    var porcentaje;
                    porcentaje = ((responseData.data[i].y * 100) / SumaY);
                    porcentaje = parseFloat(porcentaje).toFixed(2) + " %";
                    x.push([responseData.data[i].indexLabel, responseData.data[i].y, porcentaje]);
                }
                x.push([{
                    v: 'TOTAL',
                    p: {
                        className: 'Totales'
                    }
                }, SumaY, "100 %"]);
                var data = google.visualization.arrayToDataTable(x);

                var table = new google.visualization.Table(document.getElementById('table_div'));

                table.draw(data, { showRowNumber: true, width: '100%', height: '100%' });
                $(".Totales").parent().css({ "color": "red", "font-weight": "bolder" });
            }
        }
    });
}

function listaAsesoresPorCliente(empresaId, IdCliente, estadoOt)
{
    $("#breadcrumb").html("<li><a href = 'javascript:void(0)' onclick = 'SeleccionaEmpresaUnica(" + empresaId + ")'>OTS EMPRESA</a></li >");
    $("#breadcrumb").append("<li><a href = 'javascript:void(0)' onclick = 'listaEstadosOt(" + empresaId + ")'>ESTADOS OT POR EMPRESA</a></li>");
    $("#breadcrumb").append("<li><a href = 'javascript:void(0)' onclick = 'listaClientesPorEstado(" + empresaId + "," + estadoOt + ")'>CLIENTES OTS</a></li>");
    $("#breadcrumb").append("<li>EJECUTIVOS POR OTS</li>");
    var URL_LISTAR_ASESORES_POR_CLIENTE = '/Reportes/IndicadoresTrafico/ListaAsesoresPorCliente';
    var parameters = {
        empresaId: empresaId,
        IdCliente: IdCliente,
        estadoOt: estadoOt,
        FechaInicial: $("#FechaInicial").val(),
        FechaFinal: $("#FechaFinal").val()
    };
    RequestHttp._Post(URL_LISTAR_ASESORES_POR_CLIENTE, parameters, null, function (responseData) {
        if (responseData !== null) {
            //PieChart
            x = [];
            x.push(["Cliente", "Cantidad", "IdEmpresa", "IdAsesor"]);
            for (i in responseData.data) {
                x.push([responseData.data[i].indexLabel, responseData.data[i].y, responseData.data[i].val1, responseData.data[i].val2]);
            }
            var data = google.visualization.arrayToDataTable(x);

            var options = {
                title: 'EJECUTIVOS POR OTS'
            };
            var chart = new google.visualization.PieChart(document.getElementById('PieChart'));
            chart.draw(data, options);

            function clickHander() {
                var selectedItem = chart.getSelection()[0];
                if (selectedItem) {
                    var empresaId = data.getValue(selectedItem.row, 2);
                    var IdAsesor = data.getValue(selectedItem.row, 3);
                    ListarOtPorAsesores(empresaId, IdAsesor, estadoOt, IdCliente);
                }
            }

            google.visualization.events.addListener(chart, 'select', clickHander);

            //Tabla
            google.charts.load('current', { 'packages': ['table'] });
            google.charts.setOnLoadCallback(drawTable);

            function drawTable() {
                x = [];
                x.push(["Ejecutivo", "Cantidad", "Porcentaje"]);
                SumaY = 0;
                for (i in responseData.data) {
                    SumaY += responseData.data[i].y;
                }
                for (i in responseData.data) {
                    var porcentaje;
                    porcentaje = ((responseData.data[i].y * 100) / SumaY);
                    porcentaje = parseFloat(porcentaje).toFixed(2) + " %";
                    x.push([responseData.data[i].indexLabel, responseData.data[i].y, porcentaje]);
                }
                x.push([{
                    v: 'TOTAL',
                    p: {
                        className: 'Totales'
                    }
                }, SumaY, "100 %"]);
                var data = google.visualization.arrayToDataTable(x);
                
                var table = new google.visualization.Table(document.getElementById('table_div'));

                table.draw(data, { showRowNumber: true, width: '100%', height: '100%' });
                $(".Totales").parent().css({ "color": "red","font-weight":"bolder" });
            }
        }
    });
}

function ListarOtPorAsesores(empresaId, IdAsesor, estadoOt, IdCliente)
{
    $("#breadcrumb").html("<li><a href = 'javascript:void(0)' onclick = 'SeleccionaEmpresaUnica(" + empresaId + ")'>OTS EMPRESA</a></li >");
    $("#breadcrumb").append("<li><a href = 'javascript:void(0)' onclick = 'listaEstadosOt(" + empresaId + ")'>ESTADOS OT POR EMPRESA</a></li>");
    $("#breadcrumb").append("<li><a href = 'javascript:void(0)' onclick = 'listaClientesPorEstado(" + empresaId + "," + estadoOt + ")'>CLIENTES OTS</a></li>");
    $("#breadcrumb").append("<li><a href = 'javascript:void(0)' onclick = 'listaAsesoresPorCliente(" + empresaId + "," + IdCliente + "," + estadoOt + ")'>EJECUTIVOS POR OTS</a></li>");
    $("#breadcrumb").append("<li>OTS POR PRODUCTO</li>");

    var URL_LISTAR_ASESORES_POR_CLIENTE = '/Reportes/IndicadoresTrafico/ListarOtPorAsesores';
    var parameters = {
        empresaId: empresaId,
        IdAsesor: IdAsesor,
        estadoOt: estadoOt,
        IdCliente: IdCliente,
        FechaInicial: $("#FechaInicial").val(),
        FechaFinal: $("#FechaFinal").val()
    };
    RequestHttp._Post(URL_LISTAR_ASESORES_POR_CLIENTE, parameters, null, function (responseData) {
        if (responseData !== null) {
            x = [];
            x.push(["Cliente", "Cantidad", "IdEmpresa", "IdAsesor"]);
            for (i in responseData.data) {
                x.push([responseData.data[i].indexLabel, responseData.data[i].y, responseData.data[i].val1, responseData.data[i].val2]);
            }
            var data = google.visualization.arrayToDataTable(x);

            var options = {
                title: 'OTS POR PRODUCTO'
            };
            var chart = new google.visualization.PieChart(document.getElementById('PieChart'));
            chart.draw(data, options);

            //Tabla
            google.charts.load('current', { 'packages': ['table'] });
            google.charts.setOnLoadCallback(drawTable);

            function drawTable() {
                x = [];
                x.push(["Producto", "Cantidad", "Porcentaje"]);
                SumaY = 0;
                for (i in responseData.data) {
                    SumaY += responseData.data[i].y;
                }
                for (i in responseData.data) {
                    var porcentaje;
                    porcentaje = ((responseData.data[i].y * 100) / SumaY);
                    porcentaje = parseFloat(porcentaje).toFixed(2) + " %";
                    x.push([responseData.data[i].indexLabel, responseData.data[i].y, porcentaje]);
                }
                x.push([{
                    v: 'TOTAL',
                    p: {
                        className: 'Totales'
                    }
                }, SumaY, "100 %"]);
                var data = google.visualization.arrayToDataTable(x);

                var table = new google.visualization.Table(document.getElementById('table_div'));

                table.draw(data, { showRowNumber: true, width: '100%', height: '100%' });
                $(".Totales").parent().css({ "color": "red", "font-weight": "bolder" });
            }
        }
    });
}