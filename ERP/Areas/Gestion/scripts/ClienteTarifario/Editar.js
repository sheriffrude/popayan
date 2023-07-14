function onSuccessEditarClienteTarifario() {
    setTimeout(function () {
        if ($TABLA_CLIENTE_TARIFARIO != null) {
            $TABLA_CLIENTE_TARIFARIO.draw();
        }
    }, 1000);
}