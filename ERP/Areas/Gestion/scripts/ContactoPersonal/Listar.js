///Variables globales
var $TABLA_CONTACTOS = null;

//Onload page
$(function () {
    $("#date-format").datepicker();
    $("#date-format").datepicker("option", "dateFormat", "d 'de' MM");
    ConstruirTablaContactos();
    $("#form-filtro-tabla").submit(RecargarTablaContactos);
});

/**
 * 
 */
function RecargarTablaContactos() {
    if ($TABLA_CONTACTOS != null) {
        $TABLA_CONTACTOS.draw();
    }
    return false;
}

/**
 * 
 */
function ResetearTablaContactos() {
    $("#input-filtro").val('');
    RecargarTablaContactos();
}

/**
 * 
 */
function ConstruirTablaContactos() {
    var $filtro = $("#input-filtro");
    $TABLA_CONTACTOS = $("#tabla-contactos").DataTable({
        "ajax": {
            "url": URL_LISTAR_CONTACTOS,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },

        }, "columns": [
            { "data": "Nombre" },
            { "data": "CorreoElectronico" },
            { "data": "Telefono" },
            { "data": "Celular" },
            {
                "data": "FechaCumpleanos",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    $("#date-format").datepicker({
                        dateFormat: "d 'de' MM"
                    }).datepicker('setDate', data);
                    var fechaCumpleanos = $("#date-format").val();
                    return fechaCumpleanos;
                }
            },
            {
                "data": "Estado",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    return data;
                }
            },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_CONTACTOS)
                        ? '<a href="' + URL_EDITAR_CONTACTOS + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-secondary btn-sm" >Editar</a>'
                        : "";
                }
            },
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}