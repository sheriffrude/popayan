var NOMBRE_GRAFICA = null;
var $TABLA_GRAFICA = null;

function executeOnladUsuario() {

   
    setTimeout(function () {
        generarTituloGraficaUsuario();
        generarGraficaBarrasUsuario();
        generarGraficaTortaUsuario();
        generarTablaUsuario();
    }, 200);


}

//asigna el nombre de la grafica
function generarTituloGraficaUsuario() {
    NOMBRE_GRAFICA = "Horas hombre Actividades usuario vs OT de  " + FECHAINICIO + " hasta " + FECHAFIN;
}




//GENERA LA GRAFICA EN BARRAS

function generarGraficaBarrasUsuario() {
    var parametros = {
        clienteId: CLIENTE_ID,
        otId: OT_ID,
        usuarioId: USUARIO_ID,
        fechaInicio: FECHAINICIO,
        fechaFin: FECHAFIN
    };

    $.ajax({
        url: URL_REPORTE_DIAGRAMA_BARRAS_USUARIO,
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
function generarGraficaTortaUsuario() {
    var parametros = {
        clienteId: CLIENTE_ID,
        otId: OT_ID,
        usuarioId:USUARIO_ID,
        fechaInicio: FECHAINICIO,
        fechaFin: FECHAFIN
    };

    $.ajax({
        url: URL_REPORTE_DIAGRAMA_PIE_USUARIO,
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

function generarTablaUsuario() {
    if ($TABLA_GRAFICA != null) {
        $TABLA_GRAFICA.destroy();
    }

    $TABLA_CLIENTE = $("#tabla-grafica").DataTable({
        "ajax": {
            "url": URL_REPORTE_TABLA_USUARIO,
            "type": "POST",
            "data": function (d) {
                d.clienteId = CLIENTE_ID,
                d.otId = OT_ID,
                d.usuarioId = USUARIO_ID,
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

