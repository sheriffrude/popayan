/**
 * Variables Globales
 */
var DATA_TELEFONOS = [];
var $TABLA_TELEFONOS = null;

var DATA_CELULARES = [];
var $TABLA_CELULARES = null;

/**
 * OnLoad Page
 */
$(function () {
    CargarTablaTelefonos();
    CargarTablaCelulares();

    $("#FechaNacimiento").datepicker();
});

/**
 * Carga la tabla telefonos con la informacion del HTML
 */
function CargarTablaTelefonos() {
    $TABLA_TELEFONOS = $("#tabla-telefonos").dataTable({
        "serverSide": false,
        "destroy": true,
        "bPaginate": false,
    });
    var data = $TABLA_TELEFONOS.fnGetData();
    var tamanoData = data.length;
    for (var i = 0; i < tamanoData; i++) {
        DATA_TELEFONOS.push({ "telefono": data[i][0] });
    }
    RecargarTablaTelefonos();
}

/**
 * Construye la tabla telefonos apartir de DATA_TELEFONOS
 */
function ConstruirTablaTelefonos() {
    $TABLA_TELEFONOS = $("#tabla-telefonos").dataTable({
        "destroy": true,
        "serverSide": false,
        "data": DATA_TELEFONOS,
        "bPaginate": false,
        "columns": [
            {
                "data": "telefono",
                "orderable": false,
            },
            {
                "data": "id",
                "orderable": false,
                "searchable": false,
                "width": "20%",
                "render": function (data, type, full, meta) {
                    var html = '<input type="hidden" name="ListaTelefonos" value="' + full.telefono + '" />';
                    html += '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="EliminarTelefono(' + data + ')" />';
                    return html;
                }
            }
        ]
    });
}

/**
 * Recarga la tabla telefonos
 */
function RecargarTablaTelefonos() {
    var tamanoDataTelefonos = DATA_TELEFONOS.length;
    for (var i = 0; i < tamanoDataTelefonos; i++) {
        DATA_TELEFONOS[i]["id"] = i;
    }
    if ($TABLA_TELEFONOS != null) {
        $TABLA_TELEFONOS.fnDestroy();
        ConstruirTablaTelefonos();
    }
}

/**
 * Adiciona Telefonos
 */
function AdicionarTelefono() {
    var $telefono = $("#telefono");
    var telefono = $telefono.val();
    if (!Validations._Requerido(telefono)) {
        Utils._BuilderMessage("danger", "El campo telefono no puede ser nulo.");
        return false;
    }
    var tamanoDataTelefonos = DATA_TELEFONOS.length;
    for (var i = 0; i < tamanoDataTelefonos; i++) {
        if (DATA_TELEFONOS[i]["telefono"] == telefono) {
            Utils._BuilderMessage("danger", "Ya existe este telefono.");
            return false;
        }
    }

    var objectTelefono = {
        "telefono": telefono
    };
    DATA_TELEFONOS.push(objectTelefono);
    RecargarTablaTelefonos();
    $telefono.val("");
}

/**
 * Elimina telefonos
 */
function EliminarTelefono(id) {
    DATA_TELEFONOS.splice(id, 1);
    RecargarTablaTelefonos();
}

/**
 * Construye la tabla celulares apartir del HTML
 */
function CargarTablaCelulares() {
    $TABLA_CELULARES = $("#tabla-celulares").dataTable({
        "serverSide": false,
        "destroy": true,
        "bPaginate": false,
    });
    var data = $TABLA_CELULARES.fnGetData();
    var tamanoData = data.length;
    for (var i = 0; i < tamanoData; i++) {
        DATA_CELULARES.push({ "celular": data[i][0] });
    }
    RecargarTablaCelulares();
}

/**
 * Construye la tabla celulares apartir de DATA_CELULARES
 */
function ConstruirTablaCelulares() {
    $TABLA_CELULARES = $("#tabla-celulares").dataTable({
        "destroy": true,
        "serverSide": false,
        "data": DATA_CELULARES,
        "bPaginate": false,
        "columns": [
            {
                "data": "celular",
                "orderable": false,
            },
            {
                "data": "id",
                "orderable": false,
                "searchable": false,
                "width": "20%",
                "render": function (data, type, full, meta) {
                    var html = '<input type="hidden" name="ListaCelulares" value="' + full.celular + '" />';
                    html += '<input type="button" class="btn btn-danger btn-sm" value="ELIMINAR" onclick="EliminarCelular(' + data + ')" />';
                    return html;
                }
            }
        ]
    });
}

/**
 * Recarga la tabla celulares
 */
function RecargarTablaCelulares() {
    var tamanoDataCelulares = DATA_CELULARES.length;
    for (var i = 0; i < tamanoDataCelulares; i++) {
        DATA_CELULARES[i]["id"] = i;
    }
    if ($TABLA_CELULARES != null) {
        $TABLA_CELULARES.fnDestroy();
        ConstruirTablaCelulares();
    }
}

/**
 * Adiciona celulares
 */
function AdicionarCelular() {
    var $celular = $("#celular");
    var celular = $celular.val();
    if (!Validations._Requerido(celular)) {
        Utils._BuilderMessage("danger", "El campo celular no puede ser nulo.");
        return false;
    }
    var tamanoDataCelulares = DATA_CELULARES.length;
    for (var i = 0; i < tamanoDataCelulares; i++) {
        if (DATA_CELULARES[i]["celular"] == celular) {
            Utils._BuilderMessage("danger", "Ya existe este celular.");
            return false;
        }
    }

    var objectCelular = {
        "celular": celular
    };
    DATA_CELULARES.push(objectCelular);
    RecargarTablaCelulares();
    $celular.val("");
}

/**
 * Elimina Celulares
 */
function EliminarCelular(id) {
    DATA_CELULARES.splice(id, 1);
    RecargarTablaCelulares();
}