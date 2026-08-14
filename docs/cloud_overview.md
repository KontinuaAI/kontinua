# Kontinua Cloud Platform

**Kontinua Cloud** is the fully-managed enterprise platform that takes physics AI from local research into production. While the open-source SDK allows you to train and evaluate models locally, Kontinua Cloud handles the scale, orchestration, and serving of massive foundation models for the physical sciences.

## Key Features

- **Serverless Fine-tuning**: Train complex surrogate architectures (like FNOs, GNNs, and ViTs) on our distributed GPU clusters without worrying about Slurm, CUDA drivers, or dependency hell.
- **REST API Inference**: Deploy your trained models instantaneously. We host the endpoints so you can integrate physics predictions directly into your enterprise software stacks.
- **Proprietary Data Integration**: Connect your own simulation data to fine-tune our foundation models for your specialized use cases.

## Getting Started

Kontinua Cloud is currently available in Private Beta. 

> [!NOTE]
> Join the waitlist at **[kontinua-ai.com](https://kontinua-ai.com)** to get early access to our managed platform and API credits!

Once you receive your API key, you can deploy models via the REST API or the Kontinua CLI:

```bash
# Example: Deploying a trained FNO model to Kontinua Cloud
kontinua-deploy --model my-trained-fno --api-key $KONTINUA_API_KEY
```

## API Documentation (Coming Soon)

Full documentation for the Kontinua Cloud REST API and managed endpoints will be published here as we move closer to General Availability.
