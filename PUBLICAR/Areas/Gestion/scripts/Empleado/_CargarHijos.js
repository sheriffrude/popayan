var $DATA_HIJOS = [];
var $TABLA_HIJOS = null;
var COUNT_TABLA = 0;

/**
 * Función de inicio
 */
function initHijos() {
    $DATA_HIJOS = [];
    $TABLA_HIJOS = null;
    COUNT_TABLA = 0;
    $("#registro-hijos").hide();
    CrearTablaHijos();
}

/**
 * Función de inicio de modal para registrar hijo
 */
function initAgregarHijo() {
    $("#FechaNacimientoHijo").datepicker({ maxDate: '0' });
    $("#FechaNacimientoHijo").datepicker("option", "dateFormat", "d 'de' MM 'del' yy");
}

/**
 * Evento al checkear si tiene hijos
 */
function clickHijos() {
    if ($('#hijos-btn').is(':checked')) {
        $("#registro-hijos").show();
    }
    else {
        $("#registro-hijos").hide();
    }
}

/**
 * Función que prepara los elemento a registrar
 * @param {any} jqXHR
 * @param {any} settings
 */
function obtenerHijos() {
    var dataHijos = {};
    dataHijos["ListadoHijos"] = $DATA_HIJOS;
    dataHijos["RegistroHijos"] = $('#hijos').is(':checked');
    return dataHijos;
}

/**
 * Agrega correo al listado temporal
 */
function agregarHijo() {
    var $form = $('#agregar-hijo');
    if ($form.valid()) {
        var documentoHijo = $("#DocumentoHijo").val();
        if (documentoHijo != undefined && documentoHijo != '' && documentoHijo > 0) {
            var countHijos = $DATA_HIJOS.length;
            for (var i = 0; i < countHijos; i++) {
                if ($DATA_HIJOS[i]['DocumentoHijo'] == documentoHijo) {
                    Utils._BuilderMessage('info', 'Este hijo ya se encuentra registrado');
                    return false;
                }
            }
            var fechaNacimientoTexto = $("#FechaNacimientoHijo").val();
            $("#FechaNacimientoHijo").datepicker("option", "dateFormat", "dd/mm/yy")
            var jsonHijo = {
                PrimerNombreHijo: $("#PrimerNombreHijo").val(),
                SegundoNombreHijo: $("#SegundoNombreHijo").val(),
                PrimerApellidoHijo: $("#PrimerApellidoHijo").val(),
                SegundoApellidoHijo: $("#SegundoApellidoHijo").val(),
                TipoDocumentoHijoId: $("#TipoDocumentoHijoId").val(),
                TipoDocumentoHijo: $('#TipoDocumentoHijoId option:selected').text(),
                DocumentoHijo: $("#DocumentoHijo").val(),
                SexoHijo: $('#SexoHijoId :selected').text(),
                SexoHijoId: $('#SexoHijoId').val(),
                FechaNacimiento: fechaNacimientoTexto,
                FechaNacimientoHijo: $("#FechaNacimientoHijo").val()
            };

            $DATA_HIJOS.push(jsonHijo);

            if ($TABLA_HIJOS != null)
                $TABLA_HIJOS = null;

            ActualizarTablaHijos($DATA_HIJOS);
            COUNT_TABLA++
            Utils._CloseModal();
        };

    }

}

/**
 * Evento que crea por jquery la tabla temporal de hijos
 */
