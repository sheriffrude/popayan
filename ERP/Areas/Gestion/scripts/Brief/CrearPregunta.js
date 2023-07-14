/**
 * Variables Globales
 */
var DATA_OPCIONES = [];
var $TABLA_OPCIONES = null;

/**
 * Onchange del select TipoPregunta
 * @param {Object<>} e 
 * @returns {} 
 */
function OnChangeTipoPregunta(e) {
    var tipoOpcion = $(e).val();
    var $contenedorOpciones = $("#contenedor-opciones");
    if (tipoOpcion == 2 || tipoOpcion == 3) {
        $contenedorOpciones.show();
    } else
        $contenedorOpciones.hide();
}

/**
 * Muestra la tabla de opciones
 * @returns {} 
 */
function AdicionarOpcion() {
    var opcion = $("#Opcion").val();
    if (opcion == null || opcion == "") {
        Utils._BuilderMessage("danger", "El campo Opción es requerido.");
    } else {
        var longitudDataOpciones = DATA_OPCIONES.length;
        for (var i = 0; i < longitudDataOpciones; i++) {
            if (DATA_OPCIONES[i]['Opcion'] == opcion) {
                Utils._BuilderMessage("danger", "Ya existe esta Opción.");
                return false;
            }
        }

        DATA_OPCIONES.push({
            Opcion: opcion,
        });

        longitudDataOpciones = DATA_OPCIONES.length;
        for (var i = 0; i < longitudDataOpciones; i++) {
            DATA_OPCIONES[i]['Id'] = i;
        }

        if ($TABLA_OPCIONES != null)
            $TABLA_OPCIONES.fnDestroy();
        ConstruirTablaOpciones();
        $("#Opcion").val('');
    }
    return false;
}

/**
 * Eliminar opcion
 * @param {int} id 
 * @returns {} 
 */
function EliminarOpcion(id) {
    var longitudDataOpciones = DATA_OPCIONES.length;
    for (var i = 0; i < longitudDataOpciones; i++) {
        if (DATA_OPCIONES[i]["Id"] == id) {
            DATA_OPCIONES.splice(i, 1);
            break;
        }
    }

    longitudDataOpciones = DATA_OPCIONES.length;
    for (var i = 0; i < longitudDataOpciones; i++) {
        DATA_OPCIONES[i]['Id'] = i;
    }

    if ($TABLA_OPCIONES != null)
        $TABLA_OPCIONES.fnDestroy();
    ConstruirTablaOpciones();
}

/**
 * Contruir tabla de opciones
 * @returns {} 
 */
function ConstruirTablaOpciones() {
    $TABLA_OPCIONES = $("#tabla-opciones").dataTable({
        "destroy": true,
        "serverSide": false,
        "data": DATA_OPCIONES,
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
                    return '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="EliminarOpcion(' + data + ')" >';
                }
            }
        ]
    });
}

/**
 * Guardar pregunta
 * @returns {boolean} 
 */
function OnBeginCrearPregunta(jqXHR, settings) {
    ///Valida el tipo de pregunta y la cantidad de Opciones
    var tipo = $("#TipoPregunta").val();
    var longitudDataOpcion = DATA_OPCIONES.length;
    if ((tipo == 2 || tipo == 3) && longitudDataOpcion < 2) {
        Utils._BuilderMessage("danger", "Debe agregar mínimo 2 Opciones para continuar.");
        return false;
    }

    ///Obtiene las Opciones
    var opciones = [];
    for (var i = 0; longitudDataOpcion > i; i++) {
        opciones.push(DATA_OPCIONES[i]["Opcion"]);
    }

    ///Obtiene los demás datos de la pregunta
    var pregunta = $("#Pregunta").val();
    var descripcion = $("#Descripcion").val();
    var obligatorio = $("#Obligatorio").is(":checked");
    var jsonPregunta = {
        Nombre: pregunta,
        Descripcion: descripcion,
        TipoPregunta: tipo,
        Obligatorio: obligatorio,
        ListaOpciones: opciones
    };

    ///Adiciona la pregunta
    DATA_PREGUNTAS.push(jsonPregunta);

    var longitudDataPreguntas = DATA_PREGUNTAS.length;
    for (var i = 0; i < longitudDataPreguntas; i++) {
        DATA_PREGUNTAS[i]['Id'] = i;
    }

    ///Destruye la tabla de Opciones
    if ($TABLA_OPCIONES != null)
        $TABLA_OPCIONES.fnDestroy();
    DATA_OPCIONES = [];

    ///Destruye la tabla de Preguntas
    if ($TABLA_PREGUNTAS != null)
        $TABLA_PREGUNTAS.fnDestroy();

    ///Crea la tabla de preguntas
    CrearTablaPreguntas();

    Utils._CloseModal();
    return false;
}