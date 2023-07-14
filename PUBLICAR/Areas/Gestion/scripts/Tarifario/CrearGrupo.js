function onSuccessCrearTarifarioGrupo() {
    setTimeout(function () {
        if ($TABLA_TARIFARIO_GRUPO != null) {
            $TABLA_TARIFARIO_GRUPO.draw();
        }
    }, 1000);
}