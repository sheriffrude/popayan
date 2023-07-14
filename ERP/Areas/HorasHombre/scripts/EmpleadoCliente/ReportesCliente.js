var NOMBRE_GRAFICA = null;
var $TABLA_GRAFICA = null;
function executeOnladCliente() {
    setTimeout(function () {
        generarTituloGrafica();
        generarGraficaTorta();
        generarGraficaBarras();
        generarTabla();
    }, 200);
}

//asigna el nombre de la grafica
function generarTituloGrafica() {
        NOMBRE_GRAFICA = "Horas hombre clientes vs OT´S de " + FECHAINICIO + " hasta " + FECHAFIN;
}



//GENERA LA GRAFICA EN BARRAS

function generarGraficaBarras() {
    var parametros = {
        clienteId: CLIENTE_ID,
        fechaInicio: FECHAINICIO,
        fechaFin: FECHAFIN
    };

    $.ajax({
        url: URL_REPORTE_DIAGRAMA_BARRAS_CLIENTE,
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
function generarGraficaTorta() {
    var parametros = {
        clienteId: CLIENTE_ID,        
        fechaInicio: FECHAINICIO,
        fechaFin: FECHAFIN
    };

    $.ajax({
        url: URL_REPORTE_DIAGRAMA_PIE_CLIENTE,
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

function  generarTabla() {
    if ($TABLA_GRAFICA != null) {
        $TABLA_GRAFICA.destroy();
    }
    
    $TABLA_CLIENTE = $("#tabla-grafica").DataTable({
        "ajax": {
            "url": URL_REPORTE_TABLA_CLIENTE,
            "type": "POST",
            "data": function (d) {
                d.clienteId = CLIENTE_ID,
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