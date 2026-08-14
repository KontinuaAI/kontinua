

# Kontinua: The Open-Source Foundation for Physics AI

**1,000× Faster than Traditional Solvers.**

Welcome to **Kontinua**, the definitive open-source SDK and managed cloud platform for training, benchmarking, and deploying foundation models for physics. 

Kontinua combines state-of-the-art neural PDE operators (FNO, CNextU-Net, AViT) with a managed low-latency GPU cloud. Train locally on your hardware with our Apache 2.0 open-source code on 15TB of curated, analysis-ready simulation data across 16 physical domains, or scale to millisecond multi-physics inference with Kontinua Cloud.

> **Academic Origins**: Kontinua's 15TB dataset is powered by **The Well**, originally developed by the [Polymathic AI](https://polymathic-ai.org/) organization. We are proud to build upon their open-source research and dual-license our SDK under the Apache 2.0 license.

<div class="sim-card">
  <div class="sim-card__header">
    <div class="sim-card__meta">
      <span class="sim-pill sim-pill--active">Compressible Turbulence · 2D Vorticity Field ($\omega$)</span>
      <span class="sim-pill">Resolution: 512×512</span>
      <span class="sim-pill sim-pill--gold">VRMSE: 0.021 (SOTA)</span>
    </div>
    <div class="sim-card__controls">
      <button class="btn--ghost" id="sim-play-toggle">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" id="sim-play-icon"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        <span id="sim-play-text">Pause Rollout</span>
      </button>
      <button class="btn--ghost" id="sim-reset-btn">Reset Step</button>
    </div>
  </div>

  <div class="sim-display">
    <div class="sim-view">
      <div class="sim-view__tag sim-view__tag--hpc">Traditional HPC Solver (Navier-Stokes)</div>
      <canvas class="sim-canvas" id="canvasHPC" width="400" height="240"></canvas>
      <div class="sim-view__footer">
        <span>Compute Time: <strong>48.2 Hours</strong></span>
        <span>Cost: <strong>$145.00 (64 CPU cores)</strong></span>
      </div>
    </div>

    <div class="sim-divider" aria-hidden="true">
      <span class="sim-divider__vs">VS</span>
    </div>

    <div class="sim-view sim-view--ai">
      <div class="sim-view__tag sim-view__tag--ai">Kontinua Neural Surrogate (CNextU-Net)</div>
      <canvas class="sim-canvas" id="canvasAI" width="400" height="240"></canvas>
      <div class="sim-view__footer">
        <span>Inference Time: <strong class="tok-best">47 Milliseconds</strong></span>
        <span>Cost: <strong class="tok-best">$0.01 / prediction</strong></span>
      </div>
    </div>
  </div>

  <div class="sim-timeline">
    <label for="sim-scrubber" class="sim-timeline__label">Rollout Timeline: <span id="sim-step-val">Step t=42 / 100</span></label>
    <input type="range" min="0" max="100" value="42" class="sim-scrubber" id="sim-scrubber" />
  </div>
</div>

## Using the Kontinua SDK

Once the Kontinua package is installed, you can effortlessly load our curated datasets into your PyTorch training pipelines.

```python
from kontinua.data import WellDataset
from torch.utils.data import DataLoader

trainset = WellDataset(
    well_base_path="path/to/base",
    well_dataset_name="name_of_the_dataset",
    well_split_name="train"
)
train_loader = DataLoader(trainset)

for batch in train_loader:
    ...
```

For more information regarding the interface, please refer to the [API](./api.md) and the [tutorials](./tutorials/dataset).

### Installation

We recommend creating a new Python (>=3.10) environment to install Kontinua.

```bash
python -m venv path/to/env
source path/to/env/activate/bin
```

#### From PyPI

The Kontinua package can be installed directly from PyPI.

```bash
pip install kontinua
```

#### From Source

It can also be installed from source. For this, clone the [repository](https://github.com/KontinuaAI/kontinua) and install the package with its dependencies.

```bash
git clone https://github.com/KontinuaAI/kontinua
cd kontinua
pip install .
```

Depending on your acceleration hardware, you can specify `--extra-index-url` to install the relevant PyTorch version. For example, use:

```bash
pip install . --extra-index-url https://download.pytorch.org/whl/cu121
```

#### Surrogate Modeling Dependencies

If you want to run the model training benchmarks, install the additional dependencies:

```bash
pip install kontinua[benchmark]
```

### Downloading the Data

The datasets range between 6.9GB and 5.1TB of data each, for a total of 15TB for the full collection. Ensure that your system has enough free disk space.

Once `kontinua` is installed, you can use the CLI to download any domain dataset.

```bash
kontinua-download --base-path path/to/base --dataset active_matter --split train
```

### Streaming from Hugging Face

Most of the datasets are also hosted on [Hugging Face](https://huggingface.co/KontinuaAI). Data can be streamed directly from the hub using the following code.

```python
from kontinua.data import WellDataset
from torch.utils.data import DataLoader

# The following line may take a couple of minutes to instantiate the datamodule
trainset = WellDataset(
    well_base_path="hf://datasets/KontinuaAI/",  # access from HF hub
    well_dataset_name="active_matter",
    well_split_name="train",
)
train_loader = DataLoader(trainset)
```

## Surrogate Modeling & Training

The repository provides tools for training foundation models and surrogate architectures on the different physical domains. State-of-the-art models are implemented in [`models`](https://github.com/KontinuaAI/kontinua/tree/master/kontinua/benchmark/models), while [dataset classes](https://github.com/KontinuaAI/kontinua/tree/master/kontinua/data) handle the raw data.

The training framework uses [hydra](https://hydra.cc/) to instantiate various classes (e.g., dataset, model, optimizer) from [configuration files](https://github.com/KontinuaAI/kontinua/tree/master/kontinua/benchmark/configs).

For instance, to run the training script of the default FNO architecture on the active matter dataset:

```bash
cd kontinua/benchmark
python train.py experiment=fno server=local data=active_matter
```

## ⚡ Kontinua Cloud (Managed Platform)

While the SDK provides everything you need to train models locally, **Kontinua Cloud** takes physics AI to production. Our managed platform offers:
- **Serverless Fine-tuning**: Train foundation models on our distributed GPU clusters.
- **REST API Inference**: Deploy trained surrogate models and run inference via secure REST API endpoints.
- **Data Integration**: Connect your proprietary simulation data seamlessly.

[Sign up for the Kontinua Cloud Waitlist](https://kontinua-ai.com) or read our [Cloud Documentation](./cloud_overview.md).

## Academic Citation

If you find the underlying 15TB dataset useful for your academic research, please consider citing the original paper by Polymathic AI:

```bibtex
@article{ohana2024well,
  title={The well: a large-scale collection of diverse physics simulations for machine learning},
  author={Ohana, Ruben and McCabe, Michael and Meyer, Lucas and Morel, Rudy and Agocs, Fruzsina and Beneitez, Miguel and Berger, Marsha and Burkhart, Blakesly and Dalziel, Stuart and Fielding, Drummond and others},
  journal={Advances in Neural Information Processing Systems},
  volume={37},
  pages={44989--45037},
  year={2024}
}
```

## Useful Links

- :fontawesome-brands-github: The Kontinua repository on [GitHub](https://github.com/KontinuaAI/kontinua)
- :hugging: Hosted Weights and Data on [Hugging Face](https://huggingface.co/KontinuaAI)
- :cloud: [Kontinua Cloud Platform](https://kontinua-ai.com)
