# Eyes Control Lora node for ComfyUI
Widget to tell Flux 2 Klein where the eyes must look at. To be used with Eyes_Direction_Lora for Flux2Klein

## Install

Clone into your `ComfyUI/custom_nodes/`:

```bash
cd ComfyUI/custom_nodes/
git clone https://github.com/eric-venti-seeds/Sphere-Light-Render-ComfyUI.git
```

Restart ComfyUI. No additional Python dependencies for the core node.


Download the Lora from here:

[https://huggingface.co/eric-venti-seeds/Eyes_Direction_Lora_Flux2Klein9B](https://huggingface.co/eric-venti-seeds/Eyes_Direction_Lora_Flux2Klein9B)



The Node renders a 1024 x 1024 image as reference for the LoRA to understand where the light comes from

<img width="768" height="947" alt="Eyes_direction_node" src="https://github.com/user-attachments/assets/4509d7b5-7cef-46e5-b524-e6f34bb3dca4" />
