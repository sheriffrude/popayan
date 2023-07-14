var TAREA_CONSULTAR = {
    OnLoad: function () {
        TAREA_CONSULTAR.CrearTablaResponsables();
        TAREA_CONSULTAR.CrearTablaAsignados();
        TAREA_CONSULTAR.CrearTablaArchivos();
        TAREA_CONSULTAR.CrearTablaPiezasArte();
    },
    CrearTablaResponsables: function () {
        $("#tabla_responsables_consultar_tarea").DataTable({
            "serverSide": false,
            "paging": false,
            "info": false
        });
    },
    CrearTablaAsignados: function () {
        $("#tabla_asignados_consultar_tarea").DataTable({
            "serverSide": false,
            "paging": false,
            "info": false
        });
    },
    CrearTablaArchivos: function () {
        $("#tabla_archivos_consultar_tarea").DataTable({
            "serverSide": false,
            "paging": false,
            "info": false
        });
    },
    CrearTablaPiezasArte: function () {
        if ($("#tabla_piezas_arte_consultar_tarea").length > 0) {
            $("#tabla_piezas_arte_consultar_tarea").DataTable({
                "serverSide": false,
                "paging": false,
                "info": false
            });
        }
    },
    descargarArchivos: function () {
        alert("hla");
        var archivos = $("#tabla_piezas_arte_consultar_tarea").DataTable({ "serverSide": false, "paging": false, "info": false });
        console.log(archivos);
    },
    Preview: function (img) {
        var url = '<img src="' + img + '" />';
        //alert(url);
        //Utils._BuilderConfirmation("Preview", url, null, null, null);
        Utils._BuilderMessage("info", url, null, null);
        
    }
}

//var $TABA_HISTORIAL = null;
//function MostrarNuevaFecha() {
//    $("#CambiarFecha").removeClass('hidden');
//    $("#MostrarHistorial").addClass('hidden');
//    $("#NuevaFecha").datepicker({ minDate: "+0D" }).datepicker("setDate", new Date());
//}


//function CancelarCambioFecha() {
//    $("#CambiarFecha").addClass('hidden');
//}

//function GuardarCambioFecha() {
//    var fechaAntigua = $("#FechaEntrega").val();
//    var nuevaFecha = $("#NuevaFecha").val();
//    var justificacion = $("#Justificacion").val();
//    var tareaid = $("#Id").val();
    
//    if (nuevaFecha != '' && justificacion != '') {
        
//        var parametros = {
//            id: tareaid,
//            nuevaFecha: nuevaFecha,
//            justificacion: justificacion,
//            fechaAntigua: fechaAntigua
//        };
//        $.ajax({
//            url: URL_EDITAR_FECHA,
//            type: 'POST',
//            dataType: 'json',
//            data: parametros,
//            success: function (respuesta) {
//                if (respuesta.State == 1) {
//                    Utils._BuilderMessage('success', respuesta.Message);
//                    Utils._OpenModal(URL_DESCRIPCION_TAREA+"?id="+tareaid);
//                } else {
//                    Utils._BuilderMessage('danger', respuesta.Message);
//                }

//            }
//        });
        
//    } else {
        
//        Utils._BuilderMessage('danger', 'Nueva fecha y justificación deben ser obligatorios ');
//    }
//}


//function MostrarHistorico() {
//    $("#MostrarHistorial").removeClass('hidden');
//    $("#CambiarFecha").addClass('hidden');
//    CrearTablaHistorial();
//}

//function CrearTablaHistorial() {
    
//    if ($TABA_HISTORIAL != null) {
//        $TABA_HISTORIAL.destroy();
//    }
//    var $filtro = null;
//    $TABA_HISTORIAL = $("#tabla-historial").DataTable({
//        "ajax": {
//            "url": URL_LISTAR_HISTORIAL,
//            "type": "POST",
//            "data": function (d) {
//                d.search['value'] = "";
//                d.id = $("#Id").val();
//                return $.extend({}, d, {
//                    "adicional": {}
//                });
//            },

//        },
//        "columns": [
//            { "data": "RealizadoPor" },
//            { "data": "FechaCambio" },
//            { "data": "HoraCambio" },
//            { "data": "FechaAnterior" },
//            { "data": "NuevaFecha" },
//            { "data": "Observaciones" }
//],
//        "drawCallback": function (settings) {
//            Utils._BuilderModal();
//        }
//});

//}


