/*
*VARIABLES GLOBALES
*/
var $TABLA_IMPUESTOS_ORDEN_COMPRA = null;

/*
*Simula el onload
*/
function impuestoOrdenCompra()
{
    //var ordenCompra = ('#OrdenCompraId').val();
    CrearTablaImpuestosOrdenCompra();
}

/*
*Crea la tabla con los impuestos totalizados de la OC
*/
function CrearTablaImpuestosOrdenCompra() {
    $TABLA_IMPUESTOS_ORDEN_COMPRA = $("#tabla-impuesto-orden-compra").DataTable({
        "destroy": true,
        "serverSide": false,
        "bPaginate": false,
        "bInfo": false,
        "drawCallback": function (settings) {
            ConvertirCantidad();
            Utils._InputFormatPrice();
        }
    });
}

/*
*Formatear cantidades de los impuestos
*/
function ConvertirCantidad() {
    $("input[name='data-price']").each(function (index) {
        var valor = $(this).val();
        var finalValor = parseFloat(valor.replace(",", ".")).toFixed(2);
        $(this).val(finalValor);

    });
}