function CrearTablaHijos() {
    $TABLA_HIJOS = $("#Tablehijos").dataTable({
        "bFilter": false,
        "bLengthChange": false,
        "ajax": {
            "url": URL_HIJOS_EMPLEADOS,
            "type": "POST",
            "dataSrc": function (json) {
                if (json != undefined &&
                    json != "" &&
                    json.data != undefined &&
                    json.data.length > 0) {
                    $('#hijos-btn').attr('checked', true);
                    $("#registro-hijos").show();
                }
                $DATA_HIJOS = json.data;
                return json.data;
            }
        },
        "columns": [
            { "data": "PrimerNombreHijo" },
            { "data": "SegundoNombreHijo" },
            { "data": "PrimerApellidoHijo" },
            { "data": "SegundoApellidoHijo" },
            { "data": "TipoDocumentoHijo" },
            { "data": "DocumentoHijo" },
            { "data": "FechaNacimientoHijo" },
            { "data": "SexoHijo" },
            {
                "data": "DocumentoHijo",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var botonEditar = '<a href="' + URL_EDITAR_HIJOS + '?doc=' + full.DocumentoHijo + '" data-toggle="modal" data-target="#" class="btn btn-info btn-sm m-5" >Editar</a>';
                    var botonEliminar = '<input type="button" class="btn btn-danger btn-sm m-5" value="Eliminar" onclick="EliminarHijo(' + full.DocumentoHijo + ')" >';
                    return botonEditar + botonEliminar;
                }
            }
        ], "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}

/**
 * Evento que crea por jquery la tabla temporal de hijos
 */
function ActualizarTablaHijos(dataRows) {
    $TABLA_HIJOS = $("#Tablehijos").dataTable({
        "bFilter": false,
        "bLengthChange": false,
        "destroy": true,
        "serverSide": false,
        "data": $DATA_HIJOS,
        "columns": [
            { "data": "PrimerNombreHijo" },
            { "data": "SegundoNombreHijo" },
            { "data": "PrimerApellidoHijo" },
            { "data": "SegundoApellidoHijo" },
            { "data": "TipoDocumentoHijo" },
            { "data": "DocumentoHijo" },
            { "data": "FechaNacimientoHijo" },
            { "data": "SexoHijo" },
            {
                "data": "DocumentoHijo",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var botonEditar = '<a href="' + URL_EDITAR_HIJOS + '?doc=' + full.DocumentoHijo + '" data-toggle="modal" data-target="#" class="btn btn-info btn-sm m-5" >Editar</a>';
                    var botonEliminar = '<input type="button" class="btn btn-danger btn-sm m-5" value="Eliminar" onclick="EliminarHijo(' + full.DocumentoHijo + ')" >';
                    return botonEditar + botonEliminar;
                }
            }
        ], "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}

/**
 * Función de eliminar hijos del listado temporal
 * @param {any} id
 */
function EliminarHijo(id) {
    var longitudDataCorreo = $DATA_HIJOS.length;
    for (var i = 0; longitudDataCorreo > i; i++) {
        if ($DATA_HIJOS[i]["DocumentoHijo"] == id) {
            $DATA_HIJOS.splice(i, 1);
            break;
        }
    }
    if ($TABLA_HIJOS != null)
        $TABLA_HIJOS.fnDestroy();
    ActualizarTablaHijos($DATA_HIJOS);
}

function initEditarHijo() {
    var pxDetalle = getPosHijo();
    var detalle = $DATA_HIJOS[pxDetalle];
    $("#FechaNacimientoHijo").datepicker({ maxDate: '0' });
    $("#PrimerNombreHijo").val(detalle.PrimerNombreHijo);
    $("#SegundoNombreHijo").val(detalle.SegundoNombreHijo);
    $("#PrimerApellidoHijo").val(detalle.PrimerApellidoHijo);
    $("#SegundoApellidoHijo").val(detalle.SegundoApellidoHijo);
    $("#TipoDocumentoHijoId").val(detalle.TipoDocumentoHijoId);
    $("#DocumentoHijo").val(detalle.DocumentoHijo);
    $('#SexoHijoId').val(detalle.SexoHijoId);
    $("#FechaNacimientoHijo").val(detalle.FechaNacimientoHijo);
    $("#FechaNacimientoHijo").datepicker("option", "dateFormat", "d 'de' MM 'del' yy");
}

function getPosHijo() {
    var docDetalle = $("#posicion-detalle").val();
    for (var i = 0; i < $DATA_HIJOS.length; i++) {
        if ($DATA_HIJOS[i].DocumentoHijo == docDetalle) return i;
    }
    return 0;
}

/**
 * Agrega correo al listado temporal
 */
function agregarEditarHijo() {
    var fechaNacimientoTexto = $("#FechaNacimientoHijo").val();
    $("#FechaNacimientoHijo").datepicker("option", "dateFormat", "dd/mm/yy")
    var jsonHijo = {
        PrimerNombreHijo: $("#PrimerNombreHijo").val(),
        SegundoNombreHijo: $("#SegundoNombreHijo").val(),
        PrimerApellidoHijo: $("#PrimerApellidoHijo").val(),
        SegundoApellidoHijo: $("#SegundoApellidoHijo").val(),
        TipoDocumentoHijoId: $("#TipoDocumentoHijoId").val(),
        TipoDocumentoHijo: $('#TipoDocumentoHijoId option:selected').text(),
        DocumentoHijo: $("#DocumentoHijo").val(),
        SexoHijo: $('#SexoHijoId :selected').text(),
        SexoHijoId: $('#SexoHijoId').val(),
        FechaNacimiento: fechaNacimientoTexto,
        FechaNacimientoHijo: $("#FechaNacimientoHijo").val()
    };

    var pxDetalle = getPosHijo();
    $DATA_HIJOS[pxDetalle] = jsonHijo;
    ActualizarTablaHijos($DATA_HIJOS);
    Utils._CloseModal();
}
