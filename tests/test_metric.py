import torch

from kontinua.benchmark.metrics.spatial import MSE, NMSE, NRMSE, RMSE, VMSE, VRMSE
from kontinua.data.datasets import WellMetadata


def test_distance_to_itself():
    meta = WellMetadata(
        dataset_name="test",
        n_spatial_dims=1,
        spatial_resolution=(128,),
        scalar_names=[],
        constant_scalar_names=[],
        field_names={0: ["test"]},
        constant_field_names={},
        boundary_condition_types=["periodic"],
        n_files=1,
        n_trajectories_per_file=[10],
        n_steps_per_trajectory=[100],
    )
    for metric in [
        MSE(),
        RMSE(),
        NRMSE(),
        NMSE(),
        #    binned_spectral_mse
    ]:
        x = torch.tensor([1.0, 2.0, 3.0]).unsqueeze(-1)
        error = metric(x, x, meta)
        assert torch.allclose(error.nansum(), torch.tensor(0.0))


def test_variance_scaled_metrics_propagate_eps():
    meta = WellMetadata(
        dataset_name="test",
        n_spatial_dims=1,
        spatial_resolution=(128,),
        scalar_names=[],
        constant_scalar_names=[],
        field_names={0: ["test"]},
        constant_field_names={},
        boundary_condition_types=["periodic"],
        n_files=1,
        n_trajectories_per_file=[10],
        n_steps_per_trajectory=[100],
    )
    # Constant target: the variance is zero, so the result is dominated by
    # the eps term in the denominator and must therefore depend on eps.
    y = torch.full((128, 1), 3.0)
    x = y + 1.0
    for metric_cls, reference_cls in [(VMSE, NMSE), (VRMSE, NRMSE)]:
        default_eps = metric_cls.eval(x, y, meta)
        large_eps = metric_cls.eval(x, y, meta, eps=10.0)
        assert not torch.allclose(default_eps, large_eps)
        assert torch.allclose(
            large_eps, reference_cls.eval(x, y, meta, eps=10.0, norm_mode="std")
        )
