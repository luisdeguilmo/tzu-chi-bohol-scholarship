<?php

namespace App\Services;

use App\Models\AllowanceSettingsModel;

class AllowanceService
{
    public function calculate($renderedHours): array
    {
        $model = new AllowanceSettingsModel();
        $allowanceSettings = $model->getMaximumHoursAndAmountPerHour();

        $maximumHours = $allowanceSettings['maximum_hours'];
        $amountPerHour = $allowanceSettings['amount_per_hour'];

        $allowance = 0.0;
        $newRenderedHours = 0.0;

        if ($renderedHours >= $maximumHours) {
            $allowance = $maximumHours * $amountPerHour;
            $newRenderedHours = $renderedHours - $maximumHours;
        } else {
            $allowance = $renderedHours * $amountPerHour;
            $newRenderedHours = 0;
        }

        return [$allowance, $newRenderedHours];
    }
}

?>
