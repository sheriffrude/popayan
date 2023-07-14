var CLIENTEID = 0;
function OnLoadProducto() {
     CLIENTEID = $("#Id").val();
    var parametros = {
        fechaInicial: FECHAINICIAL,
        fechaFinal: FECHAFINAL,
        clienteId: CLIENTEID
    };
    $.ajax({
        url: URL_GRAFICA_CLIENTES_PRODUCTOS,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (data) {
            obj = data;
            var tam = obj.dataPoints.length;
            if (0 != tam) {
                var chart = new CanvasJS.Chart("chartContainer_Clientes_Productos", {
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
                $("#chartContainer_Clientes_Cerradas").html("<center><b> NINGÚN DATO DISPONIBLE EN ESTA GRAFICA</b></center>");
            }
        }
    });
    CrearTablaCliente();
}



function CrearTablaCliente() {
   
    $("#tabla-OTCreadas").removeClass('hidden');
    var $filtro = '';
    $TABLA_PAISES = $("#tabla-Productos").DataTable({
        "bDestroy": true,
        "ajax": {
            "url": URL_PRODUCTOS,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = null;
                d.fechaInicial = FECHAINICIAL;
                d.fechaFinal = FECHAFINAL;
                d.clienteId = CLIENTEID;
            }
        },
        "columns": [
            { "data": "Producto", },
            { "data": "Cantidad" }
        ],
        "drawCallback": function (settings) {
        }
    });
}