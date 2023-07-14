var CLIENTEID = 0;
function Pptos(id) {
    Utils._OpenModal(URL_PPTOS+'?id='+id, "OnloadPresupuesto", "all");
}

function OnloadPresupuesto() {
    CLIENTEID = $("#ClienteId").val();
    var parametros = {
        fechaInicial: FECHAINICIAL,
        fechaFinal: FECHAFINAL,
        clienteId: CLIENTEID
    };
    $.ajax({
        url: URL_GRAFICA_CLIENTES_PRESUPUESTOS,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (data) {
            obj = data;
            var tam = obj.dataPoints.length;
            if (0 != tam) {
                var chart = new CanvasJS.Chart("chartContainer_Clientes_Pptos", {
                    backgroundColor: "rgb(232, 232, 232)",
                    title: {
                        text: "Grafica"
                    },
                    exportEnabled: true,
                    animationEnabled: true,
                    legend: {
                        verticalAlign: "center",
                        horizontalAlign: "left",
                        fontSize: 12,
                        fontFamily: "Open Sans"
                    },
                    data: [obj]
                });
                chart.render();
            } else {
                $("#chartContainer_Clientes_Pptos").html("<center><b> NINGÚN DATO DISPONIBLE EN ESTA GRAFICA</b></center>");
            }
        }
    });
    CrearTablaPptos();
}

function CrearTablaPptos() {
    var $filtro = '';
    $TABLA_PAISES = $("#tabla-Pptos").DataTable({
        "bDestroy": true,
        "ajax": {
            "url": URL_TABLA_PRESUPUESTO,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = null;
                d.fechaInicial = FECHAINICIAL;
                d.fechaFinal = FECHAFINAL;
                d.clienteId = CLIENTEID;
            }
        },
        "columns": [
            { "data": "Estado" },
            { "data": "Cantidad" },
            { "data": "Valor" }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}

function OnloadSumatoriaPresupuestos() {
    var parametros = {
        fechaInicial: FECHAINICIAL,
        fechaFinal: FECHAFINAL
    };
    $.ajax({
        url: URL_GRAFICA_TOTAL_PRESUPUESTOS,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (data) {
            obj = data;
            var tam = obj.dataPoints.length;
            if (0 != tam) {
                var chart = new CanvasJS.Chart("chartContainer_Pptos_total", {
                    backgroundColor: "rgb(232, 232, 232)",
                    title: {
                        text: "Grafica"
                    },
                    exportEnabled: true,
                    animationEnabled: true,
                    legend: {
                        verticalAlign: "center",
                        horizontalAlign: "left",
                        fontSize: 12,
                        fontFamily: "Open Sans"
                    },
                    data: [obj]
                });
                chart.render();
            } else {
                $("#chartContainer_Pptos_tota").html("<center><b> NINGÚN DATO DISPONIBLE EN ESTA GRAFICA</b></center>");
            }
        }
    });

    CrearTablaPresupuestoTotal();
}


function CrearTablaPresupuestoTotal() {

    var $filtro = '';
    $TABLA_PAISES = $("#tabla-Presupuesto-Sumatoria").DataTable({
        "bDestroy": true,
        "ajax": {
            "url": URL_PRESUPUESTOS_SUMATORIA_TABLA,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = null;
                d.fechaInicial = FECHAINICIAL;
                d.fechaFinal = FECHAFINAL;
            }
        },
        "columns": [
            { "data": "Estado" },
            { "data": "Cantidad" },
            { "data": "Valor" }
        ], "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}