$(function () {
    DocumentoLegalCrear.OnLoad();
});

var DocumentoLegalCrear = {
    ContadorEmail: 0,
    DataEmail: [],
    TablaEmail: null,

    OnLoad: function () {
        var estadoTransaccion = $("#EstadoListado").val();

        $("#FechaVencimiento").datepicker({
            dateFormat: 'dd/mm/yy',
            firstDay: 1,
            minDate: '0'
        }).datepicker("setDate", new Date()).val('');
        DocumentoLegalCrear.ContruirTablaEmails();

        if (estadoTransaccion == "True") {
            Utils._BuilderMessage('success', "Se registró correctamente el documento legal", DocumentoLegalCrear.RedireccionarListarDocLegales);
        }
    },

    ContruirTablaEmails: function () {
        DocumentoLegalCrear.TablaEmail = $("#tabla-Email").dataTable({
            "destroy": true,
            "serverSide": false,
            "bPaginate": false,
            "data": DocumentoLegalCrear.DataEmail,
            "columns": [
                {
                    "title": "Email",
                    "data": "email",
                    "orderable": false
                },
                {
                    "title": "",
                    "data": "id",
                    "orderable": false,
                    "searchable": false,
                    "width": "5%",
                    "render": function (data, type, full, meta) {
                        var html = '<a class="btn btn-danger btn-sm" onclick="DocumentoLegalCrear.EliminarEmail(' + data + ')" >Eliminar</a>';
                        html += '<input type="hidden" name="Correos" value="' + full.email + '" />';
                        return html;
                    }
                }
            ]
        });
    },

    AdicionarEmail: function () {
        var email = $("#NotificarCorreos").val();
        if (!Validations._Requerido(email)) {
            Utils._BuilderMessage("danger", "El campo Notificar a email es requerido.");
            return false;
        }

        if (!Validations._Email(email)) {
            Utils._BuilderMessage("danger", "El campo Notificar a email no es un Correo Electrónico valido.");
            return false;
        }

        DocumentoLegalCrear.ContadorEmail++;

        DocumentoLegalCrear.DataEmail.push({
            email: email,
            id: DocumentoLegalCrear.ContadorEmail
        });

        if (DocumentoLegalCrear.TablaEmail != null)
            DocumentoLegalCrear.TablaEmail.fnDestroy();
        DocumentoLegalCrear.ContruirTablaEmails();

        $("#NotificarCorreos").val("");

        return false;
    },

    EliminarEmail: function (id) {
        var tamanoDataSetEmails = DocumentoLegalCrear.DataEmail.length;
        var posicionOpcion = 0;
        for (var i = 0; tamanoDataSetEmails > i; i++) {
            if (DocumentoLegalCrear.DataEmail[i]["id"] == id) {
                posicionEmail = i;
                break;
            }
        }
        DocumentoLegalCrear.DataEmail.splice(posicionEmail, 1);
        if (DocumentoLegalCrear.TablaEmail != null) {
            DocumentoLegalCrear.TablaEmail.fnDestroy();
        }
        DocumentoLegalCrear.ContruirTablaEmails();
        return false;
    },

    OnBeginCrearDocLegalEmpresa: function (jqXHR, settings) {
        var data = $(this).serializeObject();
        if (DocumentoLegalCrear.DataEmail.length <= 0) {
            Utils._BuilderMessage('danger', 'Debe agregar al menos un correo de notificación.');
            return false;
        }
        data["Correos"] = DocumentoLegalCrear.DataEmail;
        settings.data = jQuery.param(data);
        return true;
    },

    OnCompleteCrearDocLegalEmpresa: function (response) {
        var resultado = RequestHttp._ValidateResponse(response);
        if (resultado != null) {
            if (resultado.state == true)
                Utils._BuilderMessage('success', resultado.message, 'DocumentoLegalCrear.RedireccionarListarDocLegales');
            else
                Utils._BuilderMessage('danger', resultado.message);
        }
    },

    RedireccionarListarDocLegales: function () {
        window.location.href = URL_LISTADO_DOC_LEGALES;
    }
}