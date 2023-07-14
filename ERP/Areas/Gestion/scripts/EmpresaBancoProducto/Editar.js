function onSuccessEditarProducto() {
    setTimeout(function () {
        if ($TABLA_BANCO_PRODUCTO != null) {
            $TABLA_BANCO_PRODUCTO.draw();
        }
    }, 1000);
}