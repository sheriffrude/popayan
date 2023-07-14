var DATA_RESPUESTAS = [];
var ARCHIVOS = [];
var band = false;
var DEPTOID_VBRIEF = 0;
var LISTAARCHIVOSTAREA = [];
var DATA_EJECUTIVOS_VBTAREA = [];
var DATA_DIRECTOR_VBTAREA = [];
var $TABLA_DIR_VBRIEF = null;
var $TABLA_EJECUTIVOS_VBRIEF = null;

function OnLoadCrearVersionBrief() {
    band = false;
    DATA_RESPUESTAS = [];
    ARCHIVOS = [];
    DEPTOID_VBRIEF = 0;
    LISTAARCHIVOSTAREA = [];
    $("#Fecha").datepicker({ minDate: "+0D" }).datepicker("setDate", new Date());
    $("#Producto").val(ORDEN_TRABAJO_LISTAR.PRODUCTO);
    $("#FechaActualizacion").datepicker({ minDate: "+0D" }).datepicker("setDate", new Date());
    $('#Hora').timepicker();
    var date = new Date();
    var day = ((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear());
    $("#FechaElaboracion").val(day);
    $('[data-toggle="tooltip"]').tooltip();
}

//function OnchangeUnidadNegocio(e) {
//    var unidadId = $(e).val();
//    var parametros = {
//        id : unidadId
//    }
//    $.ajax({
//        url: URL_CONSULTAR_PREGUNTAS_BRIEF,
//        type: 'POST',
//        dataType: 'json',
//        data: parametros,
//        success: function (respuesta) {
//            var data = respuesta.data;
//            var tam = data.length;
//            var html = '';
//            for (var i = 0; i < tam; i++) {
//                if (data[i]['TipoPreguntaId'] == 1) {
//                    html += '<input type="text" class="hidden" id="BriefId" value="' + data[i]['IdBrief'] + '"><div class="form-group col-md-4"><label  data-toggle="tooltip" for="comment" title="' + data[i]['Descripcion'] + '">' + data[i]['Pregunta'] + '</label><textarea data-pregunta-id="' + data[i]['Id'] + '" class="form-control" rows="5" ></textarea></div>';

//                }


//            }
//            $("#Html-Preguntas-Brief").html(html);
//        }
//    });

//    $("#Botones").removeClass("hidden");
//    $("#file").removeClass("hidden");
//    $("#dvCrearTarea").removeClass("hidden");

//}
function GuardarPreguntasVersion() {
    $("textarea[data-pregunta-id]").each(function () {
        var arreglo = {
            preguntaid: $(this).attr("data-pregunta-id"),
            respuesta: $(this).val()
        };

        DATA_RESPUESTAS.push(arreglo);
    });
    var arreglo = {
        preguntaid: $("input:radio[name=optradio]:checked").attr("data-pregunta-id"),
        respuesta: $("input:radio[name=optradio]:checked").val()
    };

    DATA_RESPUESTAS.push(arreglo);

    $('input[type=checkbox]').each(function () {

        if ($(this).is(":checked")) {

            if ($(this).attr("data-pregunta-id") != undefined) {
                var arreglo = {
                    preguntaid: $(this).attr("data-pregunta-id"),
                    respuesta: $(this).val()
                };

                DATA_RESPUESTAS.push(arreglo);
            }
        }
    });
    $("#FormCrearVersionBrief").trigger("submit");
}

function OnBeginFormCrearVersionBrief(jqXHR, settings) {

    var validator = $("#FormCrearVersionBrief")
    if (!validator.validate())
        return false;

    var data = $(this).serializeObject();
    data["ListaRtaBrief"] = DATA_RESPUESTAS;
    data["ListaArchivos"] = ARCHIVOS;
    data["ListaArchivosTarea"] = LISTAARCHIVOSTAREA;
    data["ListaEjecutivos"] = DATA_EJECUTIVOS_VBTAREA;
    data["ListaDirectores"] = DATA_DIRECTOR_VBTAREA;
    data["BriefId"] = $("#BriefId").val();
    settings.data = jQuery.param(data);
    return true;
}

//-- ONSUCCESS --//

function OnSuccessCrearVersionBrief(resultado) {
    var tipoMensaje = "danger";
    if (resultado.state == true) {
        tipoMensaje = "success";

    }
    Utils._BuilderMessage(tipoMensaje, resultado.message);
    $("#atras_listar_Brief").trigger("click");
}


function SubirArchivoVersion(e) {
    RequestHttp._UploadFile(e, URL_SUBIR_ARCHIVOS_TEMP, function (result) {
        if (result != null) {

            FILE = {
                'Name': result.Name,
                'Path': result.Path,
                'OriginalName': result.OriginalName
            };
            ARCHIVOS.push(FILE);
        }
    });
}



function OnchangeDeptoVBrief(e) {
    DEPTOID_VBRIEF = $(e).val();
    if (DEPTOID_VBRIEF!== "") {
        limpiarTablaDirectivosVBrief();
        limpiarTablaEjecutivosVBrief();
    }
}

function CrearTarea() {

    if (!band) {
        $("#crearTarea").show();
        $("#DeptoId").attr("required");
        $("#TareaId").attr("required");
        $("#existeTarea").val(true);
        band = true;
    }
    else {
        $("#crearTarea").hide();
        $("#DeptoId").removeAttr("required");
        $("#TareaId").removeAttr("required");
        $("#existeTarea").val(false);
        band = false;
    }
}

function SubirArchivoCrearVersionBrief(e) {
    RequestHttp._UploadFile(e, URL_SUBIR_CREAR_TAREA, function (result) {
        if (result != null) {
            FILE = {
                'Name': result.Name,
                'Path': result.Path,
                'OriginalName': result.OriginalName
            };
            LISTAARCHIVOSTAREA.push(FILE);
        }

    });
}


function limpiarTablaDirectivosVBrief() {
    if ($TABLA_DIR_VBRIEF != null) {
        $TABLA_DIR_VBRIEF.draw();
    }
    if (DEPTOID_VBRIEF != "" && $TABLA_DIR_VBRIEF == null) {
        ConstruirTablaDirectoresVBrief();
    }
}

function ConstruirTablaDirectoresVBrief() {
    if (DEPTOID_VBRIEF !== "") {
        $TABLA_DIR_VBRIEF = $("#tabla-Directores-VBrief").DataTable({
            "info": false,
            "bpaginate": false,
            "serverSide": true,
            "ajax": {
                "url": URL_LISTAR_DIRECTORES,
                "type": "POST",
                "data": function (d) {
                    d.search['value'] = null;
                    d.id = DEPTOID_VBRIEF;
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                },

            }, "columns": [
                {
                    "data": "DirId",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        return '<input type="checkbox" onchange="seleccionarDirectorVBrief(this)" name="checkbox-seleccionar-cliente" value="' + data + '">';
                    }
                },
                { "data": "Nombre" }
            ],

        });
    }
}

