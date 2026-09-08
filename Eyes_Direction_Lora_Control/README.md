# Eyes Direction Lora Control (nodo custom ComfyUI)

Nodo "Eyes Direction Control": una imagen 1024x1024 con fondo blanco, un marco
negro fino de 640x640 centrado (decorativo), y un punto rojo (radio 85px) que
se puede mover arrastrando el ratón por todo el lienzo (llega hasta los bordes
de la imagen), o con 2 sliders horizontales (X e Y) en rango 0-1. X e Y son
entradas FLOAT normales, así que se pueden convertir a input (click derecho ->
"Convert x to input" / "Convert y to input") para controlarlas desde otro
nodo. Un botón "Center" debajo del canvas deja el punto en (0.5, 0.5).

## Instalación

1. Copia toda esta carpeta (`Eyes_Direction_Lora_Control`) dentro de
   `ComfyUI/custom_nodes/`.
2. Reinicia ComfyUI (o recarga la página si ya lo tenías abierto, pero un
   reinicio completo del servidor es lo más seguro la primera vez).
3. Busca el nodo como **"Eyes Direction Control"** (categoría `utils/image`)
   al añadir un nodo nuevo.

## Uso

- Arrastra el punto rojo dentro del canvas del nodo para moverlo por todo el
  lienzo de 1024x1024.
- Los sliders X e Y (widgets nativos de ComfyUI) se actualizan solos al mover
  el punto, y viceversa.
- El botón "Center" pone el punto en el centro exacto (0.5, 0.5).
- Clic derecho sobre el nombre del widget X o Y -> "Convert to input" para
  conectarles un FLOAT desde otro nodo (por ejemplo un nodo de animación).
- La salida `IMAGE` es la imagen 1024x1024 ya renderizada con el punto en su
  posición actual.

## Notas técnicas

- `nodes.py`: nodo Python (`EyesDirectionControl`), genera la imagen con
  numpy/torch (fondo blanco, marco decorativo 640x640 de 6px centrado, círculo
  rojo de radio 85px en `(x*1024, y*1024)`).
- `web/js/eyes_direction_control.js`: extensión del frontend que añade el
  mini-canvas arrastrable, el botón de centrado y mantiene todo sincronizado
  con los widgets `x`/`y` nativos del nodo, reescalándose con el tamaño del
  nodo.

No he podido probarlo en vivo porque este entorno no tiene ComfyUI instalado.
Si algo no se ve bien dime exactamente qué falla y lo ajusto.
