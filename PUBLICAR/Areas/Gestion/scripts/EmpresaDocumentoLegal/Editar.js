/**
 * Variables Globales
 */
var DATA_EMAILS = [];
var $TABLA_EMAILS = null;
var CONTADOR_EMAILS = 0;
var FILE = null;

/**
 * Datapicker
 */
$(function () {
    var fechaVecimiento = $("#FechaVencimientoAux").val();
    var notificarCorreos = $("#items-email").val();
    if (notificarCorreos != undefined && notificarCorreos != null) {
        var emails = notificarCorreos.split(",");
        for (var i = 0; i < emails.length; i++) {
            if (emails[i].length > 0) {
                DATA_EMAILS.push({
                    email: emails[i],
                    id: CONTADOR_EMAILS
                });
                CONTADOR_EMAILS++;
            }
        }
    }
    $("#FechaVencimiento").datepicker({
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        minDate: '0'
    }).datepicker("setDate", fechaVecimiento);
    ContruirTablaEmails();
})

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
    var posicionOpcion = 0;
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
    ContruirTablaEmails(DATA_EMAILS);
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
                "title": "Eliminar",
                "data": "id",
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

/**
 * OnBeginCrearEmpresa
 * @param {Object} jqXHR
 * @param {Object} settings
 */
function OnBeginCrearDocLegalEmpresa(jqXHR, settings) {
    var data = $(this).serializeObject();
    if (DATA_EMAILS.length <= 0) {
        Utils._BuilderMessage('danger', 'Debe agregar al menos un correo de notificación.');
        return false;
    }
    data["Correos"] = DATA_EMAILS;
    settings.data = jQuery.param(data);
    return true;
}

/**
 * OnCompleteCrearEmpresa
 * @param {Object} response
 */
function OnCompleteCrearDocLegalEmpresa(response) {
    var resultado = RequestHttp._ValidateResponse(response);
    if (resultado != null) {
        if (resultado.state == true)
            Utils._BuilderMessage('success', resultado.message, 'RedireccionarListarDocLegales');
        else
            Utils._BuilderMessage('danger', resultado.message);
    }
}

/**
 * RedireccionarListarEmpresa
 */
function RedireccionarListarDocLegales() {
    window.location.href = URL_LISTADO_DOC_LEGALES;
}