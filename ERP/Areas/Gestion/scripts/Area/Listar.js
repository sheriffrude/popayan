///Variables globales
var $TABLA_AREA = null;

//Onload page
$(function () {
    ConstruirTablaArea();
    $("#form-filtro-tabla").submit(RecargarTablaArea);
});

function RecargarTablaArea() {
    if ($TABLA_AREA != null)
        $TABLA_AREA.draw();
    return false;
}

function ConstruirTablaArea() {
    var $filtro = $("#input-filtro");
    $TABLA_AREA = $("#tabla-Area").DataTable({
        "ajax": {
            "url": URL_LISTAR_AREA,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {}
                });
            },

        }, "columns": [
            { "data": "Nombre" },
            { "data": "Estado" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "5%",
                "render": function (data, type, full, meta) {
                    return (PERMISO_EDITAR_AREA)
                   ? '<a href="' + URL_EDITAR_AREA + '?id=' + data + '"  data-toggle="modal" data-target="#" class="btn btn-info btn-sm" >Editar</a>'
                      :"";
                }
            }
            
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}