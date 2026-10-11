"""Amplía una imagen al doble con una red neuronal (EDSR o FSRCNN de OpenCV).

Uso: python3 scripts/superres.py <modelo.pb> <entrada.png> <salida.png>
Requiere opencv-contrib-python-headless y un modelo, por ejemplo EDSR_x2.pb:
https://github.com/Saafke/EDSR_Tensorflow/tree/master/models
split-collage.mjs lo usa cuando recibe --sr <modelo.pb>.
"""
import os
import sys

import cv2

model, src, dst = sys.argv[1:4]
name = os.path.basename(model).lower()
algo = 'edsr' if 'edsr' in name else 'fsrcnn' if 'fsrcnn' in name else 'espcn'
scale = int(name.split('_x')[1][0]) if '_x' in name else 2
sr = cv2.dnn_superres.DnnSuperResImpl_create()
sr.readModel(model)
sr.setModel(algo, scale)
cv2.imwrite(dst, sr.upsample(cv2.imread(src)))
