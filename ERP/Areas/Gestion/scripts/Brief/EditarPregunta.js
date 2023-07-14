/**
 * Variables Globales
 */
var DATA_OPCIONES_EDITAR = [];
var $TABLA_OPCIONES_EDITAR = null;

/**
 * OnLoadEditarPregunta
 */
function OnLoadEditarPregunta() {
    DATA_OPCIONES_EDITAR = [];
    var tipoOpcion = $("#TipoPregunta").val();
    var $contenedorOpciones = $("#contenedor-opciones");
    if (tipoOpcion == 2 || tipoOpcion == 3) {
        $contenedorOpciones.show();
        CargarTablaOpcionesEditar();
    } else
        $contenedorOpciones.hide();

}

/**
 * OnChangeTipoPreguntaEditar
 * @param {any} e
 */
function OnChangeTipoPreguntaEditar(e) {
    var tipoOpcion = $(e).val();
    var $contenedorOpciones = $("#contenedor-opciones");
    if (tipoOpcion == 2 || tipoOpcion == 3) {
        $contenedorOpciones.show();
    } else
        $contenedorOpciones.hide();
}

/**
 * CargarTablaOpcionesEditar
 */
function CargarTablaOpcionesEditar() {
    $TABLA_OPCIONES_EDITAR = $("#tabla-opciones").dataTable({
        "serverSide": false,
        "destroy": true,
        "bPaginate": false,
    });

    var data = $TABLA_OPCIONES_EDITAR.fnGetData();
    var tamanoData = data.length;
    for (var i = 0; i < tamanoData; i++) {
        DATA_OPCIONES_EDITAR.push({
            Id: i,
            Opcion: data[i][0]
        });
    }
    
    if ($TABLA_OPCIONES_EDITAR != null)
        $TABLA_OPCIONES_EDITAR.fnDestroy();

    ConstruirTablaOpcionesEditar();
}

/**
 * ConstruirTablaOpcionesEditar
 * @returns {} 
 */
function ConstruirTablaOpcionesEditar() {
    $TABLA_OPCIONES_EDITAR = $("#tabla-opciones").dataTable({
        "destroy": true,
        "serverSide": false,
        "data": DATA_OPCIONES_EDITAR,
        "columns": [
            {
                "data": "Opcion",
                "orderable": false,
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="EliminarOpcionEditar(' + data + ')" >';
                }
            }
        ]
    });
}

/**
 * AdicionarOpcionEditar
 * @returns {} 
 */
function AdicionarOpcionEditar() {
    var opcion = $("#Opcion").val();
    if (opcion == null || opcion == "") {
        Utils._BuilderMessage("danger", "El campo Opción es requerido.");
    } else {
        var longitudDataOpciones = DATA_OPCIONES_EDITAR.length;
        for (var i = 0; i < longitudDataOpciones; i++) {
            if (DATA_OPCIONES_EDITAR[i]['Opcion'] == opcion) {
                Utils._BuilderMessage("danger", "Ya existe esta Opción.");
                return false;
            }
        }

        DATA_OPCIONES_EDITAR.push({
            Opcion: opcion,
        });

        longitudDataOpciones = DATA_OPCIONES_EDITAR.length;
        for (var i = 0; i < longitudDataOpciones; i++) {
            DATA_OPCIONES_EDITAR[i]['Id'] = i;
        }
        
        if ($TABLA_OPCIONES_EDITAR != null)
            $TABLA_OPCIONES_EDITAR.fnDestroy();

        ConstruirTablaOpcionesEditar();

        $("#Opcion").val('');
    }
    return false;
}

/**
 * EliminarOpcionEditar
 * @param {int} id 
 * @returns {} 
 */
function EliminarOpcionEditar(id) {
    var longitudDataOpciones = DATA_OPCIONES_EDITAR.length;
    for (var i = 0; i < longitudDataOpciones; i++) {
        if (DATA_OPCIONES_EDITAR[i]["Id"] == id) {
            DATA_OPCIONES_EDITAR.splice(i, 1);
            break;
        }
    }

    longitudDataOpciones = DATA_OPCIONES_EDITAR.length;
    for (var i = 0; i < longitudDataOpciones; i++) {
        DATA_OPCIONES_EDITAR[i]['Id'] = i;
    }

    if ($TABLA_OPCIONES_EDITAR != null)
        $TABLA_OPCIONES_EDITAR.fnDestroy();

    ConstruirTablaOpcionesEditar();
}

/**
 * OnBeginEditarPregunta
 * @param {any} jqXHR
 * @param {any} settings
 */
function OnBeginEditarPregunta(jqXHR, settings) {
    var tipo = $("#TipoPregunta").val();
    var longitudDataOpcion = DATA_OPCIONES_EDITAR.length;
    if ((tipo == 2 || tipo == 3) && longitudDataOpcion < 2) {
        Utils._BuilderMessage("danger", "Debe agregar mínimo 2 Opciones para continuar.");
        return false;
    }

    var briefId = $("#Id").val();

    ///Obtiene las Opciones
    var opciones = [];
    for (var i = 0; longitudDataOpcion > i; i++) {
        opciones.push(DATA_OPCIONES_EDITAR[i]["Opcion"]);
    }

    var data = $(this).serializeObject();
    data["ListaOpciones"] = opciones;
    data["BriefId"] = briefId;
    settings.data = jQuery.param(data);
    return true;
}

/**
 * OnCompleteEditarPregunta
 * @param {any} result
 */
function OnCompleteEditarPregunta(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        if (resultado.state == true) {
            Utils._BuilderMessage("success", resultado.message);
            Utils._CloseModal();
            RecargarTabla();
        } else {
            Utils._BuilderMessage("danger", resultado.message);
        }
    }
}