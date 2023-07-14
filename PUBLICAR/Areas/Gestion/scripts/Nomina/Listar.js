//Onload page
$(function () {
    ConstruirTablaNomina();
    $("#form-filtro-tabla").submit(RecargarTablaNomina);
});

function RecargarTablaNomina() {
    if ($TABLA_NOMINA != null) {
        $TABLA_NOMINA.draw();
    }
    return false;
}

function ConstruirTablaNomina() {
    var $filtro = $("#input-filtro");
    $TABLA_NOMINA = $("#tabla-nominas").DataTable({
        "scrollX": true,
        "ajax": {
            "url": URL_LISTAR_NOMINA,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },
        }, "columns": [
        { "data": "Ano" },
        { "data": "Mes" },
        {
            "data": "Id",
            "orderable": false,
            "searchable": false,
            "width": "10%",
            "render": function (data, type, full, meta) {
                return (PERMISO_DESCARGAR_NOMINA)
                    ? '<a href="' + URL_DESCARGAR_NOMINA + '?id=' + data + '" title="Descargar">' +
                        '<img src="/Content/images/Gestion/boton-descargar.png" alt="Descargar" />' +
                        '</a>'
               : null;
            }
        },
        {
            "data": "Id",
            "orderable": false,
            "searchable": false,
            "width": "10%",
            "render": function (data, type, full, meta) {
                return (PERMISO_ELIMINAR_NOMINA)
                    ? '<button class="btn btn-danger btn-sm" onclick="EliminarNomina(' + data + ')"  >ELIMINAR</button>'
               : null;
            }
        },
        ],
        "drawCallback": function (settings) {
            //Utils._BuilderModal();
        }
    });
}

function EliminarNomina(id) {
    var parametros = {
        Id: id
    };
    $.ajax({
        url: URL_ELIMINAR_NOMINA,
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (respuesta) {
            if (respuesta.state == true) {
                Utils._BuilderMessage("success", respuesta.message);
                RecargarTablaNomina();
            } else {
                Utils._BuilderMessage("danger", respuesta.message);
            }
        }
    });
}