var DATA_RESPUESTAS = [];
var band = false;
var DEPTOID_BRIEF = 0;
var LISTAARCHIVOSTAREA = [];
var DATA_EJECUTIVOS_BTAREA = [];
var DATA_DIRECTOR_BTAREA = [];
var $TABLA_DIR_BRIEF = null;
var $TABLA_EJECUTIVOS_BRIEF = null;

function OnLoadCrearBrief() {
    band = false;
    $("#Fecha").datepicker({ minDate: "+0D" }).datepicker("setDate", new Date());
    $("#Producto").val(ORDEN_TRABAJO_LISTAR.PRODUCTO);
    $("#FechaEntrega").datepicker({ minDate: "+0D" }).datepicker("setDate", new Date());
    $('#Hora').timepicker();
    var date = new Date();
    var day = ((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear());
    $("#FechaElaboracion").val(day);
    $('[data-toggle="tooltip"]').tooltip();
    var data = null;
    var DATA_RESPUESTAS = [];
    ARCHIVOS = [];
    console.log(ARCHIVOS);
}

function OnchangeUnidadNegocio(e) {
    var unidadId = $(e).val();
    var parametros = {
        id: unidadId
    }
    $.ajax({
        url: URL_CONSULTAR_PREGUNTAS_BRIEF,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (respuesta) {
            var data = respuesta.data;
            var tam = data.length;
            var html = '<hr />';
            for (var i = 0; i < tam; i++) {
                
                if (data[i]['TipoPregunta'].trim() === "ABIERTA") {
                    html += '<input type="text" class="hidden" id="BriefId" value="' + data[i]['IdBrief'] + '"><div class="form-group col-md-6"><label>' + data[i]['Pregunta'] + '</label><br /><i>' + data[i]['Descripcion'] +'</i><textarea data-pregunta-id="' + data[i]['Id'] + '" class="form-control" rows="3" ></textarea></div>';
                }
                if (data[i]['TipoPregunta'] === "RESPUESTA UNICA") {
                    html += '<input type="text" class="hidden" id="BriefId" value="' + data[i]['IdBrief'] + '"><div class="form-group col-md-6"><label>' + data[i]['Pregunta'] + '</label><br /><i>' + data[i]['Descripcion'] +'</i>';
                    var datos = String(JSON.parse(data[i]["Opciones"]));
                    var datosSplit = datos.split(",");

                    for (var x = 0; x < datosSplit.length; x++) {
                        html += '<div class="radio col-md-6"><label><input type="radio" id="optradio" name="optradio' + i +'" data-pregunta-id="' + data[i]['Id'] + '" value="' + datosSplit[x] + '">' + datosSplit[x] + '</label></div>';
                    }
                    html += '</div>';
                }
                if (data[i]['TipoPregunta'] === "RESPUESTA MULTIPLE") {
                    html += '<input type="text" class="hidden" id="BriefId" value="' + data[i]['IdBrief'] + '"><div class="form-group col-md-4"><label>' + data[i]['Pregunta'] + '</label><br /><i>' + data[i]['Descripcion'] +'</i>';
                    var datos = String(JSON.parse(data[i]["Opciones"]));
                    var datosSplit = datos.split(",");

                    for (var x = 0; x < datosSplit.length; x++) {

                        html += '<div class="checkbox"><label><input type="checkbox" data-pregunta-id="' + data[i]['Id'] + '" value="' + datosSplit[x] + '">' + datosSplit[x] + '</label></div>';
                    }
                    html += '</div>';
                }
                html += '<div class="clearfix"></div>';
            }
            $("#Html-Preguntas-Brief").html(html);
        }
    });

    $("#Botones").removeClass("hidden");
    $("#file").removeClass("hidden");
    $("#dvCrearTarea").removeClass("hidden");

}

function GuardarPreguntas() {
    DATA_RESPUESTAS = [];
    $("textarea[data-pregunta-id]").each(function () {
        var arreglo = {
            preguntaid: $(this).attr("data-pregunta-id"),
            respuesta: $(this).val()
        };
        DATA_RESPUESTAS.push(arreglo);
    });
    $("input:radio[id=optradio]:checked").each(function () {
        var nombre = $(this).attr("name");
        arreglo = {
            preguntaid: $("input:radio[name=" + nombre + "]:checked").attr("data-pregunta-id"),
            respuesta: $("input:radio[name=" + nombre +"]:checked").val()
        };
        DATA_RESPUESTAS.push(arreglo);
    })
    

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

    $("#FormCrearBrief").trigger("submit");
}

function OnBeginFormCrearBrief(jqXHR, settings) {
    var validator = $("#FormCrearBrief")
    if (!validator.validate())
        return false;
    var data = null;
    data = $(this).serializeObject();
    data["ListaRtaBrief"] = DATA_RESPUESTAS;
    data["ListaArchivos"] = ARCHIVOS;
    data["ListaArchivosTarea"] = LISTAARCHIVOSTAREA;
    data["ListaEjecutivos"] = DATA_EJECUTIVOS_BTAREA;
    data["ListaDirectores"] = DATA_DIRECTOR_BTAREA;
    data["BriefId"] = $("#BriefId").val();
    settings.data = jQuery.param(data);
    return true;
}

//-- ONSUCCESS --//

function OnSuccessCrearBrief(resultado) {
    var tipoMensaje = "danger";
    if (resultado.state == true) {
        tipoMensaje = "success";

    }
    Utils._BuilderMessage(tipoMensaje, resultado.message);
    $("#atras_listar_Brief").trigger("click");
}

function SubirArchivo(e) {
    ARCHIVOS = [];
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

function OnchangeDeptoBrief(e) {
    DEPTOID_BRIEF = $(e).val();
    if (DEPTOID_BRIEF !== "") {
        limpiarTablaDirectivosBrief();
        limpiarTablaEjecutivosBrief();
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

function SubirArchivoCrearBrief(e) {
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

function limpiarTablaDirectivosBrief() {
    if ($TABLA_DIR_BRIEF != null) {
        $TABLA_DIR_BRIEF.draw();
    }
    if (DEPTOID_BRIEF != "" && $TABLA_DIR_BRIEF == null) {
        ConstruirTablaDirectoresBrief();
    }
}

function ConstruirTablaDirectoresBrief() {
    if (DEPTOID_BRIEF !== "") {
        $TABLA_DIR_BRIEF = $("#tabla-Directores-Brief").DataTable({
            "info": false,
            "bpaginate": false,
            "serverSide": true,
            "ajax": {
                "url": URL_LISTAR_DIRECTORES,
                "type": "POST",
                "data": function (d) {
                    d.search['value'] = null;
                    d.id = DEPTOID_BRIEF;
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
                        return '<input type="checkbox" onchange="seleccionarDirectorBrief(this)" name="checkbox-seleccionar-cliente" value="' + data + '">';
                    }
                },
                { "data": "Nombre" }
            ],

        });
    }
}

function seleccionarDirectorBrief(e) {
    var id = $(e).val();
    if ($(e).is(":checked")) {
        if (!ExisteDatosBriefTarea(id))
            DATA_DIRECTOR_BTAREA.push(id);
    } else {
        var tamanoData = DATA_DIRECTOR_BTAREA.length;
        for (var i = 0; i < tamanoData; i++) {
            if (DATA_DIRECTOR_BTAREA[i] == id) {
                DATA_DIRECTOR_BTAREA.splice(i, 1);
                break;
            }
        }
    }
}

function ExisteDatosBriefTarea(id) {
    var existe = false;
    var tamanoData = DATA_DIRECTOR_BTAREA.length;
    for (var i = 0; i < tamanoData; i++) {
        if (DATA_DIRECTOR_BTAREA[i] == id) {
            existe = true;
            break;
        }
    }
    return existe;
}

function limpiarTablaEjecutivosBrief() {
    if ($TABLA_EJECUTIVOS_BRIEF != null) {
        $TABLA_EJECUTIVOS_BRIEF.draw();
    }
    if (DEPTOID_BRIEF !== "" && $TABLA_EJECUTIVOS_BRIEF == null) {
        ConstruirTablaEjecutivosBrief();
    }
}

function ConstruirTablaEjecutivosBrief() {
    if (DEPTOID_BRIEF !== "") {
        $TABLA_EJECUTIVOS_BRIEF = $("#tabla-Ejecutivos-Brief").DataTable({
            "info": false,
            "bpaginate": false,
            "serverSide": true,
            "ajax": {
                "url": URL_LISTAR_EJECUTIVOS,
                "type": "POST",
                "data": function (d) {
                    d.search['value'] = "";
                    d.id = DEPTOID_BRIEF;
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
                        return '<input type="checkbox" onchange="seleccionarEjecutivoBriefTarea(this)" name="checkbox-seleccionar-ejecutivo" value="' + data + '">';
                    }
                },
                { "data": "Nombre" }
            ],

        });

    }
}

function seleccionarEjecutivoBriefTarea(e) {
    var id = $(e).val();
    if ($(e).is(":checked")) {
        if (!ExisteDatosBriefTareaEjecutivo(id))
            DATA_EJECUTIVOS_BTAREA.push(id);
    } else {
        var tamanoData = DATA_EJECUTIVOS_BTAREA.length;
        for (var i = 0; i < tamanoData; i++) {
            if (DATA_EJECUTIVOS_BTAREA[i] == id) {
                DATA_EJECUTIVOS_BTAREA.splice(i, 1);
                break;
            }
        }
    }

}

function ExisteDatosBriefTareaEjecutivo(id) {
    var existe = false;
    var tamanoData = DATA_EJECUTIVOS_BTAREA.length;
    for (var i = 0; i < tamanoData; i++) {
        if (DATA_EJECUTIVOS_BTAREA[i] == id) {
            existe = true;
            break;
        }
    }
    return existe;
}