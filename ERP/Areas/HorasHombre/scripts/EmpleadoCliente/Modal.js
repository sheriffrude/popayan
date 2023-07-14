$TABLA_CLIENTE = null;
function OnloadModal() {
    // TablaClientes();
    // PieClientes();
    if ($("input[type=radio][name=FiltroId]:checked").val() == 1) {
        PieClientes();
        TablaClientes();
    } else {
        PieClientesArea();
        TablaClientesArea();
    }

}




function PieClientes() {
    var fecha = '01/' + MES + '/' + ANIO;

    var parametros = {
        fecha: fecha,
        areaId: $("#EmpresaModalId").val(),
        filtro: $("input[type=radio][name=FiltroId]:checked").val(),
        datos: ARRAY_USUARIOSID,
        empresaId: $("#EmpresaModalId").val()
    };

    CanvasJS.addColorSet("greenShades",
               [//colorSet Array
               "#DAEEAF", "#FDBA4F", "#ACB9C9", "#FF8F47", "#D7E8BC", "#BBD38B", "#FFD46E", "#E3B0B0", "#B6EBE9", "#B2E1C0", "#EDDE7C", "#FFCE89", "#FC9D8C", "#B7AAF5", "#0CA7EF", "#9DDBF8", "#E4F0F5", "#B8D0DB", "#FFFFFF", "#C1ECFF", "#C6FFBA", "#FFF298"
               ]);
    $.ajax({
        url: URL_GRAFICA_PIE_CLIENTE,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (data) {
            obj = data;
            var tam = (obj.dataPoints.length);
            if (tam == 0) {
                $("#chartContainer_pie2").hide();
            }
            else {
                $("#chartContainer_pie2").show();
                var chart = new CanvasJS.Chart("chartContainer_pie2", {
                    colorSet: "greenShades",
                    title: {
                        text: "Grafica"
                    },
                    data: [obj]
                });
                chart.render();
            }

        }
    });
}



function TablaClientes() {
    var SUM = 0;
    var SUMPORCENT = 0;
    var SUMHORAS = 0;
    var $filtro = $("#input-filtro");
    var fecha = '01/' + MES + '/' + ANIO;
    if ($TABLA_CLIENTE != null) {
        $TABLA_CLIENTE.destroy();
    }

    $TABLA_REPORTE = $("#tabla-Clientes").DataTable({
        "info": false,
        "bPaginate": false,
        "ajax": {
            "url": URL_CLIENTE,
            "type": "POST",

            "data": function (d) {
                d.search['value'] = $filtro.val();
                d.fecha = '01/' + MES + '/' + anioId;
                d.empresaId = $("#EmpresaModalId").val();
                d.datos = ARRAY_USUARIOSID;
                return $.extend({}, d, {
                    "adicional": {}
                });
            },

        }, "columns": [
            {
                "data": "Empresa",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {

                    if (data == null) {
                        return 'Agencia';
                    } else {
                        return data;
                    }
                }
            },
           {
               "data": "Horas",
               "orderable": false,
               "searchable": false,
               "render": function (data, type, full, meta) {
                   SUMHORAS += data;
                   return data;
               }
           },
            {
                "data": "Porcentaje",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    SUMPORCENT += data;
                    return data.toFixed(2) + "%";
                }
            },
        {
            "data": "Valor",
            "orderable": false,
            "searchable": false,
            "render": function (data, type, full, meta) {
                alert(data);
                SUM += parseInt(data);
                return '<label data-format-price="">' + parseInt(data) + '</label>';
            }
        }
        ],
        "drawCallback": function (settings) {
            $("#HorasModal").html($('<label class="text-right">' + SUMHORAS + '</label>'));
            $("#SumPorcentModal").html($('<label class="text-right"> ' + SUMPORCENT.toFixed(2) + '%</label>'));
            $("#SumatoriaModal").html($('<label class="text-right" data-format-price="">' + SUM + '</label>'));
            Utils._InputFormatPrice();
        }
    });
}



function PieClientesArea() {
    var fecha = '01/' + MES + '/' + ANIO;

    var parametros = {
        fecha: fecha,
        datos: AREAID,
        empresaId: $("#EmpresaModalId").val(),

    };

    CanvasJS.addColorSet("greenShades",
               [//colorSet Array
               "#DAEEAF", "#FDBA4F", "#ACB9C9", "#FF8F47", "#D7E8BC", "#BBD38B", "#FFD46E", "#E3B0B0", "#B6EBE9", "#B2E1C0", "#EDDE7C", "#FFCE89", "#FC9D8C", "#B7AAF5", "#0CA7EF", "#9DDBF8", "#E4F0F5", "#B8D0DB", "#FFFFFF", "#C1ECFF", "#C6FFBA", "#FFF298"
               ]);
    $.ajax({
        url: URL_GRAFICA_PIE_CLIENTE_AREA,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (data) {
            obj = data;
            var tam = (obj.dataPoints.length);
            if (tam == 0) {
                $("#chartContainer_pie2").hide();
            }
            else {
                $("#chartContainer_pie2").show();
                var chart = new CanvasJS.Chart("chartContainer_pie2", {
                    colorSet: "greenShades",
                    title: {
                        text: "Grafica"
                    },
                    data: [obj]
                });
                chart.render();
            }

        }
    });
}



function TablaClientesArea() {
    var SUM = 0;
    var SUMPORCENT = 0;
    var SUMHORAS = 0;
    var $filtro = $("#input-filtro");
    var fecha = '01/' + MES + '/' + ANIO;
    if ($TABLA_CLIENTE != null) {
        $TABLA_CLIENTE.destroy();
    }

    $TABLA_REPORTE = $("#tabla-Clientes").DataTable({
        "info": false,
        "bPaginate": false,
        "ajax": {
            "url": URL_CLIENTE_AREA,
            "type": "POST",

            "data": function (d) {
                d.search['value'] = $filtro.val();
                d.fecha = '01/' + MES + '/' + anioId;
                d.empresaId = $("#EmpresaModalId").val();
                d.areaId = AREAID;
                return $.extend({}, d, {
                    "adicional": {}
                });
            },

        }, "columns": [
            {
                "data": "Empresa",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {

                    if (data == null) {
                        return 'Agencia';
                    } else {
                        return data;
                    }
                }
            },
            {
                "data": "Horas",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    SUMHORAS += data;
                    return data;
                }
            },
            {
                "data": "Porcentaje",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    SUMPORCENT += data;
                    return data.toFixed(2) + "%";
                }
            },
        {
            "data": "Valor",
            "orderable": false,
            "searchable": false,
            "render": function (data, type, full, meta) {
               
                SUM += parseInt(data);
                return '<label data-format-price="">' + parseInt(data) + '</label>';
            }
        }
        ],
        "drawCallback": function (settings) {
            $("#HorasModal").html($('<label class="text-right">' + SUMHORAS + '</label>'));
            $("#SumPorcentModal").html($('<label class="text-right"> ' + SUMPORCENT.toFixed(2) + '%</label>'));
            $("#SumatoriaModal").html($('<label class="text-right" data-format-price="">' + SUM + '</label>'));
            Utils._InputFormatPrice();
        }
    });
}