function seleccionarDirectorVBrief(e) {
    var id = $(e).val();
    if ($(e).is(":checked")) {
        if (!ExisteDatosVBriefTarea(id))
            DATA_DIRECTOR_VBTAREA.push(id);
    } else {
        var tamanoData = DATA_DIRECTOR_VBTAREA.length;
        for (var i = 0; i < tamanoData; i++) {
            if (DATA_DIRECTOR_VBTAREA[i] == id) {
                DATA_DIRECTOR_VBTAREA.splice(i, 1);
                break;
            }
        }
    }
}

function ExisteDatosVBriefTarea(id) {
    var existe = false;
    var tamanoData = DATA_DIRECTOR_VBTAREA.length;
    for (var i = 0; i < tamanoData; i++) {
        if (DATA_DIRECTOR_VBTAREA[i] == id) {
            existe = true;
            break;
        }
    }
    return existe;
}

function limpiarTablaEjecutivosVBrief() {
    if ($TABLA_EJECUTIVOS_VBRIEF != null) {
        $TABLA_EJECUTIVOS_VBRIEF.draw();
    }
    if (DEPTOID_VBRIEF !== "" && $TABLA_EJECUTIVOS_VBRIEF == null) {
        ConstruirTablaEjecutivosVBrief();
    }
}

function ConstruirTablaEjecutivosVBrief() {
    if (DEPTOID_VBRIEF !== "") {
        $TABLA_EJECUTIVOS_VBRIEF = $("#tabla-Ejecutivos-VBrief").DataTable({
            "info": false,
            "bpaginate": false,
            "serverSide": true,
            "ajax": {
                "url": URL_LISTAR_EJECUTIVOS,
                "type": "POST",
                "data": function (d) {
                    d.search['value'] = "";
                    d.id = DEPTOID_VBRIEF;
                    return $.extend({}, d, {
                        "adicional": {}
                    });
                },

            }, "columns": [
                {
                    "data": "DirId",
                    "orderable": false,
                    "searchable": false,
                    "render": function (data, type, full, meta) {
                        return '<input type="checkbox" onchange="seleccionarEjecutivoVBriefTarea(this)" name="checkbox-seleccionar-ejecutivo" value="' + data + '">';
                    }
                },
                { "data": "Nombre" }
            ],

        });

    }
}

function seleccionarEjecutivoVBriefTarea(e) {
    var id = $(e).val();
    if ($(e).is(":checked")) {
        if (!ExisteDatosVBriefTareaEjecutivo(id))
            DATA_EJECUTIVOS_VBTAREA.push(id);
    } else {
        var tamanoData = DATA_EJECUTIVOS_VBTAREA.length;
        for (var i = 0; i < tamanoData; i++) {
            if (DATA_EJECUTIVOS_VBTAREA[i] == id) {
                DATA_EJECUTIVOS_VBTAREA.splice(i, 1);
                break;
            }
        }
    }

}

function ExisteDatosVBriefTareaEjecutivo(id) {
    var existe = false;
    var tamanoData = DATA_EJECUTIVOS_VBTAREA.length;
    for (var i = 0; i < tamanoData; i++) {
        if (DATA_EJECUTIVOS_VBTAREA[i] == id) {
            existe = true;
            break;
        }
    }
    return existe;
}