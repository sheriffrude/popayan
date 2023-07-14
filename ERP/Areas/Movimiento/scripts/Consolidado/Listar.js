var FECHAINICIAL = null;
var FECHAFINAL = null;
var SUMACTIVAS = 0;
$(function () {

    $("#FechaInicio").datepicker().datepicker("setDate", new Date());
    $("#FechaFin").datepicker().datepicker("setDate", new Date());

});

function BuscarOts() {
    FECHAINICIAL  = $("#FechaInicio").val();
    FECHAFINAL = $("#FechaFin").val();
    var parametros = {
        fechaInicial: FECHAINICIAL,
        fechaFinal: FECHAFINAL
    };
    $.ajax({
        url: URL_GRAFICA_OT_CREADA,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (data) {
            obj = data;
            var tam = obj.dataPoints.length;
            if (0 != tam) {
                var chart = new CanvasJS.Chart("chartContainer_CuantasOt", {
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
                $("#chartContainer_CuantasOt").html("<center><b> NINGÚN DATO DISPONIBLE EN ESTA GRAFICA</b></center>");
            }
            CrearTablaOtsCreadas();
            PieClientesActivas();
            PieClientesCerradas();
            CrearTablaClientes();
        }
       
    });

}

function CrearTablaOtsCreadas() {
    $("#tabla-OTCreadas").removeClass('hidden');
    var $filtro = '';
    $TABLA_PAISES = $("#tabla-OTCreadas").DataTable({
        "bDestroy": true,
        "ajax": {
            "url": URL_TABLAS_OT_CREADA,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = null;
                d.fechaInicial = FECHAINICIAL;
                d.fechaFinal = FECHAFINAL;
            }
        },
        "columns": [
            { "data": "Estado", },
            { "data": "Cant" }
        ],
        "drawCallback": function (settings) {
        }
    });
}


function PieClientesActivas() {

    var parametros = {
        fechaInicial: FECHAINICIAL,
        fechaFinal: FECHAFINAL
    };
    $.ajax({
        url: URL_GRAFICA_CLIENTES,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (data) {
            obj = data;
            var tam = obj.dataPoints.length;
            if (0 != tam) {
                var chart = new CanvasJS.Chart("chartContainer_Clientes", {
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
                $("#chartContainer_Clientes").html("<center><b> NINGÚN DATO DISPONIBLE EN ESTA GRAFICA</b></center>");
            }
        }
    });

}



function PieClientesCerradas() {

    var parametros = {
        fechaInicial: FECHAINICIAL,
        fechaFinal: FECHAFINAL
    };
    $.ajax({
        url: URL_GRAFICA_CLIENTES_CERRADA,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (data) {
            obj = data;
            var tam = obj.dataPoints.length;
            if (0 != tam) {
                var chart = new CanvasJS.Chart("chartContainer_Clientes_Cerradas", {
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

}

function CrearTablaClientes() {
    $("#tabla-Clientes").removeClass('hidden');
    var $filtro = '';
    
    $TABLA_PAISES = $("#tabla-Clientes").DataTable({
        "bDestroy": true,
        "ajax": {
            "url": URL_TABLAS_CLIENTE,
            "type": "POST",
            "data": function (d) {
                d.search["value"] = null;
                d.fechaInicial = FECHAINICIAL;
                d.fechaFinal = FECHAFINAL;
            }
        },
        "columns": [
            { "data": "Cliente", },
            {
                "data": "Activas",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
             
                    SUMACTIVAS =SUMACTIVAS+ data;
                    return data;
                }
            },
            { "data": "Cerradas" },
             {
                 "data": "ClienteId",
                 "orderable": false,
                 "searchable": false,
                 "render": function (data, type, full, meta) {

                     return '<input type="button" name ="Opcion-tarea" class="btn btn-trafico" value="Ver" onclick="Productos(' + data + ')">'
                 }
             },
              {
                  "data": "ClienteId",
                  "orderable": false,
                  "searchable": false,
                  "render": function (data, type, full, meta) {

                      return '<input type="button" name ="Opcion-tarea" class="btn btn-trafico" value="Ver" Onclick="Tareas('+data+')">'
                  }
              },
               {
                   "data": "ClienteId",
                   "orderable": false,
                   "searchable": false,
                   "render": function (data, type, full, meta) {

                       return '<input type="button" name ="Opcion-tarea" class="btn btn-trafico" value="Ver" Onclick="Pptos(' + data + ')">'
                   }
               },
        ],
      
        "drawCallback": function (settings) {
        }
    });

    $("#Activas").html(SUMACTIVAS);
    $($TABLA_PAISES.table().footer()).addClass('highlight');
}

function Productos(id) {
    var link1 = $("#ModalProductos").attr('href');
    var link2 = link1 + '?id=' + id;
    $("#ModalProductos").attr('href', link2);
    $("#ModalProductos").trigger("click");
    $("#ModalProductos").attr('href', link1);
   
}

function Tareas(id) {;
    var link1 = $("#ModalTareas").attr('href');
    var link2 = link1 + '?id=' + id;
    $("#ModalTareas").attr('href', link2);
    $("#ModalTareas").trigger("click");
    $("#ModalTareas").attr('href', link1); 
    //Utils._OpenModal(URL_MODAL_TAREAS+ '?id=' + id);
}


function SumPptos() {
    

    Utils._OpenModal(URL_SUMATORIA_PRODUCTOS, "OnloadSumatoriaProductos", "all");
}
function SumTareas() {
    Utils._OpenModal(URL_SUMATORIA_TAREAS, "OnloadSumatoriaTareas", "all");
}

function SumPresupuestos() {
  
    Utils._OpenModal(URL_SUMATORIA_PRESUPUESTOS, "OnloadSumatoriaPresupuestos", "all");
}

function OnloadSumatoriaProductos() {
    var parametros = {
        fechaInicial: FECHAINICIAL,
        fechaFinal: FECHAFINAL
    };
    $.ajax({
        url: URL_GRAFICA_SUMATORIA_PRODUCTOS,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (data) {
            obj = data;
            var tam = obj.dataPoints.length;
            if (0 != tam) {
                var chart = new CanvasJS.Chart("chartContainer_Sumatoria_Productos", {
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
                $("#chartContainer_Sumatoria_Productos").html("<center><b> NINGÚN DATO DISPONIBLE EN ESTA GRAFICA</b></center>");
            }
        }
    });
    CrearTablaDeptosSumatoria();
}


function CrearTablaDeptosSumatoria() {

    var $filtro = '';
    $TABLA_PAISES = $("#tabla-Deptos-Sumatoria").DataTable({
        "bDestroy": true,
        "ajax": {
            "url": URL_TAREAS_SUMATORIA,
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
                "data": "Cantidad"
            },
        ]
    });
}