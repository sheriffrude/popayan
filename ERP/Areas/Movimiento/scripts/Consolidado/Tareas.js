var CLIENTEID = 0;
var CLIENTTAREAID = 0;
function OnLoadTarea() {
    CLIENTEID = $("#Id").val();
    var parametros = {
        fechaInicial: FECHAINICIAL,
        fechaFinal: FECHAFINAL,
        clienteId: CLIENTEID
    };
    $.ajax({
        url: URL_GRAFICA_CLIENTES_TAREAS,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (data) {
            obj = data;
            var tam = obj.dataPoints.length;
            if (0 != tam) {
                var chart = new CanvasJS.Chart("chartContainer_Clientes_Deptos", {
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
                $("#chartContainer_Clientes_Deptos").html("<center><b> NINGÚN DATO DISPONIBLE EN ESTA GRAFICA</b></center>");
            }
        }
    });
    CrearTablaDeptos();
}



function CrearTablaDeptos() {

    var $filtro = '';
    $TABLA_PAISES = $("#tabla-Deptos").DataTable({
        "bDestroy": true,
        "ajax": {
            "url": URL_TAREAS,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = null;
                d.fechaInicial = FECHAINICIAL;
                d.fechaFinal = FECHAFINAL;
                d.clienteId = CLIENTEID;
            }
        },
        "columns": [
               {"data":"Tareas"},
            { "data": "Producto" },
            { "data": "Cantidad",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    CLIENTTAREAID = full.ClienteId;
                    return '<a href="' + URL_DETALLE_TAREAS + "?id=" + full.ClienteId + '"  data-toggle="modal" data-target="#"  data-size="all" data-execute-onload="OnLoadDetalleTarea">' + data + '</a>';
                }
            },
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}

function OnLoadDetalleTarea() {
    var $filtro = '';
    $TABLA_PAISES = $("#tabla-Ots").DataTable({
        "bDestroy": true,
        "ajax": {
            "url": URL_TAREAS_DETALLE,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = null;
                d.fechaInicial = FECHAINICIAL;
                d.fechaFinal = FECHAFINAL;
                d.clienteId = $("#ClienteId").val();
            }
        },
        "columns": [
            { "data": "Codigo" },
            { "data": "Referencia" },
             {
                 "data": "Numero",
                 "orderable": false,
                 "searchable": false,
                 "render": function (data, type, full, meta) {
                     return '<a href="' + URL_DESCRIPCION_TAREA + "?id=" + full.TareaId + '"  data-toggle="modal" data-target="#"  data-size="all" data-execute-onload="OnloadDetalleTareaOt">' + data + '</a>';
                 }
             },
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}

function OnloadDetalleTareaOt() {

    var link1 = $("#Modal-detalle-tarea").attr('href');
    var link2 = link1 + '?id=' + CLIENTTAREAID;
    $("#Modal-detalle-tarea").attr('href', link2);
}



function OnloadSumatoriaTareas() {
    var parametros = {
        fechaInicial: FECHAINICIAL,
        fechaFinal: FECHAFINAL
    };
    $.ajax({
        url: URL_GRAFICA_SUMATORIA_TAREAS,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (data) {
            obj = data;
            var tam = obj.dataPoints.length;
            if (0 != tam) {
                var chart = new CanvasJS.Chart("chartContainer_Sumatoria_Tareas", {
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
                $("#chartContainer_Sumatoria_Tareas").html("<center><b> NINGÚN DATO DISPONIBLE EN ESTA GRAFICA</b></center>");
            }
        }
    });
    CrearTablaTareasSumatoria();
}


function CrearTablaTareasSumatoria() {
    
    var $filtro = '';
    $TABLA_PAISES = $("#tabla-Tareas-Sumatoria").DataTable({
        "bDestroy": true,
        "ajax": {
            "url": URL_TAREAS_SUMATORIA_TABLA,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = null;
                d.fechaInicial = FECHAINICIAL;
                d.fechaFinal = FECHAFINAL;
            }
        },
        "columns": [

            { "data": "Producto" },
               {
                   "data": "Cantidad",
                   "orderable": false,
                   "searchable": false,
                   "render": function (data, type, full, meta) {
                       CLIENTTAREAID = full.ClienteId;
                       return '<a href="' + URL_DETALLE_TAREAS + "?id=" + full.ClienteId + '"  data-toggle="modal" data-target="#"  data-size="all" data-execute-onload="OnLoadDetalleTarea">' + data + '</a>';
                   }
               },
            { "data": "Tareas" }
        ], "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}