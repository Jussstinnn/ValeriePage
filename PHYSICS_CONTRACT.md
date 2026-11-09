# Contrato raíz / pelvis / apoyo

Escena: CSS px; Canvas aplica DPR una vez. Actor: origen(x,y), escala s, misma postura Kinematics.posture para torso y pies en vuelo. Atlas: coordenadas inmutables del peluche ilustrado.

Suelo: foot.space=world, contact=true; apoyo y sombra pertenecen a la escena. Vuelo: foot.space=actor, contact=false; local=(±footX,-7) y conversión Kinematics.localToWorld. PlushRig dibuja esa pieza bajo la misma transformación del cuerpo. No se alarga ninguna extremidad ni se añade geometría para ocultar huecos. La sombra queda en suelo.

Fases del cruce: grounded/anticipation/takeoff/flight/landing/settle. GuardianActing nunca cancela el salto de otro productor. El render no deduce contacto de una coordenada de cámara. Pausa conserva tiempo; restauración recompone el mismo estado; reducción de movimiento selecciona el plano asentado.

Baseline de dibujos/modelos preservado. Los hashes nuevos de rig y animación identifican la reparación mecánica autorizada; el manifiesto F8 anterior se conserva íntegro.
