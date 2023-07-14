///Variables globales
var $TABLA_EMPRESA_IMPUESTO = null;

//Onload page
$(function () {
    ConstruirTablaEmpresaImpuesto();
    $("#form-filtro-tabla").submit(FiltrarTablaEmpresaImpuesto);

});

/**
 * Función que recarga la información de la grid
 */
function RecargarTablaImpuestos() {
    if ($TABLA_EMPRESA_IMPUESTO != null) {
        $TABLA_EMPRESA_IMPUESTO.draw();
    }
    return false;
}

/**
* 
*/
function FiltrarTablaEmpresaImpuesto() {
    if ($TABLA_EMPRESA_IMPUESTO != null) {
        $TABLA_EMPRESA_IMPUESTO.draw();
    }
    return false;
}

/**
 * Construye la tabla por jquery
 */
function ConstruirTablaEmpresaImpuesto() {
    var $filtro = $("#input-filtro");
    $TABLA_EMPRESA_IMPUESTO = $("#tabla-empresa-impuesto").DataTable({
        "ajax": {
            "url": URL_LISTAR_EMPRESA_IMPUESTO,
            "type": "POST",
            "data": function (d) {
                d.search['value'] = $filtro.val();
                return $.extend({}, d, {
                    "adicional": {
                        EmpresaId: $("#EmpresaId").val()
                    }
                });
            }
        },
        "columns": [
            { "data": "Nombre", "width": "20%"},
            { "data": "FechaVencimiento", "width": "20%" },
            { "data": "Valor", "width": "20%" },
            { "data": "Periocidad", "width": "30%" },           
            { "data": "Estado", "width": "20%" },
            {
                "data": "Id",
                "orderable": false,
                "searchable": false,
                "width": "20%",
                "render": function (data, type, full, meta) {

                    var botonEditar = '<a href="' + URL_EDITAR_EMPRESA_IMPUESTO + '?id=' + data + '" data-toggle="modal" data-target="#" class="btn btn-info btn-sm" >Editar</a>'
                    var resultado = ""
                    resultado += (PERMISO_EDITAR_EMPRESA_IMPUESTO) ? botonEditar : "";
                    return resultado;
                }


            }
        ],
        "drawCallback": function (settings) {
            Utils._BuilderModal();
        }
    });
}
