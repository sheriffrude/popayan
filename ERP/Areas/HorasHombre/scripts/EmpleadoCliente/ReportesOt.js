var NOMBRE_GRAFICA = null;
var $TABLA_GRAFICA = null;
function executeOnladOT() {
    setTimeout(function () {
        generarTituloGraficaOt();
        generarGraficaBarrasOt();
        generarGraficaTortaOt();
        generarTablaOt();
    }, 200);
}

//asigna el nombre de la grafica
function generarTituloGraficaOt() {
    NOMBRE_GRAFICA = "Horas hombre clientes vs OT´S vs Usuarios de  " + FECHAINICIO + " hasta " + FECHAFIN;
}



//GENERA LA GRAFICA EN BARRAS

function generarGraficaBarrasOt() {
    var parametros = {
        clienteId: CLIENTE_ID,
        otId: OT_ID,
        fechaInicio: FECHAINICIO,
        fechaFin: FECHAFIN
    };

    $.ajax({
        url: URL_REPORTE_DIAGRAMA_BARRAS_OT,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (data) {
            obj = data;
            console.log(obj);
            var chart = new CanvasJS.Chart("chartContainer", {
                title: {
                    text: NOMBRE_GRAFICA
                },
                data: [obj]
            });
            chart.render();
        }
    });

}



//GENERA LA GRAFICA EN TORTA
function generarGraficaTortaOt() {
    var parametros = {
        clienteId: CLIENTE_ID,
        otId: OT_ID,
        fechaInicio: FECHAINICIO,
        fechaFin: FECHAFIN
    };

    $.ajax({
        url: URL_REPORTE_DIAGRAMA_PIE_OT,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (data) {
            obj = data;
            console.log(obj);
            var chart = new CanvasJS.Chart("chartContainer_pie", {
                title: {
                    text: NOMBRE_GRAFICA
                },
                data: [obj]
            });
            chart.render();
        }
    });

}



//GENERA LA TABLA

function generarTablaOt() {
    if ($TABLA_GRAFICA != null) {
        $TABLA_GRAFICA.destroy();
    }

    $TABLA_CLIENTE = $("#tabla-grafica").DataTable({
        "ajax": {
            "url": URL_REPORTE_TABLA_OT,
            "type": "POST",
            "data": function (d) {
                d.clienteId = CLIENTE_ID,
                d.otId= OT_ID,
                d.fechaInicio = FECHAINICIO,
                d.fechaFin = FECHAFIN
                return $.extend({}, d, {
                    "adicional": {}
                });
            },
        }, "columns": [
            { "data": "Ot" },
            { "data": "Porcentaje" },
            { "data": "Horas" }
        ],
    });

    $('#tabla-Ot').show();
}
