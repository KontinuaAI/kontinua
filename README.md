<div align="center">
    <h1>⬡ Kontinua</h1>
    <p><strong>The Open-Core Physics AI Platform</strong></p>
    <p>Train, evaluate, and deploy neural PDE surrogates 1,000× faster than traditional HPC solvers.</p>
</div>

<br>

<div align="center">

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![PyPI](https://img.shields.io/pypi/v/kontinua)](https://pypi.org/project/kontinua/)
[![Docs](https://img.shields.io/badge/docs-kontinua.ai-indigo)](https://docs.kontinua.ai)
[![arXiv](https://img.shields.io/badge/arXiv-2412.00568-b31b1b.svg)](https://arxiv.org/abs/2412.00568)
[![NeurIPS](https://img.shields.io/badge/NeurIPS-2024-68448B.svg)](https://openreview.net/forum?id=00Sx577BT3)
[![HuggingFace](https://img.shields.io/badge/Hugging%20Face-kontinua-FFD21E.svg)](https://huggingface.co/kontinua)

</div>

---

## ⚡ What is Kontinua?

**Kontinua** is an open-core physics AI platform built for engineers, researchers, and scientific ML practitioners. It replaces expensive, multi-day HPC simulation runs (CFD, FEA, MHD) with millisecond-scale neural operator and transformer surrogates.

### 🌟 Core Capabilities

* **Open-Source Core (`pip install kontinua`)**: 8 production-ready architectures (FNO, CNextU-Net, TFNO, AViT, AFNO, DilatedResNet, ReFNO), standardized spatial/spectral/temporal evaluation metrics, physics-aware normalization, and local ONNX/TensorRT export.
* **15TB Multi-Physics Corpus**: Native streaming and distributed loaders for 16 physical domains from *The Well* (NeurIPS 2024), covering fluid dynamics, astrophysics, acoustic scattering, viscoelasticity, and biological active matter.
* **Kontinua Cloud**: Auto-scaling NVIDIA Triton GPU inference endpoints, sub-50ms latency REST/gRPC APIs, managed domain fine-tuning pipelines, and private benchmark CI/CD.

---

## 🚀 Quickstart

### Installation

```bash
pip install kontinua
```

For benchmark evaluation and hardware acceleration:

```bash
pip install kontinua[benchmark,gpu]
```

### 1. Run Local Neural Surrogate Inference

```python
import torch
from kontinua.core.models import CNextUNet
from kontinua.core.data import WellDataset

# Load pre-trained surrogate checkpoint
model = CNextUNet.from_pretrained("kontinua/cnext-unet-turbulence")
model.eval()

# Load initial condition / boundary states
dataset = WellDataset(well_base_path="./data", well_dataset_name="turbulence", well_split_name="test")
sample = dataset[0]["input"].unsqueeze(0)

# Generate 100-step spatiotemporal prediction in milliseconds
with torch.no_grad():
    prediction = model(sample)

print(f"Prediction shape: {prediction.shape}")
```

### 2. Connect to Kontinua Cloud API

```python
import kontinua

# Authenticate with your Kontinua Cloud API key
client = kontinua.Client(api_key="ko_live_...")

# Execute cloud inference on managed Triton GPU cluster
result = client.predict(
    domain="turbulence",
    input_path="./boundary_condition.hdf5",
    model="cnext-unet-v2",
    rollout_steps=100
)

print(f"VRMSE: {result.vrmse:.4f} | Latency: {result.latency_ms}ms")
result.export("./output_rollout.hdf5")
```

---

## 🏗️ Model Zoo & Benchmark Baselines

| Model | Architecture Type | Top Domains | Typical Latency (p95) |
| :--- | :--- | :--- | :--- |
| **CNextU-Net** | Modernized ConvNeXt U-Net | Turbulence, Compressible Euler, Active Matter | **47ms** |
| **FNO** | Fourier Neural Operator | Helmholtz Scattering, MHD, Thermal Convection | **31ms** |
| **TFNO** | Tucker-Factorized FNO | Shear Flow, Rayleigh-Bénard Convection | **28ms** |
| **AViT** | Attention Vision Transformer | Supernova Explosions, Neutron Star Mergers | **89ms** |
| **AFNO** | Adaptive Fourier Neural Operator | Viscoelastic Instabilities, Convective Envelopes | **35ms** |
| **DilatedResNet** | Dilated Residual Network | Acoustic Scattering, Gray-Scott Reaction-Diffusion | **22ms** |

---

## 🌐 Open-Core vs. Kontinua Cloud

| Feature | Open-Source Core (`kontinua`) | Kontinua Cloud (Managed Platform) |
| :--- | :---: | :---: |
| **License** | **Apache 2.0 (Free Forever)** | **Commercial SaaS & Enterprise** |
| **Compute Execution** | Local CPU / Self-Hosted GPU | Auto-Scaling H100/L4 Triton Cluster |
| **Pre-Trained 2D Weights** | ✅ Included (Hugging Face) | ✅ Included (Auto-Updated) |
| **High-Res 3D Foundation Models** | ❌ (Manual Training) | ✅ Pre-trained & Served via API |
| **Managed Fine-Tuning** | ❌ (Run your own cluster) | ✅ 1-Click Fine-Tuning Pipeline |
| **Inference Latency** | Hardware dependent | Sub-50ms p95 global SLA |
| **Private Benchmark CI/CD** | ❌ | ✅ Automated regression testing |
| **Team RBAC & SOC 2 Compliance** | ❌ | ✅ Enterprise Ready |

---

## 🔬 Dataset & Scientific Citation

Kontinua is built on the 15TB *The Well* benchmark published at NeurIPS 2024 by Polymathic AI in collaboration with the Flatiron Institute, Cambridge, NYU, Princeton, UC Berkeley, Los Alamos, and Cornell.

```bibtex
@article{ohana2024well,
  title={The Well: A Large-Scale Collection of Diverse Physics Simulations for Machine Learning},
  author={Ohana, Ruben and McCabe, Michael and Meyer, Lucas and Morel, Rudy and Agocs, Fruzsina and Beneitez, Miguel and Berger, Marsha and Burkhart, Blakesly and Dalziel, Stuart and Fielding, Drummond and others},
  journal={Advances in Neural Information Processing Systems (NeurIPS)},
  volume={37},
  pages={44989--45037},
  year={2024}
}
```

---

## 📄 License & Community

* **Open-Source Core**: Licensed under the [Apache-2.0 License](LICENSE).
* **Documentation**: [docs.kontinua.ai](https://docs.kontinua.ai)
* **Cloud Platform**: [kontinua.ai](https://kontinua.ai)
* **Community**: Join our [Discord](https://discord.gg/kontinua) or [GitHub Discussions](https://github.com/KontinuaAI/kontinua/discussions).
