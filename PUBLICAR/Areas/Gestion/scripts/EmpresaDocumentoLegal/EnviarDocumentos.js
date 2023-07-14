/**
 * Variables Globales
 */

var DATA_EMAILS = [];
var DATA_DOCUMENTOS = [];
var $TABLA_EMAILS = null;
var $TABLA_DOCUMENTOS = null;
var CONTADOR_EMAILS = 0;

/**
 * Función de inicialización de tabla de documentos
 */
function initDocumentos() {
    CrearTablaDocumentos(DATA_DOCUMENTOS);
}

/**
 * 
 * @param {any} NEW_DATA_DOCUMENTOS
 */
function CrearTablaDocumentos(NEW_DATA_DOCUMENTOS) {
    $TABLA_DOCUMENTO = $("#tabla-Docs").dataTable({
        "destroy": true,
        "serverSide": false,
        "bPaginate": false,
        "data": NEW_DATA_DOCUMENTOS,
        "columns": [
            {
                "title": "Archivo",
                "data": "Nombre",
                "orderable": false
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var html = '<a class="btn btn-danger btn-sm" onclick="EliminarDocumento(' +
                        data +
                        ')" ><span class="glyphicon glyphicon-minus"></span></a>';
                    html += '<input type="hidden" name="Correos" value="' + full.email + '" />';
                    return html;
                }
            }
        ]
    });
}

/**
 * 
 */
function AdicionarDocumento() {
    var docLegal = $("#DocumentoLegalId").val();
    if (!Validations._Requerido(docLegal)) {
        Utils._BuilderMessage("danger", "El campo documento es requerido.");
        return false;
    }
    
    DATA_DOCUMENTOS.push({
        Nombre: $('#DocumentoLegalId option:selected').text(),
        Id: docLegal
    });
    if ($TABLA_DOCUMENTOS != null)
        $TABLA_DOCUMENTOS.fnDestroy();
    CrearTablaDocumentos(DATA_DOCUMENTOS);
    return false;
}

/**
 * Eliminar email
 * @param {int} id 
 * @returns {} 
 */
function EliminarDocumento(id) {
    var tamanoDataSetDocuments = DATA_DOCUMENTOS.length;
    var posicionDoc = -1;
    for (var i = 0; tamanoDataSetDocuments > i; i++) {
        if (DATA_DOCUMENTOS[i]["id"] == id) {
            posicionDoc = i;
            break;
        }
    }
    DATA_DOCUMENTOS.splice(posicionDoc, 1);
    if ($TABLA_DOCUMENTOS != null) {
        $TABLA_DOCUMENTOS.fnDestroy();
    }
    CrearTablaDocumentos(DATA_DOCUMENTOS);
    return false;
}



/* --------------------- */

/**
 * Función de inicialización de tabla de emails
 */
function initEmais() {
    ContruirTablaEmails();
}

/**
 * Muestra la tabla de opciones
 * @returns {} 
 */
function AdicionarEmail() {
    var email = $("#NotificarCorreos").val();
    if (!Validations._Requerido(email)) {
        Utils._BuilderMessage("danger", "El campo correo electrónico es requerido.");
        return false;
    }
    //if (!Validations._Email(email)) {
    //    Utils._BuilderMessage("danger", "El campo debe ser un correo electrónico.");
    //    return false;
    //}
    CONTADOR_EMAILS++;
    DATA_EMAILS.push({
        email: email,
        id: CONTADOR_EMAILS
    });
    if ($TABLA_EMAILS != null)
        $TABLA_EMAILS.fnDestroy();
    ContruirTablaEmails();
    return false;
}

/**
 * Eliminar email
 * @param {int} id 
 * @returns {} 
 */
function EliminarEmail(id) {
    var tamanoDataSetEmails = DATA_EMAILS.length;
    var posicionEmail = 0;
    for (var i = 0; tamanoDataSetEmails > i; i++) {
        if (DATA_EMAILS[i]["id"] == id) {
            posicionEmail = i;
            break;
        }
    }
    DATA_EMAILS.splice(posicionEmail, 1);
    if ($TABLA_EMAILS != null) {
        $TABLA_EMAILS.fnDestroy();
    }
    ContruirTablaEmails();
    return false;
}

/**
 * Contruir tabla de emails
 * @returns {} 
 */
function ContruirTablaEmails() {
    $TABLA_EMAILS = $("#tabla-Email").dataTable({
        "destroy": true,
        "serverSide": false,
        "bPaginate": false,
        "data": DATA_EMAILS,
        "columns": [
            {
                "title": "Email",
                "data": "email",
                "orderable": false
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    var html = '<a class="btn btn-danger btn-sm" onclick="EliminarEmail(' + data + ')" ><span class="glyphicon glyphicon-minus"></span></a>';
                    html += '<input type="hidden" name="Correos" value="' + full.email + '" />';
                    return html;
                }
            }
        ]
    });
}


/* --------------------- */
function OnBeginFormEnviarDocumentoLegal(jqXHR, settings) {
    var tamanoDataEmails = DATA_EMAILS.length;
    if (tamanoDataEmails == 0) {
        Utils._BuilderMessage("danger", "Debe ingresar un correo electrónico.");
        return false;
    }

    var tamanoDataDocumentos = DATA_DOCUMENTOS.length;
    if (tamanoDataDocumentos == 0) {
        Utils._BuilderMessage("danger", "Debe seleccionar el/los documento(s) a enviar.");
        return false;
    }

    var arrayEmail = [];
    for (var i = 0; i < tamanoDataEmails; i++) {
        arrayEmail.push(DATA_EMAILS[i]["email"]);
    }
    console.info(arrayEmail);
    var arrayDocumento = [];
    for (var i = 0; i < tamanoDataDocumentos; i++) {
        arrayDocumento.push(DATA_DOCUMENTOS[i]["Id"]);
    }
    console.info(arrayDocumento);
    var data = $(this).serializeObject();
    data["Correos"] = arrayEmail;
    data["DocumentosLegales"] = arrayDocumento;
    settings.data = jQuery.param(data);
    return true;
}

function OnSucessFormEnviarDocumentoLegal(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        if (resultado.state == true)
            Utils._BuilderMessage("success", resultado.message, 'RedireccionarListarDocLegales');
        else
            Utils._BuilderMessage("danger", resultado.message);
    }
}

/**
 * RedireccionarListarEmpleados
 */
function RedireccionarListarDocLegales() {
    window.location = URL_LISTADO_DOC_LEGALES;
}
