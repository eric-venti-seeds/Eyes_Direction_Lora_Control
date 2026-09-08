import numpy as np
import torch

CANVAS_SIZE = 1024
FRAME_SIZE = 640
FRAME_MARGIN = (CANVAS_SIZE - FRAME_SIZE) // 2
DOT_RADIUS = 85
BORDER_THICKNESS = 6


class EyesDirectionControl:
    CATEGORY = "utils/image"
    RETURN_TYPES = ("IMAGE",)
    RETURN_NAMES = ("image",)
    FUNCTION = "run"

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "x": ("FLOAT", {"default": 0.5, "min": 0.0, "max": 1.0, "step": 0.001}),
                "y": ("FLOAT", {"default": 0.5, "min": 0.0, "max": 1.0, "step": 0.001}),
            }
        }

    def run(self, x, y):
        size = CANVAS_SIZE
        img = np.ones((size, size, 3), dtype=np.float32)

        t = BORDER_THICKNESS
        m0 = FRAME_MARGIN
        m1 = FRAME_MARGIN + FRAME_SIZE
        img[m0:m0 + t, m0:m1, :] = 0.0
        img[m1 - t:m1, m0:m1, :] = 0.0
        img[m0:m1, m0:m0 + t, :] = 0.0
        img[m0:m1, m1 - t:m1, :] = 0.0

        cx = x * size
        cy = y * size
        yy, xx = np.ogrid[:size, :size]
        mask = (xx - cx) ** 2 + (yy - cy) ** 2 <= DOT_RADIUS ** 2
        img[mask] = (1.0, 0.0, 0.0)

        tensor = torch.from_numpy(img).unsqueeze(0)
        return (tensor,)


NODE_CLASS_MAPPINGS = {
    "EyesDirectionControl": EyesDirectionControl,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "EyesDirectionControl": "Eyes Direction Control",
}
